import { ref, watch } from 'vue'
import posthog from 'posthog-js'

export function useWorkout() {
  
  const getOrCreateDistinctId = () => {
    try {
      let id = localStorage.getItem("ph_distinct_id")
      if (!id) {
        id = crypto.randomUUID() // Генерує унікальний UUID типу '123e4567-e89b...'
        localStorage.setItem("ph_distinct_id", id)
      }
      return id
    } catch (e) {
      return "backup-student-id"
    }
  }


  const loadData = (key) => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      console.error(`Помилка читання ${key}:`, e)
      return []
    }
  }

  const history = ref(loadData('workout-history'))
  const plan = ref(loadData('workout-plan'))
  
  // РЕАКТИВНИЙ ПРАПОРЕЦЬ ДЛЯ ІНТЕРФЕЙСУ
  const showCardioFilter = ref(false)

  const categorySettings = {
    Силові: ['weight', 'reps'],
    Кардіо: ['distance', 'duration'],
    Стрейчинг: ['duration']
  }

  const getLastResult = (name) => {
    if (!name) return null
    return [...history.value].reverse().find((entry) => entry.exercise === name)
  }

  const addToPlan = (name, category, results) => {
    if (!name || !category) return
    plan.value.push({
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      fields: categorySettings[category],
      plannedResults: { ...results }
    })
    posthog.capture('exercise_added', {
      exercise_name: name.trim(),
      category: category.trim(),
      plan_length: plan.value.length
    })
  }

  const updatePlanItem = (id, name, category, results) => {
    const index = plan.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      const oldItem = { ...plan.value[index] }

      plan.value[index] = {
        ...plan.value[index],
        name: name.trim(),
        category: category.trim(),
        fields: categorySettings[category],
        plannedResults: { ...results }
      }
    
      posthog.capture('exercise_edited', {
        exercise_id: id,
        category: category.trim(),
        is_name_changed: oldItem.name !== name.trim(),
        is_category_changed: oldItem.category !== category.trim()
      })
    }
  }

  const completeExercise = (planId) => {
    const item = plan.value.find((i) => i.id === planId)
    if (item) {
      history.value.push({
        id: Date.now(),
        exercise: item.name,
        date: new Date().toISOString(),
        results: { ...item.plannedResults }
      })
      plan.value = plan.value.filter((i) => i.id !== planId)

      posthog.capture('exercise_logged_to_history', {
        exercise_name: item.name,
        category: item.category,
        total_history_count: history.value.length
      })
    }
  }

  // АВТОМАТИЧНА ІДЕНТИФІКАЦІЯ ТА СЛУХАЧ FEATURE FLAGS
  const userId = getOrCreateDistinctId()
  
  // Кажемо серверу PostHog, хто ми, ЩОБ ВІН ВІДДАВ НАМ ПРАПОРЦІ
  posthog.identify(userId)
  posthog.reloadFeatureFlags()
  // БЕЗПЕЧНА СИНХРОНІЗАЦІЯ З СЕРВЕРОМ POSTHOG
  posthog.onFeatureFlags(() => {
    // Перевіряємо статус прапорця в PostHog і записуємо результат у змінну (true або false)
    showCardioFilter.value = !!posthog.isFeatureEnabled('show-cardio-filter')
    
    if (showCardioFilter.value) {
      posthog.capture('feature_flag_displayed', { flag_key: 'show-cardio-filter' })
    }
  })

  watch(
    [plan, history],
    ([newPlan, newHistory]) => {
      localStorage.setItem('workout-plan', JSON.stringify(newPlan))
      localStorage.setItem('workout-history', JSON.stringify(newHistory))
    },
    { deep: true }
  )

  return {
    plan,
    addToPlan,
    updatePlanItem,
    completeExercise,
    getLastResult,
    history,
    categorySettings,
    showCardioFilter // Обов'язково віддаємо прапорець назовні для App.vue
  }
}