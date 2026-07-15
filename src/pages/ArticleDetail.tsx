import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
import { logPageView } from "@/lib/analytics";

type PostDetail = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
  author: { full_name: string | null } | null;
};

type SeoMeta = {
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
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

function readTimeFor(content: string | null) {
  const words = (content ?? "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 200))} Min Read`;
}

export default function ArticleDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const [post, setPost] = useState<PostDetail | null>(null);
  const [seo, setSeo] = useState<SeoMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id,title,slug,content,excerpt,featured_image_url,published_at,created_at,category:categories(name,slug),author:profiles!posts_author_id_fkey(full_name)"
        )
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const p = data as unknown as PostDetail;
      setPost(p);

      const { data: seoRow } = await supabase
        .from("seo_meta")
        .select("meta_title,meta_description,og_image_url,canonical_url")
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
  }, [slug]);

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
          <h1 className="text-4xl font-bold text-foreground">Article not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This article doesn't exist or hasn't been published yet.
          </p>
          <Link
            to="/blog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const title = seo?.meta_title || post.title;
  const description = seo?.meta_description || post.excerpt || undefined;
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
            className="text-left"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
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
                {format(new Date(publishedDate), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {readTimeFor(post.content)}
              </span>
            </div>

            <h1 className="mt-5 text-left text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.author?.full_name && (
              <p className="mt-4 text-sm text-muted-foreground">By {post.author.full_name}</p>
            )}
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
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-muted-foreground">No content.</p>
          )}
        </div>
      </article>

      <Footer />
    </main>
  );
}
