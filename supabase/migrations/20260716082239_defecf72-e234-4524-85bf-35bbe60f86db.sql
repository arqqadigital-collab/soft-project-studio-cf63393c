
ALTER TABLE public.header_footer_settings
  ADD COLUMN IF NOT EXISTS header_bg_color text,
  ADD COLUMN IF NOT EXISTS header_text_color text,
  ADD COLUMN IF NOT EXISTS header_cta_bg_color text,
  ADD COLUMN IF NOT EXISTS header_cta_text_color text;
