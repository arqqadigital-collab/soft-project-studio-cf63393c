import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

export const CASE_STUDIES_DEFAULTS = {
  Hero: {
    eyebrow: "Success Stories",
    title_prefix: "Our",
    title_highlight: "Case Studies",
    description:
      "Real-world outcomes from healthcare, ERP, and technology engagements across the region.",
  },
} as const;

export type CaseStudiesSectionKey = keyof typeof CASE_STUDIES_DEFAULTS;

export type CaseStudiesContent = {
  [K in CaseStudiesSectionKey]: (typeof CASE_STUDIES_DEFAULTS)[K] & Record<string, any>;
} & { _visible: Record<CaseStudiesSectionKey, boolean> };

const SLUG = "case-studies";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out: any = { ...(base as any) };
    for (const k of Object.keys(over)) out[k] = merge((base as any)[k], (over as any)[k]);
    return out;
  }
  return (over ?? base) as T;
}

export function useCaseStudiesContent(): CaseStudiesContent {
  return useSectionsContent(SLUG, CASE_STUDIES_DEFAULTS) as CaseStudiesContent;
}

export function useCaseStudiesContentLegacy(): CaseStudiesContent {
  const { data } = useQuery({
    queryKey: ["page-sections", SLUG],
    queryFn: async () => {
      const { data: page } = await supabase.from("pages").select("id").eq("slug", SLUG).maybeSingle();
      if (!page?.id) return { byName: {}, visibleByName: {} };
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
  const merged: any = { _visible: {} as Record<CaseStudiesSectionKey, boolean> };
  for (const key of Object.keys(CASE_STUDIES_DEFAULTS) as CaseStudiesSectionKey[]) {
    merged[key] = merge(CASE_STUDIES_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as CaseStudiesContent;
}
