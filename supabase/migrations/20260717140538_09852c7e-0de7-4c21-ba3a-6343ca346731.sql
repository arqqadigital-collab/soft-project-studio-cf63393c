
DO $$
DECLARE pid uuid;
BEGIN
  SELECT id INTO pid FROM pages WHERE slug='healthcare-emram';

  -- Hero mediaUrl
  UPDATE page_sections SET data = data || jsonb_build_object(
    'mediaUrl','/__l5e/assets-v1/2e9e7fa8-c224-4a65-9c88-9e07ad8f54eb/emram-hero.mp4',
    'mediaKind','video'
  ) WHERE page_id=pid AND data->>'section_name'='Hero';

  -- The Problem: items with images
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"title":"Fragmented Clinical Data","description":"Most hospitals enter the EMRAM journey with fragmented, inconsistent or uncleaned data that cannot be trusted in clinical practice — let alone power AI.","image":"/__l5e/assets-v1/72fdc9e4-cb37-4752-bda8-1cacac102acc/p1.jpg"},
    {"title":"Clinical Transformation Gap","description":"IT teams understand the technical requirements but lack the clinical transformation expertise to drive the workflow changes Stage 6 and Stage 7 demand.","image":"/__l5e/assets-v1/138b2399-1b81-4de5-8fd2-a22a35868a2c/p2.jpg"},
    {"title":"No Framework for Progress","description":"Leadership invests in digital transformation without a clear framework for measuring progress, demonstrating value or maintaining operational standards.","image":"/__l5e/assets-v1/6fba6640-2630-4647-9d34-7ab3bf591611/p3.jpg"},
    {"title":"Workflow Adoption Underestimated","description":"EMRAM is not purely technical — it requires clinical leadership engagement, staff behavior change and sustained organizational commitment most programs underestimate.","image":"/__l5e/assets-v1/8d4bda8b-c080-40a6-8fce-ac076448080c/p4.jpg"},
    {"title":"Closed-Loop Medication Complexity","description":"ePrescribing through pharmacy verification, dispensing cabinet integration and barcode-verified administration is the requirement hospitals find most challenging.","image":"/__l5e/assets-v1/f0b8892e-a52a-4750-987c-7db5dc1d0837/p5.jpg"},
    {"title":"AI Readiness Is Not a Certificate","description":"Stage 7 opens the door to clinical AI — but data quality, governance frameworks, validation processes and AI literacy must be built systematically.","image":"/__l5e/assets-v1/0f3e9803-0ed5-4fc8-80f4-7296aeb4f6c8/p6.jpg"}
  ]'::jsonb) WHERE page_id=pid AND data->>'section_name'='The Problem';

  -- Patient Journey: items with images
  UPDATE page_sections SET data = jsonb_set(data, '{items}', '[
    {"icon":"ClipboardList","title":"Baseline Assessment","image":"/__l5e/assets-v1/e1fc3476-5a1a-4ce4-8497-6a6c69b29862/j1.jpg","description":"We assess your current EMRAM position across all criteria. You receive a current-state score, a gap analysis and a prioritized roadmap."},
    {"icon":"Users","title":"Roadmap Agreement","image":"/__l5e/assets-v1/3fbeb099-081b-4adf-960a-60cc696b6116/j2.jpg","description":"Leadership reviews and approves the roadmap. Resources, timelines and governance structures are agreed. The transformation program begins."},
    {"icon":"GitBranch","title":"Technology & Integration","image":"/__l5e/assets-v1/e261b4a0-299c-4ecb-9c86-ca238e22365f/j3.jpg","description":"Missing systems are implemented. Integration gaps are closed. Closed-loop medication safety, CDS and electronic documentation are built to EMRAM specification."},
    {"icon":"Workflow","title":"Clinical Adoption","image":"/__l5e/assets-v1/99541a86-ec04-47d4-b255-4903566228a8/j4.jpg","description":"Workflows are redesigned, staff are trained, adoption is measured and managed. EMRAM operational standards are embedded in daily clinical practice."},
    {"icon":"Sparkles","title":"AI Readiness Foundation","image":"/__l5e/assets-v1/f6fcdfdd-f01b-4dea-98ab-395fe70b2f67/j5.jpg","description":"Data quality, governance and infrastructure are built to support clinical AI. The readiness assessment confirms readiness for Stage 7 AI-powered analytics."},
    {"icon":"BadgeCheck","title":"Validation & Certification","image":"/__l5e/assets-v1/cc79d7b8-8a75-4918-b5a0-6075dfb3cc37/j6.jpg","description":"Pre-validation mock assessment is conducted, gaps are closed and the formal HIMSS validation is supported from preparation through on-site assessment."},
    {"icon":"Target","title":"Sustained Excellence","image":"/__l5e/assets-v1/9768a11e-03ed-4984-9b50-5e4e927eec2f/j7.jpg","description":"Post-validation operational support ensures EMRAM standards are maintained. AI capabilities are progressively deployed on the mature digital foundation."}
  ]'::jsonb) WHERE page_id=pid AND data->>'section_name'='Patient Journey';

  -- Final CTA mediaUrl
  UPDATE page_sections SET data = data || jsonb_build_object(
    'mediaUrl','/__l5e/assets-v1/b0c40f08-794d-4932-b6d3-fe4a5c99d1c0/emram-cta.mp4'
  ) WHERE page_id=pid AND data->>'section_name'='Final CTA';
END $$;
