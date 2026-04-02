<template>
  <section class="problems">
    <div class="problems__container">
      <div v-scroll-reveal class="problems__header">
        <span class="section-label">The Problem</span>
        <h2 class="section-title">Sharing photos shouldn't be this painful</h2>
        <p class="section-subtitle">
          Photographers waste hours on logistics that have nothing to do with photography.
        </p>
      </div>

      <div class="problems__grid">
        <div
          v-for="(problem, i) in problems"
          :key="i"
          v-scroll-reveal="{ delay: i * 120 }"
          class="problems__card"
        >
          <div class="problems__icon-wrap" :style="{ background: problem.bg }">
            <v-icon :color="problem.color" size="28">{{ problem.icon }}</v-icon>
          </div>
          <h3 class="problems__card-title">{{ problem.title }}</h3>
          <p class="problems__card-text">{{ problem.text }}</p>
          <div class="problems__card-visual">
            <div v-if="i === 0" class="problems__visual-travel">
              <div class="problems__travel-dot problems__travel-dot--start"></div>
              <div class="problems__travel-line"></div>
              <div class="problems__travel-dot problems__travel-dot--end"></div>
            </div>
            <div v-else-if="i === 1" class="problems__visual-drive">
              <div v-for="n in 4" :key="n" class="problems__drive-file">
                <v-icon size="12" color="#94a3b8">mdi-file-image</v-icon>
                <span>IMG_{{ 1000 + n * 37 }}.jpg</span>
              </div>
            </div>
            <div v-else class="problems__visual-noflow">
              <div class="problems__noflow-bar" style="width: 80%"></div>
              <div class="problems__noflow-bar" style="width: 50%"></div>
              <div class="problems__noflow-bar" style="width: 65%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Problem {
  icon: string
  title: string
  text: string
  color: string
  bg: string
}

const problems: Problem[] = [
  {
    icon: 'mdi-car-side',
    title: 'Traveling to Clients',
    text: 'Spending hours driving to deliver photos on USB drives or laptops. Time that could be spent shooting.',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
  },
  {
    icon: 'mdi-folder-alert-outline',
    title: 'Messy Google Drive Links',
    text: 'Unorganized folders, confusing links, no way to track what clients have actually viewed or selected.',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)',
  },
  {
    icon: 'mdi-selection-off',
    title: 'No Structured Selection',
    text: 'Clients screenshot favorites or send long email lists. No proper workflow for picking album photos.',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.08)',
  },
]
</script>

<style scoped lang="scss">
.problems {
  padding: 60px 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);

  @media (max-width: 600px) {
    padding: 40px 16px;
  }
}

.problems__container {
  max-width: 1100px;
  margin: 0 auto;
}

.problems__header {
  text-align: center;
  margin-bottom: 64px;
}

.problems__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.problems__card {
  background: white;
  border-radius: 20px;
  padding: 32px 28px;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
    border-color: #e2e8f0;
  }
}

.problems__icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.problems__card-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.problems__card-text {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 20px;
}

.problems__card-visual {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
}

.problems__visual-travel {
  display: flex;
  align-items: center;
  gap: 8px;
}

.problems__travel-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;

  &--start { background: #dc2626; }
  &--end { background: #94a3b8; }
}

.problems__travel-line {
  flex: 1;
  height: 2px;
  background: repeating-linear-gradient(90deg, #cbd5e1 0, #cbd5e1 6px, transparent 6px, transparent 10px);
  animation: dashMove 2s linear infinite;
}

@keyframes dashMove {
  to { background-position: 20px 0; }
}

.problems__visual-drive {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.problems__drive-file {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
  font-family: 'SF Mono', monospace;
}

.problems__visual-noflow {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.problems__noflow-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
}
</style>
