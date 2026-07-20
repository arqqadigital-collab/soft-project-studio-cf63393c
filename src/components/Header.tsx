import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, X, Globe, ChevronDown, Linkedin, Twitter, Facebook, Instagram, Youtube, Github } from "lucide-react";
import logo from "@/assets/logo.png";
import { MainNav } from "@/components/MainNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  useHeaderFooter,
  DEFAULT_HEADER_CTA_LABEL,
  DEFAULT_HEADER_CTA_URL,
  type CtaVariant,
  type ShadowStyle,
} from "@/lib/headerFooter";
import { useMenuTree } from "@/lib/menuTree";
import { useLocale } from "@/i18n/LanguageProvider";
import { localizePath, useRouteMap } from "@/lib/routeMap";

const socialIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  github: Github,
};

function ctaClasses(variant: CtaVariant) {
  switch (variant) {
    case "primary":
      return "bg-primary text-primary-foreground hover:opacity-90";
    case "outline":
      return "border border-white/40 text-white hover:bg-white/10";
    case "ghost":
      return "text-white hover:bg-white/10";
    case "gradient":
    default:
      return "text-white shadow-[var(--shadow-brand)] hover:scale-105";
  }
}

function shadowClass(style: ShadowStyle, scrolled: boolean) {
  if (!scrolled) return "";
  if (style === "none") return "";
  if (style === "strong") return "shadow-2xl";
  return "shadow-lg";
}

export function Header() {
  const { data: settings } = useHeaderFooter();
  const { data: tree = [] } = useMenuTree();
  const { locale } = useLocale();
  const { data: routeMap } = useRouteMap();
  const localized = (url: string | null | undefined) => localizePath(url, locale, routeMap);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const defaultExpanded = settings?.mobile_default_expanded ?? false;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (defaultExpanded && tree.length) {
      setOpenGroups(Object.fromEntries(tree.map((g) => [g.id, true])));
    }
  }, [defaultExpanded, tree]);
  const toggleGroup = (id: string) => setOpenGroups((s) => ({ ...s, [id]: !s[id] }));

  

  const location = useLocation();
  const sticky = settings?.header_sticky ?? true;
  const isHome = location.pathname === "/";
  const transparentOnHero = (settings?.header_transparent_on_hero ?? false) && isHome;
  const isTransparent = transparentOnHero && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const lightLogo = settings?.header_logo_url || logo;
  const darkLogo = settings?.header_logo_dark_url || lightLogo;
  const logoSrc = isTransparent ? darkLogo : lightLogo;
  const logoHeight = settings?.header_logo_height ?? 56;

  const ctaLabel = settings?.header_cta_label || DEFAULT_HEADER_CTA_LABEL;
  const ctaUrl = settings?.header_cta_url || DEFAULT_HEADER_CTA_URL;
  const ctaVariant = settings?.header_cta_variant ?? "gradient";
  const showMenus = settings?.header_show_menus ?? true;
  const showBrandText = settings?.header_show_brand_text ?? false;
  const brandText = settings?.header_brand_text ?? "";
  const shadowStyle = settings?.header_shadow_style ?? "soft";
  const mobileExtra = settings?.mobile_menu_items ?? [];
  const mobileShowSocial = settings?.mobile_show_social ?? true;
  const mobileShowCta = settings?.mobile_show_cta ?? true;
  const mobileShowLang = settings?.mobile_show_lang ?? true;
  const mobileShowLogo = settings?.mobile_show_logo ?? true;
  const mobileSide = settings?.mobile_drawer_side ?? "end";
  const mobileWidth = Math.min(100, Math.max(50, settings?.mobile_drawer_width_pct ?? 86));
  const mobileBg = settings?.mobile_drawer_bg_color || undefined;
  const mobileText = settings?.mobile_drawer_text_color || undefined;
  const mobileMoreLabel = settings?.mobile_more_label || "More";
  const social = settings?.footer_social ?? [];


  const headerStyle: React.CSSProperties = {};
  if (!isTransparent && settings?.header_bg_color) headerStyle.background = settings.header_bg_color;
  if (settings?.header_text_color) headerStyle.color = settings.header_text_color;

  const ctaStyle: React.CSSProperties = {};
  if (ctaVariant === "gradient") {
    ctaStyle.background = settings?.header_cta_bg_color || "var(--gradient-brand)";
  } else if (settings?.header_cta_bg_color && ctaVariant !== "ghost" && ctaVariant !== "outline") {
    ctaStyle.background = settings.header_cta_bg_color;
  }
  if (settings?.header_cta_text_color) ctaStyle.color = settings.header_cta_text_color;

  const positionClass = sticky ? "fixed" : "absolute";
  const bgClass = isTransparent
    ? "bg-transparent border-transparent"
    : "border-white/5 bg-[var(--brand-dark)]/80 backdrop-blur-md";

  return (
    <>
      <header
        className={`${positionClass} left-0 right-0 top-0 z-50 flex items-center justify-between border-b px-6 py-4 transition-all duration-300 md:px-12 ${bgClass} ${shadowClass(shadowStyle, scrolled)}`}
        style={headerStyle}
      >
        <Link to={localized("/")} className="flex items-center gap-3">
          <img
            src={logoSrc}
            alt="SBS — Superior Business Solutions"
            style={{ height: logoHeight }}
            className="w-auto"
          />
          {showBrandText && brandText && (
            <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
              {brandText}
            </span>
          )}
        </Link>

        {showMenus && <MainNav />}

        <div className="flex items-center gap-2">
          {settings?.header_show_locale_switcher !== false && (
            <LanguageSwitcher
              buttonClassName={
                isTransparent
                  ? "inline-flex items-center gap-1.5 rounded-full border border-white/25 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-white/10 md:text-sm md:px-3 md:py-2"
                  : "inline-flex items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10 md:text-sm md:px-3 md:py-2"
              }
            />
          )}



          <Link
            to={localized(ctaUrl)}
            className={`hidden rounded-full px-6 py-2.5 text-sm font-semibold transition-transform md:inline-block ${ctaClasses(ctaVariant)}`}
            style={ctaStyle}
          >
            {ctaLabel}
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-white hover:bg-white/10 lg:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className={`absolute top-0 h-full overflow-y-auto p-6 shadow-2xl ${mobileSide === "start" ? "start-0" : "end-0"} ${mobileBg ? "" : "bg-[var(--brand-dark)]"}`}
            style={{ width: `${mobileWidth}%`, maxWidth: 480, background: mobileBg, color: mobileText }}
          >
            <div className="mb-6 flex items-center justify-between">
              {mobileShowLogo ? (
                <img src={lightLogo} alt="Logo" style={{ height: 40 }} className="w-auto" />
              ) : <span />}
              <div className="flex items-center gap-1">
                {mobileShowLang && settings?.header_show_locale_switcher !== false && (
                  <LanguageSwitcher buttonClassName="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10" />
                )}

                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>


            <nav className="space-y-6">
              {tree
                .filter((g) => g.is_visible)
                .map((g) => {
                  const isOpen = !!openGroups[g.id];
                  return (
                    <div key={g.id} className="border-b border-white/10 pb-2">
                      <button
                        type="button"
                        onClick={() => toggleGroup(g.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between rounded-lg px-1 py-2 text-left text-sm font-semibold uppercase tracking-wider text-white/70 hover:text-white"
                      >
                        <span>{g.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-1 space-y-1 ps-2">
                          {g.columns
                            .filter((c) => c.is_visible)
                            .flatMap((c) => c.items)
                            .map((it) => {
                              if (it.kind === "page") {
                                const p = it.page;
                                if (p.status !== "published" || !p.route_path) return null;
                                return (
                                  <Link
                                    key={p.id}
                                    to={localized(p.route_path)}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                                  >
                                    {p.nav_label || p.title}
                                  </Link>
                                );
                              }
                              const l = it.link;
                              if (!l.is_visible) return null;
                              return (
                                <Link
                                  key={l.id}
                                  to={localized(l.url)}
                                  onClick={() => setMobileOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                                >
                                  {l.label}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                })}

              {mobileExtra.length > 0 && (
                <div>
                  <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                    {mobileMoreLabel}
                  </div>

                  <div className="space-y-1">
                    {mobileExtra.map((m, i) => (
                      <Link
                        key={i}
                        to={localized(m.url)}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-white/85 hover:bg-white/10"
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {mobileShowCta && (
              <Link
                to={localized(ctaUrl)}
                onClick={() => setMobileOpen(false)}
                className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold transition-transform ${ctaClasses(ctaVariant)}`}
                style={ctaStyle}
              >
                {ctaLabel}
              </Link>
            )}




            {mobileShowSocial && social.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {social.map((s, i) => {
                  const Icon = socialIcon[s.platform?.toLowerCase()] || Globe;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/15 p-2 text-white/85 hover:bg-white/10"
                      aria-label={s.platform}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
