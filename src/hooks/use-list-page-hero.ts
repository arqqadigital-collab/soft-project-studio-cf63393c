import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";

export type ListPageHero = {
  page_key: string;
  eyebrow: string | null;
  title_prefix: string | null;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
};

type Row = ListPageHero & { translations?: Record<string, Partial<ListPageHero>> | null };

export function useListPageHero(pageKey: string) {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["list_page_hero", pageKey, locale],
    queryFn: async (): Promise<ListPageHero | null> => {
      const { data, error } = await supabase
        .from("list_page_hero")
        .select("page_key,eyebrow,title_prefix,title_highlight,description,is_visible,translations")
        .eq("page_key", pageKey)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const row = data as Row;
      if (locale === "ar" && row.translations?.ar) {
        const ar = row.translations.ar;
        return {
          ...row,
          eyebrow: ar.eyebrow ?? row.eyebrow,
          title_prefix: ar.title_prefix ?? row.title_prefix,
          title_highlight: ar.title_highlight ?? row.title_highlight,
          description: ar.description ?? row.description,
        };
      }
      return row;
    },
    staleTime: 60_000,
  });
}
