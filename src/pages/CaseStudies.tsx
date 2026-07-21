import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { useCaseStudiesContent } from "@/lib/caseStudiesContent";
import { useLocale } from "@/i18n/LanguageProvider";
import { useListPageHero } from "@/hooks/use-list-page-hero";


type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  slug_ar: string | null;
  summary: string | null;
  client_name: string | null;
  industry: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category_id: string | null;
  categories?: { name: string; slug: string; translations?: Record<string, { name?: string }> | null } | null;
  category?: { name: string; slug: string } | null;
  translations?: Record<string, Partial<Pick<CaseStudyRow, "title" | "summary">>> | null;
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
        <div className="h-16 w-16 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm" />
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

export default function CaseStudies() {
  const { locale } = useLocale();
  const content = useCaseStudiesContent();
  const hero = content.Hero;
  const heroVisible = content._visible.Hero;
  const { data: listHero } = useListPageHero("case-studies");
  const L = listHero?.card_labels ?? {};
  const ALL = L.all_filter ?? "All";
  const [rows, setRows] = useState<CaseStudyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("__all__");


  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("id,title,slug,slug_ar,summary,client_name,industry,cover_image_url,published_at,created_at,translations,category_id,categories(name,slug,translations)")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(100);
      if (cancelled) return;
      if (!error && data) setRows((data as any[]).map((row) => {
        const translatedCategory = locale === "en" ? undefined : row.categories?.translations?.[locale]?.name;
        return {
          ...row,
          category: row.categories
            ? { name: translatedCategory ?? row.categories.name, slug: row.categories.slug }
            : null,
          ...(locale === "en" ? {} : row.translations?.[locale] ?? {}),
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
      else if (r.industry) set.set(`industry:${r.industry}`, r.industry);
    });
    return [{ id: "__all__", label: ALL }, ...Array.from(set, ([id, label]) => ({ id, label }))];
  }, [rows, ALL]);

  const filtered = useMemo(() => {
    if (active === "__all__") return rows;
    return rows.filter((r) => (r.category?.slug ?? (r.industry ? `industry:${r.industry}` : "")) === active);
  }, [rows, active]);


  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Case Studies — Success Stories"
        description="Real-world outcomes from healthcare, ERP, and technology engagements across the region."
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
                <p
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--brand-blue)" }}
                >
                  {hero.eyebrow}
                </p>
              )}
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {hero?.title_prefix ?? "Our"}{" "}
                <span style={{ color: "var(--brand-blue)" }}>
                  {hero?.title_highlight ?? "Case Studies"}
                </span>
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
        <div className="pb-24 text-center text-sm text-muted-foreground">
          {L.loading ?? "Loading case studies…"}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="pb-24 text-center text-sm text-muted-foreground">
          {L.empty ?? "No published case studies yet."}
        </div>
      )}


      <section className="bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {filtered.map((study, idx) => (
              <motion.article
                key={study.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                custom={idx}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <Link to={`${locale === "ar" ? "/ar/دراسات-الحالة" : "/case-studies"}/${(locale === "ar" && study.slug_ar) || study.slug}`} className="flex flex-1 flex-col">
                  <div className="flex flex-col p-6 md:p-8">
                    {(study.category?.name ?? study.industry) && (
                      <span
                        className="listing-category w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--brand-green)",
                          background: "oklch(0.72 0.17 145 / 0.12)",
                        }}
                      >
                        {study.category?.name ?? study.industry}
                      </span>
                    )}
                    <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)] md:text-2xl">
                      {study.title}
                    </h3>
                    {study.summary && (
                      <p className="mt-3 text-sm text-muted-foreground md:text-base">
                        {study.summary}
                      </p>
                    )}
                    <span
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                      style={{ color: "var(--brand-blue)" }}
                    >
                      {L.see_more ?? "See more"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                    </span>
                  </div>
                  <Cover url={study.cover_image_url} className="aspect-[16/9] w-full" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
