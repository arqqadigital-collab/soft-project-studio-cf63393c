-- 1. footer_cta table
CREATE TABLE public.footer_cta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true,
  enabled boolean NOT NULL DEFAULT true,
  eyebrow text,
  title text NOT NULL DEFAULT 'Let''s Get Started',
  description text,
  button_label text DEFAULT 'Get in touch',
  button_url text DEFAULT '/contact',
  show_form boolean NOT NULL DEFAULT true,
  form_success_message text DEFAULT 'Thanks — we''ll be in touch shortly.',
  bg_color text,
  text_color text,
  button_bg_color text,
  button_text_color text,
  layout text NOT NULL DEFAULT 'centered',
  excluded_paths text[] NOT NULL DEFAULT ARRAY['/contact','/ar/contact']::text[],
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT footer_cta_singleton_unique UNIQUE (singleton)
);

GRANT SELECT ON public.footer_cta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.footer_cta TO authenticated;
GRANT ALL ON public.footer_cta TO service_role;

ALTER TABLE public.footer_cta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Footer CTA is readable by everyone"
  ON public.footer_cta FOR SELECT
  USING (true);

CREATE POLICY "Admins and editors can update footer CTA"
  ON public.footer_cta FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can insert footer CTA"
  ON public.footer_cta FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete footer CTA"
  ON public.footer_cta FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER footer_cta_set_updated_at
  BEFORE UPDATE ON public.footer_cta
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed row
INSERT INTO public.footer_cta (
  singleton, enabled, eyebrow, title, description,
  button_label, button_url, show_form, form_success_message,
  layout, excluded_paths, translations
) VALUES (
  true, true,
  'Ready when you are',
  'Let''s Get Started',
  'Tell us about your project and our team will reach out within one business day.',
  'Get in touch', '/contact', true,
  'Thanks — we''ll be in touch shortly.',
  'centered',
  ARRAY['/contact','/ar/contact']::text[],
  jsonb_build_object(
    'ar', jsonb_build_object(
      'eyebrow', 'جاهزون عندما تكون مستعدًا',
      'title', 'لنبدأ الآن',
      'description', 'أخبرنا عن مشروعك وسيتواصل معك فريقنا خلال يوم عمل واحد.',
      'button_label', 'تواصل معنا',
      'form_success_message', 'شكرًا لك — سنتواصل معك قريبًا.'
    )
  )
);

-- 2. Add source column to contact_submissions
ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'contact_form';

CREATE INDEX IF NOT EXISTS idx_contact_submissions_source
  ON public.contact_submissions(source);
