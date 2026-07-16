CREATE TABLE public.nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.nav_sections(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  item_type text NOT NULL DEFAULT 'internal',
  position integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.nav_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nav_items TO authenticated;
GRANT ALL ON public.nav_items TO service_role;

ALTER TABLE public.nav_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nav_items public read"
ON public.nav_items
FOR SELECT
USING (true);

CREATE POLICY "nav_items admin write"
ON public.nav_items
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER nav_items_set_updated_at
BEFORE UPDATE ON public.nav_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX nav_items_section_id_position_idx
ON public.nav_items(section_id, position);