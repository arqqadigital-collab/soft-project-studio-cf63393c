ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_section_id_fkey;

ALTER TABLE public.nav_items    RENAME TO _archived_nav_items;
ALTER TABLE public.nav_sections RENAME TO _archived_nav_sections;
ALTER TABLE public.nav_groups   RENAME TO _archived_nav_groups;

REVOKE ALL ON public._archived_nav_items    FROM anon, authenticated;
REVOKE ALL ON public._archived_nav_sections FROM anon, authenticated;
REVOKE ALL ON public._archived_nav_groups   FROM anon, authenticated;

COMMENT ON TABLE public._archived_nav_items    IS 'Archived 2026-07-16: replaced by unified pages + menu_columns model';
COMMENT ON TABLE public._archived_nav_sections IS 'Archived 2026-07-16: replaced by menu_columns';
COMMENT ON TABLE public._archived_nav_groups   IS 'Archived 2026-07-16: replaced by menu_groups';

CREATE TABLE public.menu_groups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_groups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_groups TO authenticated;
GRANT ALL ON public.menu_groups TO service_role;
ALTER TABLE public.menu_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_groups public read" ON public.menu_groups FOR SELECT USING (true);
CREATE POLICY "menu_groups editors manage" ON public.menu_groups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER menu_groups_set_updated_at BEFORE UPDATE ON public.menu_groups
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.menu_columns (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID NOT NULL REFERENCES public.menu_groups(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  position   INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_columns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_columns TO authenticated;
GRANT ALL ON public.menu_columns TO service_role;
ALTER TABLE public.menu_columns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu_columns public read" ON public.menu_columns FOR SELECT USING (true);
CREATE POLICY "menu_columns editors manage" ON public.menu_columns FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));
CREATE TRIGGER menu_columns_set_updated_at BEFORE UPDATE ON public.menu_columns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX menu_columns_group_pos_idx ON public.menu_columns(group_id, position);

ALTER TABLE public.pages
  ADD COLUMN menu_column_id UUID REFERENCES public.menu_columns(id) ON DELETE SET NULL,
  ADD COLUMN menu_position  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN page_kind      TEXT    NOT NULL DEFAULT 'cms' CHECK (page_kind IN ('cms','coded')),
  ADD COLUMN route_path     TEXT;

CREATE INDEX pages_menu_column_pos_idx ON public.pages(menu_column_id, menu_position);
CREATE INDEX pages_route_path_idx ON public.pages(route_path);

INSERT INTO public.menu_groups (id, label, position, is_visible, created_at, updated_at)
SELECT id, label, position, is_visible, created_at, updated_at FROM public._archived_nav_groups;

INSERT INTO public.menu_columns (id, group_id, label, position, is_visible, created_at, updated_at)
SELECT id, group_id, label, position, is_visible, created_at, updated_at FROM public._archived_nav_sections;

UPDATE public.pages SET
  menu_column_id = section_id,
  menu_position  = position;

UPDATE public.pages p SET page_kind='coded', route_path = m.route
FROM (VALUES
  ('about','/about'),
  ('careers','/careers'),
  ('his','/healthcare/his'),
  ('clinic','/healthcare/clinic'),
  ('emergency','/healthcare/emergency'),
  ('physiotherapy','/healthcare/physiotherapy'),
  ('telemedicine','/healthcare/telemedicine'),
  ('dental-management-suite','/healthcare/dental'),
  ('lis','/healthcare/lis'),
  ('ris','/healthcare/ris'),
  ('rcm','/healthcare/rcm'),
  ('blood-bank','/healthcare/blood-bank'),
  ('blood-bank-and-donor-management','/healthcare/blood-bank'),
  ('medication-dosage','/healthcare/medication-dosage'),
  ('pacs','/healthcare/pacs'),
  ('ai-imaging','/healthcare/ai-imaging'),
  ('uae-compliance','/healthcare/uae-compliance'),
  ('ksa-compliance','/healthcare/ksa-compliance'),
  ('emram','/healthcare/emram'),
  ('clinical-ai','/healthcare/clinical-ai'),
  ('dynamics-365','/erp/dynamics-365'),
  ('odoo','/erp/odoo'),
  ('zoho','/erp/zoho'),
  ('manufacturing','/erp/manufacturing'),
  ('retail','/erp/retail'),
  ('education','/erp/education'),
  ('logistics','/erp/logistics'),
  ('operations','/healthcare/operations'),
  ('cybersecurity','/services/cybersecurity'),
  ('consulting','/services/consulting'),
  ('implementation','/services/implementation'),
  ('staff-aug','/services/staff-aug'),
  ('learning','/services/learning')
) AS m(slug, route)
WHERE p.slug = m.slug;

UPDATE public.pages SET route_path = '/p/' || slug WHERE route_path IS NULL;

INSERT INTO public.pages (
  title, slug, status, template, author_id,
  menu_column_id, menu_position, page_kind, route_path, nav_label
)
SELECT
  ni.label,
  regexp_replace(regexp_replace(lower(ni.url), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'),
  'published'::page_status,
  'default'::page_template,
  (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1),
  ni.section_id,
  ni.position,
  'coded',
  ni.url,
  ni.label
FROM public._archived_nav_items ni
WHERE ni.item_type IN ('internal','link','external')
  AND ni.url IS NOT NULL
  AND ni.url <> '#'
  AND ni.is_visible = true
  AND NOT EXISTS (SELECT 1 FROM public.pages p WHERE p.route_path = ni.url)
ON CONFLICT (slug) DO UPDATE
  SET menu_column_id = EXCLUDED.menu_column_id,
      menu_position  = EXCLUDED.menu_position,
      page_kind      = EXCLUDED.page_kind,
      route_path     = EXCLUDED.route_path,
      nav_label      = EXCLUDED.nav_label;

INSERT INTO public.pages (
  title, slug, status, template, author_id,
  menu_column_id, menu_position, page_kind, route_path, nav_label
)
SELECT
  ns.label,
  regexp_replace(regexp_replace(lower(ns.href), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'),
  'published'::page_status,
  'default'::page_template,
  (SELECT id FROM public.profiles ORDER BY created_at LIMIT 1),
  ns.id,
  0,
  'coded',
  ns.href,
  ns.label
FROM public._archived_nav_sections ns
WHERE ns.href IS NOT NULL
  AND ns.href <> ''
  AND ns.is_visible = true
  AND NOT EXISTS (SELECT 1 FROM public.pages p WHERE p.route_path = ns.href)
ON CONFLICT (slug) DO UPDATE
  SET menu_column_id = EXCLUDED.menu_column_id,
      menu_position  = EXCLUDED.menu_position,
      page_kind      = EXCLUDED.page_kind,
      route_path     = EXCLUDED.route_path,
      nav_label      = EXCLUDED.nav_label;
