import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/manufacturing/hero.jpg.asset.json";
import tradFail from "@/assets/manufacturing/traditional-fail.jpg.asset.json";
import p1 from "@/assets/manufacturing/problem-p1.jpg.asset.json";
import p2 from "@/assets/manufacturing/problem-p2.jpg.asset.json";
import p3 from "@/assets/manufacturing/problem-p3.jpg.asset.json";
import u1 from "@/assets/manufacturing/uc-1.jpg.asset.json";
import u2 from "@/assets/manufacturing/uc-2.jpg.asset.json";
import u3 from "@/assets/manufacturing/uc-3.jpg.asset.json";
import u4 from "@/assets/manufacturing/uc-4.jpg.asset.json";

export type ManufacturingSectionKey =
  | "Hero"
  | "The Problem"
  | "Traditional Fail"
  | "Approach"
  | "Capabilities"
  | "Use Cases"
  | "Business Impact"
  | "Implementation"
  | "Why SBS"
  | "Final CTA";

export const MANUFACTURING_DEFAULTS = {
  Hero: {
    headline: "Manufacturing ERP that runs on",
    headlineAccent: "real production reality.",
    body:
      "SBS delivers a manufacturing ERP that aligns your entire production lifecycle into a single operational model — so decisions are based on real-time production reality, not delayed reports.",
    ctaLabel: "Talk to an ERP consultant",
    ctaHref: "#contact",
    ctaLabel2: "Explore capabilities",
    ctaHref2: "#capabilities",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Disconnected Factory Is a",
    headingAccent: "Dangerous Factory.",
    body:
      "Most manufacturers don't struggle with production itself — they struggle with coordination. The result is not inefficiency; it is loss of production control.",
    items: [
      { n: "01", label: "RISK", title: "Disconnected Planning", body: "Production plans change without inventory visibility. Raw materials arrive too late or overstocked, and procurement never sees what production actually needs.", image: p1.url },
      { n: "02", label: "RISK", title: "Manual Work Orders", body: "Work orders are managed manually across departments. BOM changes are not reflected in real time, so engineering updates never reach the shop floor.", image: p2.url },
      { n: "03", label: "RISK", title: "Invisible Costing", body: "Costing is calculated after production, not during it. No live view of shop floor performance means decisions are made on delayed, incomplete reports.", image: p3.url },
    ],
  },
  "Traditional Fail": {
    heading: "Where Traditional Systems Fail Manufacturing Companies",
    body: "Generic ERP systems typically fail because they do not reflect how manufacturing actually works:",
    footnote: "Manufacturing requires continuous synchronization between planning and execution—not periodic reporting.",
    image: tradFail.url,
    bullets: [
      "Production, procurement, and warehouse operate in silos",
      "No live connection between demand and material planning",
      "Shop floor data is not captured in real time",
      "Costing is static instead of dynamic",
      "Planning is disconnected from execution",
    ],
  },
  Approach: {
    eyebrow: "SBS Manufacturing ERP Approach",
    heading: "Designed around your production reality —",
    headingAccent: "not generic templates.",
    body: "This is not ERP implementation. It is manufacturing process reconstruction inside ERP.",
    items: [
      { icon: "Cpu", text: "Production-first system architecture" },
      { icon: "RefreshCw", text: "Real-time material and inventory synchronization" },
      { icon: "DollarSign", text: "Cost-aware manufacturing workflows" },
      { icon: "Network", text: "End-to-end traceability across production cycles" },
      { icon: "ShieldCheck", text: "Integration between planning, execution, and finance" },
    ],
  },
  Capabilities: {
    eyebrow: "Core Capabilities",
    heading: "Everything a modern factory",
    headingAccent: "needs to operate in sync.",
    items: [
      { icon: "Factory", title: "Production Management", items: ["Work order lifecycle management", "Multi-stage production tracking", "Capacity-aware scheduling"] },
      { icon: "Layers", title: "Bill of Materials (BOM)", items: ["Multi-level BOM structures", "Version control for engineering changes", "Costed BOM visibility"] },
      { icon: "Boxes", title: "Inventory & Material Planning", items: ["Raw material forecasting", "Automated replenishment triggers", "Multi-warehouse synchronization"] },
      { icon: "Activity", title: "Shop Floor Control", items: ["Production progress tracking", "Workstation performance visibility", "Delay and bottleneck identification"] },
      { icon: "Calculator", title: "Costing & Finance Integration", items: ["Real-time production cost calculation", "Labor and material cost tracking", "Profitability per batch or order"] },
    ],
  },
  "Use Cases": {
    eyebrow: "Manufacturing Use Cases",
    heading: "Real production environments",
    headingAccent: "we solve for.",
    footnote: "Also serving cost-sensitive production environments where margin discipline depends on accurate, real-time costing.",
    items: [
      { n: "01", title: "High-volume production with fluctuating demand", body: "Synchronized demand planning, material readiness, and capacity scheduling to absorb volume variability without overstock or delays.", image: u1.url },
      { n: "02", title: "Multi-warehouse manufacturing operations", body: "Unified material visibility, inter-warehouse transfers, and live inventory positioning across multiple production and storage sites.", image: u2.url },
      { n: "03", title: "Batch production with strict traceability", body: "Lot-controlled production with end-to-end traceability across raw materials, in-process operations, and finished goods.", image: u3.url },
      { n: "04", title: "Custom manufacturing with frequent BOM changes", body: "Version-controlled BOMs with engineering change management built into the production and costing workflow.", image: u4.url },
    ],
  },
  "Business Impact": {
    eyebrow: "Business Impact",
    heading: "Measurable outcomes,",
    headingAccent: "cycle after cycle.",
    items: [
      { icon: "Zap", text: "Reduced production delays through real-time planning" },
      { icon: "Recycle", text: "Improved material utilization and reduced waste" },
      { icon: "LineChart", text: "Accurate cost tracking per production cycle" },
      { icon: "Eye", text: "Increased shop floor visibility and accountability" },
      { icon: "Target", text: "Better demand-to-production alignment" },
    ],
  },
  Implementation: {
    eyebrow: "Implementation Approach",
    heading: "A structured manufacturing",
    headingAccent: "ERP rollout.",
    items: [
      { icon: "ScanSearch", n: "01", title: "Production process mapping", body: "Document existing production flows, dependencies, and operational gaps before configuring anything." },
      { icon: "Settings2", n: "02", title: "BOM and workflow structuring", body: "Design multi-level BOMs, work order routes, and approval flows aligned with how production actually runs." },
      { icon: "Workflow", n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with finance, procurement, and shop floor data sources." },
      { icon: "Rocket", n: "04", title: "Shop floor enablement", body: "Train operators, supervisors, and planners on the new workflows with hands-on operational readiness checks." },
      { icon: "TrendingUp", n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new production cells and product lines." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Operational design first,",
    headingAccent: "software setup second.",
    bullets: [
      "Deep focus on operational design, not just software setup",
      "Industry-aligned ERP architecture approach",
      "Strong integration across production and finance layers",
      "Custom workflow capability for complex manufacturing environments",
    ],
  },
  "Final CTA": {
    headline: "Build a manufacturing system that",
    headlineAccent: "matches your production reality.",
    body:
      "If your production system depends on spreadsheets, delayed updates, or disconnected planning tools — it is not a system. It is fragmentation. SBS helps you rebuild manufacturing control inside a unified ERP environment.",
    ctaLabel: "Request a manufacturing ERP assessment",
    ctaHref: "#contact",
    image: hero.url,
  },
} as const;

export type ManufacturingContent = {
  [K in ManufacturingSectionKey]: typeof MANUFACTURING_DEFAULTS[K];
} & { _visible: Record<ManufacturingSectionKey, boolean> };

const SLUG = "erp-manufacturing";

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

export function useManufacturingContent(): ManufacturingContent {
  return useSectionsContent(SLUG, MANUFACTURING_DEFAULTS) as ManufacturingContent;
}

export function useManufacturingContentLegacy(): ManufacturingContent {
  const { data } = useQuery({
    queryKey: ["page-sections", SLUG],
    queryFn: async () => {
      const { data: page } = await supabase.from("pages").select("id").eq("slug", SLUG).maybeSingle();
      if (!page?.id) return { byName: {}, visibleByName: {} } as { byName: Record<string, any>; visibleByName: Record<string, boolean> };
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
  const merged: any = { _visible: {} as Record<ManufacturingSectionKey, boolean> };
  for (const key of Object.keys(MANUFACTURING_DEFAULTS) as ManufacturingSectionKey[]) {
    merged[key] = merge(MANUFACTURING_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ManufacturingContent;
}
