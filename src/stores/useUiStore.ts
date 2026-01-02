import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { applyTheme, getStoredTheme, resolveTheme, type ThemePreference } from '@/lib/theme'

export const useUiStore = defineStore('ui', () => {
  const themePreference = ref<ThemePreference>(getStoredTheme())
  const resolvedTheme = computed(() => resolveTheme(themePreference.value))
  const dashboardOpenToken = ref(0)

  function setTheme(preference: ThemePreference): void {
    themePreference.value = preference
    applyTheme(preference)
  }

  function markDashboardOpen(): void {
    dashboardOpenToken.value += 1
  }

  return {
    themePreference,
    resolvedTheme,
    dashboardOpenToken,
    setTheme,
    markDashboardOpen,
  }
})
