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
          <router-link to="/terms" class="legal-nav__link">Terms</router-link>
          <router-link to="/privacy" class="legal-nav__link legal-nav__link--active">Privacy</router-link>
        </div>
        <router-link to="/" class="legal-nav__back">
          <v-icon size="16">mdi-arrow-left</v-icon>
          Back to Home
        </router-link>
      </div>
    </nav>

    <!-- Hero -->
    <LegalHero
      title="Privacy Policy"
      subtitle="How we collect, use, protect, and respect your personal information. Your privacy is not just a policy — it's a promise."
      badge="Data Protection"
      icon="mdi-lock-check-outline"
      last-updated="March 31, 2026"
      reading-time="15"
    />

    <!-- Quick Summary -->
    <div class="legal-summary">
      <div class="legal-summary__inner">
        <div class="legal-summary__header">
          <div class="legal-summary__icon">
            <v-icon size="22" color="white">mdi-shield-check</v-icon>
          </div>
          <div>
            <h3 class="legal-summary__title">Your privacy at a glance</h3>
            <p class="legal-summary__subtitle">Key commitments we make to you</p>
          </div>
        </div>
        <div class="legal-summary__grid">
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>We never sell your data</strong> — your information is not a product</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>No originals stored</strong> — we only store compressed versions of your images</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Auto-deleted in 2 months</strong> — selected images are permanently removed after 2 months</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Sharing & selection only</strong> — not a backup or storage service</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>No sneaky tracking</strong> — we only use essential analytics</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Indian law compliant</strong> — adhering to IT Act 2000 & SPDI Rules 2011</span>
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
        <LegalSection id="info-collect" title="Information We Collect" icon="mdi-database-outline" number="1">
          <p>We collect information that you provide directly and information generated through your use of the Service:</p>

          <p><strong>Information You Provide:</strong></p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number when you create an account</li>
            <li><strong>Profile Data:</strong> Business name, profile photo, and studio details</li>
            <li><strong>Content (Compressed Only):</strong> When you upload photos and images, we process and store only compressed versions of your content. Original files are not retained on our servers</li>
            <li><strong>Project Data:</strong> Client names, contact details, event types, and project metadata you enter</li>
            <li><strong>Communications:</strong> Messages, feedback, and support requests you send us</li>
          </ul>

          <p><strong>Information Collected Automatically:</strong></p>
          <ul>
            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
            <li><strong>Usage Data:</strong> Pages viewed, features used, session duration, and interaction patterns</li>
            <li><strong>Log Data:</strong> IP addresses, access times, and referring URLs</li>
            <li><strong>Performance Data:</strong> Upload speeds, compression metrics, and error logs for service optimization</li>
          </ul>

          <HighlightBox icon="mdi-eye-off-outline" variant="success" title="What we DON'T collect or store">
            We do not store original high-resolution photographs. All uploaded content is compressed for viewing and selection purposes only. We do not scan, analyze, or process the content of your photographs using facial recognition or AI analysis. Original files are permanently discarded after compression.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="data-usage" title="How We Use Your Data" icon="mdi-cog-outline" number="2">
          <p>We use collected information for the following purposes:</p>
          <ul>
            <li><strong>Service Delivery:</strong> To operate, maintain, and improve PhotoShare's core functionality including photo upload, compression, gallery creation, and client selection</li>
            <li><strong>Account Management:</strong> To create and manage your account, authenticate access, and provide customer support</li>
            <li><strong>Communication:</strong> To send you essential service notifications, security alerts, OTP codes, and support responses</li>
            <li><strong>Service Improvement:</strong> To understand usage patterns, diagnose issues, and develop new features</li>
            <li><strong>Safety & Security:</strong> To detect, prevent, and address fraud, abuse, and security threats</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes under Indian jurisdiction</li>
          </ul>

          <HighlightBox icon="mdi-bullhorn-outline" variant="warning" title="Marketing Communications">
            We will never send unsolicited marketing emails. If we ever introduce optional marketing communications, they will be strictly opt-in with clear unsubscribe options in every message, as required under Indian law.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="cookies" title="Cookies & Tracking" icon="mdi-cookie-outline" number="3">
          <p>PhotoShare uses a minimal set of cookies and similar technologies:</p>

          <p><strong>Essential Cookies (Required):</strong></p>
          <ul>
            <li><strong>Authentication Token:</strong> To keep you securely logged in (stored in localStorage)</li>
            <li><strong>Session Management:</strong> To maintain your session state across pages</li>
          </ul>

          <p><strong>Analytics (Optional):</strong></p>
          <ul>
            <li>We may use privacy-friendly analytics (such as Plausible or self-hosted solutions) to understand aggregate usage patterns</li>
            <li>These do not use third-party tracking cookies and do not track individual users across websites</li>
          </ul>

          <p>
            We do <strong>not</strong> use advertising cookies, social media tracking pixels, or cross-site tracking technologies. We do not participate in any advertising networks or data broker services.
          </p>
        </LegalSection>

        <LegalSection id="data-security" title="Data Storage & Security" icon="mdi-shield-lock-outline" number="4">
          <p>Protecting your data is a top priority. We implement multiple layers of security:</p>
          <ul>
            <li><strong>Encryption in Transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher (HTTPS)</li>
            <li><strong>Encryption at Rest:</strong> Stored data including compressed photos and personal information is encrypted using AES-256 encryption</li>
            <li><strong>Access Controls:</strong> Strict role-based access controls ensure only authorized personnel can access user data</li>
            <li><strong>Regular Audits:</strong> We conduct periodic security assessments and vulnerability testing</li>
            <li><strong>Secure Infrastructure:</strong> Our services are hosted on certified cloud infrastructure with SOC 2 compliance</li>
            <li><strong>Incident Response:</strong> We maintain an incident response plan and will notify affected users within 72 hours of any confirmed data breach, as required under the IT Act, 2000</li>
          </ul>

          <HighlightBox icon="mdi-alert-outline" variant="warning" title="Important: Compressed Data Only">
            PhotoShare stores only compressed versions of uploaded content — original files are never stored on our servers. While we employ industry-standard security for the compressed data we hold, PhotoShare is not responsible for the security, preservation, or availability of your original files. Users must maintain their own backups of all original content.
          </HighlightBox>

          <HighlightBox icon="mdi-server-security" title="Data Location">
            Your data is primarily stored on servers located in India (Mumbai region) and Singapore, ensuring compliance with Indian data localization preferences. We do not transfer data outside of these regions without your explicit consent.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="third-party" title="Third-Party Services" icon="mdi-link-variant" number="5">
          <p>We use the following categories of third-party services to operate PhotoShare:</p>
          <ul>
            <li><strong>Cloud Storage (AWS / Cloudinary):</strong> For secure photo storage, compression, and CDN delivery. These providers maintain SOC 2 compliance and data processing agreements</li>
            <li><strong>Email Service:</strong> For sending OTP codes and transactional emails. We use providers that comply with anti-spam regulations</li>
            <li><strong>Payment Processing:</strong> For handling subscription payments securely. Payment data is processed by PCI-DSS compliant providers — we never store your credit card details</li>
            <li><strong>Analytics:</strong> Privacy-focused analytics that do not track individual users or use cookies</li>
          </ul>
          <p>
            All third-party services are bound by data processing agreements that restrict them from using your data for their own purposes. We regularly review and audit our third-party relationships to ensure continued compliance.
          </p>
        </LegalSection>

        <LegalSection id="data-processing" title="Data Processing & Disclaimer" icon="mdi-database-alert-outline" number="6">
          <p>
            PhotoShare is designed exclusively as an <strong>image sharing and selection platform</strong>. By using the Service, you acknowledge and agree to the following data processing practices:
          </p>
          <ul>
            <li><strong>Compression Processing:</strong> All images uploaded to the Platform are automatically compressed and converted to optimized formats. This process is irreversible — original quality cannot be restored from compressed files stored on our servers</li>
            <li><strong>No Original Data Retention:</strong> PhotoShare does not store, retain, backup, or archive your original files in any form. Original files are permanently discarded immediately after compression processing is complete</li>
            <li><strong>Temporary Storage Only:</strong> All compressed content stored on the Platform is temporary. Selected images are retained for a maximum of 2 months after client selection, after which they are automatically and permanently deleted</li>
            <li><strong>No Liability for Data Loss:</strong> PhotoShare shall not be responsible, liable, or accountable for any loss, damage, corruption, or unavailability of original data, photographs, or files. Users acknowledge that the Platform does not function as a data storage, backup, or archival service</li>
            <li><strong>User Responsibility:</strong> Users are solely responsible for maintaining independent backups of all original content, downloading any required data before automatic deletion, and ensuring their own data preservation practices are adequate</li>
          </ul>
          <HighlightBox icon="mdi-shield-alert-outline" variant="warning" title="Waiver of Claims">
            By using PhotoShare, you expressly waive any and all claims against PhotoShare, its directors, officers, employees, and agents relating to the loss, corruption, deletion, or unavailability of any original data or content that was uploaded to, processed by, or deleted from the Platform. This includes data loss due to automatic deletion, system errors, or any other cause.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="content-protection" title="Content Protection & Watermarking" icon="mdi-shield-lock-outline" number="7">
          <p>
            PhotoShare applies technical content protection measures to safeguard uploaded content. This section explains how these measures interact with your data and privacy:
          </p>
          <ul>
            <li><strong>Watermarking:</strong> All images displayed in client-facing galleries are automatically watermarked. Watermarks are applied as a visible overlay during image processing and are part of the compressed data stored on our servers</li>
            <li><strong>Anti-Download Measures:</strong> The Platform implements browser-level protections (right-click disabling, drag prevention, download blocking) to deter unauthorized content capture. These measures operate client-side and do not involve additional data collection</li>
            <li><strong>Reduced-Resolution Delivery:</strong> Gallery images are served in a compressed, watermarked, reduced-resolution format. This format is not suitable for high-quality reproduction and serves as an additional layer of content protection</li>
            <li><strong>No Tracking via Watermarks:</strong> Watermarks applied by PhotoShare do not contain tracking pixels, hidden identifiers, or any steganographic data that could be used to identify or track individual viewers</li>
          </ul>
          <HighlightBox icon="mdi-information-outline" title="Protection Limitations">
            While PhotoShare implements reasonable technical measures to protect content, no digital protection system is completely infallible. These measures are deterrents and not guarantees. PhotoShare does not collect additional personal data as part of these content protection measures.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="user-rights" title="Your Rights" icon="mdi-account-key-outline" number="8">
          <p>In accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and principles aligned with global data protection standards, you have the following rights:</p>

          <ul>
            <li><strong>Right to Access:</strong> You can request a copy of all personal data we hold about you</li>
            <li><strong>Right to Correction:</strong> You can update or correct inaccurate personal information through your account settings or by contacting us</li>
            <li><strong>Right to Deletion:</strong> You can request complete deletion of your account and all associated data. We will process this within 30 days</li>
            <li><strong>Right to Data Portability:</strong> You can request an export of your data in a machine-readable format</li>
            <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent for data processing at any time, though this may affect your ability to use certain features</li>
            <li><strong>Right to Grievance Redressal:</strong> You have the right to file a complaint with our Grievance Officer or with the relevant authorities</li>
          </ul>

          <HighlightBox icon="mdi-account-cog-outline" variant="info" title="Exercising Your Rights">
            To exercise any of these rights, email us at <strong>privacy@photoshare.in</strong>. We will respond within 30 days and verify your identity before processing the request.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="data-retention" title="Data Retention & Automatic Deletion" icon="mdi-clock-outline" number="9">
          <p>We retain your information only as long as necessary for the purposes outlined in this policy. PhotoShare is a sharing and selection platform, not a storage or backup service.</p>

          <p><strong>Content Retention:</strong></p>
          <ul>
            <li><strong>Original Files:</strong> Original uploaded files are <strong>never stored</strong>. They are compressed upon upload and the originals are permanently discarded</li>
            <li><strong>Compressed Content (Selected Images):</strong> Once a client completes the image selection, the selected compressed images are retained for a maximum of <strong>2 (two) months</strong> from the date of selection. After this period, they are <strong>automatically and permanently deleted</strong> from all our servers without further notice</li>
            <li><strong>Unselected Content:</strong> Images not selected by clients may be removed from the server at any time after the selection process is complete</li>
            <li><strong>No Recovery:</strong> Once any content is deleted — whether automatically or manually — it cannot be recovered under any circumstances. PhotoShare does not maintain backups or archives of deleted content</li>
          </ul>

          <p><strong>Account & Other Data:</strong></p>
          <ul>
            <li><strong>Active Account Data:</strong> Retained for the duration of your active account</li>
            <li><strong>Account Data After Deletion:</strong> Permanently deleted within 30 days of account closure</li>
            <li><strong>Dormant Accounts:</strong> Accounts inactive for 12+ months may be archived after 30 days' notice</li>
            <li><strong>Usage Analytics:</strong> Aggregated, anonymized usage data may be retained indefinitely for service improvement</li>
            <li><strong>Legal Requirements:</strong> Certain data may be retained longer if required by Indian law (such as financial records under the Companies Act)</li>
          </ul>

          <HighlightBox icon="mdi-alert-circle-outline" variant="warning" title="Critical: Download Before Expiry">
            It is your sole responsibility to download any required content from the Platform before the 2-month automatic deletion period expires. PhotoShare shall not be liable for any loss or damage arising from the automatic deletion of content. We strongly recommend maintaining your own independent backups of all original files at all times.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="children" title="Children's Privacy" icon="mdi-account-child-outline" number="10">
          <p>
            PhotoShare is designed for professional photographers and is not intended for use by individuals under the age of 18 (or the age of majority in your jurisdiction).
          </p>
          <p>
            We do not knowingly collect personal information from children under 18. If we become aware that we have collected personal data from a child, we will take immediate steps to delete such information from our systems.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided personal information to PhotoShare, please contact us at <a href="mailto:privacy@photoshare.in">privacy@photoshare.in</a> and we will promptly address the matter.
          </p>
        </LegalSection>

        <LegalSection id="international" title="International Data Transfers" icon="mdi-earth" number="11">
          <p>
            PhotoShare primarily stores and processes data within India. However, certain third-party services may process data in other jurisdictions (such as Singapore for CDN delivery).
          </p>
          <p>When data is transferred outside India, we ensure:</p>
          <ul>
            <li>The receiving country provides an adequate level of data protection</li>
            <li>Appropriate contractual safeguards are in place (Standard Contractual Clauses or equivalent)</li>
            <li>The transfer is necessary for the performance of the services you've requested</li>
          </ul>
          <p>
            We will update this section as India's Digital Personal Data Protection Act (DPDPA), 2023, rules are formalized by the government and will ensure full compliance with any new requirements.
          </p>
        </LegalSection>

        <LegalSection id="compliance" title="Regulatory Compliance" icon="mdi-certificate-outline" number="12">
          <p>
            PhotoShare is committed to full compliance with applicable data protection and privacy regulations:
          </p>
          <ul>
            <li><strong>IT Act, 2000:</strong> Full compliance with the Information Technology Act and applicable rules including intermediary guidelines</li>
            <li><strong>SPDI Rules, 2011:</strong> Adherence to Reasonable Security Practices and Procedures for handling Sensitive Personal Data or Information</li>
            <li><strong>DPDPA, 2023:</strong> Preparing for compliance with the Digital Personal Data Protection Act as rules are notified</li>
            <li><strong>Copyright Act, 1957:</strong> Technical protection measures (watermarks, anti-download) implemented as safeguards under Sections 65A/65B</li>
            <li><strong>PCI-DSS:</strong> Payment processing through PCI-DSS compliant gateways — we never store payment card details</li>
            <li><strong>SOC 2 Infrastructure:</strong> Hosted on certified cloud infrastructure meeting SOC 2 standards</li>
            <li><strong>72-Hour Breach Notification:</strong> Committed to notifying affected users within 72 hours of any confirmed data breach</li>
          </ul>
          <HighlightBox icon="mdi-shield-check-outline" variant="success" title="Compliance Inquiries">
            For compliance documentation, audit reports, or due diligence requests, contact our compliance team at <strong>compliance@photoshare.in</strong>.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="changes" title="Changes to This Policy" icon="mdi-file-edit-outline" number="13">
          <p>We may update this Privacy Policy from time to time. When we make material changes:</p>
          <ul>
            <li>We will notify you via email at least <strong>30 days before</strong> the changes take effect</li>
            <li>We will update the "Last updated" date at the top of this page</li>
            <li>We will prominently display a notice on the platform</li>
            <li>Your continued use after the effective date constitutes acceptance</li>
          </ul>
          <p>
            We recommend reviewing this policy periodically. Previous versions of this policy are available upon request.
          </p>
        </LegalSection>

        <LegalSection id="grievance" title="Grievance Officer" icon="mdi-account-tie-outline" number="14">
          <p>
            In accordance with the Information Technology Act, 2000, and the rules made thereunder, we have appointed a Grievance Officer to address any concerns or complaints regarding data processing:
          </p>
          <div class="contact-card">
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-account-outline</v-icon>
              <span><strong>Grievance Officer:</strong> Data Protection Officer, PhotoShare Technologies Pvt. Ltd.</span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-email-outline</v-icon>
              <span><strong>Email:</strong> <a href="mailto:grievance@photoshare.in">grievance@photoshare.in</a></span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-clock-outline</v-icon>
              <span><strong>Response Time:</strong> Within 30 days of receiving your complaint</span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-map-marker-outline</v-icon>
              <span><strong>Address:</strong> PhotoShare Technologies Pvt. Ltd., Hyderabad, Telangana, India</span>
            </div>
          </div>
        </LegalSection>

        <LegalSection id="contact" title="Contact Us" icon="mdi-email-outline" number="15">
          <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please reach out:</p>
          <div class="contact-card">
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-email-outline</v-icon>
              <span><strong>Privacy:</strong> <a href="mailto:privacy@photoshare.in">privacy@photoshare.in</a></span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-headset</v-icon>
              <span><strong>General Support:</strong> <a href="mailto:support@photoshare.in">support@photoshare.in</a></span>
            </div>
            <div class="contact-row">
              <v-icon size="18" color="#7c3aed">mdi-web</v-icon>
              <span><strong>Website:</strong> <a href="https://photoshare.in">photoshare.in</a></span>
            </div>
          </div>
          <HighlightBox icon="mdi-chat-outline" variant="info" title="We're here to help">
            Your privacy matters to us. If you have any questions about how we handle your data, don't hesitate to reach out. We respond within 48 hours.
          </HighlightBox>
        </LegalSection>

        <!-- Bottom CTA -->
        <div class="legal-cta">
          <div class="legal-cta__content">
            <h3 class="legal-cta__title">Questions about your privacy?</h3>
            <p class="legal-cta__text">Our Data Protection team is here to address any concerns about how we collect, use, or protect your information.</p>
            <a href="mailto:privacy@photoshare.in" class="legal-cta__btn">
              <v-icon size="18">mdi-lock-check-outline</v-icon>
              Contact Privacy Team
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
          <router-link to="/terms" class="legal-footer__link">Terms of Service</router-link>
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
  { id: 'info-collect', title: 'Information We Collect', icon: 'mdi-database-outline' },
  { id: 'data-usage', title: 'How We Use Data', icon: 'mdi-cog-outline' },
  { id: 'cookies', title: 'Cookies & Tracking', icon: 'mdi-cookie-outline' },
  { id: 'data-security', title: 'Data Storage & Security', icon: 'mdi-shield-lock-outline' },
  { id: 'third-party', title: 'Third-Party Services', icon: 'mdi-link-variant' },
  { id: 'data-processing', title: 'Data Processing & Disclaimer', icon: 'mdi-database-alert-outline' },
  { id: 'content-protection', title: 'Content Protection & Watermarking', icon: 'mdi-shield-lock-outline' },
  { id: 'user-rights', title: 'Your Rights', icon: 'mdi-account-key-outline' },
  { id: 'data-retention', title: 'Data Retention & Deletion', icon: 'mdi-clock-outline' },
  { id: 'children', title: "Children's Privacy", icon: 'mdi-account-child-outline' },
  { id: 'international', title: 'International Transfers', icon: 'mdi-earth' },
  { id: 'compliance', title: 'Regulatory Compliance', icon: 'mdi-certificate-outline' },
  { id: 'changes', title: 'Changes to Policy', icon: 'mdi-file-edit-outline' },
  { id: 'grievance', title: 'Grievance Officer', icon: 'mdi-account-tie-outline' },
  { id: 'contact', title: 'Contact Us', icon: 'mdi-email-outline' },
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
/* Reuses identical styles from TermsView — extracted via shared structure */

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

.legal-nav--scrolled .legal-nav__brand { color: #0f172a; }
.legal-nav:not(.legal-nav--scrolled) .legal-nav__brand { color: white; }
.legal-nav:not(.legal-nav--scrolled) .legal-nav__logo .v-icon { color: rgba(255, 255, 255, 0.9) !important; }

.legal-nav__links { display: flex; gap: 4px; }

.legal-nav__link {
  padding: 6px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.legal-nav:not(.legal-nav--scrolled) .legal-nav__link { color: rgba(255, 255, 255, 0.6); }
.legal-nav:not(.legal-nav--scrolled) .legal-nav__link:hover { color: white; background: rgba(255, 255, 255, 0.1); }
.legal-nav:not(.legal-nav--scrolled) .legal-nav__link--active { color: white; background: rgba(255, 255, 255, 0.12); font-weight: 600; }
.legal-nav--scrolled .legal-nav__link { color: #64748b; }
.legal-nav--scrolled .legal-nav__link:hover { color: #0f172a; background: #f1f5f9; }
.legal-nav--scrolled .legal-nav__link--active { color: #7c3aed; background: rgba(124, 58, 237, 0.06); font-weight: 600; }

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

.legal-nav:not(.legal-nav--scrolled) .legal-nav__back { color: rgba(255, 255, 255, 0.5); }
.legal-nav:not(.legal-nav--scrolled) .legal-nav__back:hover { color: white; background: rgba(255, 255, 255, 0.1); }
.legal-nav--scrolled .legal-nav__back { color: #64748b; }
.legal-nav--scrolled .legal-nav__back:hover { color: #0f172a; background: #f1f5f9; }

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

.legal-summary__title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0; }
.legal-summary__subtitle { font-size: 13px; color: #94a3b8; margin: 2px 0 0; }

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

.summary-item .v-icon { flex-shrink: 0; margin-top: 2px; }
.summary-item strong { color: #1e293b; }

@media (max-width: 640px) {
  .legal-summary__grid { grid-template-columns: 1fr; }
  .legal-summary__inner { padding: 24px 20px; }
}

/* ── Mobile TOC ───────────────────────────────────────────────────────── */

.mobile-toc {
  display: none;
  max-width: 900px;
  margin: 20px auto 0;
  padding: 0 24px;
}

@media (max-width: 1024px) { .mobile-toc { display: block; } }

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

.mobile-toc__trigger:hover { border-color: rgba(124, 58, 237, 0.2); }
.mobile-toc__trigger .v-icon:last-child { margin-left: auto; }

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

.mobile-toc__link:hover { background: rgba(124, 58, 237, 0.04); color: #7c3aed; }

.toc-expand-enter-active, .toc-expand-leave-active { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
.toc-expand-enter-from, .toc-expand-leave-to { opacity: 0; max-height: 0; }

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

.legal-cta__content { position: relative; z-index: 1; }

.legal-cta__title { font-size: 24px; font-weight: 800; color: white; margin: 0 0 10px; }

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

.legal-footer__copy { font-size: 13px; color: #94a3b8; }

.legal-footer__links { display: flex; gap: 20px; }

.legal-footer__link {
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.legal-footer__link:hover { color: #7c3aed; }

@media (max-width: 768px) {
  .legal-layout { padding: 32px 16px 48px; }
  .legal-footer__inner { flex-direction: column; text-align: center; }
}
</style>
