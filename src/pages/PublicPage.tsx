import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
import { logPageView } from "@/lib/analytics";
import { PageRenderer, usePageSections } from "@/components/PageRenderer";
import { sanitizeHtml } from "@/lib/sanitize";
import { useLocale } from "@/i18n/LanguageProvider";

type PageDetail = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  featured_image_url: string | null;
  template: "default" | "full-width" | "landing";
  created_at: string;
  updated_at: string;
  translations?: any;
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

export default function PublicPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<PageDetail | null>(null);
  const [seo, setSeo] = useState<SeoMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      // Try slug_ar first when arriving from Arabic route, otherwise slug.
      const isAr = typeof window !== "undefined" && window.location.pathname.startsWith("/ar/");
      let { data, error } = await supabase
        .from("pages")
        .select("id,title,slug,content,featured_image_url,template,created_at,updated_at,translations")
        .or(isAr ? `slug_ar.eq.${slug},slug.eq.${slug}` : `slug.eq.${slug}`)
        .eq("status", "published")
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        const { data: redirect } = await supabase
          .from("slug_redirects")
          .select("new_slug")
          .eq("entity_type", "page")
          .eq("old_slug", slug)
          .maybeSingle();
        if (redirect?.new_slug && !cancelled) {
          navigate(`/p/${redirect.new_slug}`, { replace: true });
          return;
        }
        setNotFound(true);
        setLoading(false);
        return;
      }
      const p = data as PageDetail;
      setPage(p);

      const { data: seoRow } = await supabase
        .from("seo_meta")
        .select("meta_title,meta_description,og_image_url,canonical_url,noindex,nofollow,translations")
        .eq("entity_type", "page")
        .eq("entity_id", p.id)
        .maybeSingle();
      if (!cancelled) setSeo((seoRow as SeoMeta | null) ?? null);

      logPageView("page", p.id);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </main>
    );
  }

  if (notFound || !page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-foreground">Page not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            This page doesn't exist or hasn't been published yet.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Go home
          </Link>
        </div>
      </main>
    );
  }

  const title = seo?.meta_title || page.title;
  const description = seo?.meta_description || undefined;
  const ogImage = seo?.og_image_url || page.featured_image_url || undefined;
  const canonical = seo?.canonical_url || undefined;

  return <RenderedPage page={page} seo={seo} />;
}

function RenderedPage({ page, seo }: { page: PageDetail; seo: SeoMeta | null }) {
  const sections = usePageSections(page.id);
  const hasSections = (sections.data ?? []).length > 0;
  const { locale } = useLocale();
  const ar = (seo?.translations as any)?.ar || {};
  const pageAr = (page.translations as any)?.ar || {};
  const displayTitle = locale === "ar" && pageAr.title ? pageAr.title : page.title;
  const title = (locale === "ar" ? ar.meta_title : null) || seo?.meta_title || displayTitle;
  const description = (locale === "ar" ? ar.meta_description : null) || seo?.meta_description || undefined;
  const ogImage = seo?.og_image_url || page.featured_image_url || undefined;
  const canonical = seo?.canonical_url || undefined;

  const isLanding = page.template === "landing";
  const isFullWidth = page.template === "full-width";
  const containerClass = isFullWidth || isLanding ? "max-w-none" : "max-w-3xl";

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title={title}
        description={description}
        canonical={canonical}
        ogImage={ogImage}
        ogType="website"
        noindex={!!seo?.noindex}
        nofollow={!!seo?.nofollow}
      />

      {hasSections ? (
        <PageRenderer pageId={page.id} />
      ) : (
        <>
          <section className={isLanding ? "pt-24" : "pt-32 md:pt-40"}>
            <div className={`mx-auto ${containerClass} px-6`}>
              {!isLanding && (
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  {displayTitle}
                </h1>
              )}
              {page.featured_image_url && !isLanding && (
                <img
                  src={page.featured_image_url}
                  alt={displayTitle}
                  className="mt-8 aspect-[16/9] w-full rounded-3xl object-cover"
                />
              )}
            </div>
          </section>

          <article className="py-12 md:py-16">
            <div className={`mx-auto ${containerClass} px-6`}>
              {page.content ? (
                <div
                  className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-[var(--brand-blue)]"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
                />
              ) : (
                <p className="text-muted-foreground">No content.</p>
              )}
            </div>
          </article>
        </>
      )}

      <Footer />
    </main>
  );
}
