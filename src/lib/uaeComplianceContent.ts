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

export type UAEComplianceSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const UAE_COMPLIANCE_DEFAULTS = {
  Hero: {
    headline: "One Platform. Every GCC Market.",
    headlineAccent: "Full Regulatory Compliance.",
    ctaLabel: "Achieve Full GCC Compliance",
    ctaHref: "#contact",
    ctaLabel2: "Book a Regional Assessment",
    ctaHref2: "#contact",
    chips: [
      "UAE DHA & HAAD Certified",
      "Qatar NHIX Ready",
      "Bahrain NHRA Compliant",
      "Kuwait MOH Aligned",
      "Oman TPA Integration",
      "Arabic & English Interface",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing Secreta UAE & GCC",
    headline: "Country-Specific Depth.",
    headlineAccent: "Regional Management Breadth.",
    body:
      "The Gulf healthcare sector operates across six distinct regulatory environments — each with its own insurance frameworks, data protection laws, e-health mandates, and reporting obligations. Secreta UAE & GCC is the only healthcare management platform that delivers full compliance across the UAE, Qatar, Bahrain, Kuwait, and Oman in a single unified system — with the country-specific configuration depth that generic regional platforms cannot match.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Every GCC Country is a Different",
    headingAccent: "Compliance Landscape.",
    items: [
      { title: "Three Frameworks at Once", description: "A group operating in Dubai, Abu Dhabi, and Doha is subject to three different insurance frameworks, data protection regimes, and e-health platform requirements — simultaneously.", image: p1.url },
      { title: "DHA vs DOH Specifications", description: "UAE facilities must comply with both DHA in Dubai and DOH in Abu Dhabi — similar in intent but different in technical specification. Generic systems can't bridge both.", image: p2.url },
      { title: "HIE Integration as Afterthought", description: "Malaffi and Riayati require active integration and real-time data sharing — yet most systems treat HIE connectivity as a checkbox rather than a core capability.", image: p3.url },
      { title: "Disparate National Platforms", description: "Qatar's NHIX, Bahrain's NHRA, and Kuwait's MOH all have distinct integration requirements that a single generic system cannot address without country-specific configuration.", image: p4.url },
      { title: "Strict Data Protection Laws", description: "UAE Federal Personal Data Protection Law and equivalent GCC frameworks impose strict requirements on how patient data is stored, processed, and transferred.", image: p5.url },
      { title: "Manual Group Reporting", description: "Multi-country groups produce compliance reports for each market separately using manual processes — slow, error-prone, and impossible to consolidate at group level.", image: p6.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Built for Every GCC Regulator",
    body: "A single integrated platform with country-specific configuration depth — pre-built for every major GCC regulator, payer, and national health platform.",
    items: [
      { icon: "Building2", title: "UAE DHA Compliance — Dubai", description: "Full alignment with Dubai Health Authority regulations. Compliant eClaims submission, DHA-formatted clinical documentation, integration with Dubai HIE, and practitioner licensing verification." },
      { icon: "Hospital", title: "UAE DOH Compliance — Abu Dhabi", description: "Full DOH compliance with Malaffi integration, Thiqa/Daman payer workflows, prior authorization through DOH-certified pathways, and JAWDA quality reporting." },
      { icon: "Share2", title: "Riayati Integration — Dubai HIE", description: "Real-time integration with Riayati. Clinical summaries, medications, and care history are shared and retrieved automatically at the point of care with DHA-compliant consent workflows." },
      { icon: "Database", title: "Malaffi Integration — Abu Dhabi HIE", description: "Certified Malaffi integration for real-time record sharing. Admissions, discharges, diagnoses, medications, and allergies are submitted automatically with full DOH compliance." },
      { icon: "Globe2", title: "Qatar NHIX Integration", description: "Connect to Qatar's National Health Information Exchange for eligibility verification, prior authorization, claims processing, and clinical data sharing with pre-built Qatari payer profiles." },
      { icon: "FileBadge", title: "Bahrain NHRA Compliance", description: "Full NHRA alignment with certified claim submission pathways, Bahraini clinical coding standards, licensing and credentialing records, and MOH Bahrain public health integrations." },
      { icon: "MapPin", title: "Kuwait & Oman Alignment", description: "Country-specific insurance workflows, clinical coding standards, MOH reporting formats, and regulatory documentation for facilities in Kuwait and Oman — no manual adaptation needed." },
      { icon: "ShieldCheck", title: "UAE Federal Data Protection", description: "Full compliance with UAE Federal Decree-Law No. 45 of 2021. Data residency options, consent management, data subject rights, and breach notification workflows built in." },
      { icon: "Languages", title: "Arabic & English Bilingual", description: "Every screen, clinical form, patient document, and regulatory report is fully functional in Arabic and English across all GCC country configurations — with no loss of functionality." },
      { icon: "Layers", title: "Group-Level Consolidation", description: "Unified management layer consolidating clinical, operational, and financial data across all sites and countries. Local compliance, group-wide visibility — in a single view." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "Regional Compliance in 4 Stages",
    body: "From mapping to continuous alignment — every country, every regulator, every payer covered end to end.",
    items: [
      { icon: "MapPin", title: "Regional Compliance Mapping", description: "Our GCC implementation team maps your operational footprint — countries, facilities, regulatory frameworks, and payers — and produces a prioritized country-by-country gap analysis.", image: j1.url },
      { icon: "Settings", title: "Country Configuration & Integration", description: "Each facility is configured to its local regulatory environment. Country-specific payer profiles, coding standards, claim formats, and national platform integrations are activated and tested.", image: j2.url },
      { icon: "GraduationCap", title: "Bilingual Training & Phased Go-Live", description: "Staff across all markets are trained in Arabic and English by country-specialist consultants. Go-live is phased by country or facility with on-site live support during each go-live.", image: j3.url },
      { icon: "RefreshCw", title: "Continuous Regulatory Alignment", description: "Our regional compliance team monitors all GCC markets continuously and deploys updates before effective dates — so your facilities stay compliant without tracking changes themselves.", image: j4.url },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Regional Compliance Performance",
    body: "Across our GCC client network.",
    items: [
      { value: "96%", label: "Average first-pass insurance claim acceptance across UAE, Qatar, and Bahrain deployments" },
      { value: "100%", label: "Malaffi & Riayati integration obligations met within regulatory deadlines" },
      { value: "55%", label: "Reduction in group-level compliance reporting time for multi-country operators" },
      { value: "82%", label: "Reduction in prior authorization turnaround time via regional payer integrations" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Certified Across Every GCC National Health Platform",
    body: "Secreta UAE & GCC holds active, certified integrations with every major national health and insurance platform across the Gulf — maintained and updated as specifications evolve in each market.",
    groups: [
      {
        title: "National Platform Integrations",
        tags: [
          "Malaffi — Abu Dhabi HIE",
          "Riayati — Dubai HIE",
          "DHA eClaims Portal",
          "DOH Abu Dhabi Insurance Gateway",
          "Qatar NHIX",
          "NHRA Bahrain Insurance Portal",
          "Kuwait MOH Reporting Platform",
          "Oman TPA Integration Gateway",
        ],
      },
      {
        title: "Supported Standards Across GCC Markets",
        tags: [
          "HL7 FHIR R4",
          "ICD-10-AM",
          "CPT-4",
          "DRG GCC Grouper Variants",
          "UAE Federal Data Protection Law",
          "Qatar Personal Data Privacy Law",
          "GCC Cybersecurity Frameworks",
          "REST API",
          "Arabic Unicode Clinical Documentation",
        ],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Do you support both DHA and DOH compliance in the same system?", answer: "Yes. Facilities operating in both Dubai and Abu Dhabi can run both DHA and DOH compliance configurations within a single Secreta deployment. Claims, reports, and integrations are automatically routed through the correct regulatory pathway based on each facility's location and license." },
      { question: "Is your Malaffi integration currently certified?", answer: "Yes. Our Malaffi integration holds active DOH certification and covers the full mandatory data sharing transaction set — admissions, discharges, diagnoses, medications, allergies, and clinical summaries. It is tested against each Malaffi platform release before deployment." },
      { question: "How do you handle regulatory changes across six GCC markets?", answer: "Secreta employs a dedicated GCC regulatory compliance team that monitors all markets continuously. When changes are confirmed, the relevant modules are updated and deployed before the effective date, with advance communication to clients." },
      { question: "Can a healthcare group see consolidated reporting across all GCC operations?", answer: "Yes. The group management layer consolidates clinical, operational, and financial data from all facilities and countries into a unified executive view, while country-specific compliance reports remain available for local regulatory use." },
      { question: "How is patient data handled across borders within a GCC group?", answer: "Data handling is configured to comply with each country's data protection law. Cross-border transfers within a group are governed by the most restrictive applicable framework, and data residency options are available for each country." },
      { question: "How long does regional implementation take for a multi-country group?", answer: "Single-country implementations typically complete in 4 to 8 weeks. Full GCC regional deployments across four to five countries typically span 4 to 6 months with a dedicated regional project team." },
    ],
  },
  "Final CTA": {
    headline: "The GCC Market Rewards Organizations That",
    headlineAccent: "Get Compliance Right.",
    body: "Give your organization the platform that makes GCC compliance a strength rather than a burden.",
    ctaLabel: "Book Your Regional Compliance Assessment",
    ctaHref: "#contact",
    ctaLabel2: "Start a 30-Day Trial",
    ctaHref2: "#contact",
    footnote: "GCC-based implementation team. Arabic and English support across all markets. Regulatory updates included.",
    mediaUrl: ctaVideo.url,
    mediaKind: "video",
  },
} as const;

export type UAEComplianceContent = {
  [K in UAEComplianceSectionKey]: typeof UAE_COMPLIANCE_DEFAULTS[K];
} & { _visible: Record<UAEComplianceSectionKey, boolean> };

const UAE_COMPLIANCE_PAGE_SLUG = "healthcare-uae-compliance";

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

export function useUAEComplianceContent(): UAEComplianceContent {
  return useSectionsContent(UAE_COMPLIANCE_PAGE_SLUG, UAE_COMPLIANCE_DEFAULTS) as UAEComplianceContent;
}

export function useUAEComplianceContentLegacy(): UAEComplianceContent {
  const { data } = useQuery({
    queryKey: ["page-sections", UAE_COMPLIANCE_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", UAE_COMPLIANCE_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<UAEComplianceSectionKey, boolean> };
  for (const key of Object.keys(UAE_COMPLIANCE_DEFAULTS) as UAEComplianceSectionKey[]) {
    merged[key] = merge(UAE_COMPLIANCE_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as UAEComplianceContent;
}
