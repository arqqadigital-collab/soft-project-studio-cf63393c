import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

export const BLOG_DEFAULTS = {
  Hero: {
    eyebrow: "Insights & Updates",
    title_prefix: "Our",
    title_highlight: "Blog",
    description:
      "Thought leadership, industry trends, and practical guidance for healthcare, ERP, and technology leaders.",
  },
} as const;

export type BlogSectionKey = keyof typeof BLOG_DEFAULTS;

export type BlogContent = {
  [K in BlogSectionKey]: (typeof BLOG_DEFAULTS)[K] & Record<string, any>;
} & { _visible: Record<BlogSectionKey, boolean> };

const BLOG_PAGE_SLUG = "blog";

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

export function useBlogContent(): BlogContent {
  return useSectionsContent(BLOG_PAGE_SLUG, BLOG_DEFAULTS) as BlogContent;
}

export function useBlogContentLegacy(): BlogContent {
  const { data } = useQuery({
    queryKey: ["page-sections", BLOG_PAGE_SLUG],
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", BLOG_PAGE_SLUG)
        .maybeSingle();
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
  const merged: any = { _visible: {} as Record<BlogSectionKey, boolean> };
  for (const key of Object.keys(BLOG_DEFAULTS) as BlogSectionKey[]) {
    merged[key] = merge(BLOG_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as BlogContent;
}
