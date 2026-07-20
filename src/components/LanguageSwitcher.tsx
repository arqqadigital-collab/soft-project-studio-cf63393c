import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLocale } from "@/i18n/LanguageProvider";
import { useAltLanguagePath } from "@/i18n/AltLanguagePath";
import { findCounterpart, useRouteMap } from "@/lib/routeMap";
import type { Locale } from "@/i18n";

const OPTIONS: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "AR" },
];

type Props = {
  className?: string;
  buttonClassName?: string;
};

export function LanguageSwitcher({ className = "", buttonClassName = "" }: Props) {
  const { locale } = useLocale();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  // Ensures route_map is loaded so counterpart resolution uses CMS overrides.
  useRouteMap();
  const alt = useAltLanguagePath();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const go = (target: Locale) => {
    if (target === locale) return;
    // Prefer per-page counterpart published by detail pages (e.g. blog posts
    // with a different Arabic slug). Fall back to route-map + path preserve.
    const explicit = target === "ar" ? alt.ar : alt.en;
    const dest = explicit || findCounterpart(pathname, target);
    navigate(`${dest}${search}${hash}`);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          buttonClassName ||
          "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
        }
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        {OPTIONS.find((o) => o.code === locale)?.short ?? "EN"}
      </button>
      {open && (
        <div className="absolute end-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-[var(--brand-dark)]/95 shadow-xl backdrop-blur-md">
          {OPTIONS.map((o) => {
            const active = o.code === locale;
            return (
              <button
                key={o.code}
                type="button"
                onClick={() => {
                  go(o.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-sm ${
                  active ? "bg-white/10 text-white" : "text-white/85 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xs uppercase text-white/50">{o.short}</span>
                  <span>{o.label}</span>
                </span>
                {active && <Check className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
