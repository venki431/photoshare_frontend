<template>
  <section :id="id" class="legal-section" ref="sectionRef">
    <div class="legal-section__header">
      <div class="legal-section__icon-wrap">
        <v-icon size="22" color="white">{{ icon }}</v-icon>
      </div>
      <div class="legal-section__heading">
        <span class="legal-section__number">{{ formattedNumber }}</span>
        <h2 class="legal-section__title">{{ title }}</h2>
      </div>
      <button
        v-if="collapsible"
        class="legal-section__toggle"
        @click="expanded = !expanded"
        :aria-expanded="expanded"
      >
        <v-icon size="20">{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </button>
    </div>

    <transition name="section-expand">
      <div v-show="!collapsible || expanded" class="legal-section__body">
        <slot />
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  icon: { type: String, default: 'mdi-file-document-outline' },
  number: { type: [String, Number], default: '' },
  collapsible: { type: Boolean, default: false }
})

const expanded = ref(true)
const sectionRef = ref(null)

const formattedNumber = computed(() => {
  if (!props.number) return ''
  return String(props.number).padStart(2, '0')
})
</script>

<style scoped>
.legal-section {
  background: white;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.legal-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  border-color: rgba(124, 58, 237, 0.1);
}

.legal-section__header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  cursor: default;
}

.legal-section__icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed, #4F46E5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
}

.legal-section__heading {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.legal-section__number {
  font-size: 12px;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  padding: 3px 10px;
  border-radius: 8px;
  flex-shrink: 0;
}

.legal-section__title {
  font-size: clamp(17px, 2vw, 20px);
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
}

.legal-section__toggle {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.legal-section__toggle:hover {
  background: #f8fafc;
  border-color: rgba(124, 58, 237, 0.2);
  color: #7c3aed;
}

.legal-section__body {
  padding: 0 28px 28px;
  padding-left: 88px; /* align with text after icon */
  font-size: 15px;
  color: #475569;
  line-height: 1.75;
}

.legal-section__body :deep(p) {
  margin: 0 0 14px;
}

.legal-section__body :deep(p:last-child) {
  margin-bottom: 0;
}

.legal-section__body :deep(ul),
.legal-section__body :deep(ol) {
  margin: 10px 0 14px;
  padding-left: 20px;
}

.legal-section__body :deep(li) {
  margin-bottom: 6px;
  padding-left: 4px;
}

.legal-section__body :deep(strong) {
  color: #1e293b;
  font-weight: 600;
}

.legal-section__body :deep(a) {
  color: #7c3aed;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(124, 58, 237, 0.3);
  transition: border-color 0.2s;
}

.legal-section__body :deep(a:hover) {
  border-color: #7c3aed;
}

/* Expand transition */
.section-expand-enter-active,
.section-expand-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.section-expand-enter-from,
.section-expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .legal-section__header {
    padding: 20px;
  }

  .legal-section__body {
    padding: 0 20px 20px;
    padding-left: 20px;
  }

  .legal-section__icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }
}
</style>
