import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

export const EVENTS_DEFAULTS = {
  Hero: {
    eyebrow: "Learn & Connect",
    title_prefix: "Events &",
    title_highlight: "Webinars",
    description:
      "Upcoming events, webinars, workshops and executive roundtables from our team.",
  },
} as const;

export type EventsSectionKey = keyof typeof EVENTS_DEFAULTS;

export type EventsContent = {
  [K in EventsSectionKey]: (typeof EVENTS_DEFAULTS)[K] & Record<string, any>;
} & { _visible: Record<EventsSectionKey, boolean> };

const EVENTS_PAGE_SLUG = "events";

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

export function useEventsContent(): EventsContent {
  return useSectionsContent(EVENTS_PAGE_SLUG, EVENTS_DEFAULTS) as EventsContent;
}

export function useEventsContentLegacy(): EventsContent {
  const { data } = useQuery({
    queryKey: ["page-sections", EVENTS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", EVENTS_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<EventsSectionKey, boolean> };
  for (const key of Object.keys(EVENTS_DEFAULTS) as EventsSectionKey[]) {
    merged[key] = merge(EVENTS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as EventsContent;
}
