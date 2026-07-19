
UPDATE header_footer_settings SET
  header_logo_url = '/__l5e/assets-v1/797d6c11-e7eb-45bf-af08-15f8c393ef79/logo.png',
  header_logo_dark_url = '/__l5e/assets-v1/797d6c11-e7eb-45bf-af08-15f8c393ef79/logo.png',
  footer_logo_url = '/__l5e/assets-v1/797d6c11-e7eb-45bf-af08-15f8c393ef79/logo.png',
  header_bg_color = '#ffffff',
  header_text_color = 'oklch(0.18 0.04 240)',
  header_cta_bg_color = 'oklch(0.62 0.13 230)',
  header_cta_text_color = '#ffffff'
WHERE singleton = true;
