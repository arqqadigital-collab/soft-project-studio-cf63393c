import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SECTION_REGISTRY, type SectionKind } from "@/lib/pageSections";
import { useLocale } from "@/i18n/LanguageProvider";

type Row = { id: string; kind: string; position: number; is_visible: boolean; data: any; translations: any };

function mergeDeep(base: any, over: any): any {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    return base.map((item, index) =>
      over[index] === undefined ? item : mergeDeep(item, over[index]),
    );
  }
  if (Array.isArray(base) || Array.isArray(over)) return over ?? base;
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out = { ...base };
    for (const key of Object.keys(over)) out[key] = mergeDeep(base[key], over[key]);
    return out;
  }
  return over ?? base;
}

export function usePageSections(pageId: string | null | undefined) {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["page-sections", pageId, locale],
    enabled: !!pageId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("id, kind, position, is_visible, data, translations")
        .eq("page_id", pageId!)
        .order("position");
      if (error) throw error;
      return (data as Row[]).map((row) => ({
        ...row,
        data:
          locale === "en"
            ? row.data
            : mergeDeep(row.data ?? {}, row.translations?.[locale] ?? {}),
      }));
    },
  });
}

export function PageRenderer({ pageId }: { pageId: string }) {
  const q = usePageSections(pageId);
  const rows = (q.data ?? []).filter((r) => r.is_visible);
  if (q.isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }
  if (!rows.length) return null;
  return (
    <>
      {rows.map((r) => {
        const def = SECTION_REGISTRY[r.kind as SectionKind];
        if (!def) return null;
        const Render = def.Render;
        return <Render key={r.id} data={r.data ?? {}} />;
      })}
    </>
  );
}
