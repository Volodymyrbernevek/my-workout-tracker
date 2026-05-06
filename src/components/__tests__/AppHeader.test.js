// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppHeader from '../AppHeader.vue'

describe('AppHeader.vue', () => {
  it('має коректно відмальовувати головний заголовок', () => {
    const wrapper = mount(AppHeader)
    expect(wrapper.find('h1').text()).toBe('My Training Tracker')
  })
})