import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/odoo/odoo-hero.mp4.asset.json";
import pattern from "@/assets/odoo/pattern.jpg.asset.json";
import u1 from "@/assets/odoo/use-case-1.jpg.asset.json";
import u2 from "@/assets/odoo/use-case-2.jpg.asset.json";
import u3 from "@/assets/odoo/use-case-3.jpg.asset.json";
import u4 from "@/assets/odoo/use-case-4.jpg.asset.json";

export type OdooSectionKey =
  | "Hero"
  | "Introduction"
  | "What We Build"
  | "Development Process"
  | "Use Cases"
  | "80/20 Statement"
  | "Who We Serve"
  | "ERP Objective"
  | "Discovery Session";

export const ODOO_DEFAULTS = {
  Hero: {
    headline: "Odoo engineered for your enterprise.",
    headlineAccent: "Configured where possible. Customized where it matters.",
    ctaLabel: "Request project scoping",
    ctaHref: "#contact",
    ctaLabel2: "View capabilities",
    ctaHref2: "#services",
    mediaUrl: heroVideo.url,
  },
  Introduction: {
    headline: "Custom Odoo, built around",
    headlineAccent: "how your business actually operates.",
    body:
      "SBS designs and delivers custom Odoo modules, extends standard functionality, and builds integrations so Odoo supports your operating model—not the other way around.",
    bullets: [
      "Custom module development from ground up",
      "Core Odoo extension without breaking upgradability",
      "Third-party API & system integration",
      "Performance optimization for high-volume operations",
    ],
    footnote:
      "Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.",
    chips: ["Odoo Partner status", "Years of implementation experience"],
  },
  "What We Build": {
    eyebrow: "What We Build",
    heading: "Six development disciplines.",
    headingAccent: "One coherent technical team.",
    body:
      "Every engagement is scoped, architected, and delivered by developers with deep Odoo framework knowledge — not generalist teams learning the platform on your project.",
    items: [
      { icon: "Layers", title: "Custom module development", body: "Purpose-built Odoo modules for business processes that standard modules do not cover. Developed to OCA standards so they survive version upgrades without rewriting.", chips: ["OCA standards", "Ground-up modules", "Upgrade-safe", "Python · XML"] },
      { icon: "Workflow", title: "Core module extension", body: "Extending Odoo's standard modules — accounting, inventory, HR, sales — without modifying core code. Inheritance-based customizations that stay upgradable and maintainable.", chips: ["Inheritance model", "No core edits", "Accounting · HR", "Inventory · Sales"] },
      { icon: "Network", title: "API & integration development", body: "Custom REST endpoints, webhook handlers, and integration middleware connecting Odoo to SAP, Oracle, payment gateways, logistics platforms, and proprietary internal systems.", chips: ["REST APIs", "Webhooks", "SAP · Oracle", "Middleware"] },
      { icon: "BarChart3", title: "Reporting & BI customization", body: "Custom Odoo reports, financial statement formats, and operational dashboards — built on QWeb and connected to external BI tools via structured data exports or API.", chips: ["QWeb reports", "Financial statements", "Dashboards", "BI exports"] },
      { icon: "Wrench", title: "UI/UX & portal customization", body: "Custom Odoo web portals, customer-facing views, and back-office interface modifications — using OWL components and Odoo's frontend framework to maintain upgrade compatibility.", chips: ["OWL components", "Custom portals", "Back-office UI", "Frontend framework"] },
      { icon: "DatabaseZap", title: "Performance & scalability engineering", body: "Query optimisation, caching strategies, background job architecture, and database indexing for Odoo deployments handling high transaction volumes or large data sets.", chips: ["Query optimization", "Caching", "Background jobs", "DB indexing"] },
    ],
  },
  "Development Process": {
    eyebrow: "Development Process",
    heading: "How we scope, build,",
    headingAccent: "and deliver custom Odoo.",
    body:
      "Enterprise customization requires governance, upgrade discipline, and controlled delivery — not ad hoc development. Our delivery process provides all three.",
    items: [
      { icon: "ScanSearch", n: "01", title: "Technical Discovery & Scoping", body: "We map the business requirement to Odoo's framework capabilities, identify what can be achieved via configuration versus what requires custom code, and define the technical specification before any development begins.", meta: "Output: Technical spec · Module dependency map · Effort estimate" },
      { icon: "ShieldCheck", n: "02", title: "Architecture & Upgrade-Safety Design", body: "Every custom module is architected using Odoo's inheritance model — not direct core modifications. We design for maintainability across version upgrades from day one, not as an afterthought.", meta: "Standards: OCA guidelines · Inheritance-first · No core file edits" },
      { icon: "Code2", n: "03", title: "Development & Code Review", body: "All code is version-controlled, peer-reviewed, and linted against Odoo's coding standards. No custom module reaches staging without a code review that checks ORM usage, security rules, and access control definitions.", meta: "Stack: Python · OWL · XML · PostgreSQL · Git" },
      { icon: "CheckCircle2", n: "04", title: "Testing in Staging Environment", body: "Unit tests, integration tests, and UAT conducted in a staging environment that mirrors production. Regression testing covers existing modules affected by the new development.", meta: "Coverage: Unit tests · Integration tests · UAT checklist · Regression" },
      { icon: "Rocket", n: "05", title: "Deployment & Documentation", body: "Production deployment via CI/CD pipeline with rollback capability. Every module ships with technical documentation covering the data model, business logic, configuration parameters, and known limitations.", meta: "Deliverables: Deployed module · Technical docs · Change log · Source repo" },
    ],
  },
  "Use Cases": {
    eyebrow: "Enterprise Use Cases",
    heading: "What enterprises actually",
    headingAccent: "build with custom Odoo.",
    body:
      "Representative examples of how custom Odoo development solves operational, integration, and scalability challenges across complex enterprise environments — beyond standard configurations.",
    items: [
      { n: "01", title: "Multi-Level Purchase Approval Workflow", body: "Configurable approval structures based on purchase value, departments, cost centers, and procurement categories — routing requests automatically across L1, L2, and executive approval chains. Includes delegation rules, escalation logic, and audit tracking.", image: u1.url, alt: "Multi-level purchase approval workflow", modules: "Purchase · Accounting · Approvals" },
      { n: "02", title: "SAP Financial Synchronization Connector", body: "Real-time synchronization between Odoo and SAP FI environments, aligning journal entries, chart of accounts, cost centers, and financial structures. Built with reconciliation controls, conflict detection, and scheduled delta synchronization.", image: u2.url, alt: "SAP financial synchronization connector", modules: "Accounting · Integration · API" },
      { n: "03", title: "Customer Self-Service Portal", body: "Custom Odoo portal allowing customers to manage operational interactions through a branded self-service experience. Includes order tracking, invoice access, document downloads, service requests, and dispute management via OWL-based interfaces.", image: u3.url, alt: "Customer self-service portal", modules: "Website · Portal · OWL" },
      { n: "04", title: "High-Volume Inventory API Infrastructure", body: "Custom API layer exposing real-time inventory availability, reservation status, and inbound supply data to external WMS, 3PL, retail, and eCommerce platforms — with queue-based processing, authentication, and response caching.", image: u4.url, alt: "High-volume inventory API infrastructure", modules: "Inventory · API · Queue" },
    ],
  },
  "80/20 Statement": {
    headline: "Standard Odoo covers ~80% of most operations.",
    headlineAccent: "We build the remaining ~20% — precisely.",
    body1:
      "That final 20% is where differentiation lives: your approvals, reporting formats, controls, and integration contracts.",
    body2:
      "We build that layer with the same engineering discipline as the rest of your stack — designed for maintainability, tested before deployment, and documented for the teams that support it long term.",
    backgroundUrl: pattern.url,
  },
  "Who We Serve": {
    eyebrow: "Business Impact",
    heading: "Not just a technical initiative.",
    headingAccent: "An operational transformation layer.",
    body:
      "Enterprise organizations rarely struggle because their ERP lacks features. They struggle when workflows fragment, approvals slow execution, reporting lacks visibility, and teams rely on disconnected tools outside the ERP.",
    items: [
      { icon: "Users", role: "Operations Directors", headline: "Execution consistency across departments", body: "Standardized workflows reduce operational bottlenecks, eliminate manual coordination, and improve execution consistency across departments, locations, and teams.", outcomes: ["Faster approval cycles", "Reduced process fragmentation", "Cross-department coordination", "Real-time operational visibility"] },
      { icon: "Wallet", role: "CFOs & Finance Leaders", headline: "Reporting accuracy and audit readiness", body: "Integrated financial workflows and centralized operational data improve reporting accuracy, compliance readiness, and cost control across the organization.", outcomes: ["Reduced reconciliation effort", "Accurate financial reporting", "Better audit traceability", "Improved cost allocation"] },
      { icon: "Cpu", role: "Digital Transformation Leaders", headline: "A scalable operational backbone", body: "Custom Odoo creates a scalable operational backbone capable of supporting growth, automation, integration, and future modernization initiatives.", outcomes: ["Unified workflows", "Cross-system integration", "Scalable automation", "Faster adoption of new models"] },
      { icon: "Crown", role: "Enterprise Decision Makers", headline: "Protect your ERP investment", body: "Well-architected customization protects ERP investments by allowing the platform to evolve with the organization instead of forcing operational compromise.", outcomes: ["Extended ERP lifespan", "Preserved upgrade flexibility", "Improved enterprise agility", "Strategic alignment"] },
    ],
  },
  "ERP Objective": {
    text1: "The objective is not customization for its own sake.",
    text2:
      "The objective is to create an ERP environment that supports how your organization operates today — while remaining scalable for how it will operate tomorrow.",
  },
  "Discovery Session": {
    eyebrow: "Technical Scoping Session",
    heading: "Let's evaluate what your operations",
    headingAccent: "actually require.",
    body:
      "Our team can help assess your workflows, integration requirements, and operational constraints to define the right Odoo customization approach before development begins.",
    ctaLabel: "Schedule a technical scoping session",
    ctaHref: "#cta",
    items: [
      "Operational workflow review",
      "Integration dependency mapping",
      "Custom module scoping",
      "Upgrade-safety assessment",
      "Effort estimate & roadmap",
    ],
  },
} as const;

export type OdooContent = {
  [K in OdooSectionKey]: typeof ODOO_DEFAULTS[K];
} & { _visible: Record<OdooSectionKey, boolean> };

const ODOO_PAGE_SLUG = "erp-odoo";

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

export function useOdooContent(): OdooContent {
  return useSectionsContent(ODOO_PAGE_SLUG, ODOO_DEFAULTS) as OdooContent;
}

export function useOdooContentLegacy(): OdooContent {
  const { data } = useQuery({
    queryKey: ["page-sections", ODOO_PAGE_SLUG],
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", ODOO_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<OdooSectionKey, boolean> };
  for (const key of Object.keys(ODOO_DEFAULTS) as OdooSectionKey[]) {
    merged[key] = merge(ODOO_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as OdooContent;
}
