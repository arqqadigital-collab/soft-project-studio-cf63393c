import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/uae-compliance/uae-hero.mp4.asset.json";
import ctaVideo from "@/assets/uae-compliance/uae-cta.mp4.asset.json";
import p1 from "@/assets/uae-compliance/problem/p1.jpg.asset.json";
import p2 from "@/assets/uae-compliance/problem/p2.jpg.asset.json";
import p3 from "@/assets/uae-compliance/problem/p3.jpg.asset.json";
import p4 from "@/assets/uae-compliance/problem/p4.jpg.asset.json";
import p5 from "@/assets/uae-compliance/problem/p5.jpg.asset.json";
import p6 from "@/assets/uae-compliance/problem/p6.jpg.asset.json";
import j1 from "@/assets/uae-compliance/journey/j1.jpg.asset.json";
import j2 from "@/assets/uae-compliance/journey/j2.jpg.asset.json";
import j3 from "@/assets/uae-compliance/journey/j3.jpg.asset.json";
import j4 from "@/assets/uae-compliance/journey/j4.jpg.asset.json";

export type KSAComplianceSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const KSA_COMPLIANCE_DEFAULTS = {
  Hero: {
    headline: "One Platform. Every KSA Regulator.",
    headlineAccent: "Full Kingdom Compliance.",
    ctaLabel: "Achieve Full KSA Compliance",
    ctaHref: "#contact",
    ctaLabel2: "Book a Kingdom Assessment",
    ctaHref2: "#contact",
    chips: [
      "MOH Saudi Arabia Aligned",
      "NPHIES Certified",
      "ZATCA Phase 2 Ready",
      "CBAHI Accreditation Support",
      "SCFHS Integrated",
      "Arabic & English Interface",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing Secreta KSA",
    headline: "Regulator-Specific Depth.",
    headlineAccent: "Kingdom-Wide Management Breadth.",
    body:
      "The Saudi healthcare sector operates under one of the most demanding regulatory environments in the region — spanning MOH, CBAHI, CCHI, SCFHS, ZATCA, and Vision 2030 transformation mandates. Secreta KSA is the only healthcare management platform that delivers full Kingdom compliance in a single unified system, with the NPHIES, ZATCA, and SEHA integration depth that generic platforms cannot match.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Every KSA Regulator is a Different",
    headingAccent: "Compliance Landscape.",
    items: [
      { title: "Overlapping Regulator Mandates", description: "KSA operators face parallel obligations from MOH, CBAHI, CCHI, SCFHS, and ZATCA — each with its own portals, formats, and deadlines that generic systems cannot orchestrate in one workflow.", image: p1.url },
      { title: "NPHIES Complexity", description: "NPHIES imposes strict FHIR-based transaction structures for eligibility, authorization, and claims — and payer-specific quirks that break generic integrations at scale.", image: p2.url },
      { title: "ZATCA Phase 2 Enforcement", description: "ZATCA e-invoicing Phase 2 requires cryptographic stamping and real-time clearance for every invoice. Non-compliant facilities face financial penalties and blocked collections.", image: p3.url },
      { title: "CBAHI Evidence Burden", description: "CBAHI accreditation cycles demand extensive evidence trails across clinical, operational, and safety domains — most systems force teams to assemble it manually every three years.", image: p4.url },
      { title: "PDPL & Data Residency", description: "The Saudi Personal Data Protection Law and NCA controls require in-Kingdom data residency and strict consent handling — a hard constraint most global platforms cannot satisfy.", image: p5.url },
      { title: "Cluster-Level Reporting Gaps", description: "Under the Health Sector Transformation, clusters must report consolidated KPIs across hospitals and PHCs — impossible when each facility runs a different system on different data models.", image: p6.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Built for Every KSA Regulator",
    body: "A single integrated platform with regulator-specific configuration depth — pre-built for MOH, CBAHI, NPHIES, ZATCA, SCFHS, and every major Saudi payer.",
    items: [
      { icon: "Building2", title: "MOH Saudi Arabia Compliance", description: "Full alignment with Ministry of Health regulations. MOH-formatted clinical documentation, licensing verification for practitioners and facilities, and mandatory public health reporting workflows built in." },
      { icon: "Hospital", title: "CBAHI Accreditation Support", description: "Structured compliance with CBAHI standards across clinical, operational, and safety domains — with built-in evidence collection, audit trails, and readiness dashboards for accreditation cycles." },
      { icon: "Share2", title: "NPHIES Integration", description: "Certified NPHIES connectivity for eligibility verification, prior authorization, claims submission, and remittance — with pre-configured payer profiles for every major KSA insurer and TPA." },
      { icon: "Database", title: "SEHA & Sehhaty Integration", description: "Real-time integration with SEHA virtual hospital services and Sehhaty citizen health records. Clinical summaries, appointments, and prescriptions flow automatically with MOH-compliant consent." },
      { icon: "Globe2", title: "ZATCA e-Invoicing (Fatoora)", description: "Full ZATCA Phase 2 e-invoicing compliance. XML-compliant invoices, cryptographic stamps, QR codes, and real-time clearance integration with the Fatoora platform — no external add-ons required." },
      { icon: "FileBadge", title: "SCFHS Licensing & Credentialing", description: "Live integration with Saudi Commission for Health Specialties for practitioner licensing, credential validation, CME tracking, and automated renewal alerts across your workforce." },
      { icon: "MapPin", title: "Vision 2030 Healthcare Alignment", description: "Configured for the Health Sector Transformation Program — value-based care contracting, cluster reporting models, and preventive health KPIs aligned with Vision 2030 mandates." },
      { icon: "ShieldCheck", title: "PDPL & NCA Cybersecurity", description: "Compliance with the Saudi Personal Data Protection Law and NCA Essential Cybersecurity Controls. Data residency in-Kingdom, consent management, and breach notification workflows built in." },
      { icon: "Languages", title: "Arabic & English Bilingual", description: "Every screen, clinical form, patient document, and regulatory report is fully functional in Arabic and English — with proper RTL rendering and Hijri/Gregorian date handling throughout." },
      { icon: "Layers", title: "Cluster & Group Consolidation", description: "Unified management layer for health clusters and multi-facility operators. Local compliance at each site, cluster-wide visibility, and MOH cluster reporting in a single view." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "KSA Compliance in 4 Stages",
    body: "From mapping to continuous alignment — MOH, CBAHI, NPHIES, ZATCA, and SCFHS covered end to end.",
    items: [
      { icon: "MapPin", title: "Kingdom Compliance Mapping", description: "Our KSA implementation team maps your operational footprint — facilities, payer mix, regulatory frameworks, and integration obligations — and produces a prioritized MOH/CBAHI/NPHIES gap analysis.", image: j1.url },
      { icon: "Settings", title: "Configuration & National Integration", description: "Each facility is configured to KSA-specific standards. NPHIES payer profiles, ZATCA e-invoicing, SCFHS credentialing, and SEHA/Sehhaty integrations are activated and tested end to end.", image: j2.url },
      { icon: "GraduationCap", title: "Bilingual Training & Phased Go-Live", description: "Staff are trained in Arabic and English by KSA-specialist consultants. Go-live is phased by facility with on-site live support, MOH readiness sign-off, and CBAHI evidence handover.", image: j3.url },
      { icon: "RefreshCw", title: "Continuous Regulatory Alignment", description: "Our KSA compliance team monitors MOH, CBAHI, NPHIES, ZATCA, and SCFHS updates continuously — and deploys changes before effective dates so your facilities stay compliant automatically.", image: j4.url },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Kingdom Compliance Performance",
    body: "Across our Saudi client network.",
    items: [
      { value: "97%", label: "Average first-pass NPHIES claim acceptance rate across KSA deployments" },
      { value: "100%", label: "ZATCA Phase 2 e-invoicing clearance compliance since go-live" },
      { value: "60%", label: "Reduction in CBAHI accreditation preparation time for multi-facility operators" },
      { value: "78%", label: "Reduction in prior authorization turnaround time via NPHIES integration" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Certified Across Every KSA National Platform",
    body: "Secreta KSA holds active, certified integrations with every major national health, insurance, and regulatory platform in the Kingdom — maintained and updated as specifications evolve.",
    groups: [
      {
        title: "National Platform Integrations",
        tags: [
          "NPHIES — CCHI",
          "ZATCA Fatoora (Phase 2)",
          "SEHA Virtual Hospital",
          "Sehhaty Citizen App",
          "SCFHS Practitioner Registry",
          "MOH Public Health Reporting",
          "Wasfaty e-Prescribing",
          "Absher Identity Verification",
        ],
      },
      {
        title: "Supported Standards in the Kingdom",
        tags: [
          "HL7 FHIR R4 (NPHIES Profiles)",
          "ICD-10-AM",
          "CPT-4",
          "SNOMED CT",
          "Saudi PDPL",
          "NCA Essential Cybersecurity Controls",
          "ZATCA XML e-Invoice",
          "REST API",
          "Arabic Unicode & Hijri Dates",
        ],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Is your NPHIES integration certified end to end?", answer: "Yes. Our NPHIES integration is certified and covers the full transaction set — eligibility, prior authorization, claims, remittance, and status inquiries — with pre-configured profiles for every major KSA payer and TPA. It is tested against each NPHIES release before rollout." },
      { question: "Do you handle ZATCA Phase 2 e-invoicing natively?", answer: "Yes. Secreta generates ZATCA-compliant XML invoices with cryptographic stamps and QR codes, and clears them in real time through the Fatoora platform. No third-party middleware is required, and B2B, B2C, and simplified invoice flows are supported out of the box." },
      { question: "How does the platform support CBAHI accreditation?", answer: "CBAHI standards are mapped to workflows across clinical, operational, and safety modules. Evidence is captured continuously through daily use, not assembled at audit time. Readiness dashboards show live compliance status per standard for each facility." },
      { question: "Is patient data hosted inside the Kingdom?", answer: "Yes. KSA deployments run on in-Kingdom infrastructure to meet PDPL and NCA data residency requirements. Backups, disaster recovery, and processing all remain inside the country, and consent and data-subject-rights workflows are built in." },
      { question: "Can clusters and multi-facility groups get consolidated reporting?", answer: "Yes. The cluster management layer consolidates clinical, operational, and financial data across hospitals and PHCs into a unified view aligned with Health Sector Transformation reporting, while each facility retains its own MOH and CBAHI local reporting." },
      { question: "How long does a typical KSA implementation take?", answer: "Single-facility implementations typically complete in 4 to 8 weeks. Multi-facility cluster deployments typically span 3 to 6 months with a dedicated KSA project team covering MOH readiness, NPHIES onboarding, ZATCA activation, and CBAHI evidence setup." },
    ],
  },
  "Final CTA": {
    headline: "The Kingdom Rewards Organizations That",
    headlineAccent: "Get Compliance Right.",
    body: "Give your organization the platform that makes KSA compliance a strength rather than a burden.",
    ctaLabel: "Book Your Kingdom Compliance Assessment",
    ctaHref: "#contact",
    ctaLabel2: "Start a 30-Day Trial",
    ctaHref2: "#contact",
    footnote: "Riyadh-based implementation team. Arabic and English support. In-Kingdom hosting. Regulatory updates included.",
    mediaUrl: ctaVideo.url,
    mediaKind: "video",
  },
} as const;

export type KSAComplianceContent = {
  [K in KSAComplianceSectionKey]: typeof KSA_COMPLIANCE_DEFAULTS[K];
} & { _visible: Record<KSAComplianceSectionKey, boolean> };

const KSA_COMPLIANCE_PAGE_SLUG = "healthcare-ksa-compliance";

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

export function useKSAComplianceContent(): KSAComplianceContent {
  return useSectionsContent(KSA_COMPLIANCE_PAGE_SLUG, KSA_COMPLIANCE_DEFAULTS) as KSAComplianceContent;
}

export function useKSAComplianceContentLegacy(): KSAComplianceContent {
  const { data } = useQuery({
    queryKey: ["page-sections", KSA_COMPLIANCE_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", KSA_COMPLIANCE_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<KSAComplianceSectionKey, boolean> };
  for (const key of Object.keys(KSA_COMPLIANCE_DEFAULTS) as KSAComplianceSectionKey[]) {
    merged[key] = merge(KSA_COMPLIANCE_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as KSAComplianceContent;
}
