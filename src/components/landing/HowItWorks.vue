<template>
  <section class="how">
    <div class="how__container">
      <div v-scroll-reveal class="how__header">
        <span class="section-label">How It Works</span>
        <h2 class="section-title">Simple for everyone</h2>
        <p class="section-subtitle">
          Whether you're a photographer or a client, PhotoShare makes the process effortless.
        </p>
      </div>

      <div class="how__columns">
        <!-- Photographers -->
        <div v-scroll-reveal class="how__column">
          <div class="how__column-badge how__column-badge--photographer">
            <v-icon size="16" color="#7c3aed">mdi-camera</v-icon>
            For Photographers
          </div>
          <div class="how__timeline">
            <div v-for="(step, i) in photographerSteps" :key="i" v-scroll-reveal="{ delay: i * 100 }" class="how__step">
              <div class="how__step-line">
                <div class="how__step-dot" :style="{ background: step.color }">
                  <v-icon size="14" color="white">{{ step.icon }}</v-icon>
                </div>
                <div v-if="i < photographerSteps.length - 1" class="how__step-connector"></div>
              </div>
              <div class="how__step-content">
                <h4 class="how__step-title">{{ step.title }}</h4>
                <p class="how__step-text">{{ step.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Divider -->
        <div class="how__divider">
          <div class="how__divider-line"></div>
          <div class="how__divider-icon">
            <v-icon size="18" color="#94a3b8">mdi-link-variant</v-icon>
          </div>
          <div class="how__divider-line"></div>
        </div>

        <!-- Clients -->
        <div v-scroll-reveal="{ delay: 150 }" class="how__column">
          <div class="how__column-badge how__column-badge--client">
            <v-icon size="16" color="#2563eb">mdi-account-heart</v-icon>
            For Clients
          </div>
          <div class="how__timeline">
            <div v-for="(step, i) in clientSteps" :key="i" v-scroll-reveal="{ delay: 150 + i * 100 }" class="how__step">
              <div class="how__step-line">
                <div class="how__step-dot" :style="{ background: step.color }">
                  <v-icon size="14" color="white">{{ step.icon }}</v-icon>
                </div>
                <div v-if="i < clientSteps.length - 1" class="how__step-connector"></div>
              </div>
              <div class="how__step-content">
                <h4 class="how__step-title">{{ step.title }}</h4>
                <p class="how__step-text">{{ step.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const photographerSteps = [
  { icon: 'mdi-plus', title: 'Create a Project', text: 'Set up a new project for your event in seconds.', color: '#7c3aed' },
  { icon: 'mdi-upload', title: 'Upload Images', text: 'Drag and drop your photos. Auto-compression handles the rest.', color: '#8b5cf6' },
  { icon: 'mdi-share-variant', title: 'Share the Link', text: 'One click generates a beautiful, shareable gallery link.', color: '#a78bfa' },
]

const clientSteps = [
  { icon: 'mdi-link-variant', title: 'Open the Link', text: 'No signup needed. Just click the link from your photographer.', color: '#2563eb' },
  { icon: 'mdi-heart', title: 'Select Photos', text: 'Browse the gallery, heart your favorites, build your shortlist.', color: '#3b82f6' },
  { icon: 'mdi-check-circle', title: 'Done!', text: 'Submit your selections. Your photographer gets notified instantly.', color: '#60a5fa' },
]
</script>

<style scoped lang="scss">
.how {
  padding: 100px 24px;
  background: linear-gradient(180deg, #faf5ff 0%, #f8fafc 50%, #fff 100%);

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.how__container {
  max-width: 1000px;
  margin: 0 auto;
}

.how__header {
  text-align: center;
  margin-bottom: 64px;
}

.how__columns {
  display: flex;
  gap: 40px;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 32px;
  }
}

.how__column {
  flex: 1;
}

.how__column-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 28px;

  &--photographer {
    background: rgba(124, 58, 237, 0.08);
    color: #7c3aed;
  }

  &--client {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
  }
}

.how__timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.how__step {
  display: flex;
  gap: 16px;
}

.how__step-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.how__step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.how__step-connector {
  width: 2px;
  height: 40px;
  background: linear-gradient(to bottom, #e2e8f0, #f1f5f9);
}

.how__step-content {
  padding-bottom: 32px;
}

.how__step-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.how__step-text {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
}

// Divider
.how__divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 60px;

  @media (max-width: 768px) {
    flex-direction: row;
    padding-top: 0;
  }
}

.how__divider-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, #e2e8f0, transparent);

  @media (max-width: 768px) {
    width: 60px;
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  }
}

.how__divider-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
