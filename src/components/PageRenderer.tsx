import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SECTION_REGISTRY, type SectionKind } from "@/lib/pageSections";
import { useLocale } from "@/i18n/LanguageProvider";
import { StyledSection } from "@/components/StyledSection";
import { useRegisterFaqItems, normalizeFaqItems } from "@/lib/faqSchemaStore";

type Row = { id: string; kind: string; position: number; is_visible: boolean; data: any; translations: any; style?: any };

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

export function usePageSections(
  pageId: string | null | undefined,
  options?: { fresh?: boolean; cacheKey?: string | null },
) {
  const { locale } = useLocale();
  const fresh = options?.fresh === true;
  return useQuery({
    queryKey: ["page-sections", pageId, locale, options?.cacheKey ?? "public"],
    enabled: !!pageId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("id, kind, position, is_visible, data, translations, style")
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
    staleTime: fresh ? 0 : undefined,
    gcTime: fresh ? 0 : undefined,
    refetchOnMount: fresh ? "always" : undefined,
  });
}

export function PageRenderer({
  pageId,
  fresh = false,
  cacheKey,
}: {
  pageId: string;
  fresh?: boolean;
  cacheKey?: string | null;
}) {
  const q = usePageSections(pageId, { fresh, cacheKey });
  const rows = (q.data ?? []).filter((r) => r.is_visible);

  // FAQ sections rendered by the builder feed FAQPage JSON-LD.
  useRegisterFaqItems(
    rows.filter((r) => r.kind === "faq").flatMap((r) => normalizeFaqItems(r.data?.items)),
  );

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
        return (
          <StyledSection key={r.id} style={r.style}>
            <Render data={r.data ?? {}} />
          </StyledSection>
        );
      })}
    </>
  );
}
