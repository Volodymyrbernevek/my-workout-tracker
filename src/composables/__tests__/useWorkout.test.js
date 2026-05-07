// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWorkout } from '../useWorkouts'
import { nextTick } from 'vue'

describe('useWorkout composable', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('повинен ініціалізувати порожні масиви plan та history за замовчуванням', () => {
    const { plan, history } = useWorkout()
    expect(plan.value).toEqual([])
    expect(history.value).toEqual([])
  })

  it('addToPlan: повинен коректно додавати вправу до плану з потрібними полями', () => {
    const { plan, addToPlan } = useWorkout()
    addToPlan('Присідання', 'Силові', { weight: 50, reps: 10 })

    expect(plan.value.length).toBe(1)
    expect(plan.value[0].name).toBe('Присідання')
    expect(plan.value[0].category).toBe('Силові')
    expect(plan.value[0].plannedResults).toEqual({ weight: 50, reps: 10 })
  })

  it('addToPlan: не повинен додавати вправу, якщо назва або категорія порожні', () => {
    const { plan, addToPlan } = useWorkout()
    addToPlan('', 'Силові', { weight: 50 })
    addToPlan('Біг', '', { distance: 5 })

    expect(plan.value.length).toBe(0)
  })

  it('updatePlanItem: повинен оновлювати параметри існуючої вправи у плані', () => {
    const { plan, addToPlan, updatePlanItem } = useWorkout()
    addToPlan('Присідання', 'Силові', { weight: 50, reps: 10 })
    const itemId = plan.value[0].id

    updatePlanItem(itemId, 'Важкі присідання', 'Силові', {
      weight: 60,
      reps: 8
    })

    expect(plan.value[0].name).toBe('Важкі присідання')
    expect(plan.value[0].plannedResults.weight).toBe(60)
    expect(plan.value[0].plannedResults.reps).toBe(8)
  })

  it('completeExercise: повинен переносити вправу з плану в історію', () => {
    const { plan, history, addToPlan, completeExercise } = useWorkout()
    addToPlan('Біг', 'Кардіо', { distance: 5, duration: 30 })
    const itemId = plan.value[0].id

    completeExercise(itemId)

    expect(plan.value.length).toBe(0)
    expect(history.value.length).toBe(1)
    expect(history.value[0].exercise).toBe('Біг')
    expect(history.value[0].results.distance).toBe(5)
    expect(history.value[0].date).toBeDefined()
  })

  it('getLastResult: повинен знаходити останній запит вправи в історії', () => {
    const { history, getLastResult } = useWorkout()

    history.value = [
      {
        id: 1,
        exercise: 'Присідання',
        date: '2026-05-05T10:00:00.000Z',
        results: { weight: 40, reps: 12 }
      },
      {
        id: 2,
        exercise: 'Біг',
        date: '2026-05-05T11:00:00.000Z',
        results: { distance: 3 }
      },
      {
        id: 3,
        exercise: 'Присідання',
        date: '2026-05-06T10:00:00.000Z',
        results: { weight: 50, reps: 10 }
      }
    ]

    const lastResult = getLastResult('Присідання')
    expect(lastResult.id).toBe(3)
    expect(lastResult.results.weight).toBe(50)
  })

  it('watch: повинен зберігати дані в localStorage при зміні plan', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const { addToPlan } = useWorkout()

    addToPlan('Розтяжка', 'Стрейчинг', { duration: 15 })

    await nextTick()

    expect(setItemSpy).toHaveBeenCalledWith('workout-plan', expect.any(String))
  })
})
