<script setup lang="ts">
import { computed } from 'vue'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApi, api } from '@/composables/useApi'
import type { PingResponse } from '@/types/api'

const {
  data,
  error,
  isLoading,
  execute: pingApi,
} = useApi<PingResponse>(() => api.get('/ping'))

const formattedResponse = computed(() =>
  data.value ? JSON.stringify(data.value, null, 2) : null
)
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-background p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-3xl font-bold">dendrite-echo</CardTitle>
        <CardDescription>
          Vue 3 frontend for dendrite-pulse
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4 text-center">
        <p class="text-muted-foreground">
          Setup complete. Your development environment is ready.
        </p>
        <div class="flex justify-center">
          <Button :disabled="isLoading" @click="pingApi">
            {{ isLoading ? 'Pinging...' : 'API Ping' }}
          </Button>
        </div>
        <div v-if="formattedResponse" class="text-left">
          <p class="text-xs uppercase tracking-wide text-muted-foreground">
            API Response
          </p>
          <pre class="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground"><code>{{ formattedResponse }}</code></pre>
        </div>
        <div v-else-if="error" class="text-left">
          <p class="text-xs uppercase tracking-wide text-destructive">
            API Error
          </p>
          <pre class="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground"><code>{{ error }}</code></pre>
        </div>
      </CardContent>
    </Card>
  </main>
</template>
