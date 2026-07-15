
-- 1) Clear broken /src/assets/* URLs across page_sections for the 7 hospital & clinical pages
--    so the dashboard stops showing broken image tiles. Images can be re-picked from the media library.
WITH target_pages AS (
  SELECT id, slug FROM public.pages
  WHERE slug IN ('his','clinic-management','dental','lis','ris','rcm','emergency-department','physiotherapy')
)
UPDATE public.page_sections ps
SET data = (
  regexp_replace(ps.data::text, '"/src/assets/[^"]*"', '""', 'g')
)::jsonb
FROM target_pages tp
WHERE ps.page_id = tp.id
  AND ps.data::text LIKE '%/src/assets/%';

-- 2) Stamp each section with a section_name matching the frontend section headings/arrangement.
--    This drives the dashboard card label so each section is identifiable at a glance.
--    Order (position) already matches the frontend; we only rename here.

-- Common per-position naming across all product pages
-- pos 0: hero        -> "Hero"
-- pos 1: intro cta   -> "Introduction"
-- (rest depend on kind; use eyebrow/heading when meaningful)

-- HIS (9 sections: hero, intro, problem, platform, journey, outcomes, integrations, faq, final cta)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'How It Works — Patient Journey'),(5,'Outcomes'),(6,'Integrations'),
  (7,'FAQ'),(8,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='his') AND ps.position = v.pos;

-- Dental (8 sections)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Patient Journey'),(5,'Outcomes'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='dental') AND ps.position = v.pos;

-- Clinic Management
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Patient Journey'),(5,'Outcomes'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='clinic-management') AND ps.position = v.pos;

-- LIS (7 sections)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Outcomes'),(5,'FAQ'),(6,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='lis') AND ps.position = v.pos;

-- RIS (8 sections)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Patient Journey'),(5,'Outcomes'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='ris') AND ps.position = v.pos;

-- RCM (8 sections)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Patient Journey'),(5,'Outcomes'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='rcm') AND ps.position = v.pos;

-- Emergency Department
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Problem'),(3,'The Platform'),
  (4,'Patient Journey'),(5,'Outcomes'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='emergency-department') AND ps.position = v.pos;

-- Physiotherapy (8 sections: hero, intro, platform, journey, outcomes, integrations, faq, final cta)
UPDATE public.page_sections ps SET data = ps.data || jsonb_build_object('section_name', v.name)
FROM (VALUES
  (0,'Hero'),(1,'Introduction'),(2,'The Platform'),(3,'Patient Journey'),
  (4,'Outcomes'),(5,'Integrations'),(6,'FAQ'),(7,'Final CTA')
) AS v(pos, name)
WHERE ps.page_id = (SELECT id FROM public.pages WHERE slug='physiotherapy') AND ps.position = v.pos;
