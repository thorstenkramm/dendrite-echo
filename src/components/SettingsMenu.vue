<script setup lang="ts">
import { Settings, Check } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUiStore } from '@/stores/useUiStore'
import type { ThemePreference } from '@/lib/theme'

const uiStore = useUiStore()

const themeOptions: Array<{ label: string; value: ThemePreference; dataCy: string }> = [
  { label: 'Light', value: 'light', dataCy: 'theme-light' },
  { label: 'Dark', value: 'dark', dataCy: 'theme-dark' },
  { label: 'Auto', value: 'auto', dataCy: 'theme-auto' },
]

function selectTheme(preference: ThemePreference): void {
  uiStore.setTheme(preference)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open settings"
        data-cy="settings-toggle"
      >
        <Settings class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-40" data-cy="settings-menu">
      <DropdownMenuLabel>Theme</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="option in themeOptions"
        :key="option.value"
        :data-cy="option.dataCy"
        class="flex items-center justify-between"
        @click="selectTheme(option.value)"
      >
        {{ option.label }}
        <Check
          v-if="uiStore.themePreference === option.value"
          class="h-4 w-4"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
