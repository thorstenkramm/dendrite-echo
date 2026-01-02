export type ThemePreference = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'dendrite-echo-theme'

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

function isValidTheme(value: string | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'auto'
}

export function getStoredTheme(): ThemePreference {
  if (!isBrowser) return 'auto'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isValidTheme(stored) ? stored : 'auto'
}

export function resolveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'auto') {
    return preference
  }

  if (isBrowser && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  return 'light'
}

export function applyTheme(preference: ThemePreference): void {
  if (!isBrowser) return

  const resolved = resolveTheme(preference)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  window.localStorage.setItem(STORAGE_KEY, preference)
}
