
ALTER TABLE public.header_footer_settings
  ADD COLUMN IF NOT EXISTS header_logo_dark_url text,
  ADD COLUMN IF NOT EXISTS header_logo_height integer NOT NULL DEFAULT 56,
  ADD COLUMN IF NOT EXISTS header_show_brand_text boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS header_brand_text text,
  ADD COLUMN IF NOT EXISTS header_cta_variant text NOT NULL DEFAULT 'gradient',
  ADD COLUMN IF NOT EXISTS header_sticky boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS header_transparent_on_hero boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS header_shadow_style text NOT NULL DEFAULT 'soft',
  ADD COLUMN IF NOT EXISTS header_show_locale_switcher boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS header_locales jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mobile_menu_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS mobile_show_social boolean NOT NULL DEFAULT true;
