<template>
  <v-layout class="dashboard-layout">

    <!-- Mobile App Bar -->
    <v-app-bar
      v-if="!lgAndUp"
      flat
      color="surface"
      density="comfortable"
      class="border-b"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-toolbar-title>
        <div class="d-flex align-center ga-2">
          <div class="logo-mark-sm">P</div>
          <span class="text-body-1 font-weight-bold">PhotoShare</span>
        </div>
      </v-toolbar-title>

      <v-spacer />

      <v-avatar size="32" color="primary">
        <span class="text-caption text-white font-weight-bold">
          {{ authStore.userInitials }}
        </span>
      </v-avatar>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="lgAndUp"
      :temporary="!lgAndUp"
      width="264"
      class="sidebar"
    >
      <div class="pa-5 pb-2">
        <!-- Logo -->
        <div class="d-flex align-center ga-3 mb-8">
          <div class="logo-mark">P</div>
          <div>
            <div class="text-body-1 font-weight-bold">PhotoShare</div>
            <div class="text-caption text-medium-emphasis">Pro Studio</div>
          </div>
        </div>

        <!-- Navigation -->
        <v-list density="comfortable" nav class="sidebar-nav">
          <v-list-item
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :prepend-icon="item.icon"
            :title="item.title"
            rounded="lg"
            class="mb-1"
            :active="$route.path === item.to"
            active-color="primary"
          />
        </v-list>

        <v-divider class="my-4" />

        <!-- User section -->
        <div class="sidebar-user">
          <v-avatar size="36" color="primary" class="mr-3">
            <span class="text-caption text-white font-weight-bold">
              {{ authStore.userInitials }}
            </span>
          </v-avatar>
          <div class="flex-grow-1 min-width-0">
            <div class="text-body-2 font-weight-medium text-truncate">{{ authStore.userName }}</div>
            <div class="text-caption text-medium-emphasis text-truncate">{{ authStore.user?.email }}</div>
          </div>
          <v-btn
            icon="mdi-logout"
            size="small"
            variant="text"
            color="medium-emphasis"
            @click="handleLogout"
          />
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-wrapper">
      <v-container fluid class="main-container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

  </v-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'

const { lgAndUp } = useDisplay()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const drawer = ref(true)

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
  { title: 'Projects', icon: 'mdi-folder-image', to: '/projects' },
]

watch(() => route.path, () => {
  if (!lgAndUp.value) {
    drawer.value = false
  }
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Layout */
.dashboard-layout {
  min-height: 100vh;
  background: #F9FAFB;
}

.main-wrapper {
  padding-top: 0 !important;
  display: flex;
  flex-direction: column;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px 40px;
}

@media (max-width: 1024px) {
  .main-container { padding: 20px 24px 32px; }
}

@media (max-width: 600px) {
  .main-container { padding: 16px 16px 24px; }
}

/* Sidebar */
.sidebar {
  border-right: 1px solid rgba(0,0,0,0.06);
  padding-top: 0 !important;
}

.sidebar-nav :deep(.v-list-item) {
  font-weight: 500;
}

.sidebar-nav :deep(.v-list-item--active) {
  font-weight: 600;
}

.sidebar-user {
  display: flex;
  align-items: center;
  padding: 8px 4px;
}

.min-width-0 {
  min-width: 0;
}

/* Logo */
.logo-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4F46E5, #0EA5E9);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 16px;
}

.logo-mark-sm {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #4F46E5, #0EA5E9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 13px;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
