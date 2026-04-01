<template>
  <section class="legal-hero">
    <!-- Animated background -->
    <div class="legal-hero__bg">
      <div class="legal-hero__blob legal-hero__blob--1" />
      <div class="legal-hero__blob legal-hero__blob--2" />
      <div class="legal-hero__blob legal-hero__blob--3" />
      <div class="legal-hero__grid" />
    </div>

    <div class="legal-hero__content" :class="{ 'legal-hero__content--visible': mounted }">
      <div class="legal-hero__badge">
        <v-icon size="14" :color="iconColor">{{ icon }}</v-icon>
        <span>{{ badge }}</span>
      </div>

      <h1 class="legal-hero__title">{{ title }}</h1>
      <p class="legal-hero__subtitle">{{ subtitle }}</p>

      <div class="legal-hero__meta">
        <span class="legal-hero__date">
          <v-icon size="14">mdi-calendar-outline</v-icon>
          Last updated: {{ lastUpdated }}
        </span>
        <span class="legal-hero__reading">
          <v-icon size="14">mdi-clock-outline</v-icon>
          {{ readingTime }} min read
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

withDefaults(defineProps<{
  title: string
  subtitle: string
  badge?: string
  icon?: string
  iconColor?: string
  lastUpdated?: string
  readingTime?: string | number
}>(), {
  badge: 'Legal',
  icon: 'mdi-shield-check-outline',
  iconColor: '#7c3aed',
  lastUpdated: 'March 31, 2026',
  readingTime: '8'
})

const mounted = ref<boolean>(false)
onMounted(() => { setTimeout(() => { mounted.value = true }, 100) })
</script>

<style scoped>
.legal-hero {
  position: relative;
  padding: clamp(120px, 16vw, 160px) 24px clamp(60px, 8vw, 80px);
  overflow: hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 70%, #4338ca 100%);
}

/* Animated blobs */
.legal-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.legal-hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.legal-hero__blob--1 {
  width: 500px;
  height: 500px;
  background: rgba(124, 58, 237, 0.2);
  top: -200px;
  right: -100px;
  animation: legal-float 20s ease-in-out infinite;
}

.legal-hero__blob--2 {
  width: 350px;
  height: 350px;
  background: rgba(14, 165, 233, 0.12);
  bottom: -100px;
  left: -80px;
  animation: legal-float 16s ease-in-out infinite 4s;
}

.legal-hero__blob--3 {
  width: 200px;
  height: 200px;
  background: rgba(236, 72, 153, 0.08);
  top: 40%;
  left: 50%;
  animation: legal-float 12s ease-in-out infinite 2s;
}

@keyframes legal-float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(20px, -15px); }
  66% { transform: translate(-10px, 10px); }
}

.legal-hero__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}

/* Content */
.legal-hero__content {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.legal-hero__content--visible {
  opacity: 1;
  transform: translateY(0);
}

.legal-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 18px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}

.legal-hero__title {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0 0 16px;
}

.legal-hero__subtitle {
  font-size: clamp(16px, 2vw, 19px);
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  margin: 0 0 28px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.legal-hero__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.legal-hero__date,
.legal-hero__reading {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
}

.legal-hero__date .v-icon,
.legal-hero__reading .v-icon {
  opacity: 0.6;
}
</style>
