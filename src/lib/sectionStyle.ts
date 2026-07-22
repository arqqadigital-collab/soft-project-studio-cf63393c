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
  none: "py-0",
  sm: "py-6 md:py-8",
  md: "py-12 md:py-16",
  lg: "py-20 md:py-28",
  xl: "py-28 md:py-40",
};

const MARGIN_TOP: Record<NonNullable<SectionStyle["margin_top"]>, string> = {
  none: "mt-0", sm: "mt-4", md: "mt-10", lg: "mt-20",
};
const MARGIN_BOTTOM: Record<NonNullable<SectionStyle["margin_bottom"]>, string> = {
  none: "mb-0", sm: "mb-4", md: "mb-10", lg: "mb-20",
};

const CONTAINER: Record<NonNullable<SectionStyle["container"]>, string> = {
  narrow: "max-w-3xl mx-auto px-6",
  default: "max-w-6xl mx-auto px-6",
  wide: "max-w-[1400px] mx-auto px-6",
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
  const classes: string[] = [];
  const inline: React.CSSProperties & Record<string, string> = {};

  if (s.padding_y) classes.push(PAD_Y[s.padding_y]);
  if (s.margin_top) classes.push(MARGIN_TOP[s.margin_top]);
  if (s.margin_bottom) classes.push(MARGIN_BOTTOM[s.margin_bottom]);
  if (s.align) classes.push(ALIGN[s.align]);

  if (s.bg_color) inline.background = s.bg_color;
  if (s.text_color) inline.color = s.text_color;
  if (s.heading_color) (inline as any)["--section-heading"] = s.heading_color;
  if (s.accent_color) (inline as any)["--section-accent"] = s.accent_color;
  if (s.heading_size) (inline as any)["--section-heading-size"] = HEADING_SIZE[s.heading_size];
  if (s.body_size) (inline as any)["--section-body-size"] = BODY_SIZE[s.body_size];
  if (s.button_bg) (inline as any)["--section-button-bg"] = s.button_bg;
  if (s.button_fg) (inline as any)["--section-button-fg"] = s.button_fg;
  if (s.button_radius) (inline as any)["--section-button-radius"] = BUTTON_RADIUS[s.button_radius];
  if (s.button_size) {
    (inline as any)["--section-button-padding"] = BUTTON_PAD[s.button_size];
    (inline as any)["--section-button-fontsize"] = BUTTON_FS[s.button_size];
  }

  return {
    wrapperClass: classes.join(" "),
    wrapperStyle: inline,
    containerClass: s.container ? CONTAINER[s.container] : "",
    hasOverrides: Object.keys(s).length > 0,
  };
}

export const BRAND_SWATCHES = [
  { label: "Brand blue", value: "#2b8fce" },
  { label: "Brand green", value: "#4bc16b" },
  { label: "Brand dark", value: "#101a33" },
  { label: "Page bg", value: "#fafcfc" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "" },
];
