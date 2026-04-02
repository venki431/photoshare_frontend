<template>
  <div class="view-toggle">
    <button
      class="toggle-btn"
      :class="{ 'toggle-btn--active': modelValue === 'grid' }"
      @click="$emit('update:modelValue', 'grid')"
      title="Grid view"
    >
      <v-icon size="18">mdi-view-grid-outline</v-icon>
    </button>
    <button
      class="toggle-btn"
      :class="{ 'toggle-btn--active': modelValue === 'list' }"
      @click="$emit('update:modelValue', 'list')"
      title="List view"
    >
      <v-icon size="18">mdi-view-list-outline</v-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'grid' | 'list'
}>()

defineEmits<{
  'update:modelValue': [value: 'grid' | 'list']
}>()
</script>

<style scoped>
.view-toggle {
  display: flex;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-sm);
  overflow: hidden;
  flex-shrink: 0;
}

.toggle-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  cursor: pointer;
  color: #94A3B8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.toggle-btn + .toggle-btn {
  border-left: 1px solid var(--ps-border);
}

.toggle-btn:hover {
  background: #F8FAFC;
  color: #64748B;
}

.toggle-btn--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
}
</style>
