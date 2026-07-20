import { ContactForm } from "@/components/ContactForm";
import { useLocale } from "@/hooks/useLocale";

type Props = {
  source?: string;
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: string;
};

export function ContactSection({
  source = "footer_cta",
  eyebrow,
  heading,
  subheading,
}: Props) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const t = (en: string, ar: string) => (isAr ? ar : en);

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="px-6 py-20 md:px-12 md:py-28"
      style={{ background: "var(--brand-surface, #f4f8fb)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            {eyebrow ?? t("Let's Get Started", "لنبدأ")}
          </p>
          <h2 className="mt-4 text-3xl font-bold text-foreground md:text-5xl">
            {heading ?? t("Start Your Next Big Move", "ابدأ خطوتك الكبيرة التالية")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
            {subheading ??
              t(
                "We're ready to help with your digital transformation. Get in touch with our experts within 24 hours.",
                "نحن مستعدون لمساعدتك في التحول الرقمي. تواصل مع خبرائنا خلال 24 ساعة."
              )}
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-xl md:p-10">
            <ContactForm source={source} variant="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
