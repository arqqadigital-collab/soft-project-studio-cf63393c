UPDATE public.page_sections
SET data = jsonb_build_object(
  'eyebrow', '',
  'headline', 'Every Department. Every Patient.',
  'headlineAccent', 'Every Decision. One System.',
  'subheadline', '',
  'ctaLabel', 'See Secreta HIS in Action',
  'ctaHref', '#contact',
  'ctaLabel2', 'Book an Enterprise Demonstration',
  'ctaHref2', '#contact',
  'chips', jsonb_build_array(
    '300+ Hospitals',
    'HIMSS EMRAM Stage 6 Ready',
    'HL7 FHIR & DICOM Native',
    'HIPAA · GDPR · GCC Compliant',
    'Arabic & English',
    'Cloud & On-Premise'
  ),
  'align', 'center',
  'mediaUrl', '/__l5e/assets-v1/25b00197-4b5c-4720-962f-41679f2291d8/his-hero.mp4',
  'mediaKind', 'video'
)
WHERE kind = 'hero'
  AND page_id = (SELECT id FROM public.pages WHERE slug = 'his');
