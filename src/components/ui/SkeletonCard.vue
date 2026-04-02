<template>
  <div class="skeleton-card" :class="{ 'skeleton-card--compact': variant === 'compact' }">
    <div v-if="variant !== 'compact'" class="skeleton-card__cover ps-shimmer" />
    <div class="skeleton-card__body">
      <div class="ps-shimmer skeleton-line skeleton-line--title" />
      <div class="ps-shimmer skeleton-line skeleton-line--meta" />
      <div v-if="variant === 'full'" class="ps-shimmer skeleton-line skeleton-line--extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'compact' | 'full'
}>(), {
  variant: 'default',
})
</script>

<style scoped>
.skeleton-card {
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
  overflow: hidden;
}

.skeleton-card__cover {
  width: 100%;
  height: 160px;
}

.skeleton-card__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  border-radius: 6px;
  height: 14px;
}

.skeleton-line--title {
  width: 70%;
  height: 16px;
}

.skeleton-line--meta {
  width: 45%;
  height: 12px;
}

.skeleton-line--extra {
  width: 55%;
  height: 12px;
}

.skeleton-card--compact {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.skeleton-card--compact .skeleton-card__body {
  padding: 0;
  flex: 1;
}
</style>
