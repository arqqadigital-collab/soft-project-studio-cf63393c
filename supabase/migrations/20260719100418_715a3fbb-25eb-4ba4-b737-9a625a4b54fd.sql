
UPDATE public.menu_columns SET description = CASE label
  WHEN 'Hospital & Clinical Systems' THEN 'Core hospital and clinic platforms'
  WHEN 'Specialized Clinical Modules' THEN 'Targeted modules for specialized care'
  WHEN 'Medical Imaging' THEN 'PACS, archiving and AI imaging'
  WHEN 'Compliance & Interoperability' THEN 'Regional compliance and standards'
  WHEN 'Healthcare AI' THEN 'Clinical AI and readiness'
  WHEN 'ERP Platforms' THEN 'Enterprise resource planning suites'
  WHEN 'Business Verticals (ERP)' THEN 'Industry-tailored ERP solutions'
  WHEN 'Cybersecurity' THEN 'Protect your digital estate'
  WHEN 'Consulting' THEN 'Strategy and advisory'
  WHEN 'Implementation & Integration' THEN 'Deploy and integrate'
  WHEN 'Staff Aug & Managed Services' THEN 'Talent and managed ops'
  WHEN 'Learning & Knowledge' THEN 'Enablement and training'
  WHEN 'Company' THEN 'Our story and mission'
  WHEN 'Resources' THEN 'Insights and updates'
  ELSE description
END
WHERE label IN (
  'Hospital & Clinical Systems','Specialized Clinical Modules','Medical Imaging',
  'Compliance & Interoperability','Healthcare AI','ERP Platforms','Business Verticals (ERP)',
  'Cybersecurity','Consulting','Implementation & Integration','Staff Aug & Managed Services',
  'Learning & Knowledge','Company','Resources'
);
