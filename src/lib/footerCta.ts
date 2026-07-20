import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";

export type FooterCtaTranslation = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  button_label?: string | null;
  form_success_message?: string | null;
};

export type FooterCtaSettings = {
  id: string;
  enabled: boolean;
  eyebrow: string | null;
  title: string;
  description: string | null;
  button_label: string | null;
  button_url: string | null;
  show_form: boolean;
  form_success_message: string | null;
  bg_color: string | null;
  text_color: string | null;
  button_bg_color: string | null;
  button_text_color: string | null;
  layout: "centered" | "split";
  excluded_paths: string[];
  translations: Record<string, FooterCtaTranslation>;
};

const TEXT_KEYS: (keyof FooterCtaTranslation)[] = [
  "eyebrow",
  "title",
  "description",
  "button_label",
  "form_success_message",
];

function overlay(base: FooterCtaSettings, locale: string): FooterCtaSettings {
  if (locale === "en") return base;
  const tr = base.translations?.[locale];
  if (!tr) return base;
  const out = { ...base };
  for (const k of TEXT_KEYS) {
    const v = tr[k];
    if (typeof v === "string" && v.trim().length > 0) {
      (out as Record<string, unknown>)[k] = v;
    }
  }
  return out;
}

export function useFooterCta() {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["footer-cta", locale],
    queryFn: async (): Promise<FooterCtaSettings | null> => {
      const { data, error } = await supabase
        .from("footer_cta")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const raw = data as unknown as FooterCtaSettings;
      return overlay(
        {
          ...raw,
          excluded_paths: Array.isArray(raw.excluded_paths) ? raw.excluded_paths : [],
          translations: (raw.translations as Record<string, FooterCtaTranslation>) ?? {},
        },
        locale,
      );
    },
  });
}

/** Raw (untranslated) fetch — for the dashboard editor. */
export function useFooterCtaRaw() {
  return useQuery({
    queryKey: ["footer-cta", "raw"],
    queryFn: async (): Promise<FooterCtaSettings | null> => {
      const { data, error } = await supabase
        .from("footer_cta")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const raw = data as unknown as FooterCtaSettings;
      return {
        ...raw,
        excluded_paths: Array.isArray(raw.excluded_paths) ? raw.excluded_paths : [],
        translations: (raw.translations as Record<string, FooterCtaTranslation>) ?? {},
      };
    },
  });
}
