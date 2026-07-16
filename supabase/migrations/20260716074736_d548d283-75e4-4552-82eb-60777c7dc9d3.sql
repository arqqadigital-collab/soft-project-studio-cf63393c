ALTER TABLE public.contact_page ADD COLUMN IF NOT EXISTS notification_email TEXT;
UPDATE public.contact_page SET notification_email = 'sbs@sbs-me.com' WHERE notification_email IS NULL;