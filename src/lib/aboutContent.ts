import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

// Section keys mirror the `data.section_name` values saved by the builder.
export type AboutSectionKey =
  | "Hero"
  | "Introduction"
  | "Mission & Vision"
  | "Our Journey"
  | "Final CTA";

export const ABOUT_DEFAULTS = {
  Hero: {
    eyebrow: "About SBS",
    headline: "Empowering Organizations Through",
    headlineAccent: "Intelligent Technology Solutions",
    subheadline:
      "By combining ERP expertise, healthcare system integration, and enterprise consulting, SBS helps organisations transform fragmented processes into connected, intelligent ecosystems.",
    mediaUrl: "",
  },
  Introduction: {
    body:
      "SBS is a specialised provider of enterprise software solutions, healthcare technologies, and digital transformation services designed to help organisations modernise operations, improve efficiency, and unlock data-driven decision-making.",
    items: [] as any[],
  },
  "Mission & Vision": {
    items: [
      {
        icon: "Target",
        title: "Our Mission",
        description:
          "To help organisations leverage technology as a strategic asset, enabling operational excellence, automation, and data-driven growth.",
      },
      {
        icon: "Eye",
        title: "Our Vision",
        description:
          "To become a leading regional provider of integrated enterprise and healthcare technology solutions, empowering organisations with scalable, intelligent systems.",
      },
    ],
  },
  "Our Journey": {
    eyebrow: "Our Journey",
    heading: "From Vision to Trusted Technology Partner",
    items: [
      {
        icon: "Building2",
        title: "Foundation",
        description:
          "SBS was established to help organisations solve operational challenges through smart, scalable technology solutions.",
      },
      {
        icon: "Layers",
        title: "Expansion",
        description:
          "We evolved into a full-service provider, delivering ERP implementation, system integration, and process automation across industries.",
      },
      {
        icon: "Stethoscope",
        title: "Healthcare Focus",
        description:
          "SBS expanded into healthcare, providing solutions such as HIS, EMR, PACS, and RCM systems, strengthening our industry specialisation.",
      },
      {
        icon: "Handshake",
        title: "Strategic Partnerships",
        description:
          "Collaborations with platforms like Odoo and Microsoft Dynamics 365 enabled us to deliver enterprise-grade, flexible solutions.",
      },
      {
        icon: "Rocket",
        title: "Today",
        description:
          "We continue to drive digital transformation through integrated systems, automation, and data-driven solutions that help organisations scale and innovate.",
      },
    ],
  },
  "Final CTA": {
    headline: "Building the Future with",
    headlineAccent: "Intelligent Systems",
    body:
      "As organizations continue to navigate digital transformation, the need for integrated, scalable, and intelligent systems has never been greater. SBS remains committed to helping organizations adopt technologies that enhance efficiency, strengthen decision-making, and create long-term competitive advantage.",
    body2:
      "Looking to modernize your operations with smarter technology solutions? Connect with SBS to explore how our expertise can support your organization digital transformation journey.",
    primaryLabel: "Connect With SBS",
    primaryHref: "/contact",
    secondaryLabel: "",
    secondaryHref: "",
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

export function useAboutContent(): AboutContent {
  return useSectionsContent(ABOUT_PAGE_SLUG, ABOUT_DEFAULTS) as AboutContent;
}

export function useAboutContentLegacy(): AboutContent {
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
