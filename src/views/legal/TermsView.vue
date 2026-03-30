<template>
  <div class="legal-page">
    <ScrollProgress />

    <!-- Navigation -->
    <nav class="legal-nav" :class="{ 'legal-nav--scrolled': navScrolled }">
      <div class="legal-nav__inner">
        <router-link to="/" class="legal-nav__logo">
          <v-icon size="22" color="#7c3aed">mdi-camera-iris</v-icon>
          <span class="legal-nav__brand">PhotoShare</span>
        </router-link>
        <div class="legal-nav__links">
          <router-link to="/terms" class="legal-nav__link legal-nav__link--active">Terms</router-link>
          <router-link to="/privacy" class="legal-nav__link">Privacy</router-link>
        </div>
        <router-link to="/" class="legal-nav__back">
          <v-icon size="16">mdi-arrow-left</v-icon>
          Back to Home
        </router-link>
      </div>
    </nav>

    <!-- Hero -->
    <LegalHero
      title="Terms of Service"
      subtitle="Understanding your rights and responsibilities when using PhotoShare. We believe in clarity, fairness, and transparency."
      badge="Legal Agreement"
      icon="mdi-file-document-check-outline"
      last-updated="March 31, 2026"
      reading-time="10"
    />

    <!-- Quick Summary -->
    <div class="legal-summary">
      <div class="legal-summary__inner">
        <div class="legal-summary__header">
          <div class="legal-summary__icon">
            <v-icon size="22" color="white">mdi-lightning-bolt</v-icon>
          </div>
          <div>
            <h3 class="legal-summary__title">What you need to know</h3>
            <p class="legal-summary__subtitle">A quick summary of the key points</p>
          </div>
        </div>
        <div class="legal-summary__grid">
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>You own your photos</strong> — we never claim ownership of your content</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Your data is yours</strong> — delete your account anytime, we'll remove everything</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>No hidden charges</strong> — pricing is transparent and clearly stated</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Fair usage</strong> — use the service responsibly and respect others' rights</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Indian law governs</strong> — disputes resolved under Indian jurisdiction</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>We'll notify changes</strong> — 30-day notice before any significant updates</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile TOC -->
    <div class="mobile-toc">
      <button class="mobile-toc__trigger" @click="mobileTocOpen = !mobileTocOpen">
        <v-icon size="18">mdi-format-list-bulleted</v-icon>
        <span>Table of Contents</span>
        <v-icon size="18">{{ mobileTocOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </button>
      <transition name="toc-expand">
        <div v-show="mobileTocOpen" class="mobile-toc__list">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            class="mobile-toc__link"
            @click.prevent="scrollTo(s.id); mobileTocOpen = false"
          >
            <v-icon size="14">{{ s.icon }}</v-icon>
            {{ s.title }}
          </a>
        </div>
      </transition>
    </div>

    <!-- Main Content -->
    <div class="legal-layout">
      <LegalSidebar :sections="sections" />

      <main class="legal-main">
        <LegalSection id="introduction" title="Introduction" icon="mdi-hand-wave-outline" number="1">
          <p>
            Welcome to PhotoShare ("Platform", "Service", "we", "us", or "our"). These Terms of Service ("Terms") govern your access to and use of the PhotoShare platform, operated by PhotoShare Technologies Pvt. Ltd., a company incorporated under the laws of India.
          </p>
          <p>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service. These Terms constitute a legally binding agreement between you and PhotoShare in accordance with the Information Technology Act, 2000, and the Indian Contract Act, 1872.
          </p>
          <HighlightBox icon="mdi-information-outline" title="Plain English">
            By using PhotoShare, you're agreeing to these rules. They protect both you and us. If something doesn't make sense, reach out — we're happy to explain.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="eligibility" title="Eligibility" icon="mdi-account-check-outline" number="2">
          <p>To use PhotoShare, you must:</p>
          <ul>
            <li>Be at least <strong>18 years of age</strong>, or the age of majority in your jurisdiction</li>
            <li>Have the legal capacity to enter into a binding agreement under applicable Indian laws</li>
            <li>Not be a person barred from receiving services under the laws of India or other applicable jurisdictions</li>
            <li>Use the service only for lawful professional or personal photography purposes</li>
          </ul>
          <p>
            If you are using PhotoShare on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
          </p>
        </LegalSection>

        <LegalSection id="account" title="Account Responsibilities" icon="mdi-shield-account-outline" number="3">
          <p>When you create an account on PhotoShare, you agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and update your information to keep it accurate and complete</li>
            <li>Maintain the security of your account credentials and not share them with others</li>
            <li>Immediately notify us of any unauthorized use of your account</li>
            <li>Accept responsibility for all activities that occur under your account</li>
          </ul>
          <HighlightBox icon="mdi-lock-outline" variant="warning" title="Security Tip">
            Use a strong, unique password for your PhotoShare account. We authenticate via OTP (One-Time Password) sent to your registered email for enhanced security.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="use-of-service" title="Use of Service" icon="mdi-laptop-account" number="4">
          <p>PhotoShare provides a platform for professional photographers to:</p>
          <ul>
            <li>Upload, compress, and organize event photographs</li>
            <li>Create shareable galleries for client viewing</li>
            <li>Enable clients to select, comment on, and submit photo preferences</li>
            <li>Manage project workflows from upload to final delivery</li>
          </ul>
          <p>
            You may use the Service only for its intended purpose. The Service is provided on an "as-is" and "as-available" basis. We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance windows will be communicated in advance via email.
          </p>
        </LegalSection>

        <LegalSection id="content-ownership" title="Content Ownership" icon="mdi-copyright" number="5">
          <HighlightBox icon="mdi-camera-outline" variant="success" title="You own your photos">
            PhotoShare does not claim any ownership rights over the photographs, images, or other content you upload to the Platform. Your content remains entirely yours.
          </HighlightBox>
          <p>By uploading content, you grant PhotoShare a limited, non-exclusive, royalty-free license to:</p>
          <ul>
            <li>Store, process, compress, and display your content as necessary to provide the Service</li>
            <li>Generate thumbnails and optimized versions for gallery viewing</li>
            <li>Share content with designated clients via gallery links you create</li>
          </ul>
          <p>
            This license is solely for the purpose of operating and improving the Service. We will <strong>never sell, sublicense, or use your content for advertising</strong> without your explicit written consent. This license terminates when you delete your content or your account.
          </p>
        </LegalSection>

        <LegalSection id="upload-storage" title="Upload & Storage Rules" icon="mdi-cloud-upload-outline" number="6">
          <p>When uploading content to PhotoShare, you agree to the following:</p>
          <ul>
            <li>You own or have the necessary rights and permissions to upload the content</li>
            <li>Your content does not infringe upon any third-party intellectual property rights</li>
            <li>Your content does not contain obscene, defamatory, or unlawful material as defined under the Information Technology Act, 2000</li>
            <li>You will not upload malicious files, viruses, or harmful code</li>
          </ul>
          <p>
            <strong>Storage Limits:</strong> Each plan has defined storage limits. Free accounts are limited to 3 projects with up to 500 photos total. Paid plans offer expanded limits as detailed on our pricing page. Content may be automatically compressed for optimal delivery but we preserve originals as per your plan settings.
          </p>
          <p>
            <strong>Data Retention:</strong> Content in active accounts is retained indefinitely. For dormant accounts (no login for 12 months), we will send a 30-day notice before archival. Deleted content is permanently removed within 30 days from all systems including backups.
          </p>
        </LegalSection>

        <LegalSection id="prohibited" title="Prohibited Activities" icon="mdi-cancel" number="7">
          <p>You agree not to engage in any of the following activities:</p>
          <ul>
            <li>Violating any applicable laws, including but not limited to the IT Act, 2000, Copyright Act, 1957, or any other Indian legislation</li>
            <li>Uploading content that is obscene, defamatory, invasive of privacy, or violates any person's rights</li>
            <li>Attempting to gain unauthorized access to other accounts, systems, or networks</li>
            <li>Using the Service to distribute spam, malware, or engage in phishing</li>
            <li>Scraping, data mining, or using automated tools to extract content from the platform</li>
            <li>Circumventing or attempting to circumvent any security features or usage limits</li>
            <li>Reselling, renting, or sublicensing the Service without written authorization</li>
            <li>Interfering with or disrupting the integrity or performance of the Service</li>
          </ul>
          <p>
            Violation of these prohibitions may result in immediate suspension or termination of your account, as determined by PhotoShare at its sole discretion.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="Termination" icon="mdi-account-off-outline" number="8">
          <p>
            <strong>By You:</strong> You may terminate your account at any time through your account settings or by contacting our support team at <a href="mailto:support@photoshare.in">support@photoshare.in</a>. Upon termination, your data will be deleted in accordance with our data retention policy.
          </p>
          <p>
            <strong>By Us:</strong> We may suspend or terminate your account if we reasonably believe:
          </p>
          <ul>
            <li>You have violated these Terms or our Acceptable Use Policy</li>
            <li>Your use poses a security risk to the Service or other users</li>
            <li>Your use may subject us to legal liability</li>
            <li>Your account has been inactive for more than 12 consecutive months (with prior notice)</li>
          </ul>
          <p>
            In the event of termination by us for cause, we will provide reasonable notice (except in cases of severe violation) and allow you to export your content where possible. Refunds for pre-paid subscriptions will be handled on a pro-rata basis.
          </p>
        </LegalSection>

        <LegalSection id="liability" title="Limitation of Liability" icon="mdi-scale-balance" number="9">
          <p>
            To the maximum extent permitted by applicable Indian law, including the Consumer Protection Act, 2019, and the Information Technology Act, 2000:
          </p>
          <ul>
            <li>PhotoShare shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service</li>
            <li>Our total aggregate liability shall not exceed the amount paid by you to PhotoShare in the 12 months preceding the event giving rise to the claim</li>
            <li>We are not liable for any loss of data resulting from factors beyond our reasonable control, including but not limited to force majeure events, internet disruptions, or third-party service failures</li>
          </ul>
          <HighlightBox icon="mdi-shield-outline" title="We take data safety seriously">
            While no system is 100% secure, we employ industry-standard encryption, regular backups, and security audits to protect your content and data.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="changes" title="Changes to Terms" icon="mdi-file-edit-outline" number="10">
          <p>
            We reserve the right to modify these Terms at any time. When we make material changes:
          </p>
          <ul>
            <li>We will provide at least <strong>30 days' advance notice</strong> via email to your registered address</li>
            <li>The revised Terms will be posted on this page with an updated "Last modified" date</li>
            <li>Your continued use of the Service after the effective date constitutes acceptance of the updated Terms</li>
            <li>If you do not agree with the changes, you may terminate your account before the changes take effect</li>
          </ul>
          <p>
            We encourage you to review these Terms periodically. Minor non-substantive changes (such as typo corrections or formatting) may be made without notice.
          </p>
        </LegalSection>

        <LegalSection id="governing-law" title="Governing Law & Disputes" icon="mdi-gavel" number="11">
          <p>
            These Terms shall be governed by and construed in accordance with the <strong>laws of India</strong>. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Bangalore, Karnataka, India</strong>.
          </p>
          <p>
            Before initiating any legal proceedings, both parties agree to first attempt resolution through good-faith negotiation for a period of 30 days. If the dispute remains unresolved, either party may refer the matter to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Bangalore.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="Contact Information" icon="mdi-email-outline" number="12">
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <div class="contact-card">
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-email-outline</v-icon>
              <span><strong>Email:</strong> <a href="mailto:legal@photoshare.in">legal@photoshare.in</a></span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-web</v-icon>
              <span><strong>Website:</strong> <a href="https://photoshare.in">photoshare.in</a></span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-map-marker-outline</v-icon>
              <span><strong>Address:</strong> PhotoShare Technologies Pvt. Ltd., Bangalore, Karnataka, India</span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-headset</v-icon>
              <span><strong>Support:</strong> <a href="mailto:support@photoshare.in">support@photoshare.in</a></span>
            </div>
          </div>
          <HighlightBox icon="mdi-chat-outline" variant="info" title="Need help understanding these terms?">
            Our team is happy to explain any part of these Terms in plain language. Just drop us an email and we'll get back to you within 48 hours.
          </HighlightBox>
        </LegalSection>

        <!-- Bottom CTA -->
        <div class="legal-cta">
          <div class="legal-cta__content">
            <h3 class="legal-cta__title">Have questions?</h3>
            <p class="legal-cta__text">Our team is always happy to help you understand your rights and how we protect your data.</p>
            <a href="mailto:support@photoshare.in" class="legal-cta__btn">
              <v-icon size="18">mdi-email-outline</v-icon>
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="legal-footer">
      <div class="legal-footer__inner">
        <span class="legal-footer__copy">&copy; {{ new Date().getFullYear() }} PhotoShare Technologies Pvt. Ltd. All rights reserved.</span>
        <div class="legal-footer__links">
          <router-link to="/privacy" class="legal-footer__link">Privacy Policy</router-link>
          <router-link to="/" class="legal-footer__link">Home</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ScrollProgress from '@/components/legal/ScrollProgress.vue'
import LegalHero from '@/components/legal/LegalHero.vue'
import LegalSidebar from '@/components/legal/LegalSidebar.vue'
import LegalSection from '@/components/legal/LegalSection.vue'
import HighlightBox from '@/components/legal/HighlightBox.vue'

const navScrolled = ref(false)
const mobileTocOpen = ref(false)

const sections = [
  { id: 'introduction', title: 'Introduction', icon: 'mdi-hand-wave-outline' },
  { id: 'eligibility', title: 'Eligibility', icon: 'mdi-account-check-outline' },
  { id: 'account', title: 'Account Responsibilities', icon: 'mdi-shield-account-outline' },
  { id: 'use-of-service', title: 'Use of Service', icon: 'mdi-laptop-account' },
  { id: 'content-ownership', title: 'Content Ownership', icon: 'mdi-copyright' },
  { id: 'upload-storage', title: 'Upload & Storage Rules', icon: 'mdi-cloud-upload-outline' },
  { id: 'prohibited', title: 'Prohibited Activities', icon: 'mdi-cancel' },
  { id: 'termination', title: 'Termination', icon: 'mdi-account-off-outline' },
  { id: 'liability', title: 'Limitation of Liability', icon: 'mdi-scale-balance' },
  { id: 'changes', title: 'Changes to Terms', icon: 'mdi-file-edit-outline' },
  { id: 'governing-law', title: 'Governing Law & Disputes', icon: 'mdi-gavel' },
  { id: 'contact', title: 'Contact Information', icon: 'mdi-email-outline' },
]

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function handleScroll() {
  navScrolled.value = window.scrollY > 20
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   LEGAL PAGE — SHARED LAYOUT STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

.legal-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* ── Navigation ───────────────────────────────────────────────────────── */

.legal-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 14px 24px;
  transition: all 0.3s ease;
}

.legal-nav--scrolled {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 10px 24px;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.04);
}

.legal-nav__inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.legal-nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.legal-nav__brand {
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.legal-nav--scrolled .legal-nav__brand {
  color: #0f172a;
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__brand {
  color: white;
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__logo .v-icon {
  color: rgba(255, 255, 255, 0.9) !important;
}

.legal-nav__links {
  display: flex;
  gap: 4px;
}

.legal-nav__link {
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__link {
  color: rgba(255, 255, 255, 0.6);
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__link--active {
  color: white;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 600;
}

.legal-nav--scrolled .legal-nav__link {
  color: #64748b;
}

.legal-nav--scrolled .legal-nav__link:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.legal-nav--scrolled .legal-nav__link--active {
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
  font-weight: 600;
}

.legal-nav__back {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__back {
  color: rgba(255, 255, 255, 0.5);
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__back:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.legal-nav--scrolled .legal-nav__back {
  color: #64748b;
}

.legal-nav--scrolled .legal-nav__back:hover {
  color: #0f172a;
  background: #f1f5f9;
}

@media (max-width: 768px) {
  .legal-nav__links { display: none; }
  .legal-nav__back span { display: none; }
}

/* ── Quick Summary ────────────────────────────────────────────────────── */

.legal-summary {
  max-width: 900px;
  margin: -40px auto 0;
  padding: 0 24px;
  position: relative;
  z-index: 10;
}

.legal-summary__inner {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.legal-summary__header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.legal-summary__icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #7c3aed, #4F46E5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.legal-summary__title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.legal-summary__subtitle {
  font-size: 13px;
  color: #94a3b8;
  margin: 2px 0 0;
}

.legal-summary__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
}

.summary-item .v-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.summary-item strong {
  color: #1e293b;
}

@media (max-width: 640px) {
  .legal-summary__grid {
    grid-template-columns: 1fr;
  }

  .legal-summary__inner {
    padding: 24px 20px;
  }
}

/* ── Mobile TOC ───────────────────────────────────────────────────────── */

.mobile-toc {
  display: none;
  max-width: 900px;
  margin: 20px auto 0;
  padding: 0 24px;
}

@media (max-width: 1024px) {
  .mobile-toc { display: block; }
}

.mobile-toc__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.mobile-toc__trigger:hover {
  border-color: rgba(124, 58, 237, 0.2);
}

.mobile-toc__trigger .v-icon:last-child {
  margin-left: auto;
}

.mobile-toc__list {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-top: none;
  border-radius: 0 0 14px 14px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mobile-toc__link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  text-decoration: none;
  transition: all 0.15s;
}

.mobile-toc__link:hover {
  background: rgba(124, 58, 237, 0.04);
  color: #7c3aed;
}

.toc-expand-enter-active,
.toc-expand-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.toc-expand-enter-from,
.toc-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* ── Main Layout ──────────────────────────────────────────────────────── */

.legal-layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 60px;
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

.legal-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Contact Card ─────────────────────────────────────────────────────── */

.contact-card {
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #475569;
}

/* ── Bottom CTA ───────────────────────────────────────────────────────── */

.legal-cta {
  margin-top: 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
  padding: 48px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.legal-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 24px 24px;
}

.legal-cta__content {
  position: relative;
  z-index: 1;
}

.legal-cta__title {
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin: 0 0 10px;
}

.legal-cta__text {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.legal-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 12px;
  background: white;
  color: #4F46E5;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.legal-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* ── Footer ───────────────────────────────────────────────────────────── */

.legal-footer {
  border-top: 1px solid #f1f5f9;
  padding: 24px;
  background: white;
}

.legal-footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.legal-footer__copy {
  font-size: 13px;
  color: #94a3b8;
}

.legal-footer__links {
  display: flex;
  gap: 20px;
}

.legal-footer__link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.legal-footer__link:hover {
  color: #7c3aed;
}

@media (max-width: 768px) {
  .legal-layout {
    padding: 32px 16px 48px;
  }

  .legal-footer__inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
