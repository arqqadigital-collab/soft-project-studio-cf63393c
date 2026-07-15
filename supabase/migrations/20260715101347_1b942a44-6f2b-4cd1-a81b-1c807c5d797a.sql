
CREATE TABLE public.homepage_hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  heading_line1 text NOT NULL DEFAULT 'Transforming Complexity',
  heading_line2 text NOT NULL DEFAULT 'Into Digital Clarity',
  subheadline text NOT NULL DEFAULT 'End-to-end digital transformation for modern enterprises and healthcare organizations.',
  cta_label text NOT NULL DEFAULT 'Start Your Digital Transformation',
  cta_href text NOT NULL DEFAULT '/contact',
  background_url text,
  background_type text NOT NULL DEFAULT 'video' CHECK (background_type IN ('video','image')),
  overlay_opacity numeric NOT NULL DEFAULT 0.6 CHECK (overlay_opacity >= 0 AND overlay_opacity <= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_hero TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage_hero TO authenticated;
GRANT ALL ON public.homepage_hero TO service_role;

ALTER TABLE public.homepage_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view homepage hero"
  ON public.homepage_hero FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can insert hero"
  ON public.homepage_hero FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE POLICY "Admins and editors can update hero"
  ON public.homepage_hero FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE TRIGGER homepage_hero_set_updated_at
  BEFORE UPDATE ON public.homepage_hero
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.homepage_hero (singleton) VALUES (true) ON CONFLICT DO NOTHING;
