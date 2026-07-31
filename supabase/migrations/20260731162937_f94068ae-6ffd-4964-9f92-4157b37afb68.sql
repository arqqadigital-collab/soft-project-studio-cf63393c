ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS google_site_verification text,
  ADD COLUMN IF NOT EXISTS clarity_project_id text,
  ADD COLUMN IF NOT EXISTS site_alternate_name text;