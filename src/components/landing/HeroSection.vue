<template>
  <section class="hero">
    <!-- Animated background -->
    <div class="hero__bg">
      <div class="hero__blob hero__blob--1"></div>
      <div class="hero__blob hero__blob--2"></div>
      <div class="hero__blob hero__blob--3"></div>
      <div class="hero__grid-overlay"></div>
    </div>

    <div class="hero__content">
      <div class="hero__badge" :class="{ 'hero__badge--visible': mounted }">
        <v-icon size="14" color="#7c3aed">mdi-sparkles</v-icon>
        <span>Now in Beta — Free for early adopters</span>
      </div>

      <h1 class="hero__title" :class="{ 'hero__title--visible': mounted }">
        Share. Select. Deliver Photos —
        <span class="hero__title-gradient">Effortlessly.</span>
      </h1>

      <p class="hero__subtitle" :class="{ 'hero__subtitle--visible': mounted }">
        The easiest way for photographers to deliver and manage
        client photo selections. No more messy drives or physical meetings.
      </p>

      <div class="hero__actions" :class="{ 'hero__actions--visible': mounted }">
        <button class="hero__btn hero__btn--primary" @click="$router.push('/login')">
          <span>Get Started</span>
          <v-icon size="18">mdi-arrow-right</v-icon>
        </button>
        <button class="hero__btn hero__btn--secondary" @click="scrollToPreview">
          <v-icon size="18">mdi-play-circle-outline</v-icon>
          <span>View Demo</span>
        </button>
      </div>

      <div class="hero__social-proof" :class="{ 'hero__social-proof--visible': mounted }">
        <div class="hero__avatars">
          <div v-for="i in 4" :key="i" class="hero__avatar" :style="{ backgroundColor: avatarColors[i - 1] }">
            {{ avatarInitials[i - 1] }}
          </div>
        </div>
        <div class="hero__social-text">
          <strong>500+</strong> photographers already on board
        </div>
      </div>
    </div>

    <!-- Floating cards -->
    <div class="hero__visuals" :class="{ 'hero__visuals--visible': mounted }">
      <div class="hero__card hero__card--1">
        <div class="hero__card-img"></div>
        <div class="hero__card-body">
          <div class="hero__card-tag">Wedding</div>
          <div class="hero__card-meta">248 photos · 2.1 GB</div>
        </div>
        <div class="hero__card-heart">
          <v-icon size="16" color="#ef4444">mdi-heart</v-icon>
        </div>
      </div>
      <div class="hero__card hero__card--2">
        <div class="hero__card-img hero__card-img--2"></div>
        <div class="hero__card-body">
          <div class="hero__card-tag">Portrait</div>
          <div class="hero__card-meta">86 photos · 640 MB</div>
        </div>
        <div class="hero__card-check">
          <v-icon size="14" color="white">mdi-check</v-icon>
        </div>
      </div>
      <div class="hero__card hero__card--3">
        <div class="hero__mini-gallery">
          <div v-for="n in 6" :key="n" class="hero__mini-thumb"></div>
        </div>
        <div class="hero__card-footer">
          <span>12 selected</span>
          <v-icon size="14" color="#7c3aed">mdi-check-circle</v-icon>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hero__scroll" :class="{ 'hero__scroll--visible': mounted }">
      <div class="hero__scroll-line"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const mounted = ref<boolean>(false)
const avatarColors: string[] = ['#7c3aed', '#2563eb', '#059669', '#d97706']
const avatarInitials: string[] = ['AK', 'SM', 'RJ', 'PD']

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true
  })
})

function scrollToPreview(): void {
  document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 24px 40px;
  gap: 60px;

  @media (max-width: 960px) {
    flex-direction: column;
    padding: 80px 20px 40px;
    min-height: auto;
    gap: 40px;
  }
}

// Background
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.hero__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  will-change: transform;

  &--1 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #c4b5fd 0%, transparent 70%);
    top: -200px;
    right: -100px;
    animation: blobFloat1 20s ease-in-out infinite;
  }

  &--2 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #93c5fd 0%, transparent 70%);
    bottom: -150px;
    left: -100px;
    animation: blobFloat2 25s ease-in-out infinite;
  }

  &--3 {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, #a5f3fc 0%, transparent 70%);
    top: 50%;
    left: 50%;
    animation: blobFloat3 18s ease-in-out infinite;
  }
}

.hero__grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes blobFloat1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, 50px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

@keyframes blobFloat2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, -30px) scale(1.08); }
  66% { transform: translate(20px, -50px) scale(0.96); }
}

@keyframes blobFloat3 {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1) rotate(10deg); }
}

// Content
.hero__content {
  position: relative;
  z-index: 1;
  max-width: 620px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 960px) {
    align-items: center;
    text-align: center;
  }
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #7c3aed;
  width: fit-content;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
  line-height: 1.1;
  color: #0f172a;
  letter-spacing: -0.03em;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__title-gradient {
  background: linear-gradient(135deg, #7c3aed, #2563eb, #7c3aed);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 6s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero__subtitle {
  font-size: clamp(16px, 2vw, 19px);
  line-height: 1.65;
  color: #64748b;
  max-width: 520px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 960px) {
    justify-content: center;
  }
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;

  &--primary {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 4px 20px rgba(124, 58, 237, 0.35), 0 0 0 0 rgba(124, 58, 237, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(124, 58, 237, 0.45), 0 0 0 4px rgba(124, 58, 237, 0.1);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: rgba(255, 255, 255, 0.8);
    color: #374151;
    border: 1px solid rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);

    &:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }
  }
}

.hero__social-proof {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero__avatars {
  display: flex;
}

.hero__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: white;
  margin-left: -8px;

  &:first-child {
    margin-left: 0;
  }
}

.hero__social-text {
  font-size: 13px;
  color: #64748b;

  strong {
    color: #0f172a;
  }
}

// Floating visuals
.hero__visuals {
  position: relative;
  z-index: 1;
  width: 420px;
  height: 480px;
  flex-shrink: 0;
  opacity: 0;
  transform: translateY(40px) scale(0.95);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;

  &--visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @media (max-width: 960px) {
    width: 340px;
    height: 400px;
  }

  @media (max-width: 480px) {
    width: 300px;
    height: 360px;
  }
}

.hero__card {
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  will-change: transform;

  &--1 {
    top: 0;
    left: 0;
    width: 240px;
    animation: cardFloat1 8s ease-in-out infinite;

    @media (max-width: 480px) {
      width: 200px;
    }
  }

  &--2 {
    top: 60px;
    right: 0;
    width: 200px;
    animation: cardFloat2 9s ease-in-out infinite 1s;

    @media (max-width: 480px) {
      width: 170px;
    }
  }

  &--3 {
    bottom: 20px;
    left: 30px;
    width: 280px;
    animation: cardFloat3 7s ease-in-out infinite 0.5s;

    @media (max-width: 480px) {
      width: 240px;
      left: 15px;
    }
  }
}

.hero__card-img {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe, #ddd6fe);
  position: relative;

  &--2 {
    height: 100px;
    background: linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4);
  }
}

.hero__card-body {
  padding: 12px 14px;
}

.hero__card-tag {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
}

.hero__card-meta {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.hero__card-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.hero__card-check {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 24px;
  height: 24px;
  background: #7c3aed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__mini-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 10px;
}

.hero__mini-thumb {
  aspect-ratio: 1;
  border-radius: 6px;
  background: linear-gradient(135deg, #e0e7ff, #ddd6fe);

  &:nth-child(2) { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
  &:nth-child(3) { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
  &:nth-child(4) { background: linear-gradient(135deg, #fef3c7, #fde68a); }
  &:nth-child(5) { background: linear-gradient(135deg, #e0f2fe, #bae6fd); }
  &:nth-child(6) { background: linear-gradient(135deg, #ffe4e6, #fecdd3); }
}

.hero__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
}

@keyframes cardFloat1 {
  0%, 100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}

@keyframes cardFloat2 {
  0%, 100% { transform: translateY(0) rotate(1deg); }
  50% { transform: translateY(-16px) rotate(-1deg); }
}

@keyframes cardFloat3 {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// Scroll indicator
.hero__scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 1s ease 1.2s;

  &--visible {
    opacity: 1;
  }
}

.hero__scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, #94a3b8, transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
  50% { opacity: 1; transform: scaleY(1); }
}
</style>
