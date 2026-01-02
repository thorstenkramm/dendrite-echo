import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import SettingsMenu from '@/components/SettingsMenu.vue'
import { cleanupBrowserMocks, setupBrowserMocks } from './setup/browser-mocks'

describe('SettingsMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setupBrowserMocks()
  })

  afterEach(() => {
    cleanupBrowserMocks()
  })

  it('renders the settings toggle button', () => {
    const wrapper = mount(SettingsMenu, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('[data-cy="settings-toggle"]').exists()).toBe(true)
  })

  it('has accessible label for settings button', () => {
    const wrapper = mount(SettingsMenu, {
      global: {
        plugins: [createPinia()],
      },
    })

    const button = wrapper.find('[data-cy="settings-toggle"]')
    expect(button.attributes('aria-label')).toBe('Open settings')
  })
})
