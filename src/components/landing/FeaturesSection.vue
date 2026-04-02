<template>
  <section class="features">
    <div class="features__container">
      <div v-scroll-reveal class="features__header">
        <span class="section-label">Features</span>
        <h2 class="section-title">Everything you need, nothing you don't</h2>
        <p class="section-subtitle">
          Built specifically for photographers who value their time and their clients' experience.
        </p>
      </div>

      <div class="features__grid">
        <div
          v-for="(feature, i) in features"
          :key="i"
          v-scroll-reveal="{ delay: i * 80 }"
          class="features__card"
          @mouseenter="hoveredIndex = i"
          @mouseleave="hoveredIndex = -1"
        >
          <div class="features__card-glow" :style="{ background: feature.glow }"></div>
          <div class="features__icon" :style="{ background: feature.bg }">
            <v-icon :color="feature.color" size="24">{{ feature.icon }}</v-icon>
          </div>
          <h3 class="features__card-title">{{ feature.title }}</h3>
          <p class="features__card-text">{{ feature.text }}</p>
          <div class="features__card-tag">{{ feature.tag }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Feature {
  icon: string
  title: string
  text: string
  tag: string
  color: string
  bg: string
  glow: string
}

const hoveredIndex = ref<number>(-1)

const features: Feature[] = [
  {
    icon: 'mdi-cloud-upload-outline',
    title: 'Bulk Upload + Compression',
    text: 'Upload hundreds of photos at once. Our AI-powered compression reduces file size by up to 80% without visible quality loss.',
    tag: 'Core',
    color: '#7c3aed',
    bg: 'rgba(124, 58, 237, 0.08)',
    glow: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
  },
  {
    icon: 'mdi-view-grid-outline',
    title: 'Beautiful Gallery UI',
    text: 'Stunning, responsive galleries that make your work shine. Clients get a premium experience from the first click.',
    tag: 'Experience',
    color: '#2563eb',
    bg: 'rgba(37, 99, 235, 0.08)',
    glow: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
  },
  {
    icon: 'mdi-heart-multiple-outline',
    title: 'Favorites & Selection',
    text: 'Clients can heart photos, create shortlists, and submit final selections — all in one beautiful interface.',
    tag: 'Workflow',
    color: '#dc2626',
    bg: 'rgba(220, 38, 38, 0.08)',
    glow: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
  },
  {
    icon: 'mdi-folder-multiple-outline',
    title: 'Project Management',
    text: 'Organize shoots by event, client, or date. Track selection status and delivery progress all in one dashboard.',
    tag: 'Organize',
    color: '#059669',
    bg: 'rgba(5, 150, 105, 0.08)',
    glow: 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, transparent 70%)',
  },
  {
    icon: 'mdi-rocket-launch-outline',
    title: 'Fast Delivery',
    text: 'CDN-powered delivery ensures lightning-fast loading worldwide. No more waiting for heavy files to buffer.',
    tag: 'Speed',
    color: '#d97706',
    bg: 'rgba(217, 119, 6, 0.08)',
    glow: 'radial-gradient(circle, rgba(217, 119, 6, 0.08) 0%, transparent 70%)',
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'Secure & Private',
    text: 'Every gallery is protected with unique links. Your photos stay safe with enterprise-grade encryption.',
    tag: 'Security',
    color: '#475569',
    bg: 'rgba(71, 85, 105, 0.08)',
    glow: 'radial-gradient(circle, rgba(71, 85, 105, 0.08) 0%, transparent 70%)',
  },
]
</script>

<style scoped lang="scss">
.features {
  padding: 60px 24px;
  background: #f8fafc;

  @media (max-width: 600px) {
    padding: 40px 16px;
  }
}

.features__container {
  max-width: 1100px;
  margin: 0 auto;
}

.features__header {
  text-align: center;
  margin-bottom: 64px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.features__card {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 32px 28px;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  cursor: default;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.06);
    border-color: #e2e8f0;

    .features__card-glow {
      opacity: 1;
    }

    .features__icon {
      transform: scale(1.1);
    }
  }
}

.features__card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.features__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.features__card-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.features__card-text {
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 16px;
}

.features__card-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
