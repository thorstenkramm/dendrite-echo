import { vi } from 'vitest'

export function setupBrowserMocks(): void {
  vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockReturnValue(null),
    setItem: vi.fn(),
  })
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
}

export function cleanupBrowserMocks(): void {
  vi.unstubAllGlobals()
}
