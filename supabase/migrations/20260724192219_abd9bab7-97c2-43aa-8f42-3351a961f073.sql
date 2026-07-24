ALTER TABLE public.header_footer_settings
  ADD COLUMN IF NOT EXISTS header_cta_new_tab boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mobile_show_menu_tree boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS mobile_drawer_title text;