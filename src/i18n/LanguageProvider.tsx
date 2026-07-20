import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import i18n, { isRTL, normalizeLocale, type Locale } from "./index";
import { isArabicPath } from "@/lib/routeMap";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "ltr" | "rtl";
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

// Routes where we always force LTR regardless of locale (admin/auth surfaces).
function isForcedLtrPath(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname === "/login" ||
    pathname === "/set-password" ||
    pathname === "/reset-password" ||
    pathname === "/accept-invite"
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  // URL is the source of truth for public routes. Admin/auth routes fall back
  // to the manual toggle (used by the dashboard's EN/AR content editor tabs).
  const forcedLtr = isForcedLtrPath(pathname);
  const urlLocale: Locale = !forcedLtr && isArabicPath(pathname) ? "ar" : "en";

  const [manualLocale, setManualLocale] = useState<Locale>(() => normalizeLocale(i18n.language));
  const activeLocale: Locale = forcedLtr ? manualLocale : urlLocale;

  useEffect(() => {
    const onChanged = (lng: string) => setManualLocale(normalizeLocale(lng));
    i18n.on("languageChanged", onChanged);
    return () => {
      i18n.off("languageChanged", onChanged);
    };
  }, []);

  // Keep i18next language in sync with URL-derived locale for public routes.
  useEffect(() => {
    if (!forcedLtr && i18n.language !== urlLocale) i18n.changeLanguage(urlLocale);
  }, [urlLocale, forcedLtr]);

  useEffect(() => {
    const dir = !forcedLtr && isRTL(activeLocale) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", activeLocale);
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.classList.toggle("rtl", dir === "rtl");
  }, [activeLocale, forcedLtr]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale: activeLocale,
      setLocale: (l) => {
        // Only meaningful on forced-LTR (admin) surfaces; public routes are
        // switched via URL navigation from LanguageSwitcher.
        i18n.changeLanguage(l);
        try {
          localStorage.setItem("sbs.locale", l);
        } catch {
          // ignore
        }
      },
      dir: !forcedLtr && isRTL(activeLocale) ? "rtl" : "ltr",
      isRTL: !forcedLtr && isRTL(activeLocale),
    }),
    [activeLocale, forcedLtr],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLocale must be used within LanguageProvider");
  return ctx;
}
