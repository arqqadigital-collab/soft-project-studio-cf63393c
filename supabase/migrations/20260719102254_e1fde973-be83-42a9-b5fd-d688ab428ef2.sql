
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS primary_color TEXT,
  ADD COLUMN IF NOT EXISTS accent_color TEXT,
  ADD COLUMN IF NOT EXISTS brand_dark_color TEXT,
  ADD COLUMN IF NOT EXISTS border_radius TEXT,
  ADD COLUMN IF NOT EXISTS heading_font TEXT,
  ADD COLUMN IF NOT EXISTS body_font TEXT,
  ADD COLUMN IF NOT EXISTS logo_dark_url TEXT,
  ADD COLUMN IF NOT EXISTS og_image_url TEXT;
