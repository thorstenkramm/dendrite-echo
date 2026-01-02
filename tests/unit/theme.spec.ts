import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { applyTheme, getStoredTheme, resolveTheme } from '@/lib/theme'
import { cleanupBrowserMocks, setupBrowserMocks } from './setup/browser-mocks'

describe('theme utilities', () => {
  beforeEach(() => {
    setupBrowserMocks()
    document.documentElement.classList.remove('dark')
  })

  afterEach(() => {
    cleanupBrowserMocks()
    document.documentElement.classList.remove('dark')
  })

  describe('getStoredTheme', () => {
    it('returns auto when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)

      expect(getStoredTheme()).toBe('auto')
    })

    it('returns stored value when valid', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark')

      expect(getStoredTheme()).toBe('dark')
    })

    it('returns auto for invalid stored value', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('invalid')

      expect(getStoredTheme()).toBe('auto')
    })
  })

  describe('resolveTheme', () => {
    it('returns light for light preference', () => {
      expect(resolveTheme('light')).toBe('light')
    })

    it('returns dark for dark preference', () => {
      expect(resolveTheme('dark')).toBe('dark')
    })

    it('returns light for auto when OS prefers light', () => {
      vi.mocked(matchMedia).mockReturnValue({ matches: false } as MediaQueryList)

      expect(resolveTheme('auto')).toBe('light')
    })

    it('returns dark for auto when OS prefers dark', () => {
      vi.mocked(matchMedia).mockReturnValue({ matches: true } as MediaQueryList)

      expect(resolveTheme('auto')).toBe('dark')
    })
  })

  describe('applyTheme', () => {
    it('adds dark class for dark theme', () => {
      applyTheme('dark')

      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('removes dark class for light theme', () => {
      document.documentElement.classList.add('dark')

      applyTheme('light')

      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('persists preference to localStorage', () => {
      applyTheme('dark')

      expect(localStorage.setItem).toHaveBeenCalledWith('dendrite-echo-theme', 'dark')
    })
  })
})
