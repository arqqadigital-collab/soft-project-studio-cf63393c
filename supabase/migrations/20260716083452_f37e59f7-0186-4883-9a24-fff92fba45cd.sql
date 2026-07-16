
CREATE TABLE public.list_page_hero (
  page_key text PRIMARY KEY,
  eyebrow text,
  title_prefix text,
  title_highlight text,
  description text,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.list_page_hero TO anon, authenticated;
GRANT ALL ON public.list_page_hero TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.list_page_hero TO authenticated;

ALTER TABLE public.list_page_hero ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read list_page_hero" ON public.list_page_hero
  FOR SELECT USING (true);

CREATE POLICY "Admin/editor write list_page_hero" ON public.list_page_hero
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER list_page_hero_updated_at
BEFORE UPDATE ON public.list_page_hero
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.list_page_hero (page_key, eyebrow, title_prefix, title_highlight, description) VALUES
('blog', 'Insights & Updates', 'Our', 'Blog',
 'Thought leadership, industry trends, and practical guidance for healthcare, ERP, and technology leaders.'),
('case-studies', 'Success Stories', 'Our', 'Case Studies',
 'Real-world outcomes from healthcare, ERP, and technology engagements across the region.'),
('events', 'Learn, Connect, Grow', 'Events &', 'Webinars',
 'Live sessions, workshops, and executive roundtables designed for healthcare, ERP, and technology leaders across the region.');
