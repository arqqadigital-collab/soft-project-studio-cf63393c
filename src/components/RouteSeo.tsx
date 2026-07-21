import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";
import { findCounterpart } from "@/lib/routeMap";

/**
 * Global route-level SEO. Matches the current pathname against pages.slug
 * (or pages.slug_ar) and applies any seo_meta overrides saved via the
 * "Page Titles" dashboard. Mounted once in App.tsx; per-page <SeoHead>
 * still wins because it mounts later.
 */
export function RouteSeo() {
  const { pathname } = useLocation();
  const { locale } = useLocale();

  const isAr = pathname === "/ar" || pathname.startsWith("/ar/");
  // Resolve to the EN path so we can match pages.slug reliably even when
  // the user is on an Arabic-translated URL.
  const enPath = isAr ? findCounterpart(pathname, "en") : pathname;
  const inner = (enPath || "/").slice(1);
  const decoded = (() => {
    try { return decodeURI(inner); } catch { return inner; }
  })();
  const key = decoded.replace(/\/+$/g, "").replace(/\//g, "-");

  const { data } = useQuery({
    queryKey: ["route-seo", key, isAr],
    enabled: !!key,
    staleTime: 60_000,
    queryFn: async () => {
      const { data: page } = await supabase
        .from("pages")
        .select("id, translations")
        .or(`slug.eq.${key},slug_ar.eq.${key}`)
        .maybeSingle();
      if (!page) return null;
      const { data: seo } = await supabase
        .from("seo_meta")
        .select("meta_title, meta_description, translations")
        .eq("entity_type", "page")
        .eq("entity_id", page.id)
        .maybeSingle();
      return { page, seo };
    },
  });

  if (!data?.seo) return null;
  const ar = ((data.seo.translations as any) ?? {}).ar ?? {};
  const title = locale === "ar"
    ? ar.meta_title || data.seo.meta_title
    : data.seo.meta_title || ar.meta_title;
  const description = locale === "ar"
    ? ar.meta_description || data.seo.meta_description
    : data.seo.meta_description || ar.meta_description;

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta name="description" content={description} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
    </Helmet>
  );
}
