import { Languages } from "lucide-react";

export type EditorLocale = "en" | "ar";

export function LocaleTabs({
  locale,
  onChange,
  className = "",
}: {
  locale: EditorLocale;
  onChange: (l: EditorLocale) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex overflow-hidden rounded-md border border-border ${className}`}>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        <Languages className="h-3.5 w-3.5" /> EN
      </button>
      <button
        type="button"
        onClick={() => onChange("ar")}
        className={`inline-flex items-center gap-1 border-s border-border px-3 py-1.5 text-xs font-semibold ${locale === "ar" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        AR — العربية
      </button>
    </div>
  );
}

export function LocaleHint({ locale }: { locale: EditorLocale }) {
  if (locale === "en") return null;
  return (
    <div className="rounded-md border border-amber-300/40 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      Editing Arabic overlay. Empty fields fall back to English.
    </div>
  );
}
