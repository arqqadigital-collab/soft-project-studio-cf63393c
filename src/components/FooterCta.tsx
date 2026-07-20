import { useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFooterCta } from "@/lib/footerCta";
import { submissionMeta } from "@/lib/submissionMeta";
import { useLocale } from "@/hooks/useLocale";

const formSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().max(1000).optional().default(""),
});

export function FooterCta() {
  const { data: cta } = useFooterCta();
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const { pathname } = useLocation();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!cta || !cta.enabled) return null;

  // exclusion: exact match or trailing-slash tolerant
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cta) return;
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please fix form errors");
      return;
    }
    setSubmitting(true);
    try {
      const { data: inserted, error } = await supabase
        .from("contact_submissions")
        .insert({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: "",
          area: "footer_cta",
          message: parsed.data.message ?? "",
          consent: true,
          source: "footer_cta",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        })
        .select("id")
        .single();
      if (error) throw error;
      if (inserted?.id) {
        supabase.functions
          .invoke("send-contact-notification", { body: { submission_id: inserted.id } })
          .catch((err) => console.warn("notification invoke failed", err));
      }
      setDone(true);
      setForm({ name: "", email: "", message: "" });
      toast.success(cta.form_success_message || (isAr ? "شكرًا لك" : "Thanks!"));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const t = (en: string, ar: string) => (isAr ? ar : en);

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
              className={`mt-8 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                cta.layout === "centered" ? "" : ""
              }`}
            >
              {cta.button_label}
            </a>
          )}
        </div>

        {cta.show_form && (
          <form
            onSubmit={handleSubmit}
            className={`mt-8 grid gap-3 ${
              cta.layout === "centered" ? "mx-auto max-w-xl" : "mt-0"
            }`}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                placeholder={t("Your name", "الاسم")}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white/60"
                style={{ color: fg }}
              />
              <input
                type="email"
                required
                placeholder={t("Email", "البريد الإلكتروني")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white/60"
                style={{ color: fg }}
              />
            </div>
            <textarea
              rows={3}
              placeholder={t("How can we help? (optional)", "كيف يمكننا مساعدتك؟ (اختياري)")}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:border-white/60"
              style={{ color: fg }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{ background: btnBg, color: btnFg }}
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting
                ? t("Sending…", "جارٍ الإرسال…")
                : cta.button_label || t("Get in touch", "تواصل معنا")}
            </button>
            {done && (
              <p className="text-sm opacity-90">
                {cta.form_success_message || t("Thanks!", "شكرًا لك")}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
