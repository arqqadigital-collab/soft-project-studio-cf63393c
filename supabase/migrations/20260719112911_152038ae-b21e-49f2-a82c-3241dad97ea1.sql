
INSERT INTO public.pages (title, slug, status, template, page_kind, route_path, author_id, nav_label, position)
VALUES
('Patient Engagement & Identity', 'healthcare-patient-engagement', 'published', 'default', 'coded', '/healthcare/patient-engagement', '99b05ce2-3126-454b-95ff-9df9904f8929', 'Patient Engagement & Identity', 0),
('Revenue Cycle & Financial Performance', 'healthcare-revenue-cycle', 'published', 'default', 'coded', '/healthcare/revenue-cycle', '99b05ce2-3126-454b-95ff-9df9904f8929', 'Revenue Cycle & Financial Performance', 0)
ON CONFLICT (slug) DO NOTHING;

-- Seed page_sections shells so the dashboard Sections list shows all 9 blocks.
WITH pe AS (SELECT id FROM public.pages WHERE slug='healthcare-patient-engagement'),
     rc AS (SELECT id FROM public.pages WHERE slug='healthcare-revenue-cycle'),
     names(section_name, position) AS (VALUES
       ('Hero',0),('Introduction',1),('The Problem',2),('The Platform',3),
       ('Patient Journey',4),('Outcomes',5),('Integrations',6),('FAQ',7),('Final CTA',8))
INSERT INTO public.page_sections (page_id, kind, position, is_visible, data)
SELECT pe.id, 'generic', n.position, true, jsonb_build_object('section_name', n.section_name)
FROM pe, names n
WHERE NOT EXISTS (
  SELECT 1 FROM public.page_sections ps WHERE ps.page_id = pe.id AND ps.data->>'section_name' = n.section_name
)
UNION ALL
SELECT rc.id, 'generic', n.position, true, jsonb_build_object('section_name', n.section_name)
FROM rc, names n
WHERE NOT EXISTS (
  SELECT 1 FROM public.page_sections ps WHERE ps.page_id = rc.id AND ps.data->>'section_name' = n.section_name
);
