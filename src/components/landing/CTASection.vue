<template>
  <section class="cta">
    <div class="cta__bg">
      <div class="cta__blob cta__blob--1"></div>
      <div class="cta__blob cta__blob--2"></div>
    </div>
    <div v-scroll-reveal class="cta__container">
      <h2 class="cta__title">Start delivering photos the smart way</h2>
      <p class="cta__subtitle">
        Join 500+ photographers who have already simplified their workflow.
        Free to start, no credit card required.
      </p>
      <div class="cta__actions">
        <button class="cta__btn cta__btn--primary" @click="$router.push('/login')">
          Create Your First Project
          <v-icon size="18">mdi-arrow-right</v-icon>
        </button>
      </div>
      <div class="cta__trust">
        <v-icon size="14" color="#a78bfa">mdi-shield-check</v-icon>
        <span>Free plan available · No credit card · Setup in 2 minutes</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cta {
  position: relative;
  padding: 100px 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
  overflow: hidden;
  text-align: center;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.cta__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.cta__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;

  &--1 {
    width: 600px;
    height: 600px;
    background: #7c3aed;
    top: -200px;
    right: -200px;
    animation: ctaFloat 20s ease-in-out infinite;
  }

  &--2 {
    width: 400px;
    height: 400px;
    background: #2563eb;
    bottom: -150px;
    left: -100px;
    animation: ctaFloat 15s ease-in-out infinite reverse;
  }
}

@keyframes ctaFloat {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}

.cta__container {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
}

.cta__title {
  font-size: clamp(28px, 4vw, 44px);
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.cta__subtitle {
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 32px;
}

.cta__actions {
  margin-bottom: 20px;
}

.cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &--primary {
    padding: 16px 36px;
    background: white;
    color: #0f172a;
    border-radius: 14px;
    font-size: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }
  }
}

.cta__trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}
</style>
