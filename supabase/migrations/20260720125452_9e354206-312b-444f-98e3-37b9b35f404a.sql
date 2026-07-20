
-- Arabic slug columns
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS slug_ar text;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS slug_ar text;
ALTER TABLE public.case_studies ADD COLUMN IF NOT EXISTS slug_ar text;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug_ar text;

CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_ar_unique ON public.pages (slug_ar) WHERE slug_ar IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_ar_unique ON public.posts (slug_ar) WHERE slug_ar IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS case_studies_slug_ar_unique ON public.case_studies (slug_ar) WHERE slug_ar IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS events_slug_ar_unique ON public.events (slug_ar) WHERE slug_ar IS NOT NULL;

-- Menu links: optional Arabic href override
ALTER TABLE public.menu_links ADD COLUMN IF NOT EXISTS href_ar text;

-- Slug redirects: per-locale
ALTER TABLE public.slug_redirects ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'en';

-- Route map for built-in (hardcoded) product routes
CREATE TABLE IF NOT EXISTS public.route_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_key text NOT NULL UNIQUE,
  path_en text NOT NULL,
  path_ar text,
  title_en text,
  title_ar text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.route_map TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.route_map TO authenticated;
GRANT ALL ON public.route_map TO service_role;

ALTER TABLE public.route_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "route_map public read"
  ON public.route_map FOR SELECT
  USING (true);

CREATE POLICY "route_map admin/editor write"
  ON public.route_map FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER route_map_set_updated_at
  BEFORE UPDATE ON public.route_map
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS route_map_path_ar_unique ON public.route_map (path_ar) WHERE path_ar IS NOT NULL;

-- Seed with the 32 built-in product routes (Arabic paths default to English structure prefixed with /ar/;
-- admins can edit each row in the CMS to use fully translated Arabic segments).
INSERT INTO public.route_map (route_key, path_en, path_ar, title_en, title_ar) VALUES
  ('home',                        '/',                                '/',                                'Home',                              'الرئيسية'),
  ('about',                       '/about',                           '/من-نحن',                           'About',                             'من نحن'),
  ('careers',                     '/careers',                         '/الوظائف',                          'Careers',                           'الوظائف'),
  ('contact',                     '/contact',                         '/تواصل-معنا',                        'Contact',                           'تواصل معنا'),
  ('blog',                        '/blog',                            '/المدونة',                           'Blog',                              'المدونة'),
  ('events',                      '/events',                          '/الفعاليات',                         'Events',                            'الفعاليات'),
  ('case-studies',                '/case-studies',                    '/دراسات-الحالة',                     'Case Studies',                      'دراسات الحالة'),
  ('healthcare.his',              '/healthcare/his',                  '/الرعاية-الصحية/نظام-معلومات-المستشفى',      'HIS',                               'نظام معلومات المستشفى'),
  ('healthcare.clinic',           '/healthcare/clinic',               '/الرعاية-الصحية/إدارة-العيادات',                'Clinic Management',                 'إدارة العيادات'),
  ('healthcare.emergency',        '/healthcare/emergency',            '/الرعاية-الصحية/قسم-الطوارئ',                  'Emergency Department',              'قسم الطوارئ'),
  ('healthcare.physiotherapy',    '/healthcare/physiotherapy',        '/الرعاية-الصحية/العلاج-الطبيعي',                'Physiotherapy',                     'العلاج الطبيعي'),
  ('healthcare.telemedicine',     '/healthcare/telemedicine',         '/الرعاية-الصحية/التطبيب-عن-بعد',                'Telemedicine',                      'التطبيب عن بعد'),
  ('healthcare.operations',       '/healthcare/operations',           '/الرعاية-الصحية/عمليات-المستشفى',               'Hospital Operations',               'عمليات المستشفى'),
  ('healthcare.dental',           '/healthcare/dental',               '/الرعاية-الصحية/طب-الأسنان',                    'Dental',                            'طب الأسنان'),
  ('healthcare.lis',              '/healthcare/lis',                  '/الرعاية-الصحية/نظام-معلومات-المختبر',          'LIS',                               'نظام معلومات المختبر'),
  ('healthcare.ris',              '/healthcare/ris',                  '/الرعاية-الصحية/نظام-معلومات-الأشعة',           'RIS',                               'نظام معلومات الأشعة'),
  ('healthcare.rcm',              '/healthcare/rcm',                  '/الرعاية-الصحية/دورة-الإيرادات',                'RCM',                               'دورة الإيرادات'),
  ('healthcare.blood-bank',       '/healthcare/blood-bank',           '/الرعاية-الصحية/بنك-الدم',                      'Blood Bank',                        'بنك الدم'),
  ('healthcare.medication-dosage','/healthcare/medication-dosage',    '/الرعاية-الصحية/الأدوية-والجرعات',              'Medication & Dosage',               'الأدوية والجرعات'),
  ('healthcare.pacs',             '/healthcare/pacs',                 '/الرعاية-الصحية/باكس',                          'PACS',                              'باكس'),
  ('healthcare.ai-imaging',       '/healthcare/ai-imaging',           '/الرعاية-الصحية/التصوير-بالذكاء-الاصطناعي',      'AI Imaging',                        'التصوير بالذكاء الاصطناعي'),
  ('healthcare.uae-compliance',   '/healthcare/uae-compliance',       '/الرعاية-الصحية/الامتثال-الإماراتي',            'UAE Compliance',                    'الامتثال الإماراتي'),
  ('healthcare.ksa-compliance',   '/healthcare/ksa-compliance',       '/الرعاية-الصحية/الامتثال-السعودي',              'KSA Compliance',                    'الامتثال السعودي'),
  ('healthcare.emram',            '/healthcare/emram',                '/الرعاية-الصحية/إمرام',                         'EMRAM',                             'إمرام'),
  ('healthcare.clinical-ai',      '/healthcare/clinical-ai',          '/الرعاية-الصحية/الذكاء-الاصطناعي-السريري',      'Clinical AI',                       'الذكاء الاصطناعي السريري'),
  ('healthcare.patient-engagement','/healthcare/patient-engagement',  '/الرعاية-الصحية/تفاعل-المرضى',                  'Patient Engagement',                'تفاعل المرضى'),
  ('healthcare.revenue-cycle',    '/healthcare/revenue-cycle',        '/الرعاية-الصحية/الأداء-المالي',                 'Revenue Cycle',                     'الأداء المالي'),
  ('erp.dynamics-365',            '/erp/dynamics-365',                '/تخطيط-الموارد/دايناميكس-365',                  'Dynamics 365',                      'دايناميكس 365'),
  ('erp.odoo',                    '/erp/odoo',                        '/تخطيط-الموارد/أودو',                           'Odoo',                              'أودو'),
  ('erp.zoho',                    '/erp/zoho',                        '/تخطيط-الموارد/زوهو',                           'Zoho',                              'زوهو'),
  ('erp.manufacturing',           '/erp/manufacturing',               '/تخطيط-الموارد/التصنيع',                        'Manufacturing',                     'التصنيع'),
  ('erp.retail',                  '/erp/retail',                      '/تخطيط-الموارد/التجزئة',                        'Retail',                            'التجزئة'),
  ('erp.education',               '/erp/education',                   '/تخطيط-الموارد/التعليم',                        'Education',                         'التعليم'),
  ('erp.logistics',               '/erp/logistics',                   '/تخطيط-الموارد/الخدمات-اللوجستية',              'Logistics',                         'الخدمات اللوجستية'),
  ('services.cybersecurity',      '/services/cybersecurity',          '/الخدمات/الأمن-السيبراني',                      'Cybersecurity',                     'الأمن السيبراني'),
  ('services.consulting',         '/services/consulting',             '/الخدمات/الاستشارات',                           'Consulting',                        'الاستشارات'),
  ('services.implementation',     '/services/implementation',         '/الخدمات/التنفيذ-والتكامل',                     'Implementation',                    'التنفيذ والتكامل'),
  ('services.staff-aug',          '/services/staff-aug',              '/الخدمات/تعزيز-الفرق-والخدمات-المُدارة',        'Staff Augmentation',                'تعزيز الفرق والخدمات المُدارة'),
  ('services.learning',           '/services/learning',               '/الخدمات/التعلم-والمعرفة',                      'Learning',                          'التعلم والمعرفة')
ON CONFLICT (route_key) DO NOTHING;
