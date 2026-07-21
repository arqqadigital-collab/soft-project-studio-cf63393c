import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar as arLocale } from "date-fns/locale";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
import { logPageView } from "@/lib/analytics";
import { sanitizeHtml } from "@/lib/sanitize";
import { useLocale } from "@/i18n/LanguageProvider";
import { useSetAltLanguagePath } from "@/i18n/AltLanguagePath";
import { useListPageHero } from "@/hooks/use-list-page-hero";


type PostDetail = {
  id: string;
  title: string;
  slug: string;
  slug_ar?: string | null;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string; translations?: Record<string, { name?: string }> | null } | null;
  author: { full_name: string | null } | null;
  translations?: Record<string, Partial<Pick<PostDetail, "title" | "content" | "excerpt">>> | null;
};

type SeoMeta = {
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  noindex: boolean | null;
  nofollow: boolean | null;
  translations?: any;
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

function readTimeMinutes(content: string | null) {
  const words = (content ?? "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
}


export default function ArticleDetail() {
  const { locale } = useLocale();
  const { data: hero } = useListPageHero("blog");
  const L = hero?.card_labels ?? {};
  const params = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const slug = params.slug ?? "";
  const [post, setPost] = useState<PostDetail | null>(null);
  const [seo, setSeo] = useState<SeoMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSetAltLanguagePath({
    en: post ? `/blog/${post.slug}` : null,
    ar: post ? `/ar/المدونة/${post.slug_ar || post.slug}` : null,
  });


  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id,title,slug,slug_ar,content,excerpt,featured_image_url,published_at,created_at,translations,category:categories(name,slug,translations),author:profiles!posts_author_id_fkey(full_name)"
        )
        .or(typeof window !== "undefined" && window.location.pathname.startsWith("/ar/") ? `slug_ar.eq.${slug},slug.eq.${slug}` : `slug.eq.${slug}`)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        // Try slug redirect
        const { data: redirect } = await supabase
          .from("slug_redirects")
          .select("new_slug")
          .eq("entity_type", "post")
          .eq("old_slug", slug)
          .maybeSingle();
        if (redirect?.new_slug && !cancelled) {
          navigate(`/blog/${redirect.new_slug}`, { replace: true });
          return;
        }
        setNotFound(true);
        setLoading(false);
        return;
      }
      const base = data as unknown as PostDetail;
      const translated = locale === "en" ? null : base.translations?.[locale];
      const catTr = locale !== "en" ? base.category?.translations?.[locale]?.name : undefined;
      const p = {
        ...base,
        ...(translated ?? {}),
        category: base.category ? { ...base.category, name: catTr ?? base.category.name } : null,
      } as PostDetail;
      setPost(p);

      const { data: seoRow } = await supabase
        .from("seo_meta")
        .select("meta_title,meta_description,og_image_url,canonical_url,noindex,nofollow,translations")
        .eq("entity_type", "post")
        .eq("entity_id", p.id)
        .maybeSingle();
      if (!cancelled) setSeo((seoRow as SeoMeta | null) ?? null);

      logPageView("post", p.id);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate, locale]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-foreground">{L.detail_not_found_title || "Article not found"}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {L.detail_not_found_desc || "This article doesn't exist or hasn't been published yet."}
          </p>
          <Link
            to={locale === "ar" ? "/ar/المدونة" : "/blog"}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> {L.detail_back || "Back to Blog"}
          </Link>
        </div>
      </main>
    );
  }


  const seoAr = (seo?.translations as any)?.ar || {};
  const title = (locale === "ar" ? seoAr.meta_title : null) || seo?.meta_title || post.title;
  const description = (locale === "ar" ? seoAr.meta_description : null) || seo?.meta_description || post.excerpt || undefined;
  const ogImage = seo?.og_image_url || post.featured_image_url || undefined;
  const canonical = seo?.canonical_url || undefined;
  const publishedDate = post.published_at ?? post.created_at;

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={description}
        canonical={canonical}
        ogImage={ogImage}
        ogType="article"
        noindex={!!seo?.noindex}
        nofollow={!!seo?.nofollow}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: description,
          image: ogImage,
          datePublished: publishedDate,
          author: post.author?.full_name
            ? { "@type": "Person", name: post.author.full_name }
            : undefined,
        }}
      />

      <section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-start"
          >
            <Link
              to={locale === "ar" ? "/ar/المدونة" : "/blog"}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {L.detail_back || "Back to Blog"}
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {post.category && (
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{
                    color: "var(--brand-blue)",
                    background: "oklch(0.62 0.13 230 / 0.1)",
                  }}
                >
                  {post.category.name}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(publishedDate), "MMMM d, yyyy", locale === "ar" ? { locale: arLocale } : undefined)}
              </span>
            </div>

            <h1 className="mt-5 text-start text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

          </motion.div>
        </div>
      </section>

      <section className="pt-10 md:pt-14">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-3xl"
          >
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="aspect-[16/9] w-full object-cover"
              />
            ) : (
              <CoverPlaceholder className="aspect-[16/9] w-full" />
            )}
          </motion.div>
        </div>
      </section>

      <article className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          {post.content ? (
            <div
              className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-[var(--brand-blue)]"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          ) : (
            <p className="text-muted-foreground">{L.detail_no_content || "No content."}</p>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
