import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) {
    // Array overlay: element-wise merge when both are arrays, preserving base length/order
    if (Array.isArray(base) && Array.isArray(over)) {
      return base.map((item, i) =>
        over[i] !== undefined ? merge(item, over[i]) : item,
      ) as any;
    }
    return (over ?? base) as T;
  }
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out: any = { ...(base as any) };
    for (const k of Object.keys(over)) {
      out[k] = merge((base as any)[k], (over as any)[k]);
    }
    return out;
  }
  return (over ?? base) as T;
}

function hasOwn(value: unknown, key: string): boolean {
  return !!value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, key);
}

/**
 * Generic reader for a page's `page_sections`, merged over a defaults object
 * keyed by section_name. Applies the active locale's translation overlay from
 * `page_sections.translations[locale]` on top of `page_sections.data`.
 * Returns `{ ...merged, _visible }`.
 */
export function useSectionsContent<T extends Record<string, any>>(
  slug: string,
  defaults: T,
): T & { _visible: Record<keyof T, boolean> } {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["page-sections", slug, locale],
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
        .select("data, translations, position, is_visible")
        .eq("page_id", page.id)
        .order("position");
      if (secErr) throw secErr;

      const byName: Record<string, any> = {};
      const visibleByName: Record<string, boolean> = {};
      for (const row of sections ?? []) {
        const baseData = (row.data ?? {}) as any;
        const translations = (row.translations ?? {}) as Record<string, any>;
        const overlay = locale !== "en" ? translations?.[locale] ?? null : null;
        const effective = overlay ? merge(baseData, overlay) : baseData;
        const name = baseData.section_name; // keep name from base to match defaults
        if (typeof name === "string" && name.length > 0) {
          byName[name] = effective;
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
    const override = overrides[key as string] ?? {};
    merged[key] = merge(defaults[key] as any, override);
    // A translated section name is only a dashboard label; it must never
    // change which coded section receives this content.
    if (hasOwn(defaults[key], "section_name")) {
      merged[key].section_name = (defaults[key] as any).section_name;
    }
    merged._visible[key] = visibility[key as string] ?? true;
  }
  return merged;
}
