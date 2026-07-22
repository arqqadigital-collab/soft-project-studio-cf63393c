
CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION public.publish_scheduled_content()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.posts
     SET status = 'published'
   WHERE status = 'scheduled'
     AND published_at IS NOT NULL
     AND published_at <= now();

  UPDATE public.case_studies
     SET status = 'published'
   WHERE status = 'scheduled'
     AND published_at IS NOT NULL
     AND published_at <= now();

  UPDATE public.events
     SET status = 'published'
   WHERE status = 'scheduled'
     AND published_at IS NOT NULL
     AND published_at <= now();
END;
$$;

-- Unschedule prior version if present, then schedule every minute
DO $$
DECLARE jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'publish_scheduled_content_every_minute';
  IF jid IS NOT NULL THEN
    PERFORM cron.unschedule(jid);
  END IF;
END $$;

SELECT cron.schedule(
  'publish_scheduled_content_every_minute',
  '* * * * *',
  $$SELECT public.publish_scheduled_content();$$
);

-- Run once immediately to catch anything already due
SELECT public.publish_scheduled_content();
