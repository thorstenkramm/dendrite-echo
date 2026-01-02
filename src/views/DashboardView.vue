<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { api, useApi } from '@/composables/useApi'
import { useUiStore } from '@/stores/useUiStore'
import type { PingResponse } from '@/types/api'

const uiStore = useUiStore()
const { data, error, isLoading, execute } = useApi<PingResponse>(() => api.get('/ping'))

const statusMessage = computed(() => {
  if (isLoading.value) {
    return 'Checking API connection...'
  }

  if (error.value) {
    return 'Unable to reach the API. Make sure the backend is running.'
  }

  if (data.value) {
    return `API reachable: ${data.value.data.attributes.message}.`
  }

  return 'API status pending.'
})

onMounted(() => {
  void execute()
})

watch(
  () => uiStore.dashboardOpenToken,
  () => {
    void execute()
  },
)
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-2xl">Dashboard</CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-muted-foreground" data-cy="coming-soon">coming soon</p>
    </CardContent>
    <CardFooter class="flex flex-col items-start gap-2 border-t pt-4">
      <span class="text-xs uppercase tracking-wide text-muted-foreground">
        API status
      </span>
      <p class="text-sm" data-cy="api-status">{{ statusMessage }}</p>
    </CardFooter>
  </Card>
</template>
