import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type Tokens = {
  primary_color: string | null;
  accent_color: string | null;
  brand_dark_color: string | null;
  border_radius: string | null;
  heading_font: string | null;
  body_font: string | null;
  favicon_url: string | null;
};

const STYLE_ID = "site-branding-tokens";
const FONT_ID = "site-branding-fonts";

function upsertLink(rel: string, href: string, type?: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
  if (type) el.type = type;
}

function googleFontHref(fonts: string[]) {
  const families = fonts
    .filter(Boolean)
    .map((f) => `family=${encodeURIComponent(f.trim())}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

export function BrandingApplier() {
  const { data } = useQuery({
    queryKey: ["site-branding-tokens"],
    staleTime: 60_000,
    queryFn: async (): Promise<Tokens> => {
      const { data } = await supabase
        .from("site_settings")
        .select("primary_color, accent_color, brand_dark_color, border_radius, heading_font, body_font, favicon_url")
        .maybeSingle();
      return (data as any) ?? { primary_color: null, accent_color: null, brand_dark_color: null, border_radius: null, heading_font: null, body_font: null, favicon_url: null };
    },
  });

  useEffect(() => {
    if (!data) return;
    const rules: string[] = [];
    if (data.primary_color) rules.push(`--primary: ${data.primary_color};`, `--brand-blue: ${data.primary_color};`);
    if (data.accent_color) rules.push(`--accent: ${data.accent_color};`, `--brand-green: ${data.accent_color};`);
    if (data.brand_dark_color) rules.push(`--brand-dark: ${data.brand_dark_color};`);
    if (data.border_radius) rules.push(`--radius: ${data.border_radius};`);

    const isStack = (v: string) => v.includes(",") || v.includes("-serif") || v.includes("ui-");
    const fmt = (v: string) => (isStack(v) ? v : `"${v}",sans-serif`);
    const fontFams: string[] = [];
    if (data.heading_font) fontFams.push(`h1,h2,h3,h4,h5,h6{font-family:${fmt(data.heading_font)};}`);
    if (data.body_font) fontFams.push(`body{font-family:${fmt(data.body_font)};}`);

    const css = `:root{${rules.join("")}} ${fontFams.join(" ")}`;
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;

    const gfonts = [data.heading_font, data.body_font].filter((f): f is string => !!f && !isStack(f));
    let fontLink = document.getElementById(FONT_ID) as HTMLLinkElement | null;
    if (gfonts.length > 0) {
      if (!fontLink) {
        fontLink = document.createElement("link");
        fontLink.id = FONT_ID;
        fontLink.rel = "stylesheet";
        document.head.appendChild(fontLink);
      }
      fontLink.href = googleFontHref(gfonts);
    } else if (fontLink) {
      fontLink.remove();
    }


    if (data.favicon_url) {
      upsertLink("icon", data.favicon_url);
    }
  }, [data]);

  return null;
}
