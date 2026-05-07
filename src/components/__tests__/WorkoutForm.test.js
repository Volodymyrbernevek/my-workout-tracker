// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import WorkoutForm from '../WorkoutForm.vue'

describe('WorkoutForm.vue', () => {
  const categorySettings = {
    Силові: ['weight', 'reps'],
    Кардіо: ['distance', 'duration']
  }

  const defaultProps = {
    editingId: null,
    category: '',
    name: '',
    form: { weight: 0, reps: 0, distance: 0, duration: 0 },
    categorySettings,
    pastData: null
  }

  it('відображає правильний заголовок залежно від режиму створення/редагування', () => {
    const wrapper = mount(WorkoutForm, { props: defaultProps })
    expect(wrapper.find('h2').text()).toBe('Нова вправа')

    const editWrapper = mount(WorkoutForm, {
      props: { ...defaultProps, editingId: 99 }
    })
    expect(editWrapper.find('h2').text()).toBe('Редагувати вправу')
  })

  it('активує поля введення після вибору категорії', () => {
    const wrapper = mount(WorkoutForm, {
      props: { ...defaultProps, category: 'Силові' }
    })
    const labels = wrapper.findAll('.form-fields label')
    expect(labels[0].text()).toBe('Вага (кг)')
    expect(labels[1].text()).toBe('Повторення')
  })

  it('блокує кнопку додавання, якщо назва або категорія не вказані', () => {
    const wrapper = mount(WorkoutForm, { props: defaultProps })
    expect(wrapper.find('.add-plan-btn').element.disabled).toBe(true)
  })

  it('генерує подію "confirm" при кліку на активну кнопку додавання', async () => {
    const wrapper = mount(WorkoutForm, {
      props: { ...defaultProps, name: 'Присідання', category: 'Силові' }
    })
    await wrapper.find('.add-plan-btn').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('confirm')
  })
})
