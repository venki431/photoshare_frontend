/**
 * useApi — composable for one-off API calls directly inside components.
 *
 * Use this when a component needs to call a service without
 * the result being shared app-wide through a store (e.g. a standalone
 * form submission or a detail fetch scoped to one component).
 *
 * For shared/global state always go through the Pinia stores instead.
 *
 * Usage:
 *
 *   const { loading, error, data, execute } = useApi()
 *
 *   // Simple execution
 *   await execute(() => projectService.getProject(id))
 *   console.log(data.value)
 *
 *   // With inline callback
 *   const { data: project } = await useApiOnce(() => projectService.getProject(id))
 */

import { ref } from 'vue'

// ─── Main composable ─────────────────────────────────────────────────────────

export function useApi() {
  const loading = ref(false)
  const error   = ref(null)
  const data    = ref(null)

  /**
   * Execute an async service call.
   * Manages loading/error state automatically.
   *
   * @param {() => Promise<{ success, data, message }>} fn   — service call
   * @param {{ onSuccess?, onError?, transform? }} options
   *   onSuccess(result)   — called with the response data on success
   *   onError(message)    — called with the error message on failure
   *   transform(d)        — map the raw data before storing it
   * @returns {Promise<any | null>}   resolved data, or null on error
   */
  async function execute(fn, options = {}) {
    loading.value = true
    error.value   = null

    try {
      const response = await fn()

      if (!response.success) {
        throw new Error(response.message || 'Request failed')
      }

      const result = options.transform ? options.transform(response.data) : response.data
      data.value   = result

      options.onSuccess?.(result)
      return result

    } catch (err) {
      const message  = err?.message || 'An unexpected error occurred'
      error.value    = message
      options.onError?.(message)
      return null

    } finally {
      loading.value = false
    }
  }

  function clearError() { error.value = null }
  function reset()      { loading.value = false; error.value = null; data.value = null }

  return { loading, error, data, execute, clearError, reset }
}

// ─── Variant: fire-and-forget with immediate execution ───────────────────────

/**
 * Executes a service call immediately and returns a reactive result.
 * Useful for setup() / <script setup> top-level fetches.
 *
 * const { data: projects, loading, error } = useApiOnce(
 *   () => projectService.getProjects()
 * )
 */
export function useApiOnce(fn, options = {}) {
  const api = useApi()
  api.execute(fn, options)  // fire immediately, don't await
  return api
}

// ─── Variant: paginated list ─────────────────────────────────────────────────

/**
 * Manages loading a paginated list with "load more" support.
 *
 * const { items, loading, error, loadMore, hasMore, reload } =
 *   usePaginatedApi((page) => projectService.getProjects({ page, perPage: 12 }))
 */
export function usePaginatedApi(fn, perPage = 12) {
  const items    = ref([])
  const loading  = ref(false)
  const error    = ref(null)
  const page     = ref(1)
  const meta     = ref(null)

  const hasMore = computed(() =>
    !meta.value || page.value < meta.value.totalPages
  )

  async function load(reset = false) {
    if (reset) {
      page.value  = 1
      items.value = []
    }

    loading.value = true
    error.value   = null

    try {
      const response = await fn(page.value, perPage)

      if (!response.success) throw new Error(response.message)

      items.value = reset ? response.data : [...items.value, ...response.data]
      meta.value  = response.meta || null
    } catch (err) {
      error.value = err?.message || 'Failed to load data'
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    page.value++
    await load(false)
  }

  async function reload() {
    await load(true)
  }

  // Auto-load on first call
  load(true)

  return { items, loading, error, meta, hasMore, loadMore, reload }
}

// ─── Re-export for convenience ────────────────────────────────────────────────
// Import from 'vue' inside the file, but expose here so callers
// using this composable don't need a separate import for computed.
import { computed } from 'vue'
