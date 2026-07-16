import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Section keys mirror the `data.section_name` values saved by the builder.
export type AboutSectionKey =
  | "Hero"
  | "Introduction"
  | "Mission"
  | "Values"
  | "Milestones"
  | "By The Numbers"
  | "Final CTA";

export const ABOUT_DEFAULTS = {
  Hero: {
    headline: "Built by Practitioners.",
    headlineAccent: "Trusted by Enterprises.",
    subheadline:
      "We help ambitious organizations run better systems — from clinical operations to enterprise resource planning — with software, services and expertise assembled by people who have done the work themselves.",
    ctaLabel: "Talk to Our Team",
    ctaHref: "/contact",
    ctaLabel2: "See Our Case Studies",
    ctaHref2: "/case-studies",
    chips: [
      "Regional Presence",
      "250+ Enterprise Clients",
      "20+ Years of Delivery",
      "Healthcare · ERP · Cybersecurity",
    ],
    mediaUrl: "",
  },
  Introduction: {
    eyebrow: "Who We Are",
    heading: "One Partner for the Systems That Run Your Organization",
    headingAccent: "Run Your Organization",
    body:
      "We are a technology and consulting group with deep roots in healthcare information systems, enterprise resource planning, cybersecurity and cloud infrastructure. Our teams combine domain practitioners, certified engineers and delivery managers who work side-by-side with our clients — not from a distance. What began as a focused hospital-systems practice has grown into a regional partner supporting hundreds of organizations across the public and private sector, from single-site clinics to multi-country enterprises.",
  },
  Mission: {
    headline: "Our Mission",
    body:
      "To connect the systems, people and decisions that make modern organizations work — so that clinicians can focus on patients, operators can focus on outcomes, and leaders can focus on the future.",
    primaryLabel: "Read Our Story",
    primaryHref: "#story",
    secondaryLabel: "",
    secondaryHref: "",
  },
  Values: {
    eyebrow: "What We Stand For",
    heading: "The Principles That Guide Every Engagement",
    headingAccent: "Every Engagement",
    items: [
      { icon: "ShieldCheck", title: "Practitioner-Led", description: "Our teams are led by people who have run the departments and operations our software supports — not just built products for them." },
      { icon: "HeartPulse", title: "Outcomes Over Output", description: "Success is measured in reduced length of stay, faster financial close, avoided incidents — not lines of code shipped." },
      { icon: "Network", title: "Open by Design", description: "We build on open standards and interoperable architectures so our clients are never locked into a single vendor world." },
      { icon: "Workflow", title: "Delivery Discipline", description: "Structured methodology, clear milestones and shared accountability from kickoff to hyper-care and beyond." },
      { icon: "CheckCircle2", title: "Long-Term Partnership", description: "We stay after go-live. Every client has a named team responsible for their success, not a ticketing queue." },
      { icon: "BarChart3", title: "Measured Improvement", description: "Every engagement includes agreed KPIs and quarterly business reviews so improvement is visible and shared." },
    ],
  },
  Milestones: {
    eyebrow: "Our Story",
    heading: "Two Decades of Building Systems That Matter",
    headingAccent: "Systems That Matter",
    items: [
      { icon: "UserPlus", title: "2005 — Founded", description: "Founded as a small clinical-systems practice serving hospitals across the region with focused implementation and support services." },
      { icon: "ClipboardList", title: "2012 — Enterprise Expansion", description: "Expanded into enterprise resource planning and financial systems for manufacturing, distribution and services groups." },
      { icon: "ShieldCheck", title: "2017 — Cybersecurity Practice", description: "Launched a dedicated cybersecurity and infrastructure practice with a regional Security Operations Center." },
      { icon: "Network", title: "2020 — Cloud & Integration", description: "Established the cloud engineering and integration platform team, delivering managed integration for hundreds of endpoints." },
      { icon: "BarChart3", title: "2024 — Analytics & AI", description: "Formed the applied analytics and AI group, embedding intelligent decision support across every practice we deliver." },
    ],
  },
  "By The Numbers": {
    heading: "By The Numbers",
    items: [
      { value: "250", label: "Enterprise clients across healthcare, ERP and cybersecurity engagements" },
      { value: "20", label: "Years of continuous regional delivery and support" },
      { value: "9", label: "Practices — from clinical systems to cloud infrastructure" },
      { value: "98", label: "Client retention rate across the last three fiscal years" },
    ],
  },
  "Final CTA": {
    headline: "Ready to Build the Systems Your Organization Deserves?",
    body:
      "Whether you are planning a full transformation or a focused improvement, our team is ready to help you scope, design and deliver.",
    primaryLabel: "Talk to Our Team",
    primaryHref: "/contact",
    secondaryLabel: "See Our Case Studies",
    secondaryHref: "/case-studies",
  },
} as const;

export type AboutContent = {
  [K in AboutSectionKey]: (typeof ABOUT_DEFAULTS)[K] & Record<string, any>;
} & { _visible: Record<AboutSectionKey, boolean> };

const ABOUT_PAGE_SLUG = "about";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
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

/**
 * Fetches all page_sections for the About page and merges DB overrides
 * over ABOUT_DEFAULTS. Same pattern as useHISContent.
 */
export function useAboutContent(): AboutContent {
  const { data } = useQuery({
    queryKey: ["page-sections", ABOUT_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", ABOUT_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) {
        return { byName: {}, visibleByName: {} } as {
          byName: Record<string, any>;
          visibleByName: Record<string, boolean>;
        };
      }
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
  const merged: any = { _visible: {} as Record<AboutSectionKey, boolean> };
  for (const key of Object.keys(ABOUT_DEFAULTS) as AboutSectionKey[]) {
    merged[key] = merge(ABOUT_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as AboutContent;
}

export function splitAccent(full: string, accent: string): { lead: string; accent: string } {
  if (!full && !accent) return { lead: "", accent: "" };
  if (!accent) return { lead: full, accent: "" };
  if (!full) return { lead: "", accent };
  if (full === accent) return { lead: "", accent: full };
  if (full.endsWith(accent)) {
    return { lead: full.slice(0, full.length - accent.length).trimEnd() + " ", accent };
  }
  return { lead: full + " ", accent };
}
