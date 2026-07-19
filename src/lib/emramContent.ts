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

export type EMRAMSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const EMRAM_DEFAULTS = {
  Hero: {
    headline: "Your Path to EMRAM Stage 7 —",
    headlineAccent: "and the AI Capabilities That Come With It.",
    ctaLabel: "Start Your EMRAM Journey",
    ctaHref: "#contact",
    ctaLabel2: "Book a Baseline Assessment",
    ctaHref2: "#contact",
    chips: [
      "HIMSS EMRAM Methodology",
      "Stage 6 & Stage 7 Validation",
      "Closed-Loop Medication",
      "Clinical Decision Support",
      "HL7 FHIR R4 Architecture",
      "AI Readiness Program",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "EMRAM Stage 7 — The Global Gold Standard",
    headline: "A Fully Paperless, Closed-Loop,",
    headlineAccent: "Analytically Capable Hospital.",
    body:
      "EMRAM Stage 7 is the global gold standard for hospital digital maturity. It signals to patients, payers, regulators, and partners that your organization has achieved a fully paperless, closed-loop, analytically capable clinical environment. But most hospitals are not on a structured path to get there. Secreta EMRAM Roadmap & AI Readiness gives your organization the strategy, the technology, and the implementation support to advance through every EMRAM stage — and to emerge at Stage 7 genuinely ready for AI-powered clinical decision support, predictive analytics, and population health management.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "EMRAM Stage 7 Is Not a Technology Milestone.",
    headingAccent: "It Is an Organizational Transformation.",
    items: [
      { title: "Fragmented Clinical Data", description: "Most hospitals enter the EMRAM journey with fragmented, inconsistent or uncleaned data that cannot be trusted in clinical practice — let alone power AI.", image: p1.url },
      { title: "Clinical Transformation Gap", description: "IT teams understand the technical requirements but lack the clinical transformation expertise to drive the workflow changes Stage 6 and Stage 7 demand.", image: p2.url },
      { title: "No Framework for Progress", description: "Leadership invests in digital transformation without a clear framework for measuring progress, demonstrating value or maintaining operational standards.", image: p3.url },
      { title: "Workflow Adoption Underestimated", description: "EMRAM is not purely technical — it requires clinical leadership engagement, staff behavior change and sustained organizational commitment most programs underestimate.", image: p4.url },
      { title: "Closed-Loop Medication Complexity", description: "ePrescribing through pharmacy verification, dispensing cabinet integration and barcode-verified administration is the requirement hospitals find most challenging.", image: p5.url },
      { title: "AI Readiness Is Not a Certificate", description: "Stage 7 opens the door to clinical AI — but data quality, governance frameworks, validation processes and AI literacy must be built systematically.", image: p6.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Program",
    heading: "A Structured, Supported, Stage-by-Stage Path to Digital Excellence",
    body: "Eight integrated capabilities that take your organization from baseline assessment through Stage 7 validation — and into a future of meaningful clinical AI.",
    items: [
      { icon: "ClipboardList", title: "EMRAM Baseline Assessment", description: "Rigorous baseline assessment of your current EMRAM position — clinical systems, integration architecture, workflow digitization, data quality, closed-loop safety and adoption — scored against validated HIMSS EMRAM methodology with a prioritized gap roadmap." },
      { icon: "Map", title: "Stage-by-Stage Roadmap", description: "A detailed, time-bound roadmap from your current position to Stage 7. Each stage specifies technology, workflow redesign, integration, adoption milestones and validation criteria — sequenced to minimize operational disruption." },
      { icon: "Workflow", title: "Clinical Workflow Digitization", description: "Our clinical transformation team works alongside your leads to redesign workflows, build adoption and achieve the sustained usage rates EMRAM validation requires. Technology without adoption does not pass EMRAM. We manage both." },
      { icon: "Pill", title: "Closed-Loop Medication Safety", description: "End-to-end closed-loop medication: ePrescribing, pharmacy verification, dispensing cabinet integration and barcode-verified bedside administration — delivered with the change management needed for consistent staff compliance." },
      { icon: "Brain", title: "Clinical Decision Support Maturity", description: "Condition-specific order sets, evidence-based pathways, sepsis screening, deterioration alerts and preventive reminders — built, configured, validated and measured against the clinical outcomes EMRAM assessors look for." },
      { icon: "Database", title: "Data Integration & Interoperability", description: "Target integration architecture with HL7 FHIR interfaces, clinical data repositories and master patient index. Every system talks to every other system — patient data follows the patient without gaps, delays or manual reconciliation." },
      { icon: "Sparkles", title: "AI Readiness Assessment", description: "Evaluation of data completeness, data quality, governance maturity, clinical AI literacy and infrastructure capacity against the requirements for safe, effective clinical AI deployment — with a targeted program to close every gap." },
      { icon: "BadgeCheck", title: "Validation Preparation & Support", description: "Documentation preparation, leadership coaching, pre-validation mock assessments and on-site support through formal HIMSS validation — followed by operational sustainability practices to maintain your stage." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "From Assessment to Stage 7 — A Structured Journey",
    body: "Seven sequenced stages that take your organization from current state to validated digital excellence — and into sustained AI-enabled operation.",
    items: [
      { icon: "ClipboardList", title: "Baseline Assessment", image: j1.url, description: "We assess your current EMRAM position across all criteria. You receive a current-state score, a gap analysis and a prioritized roadmap." },
      { icon: "Users", title: "Roadmap Agreement", image: j2.url, description: "Leadership reviews and approves the roadmap. Resources, timelines and governance structures are agreed. The transformation program begins." },
      { icon: "GitBranch", title: "Technology & Integration", image: j3.url, description: "Missing systems are implemented. Integration gaps are closed. Closed-loop medication safety, CDS and electronic documentation are built to EMRAM specification." },
      { icon: "Workflow", title: "Clinical Adoption", image: j4.url, description: "Workflows are redesigned, staff are trained, adoption is measured and managed. EMRAM operational standards are embedded in daily clinical practice." },
      { icon: "Sparkles", title: "AI Readiness Foundation", image: j5.url, description: "Data quality, governance and infrastructure are built to support clinical AI. The readiness assessment confirms readiness for Stage 7 AI-powered analytics." },
      { icon: "BadgeCheck", title: "Validation & Certification", image: j6.url, description: "Pre-validation mock assessment is conducted, gaps are closed and the formal HIMSS validation is supported from preparation through on-site assessment." },
      { icon: "Target", title: "Sustained Excellence", image: j7.url, description: "Post-validation operational support ensures EMRAM standards are maintained. AI capabilities are progressively deployed on the mature digital foundation." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "EMRAM Achievement Outcomes Across Our Client Portfolio",
    body: "Validated outcomes from clients on the full Secreta EMRAM program.",
    items: [
      { value: "100%", label: "First-attempt EMRAM validation pass rate for clients completing the full Secreta roadmap program" },
      { value: "1.8", label: "Average advancement in EMRAM stages within the first 18 months of program commencement" },
      { value: "94%", label: "Closed-loop medication administration compliance achieved by Stage 6 target clients" },
      { value: "40+", label: "Stage 6 and Stage 7 EMRAM achievements supported across the GCC, Middle East and internationally" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Built on an Integration Architecture Designed for Stage 7",
    body:
      "EMRAM Stage 7 requires a fully integrated digital hospital. Our integration framework connects every clinical system — EMR, laboratory, radiology, pharmacy, operating theatre, ICU and more — through a standards-based interoperability architecture that meets HIMSS EMRAM validation requirements.",
    groups: [
      {
        icon: "Network",
        title: "Integration Standards",
        subtitle: "Standards-based interoperability",
        items: [
          "HL7 FHIR R4",
          "HL7 v2",
          "IHE Profiles",
          "DICOM",
          "SNOMED CT",
          "LOINC",
          "RxNorm",
          "REST API",
          "Clinical Data Repository Architecture",
        ],
      },
      {
        icon: "BadgeCheck",
        title: "EMRAM Stages Supported",
        subtitle: "Across the full HIMSS maturity model",
        items: [
          "Stage 1",
          "Stage 2",
          "Stage 3",
          "Stage 4",
          "Stage 5",
          "Stage 6",
          "Stage 7",
          "O-EMRAM (Outpatient)",
          "C-EMRAM (Community)",
          "INFRAM Alignment",
        ],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How long does it take to achieve EMRAM Stage 7 from a typical starting point?", a: "From Stage 3 or Stage 4 — where most hospitals begin a structured EMRAM program — achieving Stage 7 typically takes 3 to 5 years depending on size, complexity, starting maturity and change capacity. The clinical improvements delivered at each stage have measurable patient safety and operational value long before Stage 7 is achieved." },
      { q: "What is the difference between EMRAM and other digital health certification frameworks?", a: "EMRAM is the most widely recognized and rigorously validated framework globally. Unlike self-reported certifications, Stage 6 and Stage 7 require on-site validation by HIMSS-certified assessors who verify systems are in use, integrated and adopted — not merely implemented. GCC health authorities and international accreditation bodies use it as the digital maturity benchmark." },
      { q: "Do we need to implement all of Secreta's modules to achieve EMRAM?", a: "No. EMRAM evaluates functional capability and adoption, not specific vendor products. Secreta works with your existing system landscape, filling gaps where needed and integrating what already exists. We do not require replacement of functioning systems as a condition of EMRAM support." },
      { q: "What does AI readiness actually require beyond EMRAM Stage 7?", a: "Stage 7 provides the integrated, standardized, complete data foundation AI requires. AI readiness additionally requires data quality validation, governance frameworks for model validation and post-deployment monitoring, clinical leadership AI literacy and infrastructure capable of supporting real-time inference at clinical workflow speed. Our AI readiness program addresses each dimension systematically." },
      { q: "What happens to our EMRAM stage after validation if systems or workflows change?", a: "EMRAM requires annual validation maintenance. Secreta provides post-validation support to ensure system changes, workflow updates and new clinical program launches do not inadvertently compromise compliance. Sustainability governance frameworks are established at Stage 7 go-live to manage this ongoing requirement." },
    ],
  },
  "Final CTA": {
    headline: "EMRAM Stage 7 Is Not the Finish Line.",
    headlineAccent: "It Is the Starting Line for What Healthcare Can Become.",
    body:
      "A Stage 7 hospital has the digital foundation to deploy clinical AI that saves lives, predict deterioration before it happens, manage populations proactively and deliver care measurably safer, faster and more effective than fragmented systems can support. The path starts with knowing where you are today.",
    primaryLabel: "Book Your EMRAM Baseline Assessment",
    primaryHref: "#",
    secondaryLabel: "Download the EMRAM Stage Guide",
    secondaryHref: "#",
    footnote:
      "Advisory and implementation support available in Arabic and English. GCC and international experience. Assessment findings delivered within 4 weeks.",
    mediaUrl: ctaVideo.url,
  },
} as const;

export type EMRAMContent = {
  [K in EMRAMSectionKey]: typeof EMRAM_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<EMRAMSectionKey, boolean> };

const EMRAM_PAGE_SLUG = "healthcare-emram";

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

export function useEMRAMContent(): EMRAMContent {
  return useSectionsContent(EMRAM_PAGE_SLUG, EMRAM_DEFAULTS) as EMRAMContent;
}

export function useEMRAMContentLegacy(): EMRAMContent {
  const { data } = useQuery({
    queryKey: ["page-sections", EMRAM_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", EMRAM_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<EMRAMSectionKey, boolean> };
  for (const key of Object.keys(EMRAM_DEFAULTS) as EMRAMSectionKey[]) {
    merged[key] = merge(EMRAM_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as EMRAMContent;
}
