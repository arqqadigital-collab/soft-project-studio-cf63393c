import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useFaqItems } from "@/lib/faqSchemaStore";

/** Escape "</script>" so JSON-LD can never break out of its script tag. */
function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * FAQPage structured data, generated automatically from FAQ sections the
 * current page actually renders (page builder `faq` sections and coded pages
 * with an "FAQ" section). Emits nothing when the page has no FAQ.
 */
export function FaqSchema() {
  const { pathname } = useLocation();
  const items = useFaqItems();

  const isPrivate =
    pathname.startsWith("/dashboard") || pathname === "/admin" || pathname === "/login";
  if (isPrivate || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{safeJson(schema)}</script>
    </Helmet>
  );
}
