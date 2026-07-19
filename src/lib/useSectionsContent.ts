import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
 * Generic reader for a page's `page_sections`, merged over a defaults object
 * keyed by section_name. Returns `{ ...merged, _visible }`.
 */
export function useSectionsContent<T extends Record<string, any>>(
  slug: string,
  defaults: T,
): T & { _visible: Record<keyof T, boolean> } {
  const { data } = useQuery({
    queryKey: ["page-sections", slug],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) return { byName: {}, visibleByName: {} };

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

  const overrides = (data?.byName ?? {}) as Record<string, any>;
  const visibility = (data?.visibleByName ?? {}) as Record<string, boolean>;
  const merged: any = { _visible: {} as Record<keyof T, boolean> };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    merged[key] = merge(defaults[key] as any, overrides[key as string] ?? {});
    merged._visible[key] = visibility[key as string] ?? true;
  }
  return merged;
}
