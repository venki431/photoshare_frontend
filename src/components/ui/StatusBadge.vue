<template>
  <span class="status-badge" :class="`status-badge--${status}`">
    <span class="status-dot" />
    <span class="status-label">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectStatus } from '@/types'

const props = withDefaults(defineProps<{
  status?: ProjectStatus | string
}>(), {
  status: 'pending',
})

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  completed: 'Completed',
}

const label = computed(() => statusLabels[props.status] ?? props.status)
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px 8px;
  border-radius: var(--ps-radius-full);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-transform: capitalize;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge--pending {
  background: rgba(245, 158, 11, 0.1);
  color: #B45309;
}
.status-badge--pending .status-dot {
  background: #F59E0B;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.4);
}

.status-badge--in_review {
  background: rgba(59, 130, 246, 0.1);
  color: #1D4ED8;
}
.status-badge--in_review .status-dot {
  background: #3B82F6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
}

.status-badge--completed {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
}
.status-badge--completed .status-dot {
  background: #10B981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
}
</style>
