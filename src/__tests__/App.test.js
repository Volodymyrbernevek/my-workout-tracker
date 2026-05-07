// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../App.vue'
import WorkoutForm from '../components/WorkoutForm.vue'
import PlanItem from '../components/PlanItem.vue'
import HistoryItem from '../components/HistoryItem.vue'

describe('App.vue — Інтеграційне тестування інтерфейсу', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('має відображати початковий порожній стан програми при першому запуску', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('My Training Tracker')
    expect(wrapper.text()).toContain('План порожній.')
    expect(wrapper.text()).toContain('Сьогодні ще нічого не зроблено')
    expect(wrapper.findComponent(WorkoutForm).exists()).toBe(false)
  })

  it('має коректно відкривати та закривати форму додавання вправи', async () => {
    const wrapper = mount(App)

    await wrapper.find('.main-add-btn').trigger('click')
    expect(wrapper.findComponent(WorkoutForm).exists()).toBe(true)

    await wrapper.find('.cancel-btn').trigger('click')
    expect(wrapper.findComponent(WorkoutForm).exists()).toBe(false)
  })

  it('має успішно додавати нову силову вправу до плану', async () => {
    const wrapper = mount(App)

    await wrapper.find('.main-add-btn').trigger('click')
    const formComponent = wrapper.findComponent(WorkoutForm)

    await formComponent.find('select').setValue('Силові')
    await formComponent
      .find('input[type="text"]')
      .setValue('Присідання зі штангою')

    const numberInputs = formComponent.findAll('input[type="number"]')
    await numberInputs[0].setValue(80) // Вага (kg)
    await numberInputs[1].setValue(10) // Повторення (reps)

    await formComponent.find('.add-plan-btn').trigger('click')

    expect(wrapper.findComponent(WorkoutForm).exists()).toBe(false)
    expect(wrapper.findComponent(PlanItem).exists()).toBe(true)
    expect(wrapper.text()).toContain('Присідання зі штангою')
    expect(wrapper.text()).toContain('80кг x 10')
  })

  it('має переносити вправу до блоку історії при натисканні на "Виконано"', async () => {
    const mockPlan = [
      {
        id: 111,
        name: 'Біг',
        category: 'Кардіо',
        fields: ['distance', 'duration'],
        plannedResults: { distance: 5, duration: 25 }
      }
    ]
    localStorage.setItem('workout-plan', JSON.stringify(mockPlan))

    const wrapper = mount(App)

    expect(wrapper.findComponent(PlanItem).exists()).toBe(true)

    await wrapper.find('.mini-done-btn').trigger('click')

    expect(wrapper.findComponent(PlanItem).exists()).toBe(false)
    expect(wrapper.findComponent(HistoryItem).exists()).toBe(true)
    expect(wrapper.text()).toContain('Біг')
    expect(wrapper.text()).toContain('5км / 25хв')
  })

  it('має дозволяти редагувати параметри запланованої вправи', async () => {
    const mockPlan = [
      {
        id: 222,
        name: 'Планка',
        category: 'Стрейчинг',
        fields: ['duration'],
        plannedResults: { duration: 1 }
      }
    ]
    localStorage.setItem('workout-plan', JSON.stringify(mockPlan))

    const wrapper = mount(App)

    await wrapper.find('.plan-info').trigger('click')

    const formComponent = wrapper.findComponent(WorkoutForm)
    expect(formComponent.props('editingId')).toBe(222)
    expect(wrapper.text()).toContain('Редагувати вправу')

    await formComponent.find('input[type="number"]').setValue(3)
    await formComponent.find('.add-plan-btn').trigger('click')

    expect(wrapper.findComponent(PlanItem).text()).toContain('3хв')
  })

  it('має показувати підказку про останнє тренування, якщо така вправа є в історії', async () => {
    const mockHistory = [
      {
        id: 333,
        exercise: 'Жим лежачи',
        date: new Date().toISOString(),
        results: { weight: 100, reps: 5, distance: 0, duration: 0 }
      }
    ]
    localStorage.setItem('workout-history', JSON.stringify(mockHistory))

    const wrapper = mount(App)

    await wrapper.find('.main-add-btn').trigger('click')
    const formComponent = wrapper.findComponent(WorkoutForm)

    await formComponent.find('input[type="text"]').setValue('Жим лежачи')

    expect(wrapper.text()).toContain('💡 Твій останній результат:')
    expect(wrapper.text()).toContain('100кг x 5')
  })
})
