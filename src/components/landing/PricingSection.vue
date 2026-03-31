<template>
  <section class="pricing">
    <div class="pricing__container">
      <div v-scroll-reveal class="pricing__header">
        <span class="section-label">Pricing</span>
        <h2 class="section-title">Start free, scale when ready</h2>
        <p class="section-subtitle">
          No hidden fees. Cancel anytime. Start delivering photos in minutes.
        </p>
      </div>

      <div class="pricing__grid">
        <div
          v-for="(plan, i) in plans"
          :key="i"
          v-scroll-reveal="{ delay: i * 120 }"
          class="pricing__card"
          :class="{ 'pricing__card--featured': plan.featured }"
        >
          <div v-if="plan.featured" class="pricing__badge">Most Popular</div>
          <h3 class="pricing__plan-name">{{ plan.name }}</h3>
          <div class="pricing__price">
            <span class="pricing__amount">{{ plan.price }}</span>
            <span v-if="plan.period" class="pricing__period">/{{ plan.period }}</span>
          </div>
          <p class="pricing__plan-desc">{{ plan.desc }}</p>
          <ul class="pricing__features">
            <li v-for="(f, fi) in plan.features" :key="fi" class="pricing__feature">
              <v-icon size="16" :color="plan.featured ? '#7c3aed' : '#94a3b8'">mdi-check-circle</v-icon>
              {{ f }}
            </li>
          </ul>
          <button class="pricing__btn" :class="{ 'pricing__btn--featured': plan.featured }">
            {{ plan.cta }}
          </button>
        </div>
      </div>

      <!-- Legal Disclaimers -->
      <div v-scroll-reveal="{ delay: 400 }" class="pricing__disclaimers">
        <p class="pricing__disclaimer-title">Important Information</p>
        <ul class="pricing__disclaimer-list">
          <li>All prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. Prices are subject to change with 30 days' prior notice.</li>
          <li>PhotoShare is an image <strong>sharing and selection platform only</strong> — it is not a storage, backup, or archival service. No original files are stored; only compressed versions are retained temporarily.</li>
          <li>Selected images are automatically and permanently deleted from our servers <strong>2 months after client selection</strong>. No recovery is possible after deletion.</li>
          <li>"Unlimited" features are subject to fair usage policies to ensure service quality for all users.</li>
          <li>Subscription fees are non-refundable. Pro-rata refunds may be issued at PhotoShare's sole discretion for termination without cause.</li>
          <li>PhotoShare does not guarantee any specific business outcomes, client acquisition, or revenue as a result of using the Service.</li>
          <li>All gallery images are served in a compressed, watermarked format with anti-download protections. Image quality may differ from originals.</li>
          <li>By subscribing, you agree to our <router-link to="/terms">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link>.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const plans = [
  {
    name: 'Free',
    price: '₹0',
    period: 'month',
    desc: 'Perfect for trying out PhotoShare',
    cta: 'Get Started Free',
    featured: false,
    features: [
      'Up to 3 projects',
      '500 photos per project',
      'Basic compression',
      'Gallery sharing links',
      'Client selection',
    ],
  },
  {
    name: 'Pro',
    price: '₹999',
    period: 'month',
    desc: 'For professional photographers',
    cta: 'Start Pro Trial',
    featured: true,
    features: [
      'Unlimited projects',
      'Unlimited photos',
      'AI-powered compression',
      'Custom branding',
      'Priority CDN delivery',
      'Selection analytics',
      'Email notifications',
    ],
  },
  {
    name: 'Studio',
    price: '₹2,499',
    period: 'month',
    desc: 'For studios and teams',
    cta: 'Contact Sales',
    featured: false,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Client portal',
      'API access',
      'Dedicated support',
      'Custom domain',
    ],
  },
]
</script>

<style scoped lang="scss">
.pricing {
  padding: 100px 24px;
  background: #f8fafc;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.pricing__container {
  max-width: 1000px;
  margin: 0 auto;
}

.pricing__header {
  text-align: center;
  margin-bottom: 48px;
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
}

.pricing__card {
  background: white;
  border-radius: 24px;
  padding: 36px 28px;
  border: 1px solid #f1f5f9;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  }

  &--featured {
    border-color: #7c3aed;
    box-shadow: 0 8px 40px rgba(124, 58, 237, 0.12);

    &:hover {
      box-shadow: 0 16px 48px rgba(124, 58, 237, 0.18);
    }
  }
}

.pricing__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  padding: 4px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.pricing__plan-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.pricing__price {
  margin-bottom: 8px;
}

.pricing__amount {
  font-size: 40px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.pricing__period {
  font-size: 16px;
  color: #94a3b8;
  font-weight: 500;
}

.pricing__plan-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.pricing__features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pricing__feature {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.pricing__btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;

  background: #f1f5f9;
  color: #374151;

  &:hover {
    background: #e2e8f0;
    transform: translateY(-1px);
  }

  &--featured {
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
    color: white;
    box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);

    &:hover {
      box-shadow: 0 6px 24px rgba(124, 58, 237, 0.4);
    }
  }
}

.pricing__disclaimers {
  margin-top: 48px;
  padding: 28px 32px;
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.pricing__disclaimer-title {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 14px;
}

.pricing__disclaimer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 12px;
    color: #94a3b8;
    line-height: 1.6;
    padding-left: 16px;
    position: relative;

    &::before {
      content: '*';
      position: absolute;
      left: 0;
      color: #cbd5e1;
      font-weight: 600;
    }

    strong {
      color: #64748b;
    }

    a {
      color: #7c3aed;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
