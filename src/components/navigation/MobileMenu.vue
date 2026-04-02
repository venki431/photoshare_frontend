<template>
  <transition name="mobile-menu">
    <div v-if="modelValue" class="mobile-menu-overlay" @click.self="$emit('update:modelValue', false)">
      <div class="mobile-menu">
        <div class="mobile-menu__header">
          <div class="mobile-menu__brand">
            <div class="logo-mark-sm">P</div>
            <span class="brand-name">PhotoShare</span>
          </div>
          <button class="mobile-menu__close" @click="$emit('update:modelValue', false)">
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <nav class="mobile-menu__nav">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="mobile-menu__link"
            :class="{ 'mobile-menu__link--active': isActive(item.to) }"
            @click="$emit('update:modelValue', false)"
          >
            <v-icon size="20">{{ item.icon }}</v-icon>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <v-divider class="my-2" />

        <div class="mobile-menu__user">
          <div class="mobile-menu__avatar">{{ authStore.userInitials }}</div>
          <div class="mobile-menu__user-info">
            <div class="mobile-menu__user-name">{{ authStore.userName }}</div>
            <div class="mobile-menu__user-email">{{ authStore.user?.email }}</div>
          </div>
        </div>

        <button class="mobile-menu__logout" @click="handleLogout">
          <v-icon size="18" color="error">mdi-logout</v-icon>
          <span>Sign out</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

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
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

.mobile-menu {
  position: absolute;
  top: 0;
  right: 0;
  width: min(300px, 85vw);
  height: 100%;
  background: white;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 8px;
}

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0 12px;
}

.mobile-menu__brand {
  display: flex;
  align-items: center;
  gap: 10px;
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
}

.brand-name {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.mobile-menu__close {
  width: 36px;
  height: 36px;
  border-radius: var(--ps-radius-sm);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--ps-radius-md);
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  color: #64748B;
  transition: all var(--ps-duration-fast);
}

.mobile-menu__link:hover {
  background: #F8FAFC;
}

.mobile-menu__link--active {
  background: rgba(79, 70, 229, 0.06);
  color: var(--ps-primary);
  font-weight: 600;
}

.mobile-menu__user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
}

.mobile-menu__avatar {
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
  flex-shrink: 0;
}

.mobile-menu__user-info {
  min-width: 0;
}

.mobile-menu__user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1E293B;
}

.mobile-menu__user-email {
  font-size: 12px;
  color: #94A3B8;
}

.mobile-menu__logout {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--ps-radius-md);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #EF4444;
  transition: background var(--ps-duration-fast);
  margin-top: auto;
}

.mobile-menu__logout:hover {
  background: rgba(239, 68, 68, 0.06);
}

/* ─── Transitions ────────────────────────────────────────────────────── */

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-menu-enter-active .mobile-menu,
.mobile-menu-leave-active .mobile-menu {
  transition: transform 0.3s var(--ps-ease-out);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu,
.mobile-menu-leave-to .mobile-menu {
  transform: translateX(100%);
}
</style>
