<template>
  <nav class="topnav" :class="{ 'topnav--scrolled': scrolled }">
    <div class="topnav__inner">
      <!-- Left: Logo + Nav Links -->
      <div class="topnav__left">
        <router-link to="/dashboard" class="topnav__logo">
          <div class="logo-mark-sm">P</div>
          <span class="topnav__brand">PhotoShare</span>
        </router-link>

        <div class="topnav__links">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="topnav__link"
            :class="{ 'topnav__link--active': isActive(item.to) }"
          >
            <v-icon size="18" class="topnav__link-icon">{{ item.icon }}</v-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- Right: Avatar Dropdown -->
      <div class="topnav__right">
        <v-menu location="bottom end" :close-on-content-click="true" offset="8">
          <template #activator="{ props }">
            <button class="topnav__avatar-btn" v-bind="props">
              <div class="topnav__avatar">
                {{ authStore.userInitials }}
              </div>
              <v-icon size="16" class="topnav__chevron">mdi-chevron-down</v-icon>
            </button>
          </template>
          <v-card class="topnav__dropdown" elevation="0">
            <div class="topnav__dropdown-user">
              <div class="topnav__avatar topnav__avatar--lg">
                {{ authStore.userInitials }}
              </div>
              <div class="topnav__dropdown-info">
                <div class="topnav__dropdown-name">{{ authStore.userName }}</div>
                <div class="topnav__dropdown-email">{{ authStore.user?.email }}</div>
              </div>
            </div>
            <v-divider />
            <v-list density="compact" class="topnav__dropdown-list">
              <v-list-item @click="handleLogout" class="topnav__dropdown-item">
                <template #prepend>
                  <v-icon size="18" color="error">mdi-logout</v-icon>
                </template>
                <v-list-item-title class="text-error">Sign out</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <!-- Mobile hamburger -->
        <button class="topnav__hamburger" @click="$emit('toggle-mobile')">
          <v-icon size="22">mdi-menu</v-icon>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineEmits<{ 'toggle-mobile': [] }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const scrolled = ref(false)

const navItems = [
  { label: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
  { label: 'Folders', icon: 'mdi-folder-outline', to: '/folders' },
  { label: 'Projects', icon: 'mdi-folder-image', to: '/projects' },
]

function isActive(path: string): boolean {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}

function handleLogout(): void {
  authStore.logout()
  router.push('/login')
}

function onScroll(): void {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.topnav {
  position: sticky;
  top: 12px;
  z-index: 100;
  margin: 12px 16px 0;
  border-radius: var(--ps-radius-lg);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--ps-shadow-sm);
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
}

.topnav--scrolled {
  box-shadow: var(--ps-shadow-md);
  background: rgba(255, 255, 255, 0.88);
}

.topnav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  max-width: var(--ps-shell-max-width);
  margin: 0 auto;
}

/* ─── Left ───────────────────────────────────────────────────────────── */

.topnav__left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.topnav__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-mark-sm {
  width: 32px;
  height: 32px;
  background: var(--ps-gradient-brand);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.2);
}

.topnav__brand {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.topnav__links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.topnav__link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--ps-radius-sm);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  transition: all var(--ps-duration-fast) var(--ps-ease-smooth);
  white-space: nowrap;
}

.topnav__link:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #334155;
}

.topnav__link--active {
  background: rgba(79, 70, 229, 0.08);
  color: var(--ps-primary);
  font-weight: 600;
}

.topnav__link--active:hover {
  background: rgba(79, 70, 229, 0.1);
}

.topnav__link-icon {
  opacity: 0.7;
}

.topnav__link--active .topnav__link-icon {
  opacity: 1;
  color: var(--ps-primary);
}

/* ─── Right ──────────────────────────────────────────────────────────── */

.topnav__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topnav__avatar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border-radius: var(--ps-radius-full);
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background var(--ps-duration-fast);
}

.topnav__avatar-btn:hover {
  background: rgba(0, 0, 0, 0.04);
}

.topnav__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--ps-gradient-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.02em;
  flex-shrink: 0;
}

.topnav__avatar--lg {
  width: 40px;
  height: 40px;
  font-size: 14px;
}

.topnav__chevron {
  color: #94A3B8;
}

/* ─── Dropdown ───────────────────────────────────────────────────────── */

.topnav__dropdown {
  border-radius: var(--ps-radius-lg) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04) !important;
  overflow: hidden;
  min-width: 220px;
}

.topnav__dropdown-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.topnav__dropdown-info {
  min-width: 0;
}

.topnav__dropdown-name {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topnav__dropdown-email {
  font-size: 12px;
  color: #94A3B8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topnav__dropdown-list {
  padding: 4px !important;
}

.topnav__dropdown-item {
  border-radius: var(--ps-radius-sm) !important;
}

/* ─── Mobile Hamburger ───────────────────────────────────────────────── */

.topnav__hamburger {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: #64748B;
  transition: background var(--ps-duration-fast);
}

.topnav__hamburger:hover {
  background: rgba(0, 0, 0, 0.04);
}

/* ─── Responsive ─────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .topnav {
    margin: 8px 12px 0;
    top: 8px;
  }

  .topnav__inner {
    height: 48px;
    padding: 0 14px;
  }

  .topnav__links {
    display: none;
  }

  .topnav__avatar-btn {
    display: none;
  }

  .topnav__hamburger {
    display: flex;
  }

  .topnav__left {
    gap: 0;
  }
}
</style>
