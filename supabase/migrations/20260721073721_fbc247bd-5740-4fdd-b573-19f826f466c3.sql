ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS site_title_ar text,
  ADD COLUMN IF NOT EXISTS site_description_ar text,
  ADD COLUMN IF NOT EXISTS default_meta_title_ar text,
  ADD COLUMN IF NOT EXISTS default_meta_description_ar text;