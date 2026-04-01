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
      reading-time="20"
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
            <span><strong>No originals stored</strong> — we only store compressed versions, never your original files</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Auto-deletion</strong> — selected images are removed from our servers after 2 months</span>
          </div>
          <div class="summary-item">
            <v-icon size="18" color="#10B981">mdi-check-circle</v-icon>
            <span><strong>Your responsibility</strong> — always keep backups of your original data</span>
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
          <p>PhotoShare is a platform exclusively designed for <strong>sharing and selecting images</strong>. The platform enables professional photographers to:</p>
          <ul>
            <li>Upload and share compressed event photographs with clients</li>
            <li>Create shareable galleries for client viewing and selection</li>
            <li>Enable clients to browse, select, and submit their preferred images</li>
            <li>Facilitate the image selection workflow between photographers and clients</li>
          </ul>
          <HighlightBox icon="mdi-alert-outline" variant="warning" title="Important: Not a Storage or Backup Service">
            PhotoShare is <strong>not a cloud storage, backup, or archival service</strong>. The Platform is designed solely for the temporary sharing and selection of images. Users must not rely on PhotoShare as a means of storing, preserving, or backing up their photographs or any other data. You are solely responsible for maintaining your own backups and copies of all original files.
          </HighlightBox>
          <p>
            You may use the Service only for its intended purpose. The Service is provided on an "as-is" and "as-available" basis. We strive for high availability but do not guarantee uninterrupted access. Scheduled maintenance windows will be communicated in advance via email.
          </p>
        </LegalSection>

        <LegalSection id="content-ownership" title="Content Ownership" icon="mdi-copyright" number="5">
          <HighlightBox icon="mdi-camera-outline" variant="success" title="You own your photos">
            PhotoShare does not claim any ownership rights over the photographs, images, or other content you upload to the Platform. Your content remains entirely yours. However, PhotoShare is not responsible for the safekeeping, integrity, or availability of your original content.
          </HighlightBox>
          <p>By uploading content, you grant PhotoShare a limited, non-exclusive, royalty-free license to:</p>
          <ul>
            <li><strong>Compress, process, and store</strong> your content in a reduced-quality format necessary to provide the Service</li>
            <li>Generate thumbnails and optimized versions for gallery viewing and selection</li>
            <li>Share content with designated clients via gallery links you create</li>
          </ul>
          <HighlightBox icon="mdi-alert-circle-outline" variant="warning" title="No Original Data Stored">
            PhotoShare does <strong>not store original files</strong>. All uploaded content is compressed and processed into a reduced-quality format suitable for viewing and selection purposes. The original high-resolution files are <strong>never retained</strong> on our servers. You acknowledge and agree that you are solely responsible for maintaining copies of your original files. PhotoShare shall not be held liable for any loss, corruption, or unavailability of original data under any circumstances.
          </HighlightBox>
          <p>
            This license is solely for the purpose of operating the Service. We will <strong>never sell, sublicense, or use your content for advertising</strong> without your explicit written consent. This license terminates when your content is deleted from the Platform, whether by you, by automatic deletion policy, or upon account termination.
          </p>
        </LegalSection>

        <LegalSection id="upload-storage" title="Upload & Storage Rules" icon="mdi-cloud-upload-outline" number="6">
          <p>When uploading content to PhotoShare, you agree to the following:</p>
          <ul>
            <li>You own or have the necessary rights and permissions to upload the content</li>
            <li>Your content does not infringe upon any third-party intellectual property rights</li>
            <li>Your content does not contain obscene, defamatory, or unlawful material as defined under the Information Technology Act, 2000</li>
            <li>You will not upload malicious files, viruses, or harmful code</li>
            <li>You understand and accept that <strong>only compressed versions</strong> of your uploaded content will be stored on our servers — original files are not retained</li>
            <li>You are solely responsible for maintaining backups of all original files before uploading</li>
          </ul>
          <p>
            <strong>Compression & Processing:</strong> All content uploaded to PhotoShare is automatically compressed and converted into optimized formats suitable for viewing and selection. Original high-resolution files are discarded after compression. PhotoShare does not guarantee that compressed images will match the quality, resolution, or fidelity of the originals.
          </p>
          <p>
            <strong>Automatic Deletion Policy:</strong> Once a client has completed their image selection, the selected images will remain on our servers for a maximum period of <strong>2 (two) months</strong> from the date of selection. After this 2-month period, all selected images and associated data will be <strong>automatically and permanently deleted</strong> from our servers without any further notice. It is the user's responsibility to download or retrieve any required content before this automatic deletion occurs.
          </p>
          <p>
            <strong>Unselected Content:</strong> Images that are not selected by the client may be removed from the server at any time after the selection process is complete, at PhotoShare's sole discretion.
          </p>
          <p>
            <strong>No Recovery:</strong> Once content is deleted — whether through automatic deletion, manual deletion, or account termination — it <strong>cannot be recovered</strong>. PhotoShare shall bear no liability whatsoever for any data loss resulting from automatic or manual deletion of content from the Platform.
          </p>
        </LegalSection>

        <LegalSection id="data-handling" title="Data Handling & Disclaimer" icon="mdi-database-alert-outline" number="7">
          <p>
            By using PhotoShare, you expressly acknowledge and agree to the following regarding how the Platform handles your data:
          </p>
          <ul>
            <li><strong>No Original Data Storage:</strong> PhotoShare does not store, retain, or archive original files in any form. All uploaded content is compressed and processed into a lower-resolution format optimized for viewing and selection. The original files are permanently discarded upon processing.</li>
            <li><strong>Compressed Data Only:</strong> The Platform stores only compressed and processed versions of your uploaded content. These compressed files may differ significantly from the originals in terms of quality, resolution, colour accuracy, and file size.</li>
            <li><strong>No Liability for Original Data Loss:</strong> PhotoShare shall not be responsible, liable, or accountable in any manner for the loss, damage, corruption, or unavailability of your original data. Users must ensure they have independent backups of all original files before uploading.</li>
            <li><strong>Automatic Deletion After Selection:</strong> Once a client completes the image selection process, the selected images will be retained on the server for a period of <strong>2 (two) months only</strong>. After this period, all data — including selected images, galleries, and associated metadata — will be <strong>automatically and permanently deleted</strong> without prior notice.</li>
            <li><strong>No Recovery After Deletion:</strong> PhotoShare does not maintain any backups, archives, or copies of deleted content. Once data is deleted from the Platform — whether automatically or manually — it is permanently and irreversibly gone. No recovery requests will be entertained.</li>
            <li><strong>User's Sole Responsibility:</strong> It is the sole responsibility of the user (photographer/uploader) to maintain their own backups and to download any required content from the Platform before the automatic deletion period expires.</li>
          </ul>
          <HighlightBox icon="mdi-alert-outline" variant="warning" title="Critical Notice">
            By using PhotoShare, you waive any and all claims against PhotoShare relating to data loss, data corruption, or inability to access content that has been deleted from the Platform, whether such deletion occurred automatically, manually, or due to any technical issue. This waiver is absolute and irrevocable for the duration of your use of the Service.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="watermark-protection" title="Watermark & Content Protection" icon="mdi-shield-lock-outline" number="8">
          <p>
            To safeguard the intellectual property of photographers and content creators, PhotoShare employs the following technical and legal content protection measures:
          </p>
          <p><strong>Watermarking:</strong></p>
          <ul>
            <li>All images displayed in client-facing galleries are <strong>automatically watermarked</strong> by the Platform to deter unauthorized use, reproduction, or distribution</li>
            <li>Watermarks are applied as a visible overlay and are an integral part of the gallery viewing experience. They are not removable by the client</li>
            <li>The photographer/uploader retains full control over watermark settings where configurable. PhotoShare reserves the right to apply a default watermark if none is configured</li>
          </ul>
          <p><strong>Anti-Download & Anti-Copy Measures:</strong></p>
          <ul>
            <li>PhotoShare implements technical measures to <strong>prevent or discourage downloading, screenshotting, and copying</strong> of gallery images by clients, including but not limited to: right-click disabling, drag-and-drop prevention, and download-blocking scripts</li>
            <li>Images served in galleries are delivered in a <strong>reduced-resolution, compressed, watermarked format</strong> — they are not suitable for commercial printing or reproduction</li>
            <li>These measures are provided as a <strong>reasonable deterrent only</strong>. PhotoShare does not guarantee that all forms of unauthorized capture or reproduction can be technically prevented</li>
          </ul>
          <HighlightBox icon="mdi-gavel" variant="warning" title="Legal Protection">
            Any attempt by a client or third party to circumvent watermarks, download-protection measures, or other content-protection features constitutes a <strong>violation of these Terms</strong> and may constitute an offence under the Information Technology Act, 2000 (Sections 43 and 66) and the Indian Copyright Act, 1957. PhotoShare reserves the right to pursue legal remedies, including injunctive relief and damages, against any person who circumvents these protections.
          </HighlightBox>
          <p>
            <strong>Limitation:</strong> While PhotoShare employs industry-standard content protection, no digital protection system is infallible. PhotoShare shall not be held liable for any unauthorized reproduction, distribution, or misuse of content that occurs despite the technical measures in place. The photographer/uploader acknowledges this inherent limitation and agrees that PhotoShare's liability in such cases is limited to the technical measures it has implemented.
          </p>
        </LegalSection>

        <LegalSection id="prohibited" title="Prohibited Activities" icon="mdi-cancel" number="9">
          <p>You agree not to engage in any of the following activities:</p>
          <ul>
            <li>Violating any applicable laws, including but not limited to the IT Act, 2000, Copyright Act, 1957, or any other Indian legislation</li>
            <li>Uploading content that is obscene, defamatory, invasive of privacy, or violates any person's rights</li>
            <li>Attempting to gain unauthorized access to other accounts, systems, or networks</li>
            <li>Using the Service to distribute spam, malware, or engage in phishing</li>
            <li>Scraping, data mining, or using automated tools to extract content from the platform</li>
            <li>Circumventing or attempting to circumvent any security features, watermarks, download-protection mechanisms, or usage limits</li>
            <li>Removing, altering, or obscuring any watermarks, copyright notices, or proprietary markings applied to images on the Platform</li>
            <li>Downloading, capturing (via screenshots or screen recording), or reproducing watermarked gallery images without the explicit written consent of the content owner</li>
            <li>Reselling, renting, or sublicensing the Service without written authorization</li>
            <li>Using any downloaded or captured images for commercial, editorial, or any other purpose without authorization from the photographer/content owner</li>
            <li>Interfering with or disrupting the integrity or performance of the Service</li>
          </ul>
          <p>
            Violation of these prohibitions may result in immediate suspension or termination of your account, as determined by PhotoShare at its sole discretion. PhotoShare further reserves the right to report violations to law enforcement and pursue civil or criminal remedies under applicable Indian law.
          </p>
        </LegalSection>

        <LegalSection id="termination" title="Termination" icon="mdi-account-off-outline" number="10">
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

        <LegalSection id="liability" title="Limitation of Liability" icon="mdi-scale-balance" number="11">
          <p>
            To the maximum extent permitted by applicable Indian law, including the Consumer Protection Act, 2019, and the Information Technology Act, 2000:
          </p>
          <ul>
            <li>PhotoShare shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service</li>
            <li>Our total aggregate liability shall not exceed the amount paid by you to PhotoShare in the 12 months preceding the event giving rise to the claim</li>
            <li>We are not liable for any loss of data resulting from factors beyond our reasonable control, including but not limited to force majeure events, internet disruptions, or third-party service failures</li>
            <li><strong>PhotoShare is not responsible for the loss, corruption, or unavailability of any original data, files, or photographs</strong> uploaded to the Platform, as the Platform does not store original files</li>
            <li>PhotoShare shall not be liable for any damages, claims, or losses arising from the <strong>automatic deletion of content</strong> after the 2-month retention period or at any other time</li>
            <li>PhotoShare shall not be liable for any degradation in image quality resulting from the compression and processing of uploaded content</li>
            <li>Users acknowledge that the Platform is a <strong>sharing and selection tool only</strong> and not a data storage, backup, or archival service, and PhotoShare bears no responsibility for data preservation</li>
          </ul>
          <HighlightBox icon="mdi-shield-outline" title="Disclaimer of Warranty">
            The Service is provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. PhotoShare expressly disclaims all warranties including, but not limited to, warranties of merchantability, fitness for a particular purpose, data accuracy, and non-infringement. You use the Service entirely at your own risk.
          </HighlightBox>
          <p>
            <strong>Indemnification:</strong> You agree to indemnify, defend, and hold harmless PhotoShare, its directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or in connection with: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual property rights; or (d) any claim that your content caused damage to a third party.
          </p>
        </LegalSection>

        <LegalSection id="pricing-billing" title="Pricing, Billing & Refunds" icon="mdi-credit-card-outline" number="12">
          <p>
            PhotoShare offers free and paid subscription plans. By subscribing to a paid plan, you agree to the following:
          </p>
          <ul>
            <li><strong>Pricing Transparency:</strong> All prices displayed on the Platform are in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change with 30 days' prior notice</li>
            <li><strong>Billing Cycle:</strong> Subscriptions are billed on a recurring monthly basis. You authorize PhotoShare to charge your chosen payment method at the start of each billing cycle</li>
            <li><strong>No Guarantee of Results:</strong> Subscription plans provide access to Platform features and resources. PhotoShare does not guarantee any specific business outcomes, client satisfaction, or revenue generation as a result of using the Service</li>
            <li><strong>Fair Usage:</strong> All plans are subject to fair usage policies. "Unlimited" features (where applicable) are subject to reasonable use limits designed to prevent abuse and ensure service quality for all users</li>
            <li><strong>Free Plan Limitations:</strong> The free plan is provided for evaluation purposes and may have restricted features, storage limits, and usage caps. PhotoShare reserves the right to modify or discontinue the free plan at any time</li>
            <li><strong>Refund Policy:</strong> Subscription fees are generally non-refundable. Pro-rata refunds may be issued at PhotoShare's sole discretion in cases of account termination by PhotoShare without cause. No refunds will be issued for partial-month usage, downgrades, or voluntary cancellation</li>
            <li><strong>Price Changes:</strong> PhotoShare may revise pricing at any time. Existing subscribers will receive at least 30 days' notice before a price increase takes effect. Continued use after the effective date constitutes acceptance of the new pricing</li>
          </ul>
          <HighlightBox icon="mdi-information-outline" title="No Hidden Fees">
            What you see on our pricing page is what you pay. There are no setup fees, hidden charges, or surprise add-ons. All applicable taxes are clearly stated at checkout.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="compliance" title="Regulatory Compliance" icon="mdi-certificate-outline" number="13">
          <p>
            PhotoShare is committed to operating in full compliance with applicable Indian laws and regulations. The following outlines our compliance posture:
          </p>
          <p><strong>Information Technology Compliance:</strong></p>
          <ul>
            <li>Compliant with the <strong>Information Technology Act, 2000</strong> and all applicable rules and amendments</li>
            <li>Adheres to the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> (SPDI Rules)</li>
            <li>Compliance with the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong> as applicable to intermediary platforms</li>
            <li>Preparing for full compliance with the <strong>Digital Personal Data Protection Act (DPDPA), 2023</strong> as rules are notified by the Government of India</li>
          </ul>
          <p><strong>Intellectual Property Compliance:</strong></p>
          <ul>
            <li>Respects intellectual property rights under the <strong>Copyright Act, 1957</strong> and the <strong>Trade Marks Act, 1999</strong></li>
            <li>Implements watermarking and anti-download measures as technical protection under Section 65A/65B of the Copyright Act</li>
            <li>Maintains a process for addressing copyright infringement complaints and takedown requests</li>
          </ul>
          <p><strong>Business & Corporate Compliance:</strong></p>
          <ul>
            <li>Incorporated and operating under the <strong>Companies Act, 2013</strong></li>
            <li>GST registered and tax compliant under applicable Indian tax laws</li>
            <li>Payment processing through <strong>PCI-DSS compliant</strong> payment gateways</li>
            <li>Maintains a designated Grievance Officer as required under the IT Act and Intermediary Guidelines</li>
          </ul>
          <p><strong>Data Security Standards:</strong></p>
          <ul>
            <li>AES-256 encryption for data at rest</li>
            <li>TLS 1.2+ encryption for data in transit</li>
            <li>Role-based access controls and principle of least privilege</li>
            <li>Periodic security audits and vulnerability assessments</li>
            <li>72-hour data breach notification protocol</li>
            <li>Hosted on SOC 2 compliant cloud infrastructure</li>
          </ul>
          <HighlightBox icon="mdi-shield-check-outline" variant="success" title="Investor & Enterprise Ready">
            PhotoShare maintains regulatory compliance documentation, audit trails, and security certifications suitable for investor due diligence, enterprise procurement, and partnership evaluations. For compliance inquiries, contact <strong>compliance@photoshare.in</strong>.
          </HighlightBox>
        </LegalSection>

        <LegalSection id="changes" title="Changes to Terms" icon="mdi-file-edit-outline" number="14">
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

        <LegalSection id="governing-law" title="Governing Law & Disputes" icon="mdi-gavel" number="15">
          <p>
            These Terms shall be governed by and construed in accordance with the <strong>laws of India</strong>. Any disputes arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Hyderabad, Telangana, India</strong>.
          </p>
          <p>
            Before initiating any legal proceedings, both parties agree to first attempt resolution through good-faith negotiation for a period of 30 days. If the dispute remains unresolved, either party may refer the matter to arbitration under the Arbitration and Conciliation Act, 1996, with the seat of arbitration in Hyderabad.
          </p>
        </LegalSection>

        <LegalSection id="contact" title="Contact Information" icon="mdi-email-outline" number="16">
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
              <span><strong>Address:</strong> PhotoShare Technologies Pvt. Ltd., Hyderabad, Telangana, India</span>
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ScrollProgress from '@/components/legal/ScrollProgress.vue'
import LegalHero from '@/components/legal/LegalHero.vue'
import LegalSidebar from '@/components/legal/LegalSidebar.vue'
import LegalSection from '@/components/legal/LegalSection.vue'
import HighlightBox from '@/components/legal/HighlightBox.vue'

interface LegalSectionItem {
  id: string
  title: string
  icon: string
}

const navScrolled = ref<boolean>(false)
const mobileTocOpen = ref<boolean>(false)

const sections: LegalSectionItem[] = [
  { id: 'introduction', title: 'Introduction', icon: 'mdi-hand-wave-outline' },
  { id: 'eligibility', title: 'Eligibility', icon: 'mdi-account-check-outline' },
  { id: 'account', title: 'Account Responsibilities', icon: 'mdi-shield-account-outline' },
  { id: 'use-of-service', title: 'Use of Service', icon: 'mdi-laptop-account' },
  { id: 'content-ownership', title: 'Content Ownership', icon: 'mdi-copyright' },
  { id: 'upload-storage', title: 'Upload & Storage Rules', icon: 'mdi-cloud-upload-outline' },
  { id: 'data-handling', title: 'Data Handling & Disclaimer', icon: 'mdi-database-alert-outline' },
  { id: 'watermark-protection', title: 'Watermark & Content Protection', icon: 'mdi-shield-lock-outline' },
  { id: 'prohibited', title: 'Prohibited Activities', icon: 'mdi-cancel' },
  { id: 'termination', title: 'Termination', icon: 'mdi-account-off-outline' },
  { id: 'liability', title: 'Limitation of Liability', icon: 'mdi-scale-balance' },
  { id: 'pricing-billing', title: 'Pricing, Billing & Refunds', icon: 'mdi-credit-card-outline' },
  { id: 'compliance', title: 'Regulatory Compliance', icon: 'mdi-certificate-outline' },
  { id: 'changes', title: 'Changes to Terms', icon: 'mdi-file-edit-outline' },
  { id: 'governing-law', title: 'Governing Law & Disputes', icon: 'mdi-gavel' },
  { id: 'contact', title: 'Contact Information', icon: 'mdi-email-outline' },
]

function scrollTo(id: string): void {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 100
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function handleScroll(): void {
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
