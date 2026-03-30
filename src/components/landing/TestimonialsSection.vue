<template>
  <section class="testimonials">
    <div class="testimonials__container">
      <div v-scroll-reveal class="testimonials__header">
        <span class="section-label section-label--primary">Testimonials</span>
        <h2 class="section-title">Loved by photographers & clients</h2>
      </div>

      <div class="testimonials__grid">
        <div
          v-for="(t, i) in testimonials"
          :key="i"
          v-scroll-reveal="{ delay: i * 100 }"
          class="testimonials__card"
        >
          <div class="testimonials__stars">
            <v-icon v-for="s in 5" :key="s" size="14" color="#f59e0b">mdi-star</v-icon>
          </div>
          <p class="testimonials__text">"{{ t.text }}"</p>
          <div class="testimonials__author">
            <div class="testimonials__avatar" :style="{ background: t.color }">
              {{ t.initials }}
            </div>
            <div>
              <div class="testimonials__name">{{ t.name }}</div>
              <div class="testimonials__role">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Wedding Photographer',
    initials: 'AM',
    color: '#7c3aed',
    text: 'PhotoShare has completely changed how I deliver photos. No more USB drives or confusing Google Drive links. My clients love the selection experience.',
  },
  {
    name: 'Priya Sharma',
    role: 'Client',
    initials: 'PS',
    color: '#2563eb',
    text: 'Selecting our wedding photos was so much fun! The gallery is beautiful and it was incredibly easy to pick our favorites for the album.',
  },
  {
    name: 'Rahul Kapoor',
    role: 'Portrait Photographer',
    initials: 'RK',
    color: '#059669',
    text: 'I used to spend 2 hours per client just on delivery. Now it takes 5 minutes. The compression is incredible — clients can\'t tell the difference.',
  },
  {
    name: 'Sneha Patel',
    role: 'Event Photographer',
    initials: 'SP',
    color: '#dc2626',
    text: 'Managing multiple event galleries was a nightmare before PhotoShare. Now everything is organized in one place with real-time selection tracking.',
  },
  {
    name: 'Vikram Singh',
    role: 'Client',
    initials: 'VS',
    color: '#d97706',
    text: 'No app to download, no account to create. Just opened the link and started selecting. This is how photo delivery should work.',
  },
  {
    name: 'Ananya Roy',
    role: 'Studio Owner',
    initials: 'AR',
    color: '#475569',
    text: 'We onboarded our entire team of 8 photographers in a day. The project management features keep everything organized across all our shoots.',
  },
]
</script>

<style scoped lang="scss">
.testimonials {
  padding: 100px 24px;
  background: white;

  @media (max-width: 600px) {
    padding: 60px 16px;
  }
}

.testimonials__container {
  max-width: 1100px;
  margin: 0 auto;
}

.testimonials__header {
  text-align: center;
  margin-bottom: 48px;
}

.testimonials__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.testimonials__card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #f1f5f9;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
    background: white;
  }
}

.testimonials__stars {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
}

.testimonials__text {
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 20px;
}

.testimonials__author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonials__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
}

.testimonials__name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.testimonials__role {
  font-size: 12px;
  color: #94a3b8;
}
</style>
