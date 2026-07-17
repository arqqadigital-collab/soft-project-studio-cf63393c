-- Remap Clinical AI page sections to the built-in lowercase kinds so the
-- polished PageBuilder editors (with human labels, alignment select, color
-- pickers) are used — matching every other product page. section_name is
-- preserved so useClinicalAiContent() keeps merging overrides correctly.
UPDATE public.page_sections
SET kind = CASE kind
  WHEN 'Hero'         THEN 'hero'
  WHEN 'Introduction' THEN 'features'
  WHEN 'The Problem'  THEN 'features'
  WHEN 'The Platform' THEN 'features'
  WHEN 'How It Works' THEN 'features'
  WHEN 'Outcomes'     THEN 'stats'
  WHEN 'Integrations' THEN 'features'
  WHEN 'FAQ'          THEN 'faq'
  WHEN 'Final CTA'    THEN 'cta'
  ELSE kind
END
WHERE page_id = (SELECT id FROM public.pages WHERE slug = 'healthcare-clinical-ai');