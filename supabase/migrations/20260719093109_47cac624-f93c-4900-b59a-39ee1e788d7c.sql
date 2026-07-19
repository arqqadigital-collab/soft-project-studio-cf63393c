
CREATE TABLE public.menu_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id uuid NOT NULL REFERENCES public.menu_columns(id) ON DELETE CASCADE,
  label text NOT NULL,
  url text NOT NULL,
  target text NOT NULL DEFAULT '_self',
  position integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_links TO authenticated;
GRANT ALL ON public.menu_links TO service_role;

ALTER TABLE public.menu_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Menu links are viewable by everyone"
  ON public.menu_links FOR SELECT USING (true);

CREATE POLICY "Admins manage menu links"
  ON public.menu_links FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX menu_links_column_position_idx ON public.menu_links(column_id, position);

CREATE TRIGGER trg_menu_links_updated_at
BEFORE UPDATE ON public.menu_links
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
