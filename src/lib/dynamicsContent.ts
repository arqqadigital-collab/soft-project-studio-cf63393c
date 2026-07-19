import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/dynamics/dynamics-hero-bg.mp4.asset.json";
import pattern from "@/assets/dynamics/dynamics-pattern.jpg.asset.json";
import u1 from "@/assets/dynamics/use-case-1.jpg.asset.json";
import u2 from "@/assets/dynamics/use-case-2.jpg.asset.json";
import u3 from "@/assets/dynamics/use-case-3.jpg.asset.json";
import u4 from "@/assets/dynamics/use-case-4.jpg.asset.json";

export type DynamicsSectionKey =
  | "Hero"
  | "Introduction"
  | "What We Deliver"
  | "Process"
  | "Use Cases"
  | "Who We Serve"
  | "Standard vs Strategic"
  | "Discovery Session";

export const DYNAMICS_DEFAULTS = {
  Hero: {
    headline: "Standardized where beneficial.",
    headlineAccent: "Engineered where it matters.",
    ctaLabel: "Request project scoping",
    ctaHref: "#contact",
    ctaLabel2: "View capabilities",
    ctaHref2: "#services",
    mediaUrl: heroVideo.url,
    posterUrl: pattern.url,
  },
  Introduction: {
    headline: "Microsoft Dynamics 365",
    headlineAccent: "Implementation, Integration & Customization",
    body:
      "SBS implements, customizes, and integrates Microsoft Dynamics 365 environments structured around how you operate — delivering end-to-end value across finance, operations, and analytics.",
    bullets: [
      "End-to-end D365 Finance, SCM & Business Central",
      "Power Platform, Azure & Microsoft 365 integration",
      "Custom workflows, approvals & process automation",
      "Power BI reporting architecture & executive dashboards",
    ],
    footnote:
      "Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.",
  },
  "What We Deliver": {
    eyebrow: "What We Deliver",
    heading: "Enterprise Microsoft Dynamics services across",
    headingAccent: "implementation, integration, and operational transformation.",
    body:
      "Every engagement is scoped to operational requirements, governance structures, and long-term maintainability — not software deployment timelines.",
    items: [
      {
        icon: "Layers",
        title: "Microsoft Dynamics Implementation",
        body:
          "End-to-end implementation of Dynamics 365 environments structured around operational requirements, data integrity, and long-term scalability — not default configurations.",
        chips: ["D365 Finance", "SCM", "Business Central", "Multi-company"],
      },
      {
        icon: "Workflow",
        title: "Workflow & Process Automation",
        body:
          "Custom approval structures, procurement workflows, and operational automation aligned to your governance model — eliminating manual coordination without creating process gaps.",
        chips: ["Approval matrices", "Power Automate", "Escalation logic", "HR workflows"],
      },
      {
        icon: "Network",
        title: "Microsoft Ecosystem Integration",
        body:
          "Integration between Dynamics 365 and the full Microsoft stack — plus external banking systems, logistics platforms, and enterprise applications — designed for operational continuity, not point-to-point patches.",
        chips: ["Power Platform", "Azure", "M365", "External ERP"],
      },
      {
        icon: "BarChart3",
        title: "Reporting & Power BI Architecture",
        body:
          "Operational and financial reporting environments that transform D365 data into executive dashboards and decision-ready intelligence — not just static exports.",
        chips: ["Power BI", "KPI dashboards", "Financial reporting", "Automated distribution"],
      },
      {
        icon: "Wrench",
        title: "Customization & Extensions",
        body:
          "Custom entities, role-specific interfaces, and operational logic that standard D365 configurations cannot address — built with long-term maintainability and upgrade compatibility in mind.",
        chips: ["Custom entities", "Role interfaces", "Industry logic", "Automation layers"],
      },
      {
        icon: "DatabaseZap",
        title: "Data Migration & Modernization",
        body:
          "Structured migration from legacy ERP systems into Dynamics 365 — prioritizing data integrity, operational continuity, and validated transition over speed of cutover.",
        chips: ["Legacy ERP migration", "Data cleansing", "Staged execution", "Validation"],
      },
    ],
  },
  Process: {
    eyebrow: "Implementation Governance Process",
    heading: "How we scope, architect, and deliver",
    headingAccent: "Microsoft Dynamics environments.",
    body:
      "ERP failures are rarely software failures. They result from unclear scope, weak governance, and implementations that treat go-live as the finish line. Our five-phase framework is designed against those outcomes.",
    items: [
      {
        icon: "ScanSearch",
        n: "01",
        title: "Operational Discovery & Requirements Mapping",
        body:
          "We evaluate business processes, reporting dependencies, and organizational structure to define how D365 should support the enterprise — before any configuration begins.",
        meta: "Output: Requirements assessment · Process map · Architecture recommendation · Implementation roadmap",
      },
      {
        icon: "ShieldCheck",
        n: "02",
        title: "Solution Architecture & Governance Design",
        body:
          "System structure, role-based access, approval workflows, integration topology, and reporting architecture are designed and documented before development begins.",
        meta: "Output: Architecture blueprint · Access model · Workflow design · Integration plan",
      },
      {
        icon: "Code2",
        n: "03",
        title: "Configuration, Development & Integration",
        body:
          "D365 is configured and extended against approved requirements. Integrations, automation layers, and custom logic are built within a structured delivery framework — version-controlled, not ad hoc.",
        meta: "Stack: D365 · Power Platform · Azure · Power BI · Microsoft 365",
      },
      {
        icon: "CheckCircle2",
        n: "04",
        title: "Testing, Validation & User Acceptance",
        body:
          "All workflows, integrations, and reporting structures are validated in a controlled test environment. UAT covers operational scenarios — not just technical function. Nothing reaches production without sign-off.",
        meta: "Coverage: Workflow · Financial · Integration · Regression · Reporting",
      },
      {
        icon: "Rocket",
        n: "05",
        title: "Deployment, Training & Operational Transition",
        body:
          "Production rollout via controlled deployment procedures, supported by user training, operational documentation, and a defined hypercare period. Go-live is the beginning of stabilization — not the end of the program.",
        meta: "Deliverables: Production deployment · Training · Documentation · Post-launch support",
      },
    ],
  },
  "Use Cases": {
    eyebrow: "Enterprise Use Cases",
    heading: "What enterprises actually build",
    headingAccent: "with Dynamics 365.",
    body: "Representative operational transformation initiatives — not generic ERP demos.",
    items: [
      {
        n: "01",
        title: "Multi-Entity Financial Management",
        body:
          "Centralized financial operations across multiple companies, branches, or operational entities with standardized reporting, approval governance, and consolidated visibility.",
        image: u1.url,
        alt: "Multi-entity financial consolidation",
      },
      {
        n: "02",
        title: "Procurement & Approval Workflow Automation",
        body:
          "Automated procurement approvals based on department structure, budget thresholds, operational hierarchy, and compliance policies.",
        image: u2.url,
        alt: "Procurement and approval workflow automation",
      },
      {
        n: "03",
        title: "Executive Power BI Reporting Layer",
        body:
          "Centralized operational and financial dashboards providing leadership teams with real-time visibility into KPIs, operational performance, and enterprise metrics.",
        image: u3.url,
        alt: "Executive Power BI reporting dashboard",
      },
      {
        n: "04",
        title: "Cross-System ERP Integration",
        body:
          "Integration between Microsoft Dynamics and external operational systems including banking platforms, logistics providers, healthcare systems, and enterprise applications.",
        image: u4.url,
        alt: "Cross-system ERP integration",
      },
    ],
  },
  "Who We Serve": {
    eyebrow: "Who We Serve",
    heading: "Built for the leaders who",
    headingAccent: "own enterprise operations.",
    body:
      "Different roles carry different operational stakes in a D365 program. We structure our delivery around all of them.",
    items: [
      {
        icon: "Users",
        role: "Operations Directors",
        headline: "Execution consistency across departments",
        body:
          "Standardized workflows and centralized operational visibility reduce dependency on manual coordination and improve execution consistency across locations and business units.",
        outcomes: [
          "Reduced bottlenecks",
          "Faster workflow execution",
          "Cross-functional visibility",
          "Lower manual process dependency",
        ],
      },
      {
        icon: "Wallet",
        role: "CFOs & Finance Leaders",
        headline: "Financial control and audit readiness",
        body:
          "Integrated financial operations improve reporting accuracy, consolidation speed, compliance readiness, and cost visibility — replacing fragmented finance tooling with a governed D365 environment.",
        outcomes: [
          "Faster consolidation",
          "Improved audit readiness",
          "Reduced reconciliation effort",
          "Better cost visibility",
        ],
      },
      {
        icon: "Cpu",
        role: "CIOs & Transformation Leaders",
        headline: "A scalable enterprise technology foundation",
        body:
          "Dynamics 365 creates a unified operational platform capable of supporting automation, integration, and long-term digital transformation — without rebuilding from scratch at each growth stage.",
        outcomes: [
          "Unified systems",
          "Reduced legacy dependency",
          "Improved data governance",
          "Scalable architecture",
        ],
      },
      {
        icon: "Crown",
        role: "Enterprise Leadership",
        headline: "Operational agility and investment protection",
        body:
          "Well-structured D365 environments improve organizational agility and long-term scalability while protecting enterprise technology investments from the cost of repeated ERP transitions.",
        outcomes: [
          "Operational alignment",
          "Increased scalability",
          "Better decision infrastructure",
          "Reduced fragmentation",
        ],
      },
    ],
  },
  "Standard vs Strategic": {
    headline: "Standard D365 covers the operational baseline.",
    headlineAccent: "Strategic implementation aligns it with how you actually work.",
    body1:
      "Out-of-the-box Dynamics 365 handles the standard. It does not handle your approval governance, your multi-entity reporting structure, your integration contracts with legacy systems, or the operational logic that defines how your enterprise runs.",
    body2:
      "SBS builds that layer — structured around your operational requirements, governed through a defined implementation process, and maintained for long-term scalability.",
    backgroundUrl: pattern.url,
  },
  "Discovery Session": {
    eyebrow: "Discovery Session",
    heading: "What does your D365 program",
    headingAccent: "actually require?",
    body:
      "A structured discovery session — covering your workflows, operational dependencies, reporting requirements, and implementation priorities — produces a documented assessment and D365 architecture recommendation before any commitment is made.",
    ctaLabel: "Schedule a discovery session",
    ctaHref: "#cta",
    items: [
      "Operational workflow review",
      "Integration dependency mapping",
      "Reporting requirements audit",
      "Architecture recommendation",
      "Implementation roadmap",
    ],
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
  return useSectionsContent(DYNAMICS_PAGE_SLUG, DYNAMICS_DEFAULTS) as DynamicsContent;
}

export function useDynamicsContentLegacy(): DynamicsContent {
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
