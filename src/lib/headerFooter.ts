import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";

export type FooterLink = { label: string; href?: string; to?: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type SocialLink = { platform: string; url: string };
export type LocaleOption = { code: string; label: string; url?: string };
export type MobileMenuItem = { label: string; url: string };

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "Digital Strategy", href: "#" },
      { label: "Cloud Infrastructure", href: "#" },
      { label: "Data Analytics", href: "#" },
      { label: "Cybersecurity", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Team", href: "#" },
      { label: "Careers", to: "/careers" },
      { label: "Partner Program", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Support Portal", href: "#" },
      { label: "Sales Inquiry", href: "#" },
      { label: "Media Resources", href: "#" },
    ],
  },
];

export const DEFAULT_FOOTER_TAGLINE =
  "Empowering businesses with next-generation technology solutions. We turn complex challenges into clear, actionable digital strategies.";

export const DEFAULT_HEADER_CTA_LABEL = "Get Started";
export const DEFAULT_HEADER_CTA_URL = "#";

export type CtaVariant = "gradient" | "primary" | "outline" | "ghost";
export type ShadowStyle = "none" | "soft" | "strong";

export type HeaderFooterSettings = {
  header_logo_url: string | null;
  header_logo_dark_url: string | null;
  header_logo_height: number;
  header_show_brand_text: boolean;
  header_brand_text: string | null;
  header_cta_label: string | null;
  header_cta_url: string | null;
  header_cta_variant: CtaVariant;
  header_show_menus: boolean;
  header_sticky: boolean;
  header_transparent_on_hero: boolean;
  header_shadow_style: ShadowStyle;
  header_show_locale_switcher: boolean;
  header_locales: LocaleOption[];
  mobile_menu_items: MobileMenuItem[];
  mobile_show_social: boolean;
  mobile_drawer_side: "start" | "end";
  mobile_drawer_width_pct: number;
  mobile_drawer_bg_color: string | null;
  mobile_drawer_text_color: string | null;
  mobile_show_cta: boolean;
  mobile_show_lang: boolean;
  mobile_show_logo: boolean;
  mobile_more_label: string | null;
  mobile_default_expanded: boolean;
  header_bg_color: string | null;
  header_text_color: string | null;
  header_cta_bg_color: string | null;
  header_cta_text_color: string | null;
  footer_logo_url: string | null;
  footer_tagline: string | null;
  footer_columns: FooterColumn[];
  footer_social: SocialLink[];
  footer_copyright: string | null;
};


function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/** Overlay Arabic (or any locale) translations onto the base row. */
function applyOverlay(base: Record<string, unknown>, overlay: Record<string, unknown> | undefined) {
  if (!overlay) return base;
  const out: Record<string, unknown> = { ...base };
  const textKeys = [
    "header_brand_text",
    "header_cta_label",
    "footer_tagline",
    "footer_copyright",
    "mobile_more_label",
  ];
  for (const k of textKeys) {
    if (typeof overlay[k] === "string" && (overlay[k] as string).length > 0) {
      out[k] = overlay[k];
    }
  }

  // footer_columns: array of { title, links: [{ label, ...}] }
  const baseCols = arr<FooterColumn>(base.footer_columns);
  const trCols = arr<Partial<FooterColumn>>(overlay.footer_columns);
  if (trCols.length > 0) {
    out.footer_columns = baseCols.map((c, i) => {
      const t = trCols[i] ?? {};
      const trLinks = arr<Partial<FooterLink>>(t.links);
      return {
        ...c,
        title: (t.title as string) || c.title,
        links: c.links.map((l, j) => ({
          ...l,
          label: (trLinks[j]?.label as string) || l.label,
        })),
      };
    });
  }
  // mobile_menu_items
  const baseMob = arr<MobileMenuItem>(base.mobile_menu_items);
  const trMob = arr<Partial<MobileMenuItem>>(overlay.mobile_menu_items);
  if (trMob.length > 0) {
    out.mobile_menu_items = baseMob.map((m, i) => ({
      ...m,
      label: (trMob[i]?.label as string) || m.label,
    }));
  }
  return out;
}

export function useHeaderFooter() {
  const { locale } = useLocale();
  return useQuery({
    queryKey: ["header-footer", locale],
    queryFn: async (): Promise<HeaderFooterSettings | null> => {
      const { data, error } = await supabase
        .from("header_footer_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const raw = data as Record<string, unknown>;
      const translations = (raw.translations as Record<string, Record<string, unknown>>) ?? {};
      const overlay = locale !== "en" ? translations[locale] : undefined;
      const d = applyOverlay(raw, overlay);
      return {
        header_logo_url: (d.header_logo_url as string) ?? null,
        header_logo_dark_url: (d.header_logo_dark_url as string) ?? null,
        header_logo_height: (d.header_logo_height as number) ?? 56,
        header_show_brand_text: (d.header_show_brand_text as boolean) ?? false,
        header_brand_text: (d.header_brand_text as string) ?? null,
        header_cta_label: (d.header_cta_label as string) ?? null,
        header_cta_url: (d.header_cta_url as string) ?? null,
        header_cta_variant: ((d.header_cta_variant as CtaVariant) ?? "gradient"),
        header_show_menus: (d.header_show_menus as boolean) ?? true,
        header_sticky: (d.header_sticky as boolean) ?? true,
        header_transparent_on_hero: (d.header_transparent_on_hero as boolean) ?? false,
        header_shadow_style: ((d.header_shadow_style as ShadowStyle) ?? "soft"),
        header_show_locale_switcher: (d.header_show_locale_switcher as boolean) ?? false,
        header_locales: arr<LocaleOption>(d.header_locales),
        mobile_menu_items: arr<MobileMenuItem>(d.mobile_menu_items),
        mobile_show_social: (d.mobile_show_social as boolean) ?? true,
        mobile_drawer_side: ((d.mobile_drawer_side as "start" | "end") ?? "end"),
        mobile_drawer_width_pct: (d.mobile_drawer_width_pct as number) ?? 86,
        mobile_drawer_bg_color: (d.mobile_drawer_bg_color as string) ?? null,
        mobile_drawer_text_color: (d.mobile_drawer_text_color as string) ?? null,
        mobile_show_cta: (d.mobile_show_cta as boolean) ?? true,
        mobile_show_lang: (d.mobile_show_lang as boolean) ?? true,
        mobile_show_logo: (d.mobile_show_logo as boolean) ?? true,
        mobile_more_label: (d.mobile_more_label as string) ?? "More",
        mobile_default_expanded: (d.mobile_default_expanded as boolean) ?? false,

        header_bg_color: (d.header_bg_color as string) ?? null,
        header_text_color: (d.header_text_color as string) ?? null,
        header_cta_bg_color: (d.header_cta_bg_color as string) ?? null,
        header_cta_text_color: (d.header_cta_text_color as string) ?? null,
        footer_logo_url: (d.footer_logo_url as string) ?? null,
        footer_tagline: (d.footer_tagline as string) ?? null,
        footer_columns: arr<FooterColumn>(d.footer_columns),
        footer_social: arr<SocialLink>(d.footer_social),
        footer_copyright: (d.footer_copyright as string) ?? null,
      };
    },
  });
}
