import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";

/**
 * Global <head> defaults sourced from site_settings.
 * Mounted once at the app root. Per-page <SeoHead> mounts later and
 * overrides these via react-helmet-async's dedupe (last-mounted wins for
 * <title>, name/property meta tags).
 */
export function SiteHead() {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["site-settings-head"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "site_title, site_title_ar, site_description, site_description_ar, favicon_url, default_og_image_url, og_image_url, twitter_handle, site_url"
        )
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const isAr = locale === "ar";
  const title =
    (isAr ? data?.site_title_ar : data?.site_title) ||
    data?.site_title ||
    "SBS";
  const description =
    (isAr ? data?.site_description_ar : data?.site_description) ||
    data?.site_description ||
    "";
  const ogImage = data?.default_og_image_url || data?.og_image_url || "";
  const twitter = data?.twitter_handle?.trim()
    ? data.twitter_handle.trim().startsWith("@")
      ? data.twitter_handle.trim()
      : `@${data.twitter_handle.trim()}`
    : "";

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:site_name" content={title} />
      <meta property="og:locale" content={isAr ? "ar_AR" : "en_US"} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      {twitter ? <meta name="twitter:site" content={twitter} /> : null}
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}
      {data?.favicon_url ? (
        <link rel="icon" href={data.favicon_url} />
      ) : null}
    </Helmet>
  );
}
