<template>
  <section class="solution">
    <div class="solution__container">
      <div v-scroll-reveal class="solution__header">
        <span class="section-label section-label--primary">The Solution</span>
        <h2 class="section-title">A smarter way to deliver photos</h2>
        <p class="section-subtitle">
          Four simple steps. Zero hassle. From upload to client selection — all online.
        </p>
      </div>

      <div class="solution__flow">
        <div
          v-for="(step, i) in steps"
          :key="i"
          v-scroll-reveal="{ delay: i * 150 }"
          class="solution__step"
        >
          <div class="solution__step-number">{{ i + 1 }}</div>
          <div class="solution__step-icon" :style="{ background: step.bg }">
            <v-icon :color="step.color" size="28">{{ step.icon }}</v-icon>
          </div>
          <h3 class="solution__step-title">{{ step.title }}</h3>
          <p class="solution__step-text">{{ step.text }}</p>

          <!-- Connector arrow -->
          <div v-if="i < steps.length - 1" class="solution__connector">
            <svg width="40" height="16" viewBox="0 0 40 16">
              <path d="M0 8h32l-6-6M32 8l-6 6" stroke="#c4b5fd" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Animated visual -->
      <div v-scroll-reveal class="solution__visual">
        <div class="solution__screen">
          <div class="solution__screen-bar">
            <div class="solution__screen-dots">
              <span></span><span></span><span></span>
            </div>
            <div class="solution__screen-url">photoshare.app/gallery/wedding-2024</div>
          </div>
          <div class="solution__screen-body">
            <div class="solution__screen-sidebar">
              <div class="solution__screen-nav-item solution__screen-nav-item--active">All Photos</div>
              <div class="solution__screen-nav-item">Favorites</div>
              <div class="solution__screen-nav-item">Selected</div>
            </div>
            <div class="solution__screen-gallery">
              <div
                v-for="n in 9"
                :key="n"
                class="solution__screen-thumb"
                :class="{ 'solution__screen-thumb--selected': [2, 5, 7].includes(n) }"
              >
                <div v-if="[2, 5, 7].includes(n)" class="solution__screen-check">
                  <v-icon size="10" color="white">mdi-check</v-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Step {
  icon: string
  title: string
  text: string
  color: string
  bg: string
}

const steps: Step[] = [
  {
    icon: 'mdi-cloud-upload-outline',
    title: 'Upload Photos',
    text: 'Drag and drop your entire shoot. We handle the rest.',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.08)',
  },
  {
    icon: 'mdi-lightning-bolt-outline',
    title: 'Auto Compress',
    text: 'Smart compression keeps quality high, file sizes small.',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.08)',
  },
  {
    icon: 'mdi-link-variant',
    title: 'Share Link',
    text: 'One beautiful link. Send it to your client instantly.',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
  },
  {
    icon: 'mdi-heart-outline',
    title: 'Client Selects',
    text: 'Clients browse, favorite, and submit their selections.',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
  },
]
</script>

<style scoped lang="scss">
.solution {
  padding: 100px 24px;
  background: white;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.solution__container {
  max-width: 1100px;
  margin: 0 auto;
}

.solution__header {
  text-align: center;
  margin-bottom: 64px;
}

.solution__flow {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 72px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
}

.solution__step {
  position: relative;
  text-align: center;
  flex: 1;
  max-width: 220px;
  min-width: 180px;

  @media (max-width: 768px) {
    max-width: 320px;
  }
}

.solution__step-number {
  font-size: 12px;
  font-weight: 700;
  color: #c4b5fd;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.solution__step-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.solution__step-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.solution__step-text {
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
}

.solution__connector {
  position: absolute;
  right: -30px;
  top: 60px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
}

// Browser mock
.solution__visual {
  max-width: 800px;
  margin: 0 auto;
}

.solution__screen {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.solution__screen-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.solution__screen-dots {
  display: flex;
  gap: 6px;

  span {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #e2e8f0;

    &:first-child { background: #fca5a5; }
    &:nth-child(2) { background: #fde68a; }
    &:last-child { background: #86efac; }
  }
}

.solution__screen-url {
  flex: 1;
  background: white;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: #94a3b8;
  border: 1px solid #f1f5f9;
}

.solution__screen-body {
  display: flex;
  min-height: 280px;
}

.solution__screen-sidebar {
  width: 140px;
  border-right: 1px solid #f1f5f9;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 600px) {
    display: none;
  }
}

.solution__screen-nav-item {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: #64748b;
  cursor: default;

  &--active {
    background: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
    font-weight: 600;
  }
}

.solution__screen-gallery {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 16px;
}

.solution__screen-thumb {
  aspect-ratio: 1;
  border-radius: 8px;
  background: linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%);
  position: relative;
  transition: all 0.3s ease;

  &:nth-child(2) { background: linear-gradient(135deg, #fce7f3, #fae8ff); }
  &:nth-child(3) { background: linear-gradient(135deg, #d1fae5, #ecfdf5); }
  &:nth-child(4) { background: linear-gradient(135deg, #fef3c7, #fefce8); }
  &:nth-child(5) { background: linear-gradient(135deg, #e0f2fe, #f0f9ff); }
  &:nth-child(6) { background: linear-gradient(135deg, #ffe4e6, #fff1f2); }
  &:nth-child(7) { background: linear-gradient(135deg, #f3e8ff, #faf5ff); }
  &:nth-child(8) { background: linear-gradient(135deg, #ccfbf1, #f0fdfa); }
  &:nth-child(9) { background: linear-gradient(135deg, #fef9c3, #fefce8); }

  &--selected {
    box-shadow: 0 0 0 2px #7c3aed;
  }
}

.solution__screen-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
