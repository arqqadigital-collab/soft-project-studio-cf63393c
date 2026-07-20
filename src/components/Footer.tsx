import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  useHeaderFooter,
  DEFAULT_FOOTER_COLUMNS,
  DEFAULT_FOOTER_TAGLINE,
  type FooterColumn,
} from "@/lib/headerFooter";
import { useLocale } from "@/i18n/LanguageProvider";
import { localizePath, useRouteMap } from "@/lib/routeMap";

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

  return (
    <>

      <footer
        className="px-6 py-16 md:px-12 md:py-20"
        style={{ background: "var(--brand-blue)" }}
      >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <img
              src={logoSrc}
              alt="SBS — Superior Business Solutions"
              className="h-14 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/80">
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
                    className="text-sm text-white/80 transition-colors hover:text-white"
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
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
                {col.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={localizePath(link.to, locale, routeMap)}
                        className="text-base text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={localizePath(link.href ?? "#", locale, routeMap)}
                        className="text-base text-white/85 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-white/80">{copyright}</p>
        </div>
      </div>
      </footer>
    </>
  );
}
