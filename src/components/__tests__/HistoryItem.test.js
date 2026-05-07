// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import HistoryItem from '../HistoryItem.vue'

describe('HistoryItem.vue', () => {
  it('має відображати вагу та повторення для силових вправ', () => {
    const item = {
      exercise: 'Присідання',
      results: { weight: 50, reps: 10, distance: 0, duration: 0 }
    }
    const wrapper = mount(HistoryItem, { props: { item } })

    expect(wrapper.text()).toContain('Присідання')
    expect(wrapper.text()).toContain('50кг')
    expect(wrapper.text()).toContain('10')
    expect(wrapper.text()).toContain('ВИКОНАНО')
  })

  it('має відображати дистанцію та час для кардіо вправ', () => {
    const item = {
      exercise: 'Біг',
      results: { weight: 0, reps: 0, distance: 5, duration: 30 }
    }
    const wrapper = mount(HistoryItem, { props: { item } })

    expect(wrapper.text()).toContain('Біг')
    expect(wrapper.text()).toContain('5км')
    expect(wrapper.text()).toContain('30хв')
  })
})
