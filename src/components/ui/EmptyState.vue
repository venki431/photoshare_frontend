<template>
  <div class="empty-state" :class="{ 'empty-state--compact': compact }">
    <!-- Floating decorative orbs -->
    <div class="empty-state__orbs" v-if="!compact">
      <div class="orb orb--1" />
      <div class="orb orb--2" />
    </div>

    <div class="empty-state__content ps-animate-in">
      <!-- Icon with gradient ring -->
      <div class="empty-state__icon-wrapper" :class="`empty-state__icon--${variant}`">
        <div class="icon-ring" />
        <div class="icon-circle">
          <v-icon :size="compact ? 32 : 48" color="white">{{ icon }}</v-icon>
        </div>
      </div>

      <h3 class="empty-state__title" :class="compact ? 'text-body-1' : 'text-h6'">
        {{ title }}
      </h3>

      <p class="empty-state__description text-body-2 text-medium-emphasis">
        {{ description }}
      </p>

      <div v-if="$slots.action" class="empty-state__action">
        <slot name="action" />
      </div>

      <!-- Helpful tips -->
      <div v-if="tips.length" class="empty-state__tips">
        <div v-for="(tip, i) in tips" :key="i" class="tip-item ps-animate-in" :style="{ animationDelay: `${0.3 + i * 0.1}s` }">
          <v-icon size="16" color="primary" class="tip-icon">mdi-lightbulb-outline</v-icon>
          <span class="text-caption text-medium-emphasis">{{ tip }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  icon?: string
  title?: string
  description?: string
  tips?: string[]
  variant?: string
  compact?: boolean
}>(), {
  icon: 'mdi-folder-open-outline',
  title: 'Nothing here yet',
  description: '',
  tips: () => [],
  variant: 'primary',
  compact: false,
})
</script>

<style scoped>
.empty-state {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(48px, 8vw, 80px) 24px;
  border-radius: var(--ps-radius-2xl);
  background: white;
  border: 2px dashed rgba(79, 70, 229, 0.12);
  overflow: hidden;
}

.empty-state--compact {
  padding: 32px 20px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--ps-border);
}

.empty-state__orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.orb--1 {
  width: 200px;
  height: 200px;
  background: rgba(79, 70, 229, 0.08);
  top: -40px;
  right: -40px;
  animation: ps-float 8s ease-in-out infinite;
}

.orb--2 {
  width: 160px;
  height: 160px;
  background: rgba(14, 165, 233, 0.06);
  bottom: -30px;
  left: -30px;
  animation: ps-float 10s ease-in-out infinite 2s;
}

.empty-state__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 420px;
}

.empty-state__icon-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.icon-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.empty-state--compact .icon-circle {
  width: 56px;
  height: 56px;
}

.empty-state__icon--primary .icon-circle {
  background: var(--ps-gradient-brand);
}

.empty-state__icon--warning .icon-circle {
  background: var(--ps-gradient-warm);
}

.empty-state__icon--success .icon-circle {
  background: var(--ps-gradient-success);
}

.icon-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(79, 70, 229, 0.15);
  animation: ps-pulse-ring 3s ease-in-out infinite;
}

.empty-state__title {
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.empty-state__description {
  margin: 0;
  line-height: 1.6;
}

.empty-state__action {
  margin-top: 12px;
}

.empty-state__tips {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  background: rgba(79, 70, 229, 0.04);
  border-radius: var(--ps-radius-lg);
  width: 100%;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
}

.tip-icon {
  flex-shrink: 0;
}
</style>
