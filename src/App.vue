<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
/* ═══════════════════════════════════════════════════════════════════════════
   PHOTOSHARE — PREMIUM DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════════════════════ */

:root {
  /* ── Layout ─────────────────────────────────────────────────────────────── */
  --ps-shell-max-width: 1400px;
  --ps-content-max-width: 1200px;
  --ps-gutter: clamp(16px, 2.5vw, 28px);
  --ps-section-gap: clamp(24px, 3vw, 32px);

  /* ── Colors ─────────────────────────────────────────────────────────────── */
  --ps-primary: #4F46E5;
  --ps-primary-light: #6366F1;
  --ps-primary-dark: #4338CA;
  --ps-secondary: #0EA5E9;
  --ps-accent: #8B5CF6;
  --ps-surface: #FFFFFF;
  --ps-surface-dim: #F8FAFC;
  --ps-surface-container: #F1F5F9;
  --ps-border: rgba(0, 0, 0, 0.06);
  --ps-border-hover: rgba(79, 70, 229, 0.2);

  /* ── Gradients ──────────────────────────────────────────────────────────── */
  --ps-gradient-brand: linear-gradient(135deg, #4F46E5, #0EA5E9);
  --ps-gradient-hero: linear-gradient(135deg, #1e2937 0%, #312e81 45%, #4f46e5 100%);
  --ps-gradient-warm: linear-gradient(135deg, #F59E0B, #EF4444);
  --ps-gradient-success: linear-gradient(135deg, #10B981, #059669);
  --ps-gradient-surface: linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%);
  --ps-gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7));
  --ps-gradient-mesh: radial-gradient(at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%),
                      radial-gradient(at 80% 80%, rgba(14,165,233,0.06) 0%, transparent 50%),
                      radial-gradient(at 50% 50%, rgba(139,92,246,0.04) 0%, transparent 80%);

  /* ── Shadows ────────────────────────────────────────────────────────────── */
  --ps-shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
  --ps-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  --ps-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.04);
  --ps-shadow-lg: 0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px rgba(0, 0, 0, 0.03);
  --ps-shadow-xl: 0 20px 50px -12px rgba(0, 0, 0, 0.12);
  --ps-shadow-glow: 0 0 40px rgba(79, 70, 229, 0.15);
  --ps-shadow-card-hover: 0 8px 24px -4px rgba(79, 70, 229, 0.1), 0 4px 8px rgba(0, 0, 0, 0.03);

  /* ── Radius ─────────────────────────────────────────────────────────────── */
  --ps-radius-sm: 8px;
  --ps-radius-md: 12px;
  --ps-radius-lg: 16px;
  --ps-radius-xl: 20px;
  --ps-radius-2xl: 24px;
  --ps-radius-full: 9999px;

  /* ── Timing ─────────────────────────────────────────────────────────────── */
  --ps-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ps-ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ps-ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ps-duration-fast: 0.15s;
  --ps-duration-normal: 0.25s;
  --ps-duration-slow: 0.4s;

  /* ── Noise Texture ──────────────────────────────────────────────────────── */
  --ps-noise: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

html {
  overflow-y: auto !important;
}

body {
  margin: 0;
  background: var(--ps-surface-dim);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LAYOUT UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-page {
  display: grid;
  align-content: start;
  gap: var(--ps-section-gap);
}

.ps-page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ps-page-intro {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.ps-page-intro > * {
  margin: 0;
}

.ps-page-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.ps-page-toolbar-main {
  display: flex;
  flex: 1 1 680px;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.ps-section-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ps-toolbar-control {
  flex: 1 1 260px;
  min-width: 220px;
  max-width: 320px;
}

.ps-toolbar-toggle {
  flex-shrink: 0;
  align-self: center;
}

.ps-empty-card {
  padding: clamp(32px, 6vw, 48px) !important;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM GLASS & SURFACE STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.ps-glass-dark {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ps-surface-elevated {
  background: white;
  border: 1px solid var(--ps-border);
  border-radius: var(--ps-radius-xl);
  box-shadow: var(--ps-shadow-sm);
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.ps-surface-elevated:hover {
  border-color: var(--ps-border-hover);
  box-shadow: var(--ps-shadow-md);
  transform: translateY(-1px);
}

.ps-gradient-border {
  position: relative;
  background: white;
  border-radius: var(--ps-radius-xl);
}

.ps-gradient-border::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: var(--ps-gradient-brand);
  z-index: -1;
  opacity: 0;
  transition: opacity var(--ps-duration-normal) var(--ps-ease-smooth);
}

.ps-gradient-border:hover::before {
  opacity: 1;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION KEYFRAMES
   ═══════════════════════════════════════════════════════════════════════════ */

@keyframes ps-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes ps-fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ps-fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ps-scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes ps-slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes ps-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes ps-pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes ps-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes ps-gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes ps-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.15); }
  50% { box-shadow: 0 0 40px rgba(79, 70, 229, 0.3); }
}

@keyframes ps-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATION UTILITY CLASSES
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-animate-in {
  animation: ps-fade-in-up 0.6s var(--ps-ease-out) both;
}

.ps-animate-in-delay-1 { animation-delay: 0.1s; }
.ps-animate-in-delay-2 { animation-delay: 0.2s; }
.ps-animate-in-delay-3 { animation-delay: 0.3s; }
.ps-animate-in-delay-4 { animation-delay: 0.4s; }
.ps-animate-in-delay-5 { animation-delay: 0.5s; }

.ps-stagger > * {
  opacity: 0;
  animation: ps-fade-in-up 0.5s var(--ps-ease-out) both;
}

.ps-stagger > *:nth-child(1) { animation-delay: 0.05s; }
.ps-stagger > *:nth-child(2) { animation-delay: 0.1s; }
.ps-stagger > *:nth-child(3) { animation-delay: 0.15s; }
.ps-stagger > *:nth-child(4) { animation-delay: 0.2s; }
.ps-stagger > *:nth-child(5) { animation-delay: 0.25s; }
.ps-stagger > *:nth-child(6) { animation-delay: 0.3s; }
.ps-stagger > *:nth-child(7) { animation-delay: 0.35s; }
.ps-stagger > *:nth-child(8) { animation-delay: 0.4s; }
.ps-stagger > *:nth-child(9) { animation-delay: 0.45s; }
.ps-stagger > *:nth-child(10) { animation-delay: 0.5s; }
.ps-stagger > *:nth-child(11) { animation-delay: 0.55s; }
.ps-stagger > *:nth-child(12) { animation-delay: 0.6s; }

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM BUTTON STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-btn-glow {
  position: relative;
  overflow: hidden;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.ps-btn-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
  opacity: 0;
  transition: opacity var(--ps-duration-normal) var(--ps-ease-smooth);
}

.ps-btn-glow:hover::after {
  opacity: 1;
}

.ps-btn-glow:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.22);
}

.ps-btn-glow:active {
  transform: translateY(0);
}

/* ═══════════════════════════════════════════════════════════════════════════
   PREMIUM SHIMMER / SKELETON
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-shimmer {
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: ps-shimmer 1.5s ease-in-out infinite;
  border-radius: var(--ps-radius-md);
}

/* ═══════════════════════════════════════════════════════════════════════════
   NOISE OVERLAY (for texture)
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-noise::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--ps-noise);
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

/* ═══════════════════════════════════════════════════════════════════════════
   GRADIENT TEXT
   ═══════════════════════════════════════════════════════════════════════════ */

.ps-text-gradient {
  background: var(--ps-gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.ps-text-gradient-warm {
  background: var(--ps-gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLBAR
   ═══════════════════════════════════════════════════════════════════════════ */

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROUTE TRANSITIONS
   ═══════════════════════════════════════════════════════════════���═══════════ */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s var(--ps-ease-smooth);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.page-enter-active {
  animation: ps-fade-in-up 0.3s var(--ps-ease-out) both;
}
.page-leave-active {
  animation: ps-fade-in 0.12s ease reverse both;
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */

@media (max-width: 960px) {
  .ps-toolbar-control {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .ps-page {
    gap: 24px;
  }

  .ps-page-toolbar-main {
    align-items: stretch;
  }

  .ps-toolbar-control {
    width: 100%;
    min-width: 0;
  }

  .ps-toolbar-toggle {
    align-self: flex-start;
  }
}
</style>
