import { useSectionsContent } from "./useSectionsContent";

// Reuse HIS demo assets as placeholder imagery.
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import problem6 from "@/assets/his/problem-6.jpg";
import registrationStep from "@/assets/his-journey/registration.png";
import outpatientConsultationStep from "@/assets/his-journey/outpatient-consultation.png";
import admissionStep from "@/assets/his-journey/admission.png";
import inpatientCareStep from "@/assets/his-journey/inpatient-care.png";
import dischargeStep from "@/assets/his-journey/discharge.png";
import billingSettlementStep from "@/assets/his-journey/billing-settlement.png";
import nphiesLogo from "@/assets/logos/nphies.png";
import malaffiLogo from "@/assets/logos/malaffi.png";
import riayatiLogo from "@/assets/logos/riayati.png";
import emiratesIdLogo from "@/assets/logos/emirates-id.png";
import absherLogo from "@/assets/logos/absher.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";

export const PE_DEFAULTS = {
  Hero: {
    headline: "Know Every Patient. ",
    headlineAccent: "Reach Every Patient.",
    ctaLabel: "See Patient Engagement in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book an Enterprise Demonstration",
    ctaHref2: "#contact",
    chips: [
      "One Patient · One Identity",
      "Portal · App · SMS · WhatsApp",
      "Biometric Verification",
      "HIPAA · GDPR · GCC Compliant",
      "Arabic & English",
      "Cloud & On-Premise",
    ],
    mediaUrl: hisHeroVideo.url,
  },
  Introduction: {
    eyebrow: "Introducing Patient Engagement & Identity",
    headline: "One Identity, One Relationship, Across Every Touchpoint",
    headlineAccent: "Across Every Touchpoint",
    body:
      "Modern healthcare is a conversation, not a transaction. Patients expect to book, prepare, arrive, follow up and pay from any device — and they expect the hospital to know exactly who they are at every step. Patient Engagement & Identity unifies verified patient identity with a full engagement suite — portal, mobile app, SMS, WhatsApp and email — so every message, appointment, result and reminder is tied to one trusted record.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Fragmented Identity Is a Broken Experience.",
    headingAccent: "Broken Experience.",
    items: [
      { title: "Duplicate Records", description: "The same patient exists three times across the HIS, appointment app and lab system — each with different phone numbers, allergies and insurance details.", image: problem1 },
      { title: "Missed Appointments", description: "Reminders never arrive because the phone number on file is out of date and no one has confirmed the patient's contact preferences in years.", image: problem2 },
      { title: "Portal Fatigue", description: "Patients ignore the portal because it forces yet another password, another download and shows only a subset of their true clinical record.", image: problem3 },
      { title: "Unverified Identity", description: "A patient is admitted under a family member's insurance card because the front desk has no reliable way to verify the person standing in front of them.", image: problem4 },
      { title: "Silent Follow-Up", description: "A post-discharge patient decompensates at home because no automated check-in was ever triggered — the discharge summary never reached them digitally.", image: problem5 },
      { title: "No Feedback Loop", description: "The hospital cannot tell the CEO what patients think of the last thousand visits because satisfaction surveys are printed on paper and thrown away.", image: problem6 },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Everything Patients Do With You. One Connected Experience.",
    body:
      "From first search to lifetime relationship — verified identity, digital access and outbound engagement working together as one platform.",
    items: [
      { icon: "UserPlus", title: "Master Patient Index & Deduplication", description: "A single unique identifier per patient across every module and third-party system. Fuzzy matching, biometric assist and manual merge tools eliminate duplicate records and merge fragmented histories automatically." },
      { icon: "ShieldCheck", title: "Biometric & Document Identity Verification", description: "Verify patients at registration and every subsequent point of care through facial recognition, fingerprint, national ID scan and OCR — with full audit trail." },
      { icon: "CalendarCheck", title: "Self-Service Booking & Rescheduling", description: "Patients book, reschedule and cancel appointments across every department 24/7 from portal, app, WhatsApp or IVR — with real-time slot availability from the HIS scheduler." },
      { icon: "FileText", title: "Patient Portal & Mobile App", description: "White-labeled portal and native iOS/Android apps give patients access to appointments, results, prescriptions, invoices, medical records and secure messaging with their care team." },
      { icon: "HeartPulse", title: "Automated Care Reminders & Recall", description: "Vaccination reminders, screening recall, chronic disease follow-ups and preventive care nudges triggered automatically from the clinical record via the patient's preferred channel." },
      { icon: "Pill", title: "Digital Consent & Pre-Visit Intake", description: "Consent forms, medical history questionnaires and pre-visit paperwork completed digitally before arrival — flowing directly into the EMR with no manual data entry." },
      { icon: "Receipt", title: "Digital Payments & Estimates", description: "Patients receive cost estimates, insurance pre-authorization status and settle bills online through the portal or mobile app — with saved payment methods and installment options." },
      { icon: "ClipboardList", title: "Feedback, NPS & Reputation", description: "Post-visit satisfaction surveys and NPS collected automatically. Positive reviews routed to public channels, negative feedback routed to service recovery workflows." },
      { icon: "Network", title: "Omnichannel Messaging Orchestration", description: "One outbound engine for SMS, WhatsApp, email, push and IVR — with channel-of-choice logic, quiet hours and language preference honored automatically." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Full Patient Relationship — Managed in One System",
    items: [
      { icon: "UserPlus", title: "Identity Established", image: registrationStep, description: "The patient is created once with verified identity — biometric enrollment, ID capture and consent — and linked to every past record via the Master Patient Index." },
      { icon: "CalendarCheck", title: "Self-Service Booking", image: outpatientConsultationStep, description: "The patient books from the portal, app or WhatsApp. Confirmation, reminders and pre-visit questionnaires trigger automatically on their preferred channel." },
      { icon: "FileText", title: "Digital Pre-Visit", image: admissionStep, description: "History, allergies, consent and insurance verification are completed digitally before arrival — the clinician sees a fully prepared chart on day one." },
      { icon: "HeartPulse", title: "Connected Visit", image: inpatientCareStep, description: "Check-in via QR or biometric. Real-time queue status. Results and prescriptions land in the app the moment they are validated in the HIS." },
      { icon: "Receipt", title: "Digital Payment", image: dischargeStep, description: "The invoice, insurance status and any co-payment are presented in the app. Payment is settled online — no queueing at the cashier." },
      { icon: "ClipboardList", title: "Follow-Up & Feedback", image: billingSettlementStep, description: "Post-visit satisfaction, care instructions and follow-up reminders are triggered from the discharge event — closing the loop on the visit." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Engagement Outcomes Measured Across Our Client Network",
    items: [
      { value: "62%", label: "Reduction in duplicate patient records within 6 months of MPI deployment" },
      { value: "3.4x", label: "Increase in portal and mobile app monthly active users after unified identity" },
      { value: "38%", label: "Reduction in no-show rate with omnichannel reminders and self-reschedule" },
      { value: "48h", label: "Median time from discharge to first automated follow-up contact" },
      { value: "94%", label: "Digital consent completion rate before arrival for elective visits" },
      { value: "72 NPS", label: "Average patient Net Promoter Score across engagement clients" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    headline: "One Identity Layer Connected to Every National & Regional Platform",
    body:
      "Verified identity, insurance eligibility and digital consent flow through open standards to every regulator, payer and national health platform in the region.",
    sliderLabel: "Identity & Engagement Platforms",
    items: [
      { name: "NPHIES", logo: nphiesLogo },
      { name: "Malaffi", logo: malaffiLogo },
      { name: "Riayati", logo: riayatiLogo },
      { name: "UAE Emirates ID", logo: emiratesIdLogo },
      { name: "Saudi Absher", logo: absherLogo },
      { name: "Wasfaty", logo: wasfatyLogo },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Can Patient Engagement & Identity run without Secreta HIS?", a: "Yes. The platform is designed to run standalone against any HL7- or FHIR-capable HIS/EMR. Deep integration is available with Secreta HIS out of the box, and standard connectors are available for major third-party systems." },
      { q: "How does the Master Patient Index handle existing duplicate records?", a: "During onboarding, our team runs a full deduplication pass on historic records using deterministic and probabilistic matching. Suspected duplicates are reviewed and merged with full audit trail before go-live." },
      { q: "Which biometric methods are supported for patient identification?", a: "Facial recognition, fingerprint and national ID document verification are supported out of the box. Iris and palm-vein modalities are available for facilities that require them." },
      { q: "How is patient data protected in the mobile app and portal?", a: "Transport is TLS 1.3, storage is AES-256 at rest, authentication supports SSO, MFA and biometric device unlock, and every data access is logged in the immutable audit trail." },
      { q: "Which languages are supported in the patient-facing experience?", a: "Arabic and English are supported natively with full RTL layout. Additional languages can be enabled per facility from the content management console without a code release." },
      { q: "How are patient messaging costs (SMS / WhatsApp) handled?", a: "The platform is channel-agnostic and integrates with your preferred telecom, WhatsApp Business Provider and email gateway — you retain the direct commercial relationship and cost control." },
      { q: "Can the portal and app be white-labeled to our brand?", a: "Yes. Full white-label branding, custom domains, app-store presence under your organization and configurable in-app design tokens are included in every enterprise deployment." },
      { q: "How long does implementation typically take?", a: "A standalone Patient Engagement & Identity deployment typically completes in 8 to 12 weeks. When bundled with Secreta HIS, it goes live alongside the core system with no additional timeline." },
    ],
  },
  "Final CTA": {
    headline: "One Patient. One Identity. ",
    headlineAccent: "One Lifetime Relationship.",
    body:
      "Every message the hospital sends deserves to reach the right person on the right channel. Every patient deserves to be recognized the moment they arrive.",
    body2:
      "Patient Engagement & Identity is the foundation of a modern, patient-centric health system — and the operating layer that makes every other clinical and financial investment measurable.",
    primaryLabel: "Book Your Enterprise Demonstration",
    primaryHref: "#",
    secondaryLabel: "Request an Implementation Roadmap",
    secondaryHref: "#",
    footnote:
      "Structured implementation support. Deduplication included. Pricing tailored to your patient population and channel mix.",
    mediaUrl: hisCtaVideo.url,
  },
} as const;

export function usePatientEngagementContent() {
  return useSectionsContent("healthcare-patient-engagement", PE_DEFAULTS as any);
}
