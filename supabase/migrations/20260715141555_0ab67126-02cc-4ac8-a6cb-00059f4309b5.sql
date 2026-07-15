
-- ============ contact_page (singleton) ============
CREATE TABLE public.contact_page (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  hero_eyebrow text NOT NULL DEFAULT 'Contact Us',
  hero_headline text NOT NULL DEFAULT 'Let''s Build Something Together',
  hero_subheadline text NOT NULL DEFAULT '',
  hero_background_url text,
  hero_cta_label text NOT NULL DEFAULT 'Request a Consultation',
  hero_cta_href text NOT NULL DEFAULT '#contact-form',
  form_heading text NOT NULL DEFAULT 'Send us a message',
  form_subheading text NOT NULL DEFAULT 'Fields marked * are required.',
  form_submit_label text NOT NULL DEFAULT 'Contact Us',
  quick_info jsonb NOT NULL DEFAULT '[]'::jsonb,
  offices_heading text NOT NULL DEFAULT 'Our Offices',
  offices_subheading text NOT NULL DEFAULT 'A global presence with local expertise. Visit us at any of our regional offices.',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_page TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_page TO authenticated;
GRANT ALL ON public.contact_page TO service_role;
ALTER TABLE public.contact_page ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact page is public readable" ON public.contact_page FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage contact page" ON public.contact_page FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER contact_page_updated BEFORE UPDATE ON public.contact_page
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ contact_offices ============
CREATE TABLE public.contact_offices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  image_url text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_offices TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_offices TO authenticated;
GRANT ALL ON public.contact_offices TO service_role;
ALTER TABLE public.contact_offices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Offices are public readable" ON public.contact_offices FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage offices" ON public.contact_offices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER contact_offices_updated BEFORE UPDATE ON public.contact_offices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ contact_inquiry_areas ============
CREATE TABLE public.contact_inquiry_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_inquiry_areas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_inquiry_areas TO authenticated;
GRANT ALL ON public.contact_inquiry_areas TO service_role;
ALTER TABLE public.contact_inquiry_areas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inquiry areas are public readable" ON public.contact_inquiry_areas FOR SELECT USING (true);
CREATE POLICY "Admins/editors manage inquiry areas" ON public.contact_inquiry_areas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER contact_inquiry_areas_updated BEFORE UPDATE ON public.contact_inquiry_areas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ contact_submissions ============
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  area text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  consent boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','archived')),
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_submissions TO authenticated;
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins/editors read submissions" ON public.contact_submissions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors update submissions" ON public.contact_submissions
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Admins/editors delete submissions" ON public.contact_submissions
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE TRIGGER contact_submissions_updated BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX contact_submissions_created_at_idx ON public.contact_submissions (created_at DESC);
CREATE INDEX contact_submissions_status_idx ON public.contact_submissions (status);

-- ============ Seed data ============
INSERT INTO public.contact_page (singleton, hero_subheadline, quick_info) VALUES (
  true,
  'Have a project in mind or need expert advice? Reach out and one of our specialists will get back to you within 24 hours.',
  '[
    {"icon":"mail","title":"Email us","value":"sbs@sbs-me.com","subtitle":"We reply within one business day."},
    {"icon":"phone","title":"Talk to sales","value":"+971 044 277 705","subtitle":"Sun–Thu, 9:00 AM – 6:00 PM GST"},
    {"icon":"map-pin","title":"Head office","value":"Dubai, UAE","subtitle":"Jumeirah Lake Towers, Cluster X"}
  ]'::jsonb
);

INSERT INTO public.contact_offices (city, address, phone, email, image_url, position) VALUES
('Florida, USA', '6900 Tavistock Lakes Blvd, Suite 400, Orlando, Florida 32827, USA', '+1 (407) 3735356', 'sbs@sbs-me.com', 'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?auto=format&fit=crop&w=800&q=70', 1),
('Dubai, UAE', 'Office 1205, Jumeirah Bay Tower X3, Cluster X, Jumeirah Lake Towers.', '(+971) 044277705', 'sbs@sbs-me.com', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=70', 2),
('Qatar', '1st Floor, Al-Jaidah Square Building, Airport Road, PO Box 55743, Doha, Qatar', '+974 4426 7499', 'sbs@sbs-me.com', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=70', 3),
('Saudi Arabia', '6143 – Al Arid Dist. Unit No.1, Riyadh 13342 – 2901, Kingdom of Saudi Arabia', '+966 11 503 0522', 'sbs@sbs-me.com', 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=800&q=70', 4),
('Cairo, Egypt', '6 AL-Horya St. 9th area, Block No. 16, Nasr City, Cairo, Egypt', '+2 (02) 24725260', 'sbs@sbs-me.com', 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=800&q=70', 5);

INSERT INTO public.contact_inquiry_areas (label, position) VALUES
('Dynamics 365 Business Central', 1),
('Odoo', 2),
('Zoho', 3),
('Healthcare Solutions', 4),
('Cybersecurity', 5),
('Consulting', 6),
('Implementation & Integration', 7),
('Staff Augmentation', 8),
('Other', 9);
