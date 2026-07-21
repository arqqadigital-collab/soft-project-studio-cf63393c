
CREATE OR REPLACE FUNCTION public.slugify_ar(input text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT trim(both '-' from regexp_replace(
    regexp_replace(
      regexp_replace(lower(coalesce(input,'')), '[\s_]+', '-', 'g'),
      '[^[:alnum:]\u0600-\u06FF-]+', '', 'g'
    ),
    '-+', '-', 'g'
  ));
$$;
