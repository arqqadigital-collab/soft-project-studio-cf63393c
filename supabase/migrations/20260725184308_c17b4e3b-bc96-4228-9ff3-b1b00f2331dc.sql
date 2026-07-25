
CREATE OR REPLACE VIEW public.contact_page_public
WITH (security_invoker=on) AS
SELECT id, singleton, hero_eyebrow, hero_headline, hero_subheadline, hero_background_url,
       hero_cta_label, hero_cta_href, form_heading, form_subheading, form_submit_label,
       quick_info, offices_heading, offices_subheading, translations, created_at, updated_at
FROM public.contact_page;

GRANT SELECT ON public.contact_page_public TO anon, authenticated;

DROP POLICY IF EXISTS "Contact page is public readable" ON public.contact_page;
REVOKE SELECT ON public.contact_page FROM anon;

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS notified_at timestamptz;
