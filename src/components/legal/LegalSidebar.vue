<template>
  <!-- Desktop sidebar -->
  <aside class="legal-sidebar" :class="{ 'legal-sidebar--scrolled': scrolled }">
    <div class="legal-sidebar__inner">
      <div class="legal-sidebar__label">On this page</div>
      <nav class="legal-sidebar__nav">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
          class="legal-sidebar__link"
          :class="{ 'legal-sidebar__link--active': activeId === section.id }"
          @click.prevent="scrollToSection(section.id)"
        >
          <div class="legal-sidebar__indicator" />
          <v-icon size="16" class="legal-sidebar__icon">{{ section.icon }}</v-icon>
          <span>{{ section.title }}</span>
        </a>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  sections: { type: Array, required: true }
})

const activeId = ref('')
const scrolled = ref(false)

function updateActive() {
  scrolled.value = window.scrollY > 300

  const ids = props.sections.map(s => s.id)
  let current = ids[0] || ''

  for (const id of ids) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 140) current = id
    }
  }

  activeId.value = current
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
})

onUnmounted(() => window.removeEventListener('scroll', updateActive))
</script>

<style scoped>
.legal-sidebar {
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  flex-shrink: 0;
  width: 240px;

  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}

.legal-sidebar::-webkit-scrollbar {
  width: 3px;
}

.legal-sidebar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 2px;
}

.legal-sidebar__inner {
  padding: 4px 0;
}

.legal-sidebar__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  padding: 0 12px;
  margin-bottom: 12px;
}

.legal-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legal-sidebar__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.legal-sidebar__link:hover {
  color: #334155;
  background: rgba(0, 0, 0, 0.03);
}

.legal-sidebar__link--active {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
  font-weight: 600;
}

.legal-sidebar__indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  border-radius: 2px;
  background: linear-gradient(135deg, #7c3aed, #4F46E5);
  transition: height 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.legal-sidebar__link--active .legal-sidebar__indicator {
  height: 20px;
}

.legal-sidebar__icon {
  opacity: 0.5;
  flex-shrink: 0;
}

.legal-sidebar__link--active .legal-sidebar__icon {
  opacity: 1;
  color: #7c3aed;
}

@media (max-width: 1024px) {
  .legal-sidebar {
    display: none;
  }
}
</style>
