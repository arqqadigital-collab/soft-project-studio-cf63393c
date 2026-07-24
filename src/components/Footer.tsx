import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  useHeaderFooter,
  DEFAULT_FOOTER_COLUMNS,
  DEFAULT_FOOTER_TAGLINE,
  type FooterColumn,
  type FooterStyle,
} from "@/lib/headerFooter";
import { useLocale } from "@/i18n/LanguageProvider";
import { localizePath, useRouteMap } from "@/lib/routeMap";
import { CSSProperties } from "react";

export function Footer() {
  const { data: settings } = useHeaderFooter();
  const { locale } = useLocale();
  const { data: routeMap } = useRouteMap();

  const logoSrc = settings?.footer_logo_url || logo;
  const tagline = settings?.footer_tagline || DEFAULT_FOOTER_TAGLINE;
  const columns: FooterColumn[] =
    settings && settings.footer_columns.length > 0
      ? settings.footer_columns
      : DEFAULT_FOOTER_COLUMNS;
  const social = settings?.footer_social ?? [];
  const copyright =
    settings?.footer_copyright ||
    `© ${new Date().getFullYear()} Superior Business Solutions. All rights reserved.`;

  const style: FooterStyle = settings?.footer_style ?? {};
  const bg = style.bg_color || "var(--brand-blue)";
  const textColor = style.text_color;
  const headingColor = style.heading_color || textColor;
  const linkColor = style.link_color || textColor;
  const borderColor = style.border_color;
  const copyrightColor = style.copyright_color || textColor;
  const py = style.padding_y ?? 80;
  const colGap = style.column_gap ?? 48;
  const linkGap = style.link_gap ?? 16;

  const cssVars = {
    "--footer-link-color": linkColor || "rgba(255,255,255,0.85)",
    "--footer-link-hover": style.link_hover_color || "#ffffff",
  } as CSSProperties;

  return (
    <footer
      className="px-6 md:px-12"
      style={{
        background: bg,
        color: textColor,
        paddingTop: py,
        paddingBottom: py,
        ...cssVars,
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="grid md:grid-cols-2 lg:grid-cols-4"
          style={{ gap: colGap }}
        >
          {/* Brand */}
          <div>
            <img
              src={logoSrc}
              alt="SBS — Superior Business Solutions"
              className="w-auto brightness-0 invert"
              style={{ height: style.logo_height ?? 56 }}
            />
            <p
              className="mt-6 max-w-xs leading-relaxed"
              style={{
                color: textColor || "rgba(255,255,255,0.8)",
                fontSize: style.tagline_size ?? 14,
              }}
            >
              {tagline}
            </p>
            {social.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {social.map((s, i) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:opacity-100"
                    style={{
                      color: linkColor || "rgba(255,255,255,0.8)",
                      fontSize: style.link_size ?? 14,
                    }}
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3
                className="font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: headingColor || "#ffffff",
                  fontSize: style.heading_size ?? 14,
                }}
              >
                {col.title}
              </h3>
              <ul className="mt-6" style={{ display: "grid", gap: linkGap }}>
                {col.links.map((link) => {
                  const linkStyle: CSSProperties = {
                    color: linkColor || "rgba(255,255,255,0.85)",
                    fontSize: style.link_size ?? 16,
                  };
                  return (
                    <li key={link.label}>
                      {link.to ? (
                        <Link
                          to={localizePath(link.to, locale, routeMap)}
                          className="footer-link transition-colors"
                          style={linkStyle}
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={localizePath(link.href ?? "#", locale, routeMap)}
                          className="footer-link transition-colors"
                          style={linkStyle}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-16 pt-8 text-center"
          style={{
            borderTop: `1px solid ${borderColor || "rgba(255,255,255,0.2)"}`,
          }}
        >
          <p
            style={{
              color: copyrightColor || "rgba(255,255,255,0.8)",
              fontSize: style.copyright_size ?? 14,
            }}
          >
            {copyright}
          </p>
        </div>
      </div>
      <style>{`
        .footer-link:hover { color: var(--footer-link-hover) !important; }
      `}</style>
    </footer>
  );
}
