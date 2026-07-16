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
      return {
        header_logo_url: data.header_logo_url,
        header_cta_label: data.header_cta_label,
        header_cta_url: data.header_cta_url,
        header_show_menus: data.header_show_menus ?? true,
        footer_logo_url: data.footer_logo_url,
        footer_tagline: data.footer_tagline,
        footer_columns: Array.isArray(data.footer_columns)
          ? (data.footer_columns as unknown as FooterColumn[])
          : [],
        footer_social: Array.isArray(data.footer_social)
          ? (data.footer_social as unknown as SocialLink[])
          : [],
        footer_copyright: data.footer_copyright,
      };
    },
  });
}
