import { useSectionsContent } from "./useSectionsContent";

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
import zatcaLogo from "@/assets/logos/zatca.png";
import malaffiLogo from "@/assets/logos/malaffi.png";
import riayatiLogo from "@/assets/logos/riayati.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";
import nhraLogo from "@/assets/logos/nhra.png";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";

export const RC_DEFAULTS = {
  Hero: {
    headline: "Every Charge Captured. ",
    headlineAccent: "Every Claim Paid.",
    ctaLabel: "See Revenue Cycle in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book an Enterprise Demonstration",
    ctaHref2: "#contact",
    chips: [
      "Automated Charge Capture",
      "Pre-Auth · Claims · Denials",
      "NPHIES & Regional Payers",
      "ZATCA e-Invoicing",
      "Real-Time A/R Analytics",
      "Cloud & On-Premise",
    ],
    mediaUrl: hisHeroVideo.url,
  },
  Introduction: {
    eyebrow: "Introducing Revenue Cycle & Financial Performance",
    headline: "The Financial Backbone of a Modern Health System",
    headlineAccent: "of a Modern Health System",
    body:
      "A hospital's financial performance is not the result of the finance department alone — it is the sum of every clinical decision, every documented service and every claim submitted on time. Revenue Cycle & Financial Performance connects clinical activity to charge capture, claims, denials, patient collections and executive analytics — so revenue is protected, cash accelerates and leadership sees the truth of the business in real time.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Manual Revenue Cycle Is a Silent Revenue Leak.",
    headingAccent: "Silent Revenue Leak.",
    items: [
      { title: "Missed Charges", description: "Services delivered are never billed because the clinical record lives in one system and the biller manually re-enters charges from another — sometimes hours or days later.", image: problem1 },
      { title: "Pre-Auth Failures", description: "Patients receive care without insurance eligibility being checked in real time — resulting in write-offs the hospital only discovers weeks later at claim submission.", image: problem2 },
      { title: "Denials Backlog", description: "Denied claims sit in a queue for weeks because the denial reason is not linked to the original clinical event and no one knows which physician to ask.", image: problem3 },
      { title: "A/R Aging Blindness", description: "Finance leadership discovers that aged A/R has doubled only at month-end because the dashboards refresh nightly and by cohort, not in real time.", image: problem4 },
      { title: "Regulator Non-Compliance", description: "e-Invoicing submissions fail silently at the tax authority because the invoice payload was generated from a legacy field mapping no one has revalidated in months.", image: problem5 },
      { title: "Opaque Contribution", description: "The CFO cannot tell which service lines are profitable because clinical, operational and financial data live in three unreconciled systems.", image: problem6 },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every Revenue Event. One Integrated Engine.",
    body:
      "From patient eligibility to final settlement — every step of the revenue cycle unified with your clinical operations and executive reporting in real time.",
    items: [
      { icon: "ShieldCheck", title: "Eligibility & Pre-Authorization", description: "Real-time insurance eligibility, benefit verification and pre-authorization submission at booking, registration and order entry — with automated status polling and clinician-visible approval state." },
      { icon: "ClipboardList", title: "Automated Charge Capture", description: "Every documented clinical activity — order, procedure, medication administration, implant, theatre time — flows into the charge sheet automatically. No manual re-keying. No missed charges." },
      { icon: "Receipt", title: "Coding & Claim Management", description: "Encoder-assisted ICD-10, CPT and local coding with automated grouping, edit-rule engine, claim scrubbing and electronic submission to NPHIES, DHA, HAAD and commercial payers." },
      { icon: "FileText", title: "Denials & Rework Workflow", description: "Denied claims are routed by reason, assigned to owners with SLAs, linked to the originating clinical event and reworked from a single console — with root-cause analytics feeding upstream prevention." },
      { icon: "Pill", title: "Patient Billing & Digital Collections", description: "Consolidated statements across insurance and self-pay, patient portal payments, payment plans, saved cards and automated collections with configurable dunning sequences." },
      { icon: "Network", title: "ZATCA & e-Invoicing Compliance", description: "Fatoora Phase 2 compliant e-invoicing with QR generation, XML signing and real-time integration with ZATCA and equivalent regional tax authorities — with full audit archive." },
      { icon: "BarChart3", title: "A/R & Cash Flow Analytics", description: "Real-time A/R aging by payer, service line and physician; DSO, first-pass rate, denial rate and cash collection dashboards; payer contract performance and yield analysis." },
      { icon: "Workflow", title: "Payer Contract Management", description: "Model, apply and reconcile payer contracts and fee schedules — with underpayment detection, contract yield reporting and simulation tools for renegotiation." },
      { icon: "Stethoscope", title: "Service Line Profitability", description: "Clinical, operational and financial data unified into service-line contribution margin — actual cost, actual reimbursement and physician-level productivity in one view." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Full Revenue Cycle — From Encounter to Settlement",
    items: [
      { icon: "ShieldCheck", title: "Eligibility Verified", image: registrationStep, description: "At booking and registration, insurance eligibility, benefits and pre-authorization requirements are verified in real time — visible to the front desk and the clinician." },
      { icon: "ClipboardList", title: "Charges Captured", image: outpatientConsultationStep, description: "Every clinical event — orders, procedures, medications, implants — flows automatically into the charge sheet as the clinician documents it. No end-of-day rekeying." },
      { icon: "Receipt", title: "Claim Coded & Scrubbed", image: admissionStep, description: "Encoder-assisted coding, automated edits and payer-specific scrubbing rules run before submission — reducing first-pass rejections and rework." },
      { icon: "Network", title: "Claim Submitted", image: inpatientCareStep, description: "Claims are transmitted electronically to NPHIES, DHA, HAAD and commercial payers with real-time acknowledgement and adjudication tracking." },
      { icon: "FileText", title: "Denial Reworked", image: dischargeStep, description: "Denials route by reason, ownership and SLA — with the originating clinical event, physician and encounter linked directly to the appeal workflow." },
      { icon: "BarChart3", title: "Cash Reconciled", image: billingSettlementStep, description: "Payments are matched to claims, patient collections are captured digitally and the encounter is closed with real-time A/R, DSO and yield metrics updated for leadership." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Financial Outcomes Measured Across Our RCM Client Network",
    items: [
      { value: "11%", label: "Average increase in net revenue per admission through automated charge capture" },
      { value: "94%", label: "First-pass insurance claim acceptance across integrated revenue cycle clients" },
      { value: "18 days", label: "Average reduction in Days Sales Outstanding within 9 months of go-live" },
      { value: "42%", label: "Reduction in denial rework hours through routed denial workflow and analytics" },
      { value: "100%", label: "ZATCA e-Invoicing submission compliance across all Saudi clients" },
      { value: "6.5x", label: "Return on investment reported by CFO clients in year one" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    headline: "Connected to Every Payer, Tax Authority and Regulator",
    body:
      "Revenue Cycle & Financial Performance is built on open standards and connects out of the box to national health platforms, tax authorities and every major regional payer.",
    sliderLabel: "Payer & Regulator Integrations",
    items: [
      { name: "NPHIES", logo: nphiesLogo },
      { name: "ZATCA Fatoora", logo: zatcaLogo },
      { name: "Malaffi", logo: malaffiLogo },
      { name: "Riayati", logo: riayatiLogo },
      { name: "Wasfaty", logo: wasfatyLogo },
      { name: "Bahrain NHRA", logo: nhraLogo },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Can Revenue Cycle & Financial Performance run without Secreta HIS?", a: "Yes. The platform integrates with any HL7- or FHIR-capable HIS/EMR to pull clinical activity and push charge and remittance data. Deep integration with Secreta HIS is available out of the box." },
      { q: "Which payers and clearinghouses are supported?", a: "NPHIES, DHA, HAAD, Bupa, Tawuniya, Daman, MedNet, NAS, NextCare and most major commercial payers in KSA, UAE, Bahrain, Qatar and Oman. New payer connections are typically delivered within 4 weeks." },
      { q: "How is ZATCA Fatoora Phase 2 e-invoicing handled?", a: "ZATCA Phase 2 compliance is native — QR generation, XML signing, cryptographic stamps, real-time submission and full 6-year audit archive are included with no additional module." },
      { q: "How does the system prevent lost charges?", a: "Every billable clinical event — orders, procedures, medications, implants, theatre time — is captured directly from the clinical record with a charge-master rules engine. Missing-charge dashboards highlight gaps in real time." },
      { q: "Can we manage payer contracts and detect underpayments?", a: "Yes. Payer contracts and fee schedules are modeled inside the platform. Expected reimbursement is calculated per claim and compared to actual remittance — with underpayment alerts and contract yield reporting." },
      { q: "How are patient collections handled?", a: "Consolidated patient statements, portal and app payments, saved payment methods, installment plans, automated dunning and integration with third-party collections agencies are all included." },
      { q: "What financial analytics and reporting are available to the CFO?", a: "Real-time dashboards for A/R aging, DSO, first-pass rate, denial rate, cash collections, payer performance, service-line profitability and physician productivity — plus a full library of scheduled reports and ad-hoc query tools." },
      { q: "How long does a Revenue Cycle implementation typically take?", a: "A standalone RCM deployment typically completes in 12 to 20 weeks depending on payer scope. When bundled with Secreta HIS, it goes live alongside the core system with no additional timeline." },
    ],
  },
  "Final CTA": {
    headline: "Stop Leaking Revenue. ",
    headlineAccent: "Start Seeing the Truth.",
    body:
      "Every service delivered deserves to be documented, coded, submitted and paid — on time and in full. Every leader deserves to see the financial state of the business in real time.",
    body2:
      "Revenue Cycle & Financial Performance is not a billing module. It is the connective tissue between clinical excellence and financial sustainability.",
    primaryLabel: "Book Your Enterprise Demonstration",
    primaryHref: "#",
    secondaryLabel: "Request a Financial Impact Assessment",
    secondaryHref: "#",
    footnote:
      "Structured implementation support. Payer integrations included. Pricing tailored to your revenue scale and payer mix.",
    mediaUrl: hisCtaVideo.url,
  },
} as const;

export function useRevenueCycleContent() {
  return useSectionsContent("healthcare-revenue-cycle", RC_DEFAULTS as any);
}
