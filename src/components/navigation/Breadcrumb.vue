<template>
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <template v-for="(item, idx) in items" :key="idx">
      <v-icon v-if="idx > 0" size="14" class="breadcrumb__sep">mdi-chevron-right</v-icon>
      <router-link
        v-if="item.to"
        :to="item.to"
        class="breadcrumb__link"
      >
        <v-icon v-if="item.icon" size="16" class="breadcrumb__icon">{{ item.icon }}</v-icon>
        {{ item.label }}
      </router-link>
      <span v-else class="breadcrumb__current">{{ item.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  flex-wrap: wrap;
}

.breadcrumb__link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #64748B;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.15s ease;
  white-space: nowrap;
}

.breadcrumb__link:hover {
  color: var(--ps-primary);
}

.breadcrumb__icon {
  opacity: 0.7;
}

.breadcrumb__sep {
  color: #CBD5E1;
  flex-shrink: 0;
}

.breadcrumb__current {
  color: #0F172A;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
