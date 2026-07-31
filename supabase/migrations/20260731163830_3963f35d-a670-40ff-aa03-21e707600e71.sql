CREATE TABLE public.not_found_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL UNIQUE,
  referrer text,
  hits integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'open',
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT not_found_log_status_chk CHECK (status IN ('open','redirected','ignored'))
);

CREATE INDEX not_found_log_last_seen_idx ON public.not_found_log (last_seen DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.not_found_log TO authenticated;
GRANT ALL ON public.not_found_log TO service_role;

ALTER TABLE public.not_found_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins and editors can read 404 log"
  ON public.not_found_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can update 404 log"
  ON public.not_found_log FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins and editors can delete 404 log"
  ON public.not_found_log FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER not_found_log_set_updated_at
  BEFORE UPDATE ON public.not_found_log
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Public logging entry point: groups by URL and increments the hit counter.
CREATE OR REPLACE FUNCTION public.log_not_found(_url text, _referrer text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  clean_url text;
BEGIN
  clean_url := left(btrim(coalesce(_url, '')), 500);
  IF clean_url = '' THEN RETURN; END IF;

  INSERT INTO public.not_found_log (url, referrer)
  VALUES (clean_url, left(nullif(btrim(coalesce(_referrer, '')), ''), 500))
  ON CONFLICT (url) DO UPDATE
    SET hits = public.not_found_log.hits + 1,
        last_seen = now(),
        referrer = COALESCE(EXCLUDED.referrer, public.not_found_log.referrer);
END;
$$;

REVOKE ALL ON FUNCTION public.log_not_found(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_not_found(text, text) TO anon, authenticated, service_role;