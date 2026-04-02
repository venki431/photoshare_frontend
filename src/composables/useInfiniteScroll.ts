import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useInfiniteScroll(
  callback: () => Promise<void>,
  options: { rootMargin?: string; threshold?: number } = {}
) {
  const sentinelRef = ref<HTMLElement | null>(null) as Ref<HTMLElement | null>
  const isLoading = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!sentinelRef.value) return
    observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading.value) {
          isLoading.value = true
          try {
            await callback()
          } finally {
            isLoading.value = false
          }
        }
      },
      {
        rootMargin: options.rootMargin ?? '200px',
        threshold: options.threshold ?? 0,
      }
    )
    observer.observe(sentinelRef.value)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return { sentinelRef, isLoading }
}
