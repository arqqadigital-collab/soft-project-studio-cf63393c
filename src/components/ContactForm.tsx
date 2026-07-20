import { useState, useRef } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submissionMeta } from "@/lib/submissionMeta";
import { useLocale } from "@/hooks/useLocale";
import { useFormSettings, pickLabel } from "@/hooks/useFormSettings";

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.\-]{1,99}$/u;
const PHONE_RE = /^[+()\d][\d\s().\-]{5,29}$/;
const URL_RE = /(https?:\/\/|www\.)/i;
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com",
  "trashmail.com","yopmail.com","sharklasers.com","getnada.com","dispostable.com",
]);

const submissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100)
    .regex(NAME_RE, "Name contains invalid characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(255)
    .refine((v) => {
      const domain = v.split("@")[1] ?? "";
      return !DISPOSABLE_DOMAINS.has(domain);
    }, "Please use a permanent email address"),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .max(30)
    .regex(PHONE_RE, "Phone number contains invalid characters"),
  area: z.string().trim().min(1, "Please select an area"),
  message: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default("")
    .refine((v) => !v || !URL_RE.test(v) || v.length > 20, "Message looks like spam"),
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
  const settingsQ = useFormSettings(source);
  const s = settingsQ.data;
  const L = (k: keyof NonNullable<typeof s>["labels"], fallback: string) =>
    pickLabel(s?.labels?.[k] || fallback, s?.labels_ar?.[k], isAr) || fallback;
  const defaultHeading = s?.labels?.heading ? L("heading", "") : "";
  const defaultSubheading = s?.labels?.subheading ? L("subheading", "") : "";

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
  const [honeypot, setHoneypot] = useState("");
  const mountedAtRef = useRef<number>(Date.now());

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

    if (honeypot.trim() !== "") {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", area: "", message: "", consent: false });
      return;
    }

    const elapsed = Date.now() - mountedAtRef.current;
    if (elapsed < 2500) {
      toast.error(t("Please take a moment to complete the form.", "يرجى أخذ لحظة لإكمال النموذج."));
      return;
    }

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
      toast.success(successMessage || L("success_message", t("Thanks! We'll get back to you within one business day.", "شكرًا لك! سنعاود التواصل خلال يوم عمل واحد.")));
      setForm({ name: "", email: "", phone: "", area: "", message: "", consent: false });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || t("Failed to send. Please try again.", "فشل الإرسال. حاول مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  }

  const requiredStar = <span style={{ color: "var(--brand-green)" }}> *</span>;
  const finalHeading = heading ?? (defaultHeading || undefined);
  const finalSubheading = subheading ?? (defaultSubheading || undefined);

  return (
    <form onSubmit={handleSubmit} className={className}>
      {finalHeading && (
        <h2 className={isDark ? "text-2xl font-bold text-white md:text-3xl" : "text-2xl font-bold text-foreground md:text-3xl"}>
          {finalHeading}
        </h2>
      )}
      {finalSubheading && <p className={helperCls}>{finalSubheading}</p>}

      {submitted && (
        <div
          role="status"
          aria-live="polite"
          className={
            isDark
              ? "mt-6 flex items-start gap-3 rounded-xl border border-emerald-300/40 bg-emerald-400/15 p-4 text-sm text-emerald-50"
              : "mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"
          }
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">
              {L("success_title", t("Message sent successfully", "تم إرسال الرسالة بنجاح"))}
            </p>
            <p className="mt-1 opacity-90">
              {successMessage || L("success_message", t("Thanks! We'll get back to you within one business day.", "شكرًا لك! سنعاود التواصل خلال يوم عمل واحد."))}
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 text-xs font-semibold underline underline-offset-2"
            >
              {L("send_another", t("Send another message", "إرسال رسالة أخرى"))}
            </button>
          </div>
        </div>
      )}

      <div className={finalHeading || finalSubheading ? "mt-8 space-y-5" : "space-y-5"}>
        {/* Honeypot */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
        >
          <label>
            Website (leave blank)
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelCls}>{L("name_label", t("Name", "الاسم"))}{requiredStar}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={L("name_placeholder", "")}
            maxLength={100}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{L("email_label", t("Email", "البريد الإلكتروني"))}{requiredStar}</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder={L("email_placeholder", "")}
            maxLength={255}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{L("phone_label", t("Phone Number", "رقم الهاتف"))}{requiredStar}</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder={L("phone_placeholder", "")}
            maxLength={30}
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>{L("area_label", t("Area of Inquiry", "مجال الاستفسار"))}{requiredStar}</span>
          <select
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            required
            className={`${inputCls} appearance-none`}
          >
            <option value="" className="text-foreground">
              {L("area_placeholder", t("Select an area...", "اختر مجالًا..."))}
            </option>
            {areas.map((a: any) => (
              <option key={a.id} value={a.label} className="text-foreground">
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelCls}>{L("message_label", t("Message", "الرسالة"))}</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={L("message_placeholder", "")}
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
            {L("consent_text", t(
              "I agree to be contacted about my inquiry and consent to the processing of my data.",
              "أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي."
            ))}
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
        {submitting
          ? L("submitting_label", t("Sending…", "جارٍ الإرسال…"))
          : (submitLabel || L("submit_label", t("Contact Us", "تواصل معنا")))}
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
