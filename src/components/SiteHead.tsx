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
          "site_title, site_title_ar, site_description, site_description_ar, favicon_url"
        )
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

  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={title} />
      {description ? (
        <meta property="og:description" content={description} />
      ) : null}
      {data?.favicon_url ? (
        <link rel="icon" href={data.favicon_url} />
      ) : null}
    </Helmet>
  );
}
