import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submissionMeta } from "@/lib/submissionMeta";
import { useLocale } from "@/hooks/useLocale";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  area: z.string().trim().min(1, "Please select an area"),
  message: z.string().trim().max(1000).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

function pickAr<T>(en: T | undefined | null, ar: T | undefined | null, isAr: boolean): T | undefined | null {
  if (!isAr) return en;
  if (ar === undefined || ar === null) return en;
  if (typeof ar === "string" && !ar.trim()) return en;
  return ar;
}

export type ContactFormProps = {
  source?: string;
  variant?: "light" | "dark";
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  successMessage?: string;
  buttonBg?: string;
  buttonFg?: string;
  className?: string;
};

export function ContactForm({
  source = "contact_form",
  variant = "light",
  heading,
  subheading,
  submitLabel,
  successMessage,
  buttonBg,
  buttonFg,
  className = "",
}: ContactFormProps) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    message: "",
    consent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const areasQ = useQuery({
    queryKey: ["contact_areas_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_inquiry_areas")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const areas = (areasQ.data ?? []).map((a: any) => {
    const ar = (a.translations?.ar ?? {}) as any;
    return { ...a, label: pickAr(a.label, ar.label, isAr) };
  });

  const t = (en: string, ar: string) => (isAr ? ar : en);
  const isDark = variant === "dark";

  const inputCls = isDark
    ? "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition focus:border-white/60"
    : "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--brand-blue)]";

  const labelCls = isDark
    ? "mb-2 block text-sm font-semibold text-white/90"
    : "mb-2 block text-sm font-semibold text-foreground";

  const helperCls = isDark ? "mt-2 text-sm text-white/70" : "mt-2 text-sm text-muted-foreground";
  const consentCls = isDark
    ? "flex items-start gap-3 text-sm text-white/80"
    : "flex items-start gap-3 text-sm text-muted-foreground";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = submissionSchema.safeParse(form);
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
          phone: parsed.data.phone,
          area: parsed.data.area,
          message: parsed.data.message ?? "",
          consent: parsed.data.consent,
          source,
          ...submissionMeta(),
        })
        .select("id")
        .single();
      if (error) throw error;
      if (inserted?.id) {
        supabase.functions
          .invoke("send-contact-notification", { body: { submission_id: inserted.id } })
          .catch((err) => console.warn("notification invoke failed", err));
      }
      toast.success(successMessage || t("Thanks! We'll get back to you within one business day.", "شكرًا لك! سنعاود التواصل خلال يوم عمل واحد."));
      setForm({ name: "", email: "", phone: "", area: "", message: "", consent: false });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || t("Failed to send. Please try again.", "فشل الإرسال. حاول مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  }

  const requiredStar = <span style={{ color: "var(--brand-green)" }}> *</span>;

  return (
    <form onSubmit={handleSubmit} className={className}>
      {heading && (
        <h2 className={isDark ? "text-2xl font-bold text-white md:text-3xl" : "text-2xl font-bold text-foreground md:text-3xl"}>
          {heading}
        </h2>
      )}
      {subheading && <p className={helperCls}>{subheading}</p>}

      <div className={heading || subheading ? "mt-8 space-y-5" : "space-y-5"}>
        <label className="block">
          <span className={labelCls}>{t("Name", "الاسم")}{requiredStar}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={100}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{t("Email", "البريد الإلكتروني")}{requiredStar}</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            maxLength={255}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{t("Phone Number", "رقم الهاتف")}{requiredStar}</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            maxLength={30}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{t("Area of Inquiry", "مجال الاستفسار")}{requiredStar}</span>
          <select
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
            className={`${inputCls} appearance-none`}
          >
            <option value="" className="text-foreground">
              {t("Select an area...", "اختر مجالًا...")}
            </option>
            {areas.map((a: any) => (
              <option key={a.id} value={a.label} className="text-foreground">
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>{t("Message", "الرسالة")}</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            maxLength={1000}
            rows={5}
            className={`${inputCls} resize-none`}
          />
        </label>

        <label className={consentCls}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
            required
            className="mt-1 h-4 w-4 rounded border-border"
          />
          <span>
            {t(
              "I agree to be contacted about my inquiry and consent to the processing of my data.",
              "أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي."
            )}
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-8 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105 disabled:opacity-60"
        style={{
          background: buttonBg || "var(--gradient-brand)",
          color: buttonFg || "#ffffff",
        }}
      >
        {submitting ? t("Sending…", "جارٍ الإرسال…") : (submitLabel || t("Contact Us", "تواصل معنا"))}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
