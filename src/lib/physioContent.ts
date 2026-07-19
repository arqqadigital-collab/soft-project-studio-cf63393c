import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
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
import zatcaLogo from "@/assets/logos/zatca.png";
import emiratesIdLogo from "@/assets/logos/emirates-id.png";
import absherLogo from "@/assets/logos/absher.png";
import nhraLogo from "@/assets/logos/nhra.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";

export type PhysioSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const PHYSIO_DEFAULTS = {
  Hero: {
    headline: "Better Outcomes, Session After Session —",
    headlineAccent: "On One Rehab Platform.",
    ctaLabel: "See the Rehab Suite in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book a Live Demo",
    ctaHref2: "#contact",
    chips: [
      "500+ Rehab Clinics",
      "Physio · OT · Speech · Sports",
      "Telerehab Ready",
      "HIPAA & GDPR Aligned",
      "Arabic & English",
      "Wearables Integrated",
    ] as string[],
    mediaUrl: hisHeroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing the Rehab Suite",
    headline: "Purpose-Built for",
    headlineAccent: "Physiotherapy & Rehabilitation",
    body:
      "Rehabilitation is a long, structured, outcome-driven journey — and generic clinic software was never built for it. Our Physiotherapy & Rehabilitation module gives therapists, patients and administrators the protocols, exercise libraries, outcome measures, home programs and telerehab tools they actually need, in one connected platform designed for recovery.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Rehab Without Data Is Just",
    headingAccent: "Guesswork With Good Intentions.",
    items: [
      { title: "Fragmented Record", image: problem1, description: "A patient's assessment lives in the therapist's paper notebook, their exercises on a printed sheet at home, and their pain diary in a note on their phone — no one has the full picture." },
      { title: "Silent Session Loss", image: problem2, description: "The insurance company approved twelve sessions, but nobody tracked the count, so the thirteenth session was delivered unpaid and written off silently." },
      { title: "Invisible Adherence", image: problem3, description: "Home exercise adherence is verbal — 'yes I did them' — with no way to know whether the patient practiced three times or zero times between sessions." },
      { title: "Handover Vacuum", image: problem4, description: "A therapist inherits a colleague's caseload without a clear treatment plan, current outcome measures or clinical rationale — and the patient starts explaining their history from scratch." },
      { title: "Unmeasured Outcomes", image: problem5, description: "Outcome measures are captured on paper, filed in a folder, and never turned into progress charts — so no one can prove that the therapy is actually working." },
      { title: "Blind to Performance", image: problem6, description: "The clinic owner cannot tell which therapist is most productive, which conditions get the best outcomes, or which insurer pays late — because reporting means chasing spreadsheets." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every Rehab Workflow. Built Around Outcomes.",
    body: "Assessment, planning, sessions, home programs, outcomes and insurance — one platform designed for the full arc of recovery.",
    items: [
      { icon: "ClipboardList", title: "Initial Assessment & Evaluation", description: "Structured intake for musculoskeletal, neurological, cardiac and pediatric assessments — with range-of-motion, pain scoring and functional baseline captured in one place." },
      { icon: "Activity", title: "Treatment Plans & Protocols", description: "Build individualized treatment plans from a library of evidence-based protocols. Adjust frequency, progression and goals as the patient improves — with every change versioned." },
      { icon: "Dumbbell", title: "Exercise Prescription Library", description: "A rich, illustrated exercise library with sets, reps and progression tracks. Assign prescriptions to patients with video guidance delivered straight to their phone." },
      { icon: "LineChart", title: "Outcome Measures & Progress Tracking", description: "Track validated outcome measures — Oswestry, DASH, Berg Balance, NPRS, TUG and more — with automated charts that show progress across every session." },
      { icon: "CalendarCheck", title: "Session Scheduling & Recurrence", description: "Book full treatment blocks in one action. Recurring sessions, waitlists, room and equipment booking are handled together so no session, room or therapist is double-booked." },
      { icon: "HeartPulse", title: "SOAP Notes & Session Documentation", description: "Fast SOAP notes with reusable templates for common conditions. Every session links to the treatment plan, so progress against goals is always in view." },
      { icon: "Video", title: "Telerehab & Remote Sessions", description: "Deliver supervised sessions by video with in-call annotation, exercise demonstration and structured post-session notes — without leaving the platform." },
      { icon: "Users", title: "Multi-Therapist & Multi-Discipline", description: "Coordinate care across physiotherapy, occupational therapy, speech therapy and sports rehab — one patient record, one plan, one shared clinical view." },
      { icon: "MessageSquare", title: "Patient Portal & Home Program", description: "Patients see their home program, track adherence, log pain scores and message their therapist between sessions — from a mobile-friendly portal in Arabic and English." },
      { icon: "Receipt", title: "Insurance & Session Authorization", description: "Manage session authorizations, remaining approved visits and insurance claims from the same workflow — never delivering an unfunded session by mistake." },
      { icon: "Sparkles", title: "Goniometry & Wearable Integrations", description: "Integrate with digital goniometers, force plates, dynamometers and wearables to capture objective data automatically into the patient's progress chart." },
      { icon: "BarChart3", title: "Clinic Analytics & Outcome Reporting", description: "Track therapist productivity, room utilization, treatment outcomes and payer performance — data your leadership team can act on every week." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Complete Rehabilitation Journey — Assessment to Discharge",
    items: [
      { icon: "ClipboardList", title: "Referral & Assessment", image: registrationStep, description: "Referrals arrive from physicians, insurers or self-referral. The first session captures a structured assessment, goals and baseline measures — ready in minutes." },
      { icon: "Activity", title: "Treatment Plan", image: outpatientConsultationStep, description: "Therapist selects an evidence-based protocol, personalizes the plan and books the full course of sessions in one flow. The patient gets their schedule and home program instantly." },
      { icon: "Dumbbell", title: "Guided Sessions", image: admissionStep, description: "Each session is documented against the plan. Exercises are progressed or regressed based on response. Objective and subjective measures update the patient's chart automatically." },
      { icon: "LineChart", title: "Progress Review", image: inpatientCareStep, description: "At regular reassessment points, outcome measures are compared to baseline. Progress charts drive the conversation with the patient and the referring physician." },
      { icon: "HeartPulse", title: "Home Program & Adherence", image: dischargeStep, description: "Between sessions the patient follows a personalized home program with video, adherence logging and messaging — extending therapy well beyond the clinic walls." },
      { icon: "FileText", title: "Discharge & Report", image: billingSettlementStep, description: "On discharge, an outcome report is generated for the patient, the referrer and the insurer — closing the episode with data that proves the value delivered." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Outcomes Measured Across Our Rehab Client Network",
    items: [
      { value: "42%", label: "Improvement in patient adherence to home exercise programs via mobile app" },
      { value: "31%", label: "Increase in therapist productive treatment hours per week" },
      { value: "25%", label: "Faster time to functional recovery on structured evidence-based protocols" },
      { value: "3.2x", label: "More outcome measures captured per patient versus paper-based documentation" },
      { value: "92%", label: "Patient satisfaction score across our rehabilitation client network" },
      { value: "60%", label: "Reduction in unbilled sessions with integrated authorization tracking" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connected to the Payers, Regulators and Systems Your Clinic Depends On",
    subheading:
      "Native integrations with regional national platforms and open standards for referrers, insurers and wearable devices — your data flows where it needs to.",
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
      { q: "How long does implementation take for a physiotherapy clinic?", a: "A single-location physiotherapy or rehabilitation clinic typically launches within 3 to 5 weeks. A multi-branch or multi-discipline group launches in 6 to 10 weeks depending on data migration and integration scope." },
      { q: "Can we bring our own protocols and exercise library?", a: "Yes. You can import your existing exercise library, add clinic-branded videos, and build custom protocols that only your team sees — alongside the built-in evidence-based content." },
      { q: "Does the system support telerehab sessions?", a: "Yes. Video sessions run directly in the platform with structured session notes, exercise demonstration and payment flow attached — no third-party video tool required." },
      { q: "Which outcome measures are supported?", a: "Oswestry Disability Index, DASH, QuickDASH, Neck Disability Index, Berg Balance, TUG, NPRS, ROM, MMT, LEFS, PSFS and more. New measures can be added as configuration." },
      { q: "Can patients access their home program on mobile?", a: "Yes. Every patient gets a mobile-friendly portal with their scheduled exercises, video guidance, adherence tracking and messaging with the therapist." },
      { q: "How does insurance session authorization work?", a: "Authorizations are logged against the patient with approved session counts. The system warns before an unauthorized session is booked and helps the billing team request extensions ahead of time." },
      { q: "Does it integrate with wearables and digital assessment devices?", a: "Yes. Integrations are available for digital goniometers, dynamometers, force plates and common wearables — with data flowing directly into the patient's progress chart." },
      { q: "What training and support are included?", a: "Every launch includes role-based training for therapists, front desk and management, on-site or remote go-live support, and ongoing SLA-backed support. Software updates are included." },
    ],
  },
  "Final CTA": {
    headline: "Your Rehab Clinic Deserves Software That",
    headlineAccent: "Measures What You Deliver.",
    body: "Better assessments. Smarter protocols. Higher home program adherence. Cleaner outcome reports. Every session, every patient, every measure — connected.",
    body2: "Modern rehabilitation software is not just documentation. It is the operating system for outcomes your clinic will be measured on for the next decade.",
    primaryLabel: "Book Your Rehab Demo",
    primaryHref: "#",
    secondaryLabel: "Talk to a Product Specialist",
    secondaryHref: "#",
    footnote: "Guided onboarding. Data migration handled. Simple per-therapist pricing, no lock-in.",
    mediaUrl: hisCtaVideo.url,
    mediaKind: "video",
  },
} as const;

export type PhysioContent = {
  [K in PhysioSectionKey]: typeof PHYSIO_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<PhysioSectionKey, boolean> };

const PHYSIO_PAGE_SLUG = "physiotherapy";

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

export function usePhysioContent(): PhysioContent {
  return useSectionsContent(PHYSIO_PAGE_SLUG, PHYSIO_DEFAULTS) as PhysioContent;
}

export function usePhysioContentLegacy(): PhysioContent {
  const { data } = useQuery({
    queryKey: ["page-sections", PHYSIO_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", PHYSIO_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) return { byName: {}, visibleByName: {} };

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
  const merged: any = { _visible: {} as Record<PhysioSectionKey, boolean> };
  for (const key of Object.keys(PHYSIO_DEFAULTS) as PhysioSectionKey[]) {
    merged[key] = merge(PHYSIO_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as PhysioContent;
}
