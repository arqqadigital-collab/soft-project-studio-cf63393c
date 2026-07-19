import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroImage from "@/assets/telemedicine/hero.jpg.asset.json";
import p1 from "@/assets/telemedicine/problems/p1.jpg.asset.json";
import p2 from "@/assets/telemedicine/problems/p2.jpg.asset.json";
import p3 from "@/assets/telemedicine/problems/p3.jpg.asset.json";
import p4 from "@/assets/telemedicine/problems/p4.jpg.asset.json";
import p5 from "@/assets/telemedicine/problems/p5.jpg.asset.json";
import j1 from "@/assets/telemedicine/journey/j1.jpg.asset.json";
import j2 from "@/assets/telemedicine/journey/j2.jpg.asset.json";
import j3 from "@/assets/telemedicine/journey/j3.jpg.asset.json";
import j4 from "@/assets/telemedicine/journey/j4.jpg.asset.json";
import j5 from "@/assets/telemedicine/journey/j5.jpg.asset.json";

export type TelemedicineSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const TELEMEDICINE_DEFAULTS = {
  Hero: {
    headline: "Care Without Walls.",
    headlineAccent: "Clinical-Grade Virtual Visits.",
    ctaLabel: "Launch Your Virtual Care Program",
    ctaHref: "#contact",
    ctaLabel2: "See It in Action",
    ctaHref2: "#contact",
    chips: [
      "Trusted across 30+ countries",
      "HIPAA & GDPR Aligned",
      "End-to-End Encrypted",
      "HL7 FHIR Native",
      "e-Prescribing Ready",
      "Multi-Language",
    ],
    mediaUrl: heroImage.url,
    mediaKind: "image",
  },
  Introduction: {
    eyebrow: "Built for Virtual Care",
    headline: "A Dedicated Platform for the",
    headlineAccent: "Full Virtual Care Journey.",
    body:
      "Consumer video apps were never built for medicine. Our Telemedicine & Virtual Care platform gives clinicians secure video, digital consent, e-prescribing, remote vitals and a real clinical record — connected to your HIS and EMR — so virtual visits are as safe, documented and reimbursable as visits inside the clinic walls.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Consumer Tools Weren't Built for Clinical Care.",
    headingAccent: "Every Visit Is a Risk.",
    items: [
      { title: "Consumer Video Isn't Clinical", description: "Consultations happening on consumer video apps with no clinical record, no consent trail and no way to prescribe safely — a compliance incident waiting to happen.", image: p1.url },
      { title: "Fragmented Follow-Up", description: "A patient sees a virtual doctor once, then disappears — because there is no messaging channel, no follow-up workflow and no shared record with their local physician.", image: p2.url },
      { title: "Prescriptions in Limbo", description: "A prescription written on video with no e-prescribing integration ends up as a screenshot the patient walks around with — with no audit trail and no pharmacy link.", image: p3.url },
      { title: "Blind Vitals", description: "A clinician makes a treatment decision on a virtual call without any objective vitals — because the patient's home devices don't connect to any clinical system.", image: p4.url },
      { title: "Unauditable Consultations", description: "A malpractice claim arrives months later with no recording, no structured notes and no consent — because the tool used for the visit was never designed for healthcare.", image: p5.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every Tool a Modern Virtual Care Program Needs",
    body: "From booking through diagnosis, prescription and follow-up — every virtual interaction captured in a structured, connected clinical record.",
    items: [
      { icon: "CalendarClock", title: "Virtual Appointment Scheduling", description: "Book, reschedule and cancel telemedicine appointments across providers, time zones and specialties. Automated reminders by SMS, email and WhatsApp reduce no-shows and ensure patients arrive prepared to their consultation link." },
      { icon: "Video", title: "HD Video Consultations", description: "Secure, encrypted video calls purpose-built for clinical use — with in-call vitals sharing, image capture, screen share, session recording and structured post-call documentation baked in." },
      { icon: "MessageSquare", title: "Asynchronous Messaging & Follow-up", description: "Structured messaging threads let patients ask follow-up questions and share photos or symptoms between visits. Every message is attached to the medical record and routed to the right clinician." },
      { icon: "FileText", title: "Digital Consent & Intake", description: "Patients complete intake forms, screening questionnaires and informed consent from their phone before the visit begins — so clinical time is spent on care, not paperwork." },
      { icon: "Pill", title: "e-Prescriptions & Digital Refills", description: "Prescribe directly from the virtual consult with drug interaction checks, allergy alerts and refill workflows — sent to the patient's pharmacy of choice or delivered digitally." },
      { icon: "Activity", title: "Remote Vitals & Device Integration", description: "Connect patient-owned devices — blood pressure cuffs, glucometers, pulse oximeters, wearables — to stream vitals into the visit and the longitudinal record in real time." },
      { icon: "Users", title: "Multi-Party & Family Consultations", description: "Add a translator, a specialist, a family member or a caregiver to any consult. Roles and permissions are managed inside the call — no third-party bridge required." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Complete Virtual Visit — Managed in One System",
    items: [
      { icon: "CalendarClock", title: "Patient Books Online", image: j1.url, description: "The patient chooses a provider, specialty and time slot from any device. Insurance and payment are captured up front. A secure consultation link is issued instantly with reminders scheduled automatically." },
      { icon: "FileText", title: "Digital Intake", image: j2.url, description: "Before the call, the patient completes structured intake, uploads photos and signs digital consent. The clinician reviews the summary before the session starts — every minute of the visit spent on care, not admin." },
      { icon: "Video", title: "Secure Video Consult", image: j3.url, description: "Encrypted video begins on time with the full clinical record loaded, vitals streaming from connected devices, and in-call tools for imaging, screen share and note-taking." },
      { icon: "Pill", title: "Diagnosis & e-Prescription", image: j4.url, description: "The clinician documents the encounter with reusable templates, orders investigations and prescribes electronically — with drug safety checks running in the background at every order." },
      { icon: "MessageSquare", title: "Follow-up & Continuous Care", image: j5.url, description: "After the visit, patients access notes, prescriptions and educational content in their portal. Secure messaging keeps the care team connected until the next scheduled review." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Access, Efficiency and Satisfaction You Can Measure",
    items: [
      { value: "52%", label: "Reduction in patient travel time replaced by virtual visits" },
      { value: "3x", label: "Increase in specialist reach across underserved regions" },
      { value: "40%", label: "Fewer no-shows compared with equivalent in-person appointments" },
      { value: "94%", label: "Patient satisfaction score across our telemedicine client network" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connected to Your Clinical and Financial Ecosystem",
    body: "The telemedicine platform integrates natively with your HIS, EMR, LIS, pharmacy network and payer systems over HL7 FHIR — so virtual visits create the same complete record as in-person visits, and reimburse the same way.",
    groups: [
      { icon: "Network", title: "Clinical Standards", subtitle: "Interoperability protocols", items: ["HL7 FHIR R4", "HL7 v2", "DICOM", "SMART on FHIR", "REST API"] },
      { icon: "ShieldCheck", title: "Security & Compliance", subtitle: "Regulatory alignment", items: ["HIPAA", "GDPR", "SOC 2", "ISO 27001", "End-to-end Encryption"] },
      { icon: "Pill", title: "Pharmacy & e-Prescribing", subtitle: "Prescription networks", items: ["Local e-Rx networks", "Pharmacy chains", "Controlled substances (2FA)"] },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Is the video platform HIPAA and GDPR compliant?", a: "Yes. All video traffic is end-to-end encrypted with per-session keys, tenant data is regionally hosted, and full audit trails are captured for every consult, message and prescription — aligned with HIPAA, GDPR and regional privacy regulations." },
      { q: "Can patients join a consultation without downloading an app?", a: "Yes. Patients can join any consultation directly from a modern browser on desktop or mobile. Native apps are available for patients and clinicians who prefer them, with the same features." },
      { q: "Does telemedicine integrate with our existing HIS or EMR?", a: "Yes. HL7 FHIR and REST integrations connect the telemedicine module to major HIS and EMR platforms — appointments, notes, orders and prescriptions flow into the existing patient record without duplicate entry." },
      { q: "How does e-prescribing work for virtual visits?", a: "Clinicians prescribe from inside the consult with built-in drug interaction and allergy checks. Prescriptions route to the patient's pharmacy of choice, and controlled substances follow local regulatory workflows including two-factor verification where required." },
      { q: "Can we run group or multi-party sessions?", a: "Yes. Translators, specialists, caregivers and family members can be added to any consult with role-based permissions. Group visits for chronic care and behavioral health are also supported." },
      { q: "Is the consultation recorded, and who controls the recording?", a: "Recording is optional and consent-based. Where enabled, recordings are stored securely and access is governed by role-based permissions with a full audit trail. Retention policies are configurable per tenant." },
      { q: "How quickly can we go live?", a: "Most healthcare organizations complete implementation in 3 to 6 weeks. Complex enterprise deployments with multiple HIS integrations and clinical workflow customizations may take longer. A dedicated implementation specialist is assigned to every account." },
    ],
  },
  "Final CTA": {
    headline: "Virtual Care Starts With",
    headlineAccent: "a Platform Built for Medicine.",
    body: "Every virtual visit carries the same duty of care as an in-clinic one. Give your clinicians the tools to deliver it safely — with encrypted video, structured notes, e-prescribing and real integration into the patient's record.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#",
    footnote: "No setup fees. No long-term contracts. Dedicated support from day one.",
    mediaUrl: heroImage.url,
  },
} as const;

export type TelemedicineContent = {
  [K in TelemedicineSectionKey]: typeof TELEMEDICINE_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<TelemedicineSectionKey, boolean> };

const TELEMEDICINE_PAGE_SLUG = "healthcare-telemedicine";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    const allObjects = over.every((v) => v && typeof v === "object" && !Array.isArray(v));
    if (allObjects) {
      return over.map((o: any, i: number) =>
        i < (base as any[]).length ? merge((base as any[])[i], o) : o,
      ) as T;
    }
    return over as T;
  }
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

export function useTelemedicineContent(): TelemedicineContent {
  return useSectionsContent(TELEMEDICINE_PAGE_SLUG, TELEMEDICINE_DEFAULTS) as TelemedicineContent;
}

export function useTelemedicineContentLegacy(): TelemedicineContent {
  const { data } = useQuery({
    queryKey: ["page-sections", TELEMEDICINE_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", TELEMEDICINE_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<TelemedicineSectionKey, boolean> };
  for (const key of Object.keys(TELEMEDICINE_DEFAULTS) as TelemedicineSectionKey[]) {
    merged[key] = merge(TELEMEDICINE_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as TelemedicineContent;
}
