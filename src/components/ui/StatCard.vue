<template>
  <div class="stat-card" :class="`stat-card--${color}`">
    <div class="stat-card__bg" />

    <div class="stat-card__content">
      <div class="stat-card__header">
        <div class="stat-card__icon">
          <v-icon size="24" color="white">{{ icon }}</v-icon>
        </div>
        <v-chip
          v-if="chip"
          size="x-small"
          :color="chipColor"
          variant="tonal"
          class="font-weight-bold"
        >
          {{ chip }}
        </v-chip>
      </div>

      <div class="stat-card__body">
        <div class="stat-card__value">{{ value }}</div>
        <div class="stat-card__label text-body-2 text-medium-emphasis">{{ title }}</div>
      </div>
    </div>

    <!-- Glow effect on hover -->
    <div class="stat-card__glow" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  value?: string | number
  icon?: string
  color?: string
  chip?: string
  chipColor?: string
}>()
</script>

<style scoped>
.stat-card {
  position: relative;
  border-radius: var(--ps-radius-md);
  background: white;
  border: 1px solid var(--ps-border);
  padding: 20px;
  overflow: hidden;
  transition: all var(--ps-duration-normal) var(--ps-ease-smooth);
  cursor: default;
}

.stat-card:hover {
  border-color: var(--ps-border-hover);
  transform: translateY(-2px);
  box-shadow: var(--ps-shadow-md);
}

.stat-card__bg {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--ps-duration-normal) var(--ps-ease-smooth);
}

.stat-card:hover .stat-card__bg {
  opacity: 1;
}

.stat-card--primary .stat-card__bg {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(99, 102, 241, 0.06));
}
.stat-card--warning .stat-card__bg {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.03), rgba(251, 191, 36, 0.06));
}
.stat-card--info .stat-card__bg {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(96, 165, 250, 0.06));
}
.stat-card--success .stat-card__bg {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(52, 211, 153, 0.06));
}

.stat-card__glow {
  position: absolute;
  bottom: -50%;
  right: -20%;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  filter: blur(50px);
  opacity: 0;
  transition: opacity var(--ps-duration-slow) var(--ps-ease-smooth);
  pointer-events: none;
}

.stat-card:hover .stat-card__glow { opacity: 1; }

.stat-card--primary .stat-card__glow { background: rgba(79, 70, 229, 0.1); }
.stat-card--warning .stat-card__glow { background: rgba(245, 158, 11, 0.1); }
.stat-card--info .stat-card__glow { background: rgba(59, 130, 246, 0.1); }
.stat-card--success .stat-card__glow { background: rgba(16, 185, 129, 0.1); }

.stat-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-card__icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--ps-duration-normal) var(--ps-ease-spring);
}

.stat-card:hover .stat-card__icon {
  transform: scale(1.08);
}

.stat-card--primary .stat-card__icon { background: var(--ps-gradient-brand); }
.stat-card--warning .stat-card__icon { background: linear-gradient(135deg, #F59E0B, #FBBF24); }
.stat-card--info .stat-card__icon { background: linear-gradient(135deg, #3B82F6, #60A5FA); }
.stat-card--success .stat-card__icon { background: var(--ps-gradient-success); }

.stat-card__body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-card__value {
  font-size: clamp(24px, 3vw, 30px);
  font-weight: 700;
  line-height: 1;
  color: #0F172A;
  letter-spacing: -0.02em;
}

.stat-card__label {
  font-weight: 500;
}

@media (max-width: 600px) {
  .stat-card {
    padding: 18px;
    border-radius: var(--ps-radius-lg);
  }

  .stat-card__icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .stat-card__icon .v-icon {
    font-size: 20px !important;
  }
}
</style>
