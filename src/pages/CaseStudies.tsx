import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { useCaseStudiesContent } from "@/lib/caseStudiesContent";

type CaseStudyRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  client_name: string | null;
  industry: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
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
  const content = useCaseStudiesContent();
  const hero = content.Hero;
  const heroVisible = content._visible.Hero;
  const [rows, setRows] = useState<CaseStudyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("id,title,slug,summary,client_name,industry,cover_image_url,published_at,created_at")
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(100);
      if (cancelled) return;
      if (!error && data) setRows(data as CaseStudyRow[]);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => r.industry && set.add(r.industry));
    return ["All", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    if (active === "All") return rows;
    return rows.filter((r) => (r.industry ?? "") === active);
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
                className="mt-10 flex flex-wrap items-center justify-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                      active === cat
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-card-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {loading && (
        <div className="pb-24 text-center text-sm text-muted-foreground">
          Loading case studies…
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="pb-24 text-center text-sm text-muted-foreground">
          No published case studies yet.
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
                <Link to={`/case-studies/${study.slug}`} className="flex flex-1 flex-col">
                  <div className="flex flex-col p-6 md:p-8">
                    {study.industry && (
                      <span
                        className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color: "var(--brand-green)",
                          background: "oklch(0.72 0.17 145 / 0.12)",
                        }}
                      >
                        {study.industry}
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
                      See more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
