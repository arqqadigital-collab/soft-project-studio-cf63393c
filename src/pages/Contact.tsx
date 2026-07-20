import { useMemo, useState } from "react";
import { Send, MapPin, Phone, Mail, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { submissionMeta } from "@/lib/submissionMeta";
import { useLocale } from "@/hooks/useLocale";
import contactHero from "@/assets/contact/contact-hero.jpg";
import { ContactForm } from "@/components/ContactForm";

const ICONS: Record<string, LucideIcon> = {
  mail: Mail,
  phone: Phone,
  "map-pin": MapPin,
};

function pickAr<T>(en: T | undefined | null, ar: T | undefined | null, isAr: boolean): T | undefined | null {
  if (!isAr) return en;
  if (ar === undefined || ar === null) return en;
  if (typeof ar === "string" && !ar.trim()) return en;
  return ar;
}

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  area: z.string().trim().min(1, "Please select an area"),
  message: z.string().trim().max(1000).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent required" }) }),
});

export default function Contact() {
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

  const pageQ = useQuery({
    queryKey: ["contact_page_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_page")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const officesQ = useQuery({
    queryKey: ["contact_offices_public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_offices")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

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

  const rawPage = pageQ.data as any;
  const rawOffices = officesQ.data ?? [];
  const rawAreas = areasQ.data ?? [];

  const page = useMemo(() => {
    if (!rawPage) return null as any;
    const ar = (rawPage.translations?.ar ?? {}) as any;
    return {
      ...rawPage,
      hero_eyebrow: pickAr(rawPage.hero_eyebrow, ar.hero_eyebrow, isAr),
      hero_headline: pickAr(rawPage.hero_headline, ar.hero_headline, isAr),
      hero_subheadline: pickAr(rawPage.hero_subheadline, ar.hero_subheadline, isAr),
      hero_cta_label: pickAr(rawPage.hero_cta_label, ar.hero_cta_label, isAr),
      form_heading: pickAr(rawPage.form_heading, ar.form_heading, isAr),
      form_subheading: pickAr(rawPage.form_subheading, ar.form_subheading, isAr),
      form_submit_label: pickAr(rawPage.form_submit_label, ar.form_submit_label, isAr),
      offices_heading: pickAr(rawPage.offices_heading, ar.offices_heading, isAr),
      offices_subheading: pickAr(rawPage.offices_subheading, ar.offices_subheading, isAr),
      _arQuickInfo: Array.isArray(ar.quick_info) ? ar.quick_info : [],
    };
  }, [rawPage, isAr]);

  const offices = useMemo(() => {
    return (rawOffices as any[]).map((o) => {
      const ar = (o.translations?.ar ?? {}) as any;
      return {
        ...o,
        city: pickAr(o.city, ar.city, isAr),
        address: pickAr(o.address, ar.address, isAr),
      };
    });
  }, [rawOffices, isAr]);

  const areas = useMemo(() => {
    return (rawAreas as any[]).map((a) => {
      const ar = (a.translations?.ar ?? {}) as any;
      return { ...a, label: pickAr(a.label, ar.label, isAr) };
    });
  }, [rawAreas, isAr]);

  const quickInfo = useMemo(() => {
    const raw = (page?.quick_info as unknown) as
      | Array<{ icon?: string; title?: string; value?: string; subtitle?: string }>
      | null
      | undefined;
    const base = Array.isArray(raw) ? raw : [];
    if (!isAr) return base;
    const arList = (page?._arQuickInfo ?? []) as any[];
    return base.map((c, i) => {
      const a = arList[i] ?? {};
      return {
        icon: c.icon,
        title: (a.title && String(a.title).trim()) || c.title,
        value: (a.value && String(a.value).trim()) || c.value,
        subtitle: (a.subtitle && String(a.subtitle).trim()) || c.subtitle,
      };
    });
  }, [page, isAr]);

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
          source: "contact_form",
          ...submissionMeta(),
        })
        .select("id")
        .single();
      if (error) throw error;
      // Fire-and-forget email notification
      if (inserted?.id) {
        supabase.functions
          .invoke("send-contact-notification", { body: { submission_id: inserted.id } })
          .catch((e) => console.warn("notification invoke failed", e));
      }
      toast.success("Thanks! We'll get back to you within one business day.");
      setForm({ name: "", email: "", phone: "", area: "", message: "", consent: false });
    } catch (err: any) {
      toast.error(err.message || "Failed to send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pb-24 md:pt-40">
        <img
          src={page?.hero_background_url || contactHero}
          alt="Contact background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--brand-dark) 82%, transparent) 0%, color-mix(in oklab, var(--brand-blue) 55%, var(--brand-dark) 45%) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl text-center text-white">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-green)" }}
          >
            {page?.hero_eyebrow ?? "Contact Us"}
          </p>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            {page?.hero_headline ?? "Let's Build Something Together"}
          </h1>
          {page?.hero_subheadline && (
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg">
              {page.hero_subheadline}
            </p>
          )}
          <div className="mt-8 flex justify-center">
            <a
              href={page?.hero_cta_href || "#contact-form"}
              className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              {page?.hero_cta_label ?? "Request a Consultation"}
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="contact-form" className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl md:p-10">
            <ContactForm
              source="contact_form"
              variant="light"
              heading={page?.form_heading ?? "Send us a message"}
              subheading={page?.form_subheading ?? "Fields marked * are required."}
              submitLabel={page?.form_submit_label ?? undefined}
            />
          </div>

          {/* Quick info */}
          <div className="flex flex-col justify-start gap-6">
            {quickInfo.map((c, i) => {
              const Icon = ICONS[c.icon ?? ""] ?? Mail;
              return (
                <InfoCard
                  key={i}
                  icon={<Icon className="h-5 w-5" />}
                  title={c.title ?? ""}
                  value={c.value ?? ""}
                  subtitle={c.subtitle ?? ""}
                />
              );
            })}
          </div>
        </div>
      </section>


      {/* Offices */}
      <section
        className="px-6 py-20 md:px-12 md:py-28"
        style={{ background: "var(--brand-dark)" }}
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white md:text-5xl">
            {page?.offices_heading ?? "Our Offices"}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/70">
            {page?.offices_subheading ??
              "A global presence with local expertise. Visit us at any of our regional offices."}
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {offices.map((o) => (
              <div
                key={o.id}
                className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur"
              >
                {o.image_url && (
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={o.image_url}
                      alt={o.city}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-4 p-5">
                  <h3 className="text-lg font-bold text-white">{o.city}</h3>
                  {o.address && (
                    <div className="flex items-start gap-2 text-sm text-white/80">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: "var(--brand-green)" }}
                      />
                      <span>{o.address}</span>
                    </div>
                  )}
                  {o.phone && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Phone
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--brand-green)" }}
                      />
                      <span>{o.phone}</span>
                    </div>
                  )}
                  {o.email && (
                    <div className="flex items-center gap-2 text-sm text-white/80">
                      <Mail
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--brand-green)" }}
                      />
                      <a href={`mailto:${o.email}`} className="hover:text-white">
                        {o.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
        {required && <span style={{ color: "var(--brand-green)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

function InfoCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
          style={{ background: "var(--gradient-brand)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
          <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
