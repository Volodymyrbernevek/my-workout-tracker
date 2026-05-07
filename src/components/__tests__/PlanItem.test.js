// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PlanItem from '../PlanItem.vue'

describe('PlanItem.vue', () => {
  // Тестові дані
  const mockItem = {
    id: 42,
    name: 'Присідання',
    category: 'Силові',
    plannedResults: {
      weight: 60,
      reps: 12,
      distance: 0,
      duration: 0
    }
  }

  it('має коректно відображати назву вправи та її заплановані показники', () => {
    const wrapper = mount(PlanItem, {
      props: { item: mockItem }
    })

    expect(wrapper.text()).toContain('Присідання')
    expect(wrapper.text()).toContain('60кг')
    expect(wrapper.text()).toContain('12')
  })

  it('має викликати подію "complete" з ID вправи при натисканні на кнопку ✅', async () => {
    const wrapper = mount(PlanItem, {
      props: { item: mockItem }
    })

    const button = wrapper.find('.mini-done-btn')
    await button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('complete')
    expect(wrapper.emitted().complete[0]).toEqual([42])
  })

  it('має викликати подію "edit" при кліку на інформаційну частину картки', async () => {
    const wrapper = mount(PlanItem, {
      props: { item: mockItem }
    })

    const infoDiv = wrapper.find('.plan-info')
    await infoDiv.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('edit')
    expect(wrapper.emitted().edit[0]).toEqual([mockItem])
  })
})
