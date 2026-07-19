import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

// Default assets so URLs stay valid across builds.
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import problem6 from "@/assets/his/problem-6.jpg";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import registrationStep from "@/assets/his-journey/registration.png";
import outpatientConsultationStep from "@/assets/his-journey/outpatient-consultation.png";
import admissionStep from "@/assets/his-journey/admission.png";
import inpatientCareStep from "@/assets/his-journey/inpatient-care.png";
import dischargeStep from "@/assets/his-journey/discharge.png";
import billingSettlementStep from "@/assets/his-journey/billing-settlement.png";
import nphiesLogo from "@/assets/logos/nphies.png";
import malaffiLogo from "@/assets/logos/malaffi.png";
import riayatiLogo from "@/assets/logos/riayati.png";
import zatcaLogo from "@/assets/logos/zatca.png";
import emiratesIdLogo from "@/assets/logos/emirates-id.png";
import absherLogo from "@/assets/logos/absher.png";
import nhraLogo from "@/assets/logos/nhra.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";

export type ClinicSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const CLINIC_DEFAULTS = {
  Hero: {
    headline: "Run Your Entire Clinic —",
    headlineAccent: "Bookings, Charts, Billing. One Platform.",
    ctaLabel: "See the Clinic Suite in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book a Live Demo",
    ctaHref2: "#contact",
    chips: [
      "2,500+ Clinics",
      "HIPAA & GDPR Aligned",
      "Multi-Branch Ready",
      "Cloud & Mobile",
      "Arabic & English",
      "Open APIs",
    ],
    mediaUrl: hisHeroVideo.url,
  },
  Introduction: {
    eyebrow: "Introducing the Clinic Suite",
    headline: "The Simple Way to Run",
    headlineAccent: "a Modern Clinic",
    body:
      "Clinics juggle appointments, records, prescriptions, inventory, billing and patient communication — " +
      "usually across a mix of paper, spreadsheets and disconnected apps. Our Clinic Management System brings " +
      "every workflow into a single, delightful platform designed for single practices and multi-branch " +
      "groups alike. Front desk, providers, back office and patients — all on the same page, in real time.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Clinic Held Together by Sticky Notes Is a",
    headingAccent: "Clinic Leaking Money and Trust.",
    items: [
      { title: "No-Show Chaos", description: "The front desk is on the phone all day rebooking no-shows because reminders go out manually — or don't go out at all — and half the day's appointments never arrive.", image: problem1 },
      { title: "Missing Charts", description: "A returning patient's chart cannot be found because it was created under a slightly different name last time, so the clinician starts from scratch and misses a critical allergy.", image: problem2 },
      { title: "Stockouts at the Counter", description: "The clinic runs out of a common medication mid-week because inventory lives in a spreadsheet nobody updates, and nobody notices until a patient is waiting at the counter.", image: problem3 },
      { title: "Silent Revenue Leak", description: "An insurance claim is rejected weeks later for a missing code — the visit is already closed, the patient has gone home, and the revenue is written off silently.", image: problem4 },
      { title: "Blind to the Numbers", description: "The owner cannot answer basic questions — how many patients did we see, which provider is busiest, what is our top diagnosis — because the numbers live in three tools that don't talk to each other.", image: problem5 },
      { title: "Lost Results", description: "A patient calls asking for their lab result, gets transferred three times, and finally hears 'we'll call you back' — because results arrived by fax and haven't been filed yet.", image: problem6 },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Everything Your Clinic Runs On — In One Place",
    body:
      "From the first appointment request to the final settled invoice — every workflow your clinic depends on, " +
      "connected end-to-end and ready on day one.",
    items: [
      { icon: "CalendarCheck", title: "Smart Appointment Scheduling", description: "Online booking, calendar sync, automated reminders and waitlist management — reduce no-shows and keep every provider's day fully optimized without manual coordination." },
      { icon: "UserPlus", title: "Patient Registration & Profiles", description: "Fast front-desk check-in with digital intake forms, insurance capture and photo ID. One unified patient profile follows the patient across every visit and every provider in the clinic." },
      { icon: "FileText", title: "Electronic Health Records", description: "Structured clinical notes, problem lists, allergies, medications and history — all in one longitudinal record. Templates by specialty accelerate documentation without sacrificing detail." },
      { icon: "ClipboardList", title: "e-Prescriptions & Referrals", description: "Prescribe electronically with built-in drug interaction and allergy checks. Send referrals to specialists with the full clinical context attached in one click." },
      { icon: "HeartPulse", title: "Vitals & Clinical Assessments", description: "Capture vitals, growth charts, screenings and structured assessments at the point of care. Trends visualize instantly across visits so clinicians see the whole story." },
      { icon: "Pill", title: "In-Clinic Pharmacy & Inventory", description: "Track medication stock, expiries and reorder points. Dispense from the clinic with barcode verification — every dose accounted for, every shelf audited." },
      { icon: "Receipt", title: "Billing, Invoicing & Insurance Claims", description: "Charges flow automatically from clinical activity into billing. Submit insurance claims electronically, track denials and reconcile patient payments in one place." },
      { icon: "MessageSquare", title: "Patient Portal & Messaging", description: "Patients book appointments, view results, request refills and message their care team from a branded mobile-friendly portal — reducing phone volume dramatically." },
      { icon: "BarChart3", title: "Clinic Analytics & KPIs", description: "Live dashboards for visit volume, no-show rates, revenue per provider, top diagnoses and payer mix — turn day-to-day operations into strategic insight." },
      { icon: "Bell", title: "Automated Reminders & Recalls", description: "SMS, email and WhatsApp reminders for appointments, follow-ups, vaccinations and chronic care recalls — engagement that runs itself." },
      { icon: "Users", title: "Multi-Provider & Multi-Location", description: "Run a single clinic or a network of branches from one platform. Shared patient records, per-branch schedules, consolidated reporting across every location." },
      { icon: "CreditCard", title: "Payments & Point-of-Sale", description: "Card, wallet, cash and installment payments handled at the front desk with automatic receipts. Reconciliation happens in the background, not at the end of the day." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Full Patient Journey — From Booking to Payment",
    items: [
      { icon: "CalendarCheck", title: "Booking", image: registrationStep, description: "Patient books online or by phone. The system checks availability across providers, sends confirmation and adds calendar entries automatically." },
      { icon: "UserPlus", title: "Check-In", image: outpatientConsultationStep, description: "On arrival, the patient completes digital intake on a tablet or their phone. Insurance is verified and the chart is ready before the clinician walks in." },
      { icon: "Stethoscope", title: "Consultation", image: admissionStep, description: "The clinician sees the full history, documents the encounter with smart templates, orders investigations and prescribes — all in a single unified screen." },
      { icon: "HeartPulse", title: "Treatment & Follow-Up", image: inpatientCareStep, description: "Care plans, procedures and vitals are captured live. Follow-up appointments and recalls are scheduled before the patient leaves the room." },
      { icon: "FileText", title: "Results & Communication", image: dischargeStep, description: "Lab and imaging results flow back into the chart and are shared with the patient through the portal, with clinician-approved notes attached." },
      { icon: "Receipt", title: "Billing & Payment", image: billingSettlementStep, description: "Charges are generated from the visit, insurance claims filed and patient payments collected — the clinical and financial record close together." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Results Measured Across Our Clinic Network",
    items: [
      { value: "38%", label: "Average reduction in no-show rates after enabling automated reminders and online booking" },
      { value: "22%", label: "Increase in daily patient throughput per provider within six months" },
      { value: "18%", label: "Uplift in revenue per visit through automated charge capture and claims" },
      { value: "60%", label: "Reduction in front-desk phone volume with the patient self-service portal" },
      { value: "3 min", label: "Average patient check-in time using digital intake — down from 12 minutes" },
      { value: "97%", label: "Clean-claim rate on first insurance submission across our clinic network" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    headline: "Connects to the Tools Your Clinic Already Uses",
    body:
      "Calendars, payments, messaging, telehealth and accounting — connect what you already run, replace what " +
      "you've outgrown, and keep everything talking to each other.",
    sliderLabel: "Popular Integrations",
    items: [
      { name: "NPHIES", logo: nphiesLogo },
      { name: "Malaffi", logo: malaffiLogo },
      { name: "Riayati", logo: riayatiLogo },
      { name: "ZATCA Fatoora", logo: zatcaLogo },
      { name: "UAE Emirates ID", logo: emiratesIdLogo },
      { name: "Saudi Absher", logo: absherLogo },
      { name: "Bahrain NHRA", logo: nhraLogo },
      { name: "Wasfaty", logo: wasfatyLogo },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How long does it take to launch the clinic management system?", a: "A single-provider clinic is typically live within 2 to 3 weeks. A multi-provider or multi-branch clinic launches in 4 to 8 weeks depending on integrations, data migration and staff training scope." },
      { q: "Can I migrate patient records from my existing system?", a: "Yes. We migrate patient demographics, clinical history, appointments and billing data from most common clinic systems and spreadsheets. A validation report is produced before go-live so nothing is missed." },
      { q: "Does the platform support multiple branches or providers?", a: "Absolutely. You can run one clinic or a network of branches from a single account with shared patient records, per-branch scheduling and consolidated reporting." },
      { q: "Is the system available on mobile devices?", a: "Yes. Clinicians can use the app on tablets and phones, patients access their portal from any mobile browser, and the front desk works on any modern computer." },
      { q: "How is patient data protected?", a: "All data is encrypted at rest and in transit, hosted on regionally compliant infrastructure, with granular role-based access and full audit trails. The platform is aligned with HIPAA and regional privacy regulations." },
      { q: "Can it integrate with labs, pharmacies and insurance networks?", a: "Yes. Open APIs and prebuilt connectors integrate with major laboratory systems, pharmacies and insurance clearinghouses in the region." },
      { q: "What training and support come with the platform?", a: "Every launch includes structured role-based training, an on-site or remote go-live team and ongoing support with SLA-defined response times. Software updates and new features are included." },
      { q: "What does pricing look like?", a: "Pricing is per active provider per month with volume tiers for multi-branch clinics. There are no per-patient fees and no long lock-in contracts." },
    ],
  },
  "Final CTA": {
    headline: "Your Clinic Deserves Software That",
    headlineAccent: "Works as Hard as You Do.",
    body:
      "Fewer no-shows. Faster check-ins. Cleaner claims. Happier patients. All of it — from one platform your " +
      "whole team actually enjoys using.",
    body2:
      "Modern clinic management is not just a tool. It is the operating system your practice runs on, and the " +
      "single biggest lever you have to grow with confidence.",
    primaryLabel: "Book Your Live Demo",
    primaryHref: "#",
    secondaryLabel: "Talk to a Product Specialist",
    secondaryHref: "#",
    footnote: "Guided onboarding included. Data migration handled for you. Simple per-provider pricing, no lock-in.",
    mediaUrl: hisCtaVideo.url,
  },
} as const;

export type ClinicContent = {
  [K in ClinicSectionKey]: typeof CLINIC_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<ClinicSectionKey, boolean> };

const CLINIC_PAGE_SLUG = "clinic";

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

export function useClinicContent(): ClinicContent {
  return useSectionsContent(CLINIC_PAGE_SLUG, CLINIC_DEFAULTS) as ClinicContent;
}

export function useClinicContentLegacy(): ClinicContent {
  const { data } = useQuery({
    queryKey: ["page-sections", CLINIC_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", CLINIC_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<ClinicSectionKey, boolean> };
  for (const key of Object.keys(CLINIC_DEFAULTS) as ClinicSectionKey[]) {
    merged[key] = merge(CLINIC_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ClinicContent;
}
