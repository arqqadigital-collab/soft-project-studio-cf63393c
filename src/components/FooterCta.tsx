import { useLocation } from "react-router-dom";
import { useFooterCta } from "@/lib/footerCta";
import { useLocale } from "@/hooks/useLocale";
import { ContactForm } from "@/components/ContactForm";

export function FooterCta() {
  const { data: cta } = useFooterCta();
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const { pathname } = useLocation();

  if (!cta || !cta.enabled) return null;

  const normalized = pathname.replace(/\/+$/, "") || "/";
  const excluded = (cta.excluded_paths ?? []).some((p) => {
    const n = p.replace(/\/+$/, "") || "/";
    return n === normalized;
  });
  if (excluded) return null;

  const bg = cta.bg_color || "var(--brand-blue-dark, #0b2a4a)";
  const fg = cta.text_color || "#ffffff";
  const btnBg = cta.button_bg_color || "var(--brand-accent, #f97316)";
  const btnFg = cta.button_text_color || "#ffffff";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      style={{ background: bg, color: fg }}
      className="px-6 py-16 md:px-12 md:py-20"
      aria-label={cta.title}
    >
      <div
        className={`mx-auto max-w-6xl ${
          cta.layout === "split"
            ? "grid gap-10 md:grid-cols-2 md:items-center"
            : "text-center"
        }`}
      >
        <div>
          {cta.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
              {cta.eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">
            {cta.title}
          </h2>
          {cta.description && (
            <p
              className={`mt-4 text-base opacity-90 md:text-lg ${
                cta.layout === "centered" ? "mx-auto max-w-2xl" : ""
              }`}
            >
              {cta.description}
            </p>
          )}
          {cta.button_label && cta.button_url && !cta.show_form && (
            <a
              href={cta.button_url}
              style={{ background: btnBg, color: btnFg }}
              className="mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              {cta.button_label}
            </a>
          )}
        </div>

        {cta.show_form && (
          <ContactForm
            source="footer_cta"
            variant="dark"
            submitLabel={cta.button_label || undefined}
            successMessage={cta.form_success_message || undefined}
            buttonBg={btnBg}
            buttonFg={btnFg}
            className={`mt-8 ${cta.layout === "centered" ? "mx-auto max-w-xl text-start" : "mt-0"}`}
          />
        )}
      </div>
    </section>
  );
}
