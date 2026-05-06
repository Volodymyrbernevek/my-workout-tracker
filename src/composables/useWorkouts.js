import { ref, watch } from 'vue'

export function useWorkout() {

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

  const categorySettings = {
    'Силові': ['weight', 'reps'],
    'Кардіо': ['distance', 'duration'],
    'Стрейчинг': ['duration']
  }

  const getLastResult = (name) => {
    if (!name) return null
    return [...history.value].reverse().find(entry => entry.exercise === name)
  }

  const addToPlan = (name, category, results) => {
    if (!name || !category) return
    plan.value.push({ 
      id: Date.now(),
      name: name.trim(),      // add .trim()
      category: category.trim(), // add .trim()
      fields: categorySettings[category],
      plannedResults: { ...results }
    })
  }

  const updatePlanItem = (id, name, category, results) => {
    const index = plan.value.findIndex(item => item.id === id)
    if (index !== -1) {
      plan.value[index] = {
        ...plan.value[index],
        name: name.trim(),      // add .trim()
        category: category.trim(), // add .trim()
        fields: categorySettings[category],
        plannedResults: { ...results }
      }
    }
  }

  const completeExercise = (planId) => {
    const item = plan.value.find(i => i.id === planId)
    if (item) {
      history.value.push({
        id: Date.now(),
        exercise: item.name,
        date: new Date().toISOString(),
        results: { ...item.plannedResults }
      })
      plan.value = plan.value.filter(i => i.id !== planId)
    }
  }

  watch([plan, history], ([newPlan, newHistory]) => {
    localStorage.setItem('workout-plan', JSON.stringify(newPlan))
    localStorage.setItem('workout-history', JSON.stringify(newHistory))
  }, { deep: true })

  return { 
    plan, 
    addToPlan, 
    updatePlanItem, 
    completeExercise, 
    getLastResult, 
    history, 
    categorySettings 
  }
}