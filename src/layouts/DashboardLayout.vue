<template>
  <v-layout class="dashboard-layout">

    <!-- Mobile App Bar -->
    <header v-if="!lgAndUp" class="mobile-header ps-glass">
      <button class="mobile-menu-btn" @click="drawer = !drawer">
        <v-icon size="22">mdi-menu</v-icon>
      </button>

      <div class="mobile-brand">
        <div class="logo-mark-sm">P</div>
        <span class="brand-name">PhotoShare</span>
      </div>

      <v-avatar size="32" class="mobile-avatar">
        <div class="avatar-inner">
          {{ authStore.userInitials }}
        </div>
      </v-avatar>
    </header>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :permanent="lgAndUp"
      :temporary="!lgAndUp"
      width="272"
      class="sidebar"
      :class="{ 'sidebar--mobile': !lgAndUp }"
    >
      <div class="sidebar__inner">
        <!-- Logo Area -->
        <div class="sidebar__brand">
          <div class="logo-mark">
            <span class="logo-letter">P</span>
            <div class="logo-shine" />
          </div>
          <div class="brand-text">
            <div class="brand-name">PhotoShare</div>
            <div class="brand-tier">Pro Studio</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar__nav">
          <div class="nav-label">Menu</div>
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ 'nav-item--active': $route.path === item.to }"
          >
            <div class="nav-item__icon">
              <v-icon size="20">{{ item.icon }}</v-icon>
            </div>
            <span class="nav-item__label">{{ item.title }}</span>
            <div v-if="$route.path === item.to" class="nav-item__indicator" />
          </router-link>
        </nav>

        <!-- Quick Stats -->
        <div class="sidebar__stats">
          <div class="nav-label">Quick Stats</div>
          <div class="quick-stat">
            <span class="quick-stat__label">Total Projects</span>
            <span class="quick-stat__value">{{ projectStore.totalProjects }}</span>
          </div>
          <div class="quick-stat">
            <span class="quick-stat__label">Total Photos</span>
            <span class="quick-stat__value">{{ projectStore.totalImages }}</span>
          </div>
        </div>

        <!-- User Section -->
        <div class="sidebar__user">
          <div class="user-card">
            <v-avatar size="38" class="user-avatar">
              <div class="avatar-inner">{{ authStore.userInitials }}</div>
            </v-avatar>
            <div class="user-info">
              <div class="user-name text-truncate">{{ authStore.userName }}</div>
              <div class="user-email text-truncate">{{ authStore.user?.email }}</div>
            </div>
            <button class="logout-btn" @click="handleLogout" title="Sign out">
              <v-icon size="18">mdi-logout</v-icon>
            </button>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-wrapper">
      <div class="main-bg" />
      <div class="main-container">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </v-main>

  </v-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/projects'

const { lgAndUp } = useDisplay()
const authStore = useAuthStore()
const projectStore = useProjectStore()
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
/* ═══════════════════════════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════════════════════════ */

.dashboard-layout {
  min-height: 100vh;
  background: var(--ps-surface-dim);
}

.main-wrapper {
  padding-top: 0 !important;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-bg {
  position: fixed;
  top: 0;
  right: 0;
  width: 60%;
  height: 100vh;
  background: var(--ps-gradient-mesh);
  pointer-events: none;
  z-index: 0;
}

.main-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px 48px;
  width: 100%;
}

@media (max-width: 1024px) {
  .main-container { padding: 24px 24px 36px; }
}

@media (max-width: 600px) {
  .main-container { padding: 80px 16px 24px; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.mobile-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--ps-radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--ps-duration-fast);
}

.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-brand .brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}

.mobile-avatar {
  background: none !important;
}

.mobile-avatar .avatar-inner {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR
   ═══════════════════════════════════════════════════════════════════════════ */

.sidebar {
  border-right: none !important;
  background: white !important;
  box-shadow: 1px 0 0 var(--ps-border), 4px 0 24px rgba(0, 0, 0, 0.03) !important;
}

.sidebar--mobile {
  box-shadow: 8px 0 40px rgba(0, 0, 0, 0.12) !important;
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 24px 16px 16px;
  gap: 8px;
}

/* ── Brand ──────────────────────────────────────────────────────────────── */

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 8px;
  margin-bottom: 16px;
}

.logo-mark {
  position: relative;
  width: 40px;
  height: 40px;
  background: var(--ps-gradient-brand);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.logo-letter {
  color: white;
  font-weight: 800;
  font-size: 18px;
  position: relative;
  z-index: 1;
}

.logo-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 60%
  );
  animation: logo-shine 3s ease-in-out infinite;
}

@keyframes logo-shine {
  0%, 100% { transform: translateX(-100%) translateY(-100%); }
  50% { transform: translateX(100%) translateY(100%); }
}

.logo-mark-sm {
  width: 28px;
  height: 28px;
  background: var(--ps-gradient-brand);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 13px;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.2;
}

.brand-tier {
  font-size: 12px;
  color: #94A3B8;
  font-weight: 500;
}

/* ── Navigation ─────────────────────────────────────────────────────────── */

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.nav-label {
  font-size: 11px;
  font-weight: 600;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 12px 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--ps-radius-md);
  text-decoration: none;
  color: #64748B;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  transition: all var(--ps-duration-fast) var(--ps-ease-smooth);
}

.nav-item:hover {
  background: #F8FAFC;
  color: #334155;
}

.nav-item--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
  font-weight: 600;
}

.nav-item--active:hover {
  background: rgba(79, 70, 229, 0.08);
}

.nav-item__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: all var(--ps-duration-fast) var(--ps-ease-smooth);
}

.nav-item--active .nav-item__icon {
  background: var(--ps-gradient-brand);
  color: white;
  box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
}

.nav-item--active .nav-item__icon .v-icon {
  color: white !important;
}

.nav-item__indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  border-radius: 3px 0 0 3px;
  background: var(--ps-gradient-brand);
}

/* ── Quick Stats ────────────────────────────────────────────────────────── */

.sidebar__stats {
  margin-top: auto;
  padding: 0 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quick-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--ps-radius-sm);
}

.quick-stat__label {
  font-size: 13px;
  color: #94A3B8;
  font-weight: 500;
}

.quick-stat__value {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
}

/* ── User Section ───────────────────────────────────────────────────────── */

.sidebar__user {
  padding: 4px;
  margin-top: 8px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--ps-radius-md);
  background: #F8FAFC;
  border: 1px solid var(--ps-border);
  transition: all var(--ps-duration-fast);
}

.user-card:hover {
  background: #F1F5F9;
}

.user-avatar {
  background: none !important;
  flex-shrink: 0;
}

.avatar-inner {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.02em;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1E293B;
  line-height: 1.3;
}

.user-email {
  font-size: 12px;
  color: #94A3B8;
  line-height: 1.3;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94A3B8;
  flex-shrink: 0;
  transition: all var(--ps-duration-fast);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #EF4444;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROUTE TRANSITIONS
   ═══════════════════════════════════════════════════════════════════════════ */

.page-enter-active {
  animation: ps-fade-in-up 0.35s var(--ps-ease-out) both;
}

.page-leave-active {
  animation: ps-fade-in 0.15s ease reverse both;
}
</style>
