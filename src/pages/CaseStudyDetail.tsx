import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Briefcase } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";

type CaseStudyDetail = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  client_name: string | null;
  industry: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
  tags: string[] | null;
  translations?: Record<string, Partial<Pick<CaseStudyDetail, "title" | "summary" | "challenge" | "solution" | "results">>> | null;
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
    </div>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      <div className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
        {body}
      </div>
    </section>
  );
}

export default function CaseStudyDetail() {
  const { locale } = useLocale();
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [cs, setCs] = useState<CaseStudyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data } = await supabase
        .from("case_studies")
        .select(
          "id,title,slug,summary,client_name,industry,challenge,solution,results,cover_image_url,published_at,created_at,tags,translations"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (!data) {
        const { data: redirect } = await supabase
          .from("slug_redirects")
          .select("new_slug")
          .eq("entity_type", "case_study")
          .eq("old_slug", slug)
          .maybeSingle();
        if (redirect?.new_slug) {
          navigate(`/case-studies/${redirect.new_slug}`, { replace: true });
          return;
        }
        setNotFound(true);
        setLoading(false);
        return;
      }
      const base = data as CaseStudyDetail;
      setCs({ ...base, ...(locale === "en" ? {} : base.translations?.[locale] ?? {}) });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate, locale]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-40 text-center text-sm text-muted-foreground">
        Loading…
      </main>
    );
  }

  if (notFound || !cs) {
    return (
      <main className="min-h-screen bg-background pt-40 text-center">
        <p className="text-lg font-semibold">Case study not found</p>
        <Link to="/case-studies" className="mt-4 inline-block text-sm text-primary underline">
          Back to all case studies
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title={`${cs.title} — Case Study`}
        description={cs.summary ?? undefined}
        ogImage={cs.cover_image_url ?? undefined}
        ogType="article"
      />

      <section className="relative overflow-hidden bg-background pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All case studies
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-6"
          >
            {cs.industry && (
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  color: "var(--brand-green)",
                  background: "oklch(0.72 0.17 145 / 0.12)",
                }}
              >
                {cs.industry}
              </span>
            )}
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
              {cs.title}
            </h1>
            {cs.summary && (
              <p className="mt-5 text-lg text-muted-foreground">{cs.summary}</p>
            )}

            <div className="mt-6 flex flex-wrap gap-6 text-sm text-muted-foreground">
              {cs.client_name && (
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> {cs.client_name}
                </span>
              )}
              {cs.industry && (
                <span className="inline-flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {cs.industry}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl px-6">
          {cs.cover_image_url ? (
            <img
              src={cs.cover_image_url}
              alt={cs.title}
              className="w-full rounded-3xl border border-border object-cover"
            />
          ) : (
            <CoverPlaceholder className="aspect-[16/8] w-full rounded-3xl" />
          )}
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-6 pb-24 pt-4 md:pb-32">
        {cs.challenge && <Section title="The Challenge" body={cs.challenge} />}
        {cs.solution && <Section title="Our Solution" body={cs.solution} />}
        {cs.results && <Section title="Results" body={cs.results} />}
      </article>

      <Footer />
    </main>
  );
}
