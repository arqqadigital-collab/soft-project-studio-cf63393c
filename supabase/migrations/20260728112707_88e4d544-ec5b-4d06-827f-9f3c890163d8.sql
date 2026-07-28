ALTER TABLE public.header_footer_settings
ADD COLUMN IF NOT EXISTS footer_copyright_link_text text,
ADD COLUMN IF NOT EXISTS footer_copyright_url text;