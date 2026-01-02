import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, describe, expect, it, vi } from 'vitest'

import DashboardView from '@/views/DashboardView.vue'
import { useUiStore } from '@/stores/useUiStore'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('DashboardView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('pings the API on mount and on dashboard reselect', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: vi.fn().mockResolvedValue({
        data: {
          type: 'ping',
          id: 'ping',
          attributes: {
            message: 'pong',
          },
        },
      }),
      text: vi.fn(),
    })

    vi.stubGlobal('fetch', fetchMock)

    const pinia = createPinia()
    setActivePinia(pinia)

    const wrapper = mount(DashboardView, {
      global: {
        plugins: [pinia],
      },
    })

    await flushPromises()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const uiStore = useUiStore()
    uiStore.markDashboardOpen()

    await flushPromises()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(wrapper.text()).toContain('API reachable')
  })
})
