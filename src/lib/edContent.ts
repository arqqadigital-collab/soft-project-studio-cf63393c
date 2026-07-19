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

export type EdSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const ED_DEFAULTS = {
  Hero: {
    headline: "When Every Second Counts —",
    headlineAccent: "Your ED Runs on One Live System.",
    ctaLabel: "See the ED Suite in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book a Live Demo",
    ctaHref2: "#contact",
    chips: [
      "150+ Emergency Departments",
      "ESI · CTAS · MTS",
      "HL7 FHIR Native",
      "Trauma & Stroke Ready",
      "Arabic & English",
      "24/7 Uptime",
    ] as string[],
    mediaUrl: hisHeroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing the ED Suite",
    headline: "The Command Center for",
    headlineAccent: "Modern Emergency Care",
    body:
      "The emergency department is where the hospital is most exposed. Acuity changes minute by minute, teams rotate, and there is no room for a system that lags behind. Our Emergency Department Management module gives triage, physicians, nurses, consultants and administration one live workspace — with the timers, order sets and dashboards purpose-built for high-acuity, high-throughput care.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Disconnected Emergency Department Is a",
    headingAccent: "Life-Threatening Bottleneck.",
    items: [
      { title: "Invisible Acuity", image: problem1, description: "A patient with chest pain waits in the queue behind non-urgent cases because triage acuity lives on a paper sheet no one at registration can see." },
      { title: "Ambush Arrivals", image: problem2, description: "A trauma patient arrives without warning because the ambulance service and the ED have no shared notification channel — and the team scrambles when the doors open." },
      { title: "Sepsis Slippage", image: problem3, description: "The sepsis one-hour bundle is missed because antibiotic orders, lactate results and fluid administration live in three separate systems no one is watching together." },
      { title: "Blind Command", image: problem4, description: "The ED consultant cannot see which patients are boarding, which beds are free upstairs, or how many patients are waiting to be seen — because every number is on a different screen." },
      { title: "Bounce-Back Discharges", image: problem5, description: "A discharged patient returns 48 hours later because their discharge instructions were verbal, in a language they did not fully understand, with no printed follow-up plan." },
      { title: "Untimed Metrics", image: problem6, description: "At the end of the month, the department cannot report door-to-doctor times because timestamps are handwritten, inconsistent and require days of manual compilation." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every ED Workflow. Built for High-Acuity Care.",
    body: "From ambulance notification to discharge or admission, every step in the emergency department runs on one live, timed, connected platform.",
    items: [
      { icon: "Siren", title: "Pre-Hospital & Ambulance Alerts", description: "Receive advance notification from EMS with patient vitals, ETA and chief complaint — so the resuscitation bay, team and equipment are ready before the ambulance doors open." },
      { icon: "ClipboardList", title: "Triage & Acuity Scoring", description: "Structured triage with ESI, CTAS or MTS scoring at the point of arrival. Acuity is visible on the department board immediately so the sickest patients are seen first — every time." },
      { icon: "Activity", title: "ED Tracking Board", description: "A live department board showing every patient, bed, acuity, time in department, pending orders and disposition status — visible on every workstation and every mobile device." },
      { icon: "Stethoscope", title: "Rapid Clinical Documentation", description: "Purpose-built ED templates for common chief complaints let physicians document, order and prescribe in a fraction of the time a generic EMR requires." },
      { icon: "Pill", title: "ED Medication & Order Sets", description: "Pre-built order sets for sepsis, chest pain, stroke, trauma and pediatric emergencies — with dose calculators, allergy checks and interaction alerts built in." },
      { icon: "HeartPulse", title: "Resuscitation & Code Documentation", description: "Real-time code documentation with timestamps, medications, defibrillation and team roles — captured live and finalized without retyping." },
      { icon: "BedDouble", title: "Bed & Boarding Management", description: "See every ED bed, hallway placement and boarding patient at a glance. Coordinate admissions, transfers and inpatient bed assignment without phone calls." },
      { icon: "Timer", title: "Door-to-Doc & LOS Timers", description: "Automatic timers for door-to-triage, door-to-doctor, decision-to-admit and length of stay — surfaced on every patient card and rolled up to the department dashboard." },
      { icon: "Radio", title: "Trauma & Stroke Activation", description: "One-click trauma, stroke and STEMI activation notifies the full response team, pages consultants and starts a synchronized clinical timeline." },
      { icon: "FileText", title: "Discharge Summaries & Instructions", description: "Structured discharge summaries generated from the encounter, with patient-friendly instructions in Arabic and English printed or sent to the patient portal." },
      { icon: "Users", title: "Team Handover & Shift Change", description: "Digital sign-out tools ensure every patient is handed over safely between shifts — with active issues, pending results and open plans clearly flagged." },
      { icon: "BarChart3", title: "ED Analytics & Quality Metrics", description: "Live dashboards for LWBS rates, throughput, boarding time, sepsis bundle compliance, door-to-needle and door-to-balloon — reporting-ready for regulators." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Complete ED Journey — From Ambulance Bay to Disposition",
    items: [
      { icon: "Siren", title: "Arrival & Triage", image: registrationStep, description: "Patient arrives by walk-in or ambulance. Registration and triage happen in parallel — acuity is scored and the patient appears on the tracking board within seconds." },
      { icon: "Activity", title: "Assessment", image: outpatientConsultationStep, description: "The ED physician sees prior history, vitals and triage notes on one screen. Orders are placed with pre-built sets and route instantly to lab, imaging and pharmacy." },
      { icon: "HeartPulse", title: "Diagnostics & Treatment", image: admissionStep, description: "Results return into the same chart. Medications are administered with barcode verification. Every timestamp is recorded automatically for quality reporting." },
      { icon: "BedDouble", title: "Disposition Decision", image: inpatientCareStep, description: "Admit, transfer, observe or discharge — the decision is documented and routed. Inpatient bed requests, transfers and consultant referrals happen inside the same workflow." },
      { icon: "FileText", title: "Discharge or Admission", image: dischargeStep, description: "Discharge summaries, prescriptions and follow-up appointments are generated from the encounter. Admissions flow into the inpatient system without duplicate entry." },
      { icon: "Timer", title: "Debrief & Quality Review", image: billingSettlementStep, description: "Every encounter feeds automated quality metrics — sepsis bundles, stroke times, throughput. Case reviews start with data that is already validated and complete." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Outcomes Measured Across Our ED Client Network",
    items: [
      { value: "34%", label: "Average reduction in door-to-doctor time within six months of go-live" },
      { value: "27%", label: "Reduction in emergency department length of stay for discharged patients" },
      { value: "45%", label: "Fewer patients who leave without being seen after triage optimization" },
      { value: "96%", label: "Compliance with sepsis one-hour bundle across ED client network" },
      { value: "18 min", label: "Average door-to-needle time for stroke patients using activation workflows" },
      { value: "100%", label: "Real-time visibility into every patient, bed and pending order in the department" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connected to Every National Platform Your ED Reports To",
    subheading: "Built on open standards — HL7 FHIR, DICOM and native national platform integrations across the GCC.",
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
      { q: "How long does an ED module implementation take?", a: "A standalone ED module typically deploys in 6 to 10 weeks. Deployment alongside a full HIS go-live follows the HIS project timeline, with the ED module going live as part of the phased rollout." },
      { q: "Does the module support ESI, CTAS and MTS triage?", a: "Yes. Triage protocol is configurable per facility. ESI (levels 1–5), CTAS and MTS are all supported out of the box, with acuity coloring, reassessment triggers and audit trails included." },
      { q: "Can we integrate with our existing ambulance and EMS providers?", a: "Yes. Pre-hospital notification is supported through HL7 FHIR interfaces, direct integrations with regional EMS platforms, and structured web-form intake for smaller providers." },
      { q: "How does the module handle mass casualty and disaster mode?", a: "A dedicated disaster mode expands triage to START/JumpSTART protocols, activates surge dashboards, releases pre-configured incident order sets, and enables rapid patient registration with placeholder identifiers." },
      { q: "Does the tracking board work on mobile devices?", a: "Yes. The ED board, patient cards and disposition workflows are fully responsive and work on tablets and phones — ideal for consultants and bed managers on the move." },
      { q: "What quality and regulatory reports are included?", a: "Out-of-the-box reports for door-to-doctor, door-to-needle, door-to-balloon, sepsis bundle compliance, LWBS, LOS by acuity, and regional regulator submissions (CBAHI, DOH, JAWDA and equivalent) are included." },
      { q: "Can we build our own order sets and clinical pathways?", a: "Yes. A configurable order set builder lets your clinical leadership define and version pathways for chest pain, sepsis, stroke, trauma, pediatric emergencies and any local protocols." },
      { q: "What training and go-live support are included?", a: "Every deployment includes role-based training for triage nurses, ED physicians, consultants, registration and management, plus 24/7 on-site go-live support for the first two weeks." },
    ],
  },
  "Final CTA": {
    headline: "Your Emergency Department Deserves a System That",
    headlineAccent: "Moves as Fast as Your Team.",
    body: "Faster triage. Cleaner handovers. Timed bundles. Live dashboards. Every patient, every bed, every timer — visible to everyone who needs to see them.",
    body2: "A purpose-built ED module is the difference between a department that reacts and a department that leads.",
    primaryLabel: "Book Your ED Demo",
    primaryHref: "#",
    secondaryLabel: "Request an Implementation Roadmap",
    secondaryHref: "#",
    footnote: "Structured go-live support. 24/7 on-site launch team. Data migration included.",
    mediaUrl: hisCtaVideo.url,
    mediaKind: "video",
  },
} as const;

export type EdContent = {
  [K in EdSectionKey]: typeof ED_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<EdSectionKey, boolean> };

const ED_PAGE_SLUG = "emergency";

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

export function useEdContent(): EdContent {
  return useSectionsContent(ED_PAGE_SLUG, ED_DEFAULTS) as EdContent;
}

export function useEdContentLegacy(): EdContent {
  const { data } = useQuery({
    queryKey: ["page-sections", ED_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", ED_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<EdSectionKey, boolean> };
  for (const key of Object.keys(ED_DEFAULTS) as EdSectionKey[]) {
    merged[key] = merge(ED_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as EdContent;
}
