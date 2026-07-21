import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, MapPin, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { useEventsContent } from "@/lib/eventsContent";
import { useLocale } from "@/i18n/LanguageProvider";
import { useListPageHero } from "@/hooks/use-list-page-hero";


type EventRow = {
  id: string;
  title: string;
  slug: string;
  slug_ar: string | null;
  description: string | null;
  event_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  virtual_link: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category_id: string | null;
  category?: { name: string; slug: string; translations?: Record<string, { name?: string }> | null } | null;
  translations?: Record<string, Partial<Pick<EventRow, "title" | "description" | "location">>> | null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

function CoverPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[oklch(0.62_0.13_230)] to-[oklch(0.78_0.17_145)] ${className ?? ""}`}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-1/4 -top-1/4 h-full w-full rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-full w-full rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm">
          <Calendar className="h-7 w-7 text-white/90" />
        </div>
      </div>
    </div>
  );
}

function Cover({ url, className }: { url: string | null; className?: string }) {
  if (!url) return <CoverPlaceholder className={className} />;
  return (
    <div className={`relative overflow-hidden bg-muted ${className ?? ""}`}>
      <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function formatDate(iso: string | null, tba: string, locale: string = "en") {
  if (!iso) return tba;
  const bcp = locale === "ar" ? "ar-EG" : "en-US";
  return new Date(iso).toLocaleDateString(bcp, { year: "numeric", month: "long", day: "numeric" });
}

function durationOf(start: string | null, end: string | null, labels: { min: string; hours: string; full: string }) {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(ms / 60000);
  if (mins <= 0) return null;
  if (mins < 60) return `${mins} ${labels.min}`;
  const hours = mins / 60;
  if (hours < 8) return hours % 1 === 0 ? `${hours} ${labels.hours}` : `${hours.toFixed(1)} ${labels.hours}`;
  return labels.full;
}

function labelType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}


export default function Events() {
  const { locale } = useLocale();
  const content = useEventsContent();
  const hero = content.Hero;
  const heroVisible = content._visible.Hero;
  const { data: listHero } = useListPageHero("events");
  const L = listHero?.card_labels ?? {};
  const ALL = L.all_filter ?? "All";
  const durLabels = {
    min: L.minutes_suffix ?? "Min",
    hours: L.hours_suffix ?? "Hours",
    full: L.full_day ?? "Full Day",
  };
  const tba = L.tba ?? "TBA";
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("__all__");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,slug,slug_ar,description,event_type,starts_at,ends_at,location,virtual_link,cover_image_url,published_at,translations,category_id,category:categories(name,slug,translations)")
        .eq("status", "published")
        .order("starts_at", { ascending: true, nullsFirst: false })
        .limit(100);
      if (cancelled) return;
      if (!error && data) setRows((data as unknown as EventRow[]).map((row) => {
        const translatedCategory = locale === "en" ? undefined : row.category?.translations?.[locale]?.name;
        return {
          ...row,
          ...(locale === "en" ? {} : row.translations?.[locale] ?? {}),
          category: row.category ? { ...row.category, name: translatedCategory ?? row.category.name } : null,
        };
      }));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    rows.forEach((r) => {
      if (r.category) set.set(r.category.slug, r.category.name);
      else if (r.event_type) set.set(`type:${r.event_type}`, labelType(r.event_type));
    });
    return [{ id: "__all__", label: ALL }, ...Array.from(set, ([id, label]) => ({ id, label }))];
  }, [rows, ALL]);

  const filtered = useMemo(() => {
    if (active === "__all__") return rows;
    return rows.filter((r) => (r.category?.slug ?? `type:${r.event_type}`) === active);
  }, [rows, active]);


  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Events & Webinars"
        description="Upcoming events, webinars, workshops and executive roundtables from our team."
        ogType="website"
      />

      {heroVisible && (
        <section className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {hero?.eyebrow && (
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand-blue)" }}>
                  {hero.eyebrow}
                </p>
              )}
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {hero?.title_prefix ?? "Events &"}{" "}
                <span style={{ color: "var(--brand-blue)" }}>{hero?.title_highlight ?? "Webinars"}</span>
              </h1>
              {hero?.description && (
                <p className="mt-5 text-lg text-muted-foreground">{hero.description}</p>
              )}
            </motion.div>

            {categories.length > 1 && (
              <motion.div
                className="listing-category-filters mt-10 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActive(cat.id)}
                    className={`listing-category-filter rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      active === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {loading && (
        <div className="pb-24 text-center text-sm text-muted-foreground">{L.loading ?? "Loading events…"}</div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="pb-24 text-center text-sm text-muted-foreground">{L.empty ?? "No published events yet."}</div>
      )}

      <section className="bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((ev, idx) => {
              const isOnline = !!ev.virtual_link || (ev.location ?? "").toLowerCase() === "online";
              const dur = durationOf(ev.starts_at, ev.ends_at, durLabels);

              return (
                <motion.article
                  key={ev.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  custom={idx}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link to={`${locale === "ar" ? "/ar/الفعاليات" : "/events"}/${(locale === "ar" && ev.slug_ar) || ev.slug}`} className="flex flex-1 flex-col">
                    <Cover url={ev.cover_image_url} className="aspect-[16/10] w-full" />
                    <div className="flex flex-1 flex-col p-6">
                      <span
                        className="listing-category w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--brand-blue)", background: "oklch(0.62 0.13 230 / 0.1)" }}
                      >
                        {ev.category?.name ?? labelType(ev.event_type)}
                      </span>
                      <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)]">
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">
                          {ev.description}
                        </p>
                      )}
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(ev.starts_at, tba, locale)}
                        </span>
                      </div>
                      <span
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                        style={{ color: "var(--brand-blue)" }}
                      >
                        {L.see_more ?? "See more"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
