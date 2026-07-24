// Per-section design overrides. Stored on page_sections.style / homepage_sections.style.
// Empty object == no override, section renders exactly as before.

export type SectionStyle = {
  padding_y?: "none" | "sm" | "md" | "lg" | "xl";
  container?: "narrow" | "default" | "wide" | "full";
  align?: "left" | "center" | "right";
  bg_color?: string;         // hex or "" for transparent
  text_color?: string;       // hex, cascades to descendants unless overridden
  accent_color?: string;     // exposed as --section-accent
  heading_color?: string;    // exposed as --section-heading
  heading_size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  body_size?: "sm" | "md" | "lg";
  button_variant?: "primary" | "secondary" | "outline" | "ghost";
  button_size?: "sm" | "md" | "lg";
  button_radius?: "sharp" | "rounded" | "pill";
  button_bg?: string;
  button_fg?: string;
  margin_top?: "none" | "sm" | "md" | "lg";
  margin_bottom?: "none" | "sm" | "md" | "lg";
};

const PAD_Y: Record<NonNullable<SectionStyle["padding_y"]>, string> = {
  none: "0px",
  sm: "clamp(1.5rem, 3vw, 2rem)",
  md: "clamp(3rem, 5vw, 4rem)",
  lg: "clamp(5rem, 8vw, 7rem)",
  xl: "clamp(7rem, 11vw, 10rem)",
};

const MARGIN_TOP: Record<NonNullable<SectionStyle["margin_top"]>, string> = {
  none: "mt-0", sm: "mt-4", md: "mt-10", lg: "mt-20",
};
const MARGIN_BOTTOM: Record<NonNullable<SectionStyle["margin_bottom"]>, string> = {
  none: "mb-0", sm: "mb-4", md: "mb-10", lg: "mb-20",
};

const CONTAINER: Record<NonNullable<SectionStyle["container"]>, string> = {
  narrow: "max-w-3xl mx-auto",
  default: "max-w-6xl mx-auto",
  wide: "max-w-[1400px] mx-auto",
  full: "w-full px-0",
};

const ALIGN: Record<NonNullable<SectionStyle["align"]>, string> = {
  left: "text-start", center: "text-center", right: "text-end",
};

const HEADING_SIZE: Record<NonNullable<SectionStyle["heading_size"]>, string> = {
  sm: "1.25rem", md: "1.5rem", lg: "2rem", xl: "2.5rem", "2xl": "3rem", "3xl": "3.75rem",
};

const BODY_SIZE: Record<NonNullable<SectionStyle["body_size"]>, string> = {
  sm: "0.875rem", md: "1rem", lg: "1.125rem",
};

const BUTTON_RADIUS: Record<NonNullable<SectionStyle["button_radius"]>, string> = {
  sharp: "0px", rounded: "0.5rem", pill: "9999px",
};

const BUTTON_PAD: Record<NonNullable<SectionStyle["button_size"]>, string> = {
  sm: "0.375rem 0.875rem", md: "0.625rem 1.25rem", lg: "0.875rem 1.75rem",
};

const BUTTON_FS: Record<NonNullable<SectionStyle["button_size"]>, string> = {
  sm: "0.8125rem", md: "0.9375rem", lg: "1rem",
};

export function resolveSectionStyle(style: SectionStyle | null | undefined) {
  const s = style ?? {};
  const classes: string[] = ["section-styled"];
  const inline: React.CSSProperties & Record<string, string> = {};

  if (s.padding_y) {
    classes.push("section-style-padding");
    inline["--section-padding-y"] = PAD_Y[s.padding_y];
  }
  if (s.margin_top) classes.push(MARGIN_TOP[s.margin_top]);
  if (s.margin_bottom) classes.push(MARGIN_BOTTOM[s.margin_bottom]);
  if (s.align) classes.push("section-style-align", ALIGN[s.align]);

  if (s.bg_color !== undefined) {
    classes.push("section-style-bg");
    inline.background = s.bg_color || "transparent";
    inline["--section-bg"] = s.bg_color || "transparent";
  }
  if (s.text_color) {
    classes.push("section-style-text");
    inline.color = s.text_color;
    inline["--section-fg"] = s.text_color;
  }
  if (s.heading_color) {
    classes.push("section-style-heading-color");
    inline["--section-heading"] = s.heading_color;
  }
  if (s.accent_color) {
    classes.push("section-style-accent");
    inline["--section-accent"] = s.accent_color;
  }
  if (s.heading_size) {
    classes.push("section-style-heading-size");
    inline["--section-heading-size"] = HEADING_SIZE[s.heading_size];
  }
  if (s.body_size) {
    classes.push("section-style-body-size");
    inline["--section-body-size"] = BODY_SIZE[s.body_size];
  }
  if (s.button_bg !== undefined) {
    classes.push("section-style-button-bg");
    inline["--section-button-bg"] = s.button_bg || "transparent";
  }
  if (s.button_fg) {
    classes.push("section-style-button-fg");
    inline["--section-button-fg"] = s.button_fg;
  }
  if (s.button_radius) {
    classes.push("section-style-button-radius");
    inline["--section-button-radius"] = BUTTON_RADIUS[s.button_radius];
  }
  if (s.button_size) {
    classes.push("section-style-button-size");
    inline["--section-button-padding"] = BUTTON_PAD[s.button_size];
    inline["--section-button-fontsize"] = BUTTON_FS[s.button_size];
  }

  return {
    wrapperClass: classes.join(" "),
    wrapperStyle: inline,
    containerClass: s.container ? CONTAINER[s.container] : "",
    // Empty strings are meaningful for transparent backgrounds; undefined and
    // null legacy entries are not real overrides and should not add a wrapper.
    hasOverrides: Object.values(s).some((value) => value !== undefined && value !== null),
  };
}

// Sensible defaults that mirror how sections render out-of-the-box in code.
// Used by the Design & layout editor so controls reflect the current look
// instead of appearing empty when nothing has been saved yet.
export const DEFAULT_SECTION_STYLE: Required<Pick<SectionStyle,
  "padding_y" | "container" | "align" |
  "margin_top" | "margin_bottom" |
  "heading_size" | "body_size" |
  "button_size" | "button_radius" |
  "bg_color" | "text_color" | "heading_color" | "accent_color" |
  "button_bg" | "button_fg"
>> = {
  padding_y: "lg",
  container: "default",
  align: "left",
  margin_top: "none",
  margin_bottom: "none",
  heading_size: "2xl",
  body_size: "md",
  button_size: "md",
  button_radius: "rounded",
  bg_color: "#fafcfc",
  text_color: "#101a33",
  heading_color: "#101a33",
  accent_color: "#2b8fce",
  button_bg: "#2b8fce",
  button_fg: "#ffffff",
};

// Per-section-kind defaults reflecting what each section actually looks like
// on the live site when no overrides are saved. Keys match SectionKind from
// pageSections.tsx AND homepage SectionKey values so the editor can preload
// the true "current" values for every section it manages.
export const SECTION_STYLE_DEFAULTS: Record<string, Partial<typeof DEFAULT_SECTION_STYLE>> = {
  // ---- Page builder section kinds ----
  hero:              { padding_y: "xl", align: "center", heading_size: "3xl", container: "wide", bg_color: "#101a33", text_color: "#ffffff", heading_color: "#ffffff" },
  Hero:              { padding_y: "xl", align: "center", heading_size: "3xl", container: "wide", bg_color: "#101a33", text_color: "#ffffff", heading_color: "#ffffff" },
  features:          { padding_y: "lg", align: "left",   heading_size: "2xl" },
  stats:             { padding_y: "md", align: "center", heading_size: "xl",  bg_color: "#101a33", text_color: "#ffffff", heading_color: "#ffffff" },
  cta:               { padding_y: "lg", align: "center", heading_size: "2xl", bg_color: "linear-gradient(135deg, #2b8fce, #4bc16b)", text_color: "#ffffff", heading_color: "#ffffff", button_bg: "#ffffff", button_fg: "#101a33" },
  "Final CTA":       { padding_y: "lg", align: "center", heading_size: "2xl", bg_color: "linear-gradient(135deg, #2b8fce, #4bc16b)", text_color: "#ffffff", heading_color: "#ffffff", button_bg: "#ffffff", button_fg: "#101a33" },
  media:             { padding_y: "lg", container: "wide" },
  logos:             { padding_y: "md", align: "center", bg_color: "#ffffff" },
  faq:               { padding_y: "lg", container: "narrow", align: "left", heading_size: "2xl" },
  FAQ:               { padding_y: "lg", container: "narrow", align: "left", heading_size: "2xl" },
  Introduction:      { padding_y: "lg", align: "left",   heading_size: "2xl" },
  "The Problem":     { padding_y: "lg", align: "left",   heading_size: "2xl", bg_color: "#ffffff" },
  "The Platform":    { padding_y: "lg", align: "left",   heading_size: "2xl" },
  "How It Works":    { padding_y: "lg", align: "left",   heading_size: "2xl", bg_color: "#ffffff" },
  "Patient Journey": { padding_y: "lg", align: "left",   heading_size: "2xl" },
  Outcomes:          { padding_y: "lg", align: "center", heading_size: "2xl", bg_color: "#101a33", text_color: "#ffffff", heading_color: "#ffffff" },
  Integrations:      { padding_y: "lg", align: "center", heading_size: "xl",  bg_color: "#ffffff" },
  // ---- Homepage section keys ----
  expertise:         { padding_y: "lg", align: "left",   heading_size: "2xl" },
  process:           { padding_y: "lg", align: "left",   heading_size: "2xl", bg_color: "#ffffff" },
  services:          { padding_y: "lg", align: "left",   heading_size: "2xl" },
  promise:           { padding_y: "lg", align: "center", heading_size: "2xl", bg_color: "#101a33", text_color: "#ffffff", heading_color: "#ffffff" },
  clients:           { padding_y: "md", align: "center", bg_color: "#ffffff" },
  success_stories:   { padding_y: "lg", align: "left",   heading_size: "2xl" },
  partners:          { padding_y: "md", align: "center", bg_color: "#ffffff" },
};

export function getSectionDefaults(kind?: string | null): typeof DEFAULT_SECTION_STYLE {
  if (!kind) return DEFAULT_SECTION_STYLE;
  return { ...DEFAULT_SECTION_STYLE, ...(SECTION_STYLE_DEFAULTS[kind] ?? {}) };
}

// Solid colors used site-wide. `value` may be a hex or a CSS `background`
// string (gradient), so bg_color / button_bg accept the same swatches.
export const BRAND_SWATCHES = [
  { label: "Brand blue", value: "#2b8fce" },
  { label: "Brand green", value: "#4bc16b" },
  { label: "Brand dark", value: "#101a33" },
  { label: "Page bg", value: "#fafcfc" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "" },
];

// Gradient presets that match the site's `--gradient-brand` and common hero
// treatments. Shown as extra swatches under Background & Button background.
export const GRADIENT_SWATCHES = [
  { label: "Brand gradient", value: "linear-gradient(135deg, #2b8fce, #4bc16b)" },
  { label: "Brand dark gradient", value: "linear-gradient(135deg, #101a33, #2b8fce)" },
  { label: "Sunset", value: "linear-gradient(135deg, #f97316, #ec4899)" },
  { label: "Aqua", value: "linear-gradient(135deg, #06b6d4, #2b8fce)" },
];

