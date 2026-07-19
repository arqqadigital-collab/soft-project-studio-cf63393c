import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import ar from "./ar";

export type Locale = "en" | "ar";
export const SUPPORTED_LOCALES: Locale[] = ["en", "ar"];
export const RTL_LOCALES: Locale[] = ["ar"];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        ar: { translation: ar },
      },
      fallbackLng: "en",
      supportedLngs: SUPPORTED_LOCALES,
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      interpolation: { escapeValue: false },
      detection: {
        order: ["querystring", "localStorage", "navigator", "htmlTag"],
        lookupQuerystring: "lang",
        lookupLocalStorage: "sbs.locale",
        caches: ["localStorage"],
      },
    });
}

export default i18n;

export function isRTL(locale: string | undefined): boolean {
  return RTL_LOCALES.includes((locale ?? "en") as Locale);
}

export function normalizeLocale(l: string | undefined): Locale {
  const base = (l ?? "en").split("-")[0].toLowerCase();
  return (SUPPORTED_LOCALES as string[]).includes(base) ? (base as Locale) : "en";
}
