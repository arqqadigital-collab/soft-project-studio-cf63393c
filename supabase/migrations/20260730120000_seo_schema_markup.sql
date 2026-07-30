-- Lets each page/post/case study/event carry custom Schema.org JSON-LD
-- structured data, entered via the SEO editor and rendered through
-- <SeoHead jsonLd=...>.
ALTER TABLE public.seo_meta ADD COLUMN IF NOT EXISTS schema_markup jsonb;
