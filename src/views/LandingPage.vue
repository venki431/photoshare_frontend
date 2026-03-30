<template>
  <div class="landing" v-scroll-smooth>
    <LandingNav />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <div id="features">
      <FeaturesSection />
    </div>
    <PreviewSection />
    <HowItWorks />
    <TestimonialsSection />
    <div id="pricing">
      <PricingSection />
    </div>
    <CTASection />
    <FooterSection />
  </div>
</template>

<script setup>
import LandingNav from '@/components/landing/LandingNav.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import ProblemSection from '@/components/landing/ProblemSection.vue'
import SolutionSection from '@/components/landing/SolutionSection.vue'
import FeaturesSection from '@/components/landing/FeaturesSection.vue'
import PreviewSection from '@/components/landing/PreviewSection.vue'
import HowItWorks from '@/components/landing/HowItWorks.vue'
import TestimonialsSection from '@/components/landing/TestimonialsSection.vue'
import PricingSection from '@/components/landing/PricingSection.vue'
import CTASection from '@/components/landing/CTASection.vue'
import FooterSection from '@/components/landing/FooterSection.vue'

// Smooth scroll directive
const vScrollSmooth = {
  mounted(el) {
    el.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      e.preventDefault()
      const target = document.querySelector(anchor.getAttribute('href'))
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  },
}
</script>

<style lang="scss">
// Global landing page styles — scroll reveal
.sr-hidden {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.sr-hidden[data-sr-direction="left"] {
  transform: translateX(-24px);
}

.sr-hidden[data-sr-direction="right"] {
  transform: translateX(24px);
}

.sr-hidden[data-sr-direction="scale"] {
  transform: scale(0.95);
}

.sr-visible {
  opacity: 1 !important;
  transform: none !important;
}

// Section typography
.section-label {
  display: inline-block;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 12px;

  &--primary {
    color: #7c3aed;
  }
}

.section-title {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.6;
  color: #64748b;
  max-width: 540px;
  margin: 0 auto;
}

// Landing page reset
.landing {
  background: white;
  min-height: 100vh;
}
</style>
