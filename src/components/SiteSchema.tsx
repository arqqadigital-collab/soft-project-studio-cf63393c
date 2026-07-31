import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";

export type OrganizationSettings = {
  name?: string;
  name_ar?: string;
  legal_name?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  same_as?: string[];
  enabled?: boolean;
};

/** Escape "</script>" so JSON-LD can never break out of its script tag. */
function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * Site-wide Organization + WebSite structured data (schema.org).
 * Mounted once at the app root; per-page JSON-LD from <SeoHead> is additive.
 */
export function SiteSchema() {
  const { locale } = useLocale();
  const { pathname } = useLocation();

  const { data } = useQuery({
    queryKey: ["site-settings-schema"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("site_title, site_title_ar, site_url, site_logo_url, organization")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (pathname.startsWith("/dashboard") || pathname === "/admin" || pathname === "/login") {
    return null;
  }
  if (!data) return null;

  const org = ((data.organization as OrganizationSettings) ?? {}) as OrganizationSettings;
  if (org.enabled === false) return null;

  const isAr = locale === "ar";
  const siteUrl =
    data.site_url?.replace(/\/+$/, "") ||
    (typeof window !== "undefined" ? window.location.origin : "");
  const name =
    (isAr ? org.name_ar : org.name) || org.name || (isAr ? data.site_title_ar : data.site_title) ||
    data.site_title || "";

  if (!name) return null;

  const address =
    org.street || org.city || org.country
      ? {
          "@type": "PostalAddress",
          streetAddress: org.street || undefined,
          addressLocality: org.city || undefined,
          addressRegion: org.region || undefined,
          postalCode: org.postal_code || undefined,
          addressCountry: org.country || undefined,
        }
      : undefined;

  const organization: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    legalName: org.legal_name || undefined,
    url: siteUrl || undefined,
    logo: org.logo_url || data.site_logo_url || undefined,
    email: org.email || undefined,
    telephone: org.phone || undefined,
    address,
    sameAs: (org.same_as ?? []).filter(Boolean).length ? org.same_as!.filter(Boolean) : undefined,
  };

  const website: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: siteUrl || undefined,
    inLanguage: isAr ? "ar" : "en",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{safeJson(organization)}</script>
      <script type="application/ld+json">{safeJson(website)}</script>
    </Helmet>
  );
}
