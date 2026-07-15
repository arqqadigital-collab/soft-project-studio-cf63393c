
-- 1) Problem section (position 2, features kind) — add images + icons
UPDATE public.page_sections
SET data = jsonb_build_object(
  'eyebrow', 'The Problem',
  'heading', 'A Disconnected Hospital Is a Dangerous Hospital.',
  'subheading', 'When core systems don''t talk to each other, patients pay the price.',
  'bgColor', '#0a0e1a',
  'textColor', '#ffffff',
  'accentColor', '#22d3ee',
  'items', jsonb_build_array(
    jsonb_build_object('icon','AlertTriangle','title','Disconnected Orders','image','/__l5e/assets-v1/4127a7d4-639b-4e10-9e91-8b4d10fe043e/problem-1.jpg','description','Physicians order medications in one system, nurses administer in another, and the pharmacy dispenses from a third — every handoff a chance for an error the system cannot see.'),
    jsonb_build_object('icon','Workflow','title','Lost in Transfer','image','/__l5e/assets-v1/fc7c1f7d-7d75-459a-be5b-fd523694f4ef/problem-2.jpg','description','Every patient transfer between departments requires manual re-entry of critical clinical data — allergies, medications, active problems — because systems do not share a common record.'),
    jsonb_build_object('icon','BedDouble','title','Invisible Census','image','/__l5e/assets-v1/68e53039-9666-4456-9889-1ed25ef4fdf9/problem-3.jpg','description','Administrators cannot see, in real time, how many beds are occupied, how many patients are waiting, or where operational bottlenecks are forming — because the data lives in six different systems.'),
    jsonb_build_object('icon','Receipt','title','Billing Drift','image','/__l5e/assets-v1/932724cf-5883-490c-9ee6-52799482e10d/problem-4.jpg','description','Billable services provided at the point of care never make it to the claim, because clinical documentation and revenue cycle run on different platforms with weak integration.'),
    jsonb_build_object('icon','BarChart3','title','Unreportable Data','image','/__l5e/assets-v1/121cd824-65bd-429f-8183-bbc470556362/problem-5.jpg','description','Clinical governance teams cannot produce meaningful quality reports because clinical data is stored in formats that cannot be queried, combined, or analyzed across departments.'),
    jsonb_build_object('icon','Network','title','Tribal Knowledge','image','/__l5e/assets-v1/aaa1f93d-7480-4acb-b1ba-2096b1f5a94f/problem-6.jpg','description','New physicians joining the hospital spend weeks learning which system holds which information — because there is no single place where the complete patient story lives.')
  )
)
WHERE page_id = 'fd6e8384-f61f-4244-93f9-3c9e1df7fd84' AND position = 2;

-- 2) Patient Journey (position 4) — convert to features grid with 6 image cards
UPDATE public.page_sections
SET kind = 'features',
    data = jsonb_build_object(
  'eyebrow', 'How It Works',
  'heading', 'The Complete Patient Journey — Managed in One System',
  'subheading', 'Registration → Outpatient Consultation → Admission → Inpatient Care → Discharge → Billing & Settlement. Every step captured in one unified record.',
  'items', jsonb_build_array(
    jsonb_build_object('icon','UserPlus','title','Registration','image','/__l5e/assets-v1/eab00c4f-2e04-4b01-905d-ad7245403aec/registration.png','description','Patient registered with verified identity and complete demographics. A unique master record is created or retrieved. Duplicate detection prevents fragmented histories.'),
    jsonb_build_object('icon','CalendarCheck','title','Outpatient Consultation','image','/__l5e/assets-v1/69931c06-24ac-40a2-8e33-39095f474d3d/outpatient-consultation.png','description','Appointment conducted with full clinical history visible. The physician documents, orders, prescribes and refers — all in one screen, all in one workflow.'),
    jsonb_build_object('icon','BedDouble','title','Admission','image','/__l5e/assets-v1/390e2ec9-ce18-4e17-9d0b-5e0b939ef738/admission.png','description','If admission is required, the patient moves from outpatient directly into inpatient workflow. Bed assignment, assessment, reconciliation and nursing documentation begin immediately.'),
    jsonb_build_object('icon','HeartPulse','title','Inpatient Care','image','/__l5e/assets-v1/3770b91e-7eee-4c2f-911f-29ee15546816/inpatient-care.png','description','Every clinical event — rounds, assessments, investigations, procedures, medications, transfers — is documented in the unified record with continuous decision support.'),
    jsonb_build_object('icon','FileText','title','Discharge','image','/__l5e/assets-v1/18a3763e-d43c-4b57-a053-c09bdaad0758/discharge.png','description','Discharge planning begins at admission. The summary is generated from structured data. Medications are reconciled and follow-up appointments booked through the patient portal.'),
    jsonb_build_object('icon','Receipt','title','Billing & Settlement','image','/__l5e/assets-v1/e260825c-7760-41e8-9db1-436b3c8b59d2/billing-settlement.png','description','All clinical activity is captured automatically. Bills are generated from the clinical record, claims submitted electronically and payment reconciled — closing the financial and clinical record together.')
  )
)
WHERE page_id = 'fd6e8384-f61f-4244-93f9-3c9e1df7fd84' AND position = 4;

-- 3) Integrations logos (position 6) — proper items array with logo URLs
UPDATE public.page_sections
SET data = jsonb_build_object(
  'eyebrow', 'Integrations',
  'headline', 'An Open Architecture That Connects Your Entire Healthcare Ecosystem',
  'body', 'Secreta HIS is built on open standards — not a proprietary integration model that locks you into a single vendor ecosystem. Every external system that needs to connect, can.',
  'items', jsonb_build_array(
    jsonb_build_object('name','NPHIES','logo','/__l5e/assets-v1/2cba9755-6bd4-481f-b245-fc9ff025db35/nphies.png'),
    jsonb_build_object('name','Malaffi','logo','/__l5e/assets-v1/453c2f78-a8ad-40f2-b89a-d9f44fb05367/malaffi.png'),
    jsonb_build_object('name','Riayati','logo','/__l5e/assets-v1/129a8d7c-89b2-42d8-910c-4c71a41946cf/riayati.png'),
    jsonb_build_object('name','ZATCA Fatoora','logo','/__l5e/assets-v1/a2e7d288-53e6-4188-aa40-007b3a6f2ca5/zatca.png'),
    jsonb_build_object('name','UAE Emirates ID','logo','/__l5e/assets-v1/fcbc64f3-204e-478e-b4fd-c885adbcbf6d/emirates-id.png'),
    jsonb_build_object('name','Saudi Absher','logo','/__l5e/assets-v1/e17687ff-a3d4-48cb-983e-2c543ddfa066/absher.png'),
    jsonb_build_object('name','Bahrain NHRA','logo','/__l5e/assets-v1/47f39e6f-59ae-4532-aa0e-ead0d75d3a2b/nhra.png'),
    jsonb_build_object('name','Wasfaty','logo','/__l5e/assets-v1/d929bd04-3e38-476c-ab54-2bb0d87bf92e/wasfaty.png')
  )
)
WHERE page_id = 'fd6e8384-f61f-4244-93f9-3c9e1df7fd84' AND position = 6;

-- 4) Intro CTA (position 1) — white bg, no dark overlay artifacts
UPDATE public.page_sections
SET data = jsonb_build_object(
  'eyebrow', 'Introducing Secreta HIS',
  'headline', 'One Unified Platform for Modern Healthcare',
  'body', 'A hospital generates thousands of clinical decisions, administrative transactions, and operational events every single day. When the systems supporting those events are disconnected — different platforms for pharmacy, laboratory, radiology, nursing, billing, and management — information is delayed, duplicated, and lost. Secreta HIS is a fully integrated, enterprise-grade Hospital Information System that connects every department, every workflow, and every data point in your facility into one unified clinical and operational platform. Built for the complexity of modern healthcare. Designed for the humans who deliver it.',
  'bgColor', '#ffffff',
  'textColor', '#0a0e1a'
)
WHERE page_id = 'fd6e8384-f61f-4244-93f9-3c9e1df7fd84' AND position = 1;
