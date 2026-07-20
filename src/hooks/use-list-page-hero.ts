import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";

export type CardLabels = Record<string, string>;

export type ListPageHero = {
  page_key: string;
  eyebrow: string | null;
  title_prefix: string | null;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
  card_labels: CardLabels;
};

type ArOverlay = Partial<Omit<ListPageHero, "page_key" | "is_visible" | "card_labels">> & {
  card_labels?: CardLabels;
};

type Row = ListPageHero & { translations?: Record<string, ArOverlay> | null };

export const DEFAULT_LABELS: Record<string, { en: CardLabels; ar: CardLabels }> = {
  blog: {
    en: {
      read_more: "Read Article",
      min_read: "Min Read",
      latest_heading: "Latest Articles",
      loading: "Loading articles…",
      empty: "No published articles yet.",
      all_filter: "All",
    },
    ar: {
      read_more: "اقرأ المقال",
      min_read: "دقائق قراءة",
      latest_heading: "أحدث المقالات",
      loading: "جارٍ تحميل المقالات…",
      empty: "لا توجد مقالات منشورة بعد.",
      all_filter: "الكل",
    },
  },
  "case-studies": {
    en: {
      see_more: "See more",
      loading: "Loading case studies…",
      empty: "No published case studies yet.",
      all_filter: "All",
    },
    ar: {
      see_more: "عرض المزيد",
      loading: "جارٍ تحميل دراسات الحالة…",
      empty: "لا توجد دراسات حالة منشورة بعد.",
      all_filter: "الكل",
    },
  },
  events: {
    en: {
      see_more: "See more",
      loading: "Loading events…",
      empty: "No published events yet.",
      all_filter: "All",
      tba: "TBA",
      minutes_suffix: "Min",
      hours_suffix: "Hours",
      full_day: "Full Day",
    },
    ar: {
      see_more: "عرض المزيد",
      loading: "جارٍ تحميل الفعاليات…",
      empty: "لا توجد فعاليات منشورة بعد.",
      all_filter: "الكل",
      tba: "قريبًا",
      minutes_suffix: "دقيقة",
      hours_suffix: "ساعات",
      full_day: "يوم كامل",
    },
  },
};

export function useListPageHero(pageKey: string) {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["list_page_hero", pageKey, locale],
    queryFn: async (): Promise<ListPageHero | null> => {
      const { data, error } = await supabase
        .from("list_page_hero")
        .select("page_key,eyebrow,title_prefix,title_highlight,description,is_visible,card_labels,translations")
        .eq("page_key", pageKey)
        .maybeSingle();
      if (error) throw error;
      const defaults = DEFAULT_LABELS[pageKey] ?? { en: {}, ar: {} };
      if (!data) {
        return {
          page_key: pageKey,
          eyebrow: null,
          title_prefix: null,
          title_highlight: null,
          description: null,
          is_visible: true,
          card_labels: locale === "ar" ? { ...defaults.en, ...defaults.ar } : defaults.en,
        };
      }
      const row = data as Row;
      const enLabels = { ...defaults.en, ...(row.card_labels ?? {}) };
      let merged: ListPageHero = { ...row, card_labels: enLabels };
      if (locale === "ar" && row.translations?.ar) {
        const ar = row.translations.ar;
        merged = {
          ...merged,
          eyebrow: ar.eyebrow ?? merged.eyebrow,
          title_prefix: ar.title_prefix ?? merged.title_prefix,
          title_highlight: ar.title_highlight ?? merged.title_highlight,
          description: ar.description ?? merged.description,
          card_labels: { ...defaults.en, ...defaults.ar, ...enLabels, ...(ar.card_labels ?? {}) },
        };
      }
      return merged;
    },
    staleTime: 60_000,
  });
}
