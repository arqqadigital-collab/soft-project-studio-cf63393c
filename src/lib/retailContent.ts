import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/retail/hero.jpg.asset.json";
import tradFail from "@/assets/retail/traditional-fail.jpg.asset.json";
import p1 from "@/assets/retail/problem-p1.jpg.asset.json";
import p2 from "@/assets/retail/problem-p2.jpg.asset.json";
import p3 from "@/assets/retail/problem-p3.jpg.asset.json";
import u1 from "@/assets/retail/uc-1.jpg.asset.json";
import u2 from "@/assets/retail/uc-2.jpg.asset.json";
import u3 from "@/assets/retail/uc-3.jpg.asset.json";
import u4 from "@/assets/retail/uc-4.jpg.asset.json";

export type RetailSectionKey =
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

export const RETAIL_DEFAULTS = {
  Hero: {
    headline: "Retail & E-commerce ERP that runs on",
    headlineAccent: "real commerce reality.",
    body:
      "SBS delivers a retail and e-commerce ERP that unifies stores, online, and marketplaces into a single operational model — so decisions are based on live commerce data, not disconnected reports.",
    ctaLabel: "Talk to an ERP consultant",
    ctaHref: "#contact",
    ctaLabel2: "Explore capabilities",
    ctaHref2: "#capabilities",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Disconnected Storefront Is a",
    headingAccent: "Leaking Storefront.",
    body:
      "Most retailers don't struggle with selling — they struggle with coordination. The result is not inefficiency; it is lost customers, lost stock, and lost margin.",
    items: [
      { n: "01", label: "RISK", title: "Disconnected Channels", body: "Stores, online storefronts, and marketplaces run on separate stock and pricing rules. Customers see one price online, another in store, and out-of-stock messages that don't reflect reality.", image: p1.url },
      { n: "02", label: "RISK", title: "Manual Fulfilment", body: "Orders are re-keyed between webshop, POS, and warehouse. Missed SLAs, wrong picks, and refunds pile up because no single system owns the order lifecycle end to end.", image: p2.url },
      { n: "03", label: "RISK", title: "Invisible Margins", body: "Margin is calculated after the season, not per order. Promotions, returns, and marketplace fees eat into profit long before finance sees the number.", image: p3.url },
    ],
  },
  "Traditional Fail": {
    heading: "Where Traditional Systems Fail Retail and E-commerce Companies",
    body: "Generic ERP systems typically fail because they do not reflect how modern commerce actually works:",
    footnote: "Retail requires continuous synchronization between demand, stock, and fulfilment — not periodic reporting.",
    image: tradFail.url,
    bullets: [
      "POS, e-commerce, and warehouse operate in silos",
      "No live connection between demand and replenishment",
      "Marketplace and channel data is not captured in real time",
      "Pricing and promotions are static instead of dynamic",
      "Merchandising is disconnected from execution",
    ],
  },
  Approach: {
    eyebrow: "SBS Retail & E-commerce ERP Approach",
    heading: "Designed around your commerce reality —",
    headingAccent: "not generic templates.",
    body: "This is not ERP implementation. It is commerce process reconstruction inside ERP.",
    items: [
      { icon: "Cpu", text: "Commerce-first system architecture" },
      { icon: "RefreshCw", text: "Real-time stock and pricing synchronization" },
      { icon: "DollarSign", text: "Margin-aware promotion workflows" },
      { icon: "Network", text: "End-to-end traceability across every order" },
      { icon: "ShieldCheck", text: "Integration between commerce, warehouse, and finance" },
    ],
  },
  Capabilities: {
    eyebrow: "Core Capabilities",
    heading: "Everything a modern retailer",
    headingAccent: "needs to operate in sync.",
    items: [
      { icon: "ShoppingBag", title: "Omnichannel Order Management", items: ["Unified order lifecycle across web, POS, and marketplaces", "Buy online, pick up in store and ship-from-store", "Split shipments and partial fulfilment"] },
      { icon: "Layers", title: "Product & Catalog Management", items: ["Central product master with variants", "Channel-specific enrichment and pricing", "Bundles, kits, and configurable products"] },
      { icon: "Boxes", title: "Inventory & Replenishment", items: ["Live stock across stores and warehouses", "Automated reorder and transfer rules", "Safety stock aware of channel demand"] },
      { icon: "Activity", title: "POS & Store Operations", items: ["Fast, offline-tolerant point of sale", "Store-level performance visibility", "Cashier, shift, and cash reconciliation"] },
      { icon: "Calculator", title: "Pricing, Promotions & Finance", items: ["Real-time margin per order and channel", "Loyalty, coupons, and dynamic promotions", "Marketplace fee and payout reconciliation"] },
    ],
  },
  "Use Cases": {
    eyebrow: "Retail Use Cases",
    heading: "Real commerce environments",
    headingAccent: "we solve for.",
    footnote: "Also serving margin-sensitive commerce environments where profitability depends on accurate, real-time pricing and stock.",
    items: [
      { n: "01", title: "Omnichannel retailers with store and online demand", body: "Unified inventory, pricing, and order orchestration so store and online demand are served from one operational model — with no oversell and no stranded stock.", image: u1.url },
      { n: "02", title: "Multi-store chains across regions", body: "Central catalog and pricing, local store execution, and consolidated reporting across regions with role-based visibility for HQ, area, and store managers.", image: u2.url },
      { n: "03", title: "Pure-play e-commerce and marketplace sellers", body: "High-volume fulfilment with automated picking, packing, and courier assignment — plus marketplace listing, order, and payout reconciliation built in.", image: u3.url },
      { n: "04", title: "Loyalty-driven brands with personalized offers", body: "Unified customer profile across channels, segmentation, and personalized promotions tied directly to margin-aware pricing at the point of sale.", image: u4.url },
    ],
  },
  "Business Impact": {
    eyebrow: "Business Impact",
    heading: "Measurable outcomes,",
    headingAccent: "order after order.",
    items: [
      { icon: "Zap", text: "Fewer stockouts through real-time replenishment" },
      { icon: "Recycle", text: "Lower returns via accurate stock and order data" },
      { icon: "LineChart", text: "Accurate margin per order, channel, and store" },
      { icon: "Eye", text: "Live visibility across every store and warehouse" },
      { icon: "Target", text: "Better demand-to-fulfilment alignment" },
    ],
  },
  Implementation: {
    eyebrow: "Implementation Approach",
    heading: "A structured retail",
    headingAccent: "ERP rollout.",
    items: [
      { icon: "ScanSearch", n: "01", title: "Commerce process mapping", body: "Document existing channel flows, order paths, and operational gaps before configuring anything." },
      { icon: "Settings2", n: "02", title: "Catalog and workflow structuring", body: "Design product master, pricing rules, and fulfilment routes aligned with how commerce actually runs." },
      { icon: "Workflow", n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with POS, e-commerce platforms, marketplaces, and finance." },
      { icon: "Rocket", n: "04", title: "Store and warehouse enablement", body: "Train cashiers, store managers, and fulfilment staff on the new workflows with hands-on operational readiness checks." },
      { icon: "TrendingUp", n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new channels, stores, and categories." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Operational design first,",
    headingAccent: "software setup second.",
    bullets: [
      "Deep focus on operational design, not just software setup",
      "Industry-aligned commerce architecture approach",
      "Strong integration across channels and finance layers",
      "Custom workflow capability for complex retail environments",
    ],
  },
  "Final CTA": {
    headline: "Build a retail system that",
    headlineAccent: "matches your commerce reality.",
    body:
      "If your commerce depends on spreadsheets, delayed stock updates, or disconnected channels — it is not a system. It is fragmentation. SBS helps you rebuild retail control inside a unified ERP environment.",
    ctaLabel: "Request a retail ERP assessment",
    ctaHref: "#contact",
    image: hero.url,
  },
} as const;

export type RetailContent = {
  [K in RetailSectionKey]: typeof RETAIL_DEFAULTS[K];
} & { _visible: Record<RetailSectionKey, boolean> };

const SLUG = "erp-retail";

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

export function useRetailContent(): RetailContent {
  return useSectionsContent(SLUG, RETAIL_DEFAULTS) as RetailContent;
}

export function useRetailContentLegacy(): RetailContent {
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
  const merged: any = { _visible: {} as Record<RetailSectionKey, boolean> };
  for (const key of Object.keys(RETAIL_DEFAULTS) as RetailSectionKey[]) {
    merged[key] = merge(RETAIL_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as RetailContent;
}
