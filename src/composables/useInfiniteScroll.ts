import { ref, watch, onMounted, onUnmounted, nextTick, type Ref } from 'vue'

export function useInfiniteScroll(
  callback: () => Promise<void>,
  options: { rootMargin?: string; threshold?: number } = {}
) {
  const sentinelRef = ref<HTMLElement | null>(null) as Ref<HTMLElement | null>
  const isLoading = ref(false)

  let observer: IntersectionObserver | null = null

  const createObserver = () => {
    if (!sentinelRef.value) return

    observer?.disconnect()

    observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isLoading.value) {
          isLoading.value = true
          try {
            await callback()
          } catch (e) {
            console.error('Infinite scroll error:', e)
          } finally {
            isLoading.value = false
          }
        }
      },
      {
        root: null,
        rootMargin: options.rootMargin ?? '300px',
        threshold: options.threshold ?? 0,
      }
    )

    observer.observe(sentinelRef.value)
  }

  // 🔥 Watch for DOM availability
  watch(
    sentinelRef,
    async (el) => {
      if (el) {
        await nextTick()
        createObserver()
      }
    },
    { immediate: true }
  )

  //  Fallback scroll trigger (important)
  const handleScroll = async () => {
    if (isLoading.value) return

    const scrollBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 200

    if (scrollBottom) {
      isLoading.value = true
      try {
        await callback()
      } finally {
        isLoading.value = false
      }
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
    window.removeEventListener('scroll', handleScroll)
  })

  return { sentinelRef, isLoading }
}