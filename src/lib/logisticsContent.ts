import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/logistics/hero.jpg.asset.json";
import tradFail from "@/assets/logistics/traditional-fail.jpg.asset.json";
import p1 from "@/assets/logistics/p1.jpg.asset.json";
import p2 from "@/assets/logistics/p2.jpg.asset.json";
import p3 from "@/assets/logistics/p3.jpg.asset.json";
import u1 from "@/assets/logistics/uc1.jpg.asset.json";
import u2 from "@/assets/logistics/uc2.jpg.asset.json";
import u3 from "@/assets/logistics/uc3.jpg.asset.json";
import u4 from "@/assets/logistics/uc4.jpg.asset.json";
import u5 from "@/assets/logistics/uc5.jpg.asset.json";

export type LogisticsSectionKey =
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

export const LOGISTICS_DEFAULTS = {
  Hero: {
    headline: "In logistics, delays are not just operational issues —",
    headlineAccent: "they are cost leakage points.",
    body:
      "SBS builds ERP systems for logistics and distribution companies that need end-to-end visibility across warehouses, shipments, and inventory movement in real time.",
    ctaLabel: "Talk to a logistics ERP consultant",
    ctaHref: "#contact",
    ctaLabel2: "Explore capabilities",
    ctaHref2: "#capabilities",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Where Logistics Operations",
    headingAccent: "Lose Control.",
    body:
      "Logistics complexity is rarely about transportation — it is about synchronization. Small inefficiencies compound into systemic delivery failure.",
    items: [
      { n: "01", label: "RISK", title: "Inventory Inconsistencies", body: "Stock levels differ across warehouses. Reports say one thing, shelves show another — and every mismatch becomes a delayed order or a lost sale.", image: p1.url },
      { n: "02", label: "RISK", title: "Shipment Delays", body: "Dispatch, routing, and tracking live in separate tools. Poor coordination between teams turns predictable deliveries into daily firefighting.", image: p2.url },
      { n: "03", label: "RISK", title: "Manual Movement Tracking", body: "Goods movement is logged on paper and re-entered later. Real-time stock visibility is impossible when data is always hours behind reality.", image: p3.url },
    ],
  },
  "Traditional Fail": {
    heading: "Why Traditional ERP Systems Fail Logistics Companies",
    body: "Most ERP systems treat logistics as a reporting layer — not a real-time operational system:",
    footnote: "Logistics requires live operational orchestration, not record keeping.",
    image: tradFail.url,
    bullets: [
      "Warehouse data is updated after movement, not during it",
      "Shipment tracking is external and disconnected",
      "Inventory is not synchronized across nodes",
      "No unified view of supply chain flow",
      "Distribution planning is static instead of dynamic",
    ],
  },
  Approach: {
    eyebrow: "SBS Logistics ERP Approach",
    heading: "SBS Logistics",
    headingAccent: "ERP Approach.",
    body: "SBS builds logistics ERP systems that function as a live supply chain control tower.",
    items: [
      { icon: "RefreshCw", text: "Real-time warehouse synchronization" },
      { icon: "Eye", text: "Unified inventory visibility across locations" },
      { icon: "Radar", text: "Automated stock movement tracking" },
      { icon: "Network", text: "Demand-driven replenishment logic" },
      { icon: "ShieldCheck", text: "Integrated procurement, warehousing & distribution" },
    ],
  },
  Capabilities: {
    eyebrow: "Core Logistics ERP Capabilities",
    heading: "Everything a modern distribution network",
    headingAccent: "needs to operate in sync.",
    items: [
      { icon: "Warehouse", title: "Warehouse Management", items: ["Multi-warehouse coordination", "Real-time stock updates", "Location-based inventory tracking"] },
      { icon: "Boxes", title: "Inventory Control", items: ["Centralized inventory visibility", "Automated stock adjustments", "Cycle counting support"] },
      { icon: "PackageCheck", title: "Order Fulfillment", items: ["End-to-end order tracking", "Automated picking and packing workflows", "Delivery status synchronization"] },
      { icon: "ShoppingCart", title: "Procurement & Supply Planning", items: ["Demand-based purchasing", "Supplier coordination workflows", "Lead time optimization"] },
      { icon: "Truck", title: "Distribution Management", items: ["Dispatch scheduling", "Route coordination support", "Shipment tracking integration"] },
    ],
  },
  "Use Cases": {
    eyebrow: "Logistics Use Cases We Solve",
    heading: "Real distribution environments",
    headingAccent: "we solve for.",
    items: [
      { n: "01", title: "Multi-warehouse distribution networks", body: "Unified visibility and synchronized inventory across every warehouse, so stock decisions reflect the entire network — not one location.", image: u1.url },
      { n: "02", title: "High-volume order fulfillment operations", body: "Automated picking, packing, and dispatch workflows built to absorb spikes without breaking service levels.", image: u2.url },
      { n: "03", title: "Import/export supply chain coordination", body: "Coordinated procurement, customs, and inbound logistics so international movement is tracked as one continuous flow.", image: u3.url },
      { n: "04", title: "Retail distribution networks", body: "Store replenishment driven by real demand — connecting distribution centers, transport, and retail outlets in one system.", image: u4.url },
      { n: "05", title: "3PL logistics operations", body: "Client-segregated inventory, billing rules, and SLAs managed inside a single control tower purpose-built for third-party logistics.", image: u5.url },
    ],
  },
  "Business Impact": {
    eyebrow: "Business Impact",
    heading: "Measurable outcomes,",
    headingAccent: "shipment after shipment.",
    items: [
      { icon: "Eye", text: "Real-time visibility across all warehouses" },
      { icon: "ShieldCheck", text: "Reduced stock discrepancies and losses" },
      { icon: "Zap", text: "Faster order fulfillment cycles" },
      { icon: "LineChart", text: "Improved supply chain predictability" },
      { icon: "Gauge", text: "Lower operational overhead through automation" },
    ],
  },
  Implementation: {
    eyebrow: "Implementation Approach",
    heading: "A structured logistics",
    headingAccent: "ERP rollout.",
    items: [
      { icon: "Map", n: "01", title: "Supply chain mapping across nodes", body: "Document how goods, data, and decisions actually move across your warehouses, suppliers, and distribution points." },
      { icon: "Warehouse", n: "02", title: "Warehouse structure design", body: "Model zones, bins, and locations that reflect real operations — not generic templates." },
      { icon: "Settings2", n: "03", title: "Inventory system configuration", body: "Configure stock rules, replenishment triggers, and multi-location synchronization aligned to demand patterns." },
      { icon: "Workflow", n: "04", title: "Integration with logistics operations", body: "Connect procurement, fulfillment, dispatch, and tracking into one live operational fabric." },
      { icon: "TrendingUp", n: "05", title: "Optimization and scaling", body: "Refine workflows, expand automation, and scale the system as new locations, SKUs, and channels come online." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS for Logistics ERP",
    heading: "Built for movement,",
    headingAccent: "not static data.",
    bullets: [
      "Strong focus on real-time operational systems",
      "Ability to unify fragmented warehouse environments",
      "Deep experience in multi-location distribution logic",
      "ERP architecture designed for movement, not static data",
    ],
  },
  "Final CTA": {
    headline: "Build a logistics system that",
    headlineAccent: "moves as fast as your operations.",
    body:
      "If your logistics decisions rely on delayed reports or disconnected systems, your supply chain is operating blind. SBS builds ERP systems that bring real-time clarity to every movement in your network.",
    ctaLabel: "Request a logistics ERP consultation",
    ctaHref: "#contact",
    image: hero.url,
  },
} as const;

export type LogisticsContent = {
  [K in LogisticsSectionKey]: typeof LOGISTICS_DEFAULTS[K];
} & { _visible: Record<LogisticsSectionKey, boolean> };

const SLUG = "erp-logistics";

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

export function useLogisticsContent(): LogisticsContent {
  return useSectionsContent(SLUG, LOGISTICS_DEFAULTS) as LogisticsContent;
}

export function useLogisticsContentLegacy(): LogisticsContent {
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
  const merged: any = { _visible: {} as Record<LogisticsSectionKey, boolean> };
  for (const key of Object.keys(LOGISTICS_DEFAULTS) as LogisticsSectionKey[]) {
    merged[key] = merge(LOGISTICS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as LogisticsContent;
}
