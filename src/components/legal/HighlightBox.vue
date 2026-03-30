<template>
  <div class="highlight-box" :class="`highlight-box--${variant}`">
    <div class="highlight-box__icon">
      <v-icon :size="20" color="white">{{ icon }}</v-icon>
    </div>
    <div class="highlight-box__content">
      <div v-if="title" class="highlight-box__title">{{ title }}</div>
      <div class="highlight-box__text"><slot /></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-information-outline' },
  title: { type: String, default: '' },
  variant: { type: String, default: 'info' }
})
</script>

<style scoped>
.highlight-box {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid;
  margin: 20px 0;
}

.highlight-box--info {
  background: rgba(79, 70, 229, 0.04);
  border-color: rgba(79, 70, 229, 0.12);
}

.highlight-box--success {
  background: rgba(16, 185, 129, 0.04);
  border-color: rgba(16, 185, 129, 0.12);
}

.highlight-box--warning {
  background: rgba(245, 158, 11, 0.04);
  border-color: rgba(245, 158, 11, 0.12);
}

.highlight-box__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.highlight-box--info .highlight-box__icon {
  background: linear-gradient(135deg, #4F46E5, #7c3aed);
}

.highlight-box--success .highlight-box__icon {
  background: linear-gradient(135deg, #10B981, #059669);
}

.highlight-box--warning .highlight-box__icon {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.highlight-box__title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.highlight-box__text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}
</style>
