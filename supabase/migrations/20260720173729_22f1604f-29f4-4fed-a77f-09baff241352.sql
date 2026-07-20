
CREATE TABLE public.form_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  labels jsonb NOT NULL DEFAULT '{}'::jsonb,
  labels_ar jsonb NOT NULL DEFAULT '{}'::jsonb,
  required_fields text[] NOT NULL DEFAULT ARRAY['name','email','phone','area','consent']::text[],
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.form_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.form_settings TO authenticated;
GRANT ALL ON public.form_settings TO service_role;

ALTER TABLE public.form_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_settings public read" ON public.form_settings FOR SELECT USING (true);
CREATE POLICY "form_settings admin/editor write" ON public.form_settings FOR ALL
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'))
  WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'editor'));

CREATE TRIGGER form_settings_updated_at BEFORE UPDATE ON public.form_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.form_settings (key, labels, labels_ar) VALUES
('contact_form',
 '{"heading":"","subheading":"","name_label":"Name","name_placeholder":"","email_label":"Email","email_placeholder":"","phone_label":"Phone Number","phone_placeholder":"","area_label":"Area of Inquiry","area_placeholder":"Select an area...","message_label":"Message","message_placeholder":"","consent_text":"I agree to be contacted about my inquiry and consent to the processing of my data.","submit_label":"Contact Us","submitting_label":"Sending…","success_title":"Message sent successfully","success_message":"Thanks! We''ll get back to you within one business day.","send_another":"Send another message"}'::jsonb,
 '{"heading":"","subheading":"","name_label":"الاسم","name_placeholder":"","email_label":"البريد الإلكتروني","email_placeholder":"","phone_label":"رقم الهاتف","phone_placeholder":"","area_label":"مجال الاستفسار","area_placeholder":"اختر مجالًا...","message_label":"الرسالة","message_placeholder":"","consent_text":"أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي.","submit_label":"تواصل معنا","submitting_label":"جارٍ الإرسال…","success_title":"تم إرسال الرسالة بنجاح","success_message":"شكرًا لك! سنعاود التواصل خلال يوم عمل واحد.","send_another":"إرسال رسالة أخرى"}'::jsonb),
('footer_cta',
 '{"heading":"","subheading":"","name_label":"Name","name_placeholder":"","email_label":"Email","email_placeholder":"","phone_label":"Phone Number","phone_placeholder":"","area_label":"Area of Inquiry","area_placeholder":"Select an area...","message_label":"Message","message_placeholder":"","consent_text":"I agree to be contacted about my inquiry and consent to the processing of my data.","submit_label":"Contact Us","submitting_label":"Sending…","success_title":"Message sent successfully","success_message":"Thanks! We''ll get back to you within one business day.","send_another":"Send another message"}'::jsonb,
 '{"heading":"","subheading":"","name_label":"الاسم","name_placeholder":"","email_label":"البريد الإلكتروني","email_placeholder":"","phone_label":"رقم الهاتف","phone_placeholder":"","area_label":"مجال الاستفسار","area_placeholder":"اختر مجالًا...","message_label":"الرسالة","message_placeholder":"","consent_text":"أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي.","submit_label":"تواصل معنا","submitting_label":"جارٍ الإرسال…","success_title":"تم إرسال الرسالة بنجاح","success_message":"شكرًا لك! سنعاود التواصل خلال يوم عمل واحد.","send_another":"إرسال رسالة أخرى"}'::jsonb);
