<template>
  <div class="scroll-progress" :class="{ 'scroll-progress--visible': progress > 0 }">
    <div class="scroll-progress__bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref<number>(0)

function handleScroll(): void {
  const el: HTMLElement = document.documentElement
  const scrollTop: number = el.scrollTop || document.body.scrollTop
  const scrollHeight: number = el.scrollHeight - el.clientHeight
  progress.value = scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 1000;
  background: transparent;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-progress--visible {
  opacity: 1;
}

.scroll-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #4F46E5, #0EA5E9);
  border-radius: 0 2px 2px 0;
  transition: width 0.1s linear;
}
</style>
