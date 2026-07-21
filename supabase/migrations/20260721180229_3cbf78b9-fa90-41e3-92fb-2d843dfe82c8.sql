
ALTER TABLE public.form_settings ADD COLUMN IF NOT EXISTS fields JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.contact_submissions ADD COLUMN IF NOT EXISTS custom_data JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Seed default fields for both forms if empty
UPDATE public.form_settings SET fields = '[
  {"id":"f_name","key":"name","type":"text","builtin":true,"enabled":true,"required":true,"label_en":"Name","label_ar":"الاسم","placeholder_en":"","placeholder_ar":""},
  {"id":"f_email","key":"email","type":"email","builtin":true,"enabled":true,"required":true,"label_en":"Email","label_ar":"البريد الإلكتروني","placeholder_en":"","placeholder_ar":""},
  {"id":"f_phone","key":"phone","type":"tel","builtin":true,"enabled":true,"required":true,"label_en":"Phone Number","label_ar":"رقم الهاتف","placeholder_en":"","placeholder_ar":""},
  {"id":"f_area","key":"area","type":"area","builtin":true,"enabled":true,"required":true,"label_en":"Area of Inquiry","label_ar":"مجال الاستفسار","placeholder_en":"Select an area...","placeholder_ar":"اختر مجالًا..."},
  {"id":"f_message","key":"message","type":"textarea","builtin":true,"enabled":true,"required":false,"label_en":"Message","label_ar":"الرسالة","placeholder_en":"","placeholder_ar":""},
  {"id":"f_consent","key":"consent","type":"checkbox","builtin":true,"enabled":true,"required":true,"label_en":"I agree to be contacted about my inquiry and consent to the processing of my data.","label_ar":"أوافق على أن يتم التواصل معي بشأن استفساري وعلى معالجة بياناتي."}
]'::jsonb
WHERE fields = '[]'::jsonb OR fields IS NULL;
