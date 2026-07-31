ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS default_og_image_url text,
  ADD COLUMN IF NOT EXISTS twitter_handle text,
  ADD COLUMN IF NOT EXISTS organization jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ga4_id text,
  ADD COLUMN IF NOT EXISTS gtm_id text,
  ADD COLUMN IF NOT EXISTS meta_pixel_id text,
  ADD COLUMN IF NOT EXISTS linkedin_partner_id text,
  ADD COLUMN IF NOT EXISTS custom_head_html text,
  ADD COLUMN IF NOT EXISTS custom_body_html text;