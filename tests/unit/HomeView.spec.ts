import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import HomeView from '@/views/HomeView.vue'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('HomeView', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the API ping response', async () => {
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

    const wrapper = mount(HomeView)

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/v1/ping',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }),
      }),
    )
    expect(wrapper.text()).toContain('"message": "pong"')
  })
})
