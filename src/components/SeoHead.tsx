import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { findCounterpart, isArabicPath } from "@/lib/routeMap";

export type SeoHeadProps = {
  title: string;
  description?: string | null;
  canonical?: string | null;
  ogImage?: string | null;
  ogType?: "website" | "article";
  noindex?: boolean;
  nofollow?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noindex,
  nofollow,
  jsonLd,
}: SeoHeadProps) {
  const { pathname } = useLocation();
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const url = canonical ?? (origin ? `${origin}${pathname}` : undefined);

  const arRel = findCounterpart(pathname, "ar");
  const enRel = findCounterpart(pathname, "en");
  const arUrl = arRel && origin ? `${origin}${arRel}` : null;
  const enUrl = enRel && origin ? `${origin}${enRel}` : null;
  const isAr = isArabicPath(pathname);

  const robotsParts: string[] = [];
  if (noindex) robotsParts.push("noindex"); else robotsParts.push("index");
  if (nofollow) robotsParts.push("nofollow"); else robotsParts.push("follow");
  const robots = robotsParts.join(", ");

  return (
    <Helmet>
      <html lang={isAr ? "ar" : "en"} dir={isAr ? "rtl" : "ltr"} />
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      {enUrl && <link rel="alternate" hrefLang="en" href={enUrl} />}
      {arUrl && <link rel="alternate" hrefLang="ar" href={arUrl} />}
      {enUrl && <link rel="alternate" hrefLang="x-default" href={enUrl} />}
      <meta name="robots" content={robots} />

      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={isAr ? "ar_AR" : "en_US"} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026")
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029")}
        </script>
      )}
    </Helmet>
  );
}

