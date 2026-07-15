import { Helmet } from "react-helmet-async";

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
  const url =
    canonical ??
    (typeof window !== "undefined" ? window.location.href : undefined);

  const robotsParts: string[] = [];
  if (noindex) robotsParts.push("noindex"); else robotsParts.push("index");
  if (nofollow) robotsParts.push("nofollow"); else robotsParts.push("follow");
  const robots = robotsParts.join(", ");

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}
      <meta name="robots" content={robots} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      <meta name="twitter:card" content={ogImage ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
