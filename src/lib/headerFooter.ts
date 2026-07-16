import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FooterLink = { label: string; href?: string; to?: string };
export type FooterColumn = { title: string; links: FooterLink[] };
export type SocialLink = { platform: string; url: string };

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

export type HeaderFooterSettings = {
  header_logo_url: string | null;
  header_cta_label: string | null;
  header_cta_url: string | null;
  header_show_menus: boolean;
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

export function useHeaderFooter() {
  return useQuery({
    queryKey: ["header-footer"],
    queryFn: async (): Promise<HeaderFooterSettings | null> => {
      const { data, error } = await supabase
        .from("header_footer_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const d = data as Record<string, unknown>;
      return {
        header_logo_url: (d.header_logo_url as string) ?? null,
        header_cta_label: (d.header_cta_label as string) ?? null,
        header_cta_url: (d.header_cta_url as string) ?? null,
        header_show_menus: (d.header_show_menus as boolean) ?? true,
        header_bg_color: (d.header_bg_color as string) ?? null,
        header_text_color: (d.header_text_color as string) ?? null,
        header_cta_bg_color: (d.header_cta_bg_color as string) ?? null,
        header_cta_text_color: (d.header_cta_text_color as string) ?? null,
        footer_logo_url: (d.footer_logo_url as string) ?? null,
        footer_tagline: (d.footer_tagline as string) ?? null,
        footer_columns: Array.isArray(d.footer_columns)
          ? (d.footer_columns as unknown as FooterColumn[])
          : [],
        footer_social: Array.isArray(d.footer_social)
          ? (d.footer_social as unknown as SocialLink[])
          : [],
        footer_copyright: (d.footer_copyright as string) ?? null,
      };
    },
  });
}

