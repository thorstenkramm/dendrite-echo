<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import SettingsMenu from '@/components/SettingsMenu.vue'
import { useUiStore } from '@/stores/useUiStore'

const router = useRouter()
const route = useRoute()
const uiStore = useUiStore()

const tabs = [
  { label: 'Dashboard', path: '/dashboard', dataCy: 'tab-dashboard' },
  { label: 'Files', path: '/files', dataCy: 'tab-files' },
  { label: 'Commands', path: '/commands', dataCy: 'tab-commands' },
  { label: 'Console', path: '/console', dataCy: 'tab-console' },
  { label: 'Monitoring', path: '/monitoring', dataCy: 'tab-monitoring' },
]

function handleTabClick(path: string): void {
  if (path === '/dashboard' && route.path === '/dashboard') {
    uiStore.markDashboardOpen()
    return
  }

  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b bg-card/70 backdrop-blur">
      <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <nav class="flex flex-wrap items-center gap-2">
          <Button
            v-for="tab in tabs"
            :key="tab.path"
            size="sm"
            :variant="route.path === tab.path ? 'secondary' : 'ghost'"
            :data-cy="tab.dataCy"
            :aria-current="route.path === tab.path ? 'page' : undefined"
            @click="handleTabClick(tab.path)"
          >
            {{ tab.label }}
          </Button>
        </nav>

        <SettingsMenu />
      </div>
    </header>

    <main class="mx-auto w-full max-w-6xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
