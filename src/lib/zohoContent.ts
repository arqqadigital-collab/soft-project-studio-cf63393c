import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/zoho/zoho-hero.mp4.asset.json";
import u1 from "@/assets/zoho/use-case-1.jpg.asset.json";
import u2 from "@/assets/zoho/use-case-2.jpg.asset.json";
import u3 from "@/assets/zoho/use-case-3.jpg.asset.json";
import u4 from "@/assets/zoho/use-case-4.jpg.asset.json";

export type ZohoSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "How We Work"
  | "Use Cases"
  | "Business Impact"
  | "Objective"
  | "FAQ";

export const ZOHO_DEFAULTS = {
  Hero: {
    headline: "Zoho implementation built around your operations —",
    headlineAccent: "not generic templates.",
    ctaLabel: "Talk to our team",
    ctaHref: "#contact",
    ctaLabel2: "See how we work",
    ctaHref2: "#process",
    mediaUrl: heroVideo.url,
  },
  Introduction: {
    headline: "Zoho rebuilt around",
    headlineAccent: "how your business actually operates.",
    body:
      "When your CRM, finance, and ops tools don't talk to each other, your team fills the gaps manually. SBS rebuilds those workflows inside Zoho — designed around how your business actually operates, not how the platform defaults.",
    bullets: [
      "Redesign workflows before configuring software.",
      "Align sales, finance, operations, and reporting environments into one operational structure.",
      "Focus on user adoption, not technical completion.",
      "Design system for organizational growth, reporting maturity, and operational governance.",
    ],
    footnote:
      "Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.",
    chips: ["Zoho Partner status", "Years of implementation experience"],
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "What breaks when systems",
    headingAccent: "don't talk to each other.",
    items: [
      { icon: "Database", title: "Data lives in three places at once", body: "Sales updates the CRM. Finance updates the spreadsheet. Ops works from email threads. Nobody has the full picture — and every decision is made on stale data." },
      { icon: "Mail", title: "Approvals stall in inboxes", body: "Invoice approvals, contract sign-offs, and onboarding tasks route through email chains. Things slip. Delays compound. No one knows where anything is stuck." },
      { icon: "BarChart3", title: "Reporting is a manual assembly job", body: "Leadership needs pipeline visibility. Finance needs expense tracking. Getting those numbers means someone spending Friday afternoon pulling data from disconnected tools." },
      { icon: "TrendingUp", title: "You've outgrown your current setup", body: "What worked at 20 people breaks at 60. The processes that got you here — ad-hoc, flexible, people-dependent — are now the bottleneck holding you back." },
    ],
  },
  "How We Work": {
    eyebrow: "How We Work",
    heading: "Connected Zoho environments,",
    headingAccent: "designed for operational scale.",
    body:
      "Our implementation capabilities extend beyond CRM configuration into operational architecture, automation, integrations, and business process enablement.",
    items: [
      { n: "01", icon: "ScanSearch", title: "Operational Discovery & Workflow Assessment", body: "Before any configuration begins, we map your current workflows — where they work, where they break, and where automation can eliminate manual effort. We're looking for process dependencies, reporting gaps, and approval bottlenecks that a standard implementation would miss.", meta: "Deliverable: Workflow map + implementation roadmap" },
      { n: "02", icon: "Layers", title: "Solution Design & Process Structuring", body: "We design how data, users, and workflows interact across your Zoho environment. This includes approval structures, role-based access, reporting requirements, and cross-department coordination — before a single field is configured.", meta: "Deliverable: Approved architecture design" },
      { n: "03", icon: "Workflow", title: "Configuration, Automation & Integration", body: "Your Zoho environment is built to spec — CRM, Books, Creator, Analytics, and Flow configured together, not in isolation. Automation logic is built to reduce execution overhead, not just trigger notifications.", meta: "Deliverable: Configured, integrated Zoho environment" },
      { n: "04", icon: "ShieldCheck", title: "Testing, Validation & User Readiness", body: "Every workflow, integration, and automation is tested against real operational scenarios — not just technical checklists. User acceptance testing is part of the process, not an afterthought.", meta: "Deliverable: UAT sign-off + validated workflows" },
      { n: "05", icon: "Rocket", title: "Deployment & Operational Transition", body: "Go-live is supported by onboarding, documentation, and post-launch stabilization. The objective is adoption — teams that understand the system and can operate it independently, not a dependency on external support.", meta: "Deliverable: Production deployment + knowledge transfer" },
    ],
  },
  "Use Cases": {
    eyebrow: "Enterprise Use Cases",
    heading: "How organizations use Zoho to centralize operations,",
    headingAccent: "automate workflows, and improve visibility.",
    body:
      "Representative examples of operational improvements enabled through Zoho implementation and customization.",
    items: [
      { n: "01", title: "Multi-Stage Sales Process Automation", body: "Automated lead qualification, opportunity management, approval workflows, and sales pipeline tracking across multiple sales teams and operational stages.", image: u1.url, impacts: ["Improved sales visibility", "Faster lead progression", "Reduced manual coordination", "Standardized sales execution"] },
      { n: "02", title: "Customer Onboarding Workflow Management", body: "Centralized onboarding workflows connecting sales, finance, operations, and customer support teams through automated task routing and process visibility.", image: u2.url, impacts: ["Faster onboarding cycles", "Improved customer experience", "Better internal coordination", "Reduced operational delays"] },
      { n: "03", title: "Finance & Invoice Approval Automation", body: "Automated invoice routing, expense approvals, payment tracking, and finance notifications aligned to organizational approval structures and operational controls.", image: u3.url, impacts: ["Faster financial approvals", "Reduced processing delays", "Improved financial visibility", "Better operational accountability"] },
      { n: "04", title: "Executive Reporting & Operational Dashboards", body: "Centralized reporting environments providing leadership teams with visibility into sales performance, workflow execution, finance operations, and organizational KPIs.", image: u4.url, impacts: ["Improved decision-making", "Real-time operational visibility", "Reduced manual reporting effort", "Better performance monitoring"] },
    ],
  },
  "Business Impact": {
    eyebrow: "Business Impact",
    heading: "Zoho implementation is not just a software initiative.",
    headingAccent: "It's a business operations optimization framework.",
    body:
      "Organizations rarely struggle because they lack applications. Zoho helps centralize operations within a connected, automated, and scalable business environment.",
    items: [
      { icon: "Users", role: "For Operations Teams", body: "Centralized workflows and process automation improve execution consistency and reduce operational bottlenecks across departments." },
      { icon: "TrendingUp", role: "For Sales Leadership", body: "CRM visibility and workflow automation improve pipeline management, customer follow-up consistency, and sales process governance." },
      { icon: "Wallet", role: "For Finance Teams", body: "Integrated financial workflows improve approval visibility, reporting accuracy, and operational accountability across finance operations." },
      { icon: "Crown", role: "For Business Leadership", body: "Connected operational systems improve scalability, visibility, decision-making, and organizational alignment across the business." },
    ],
  },
  Objective: {
    headline: "The objective is not to implement software for its own sake.",
    headlineAccent:
      "The objective is to create a connected operational environment where workflows, approvals, reporting, customer management, and internal processes operate together with greater visibility, efficiency, and scalability.",
    body:
      "A 60-minute discovery session maps your current workflows, surfaces automation opportunities, and defines the right implementation approach — before any commitment is made.",
    ctaLabel: "Schedule a discovery session",
    ctaHref: "#contact",
    footnote: "Typically scheduled within 3 business days · No sales pitch, no lock-in",
  },
  FAQ: {
    heading: "Common Questions",
    items: [
      { q: "Can Zoho support our operational complexity?", a: "Yes — when the implementation is structured correctly. The limitation is rarely the platform itself. Most operational failures come from poor workflow architecture, disconnected process design, and weak adoption planning." },
      { q: "Will this disrupt current operations?", a: "Not if deployment is phased correctly. SBS structures implementation priorities around operational continuity, validation checkpoints, and controlled rollout planning to reduce disruption during transition." },
      { q: "Can you integrate Zoho with our existing systems?", a: "Yes. We regularly integrate Zoho environments with finance platforms, operational systems, communication tools, and external business applications to improve data continuity and process visibility." },
      { q: "What happens after deployment?", a: "Post-launch support focuses on stabilization, optimization, adoption monitoring, and workflow refinement. Operational environments evolve, and your Zoho structure should evolve with them." },
    ],
  },
} as const;

export type ZohoContent = {
  [K in ZohoSectionKey]: typeof ZOHO_DEFAULTS[K];
} & { _visible: Record<ZohoSectionKey, boolean> };

const ZOHO_PAGE_SLUG = "erp-zoho";

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

export function useZohoContent(): ZohoContent {
  return useSectionsContent(ZOHO_PAGE_SLUG, ZOHO_DEFAULTS) as ZohoContent;
}

export function useZohoContentLegacy(): ZohoContent {
  const { data } = useQuery({
    queryKey: ["page-sections", ZOHO_PAGE_SLUG],
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", ZOHO_PAGE_SLUG)
        .maybeSingle();
      if (!page?.id) return { byName: {}, visibleByName: {} } as {
        byName: Record<string, any>;
        visibleByName: Record<string, boolean>;
      };
      const { data: sections } = await supabase
        .from("page_sections")
        .select("data, position, is_visible")
        .eq("page_id", page.id)
        .order("position");
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
  const merged: any = { _visible: {} as Record<ZohoSectionKey, boolean> };
  for (const key of Object.keys(ZOHO_DEFAULTS) as ZohoSectionKey[]) {
    merged[key] = merge(ZOHO_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ZohoContent;
}
