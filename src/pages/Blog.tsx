import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ar as arLocale } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
import { Helmet } from "react-helmet-async";
import { useBlogContent } from "@/lib/blogContent";
import { useLocale } from "@/i18n/LanguageProvider";
import { useListPageHero } from "@/hooks/use-list-page-hero";


type PostRow = {
  id: string;
  title: string;
  slug: string;
  slug_ar: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string; translations?: Record<string, { name?: string }> | null } | null;
  author: { full_name: string | null } | null;
  translations?: Record<string, Partial<Pick<PostRow, "title" | "excerpt">>> | null;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" as const },
  }),
};

function initialsOf(name: string | null | undefined) {
  if (!name) return "??";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function readTimeFor(excerpt: string | null, minReadSuffix: string) {
  const words = (excerpt ?? "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(3, Math.ceil(words / 200));
  return `${minutes} ${minReadSuffix}`;
}


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

function AuthorBadge({ name }: { name: string | null | undefined }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {initialsOf(name)}
      </div>
      <div>
        <p className="text-sm font-medium text-card-foreground">{name ?? "Author"}</p>
      </div>
    </div>
  );
}

function CardMeta({ date }: { date: string }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5" />
        {date}
      </span>
    </div>
  );
}


export default function Blog() {
  const { locale } = useLocale();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const content = useBlogContent();
  const { data: listHero } = useListPageHero("blog");
  const L = listHero?.card_labels ?? {};
  const ALL = L.all_filter ?? "All";
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const hero = content.Hero;
  const heroVisible = content._visible.Hero;


  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id,title,slug,slug_ar,excerpt,featured_image_url,published_at,created_at,translations,category:categories(name,slug,translations),author:profiles!posts_author_id_fkey(full_name)"
        )
        .eq("status", "published")
        .order("published_at", { ascending: false, nullsFirst: false })
        .limit(50);
      if (cancelled) return;
      if (!error && data) {
        setPosts((data as unknown as PostRow[]).map((post) => {
          const catAr = locale !== "en" ? post.category?.translations?.[locale]?.name : undefined;
          return {
            ...post,
            ...(locale === "en" ? {} : post.translations?.[locale] ?? {}),
            category: post.category ? { ...post.category, name: catAr ?? post.category.name } : null,
          };
        }));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    posts.forEach((p) => {
      if (p.category) set.set(p.category.slug, p.category.name);
    });
    return [ALL, ...Array.from(set.values())];
  }, [posts, ALL]);

  const filtered = useMemo(() => {
    if (activeCategory === ALL) return posts;
    return posts.filter((p) => p.category?.name === activeCategory);
  }, [posts, activeCategory, ALL]);


  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="Blog — Insights & Updates"
        description="Thought leadership, industry trends, and practical guidance for healthcare, ERP, and technology leaders."
        ogType="website"
      />
      <Helmet>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Blog RSS"
          href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss`}
        />
      </Helmet>

      {/* Hero */}
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
              <span style={{ color: "var(--brand-blue)" }}>{hero?.title_highlight ?? "Blog"}</span>
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
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`listing-category-filter rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    activeCategory === cat
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
          {L.loading ?? (locale === "ar" ? "جارٍ تحميل المقالات…" : "Loading articles…")}
        </div>
      )}

      {!loading && !featured && (
        <div className="pb-24 text-center text-sm text-muted-foreground">
          {L.empty ?? (locale === "ar" ? "لا توجد مقالات منشورة بعد." : "No published articles yet.")}
        </div>
      )}


      {/* Featured post */}
      {featured && (
        <section className="bg-background pb-16 md:pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <motion.article
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="grid lg:grid-cols-2">
                <Cover url={featured.featured_image_url} className="h-72 lg:h-auto" />
                <div className="flex flex-col justify-center p-8 md:p-12">
                  {featured.category && (
                    <span
                    className="listing-category w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                      style={{
                        color: "var(--brand-blue)",
                        background: "oklch(0.62 0.13 230 / 0.1)",
                      }}
                    >
                      {featured.category.name}
                    </span>
                  )}
                  <h2 className="mt-5 text-2xl font-bold leading-tight text-card-foreground md:text-3xl lg:text-4xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>
                  )}
                  <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
                    <CardMeta
                      date={format(
                        new Date(featured.published_at ?? featured.created_at),
                        "MMMM d, yyyy",
                        locale === "ar" ? { locale: arLocale } : undefined
                      )}
                    />
                  </div>

                  <div className="mt-8">
                    <Button asChild className="group/btn inline-flex items-center gap-2">
                      <Link to={`${locale === "ar" ? "/ar/المدونة" : "/blog"}/${(locale === "ar" && featured.slug_ar) || featured.slug}`}>
                        {L.read_more ?? (locale === "ar" ? "اقرأ المقال" : "Read Article")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 rtl:rotate-180" />
                      </Link>
                    </Button>
                  </div>

                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Blog grid */}
      {rest.length > 0 && (
        <section className="bg-background pb-24 md:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">{L.latest_heading ?? (locale === "ar" ? "أحدث المقالات" : "Latest Articles")}</h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, idx) => (
                <motion.article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  custom={idx}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <Link to={`${locale === "ar" ? "/ar/المدونة" : "/blog"}/${(locale === "ar" && post.slug_ar) || post.slug}`} className="flex flex-1 flex-col">
                    <Cover url={post.featured_image_url} className="aspect-[16/10] w-full" />
                    <div className="flex flex-1 flex-col p-6">
                      {post.category && (
                        <span
                          className="listing-category w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                          style={{
                            color: "var(--brand-blue)",
                            background: "oklch(0.62 0.13 230 / 0.1)",
                          }}
                        >
                          {post.category.name}
                        </span>
                      )}
                      <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)]">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                      )}
                      <div className="mt-6 flex flex-wrap items-center justify-end gap-4 border-t border-border pt-5">
                        <CardMeta
                          date={format(
                            new Date(post.published_at ?? post.created_at),
                            "MMM d, yyyy",
                            locale === "ar" ? { locale: arLocale } : undefined
                          )}
                        />
                      </div>

                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
