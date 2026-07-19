import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StyleTokens = {
  card_radius?: string;
  card_shadow?: string; // none | sm | md | lg | xl
  card_padding?: string; // compact | comfortable | spacious
  card_border?: boolean;
  card_hover?: string; // none | lift | glow
  btn_radius?: string;
  btn_size?: string; // sm | md | lg
  btn_shadow?: string; // none | sm | md | lg
  btn_style?: string; // solid | outline | gradient
  category_badge_visible?: boolean;
  category_filters_visible?: boolean;
  category_radius?: string;
  category_style?: string; // soft | solid | outline
  category_color?: string; // primary | green | accent | neutral
  category_text_case?: string; // original | uppercase
};

export type StylePayload = {
  default?: StyleTokens;
  overrides?: { prefix: string; tokens: StyleTokens }[];
};

const STYLE_ID = "site-style-tokens";

const SHADOW: Record<string, string> = {
  none: "none",
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.06)",
  md: "0 4px 12px -2px rgb(0 0 0 / 0.10)",
  lg: "0 12px 28px -6px rgb(0 0 0 / 0.15)",
  xl: "0 24px 48px -12px rgb(0 0 0 / 0.22)",
};

const PADDING: Record<string, string> = {
  compact: "1rem",
  comfortable: "1.5rem",
  spacious: "2rem",
};

const BTN_SIZE: Record<string, { h: string; px: string; fs: string }> = {
  sm: { h: "2rem", px: "0.75rem", fs: "0.8125rem" },
  md: { h: "2.5rem", px: "1.25rem", fs: "0.875rem" },
  lg: { h: "3rem", px: "1.75rem", fs: "1rem" },
};

function buildCss(t: StyleTokens): string {
  const rules: string[] = [];
  const cardRadius = t.card_radius ?? "0.75rem";
  const cardShadow = SHADOW[t.card_shadow ?? "sm"];
  const cardPad = PADDING[t.card_padding ?? "comfortable"];
  const cardBorder = t.card_border === false ? "0px" : "1px";
  rules.push(`.bg-card{border-radius:${cardRadius} !important;box-shadow:${cardShadow} !important;border-width:${cardBorder} !important;transition:transform .25s ease, box-shadow .25s ease;}`);
  rules.push(`.bg-card > [class*="p-6"]{padding:${cardPad} !important;}`);
  if (t.card_hover === "lift") {
    rules.push(`.bg-card:hover{transform:translateY(-4px);box-shadow:${SHADOW.lg} !important;}`);
  } else if (t.card_hover === "glow") {
    rules.push(`.bg-card:hover{box-shadow:0 0 0 2px hsl(var(--primary) / 0.25), ${SHADOW.md} !important;}`);
  }

  const btnRadius = t.btn_radius ?? "0.5rem";
  const btnShadow = SHADOW[t.btn_shadow ?? "sm"];
  const sz = BTN_SIZE[t.btn_size ?? "md"];
  rules.push(`button.bg-primary,a.bg-primary,button.bg-secondary,a.bg-secondary,button[class*="bg-primary"],a[class*="bg-primary"]{border-radius:${btnRadius} !important;box-shadow:${btnShadow} !important;height:${sz.h} !important;padding-left:${sz.px} !important;padding-right:${sz.px} !important;font-size:${sz.fs} !important;}`);
  if (t.btn_style === "outline") {
    rules.push(`button.bg-primary,a.bg-primary{background:transparent !important;color:hsl(var(--primary)) !important;border:1px solid hsl(var(--primary)) !important;}`);
    rules.push(`button.bg-primary:hover,a.bg-primary:hover{background:hsl(var(--primary)) !important;color:hsl(var(--primary-foreground)) !important;}`);
  } else if (t.btn_style === "gradient") {
    rules.push(`button.bg-primary,a.bg-primary{background:linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent))) !important;}`);
  }

  const categoryColor = {
    primary: "hsl(var(--primary))",
    green: "var(--brand-green)",
    accent: "hsl(var(--accent))",
    neutral: "hsl(var(--muted-foreground))",
  }[t.category_color ?? "primary"] ?? "hsl(var(--primary))";
  const categoryRadius = t.category_radius ?? "9999px";
  const categoryCase = t.category_text_case === "original" ? "none" : "uppercase";
  rules.push(`.listing-category{border-radius:${categoryRadius} !important;text-transform:${categoryCase} !important;}`);
  rules.push(`.listing-category-filter{border-radius:${categoryRadius} !important;}`);
  rules.push(`.listing-category-filter.bg-primary{background:${categoryColor} !important;color:hsl(var(--primary-foreground)) !important;border-color:${categoryColor} !important;}`);
  rules.push(`.listing-category-filter:not(.bg-primary){color:${categoryColor} !important;}`);
  if (t.category_badge_visible === false) rules.push(`.listing-category{display:none !important;}`);
  if (t.category_filters_visible === false) rules.push(`.listing-category-filters{display:none !important;}`);
  if (t.category_style === "solid") {
    rules.push(`.listing-category{background:${categoryColor} !important;color:hsl(var(--primary-foreground)) !important;border:1px solid ${categoryColor} !important;}`);
  } else if (t.category_style === "outline") {
    rules.push(`.listing-category{background:transparent !important;color:${categoryColor} !important;border:1px solid ${categoryColor} !important;}`);
  } else {
    rules.push(`.listing-category{background:color-mix(in oklch, ${categoryColor} 12%, transparent) !important;color:${categoryColor} !important;border:1px solid transparent !important;}`);
  }
  return rules.join("\n");
}

export function StyleApplier() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  const { data } = useQuery({
    queryKey: ["site-style-tokens"],
    staleTime: 60_000,
    queryFn: async (): Promise<StylePayload> => {
      const { data } = await supabase.from("site_settings").select("style_tokens").maybeSingle();
      return ((data as any)?.style_tokens as StylePayload) ?? {};
    },
  });

  useEffect(() => {
    const existing = document.getElementById(STYLE_ID);
    if (isDashboard) {
      if (existing) existing.remove();
      return;
    }
    if (!data) return;
    const base = data.default ?? {};
    const match = (data.overrides ?? []).find((o) => o.prefix && location.pathname.startsWith(o.prefix));
    const merged: StyleTokens = { ...base, ...(match?.tokens ?? {}) };
    const css = buildCss(merged);
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }
    style.textContent = css;
  }, [data, location.pathname, isDashboard]);

  return null;
}
