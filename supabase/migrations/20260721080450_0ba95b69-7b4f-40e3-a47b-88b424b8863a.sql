
CREATE OR REPLACE FUNCTION public.slugify_ar(input text) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT trim(both '-' from regexp_replace(
    regexp_replace(
      regexp_replace(lower(coalesce(input,'')), '[\s_]+', '-', 'g'),
      '[^[:alnum:]\u0600-\u06FF-]+', '', 'g'
    ),
    '-+', '-', 'g'
  ));
$$;

UPDATE public.posts SET slug_ar = public.slugify_ar(translations->'ar'->>'title')
WHERE slug_ar IS NULL AND translations->'ar'->>'title' IS NOT NULL AND length(trim(translations->'ar'->>'title')) > 0;

UPDATE public.case_studies SET slug_ar = public.slugify_ar(translations->'ar'->>'title')
WHERE slug_ar IS NULL AND translations->'ar'->>'title' IS NOT NULL AND length(trim(translations->'ar'->>'title')) > 0;

UPDATE public.events SET slug_ar = public.slugify_ar(translations->'ar'->>'title')
WHERE slug_ar IS NULL AND translations->'ar'->>'title' IS NOT NULL AND length(trim(translations->'ar'->>'title')) > 0;
