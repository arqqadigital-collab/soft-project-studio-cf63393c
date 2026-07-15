
CREATE TABLE public.case_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT,
  industry TEXT,
  summary TEXT,
  challenge TEXT,
  solution TEXT,
  results TEXT,
  cover_image_url TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status public.post_status NOT NULL DEFAULT 'draft',
  author_id UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published case studies"
  ON public.case_studies FOR SELECT
  USING (status = 'published');

CREATE POLICY "Editors can view all case studies"
  ON public.case_studies FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors manage case studies"
  ON public.case_studies FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER case_studies_set_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER case_studies_set_published_at
  BEFORE INSERT OR UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

CREATE TYPE public.event_type AS ENUM ('webinar', 'conference', 'workshop', 'meetup', 'other');

CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  event_type public.event_type NOT NULL DEFAULT 'webinar',
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  location TEXT,
  virtual_link TEXT,
  registration_url TEXT,
  cover_image_url TEXT,
  status public.post_status NOT NULL DEFAULT 'draft',
  author_id UUID,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published events"
  ON public.events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Editors can view all events"
  ON public.events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors manage events"
  ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER events_set_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER events_set_published_at
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

CREATE TABLE public.header_footer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  header_logo_url TEXT,
  header_cta_label TEXT,
  header_cta_url TEXT,
  header_show_menus BOOLEAN NOT NULL DEFAULT true,
  footer_logo_url TEXT,
  footer_tagline TEXT,
  footer_columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  footer_social JSONB NOT NULL DEFAULT '[]'::jsonb,
  footer_copyright TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.header_footer_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.header_footer_settings TO authenticated;
GRANT ALL ON public.header_footer_settings TO service_role;

ALTER TABLE public.header_footer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read header/footer"
  ON public.header_footer_settings FOR SELECT
  USING (true);

CREATE POLICY "Editors manage header/footer"
  ON public.header_footer_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER header_footer_set_updated_at
  BEFORE UPDATE ON public.header_footer_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.header_footer_settings (singleton) VALUES (true);
