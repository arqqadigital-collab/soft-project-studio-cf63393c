ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS heading_font_ar text DEFAULT 'Cairo',
  ADD COLUMN IF NOT EXISTS body_font_ar text DEFAULT 'Cairo';

UPDATE public.site_settings
SET heading_font_ar = COALESCE(heading_font_ar, 'Cairo'),
    body_font_ar = COALESCE(body_font_ar, 'Cairo');