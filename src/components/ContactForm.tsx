import { useMemo, useState, useRef } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { submissionMeta } from "@/lib/submissionMeta";
import { useLocale } from "@/hooks/useLocale";
import { useFormSettings, pickLabel, type FormField } from "@/hooks/useFormSettings";

const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s'.\-]{1,99}$/u;
const PHONE_RE = /^[+()\d][\d\s().\-]{5,29}$/;
const URL_RE = /(https?:\/\/|www\.)/i;
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com","guerrillamail.com","10minutemail.com","tempmail.com",
  "trashmail.com","yopmail.com","sharklasers.com","getnada.com","dispostable.com",
]);

const BUILTIN_KEYS = new Set(["name", "email", "phone", "area", "message", "consent"]);

const DEFAULT_FIELDS: FormField[] = [
  { id: "f_name", key: "name", type: "text", builtin: true, enabled: true, required: true, label_en: "Name", label_ar: "الاسم" },
  { id: "f_email", key: "email", type: "email", builtin: true, enabled: true, required: true, label_en: "Email", label_ar: "البريد الإلكتروني" },
  { id: "f_phone", key: "phone", type: "tel", builtin: true, enabled: true, required: true, label_en: "Phone Number", label_ar: "رقم الهاتف" },
  { id: "f_area", key: "area", type: "area", builtin: true, enabled: true, required: true, label_en: "Area of Inquiry", label_ar: "مجال الاستفسار", placeholder_en: "Select an area...", placeholder_ar: "اختر مجالًا..." },
  { id: "f_message", key: "message", type: "textarea", builtin: true, enabled: true, required: false, label_en: "Message", label_ar: "الرسالة" },
  { id: "f_consent", key: "consent", type: "checkbox", builtin: true, enabled: true, required: true, label_en: "I agree to be contacted about my inquiry and consent to the processing of my data.", label_ar: "أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي." },
];

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
  const L = (k: string, fallback: string) =>
    pickLabel((s?.labels as any)?.[k] || fallback, (s?.labels_ar as any)?.[k], isAr) || fallback;

  const fields: FormField[] = useMemo(() => {
    const src = s?.fields && s.fields.length > 0 ? s.fields : DEFAULT_FIELDS;
    return src.filter((f) => f.enabled);
  }, [s?.fields]);

  const defaultHeading = s?.labels?.heading ? L("heading", "") : "";
  const defaultSubheading = s?.labels?.subheading ? L("subheading", "") : "";

  const [values, setValues] = useState<Record<string, any>>({});
  const setValue = (key: string, v: any) => setValues((prev) => ({ ...prev, [key]: v }));

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

  function validateField(f: FormField, v: any): string | null {
    const required = f.required;
    if (f.type === "checkbox") {
      if (required && v !== true) return t(`${f.label_en} is required`, `${f.label_ar || f.label_en} مطلوب`);
      return null;
    }
    const str = typeof v === "string" ? v.trim() : v == null ? "" : String(v);
    if (required && !str) return t(`${f.label_en} is required`, `${f.label_ar || f.label_en} مطلوب`);
    if (!str) return null;
    if (f.key === "name" && !NAME_RE.test(str)) return t("Name contains invalid characters", "الاسم يحتوي على أحرف غير صالحة");
    if (f.type === "email") {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) && str.length <= 255;
      if (!ok) return t("Please enter a valid email address", "يرجى إدخال بريد إلكتروني صالح");
      const domain = str.toLowerCase().split("@")[1] ?? "";
      if (DISPOSABLE_DOMAINS.has(domain)) return t("Please use a permanent email address", "يرجى استخدام بريد إلكتروني دائم");
    }
    if (f.type === "tel" && !PHONE_RE.test(str)) return t("Phone number contains invalid characters", "رقم الهاتف يحتوي على أحرف غير صالحة");
    if (f.key === "message" && URL_RE.test(str) && str.length <= 20) return t("Message looks like spam", "الرسالة تبدو كرسائل غير مرغوب فيها");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (honeypot.trim() !== "") {
      setSubmitted(true);
      setValues({});
      return;
    }

    const elapsed = Date.now() - mountedAtRef.current;
    if (elapsed < 2500) {
      toast.error(t("Please take a moment to complete the form.", "يرجى أخذ لحظة لإكمال النموذج."));
      return;
    }

    for (const f of fields) {
      const err = validateField(f, values[f.key]);
      if (err) {
        toast.error(err);
        return;
      }
    }

    setSubmitting(true);
    try {
      const builtin: Record<string, any> = {};
      const custom: Record<string, any> = {};
      for (const f of fields) {
        const v = values[f.key];
        if (BUILTIN_KEYS.has(f.key)) {
          builtin[f.key] = f.type === "checkbox" ? v === true : (typeof v === "string" ? v.trim() : v ?? "");
        } else {
          custom[f.key] = v ?? (f.type === "checkbox" ? false : "");
        }
      }

      const payload: any = {
        name: builtin.name ?? "",
        email: (builtin.email ?? "").toLowerCase(),
        phone: builtin.phone ?? "",
        area: builtin.area ?? "",
        message: builtin.message ?? "",
        consent: builtin.consent === true,
        custom_data: custom,
        source,
        ...submissionMeta(),
      };

      const { data: inserted, error } = await supabase
        .from("contact_submissions")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      if (inserted?.id) {
        supabase.functions
          .invoke("send-contact-notification", { body: { submission_id: inserted.id } })
          .catch((err) => console.warn("notification invoke failed", err));
      }
      toast.success(successMessage || L("success_message", t("Thanks! We'll get back to you within one business day.", "شكرًا لك! سنعاود التواصل خلال يوم عمل واحد.")));
      setValues({});
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

  const renderField = (f: FormField) => {
    const label = pickAr(f.label_en, f.label_ar, isAr) as string;
    const placeholder = (pickAr(f.placeholder_en, f.placeholder_ar, isAr) as string) ?? "";
    const v = values[f.key];

    if (f.type === "checkbox") {
      return (
        <label key={f.id} className={consentCls}>
          <input
            type="checkbox"
            checked={v === true}
            onChange={(e) => setValue(f.key, e.target.checked)}
            required={f.required}
            className="mt-1 h-4 w-4 rounded border-border"
          />
          <span>{label}</span>
        </label>
      );
    }

    const labelNode = (
      <span className={labelCls}>
        {label}
        {f.required && requiredStar}
      </span>
    );

    if (f.type === "textarea") {
      return (
        <label key={f.id} className="block">
          {labelNode}
          <textarea
            value={v ?? ""}
            onChange={(e) => setValue(f.key, e.target.value)}
            placeholder={placeholder}
            maxLength={1000}
            rows={5}
            required={f.required}
            className={`${inputCls} resize-none`}
          />
        </label>
      );
    }

    if (f.type === "area") {
      return (
        <label key={f.id} className="block">
          {labelNode}
          <select
            value={v ?? ""}
            onChange={(e) => setValue(f.key, e.target.value)}
            required={f.required}
            className={`${inputCls} appearance-none`}
          >
            <option value="" className="text-foreground">
              {placeholder || t("Select an area...", "اختر مجالًا...")}
            </option>
            {areas.map((a: any) => (
              <option key={a.id} value={a.label} className="text-foreground">
                {a.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (f.type === "select") {
      const opts = f.options ?? [];
      return (
        <label key={f.id} className="block">
          {labelNode}
          <select
            value={v ?? ""}
            onChange={(e) => setValue(f.key, e.target.value)}
            required={f.required}
            className={`${inputCls} appearance-none`}
          >
            <option value="" className="text-foreground">
              {placeholder || t("Select...", "اختر...")}
            </option>
            {opts.map((o) => (
              <option key={o.value} value={o.value} className="text-foreground">
                {(pickAr(o.label_en, o.label_ar, isAr) as string) || o.value}
              </option>
            ))}
          </select>
        </label>
      );
    }

    const htmlType =
      f.type === "email" ? "email" :
      f.type === "tel" ? "tel" :
      f.type === "number" ? "number" :
      f.type === "date" ? "date" : "text";

    return (
      <label key={f.id} className="block">
        {labelNode}
        <input
          type={htmlType}
          value={v ?? ""}
          onChange={(e) => setValue(f.key, e.target.value)}
          placeholder={placeholder}
          maxLength={f.type === "email" ? 255 : f.type === "tel" ? 30 : 200}
          required={f.required}
          className={inputCls}
        />
      </label>
    );
  };

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

        {fields.map(renderField)}
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
