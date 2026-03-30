<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled }">
    <div class="nav__container">
      <div class="nav__logo">
        <v-icon size="24" color="#7c3aed">mdi-camera-iris</v-icon>
        <span class="nav__logo-text">PhotoShare</span>
      </div>

      <div class="nav__links" :class="{ 'nav__links--open': menuOpen }">
        <a href="#features" class="nav__link" @click="menuOpen = false">Features</a>
        <a href="#preview" class="nav__link" @click="menuOpen = false">Demo</a>
        <a href="#pricing" class="nav__link" @click="menuOpen = false">Pricing</a>
      </div>

      <div class="nav__actions">
        <button class="nav__btn nav__btn--ghost" @click="$router.push('/login')">Log in</button>
        <button class="nav__btn nav__btn--primary" @click="$router.push('/login')">Get Started</button>
      </div>

      <button class="nav__hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <v-icon size="24">{{ menuOpen ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped lang="scss">
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px;
  transition: all 0.3s ease;

  &--scrolled {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    padding: 10px 24px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
  }
}

.nav__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav__logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.nav__links {
  display: flex;
  gap: 32px;

  @media (max-width: 768px) {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 16px 24px;
    gap: 8px;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);

    &--open {
      display: flex;
    }
  }
}

.nav__link {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
  padding: 8px 0;

  &:hover {
    color: #0f172a;
  }
}

.nav__actions {
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    display: none;
  }
}

.nav__btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &--ghost {
    background: transparent;
    color: #374151;

    &:hover {
      background: #f8fafc;
    }
  }

  &--primary {
    background: #7c3aed;
    color: white;

    &:hover {
      background: #6d28d9;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
    }
  }
}

.nav__hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #374151;

  @media (max-width: 768px) {
    display: block;
  }
}
</style>
