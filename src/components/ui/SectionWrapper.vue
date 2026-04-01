<template>
  <section class="section-wrapper" :class="{ 'section-wrapper--gradient': gradient }">
    <!-- Background mesh gradient -->
    <div v-if="gradient" class="section-bg" />

    <div class="section-content" :class="{ 'section-content--narrow': narrow }">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  gradient?: boolean
  narrow?: boolean
}>(), {
  gradient: false,
  narrow: false,
})
</script>

<style scoped>
.section-wrapper {
  position: relative;
  border-radius: var(--ps-radius-2xl);
  overflow: hidden;
}

.section-wrapper--gradient {
  background: var(--ps-gradient-surface);
}

.section-bg {
  position: absolute;
  inset: 0;
  background: var(--ps-gradient-mesh);
  pointer-events: none;
}

.section-content {
  position: relative;
  z-index: 1;
}

.section-content--narrow {
  max-width: 800px;
  margin: 0 auto;
}
</style>
