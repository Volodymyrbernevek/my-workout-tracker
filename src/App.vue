<template>
  <div class="workout-app">
    <AppHeader />

    <section class="add-action">
      <button
        v-if="!isCreating"
        class="main-add-btn"
        @click="isCreating = true"
      >
        + Додати вправу до тренування
      </button>
    </section>

    <section v-if="isCreating" class="draft-zone">
      <WorkoutForm
        v-model:category="selectedCategory"
        v-model:name="exerciseName"
        :editing-id="editingId"
        :form="form"
        :category-settings="categorySettings"
        :past-data="pastData"
        @confirm="confirmAddToPlan"
        @cancel="cancelCreation"
      >
        <template #past-data>
          <span v-if="pastData.results.weight > 0"
            >{{ pastData.results.weight }}кг
          </span>
          <span v-if="pastData.results.reps > 0"
            >x {{ pastData.results.reps }}</span
          >
          <span v-if="pastData.results.distance > 0"
            >{{ pastData.results.distance }}км
          </span>
          <span v-if="pastData.results.duration > 0"
            >/ {{ pastData.results.duration }}хв</span
          >
        </template>
      </WorkoutForm>
    </section>

    <section class="plan-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0;">📍 Потрібно виконати (натисніть для редагування)</h3>
        
        <button v-show="showCardioFilter" style="padding: 6px 12px; background: #42b883; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
          Тільки Кардіо 🏃‍♂️
        </button>
      </div>
      
      <div v-if="plan.length === 0" class="empty">План порожній.</div>
      <div class="plan-grid">
        <PlanItem
          v-for="item in plan"
          :key="item.id"
          :item="item"
          @edit="startEditing"
          @complete="completeExercise"
        />
      </div>
    </section>

    <section class="history-section">
      <h3>✔️ Завершено сьогодні</h3>
      <div v-if="todaysHistory.length === 0" class="empty">
        Сьогодні ще нічого не зроблено
      </div>
      <HistoryItem v-for="item in todaysHistory" :key="item.id" :item="item" />
    </section>
    <button class="main-add-btn" style="border-color: red; color: red;" @click="throwWorkoutError">
      💥 Зламати трекер (Тест Sentry)
    </button>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

import { useWorkout } from './composables/useWorkouts'

import AppHeader from './components/AppHeader.vue'
import WorkoutForm from './components/WorkoutForm.vue'
import PlanItem from './components/PlanItem.vue'
import HistoryItem from './components/HistoryItem.vue'
import * as Sentry from '@sentry/vue'

const {
  plan,
  addToPlan,
  updatePlanItem,
  completeExercise,
  history,
  categorySettings,
  getLastResult,
  showCardioFilter,
} = useWorkout()

const isCreating = ref(false)
const editingId = ref(null)
const selectedCategory = ref('')
const exerciseName = ref('')
const form = reactive({ weight: 0, reps: 0, distance: 0, duration: 0 })
const pastData = computed(() =>
  exerciseName.value ? getLastResult(exerciseName.value) : null
)

const throwWorkoutError = () => {
  const currentPlanCount = plan.value.length

  // Додаємо кастомну хлібну крихту для контексту розробника [cite: 1117]
  Sentry.addBreadcrumb({
    message: 'Користувач натиснув кнопку критичного тесту',
    category: 'user.action',
    data: { planCountBeforeCrash: currentPlanCount }
  })

  // Генеруємо виняток [cite: 1111]
  throw new Error("Sentry Test Error: На жаль, не вдалося зберегти поточну сесію тренування!")
}

const todaysHistory = computed(() => {
  const today = new Date().toLocaleDateString()
  return history.value
    .filter((h) => new Date(h.date).toLocaleDateString() === today)
    .reverse()
})

const resetForm = () => {
  Object.keys(form).forEach((k) => (form[k] = 0))
}

const startEditing = (item) => {
  editingId.value = item.id
  exerciseName.value = item.name
  selectedCategory.value = item.category
  Object.assign(form, item.plannedResults)
  isCreating.value = true
}

const cancelCreation = () => {
  isCreating.value = false
  editingId.value = null
  selectedCategory.value = ''
  exerciseName.value = ''
  resetForm()
}

const confirmAddToPlan = () => {
  if (editingId.value) {
    updatePlanItem(
      editingId.value,
      exerciseName.value,
      selectedCategory.value,
      form
    )
  } else {
    addToPlan(exerciseName.value, selectedCategory.value, form)
  }
  cancelCreation()
}
</script>

<style>
.workout-app {
  max-width: 500px;
  margin: 0 auto;
  font-family: sans-serif;
  padding: 40px;
}
.main-add-btn {
  width: 100%;
  padding: 15px;
  background: #fff;
  border: 2px dashed #42b883;
  color: #42b883;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.1em;
  margin-bottom: 25px;
  transition: 0.2s;
}
.main-add-btn:hover {
  background: #f0fdf4;
}
.history-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px dashed #ddd;
}
.empty {
  color: #999;
  font-style: italic;
}
</style>
