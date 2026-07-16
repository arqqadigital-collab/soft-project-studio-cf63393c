import logo from "@/assets/logo.png";
import { MainNav } from "@/components/MainNav";
import { useHeaderFooter, DEFAULT_HEADER_CTA_LABEL, DEFAULT_HEADER_CTA_URL } from "@/lib/headerFooter";

export function Header() {
  const { data: settings } = useHeaderFooter();
  const logoSrc = settings?.header_logo_url || logo;
  const ctaLabel = settings?.header_cta_label || DEFAULT_HEADER_CTA_LABEL;
  const ctaUrl = settings?.header_cta_url || DEFAULT_HEADER_CTA_URL;
  const showMenus = settings?.header_show_menus ?? true;

  const headerStyle: React.CSSProperties = {};
  if (settings?.header_bg_color) headerStyle.background = settings.header_bg_color;
  if (settings?.header_text_color) headerStyle.color = settings.header_text_color;

  const ctaStyle: React.CSSProperties = {
    background: settings?.header_cta_bg_color || "var(--gradient-brand)",
  };
  if (settings?.header_cta_text_color) ctaStyle.color = settings.header_cta_text_color;

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-[var(--brand-dark)]/80 px-6 py-4 backdrop-blur-md md:px-12"
      style={headerStyle}
    >
      <a href="/">
        <img
          src={logoSrc}
          alt="SBS — Superior Business Solutions"
          className="h-12 w-auto md:h-14"
        />
      </a>

      {showMenus && <MainNav />}

      <a
        href={ctaUrl}
        className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105 inline-block"
        style={ctaStyle}
      >
        {ctaLabel}
      </a>
    </header>
  );
}
