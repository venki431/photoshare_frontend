<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<style>
:root {
  --ps-shell-max-width: 1400px;
  --ps-content-max-width: 1200px;
  --ps-gutter: clamp(16px, 2.5vw, 28px);
  --ps-section-gap: clamp(24px, 3vw, 32px);
}

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

html {
  overflow-y: auto !important;
}

body {
  margin: 0;
  background: #F9FAFB;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

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

/* Custom scrollbar */
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

/* Smooth transitions */
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

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
