import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import heroVideo from "@/assets/dynamics/dynamics-hero-bg.mp4.asset.json";
import pattern from "@/assets/dynamics/dynamics-pattern.jpg.asset.json";
import u1 from "@/assets/dynamics/use-case-1.jpg.asset.json";
import u2 from "@/assets/dynamics/use-case-2.jpg.asset.json";
import u3 from "@/assets/dynamics/use-case-3.jpg.asset.json";
import u4 from "@/assets/dynamics/use-case-4.jpg.asset.json";
import p1 from "@/assets/dynamics/problem/p1.jpg.asset.json";
import p2 from "@/assets/dynamics/problem/p2.jpg.asset.json";
import p3 from "@/assets/dynamics/problem/p3.jpg.asset.json";
import p4 from "@/assets/dynamics/problem/p4.jpg.asset.json";
import p5 from "@/assets/dynamics/problem/p5.jpg.asset.json";
import p6 from "@/assets/dynamics/problem/p6.jpg.asset.json";
import j1 from "@/assets/dynamics/journey/j1.jpg.asset.json";
import j2 from "@/assets/dynamics/journey/j2.jpg.asset.json";
import j3 from "@/assets/dynamics/journey/j3.jpg.asset.json";
import j4 from "@/assets/dynamics/journey/j4.jpg.asset.json";

export type DynamicsSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const DYNAMICS_DEFAULTS = {
  Hero: {
    headline: "Standardized where beneficial.",
    headlineAccent: "Engineered where it matters.",
    ctaLabel: "Request project scoping",
    ctaHref: "#contact",
    ctaLabel2: "View capabilities",
    ctaHref2: "#services",
    chips: [
      "D365 Finance",
      "SCM & Business Central",
      "Power Platform",
      "Azure Integration",
      "Power BI",
      "Multi-entity",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
    posterUrl: pattern.url,
  },
  Introduction: {
    eyebrow: "Microsoft Dynamics 365",
    headline: "Implementation, Integration",
    headlineAccent: "& Customization.",
    body:
      "SBS implements, customizes, and integrates Microsoft Dynamics 365 environments structured around how you operate — delivering end-to-end value across finance, operations, and analytics. Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Why Most Dynamics 365",
    headingAccent: "Programs Underperform.",
    items: [
      { title: "Default Configurations", description: "Out-of-the-box D365 does not match how your enterprise actually operates — leading to workarounds, shadow processes, and abandonment.", image: p1.url },
      { title: "Manual Approval Chains", description: "Without engineered workflow governance, procurement, expense, and HR approvals collapse into email chains and Excel trackers.", image: p2.url },
      { title: "Legacy System Debt", description: "Legacy ERPs, banking connectors, and industry tools remain unintegrated — turning D365 into another silo instead of the operational core.", image: p3.url },
      { title: "Fragmented Reporting", description: "Data lives in D365 but decisions live in disconnected spreadsheets. Leaders lose real-time visibility into finance and operations.", image: p4.url },
      { title: "Slow Consolidation", description: "Multi-entity groups spend days closing books because entity structures, intercompany rules, and currency logic were never properly engineered.", image: p5.url },
      { title: "Go-Live as Finish Line", description: "Programs that treat cutover as the end — instead of the start of stabilization — produce brittle systems that fail under real operational load.", image: p6.url },
    ],
  },
  "The Platform": {
    eyebrow: "What We Deliver",
    heading: "Enterprise Microsoft Dynamics Services",
    body: "Every engagement is scoped to operational requirements, governance structures, and long-term maintainability — not software deployment timelines.",
    items: [
      { icon: "Layers", title: "Dynamics Implementation", description: "End-to-end implementation of D365 Finance, SCM, and Business Central structured around operational requirements, data integrity, and long-term scalability — not default configurations." },
      { icon: "Workflow", title: "Workflow & Process Automation", description: "Custom approval structures, procurement workflows, and operational automation aligned to your governance model — eliminating manual coordination without creating process gaps." },
      { icon: "Network", title: "Microsoft Ecosystem Integration", description: "Integration between Dynamics 365 and the full Microsoft stack — plus external banking, logistics, and enterprise applications — designed for operational continuity, not point-to-point patches." },
      { icon: "BarChart3", title: "Power BI Reporting Architecture", description: "Operational and financial reporting environments that transform D365 data into executive dashboards and decision-ready intelligence — not just static exports." },
      { icon: "Wrench", title: "Customization & Extensions", description: "Custom entities, role-specific interfaces, and operational logic that standard D365 configurations cannot address — built with long-term maintainability and upgrade compatibility in mind." },
      { icon: "DatabaseZap", title: "Data Migration & Modernization", description: "Structured migration from legacy ERP systems into Dynamics 365 — prioritizing data integrity, operational continuity, and validated transition over speed of cutover." },
    ],
  },
  "Patient Journey": {
    eyebrow: "Implementation Governance Process",
    heading: "How We Scope, Architect,",
    headingAccent: "and Deliver D365.",
    body: "ERP failures are rarely software failures. They result from unclear scope, weak governance, and implementations that treat go-live as the finish line. Our five-phase framework is designed against those outcomes.",
    items: [
      { icon: "ScanSearch", title: "Operational Discovery & Requirements Mapping", description: "We evaluate business processes, reporting dependencies, and organizational structure to define how D365 should support the enterprise — before any configuration begins.", image: j1.url },
      { icon: "ShieldCheck", title: "Solution Architecture & Governance Design", description: "System structure, role-based access, approval workflows, integration topology, and reporting architecture are designed and documented before development begins.", image: j2.url },
      { icon: "Code2", title: "Configuration, Development & Integration", description: "D365 is configured and extended against approved requirements. Integrations, automation layers, and custom logic are built within a structured delivery framework — version-controlled, not ad hoc.", image: j3.url },
      { icon: "Rocket", title: "Testing, Deployment & Operational Transition", description: "All workflows validated in UAT. Production rollout via controlled deployment procedures, supported by user training, operational documentation, and a defined hypercare period.", image: j4.url },
    ],
  },
  Outcomes: {
    eyebrow: "Enterprise Use Cases",
    heading: "What Enterprises Actually",
    headingAccent: "Build with Dynamics 365.",
    body: "Representative operational transformation initiatives — not generic ERP demos.",
    items: [
      { value: "40%", label: "Reduction in month-end close time via engineered consolidation and intercompany automation" },
      { value: "60%", label: "Faster procurement approval cycles through governed workflow automation" },
      { value: "3x", label: "Executive reporting speed via Power BI architecture instead of static exports" },
      { value: "100%", label: "Legacy ERP migrations delivered with validated data integrity and controlled cutover" },
    ],
    cards: [
      { title: "Multi-Entity Financial Management", body: "Centralized financial operations across multiple companies, branches, or operational entities with standardized reporting, approval governance, and consolidated visibility.", image: u1.url },
      { title: "Procurement & Approval Workflow Automation", body: "Automated procurement approvals based on department structure, budget thresholds, operational hierarchy, and compliance policies.", image: u2.url },
      { title: "Executive Power BI Reporting Layer", body: "Centralized operational and financial dashboards providing leadership teams with real-time visibility into KPIs, operational performance, and enterprise metrics.", image: u3.url },
      { title: "Cross-System ERP Integration", body: "Integration between Microsoft Dynamics and external operational systems including banking platforms, logistics providers, healthcare systems, and enterprise applications.", image: u4.url },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Built on the Full Microsoft Stack",
    body: "Dynamics 365 works best when it's part of a governed Microsoft ecosystem — connected to the Power Platform, Azure, Microsoft 365, and the external operational systems your enterprise depends on.",
    groups: [
      {
        title: "Microsoft Ecosystem",
        tags: [
          "Dynamics 365 Finance",
          "Dynamics 365 SCM",
          "Business Central",
          "Power Platform",
          "Power BI",
          "Power Automate",
          "Azure",
          "Microsoft 365",
          "Azure AD / Entra ID",
        ],
      },
      {
        title: "External Systems & Standards",
        tags: [
          "Banking Connectors",
          "Logistics Platforms",
          "Legacy ERP Migration",
          "REST / OData APIs",
          "EDI",
          "SharePoint",
          "Azure Data Lake",
          "SQL / Synapse",
        ],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Do you implement D365 Finance & SCM, or Business Central?", answer: "Both. We scope the right Dynamics 365 SKU against operational complexity, entity structure, and reporting requirements — and implement the tier that fits, not the tier that sells." },
      { question: "Can you integrate D365 with our legacy ERP or banking systems?", answer: "Yes. Every engagement includes an integration topology — Microsoft ecosystem plus external banking, logistics, and enterprise applications — designed for operational continuity, not point-to-point patches." },
      { question: "Do you build custom entities and extensions?", answer: "Yes. Custom entities, role-specific interfaces, and operational logic are built with long-term maintainability and upgrade compatibility in mind — never as fragile bolt-ons." },
      { question: "How long does a typical implementation take?", answer: "Business Central deployments typically span 3 to 5 months. Full D365 Finance & SCM programs for multi-entity groups typically span 6 to 12 months with governed phases." },
      { question: "What happens after go-live?", answer: "Go-live is the beginning of stabilization — not the end. Every program includes a defined hypercare period, training, documentation, and post-launch support." },
      { question: "Do you migrate data from our legacy ERP?", answer: "Yes. Structured migration from legacy ERPs into Dynamics 365 — prioritizing data integrity, operational continuity, and validated transition over speed of cutover." },
    ],
  },
  "Final CTA": {
    headline: "Standard D365 covers the operational baseline.",
    headlineAccent: "Strategic implementation aligns it with how you actually work.",
    body: "A structured discovery session — covering your workflows, operational dependencies, reporting requirements, and implementation priorities — produces a documented assessment and D365 architecture recommendation before any commitment is made.",
    ctaLabel: "Schedule a discovery session",
    ctaHref: "#contact",
    ctaLabel2: "Request project scoping",
    ctaHref2: "#contact",
    footnote: "Operational workflow review · Integration dependency mapping · Reporting requirements audit · Architecture recommendation · Implementation roadmap.",
    mediaUrl: pattern.url,
    mediaKind: "image",
  },
} as const;

export type DynamicsContent = {
  [K in DynamicsSectionKey]: typeof DYNAMICS_DEFAULTS[K];
} & { _visible: Record<DynamicsSectionKey, boolean> };

const DYNAMICS_PAGE_SLUG = "erp-dynamics-365";

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

export function useDynamicsContent(): DynamicsContent {
  const { data } = useQuery({
    queryKey: ["page-sections", DYNAMICS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", DYNAMICS_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<DynamicsSectionKey, boolean> };
  for (const key of Object.keys(DYNAMICS_DEFAULTS) as DynamicsSectionKey[]) {
    merged[key] = merge(DYNAMICS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as DynamicsContent;
}
