UPDATE public.homepage_hero SET heading_line2_from = '#2a8fc4', heading_line2_to = '#63c47f', cta_bg_from = '#2a8fc4', cta_bg_to = '#63c47f' WHERE singleton = true;

ALTER TABLE public.homepage_hero ALTER COLUMN heading_line2_from SET DEFAULT '#2a8fc4';
ALTER TABLE public.homepage_hero ALTER COLUMN heading_line2_to SET DEFAULT '#63c47f';
ALTER TABLE public.homepage_hero ALTER COLUMN cta_bg_from SET DEFAULT '#2a8fc4';
ALTER TABLE public.homepage_hero ALTER COLUMN cta_bg_to SET DEFAULT '#63c47f';