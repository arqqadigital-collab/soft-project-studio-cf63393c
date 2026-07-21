import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Video, ExternalLink } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";
import { useSetAltLanguagePath } from "@/i18n/AltLanguagePath";
import { useListPageHero } from "@/hooks/use-list-page-hero";


type EventDetail = {
  id: string;
  title: string;
  slug: string;
  slug_ar?: string | null;
  description: string | null;
  event_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string | null;
  virtual_link: string | null;
  registration_url: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  category?: { name: string; translations?: Record<string, { name?: string }> | null } | null;
  translations?: Record<string, Partial<Pick<EventDetail, "title" | "description" | "location">>> | null;
};

function CoverPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[oklch(0.62_0.13_230)] to-[oklch(0.78_0.17_145)] ${className ?? ""}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Calendar className="h-16 w-16 text-white/70" />
      </div>
    </div>
  );
}

function labelType(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function formatDateTime(iso: string | null, locale: string = "en") {
  if (!iso) return "TBA";
  const bcp = locale === "ar" ? "ar-EG" : "en-US";
  return new Date(iso).toLocaleString(bcp, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventDetail() {
  const { locale } = useLocale();
  const { data: hero } = useListPageHero("events");
  const L = hero?.card_labels ?? {};
  const { slug } = useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSetAltLanguagePath({
    en: ev ? `/events/${ev.slug}` : null,
    ar: ev ? `/ar/الفعاليات/${ev.slug_ar || ev.slug}` : null,
  });


  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("events")
        .select("*,category:categories(name,translations)")
        .or(typeof window !== "undefined" && window.location.pathname.startsWith("/ar/") ? `slug_ar.eq.${slug},slug.eq.${slug}` : `slug.eq.${slug}`)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        const base = data as unknown as EventDetail;
        const categoryName = locale === "en" ? undefined : base.category?.translations?.[locale]?.name;
        setEv({
          ...base,
          ...(locale === "en" ? {} : base.translations?.[locale] ?? {}),
          category: base.category ? { ...base.category, name: categoryName ?? base.category.name } : null,
        });
        setLoading(false);
        return;
      }
      // Fallback to slug redirects
      const { data: red } = await supabase
        .from("slug_redirects")
        .select("new_slug")
        .eq("entity_type", "event")
        .eq("old_slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (red?.new_slug) {
        navigate(`/events/${red.new_slug}`, { replace: true });
        return;
      }
      setNotFound(true);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate, locale]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-32 text-center text-sm text-muted-foreground">
        {L.loading || "Loading…"}
      </main>
    );
  }

  if (notFound || !ev) {
    return (
      <main className="min-h-screen bg-background pt-32 text-center">
        <p className="text-lg text-foreground">{L.detail_not_found_title || "Event not found."}</p>
        <Link to={locale === "ar" ? "/ar/الفعاليات" : "/events"} className="mt-4 inline-block text-sm text-[var(--brand-blue)]">
          {L.detail_not_found_link || "Back to events"}
        </Link>
      </main>
    );
  }


  const isOnline = !!ev.virtual_link || (ev.location ?? "").toLowerCase() === "online";

  return (
    <main className="min-h-screen bg-background">
      <SeoHead title={ev.title} description={ev.description ?? undefined} ogType="article" />

      <section className="pb-10 pt-28 md:pt-36">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            to={locale === "ar" ? "/ar/الفعاليات" : "/events"}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> {L.detail_back || "All events"}
          </Link>


          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <span
              className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand-blue)", background: "oklch(0.62 0.13 230 / 0.1)" }}
            >
              {ev.category?.name ?? labelType(ev.event_type)}
            </span>
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {ev.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> {formatDateTime(ev.starts_at, locale)}
              </span>
              {ev.ends_at && (
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {L.detail_ends_prefix || "Ends"} {formatDateTime(ev.ends_at, locale)}
                </span>
              )}

              {ev.location && (
                <span className="flex items-center gap-2">
                  {isOnline ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  {ev.location}
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-10">
        <div className="mx-auto max-w-5xl px-6">
          {ev.cover_image_url ? (
            <img
              src={ev.cover_image_url}
              alt={ev.title}
              className="aspect-[16/9] w-full rounded-3xl object-cover"
            />
          ) : (
            <CoverPlaceholder className="aspect-[16/9] w-full rounded-3xl" />
          )}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          {ev.description && (
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-foreground">
              {ev.description}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {ev.registration_url && (
              <a href={ev.registration_url} target="_blank" rel="noopener noreferrer">
                <Button className="inline-flex items-center gap-2">
                  {L.detail_register || "Register Now"} <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
            {ev.virtual_link && (
              <a href={ev.virtual_link} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="inline-flex items-center gap-2">
                  {L.detail_join_online || "Join Online"} <Video className="h-4 w-4" />
                </Button>
              </a>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
