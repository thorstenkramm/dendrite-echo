/**
 * Composable wrapper around the API service for reactive state management.
 *
 * Provides reactive loading and error state for API calls in Vue components.
 * Use this in components when you need reactive UI state.
 * Use the api service directly in Pinia stores or utility functions.
 */

import { ref, type Ref } from 'vue'
import { api } from '@/lib/api'
import { ApiError } from '@/types/api'

export interface UseApiReturn<T> {
  /** The response data, null if not yet loaded or on error */
  data: Ref<T | null>
  /** Error message if the request failed */
  error: Ref<string | null>
  /** Whether a request is in progress */
  isLoading: Ref<boolean>
  /** Execute the API call */
  execute: () => Promise<T | null>
  /** Reset state to initial values */
  reset: () => void
}

export interface UseApiOptions {
  /** Execute the request immediately on composable creation */
  immediate?: boolean
}

/**
 * Create a reactive wrapper for an API call.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useApi } from '@/composables/useApi'
 * import type { PingResponse } from '@/types/api'
 *
 * const { data, error, isLoading, execute } = useApi<PingResponse>(
 *   () => api.get('/ping')
 * )
 * </script>
 *
 * <template>
 *   <button :disabled="isLoading" @click="execute">Ping</button>
 *   <div v-if="error">{{ error }}</div>
 *   <div v-else-if="data">{{ data.data.attributes.message }}</div>
 * </template>
 * ```
 */
export function useApi<T>(
  fetcher: () => Promise<T>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  async function execute(): Promise<T | null> {
    isLoading.value = true
    error.value = null

    try {
      const result = await fetcher()
      data.value = result
      return result
    } catch (err) {
      if (err instanceof ApiError) {
        error.value = err.message
      } else if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred'
      }
      data.value = null
      return null
    } finally {
      isLoading.value = false
    }
  }

  function reset(): void {
    data.value = null
    error.value = null
    isLoading.value = false
  }

  if (options.immediate) {
    execute()
  }

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  }
}

/**
 * Re-export api for convenience when importing useApi.
 */
export { api }
