import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18n, { isRTL, normalizeLocale, type Locale } from "./index";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "ltr" | "rtl";
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => normalizeLocale(i18n.language));

  useEffect(() => {
    const onChanged = (lng: string) => setLocaleState(normalizeLocale(lng));
    i18n.on("languageChanged", onChanged);
    return () => {
      i18n.off("languageChanged", onChanged);
    };
  }, []);

  useEffect(() => {
    const dir = isRTL(locale) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", locale);
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.classList.toggle("rtl", dir === "rtl");
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale: (l) => {
        i18n.changeLanguage(l);
        try {
          localStorage.setItem("sbs.locale", l);
        } catch {
          // ignore
        }
      },
      dir: isRTL(locale) ? "rtl" : "ltr",
      isRTL: isRTL(locale),
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLocale must be used within LanguageProvider");
  return ctx;
}
