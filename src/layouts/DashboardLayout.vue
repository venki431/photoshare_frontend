<template>
  <div class="app-layout">
    <div class="app-bg" />

    <!-- Top Navbar -->
    <TopNavbar @toggle-mobile="mobileMenu = true" />

    <!-- Mobile Menu -->
    <MobileMenu v-model="mobileMenu" />

    <!-- Main Content -->
    <main class="app-main">
      <div class="app-container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFolderStore } from '@/stores/folders'
import TopNavbar from '@/components/navigation/TopNavbar.vue'
import MobileMenu from '@/components/navigation/MobileMenu.vue'

const authStore = useAuthStore()
const folderStore = useFolderStore()
const mobileMenu = ref(false)

onMounted(() => {
  if (authStore.isAuthenticated) {
    folderStore.fetchFolders().catch(() => {})
  }
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--ps-surface-dim);
  position: relative;
}

.app-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--ps-gradient-mesh);
  pointer-events: none;
  z-index: 0;
}

.app-main {
  position: relative;
  z-index: 1;
}

.app-container {
  max-width: var(--ps-shell-max-width);
  margin: 0 auto;
  padding: 28px 40px 48px;
  width: 100%;
}

@media (max-width: 1024px) {
  .app-container {
    padding: 24px 24px 36px;
  }
}

@media (max-width: 600px) {
  .app-container {
    padding: 16px 16px 24px;
  }
}

/* ─── Route Transitions ──────────────────────────────────────────────── */

.page-enter-active {
  animation: ps-fade-in-up 0.35s var(--ps-ease-out) both;
}

.page-leave-active {
  animation: ps-fade-in 0.15s ease reverse both;
}
</style>
