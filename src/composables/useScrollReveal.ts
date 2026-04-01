import { onMounted, onUnmounted } from 'vue'
import type { DirectiveBinding, ObjectDirective } from 'vue'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

interface ScrollRevealBinding {
  delay?: number
}

export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            if (once) observer?.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('sr-visible')
          }
        })
      },
      { threshold, rootMargin }
    )
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  function vReveal(el: HTMLElement, binding: DirectiveBinding<ScrollRevealBinding>): void {
    el.classList.add('sr-hidden')
    const delay = binding.value?.delay ?? 0
    if (delay) el.style.transitionDelay = `${delay}ms`
    const direction = binding.arg ?? 'up'
    el.dataset.srDirection = direction
    if (observer) {
      observer.observe(el)
    } else {
      const check = setInterval(() => {
        if (observer) {
          observer.observe(el)
          clearInterval(check)
        }
      }, 50)
    }
  }

  return { vReveal }
}

export const scrollRevealDirective: ObjectDirective<HTMLElement, ScrollRevealBinding> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ScrollRevealBinding>) {
    el.classList.add('sr-hidden')
    const delay = binding.value?.delay ?? 0
    if (delay) el.style.transitionDelay = `${delay}ms`
    el.dataset.srDirection = binding.arg ?? 'up'

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('sr-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    ;(el as HTMLElement & { _srObserver?: IntersectionObserver })._srObserver = observer
  },
  unmounted(el: HTMLElement) {
    const elWithObserver = el as HTMLElement & { _srObserver?: IntersectionObserver }
    elWithObserver._srObserver?.disconnect()
  },
}
