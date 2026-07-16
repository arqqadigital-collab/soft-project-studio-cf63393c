
-- Seed nav_items with original hardcoded menu content so the live navbar matches the original design
INSERT INTO public.nav_items (section_id, label, url, item_type, position) VALUES
-- Hospital & Clinical Systems
('5db71d6d-94ac-4d29-be75-a4760961e377','Hospital Information System (HIS)','/healthcare/his','internal',0),
('5db71d6d-94ac-4d29-be75-a4760961e377','Clinic Management System','/healthcare/clinic','internal',1),
('5db71d6d-94ac-4d29-be75-a4760961e377','Dental Management Suite','/healthcare/dental','internal',2),
('5db71d6d-94ac-4d29-be75-a4760961e377','Laboratory Information System (LIS)','/healthcare/lis','internal',3),
('5db71d6d-94ac-4d29-be75-a4760961e377','Radiology Information System (RIS)','/healthcare/ris','internal',4),
('5db71d6d-94ac-4d29-be75-a4760961e377','Revenue Cycle Management (RCM)','/healthcare/rcm','internal',5),
('5db71d6d-94ac-4d29-be75-a4760961e377','Emergency Department Management','/healthcare/emergency','internal',6),
('5db71d6d-94ac-4d29-be75-a4760961e377','Physiotherapy & Rehabilitation','/healthcare/physiotherapy','internal',7),
-- Specialized Clinical Modules
('ced2861f-1a87-4189-a626-4fbfcb4c806c','Blood Bank & Donor Management','/healthcare/blood-bank','internal',0),
('ced2861f-1a87-4189-a626-4fbfcb4c806c','Medication & Dosage Management','/healthcare/medication-dosage','internal',1),
('ced2861f-1a87-4189-a626-4fbfcb4c806c','Telemedicine & Virtual Care','/healthcare/telemedicine','internal',2),
('ced2861f-1a87-4189-a626-4fbfcb4c806c','Hospital Operations & RTLS','/healthcare/operations','internal',3),
-- Medical Imaging
('97616cba-2fae-4e1a-8773-2c98a4169f00','PACS & Medical Archiving','/healthcare/pacs','internal',0),
('97616cba-2fae-4e1a-8773-2c98a4169f00','AI for Medical Imaging','/healthcare/ai-imaging','internal',1),
-- Compliance & Interoperability
('9086d466-975b-4aa9-90db-050ac495fabc','KSA Compliance & Interoperability','/healthcare/ksa-compliance','internal',0),
('9086d466-975b-4aa9-90db-050ac495fabc','UAE Compliance & Interoperability','/healthcare/uae-compliance','internal',1),
-- Healthcare AI
('6f3a1c89-6538-41cf-9748-9f851df217a0','Clinical AI & Documentation','/healthcare/clinical-ai','internal',0),
('6f3a1c89-6538-41cf-9748-9f851df217a0','EMRAM Roadmap & AI Readiness','/healthcare/emram','internal',1),
-- Patient Engagement & Identity
('8cf6be0d-2e11-4174-a212-24df3c38f26e','Patient Engagement & Identity','#','external',0),
-- Revenue Cycle & Financial Performance
('81eb4bbe-3489-4ec3-9883-47615bb541d1','Revenue Cycle & Financial Performance','#','external',0),
-- ERP Platforms
('5fe0d7e8-254a-4ddd-900e-dbdacdd575c9','Microsoft Dynamics 365 Business Central','/erp/dynamics-365','internal',0),
('5fe0d7e8-254a-4ddd-900e-dbdacdd575c9','Odoo','/erp/odoo','internal',1),
('5fe0d7e8-254a-4ddd-900e-dbdacdd575c9','Zoho','/erp/zoho','internal',2),
-- Business Verticals (ERP)
('b640e64a-defb-41da-941f-9bbcc13c0cfb','Manufacturing & Trading','/erp/manufacturing','internal',0),
('b640e64a-defb-41da-941f-9bbcc13c0cfb','Logistics & Distribution','/erp/logistics','internal',1),
('b640e64a-defb-41da-941f-9bbcc13c0cfb','Retail & E-commerce','/erp/retail','internal',2),
('b640e64a-defb-41da-941f-9bbcc13c0cfb','Education & Research','/erp/education','internal',3),
-- Company > Company
('1ddbc018-4905-4cca-a081-8de75c26ae7e','About Us','/about','internal',0),
('1ddbc018-4905-4cca-a081-8de75c26ae7e','Careers','/careers','internal',1),
-- Company > Resources
('4ced93a2-31fb-4180-982e-3a72ac4c39fc','Blog','/blog','internal',0),
('4ced93a2-31fb-4180-982e-3a72ac4c39fc','Case Studies','/case-studies','internal',1),
('4ced93a2-31fb-4180-982e-3a72ac4c39fc','Events & Webinars','#','external',2);
