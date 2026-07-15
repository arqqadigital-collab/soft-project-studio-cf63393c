CREATE TABLE public.homepage_sections (
  section_key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read homepage sections"
  ON public.homepage_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors manage homepage sections"
  ON public.homepage_sections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.homepage_sections (section_key, content) VALUES
('expertise', '{}'::jsonb),
('process', '{}'::jsonb),
('services', '{}'::jsonb),
('promise', '{}'::jsonb),
('stats', '{}'::jsonb),
('clients', '{}'::jsonb),
('success_stories', '{}'::jsonb),
('partners', '{}'::jsonb),
('cta', '{}'::jsonb);