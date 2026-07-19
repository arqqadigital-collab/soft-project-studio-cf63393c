import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/emram/emram-hero.mp4.asset.json";
import ctaVideo from "@/assets/emram/emram-cta.mp4.asset.json";
import p1 from "@/assets/emram/problem/p1.jpg.asset.json";
import p2 from "@/assets/emram/problem/p2.jpg.asset.json";
import p3 from "@/assets/emram/problem/p3.jpg.asset.json";
import p4 from "@/assets/emram/problem/p4.jpg.asset.json";
import p5 from "@/assets/emram/problem/p5.jpg.asset.json";
import p6 from "@/assets/emram/problem/p6.jpg.asset.json";
import j1 from "@/assets/emram/journey/j1.jpg.asset.json";
import j2 from "@/assets/emram/journey/j2.jpg.asset.json";
import j3 from "@/assets/emram/journey/j3.jpg.asset.json";
import j4 from "@/assets/emram/journey/j4.jpg.asset.json";
import j5 from "@/assets/emram/journey/j5.jpg.asset.json";
import j6 from "@/assets/emram/journey/j6.jpg.asset.json";
import j7 from "@/assets/emram/journey/j7.jpg.asset.json";

export type ClinicalAiSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "How It Works"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const CLINICAL_AI_DEFAULTS = {
  Hero: {
    headline: "Give Clinicians Their Time Back —",
    headlineAccent: "Documentation That Writes Itself, Safely.",
    ctaLabel: "Deploy Clinical AI",
    ctaHref: "#contact",
    ctaLabel2: "Book a Live Demo",
    ctaHref2: "#contact",
    chips: [
      "Ambient AI Scribe",
      "Structured Note Generation",
      "Real-Time CDS",
      "Auto-Coding (ICD-10 / CPT)",
      "Bilingual Arabic & English",
      "Governed & Auditable",
    ],
    mediaUrl: heroVideo.url,
  },
  Introduction: {
    eyebrow: "Secreta Clinical AI & Documentation",
    headline: "Ambient Scribe, Structured Notes,",
    headlineAccent: "Coding and Decision Support — Governed.",
    body:
      "Clinical AI is only useful if clinicians trust it and regulators accept it. Secreta Clinical AI & Documentation combines an ambient voice scribe, structured note generation, real-time decision support and automated coding into a single, EMR-integrated, bilingual and fully governed platform — so your clinicians get their time back, your coding gets tighter, and your medical AI committee gets the audit trail it needs.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Clinicians Are Drowning in Documentation.",
    headingAccent: "Point-Solution AI Is Making It Riskier.",
    items: [
      { title: "Documentation Burden Is Burning Out Clinicians", description: "Clinicians spend more time typing into the EMR than looking at patients. Documentation is the number-one driver of clinician burnout and attrition in every recent workforce study.", image: p1.url },
      { title: "Notes That Do Not Serve Care", description: "Copy-forward, template-driven notes have become optimized for billing, not for clinical communication — degrading the very record that downstream care depends on.", image: p2.url },
      { title: "Coding Leakage and Denials", description: "Manual coding lags the encounter by days, misses documented conditions, and generates preventable denials — leaving significant realized revenue on the table every month.", image: p3.url },
      { title: "AI Tools Bolted Onto the Side", description: "Point-solution AI scribes live outside the EMR, without governance, audit trails or bilingual support — creating clinical safety, compliance and integration risk instead of solving it.", image: p4.url },
      { title: "No Governance for Clinical AI", description: "Most organizations deploy AI without model validation, drift monitoring, override tracking or a medical AI committee — a posture regulators are moving quickly to end.", image: p5.url },
      { title: "Arabic Documentation Is an Afterthought", description: "Most clinical AI tools were built for English-only workflows. Arabic medical terminology, RTL rendering and bilingual patient-facing outputs are handled poorly or not at all.", image: p6.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "One Assistant, Every Documentation Task",
    body: "Eight integrated capabilities that cover the encounter end to end — from ambient capture through coding, CDS and discharge — inside your existing EMR, in Arabic and English.",
    items: [
      { icon: "Mic", title: "Ambient Voice Scribe", description: "Passive, always-on ambient listening during the encounter transcribes the clinician–patient conversation, structures it into a SOAP note and files it into the EMR — with the clinician reviewing and signing rather than typing." },
      { icon: "FileText", title: "Structured Note Generation", description: "Free-text dictation, ambient audio and captured findings are transformed into fully structured clinical notes with diagnoses, orders, plans and coded problem lists — ready for billing, coding and downstream analytics." },
      { icon: "Stethoscope", title: "Real-Time Clinical Decision Support", description: "Evidence-based prompts, guideline reminders, drug–drug and drug–allergy checks and sepsis / deterioration alerts surface at the point of decision — not buried inside menus after the moment has passed." },
      { icon: "Brain", title: "Differential Diagnosis Assistant", description: "The assistant proposes ranked differentials from presenting complaints, vitals, labs and history — with cited evidence and recommended next investigations that the clinician confirms, edits or discards." },
      { icon: "Sparkles", title: "Auto-Coding & Charge Capture", description: "ICD-10, CPT and country-specific codes are suggested directly from the documented encounter with confidence scores and evidence spans — reducing coder queries, denials and revenue leakage." },
      { icon: "ClipboardList", title: "Discharge Summary Automation", description: "Discharge summaries, referral letters and patient-friendly instructions are drafted automatically from the encounter — bilingual, formatted to local regulator templates and ready for clinician sign-off." },
      { icon: "Languages", title: "Bilingual Arabic & English", description: "Every AI-generated artifact — notes, summaries, patient instructions, coding rationales — is fully functional in Arabic and English, with proper medical terminology handling in both languages." },
      { icon: "ShieldCheck", title: "Governance, Audit & Human-in-the-Loop", description: "Every AI output is versioned, attributable and reviewable. Model performance, drift and clinician override rates are monitored continuously with governance dashboards for the medical AI committee." },
    ],
  },
  "How It Works": {
    eyebrow: "How It Works",
    heading: "From Discovery to Governed Rollout — A Structured Program",
    body: "Seven sequenced stages that take clinical AI from concept to safe, adopted daily use across your specialties and sites.",
    items: [
      { icon: "ClipboardList", image: j1.url, title: "Clinical Workflow Discovery", description: "We map the specialties, encounter types, documentation templates and coding workflows in scope — and identify the highest-value opportunities for AI-assisted documentation." },
      { icon: "Users", image: j2.url, title: "Model & Template Configuration", description: "Specialty-specific prompts, note templates, coding rules and safety guardrails are configured to your organization's clinical standards, formulary and regulator requirements." },
      { icon: "GitBranch", image: j3.url, title: "EMR & Voice Integration", description: "Ambient capture devices, mobile app, and the assistant surface are integrated with your EMR via HL7 FHIR — with SSO, role-based access and full audit logging in place." },
      { icon: "Sparkles", image: j4.url, title: "Clinician Pilot & Calibration", description: "A pilot cohort uses the assistant on live encounters. Outputs are graded, prompts are tuned, and clinician-specific personalization is calibrated before wider rollout." },
      { icon: "Activity", image: j5.url, title: "Phased Clinical Rollout", description: "Rollout is phased by department and specialty with on-floor super-users, adoption tracking and daily quality huddles during each go-live wave." },
      { icon: "BadgeCheck", image: j6.url, title: "Governance & Continuous Monitoring", description: "Model performance, override rates, safety events and coding accuracy are monitored continuously. Findings feed a monthly medical AI governance review." },
      { icon: "Target", image: j7.url, title: "Expansion & Advanced AI", description: "Once documentation AI is embedded, adjacent capabilities — predictive risk, population health, imaging AI — are progressively deployed on the same governed foundation." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Clinical AI Outcomes Across Our Client Portfolio",
    body: "Validated outcomes from clients running the full Secreta Clinical AI program.",
    items: [
      { value: "72%", label: "Reduction in average clinical documentation time per encounter across piloted specialties" },
      { value: "2.1", label: "Hours per clinician per day returned to direct patient care after full ambient scribe rollout" },
      { value: "38%", label: "Reduction in coding-related claim denials after auto-coding and evidence-linked charge capture" },
      { value: "94%", label: "Clinician acceptance rate of AI-drafted notes after review, across primary care and specialty settings" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Built to Sit Inside the Systems Your Clinicians Already Use",
    body: "Clinical AI only works when it lives inside the clinician's workflow. Secreta Clinical AI integrates directly with the EMR, coding, e-prescribing, imaging and messaging systems already in daily use.",
    groups: [
      {
        title: "Integration Standards",
        items: ["HL7 FHIR R4", "HL7 v2", "SMART on FHIR", "DICOM SR", "SNOMED CT", "LOINC", "RxNorm", "ICD-10 / CPT", "REST API & Webhooks"],
      },
      {
        title: "Capabilities Supported",
        items: ["Ambient Voice Scribe", "Structured SOAP Notes", "Real-Time CDS", "Differential Diagnosis", "Auto-Coding", "Discharge Summaries", "Referral Letters", "Bilingual Arabic / English", "Model Governance Dashboards"],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Is the ambient scribe safe to use on real patient encounters?", a: "Yes. Every AI-generated note is a draft that requires clinician review and sign-off before it becomes part of the medical record. The assistant surfaces evidence spans from the transcript alongside each statement, and all inputs and outputs are logged for audit. Nothing is filed silently, and no clinical action is taken without a human decision." },
      { q: "How does the assistant handle Arabic-speaking patients?", a: "Ambient capture, transcription, note generation and patient-facing artifacts all operate natively in Arabic and English, including code-switched encounters. Medical terminology is normalized in both languages, and outputs preserve the language the clinician chooses for the record and the language the patient needs on their instructions." },
      { q: "Where does the audio and transcript data live?", a: "Deployments run on in-region infrastructure aligned with your local data protection regime — Saudi PDPL, UAE Federal Decree-Law 45, and equivalent GCC frameworks. Raw audio retention is configurable, encryption at rest and in transit is standard, and no data is used to train shared models without explicit contractual opt-in." },
      { q: "Do we have to replace our EMR to use it?", a: "No. The assistant integrates with your existing EMR through HL7 FHIR and standard interoperability profiles. Notes, orders, problems and coded artifacts are filed back into the EMR of record. Where EMR capabilities are limited, the assistant surfaces its own review workspace without displacing the EMR." },
      { q: "How is model performance monitored after go-live?", a: "A medical AI governance dashboard tracks clinician acceptance rates, edit distance on drafts, coding accuracy, override reasons, safety-relevant flags and drift indicators by specialty and site. Findings feed a monthly medical AI committee review, and thresholds trigger automatic retraining or prompt revision cycles." },
    ],
  },
  "Final CTA": {
    headline: "The Best AI in Healthcare Is the AI Clinicians Actually Use.",
    headlineAccent: "Governed, Bilingual, and Inside the EMR.",
    body: "Give your clinicians their time back, tighten your coding, and give your medical AI committee the audit trail it needs — all on one governed platform. See it running on a real encounter in your specialty.",
    primaryLabel: "Book a Clinical AI Demo",
    primaryHref: "#",
    secondaryLabel: "Download the Clinical AI Brief",
    secondaryHref: "#",
    footnote: "Deployment support in Arabic and English. GCC and international experience. Pilots typically live within 6 weeks.",
    mediaUrl: ctaVideo.url,
  },
} as const;

export type ClinicalAiContent = {
  [K in ClinicalAiSectionKey]: typeof CLINICAL_AI_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<ClinicalAiSectionKey, boolean> };

const CLINICAL_AI_PAGE_SLUG = "healthcare-clinical-ai";

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

export function useClinicalAiContent(): ClinicalAiContent {
  return useSectionsContent(CLINICAL_AI_PAGE_SLUG, CLINICAL_AI_DEFAULTS) as ClinicalAiContent;
}

export function useClinicalAiContentLegacy(): ClinicalAiContent {
  const { data } = useQuery({
    queryKey: ["page-sections", CLINICAL_AI_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", CLINICAL_AI_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<ClinicalAiSectionKey, boolean> };
  for (const key of Object.keys(CLINICAL_AI_DEFAULTS) as ClinicalAiSectionKey[]) {
    merged[key] = merge(CLINICAL_AI_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ClinicalAiContent;
}
