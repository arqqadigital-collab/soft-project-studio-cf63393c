ALTER TABLE public.header_footer_settings
  ADD COLUMN IF NOT EXISTS mobile_drawer_side text NOT NULL DEFAULT 'end',
  ADD COLUMN IF NOT EXISTS mobile_drawer_width_pct int NOT NULL DEFAULT 86,
  ADD COLUMN IF NOT EXISTS mobile_drawer_bg_color text,
  ADD COLUMN IF NOT EXISTS mobile_drawer_text_color text,
  ADD COLUMN IF NOT EXISTS mobile_show_cta boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS mobile_show_lang boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS mobile_show_logo boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS mobile_more_label text NOT NULL DEFAULT 'More',
  ADD COLUMN IF NOT EXISTS mobile_default_expanded boolean NOT NULL DEFAULT false;