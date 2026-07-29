ALTER TABLE public.slug_redirects DROP CONSTRAINT IF EXISTS slug_redirects_entity_type_check;
ALTER TABLE public.slug_redirects
  ADD CONSTRAINT slug_redirects_entity_type_check
  CHECK (entity_type IN ('post','page','case_study','event','path'));
CREATE UNIQUE INDEX IF NOT EXISTS slug_redirects_type_old_slug_key
  ON public.slug_redirects(entity_type, old_slug);