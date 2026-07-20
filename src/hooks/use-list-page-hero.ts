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
      detail_back: "Back to Blog",
      detail_by_prefix: "By",
      detail_no_content: "No content.",
      detail_not_found_title: "Article not found",
      detail_not_found_desc: "This article doesn't exist or hasn't been published yet.",
    },
    ar: {
      read_more: "اقرأ المقال",
      min_read: "دقائق قراءة",
      latest_heading: "أحدث المقالات",
      loading: "جارٍ تحميل المقالات…",
      empty: "لا توجد مقالات منشورة بعد.",
      all_filter: "الكل",
      detail_back: "العودة إلى المدونة",
      detail_by_prefix: "بقلم",
      detail_no_content: "لا يوجد محتوى.",
      detail_not_found_title: "المقال غير موجود",
      detail_not_found_desc: "هذا المقال غير موجود أو لم يتم نشره بعد.",
    },
  },
  "case-studies": {
    en: {
      see_more: "See more",
      loading: "Loading case studies…",
      empty: "No published case studies yet.",
      all_filter: "All",
      detail_back: "All case studies",
      detail_not_found_title: "Case study not found",
      detail_not_found_link: "Back to all case studies",
      challenge_heading: "The Challenge",
      solution_heading: "Our Solution",
      results_heading: "Results",
    },
    ar: {
      see_more: "عرض المزيد",
      loading: "جارٍ تحميل دراسات الحالة…",
      empty: "لا توجد دراسات حالة منشورة بعد.",
      all_filter: "الكل",
      detail_back: "كل دراسات الحالة",
      detail_not_found_title: "دراسة الحالة غير موجودة",
      detail_not_found_link: "العودة إلى كل دراسات الحالة",
      challenge_heading: "التحدي",
      solution_heading: "الحل",
      results_heading: "النتائج",
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
      detail_back: "All events",
      detail_not_found_title: "Event not found.",
      detail_not_found_link: "Back to events",
      detail_ends_prefix: "Ends",
      detail_register: "Register Now",
      detail_join_online: "Join Online",
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
      detail_back: "كل الفعاليات",
      detail_not_found_title: "الفعالية غير موجودة.",
      detail_not_found_link: "العودة إلى الفعاليات",
      detail_ends_prefix: "تنتهي",
      detail_register: "سجّل الآن",
      detail_join_online: "انضم عبر الإنترنت",
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
      if (locale === "ar") {
        const ar = row.translations?.ar ?? {};
        merged = {
          ...merged,
          eyebrow: ar.eyebrow ?? merged.eyebrow,
          title_prefix: ar.title_prefix ?? merged.title_prefix,
          title_highlight: ar.title_highlight ?? merged.title_highlight,
          description: ar.description ?? merged.description,
          card_labels: { ...defaults.en, ...enLabels, ...defaults.ar, ...(ar.card_labels ?? {}) },
        };
      }
      return merged;
    },
    staleTime: 60_000,
  });
}
