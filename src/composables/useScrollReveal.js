import { onMounted, onUnmounted, ref } from 'vue'

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  const elements = ref(new Map())
  let observer = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('sr-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('sr-visible')
          }
        })
      },
      { threshold, rootMargin }
    )
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  function vReveal(el, binding) {
    el.classList.add('sr-hidden')
    const delay = binding.value?.delay || 0
    if (delay) el.style.transitionDelay = `${delay}ms`
    const direction = binding.arg || 'up'
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

export const scrollRevealDirective = {
  mounted(el, binding) {
    el.classList.add('sr-hidden')
    const delay = binding.value?.delay || 0
    if (delay) el.style.transitionDelay = `${delay}ms`
    el.dataset.srDirection = binding.arg || 'up'

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
    el._srObserver = observer
  },
  unmounted(el) {
    if (el._srObserver) el._srObserver.disconnect()
  },
}
