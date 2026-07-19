import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import dentalHeroVideo from "@/assets/dental/dental-hero.mp4.asset.json";
import dentalCtaVideo from "@/assets/dental/dental-cta.mp4.asset.json";
import problem1 from "@/assets/dental/problem-1.jpg";
import problem2 from "@/assets/dental/problem-2.jpg";
import problem3 from "@/assets/dental/problem-3.jpg";
import problem4 from "@/assets/dental/problem-4.jpg";
import problem5 from "@/assets/dental/problem-5.jpg";
import problem6 from "@/assets/dental/problem-6.jpg";
import preVisitOnlineBooking from "@/assets/dental/journey/pre-visit-online-booking.png";
import checkInReception from "@/assets/dental/journey/check-in-reception.png";
import examinationCharting from "@/assets/dental/journey/examination-charting.png";
import treatmentPlanApproval from "@/assets/dental/journey/treatment-plan-approval.png";
import treatmentDeliveredDocumented from "@/assets/dental/journey/treatment-delivered-documented.png";
import claimPaymentRecallSet from "@/assets/dental/journey/claim-payment-recall-set.png";

import imgVatech from "@/assets/dental/integrations/vatech.png";
import imgRomexis from "@/assets/dental/integrations/romexis.png";
import imgPlanetDds from "@/assets/dental/integrations/planet-dds.png";
import imgDentsply from "@/assets/dental/integrations/dentsply-sirona.png";
import imgCarestream from "@/assets/dental/integrations/carestream.png";
import imgApteryx from "@/assets/dental/integrations/apteryx.png";
import imgIntraApteryx from "@/assets/dental/intraoral/apteryx.png";
import imgIntraDexis from "@/assets/dental/intraoral/dexis.png";
import imgIntraSchick from "@/assets/dental/intraoral/schick.png";
import imgAcctXero from "@/assets/dental/accounting/xero.png";
import imgAcctQb from "@/assets/dental/accounting/quickbooks.png";
import imgAcctSage from "@/assets/dental/accounting/sage.png";
import imgAcctStripe from "@/assets/dental/accounting/stripe.png";
import imgAcctNetwork from "@/assets/dental/accounting/network.png";
import imgAcctTelr from "@/assets/dental/accounting/telr.png";
import imgInsDha from "@/assets/dental/insurance/dha.png";
import imgInsDoh from "@/assets/dental/insurance/doh.png";
import imgInsNphies from "@/assets/dental/insurance/nphies.png";

export type DentalSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const DENTAL_DEFAULTS = {
  Hero: {
    headline: "Every Smile Starts With a",
    headlineAccent: "Smarter Practice.",
    ctaLabel: "Build a Smarter Dental Practice",
    ctaHref: "#contact",
    ctaLabel2: "See a Live Demo",
    ctaHref2: "#contact",
    mediaUrl: dentalHeroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing Secreta Dental",
    headline: "One Unified Platform for",
    headlineAccent: "Modern Dental Practices",
    body:
      "A full-featured dental management system covering everything from chair-side charting to final payment. " +
      "Built for modern dental clinics that want to deliver exceptional patient care while running a seamless, " +
      "paperless, and financially optimized practice.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Running a Dental Practice Has Never Been",
    headingAccent: "More Complex.",
    subheading:
      "Most systems were not built for where dentistry is today. Dentistry is a precision discipline. Your practice management platform should be too.",
    items: [
      { title: "Paper Charts Steal Chair Time", image: problem1, description: "Dentists spend the last 20 minutes of every appointment updating paper charts instead of talking to patients about treatment, prevention, and next steps." },
      { title: "Verbal Treatment Plans", image: problem2, description: "Plans presented at the chair without written estimates or formal approval — leading to billing disputes, patient confusion, and revenue loss." },
      { title: "Recalls Drifting Away", image: problem3, description: "Manual recall management means patient lists go months out of date and patients quietly drift between acute episodes." },
      { title: "Imaging Lives Elsewhere", image: problem4, description: "Radiographs scattered across envelopes, folders, and disconnected viewers — forcing the dentist to switch systems mid-appointment." },
      { title: "Rejected Insurance Claims", image: problem5, description: "Claims submitted manually with missing tooth codes or clinical justification — rejected and resubmitted weeks later from a spreadsheet." },
      { title: "No Multi-Chair Visibility", image: problem6, description: "No real-time view of which chair is busy, which practitioner is running late, or which patient has been waiting too long." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Everything Your Dental Practice Needs — in One Unified Platform.",
    body:
      "From the moment a patient books their first appointment to the moment their treatment plan is complete and their account is settled — Secreta Dental manages every clinical and administrative workflow in one intuitive system.",
    items: [
      { icon: "Smile", title: "Digital Dental Charting", description: "Interactive chart that maps every tooth in real time. Record restorations, caries, missing teeth, RCT, crowns, bridges, implants, periodontal conditions — surface by surface with clicks and color codes. Full periodontal charting built in: six-point pocket depth, BoP, recession, furcation, mobility, BPE." },
      { icon: "FileSignature", title: "Treatment Planning & Approvals", description: "Build multi-stage treatment plans directly from the digital chart. Procedures link automatically to your fee schedule for itemized, real-time cost estimates. Alternative options presented side by side. Patient approvals captured digitally with timestamped consent." },
      { icon: "CalendarCheck", title: "Chair & Practitioner Scheduling", description: "Visual, color-coded scheduler shows every chair, practitioner, and slot. Drag-and-drop booking. Conflicts prevented automatically. Automated SMS, email, and WhatsApp reminders — reducing no-shows without a single phone call." },
      { icon: "Scan", title: "Radiograph & Image Management", description: "DICOM-integrated periapical, bitewing, panoramic, and CBCT imaging — auto-attached to teeth and treatment plans. Intraoral and clinical photographs in the same record. Pre/post comparisons built in. Integrated CBCT viewer inside the chart." },
      { icon: "BellRing", title: "Automated Recall & Communication", description: "Never manage a recall list manually again. Patients are tracked automatically for examinations, hygiene, perio maintenance, and ongoing treatment with multi-channel reminders." },
      { icon: "ShieldCheck", title: "Insurance & Pre-Authorization", description: "Generate insurer-ready claims directly from the clinical record — correct tooth codes, clinical justification, and attachments. Submit electronically and track adjudication in real time." },
      { icon: "Receipt", title: "Billing & Patient Accounts", description: "Itemized invoicing, installment plans, multi-modal payments, and reconciliation against patient accounts. Outstanding balances and aging AR tracked in real time." },
      { icon: "Activity", title: "Periodontal Management Program", description: "Structured periodontal care — staging, active therapy, SPT scheduling, and long-term recall. Pocket depth and bleeding scores tracked longitudinally with graphical comparisons." },
      { icon: "FlaskConical", title: "Dental Laboratory Management", description: "Digital lab prescriptions with shade, material, dimensions, and instructions. Track cases from despatch to fit. Reconcile invoices against orders. Monitor turnaround by lab and case type." },
      { icon: "UserCog", title: "Staff Management & Governance", description: "Manage practitioner schedules, leave, CPD records, and clinical governance reporting. Audit trails on every record. Role-based access aligned to your clinical structure." },
      { icon: "Users", title: "Multi-Site Group Practices", description: "Patients move between branches with one continuous record. Group leadership gets unified analytics across every location while each site keeps its own configuration." },
      { icon: "ClipboardList", title: "Paperless Patient Onboarding", description: "Digital medical history, consent, and registration forms sent before the appointment — completed at home and ready before the patient walks in." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "A Seamless Patient Journey — End to End.",
    body: "From the first online booking to the final settled invoice — every step connected, every record current.",
    items: [
      { icon: "ClipboardList", title: "Pre-Visit & Online Booking", image: preVisitOnlineBooking, description: "Patient books online or via reception. Digital medical history, consent, and registration forms are sent and completed before arrival." },
      { icon: "Users", title: "Check-In & Reception", image: checkInReception, description: "Patient checks in at reception or self-service kiosk. The record opens with full history, outstanding plan items, recalls, medical alerts, and insurance visible to the team." },
      { icon: "Smile", title: "Examination & Charting", image: examinationCharting, description: "Dentist conducts the exam with the digital chart on the chairside screen. Radiographs auto-appear in the record. Clinical photos attach to the relevant teeth." },
      { icon: "FileSignature", title: "Treatment Plan & Approval", image: treatmentPlanApproval, description: "A plan is built from the findings. Costs calculate automatically. The patient reviews, asks questions, and approves digitally — a copy is sent immediately." },
      { icon: "CheckCircle2", title: "Treatment Delivered & Documented", image: treatmentDeliveredDocumented, description: "Completed procedures are marked on the chart. Structured templates and voice input speed up notes. Post-op instructions are delivered digitally. Charges post automatically." },
      { icon: "Receipt", title: "Claim, Payment & Recall Set", image: claimPaymentRecallSet, description: "Insurance claims submitted electronically. Payment processed and receipted. The patient's next recall is scheduled, reminders set, and they leave with a complete record." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Outcomes Dental Practices Across Our Network Are Achieving.",
    items: [
      { value: "32%", label: "Reduction in chairside admin time after going digital" },
      { value: "2.3x", label: "More treatment plans formally approved with digital consent workflows" },
      { value: "91%", label: "First-pass dental claim acceptance with integrated insurance workflows" },
      { value: "45%", label: "Increase in recall attendance with automated multi-channel reminders" },
      { value: "100%", label: "Paperless charting from day one of go-live" },
      { value: "<2 weeks", label: "Average single-clinic deployment from kick-off to go-live" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connects With Your Equipment, Insurers, and Business Systems.",
    body: "Clinical and financial data flows where it needs to go — without manual import, duplication, or reconciliation.",
    groups: [
      { title: "Digital Imaging", items: [
        { name: "Vatech", logo: imgVatech },
        { name: "Romexis", logo: imgRomexis },
        { name: "Planet DDS", logo: imgPlanetDds },
        { name: "Dentsply Sirona", logo: imgDentsply },
        { name: "Carestream Dental", logo: imgCarestream },
        { name: "Apteryx", logo: imgApteryx },
      ]},
      { title: "Intraoral Cameras", items: [
        { name: "DEXIS", logo: imgIntraDexis },
        { name: "Schick by Sirona", logo: imgIntraSchick },
        { name: "Apteryx XVWeb", logo: imgIntraApteryx },
      ]},
      { title: "Accounting & Payments", items: [
        { name: "Xero", logo: imgAcctXero },
        { name: "QuickBooks", logo: imgAcctQb },
        { name: "Sage", logo: imgAcctSage },
        { name: "Stripe", logo: imgAcctStripe },
        { name: "Network International", logo: imgAcctNetwork },
        { name: "Telr", logo: imgAcctTelr },
      ]},
      { title: "Insurance Payers", items: [
        { name: "Dubai Health Authority", logo: imgInsDha },
        { name: "Department of Health Abu Dhabi", logo: imgInsDoh },
        { name: "NPHIES", logo: imgInsNphies },
      ]},
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How does the system handle treatment across multiple visits within a single plan?", a: "Multi-visit treatment plans are managed through structured treatment sequencing. Each appointment is linked to the items scheduled for that visit. As appointments complete, items are marked done, the chart updates, and charges post automatically. Outstanding items remain visible on the patient's active plan with the next appointment linked. Complete progress — done, remaining, and scheduled — is visible at a glance." },
      { q: "Does the system support specialist referrals within a group practice?", a: "Yes. Internal referral workflows let general dentists refer patients to endodontists, periodontists, oral surgeons, orthodontists, and implantologists within the group — with clinical notes, radiographs, and plan context attached. The specialist receives the referral with full background and books the patient directly. Treatment outcomes flow back to the referring dentist's record automatically." },
      { q: "How does the laboratory management module work for external dental labs?", a: "Lab prescriptions are generated digitally from the treatment plan and transmitted electronically to your chosen lab. Case status is tracked from despatch through fabrication, return, and fit appointment. Invoices are reconciled against orders automatically and turnaround performance is reported by lab and case type." },
      { q: "Is the platform suitable for both single-chair clinics and multi-site groups?", a: "Yes. The platform scales from a single-chair practice to multi-branch dental groups. Single clinics deploy in 2 to 3 weeks. Multi-site groups deploy by location, with each site going live sequentially over 4 to 8 weeks depending on group size." },
      { q: "How is patient data protected and what compliance standards are supported?", a: "Role-based access, audit logs, encryption in transit and at rest, and configurable data residency. The platform supports HIPAA, GDPR, and GCC-region data protection requirements with full audit trails on every record." },
      { q: "What training and onboarding support is provided?", a: "A dedicated onboarding specialist manages setup, data migration, hardware integration, staff training, and go-live support for every account. Pre-go-live training is role-based and post-go-live support is provided through a dedicated team with SLA-defined response times." },
    ],
  },
  "Final CTA": {
    headline: "A Great Dental Practice Is Built on Great Clinical Care.",
    headlineAccent: "And Great Care Deserves Great Systems Behind It.",
    body:
      "Every treatment plan, every radiograph, every recall, every claim — all of it either builds or erodes the practice you are working to create. Give your practice the platform it deserves.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#contact",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#contact",
    footnote: "No setup fees · No long-term contracts · Full onboarding & data migration support",
    mediaUrl: dentalCtaVideo.url,
    mediaKind: "video",
  },
} as const;

export type DentalContent = {
  [K in DentalSectionKey]: typeof DENTAL_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<DentalSectionKey, boolean> };

const DENTAL_PAGE_SLUG = "dental-management-suite";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out: any = { ...(base as any) };
    for (const k of Object.keys(over)) {
      out[k] = merge((base as any)[k], (over as any)[k]);
    }
    return out;
  }
  return (over ?? base) as T;
}

export function useDentalContent(): DentalContent {
  return useSectionsContent(DENTAL_PAGE_SLUG, DENTAL_DEFAULTS) as DentalContent;
}

export function useDentalContentLegacy(): DentalContent {
  const { data } = useQuery({
    queryKey: ["page-sections", DENTAL_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", DENTAL_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) return { byName: {}, visibleByName: {} } as {
        byName: Record<string, any>;
        visibleByName: Record<string, boolean>;
      };

      const { data: sections, error: secErr } = await supabase
        .from("page_sections")
        .select("data, position, is_visible")
        .eq("page_id", page.id)
        .order("position");
      if (secErr) throw secErr;

      const byName: Record<string, any> = {};
      const visibleByName: Record<string, boolean> = {};
      for (const row of sections ?? []) {
        const d = (row.data ?? {}) as any;
        const name = d.section_name;
        if (typeof name === "string" && name.length > 0) {
          byName[name] = d;
          visibleByName[name] = row.is_visible !== false;
        }
      }
      return { byName, visibleByName };
    },
    staleTime: 30_000,
  });

  const overrides = data?.byName ?? {};
  const visibility = data?.visibleByName ?? {};
  const merged: any = { _visible: {} as Record<DentalSectionKey, boolean> };
  for (const key of Object.keys(DENTAL_DEFAULTS) as DentalSectionKey[]) {
    merged[key] = merge(DENTAL_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as DentalContent;
}
