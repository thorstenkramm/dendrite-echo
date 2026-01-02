import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useUiStore } from '@/stores/useUiStore'
import { cleanupBrowserMocks, setupBrowserMocks } from './setup/browser-mocks'

describe('useUiStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setupBrowserMocks()
  })

  afterEach(() => {
    cleanupBrowserMocks()
  })

  it('initializes with auto theme by default', () => {
    const store = useUiStore()

    expect(store.themePreference).toBe('auto')
  })

  it('setTheme updates themePreference', () => {
    const store = useUiStore()

    store.setTheme('dark')

    expect(store.themePreference).toBe('dark')
  })

  it('setTheme persists to localStorage', () => {
    const store = useUiStore()

    store.setTheme('light')

    expect(localStorage.setItem).toHaveBeenCalledWith('dendrite-echo-theme', 'light')
  })

  it('markDashboardOpen increments token', () => {
    const store = useUiStore()
    const initialToken = store.dashboardOpenToken

    store.markDashboardOpen()

    expect(store.dashboardOpenToken).toBe(initialToken + 1)
  })

  it('resolvedTheme returns preference for non-auto values', () => {
    const store = useUiStore()

    store.setTheme('dark')

    expect(store.resolvedTheme).toBe('dark')
  })
})
