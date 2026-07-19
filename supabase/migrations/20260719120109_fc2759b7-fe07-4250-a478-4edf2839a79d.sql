UPDATE public.header_footer_settings
SET header_bg_color = NULL,
    header_text_color = NULL,
    header_cta_bg_color = NULL,
    header_cta_text_color = NULL
WHERE singleton = true;