<template>
  <footer class="footer">
    <div class="footer__container">
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo">
            <v-icon size="24" color="#7c3aed">mdi-camera-iris</v-icon>
            <span class="footer__logo-text">PhotoShare</span>
          </div>
          <p class="footer__desc">
            The modern way to deliver and manage client photo selections.
          </p>
          <div class="footer__socials">
            <a v-for="s in socials" :key="s.icon" class="footer__social" href="#" aria-label="Social link">
              <v-icon size="18" color="#94a3b8">{{ s.icon }}</v-icon>
            </a>
          </div>
        </div>

        <div v-for="group in links" :key="group.title" class="footer__group">
          <h4 class="footer__group-title">{{ group.title }}</h4>
          <ul class="footer__group-list">
            <li v-for="link in group.items" :key="link">
              <a href="#" class="footer__link">{{ link }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer__bottom">
        <span class="footer__copy">&copy; {{ year }} PhotoShare. All rights reserved.</span>
        <div class="footer__bottom-links">
          <router-link to="/privacy" class="footer__link">Privacy</router-link>
          <router-link to="/terms" class="footer__link">Terms</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Social {
  icon: string
}

interface LinkGroup {
  title: string
  items: string[]
}

const year: number = new Date().getFullYear()

const socials: Social[] = [
  { icon: 'mdi-twitter' },
  { icon: 'mdi-instagram' },
  { icon: 'mdi-linkedin' },
]

const links: LinkGroup[] = [
  {
    title: 'Product',
    items: ['Features', 'Pricing', 'Demo', 'Changelog'],
  },
  {
    title: 'Company',
    items: ['About', 'Blog', 'Careers', 'Contact'],
  },
  {
    title: 'Support',
    items: ['Help Center', 'Documentation', 'Status', 'API'],
  },
]
</script>

<style scoped lang="scss">
.footer {
  padding: 60px 24px 32px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 600px) {
    padding: 40px 16px 24px;
  }
}

.footer__container {
  max-width: 1100px;
  margin: 0 auto;
}

.footer__top {
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer__logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.footer__desc {
  font-size: 13px;
  line-height: 1.6;
  color: #64748b;
  max-width: 260px;
}

.footer__socials {
  display: flex;
  gap: 8px;
}

.footer__social {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: white;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    border-color: #e2e8f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
}

.footer__group-title {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer__group-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer__link {
  font-size: 14px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #7c3aed;
  }
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}

.footer__copy {
  font-size: 13px;
  color: #94a3b8;
}

.footer__bottom-links {
  display: flex;
  gap: 20px;
}
</style>
