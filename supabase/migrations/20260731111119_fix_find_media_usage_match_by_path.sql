-- Fixes find_media_usage() to match by storage path instead of the full
-- signed URL (which includes a one-time token). The same underlying file can
-- have different signed URLs issued at different times (e.g. one row in
-- `media` and another reference embedded in `page_sections.data`), so an
-- exact/full-string match silently reported "not referenced" even when a
-- file genuinely was in use.
CREATE OR REPLACE FUNCTION public.find_media_usage(_url text)
 RETURNS TABLE(entity_type text, entity_id uuid, title text, slug text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  WITH needle AS (SELECT split_part(_url, '?', 1) AS p)
  SELECT 'post'::text, p.id, p.title, p.slug FROM public.posts p, needle
  WHERE p.featured_image_url = _url
     OR position(needle.p in coalesce(p.featured_image_url, '')) > 0
     OR (p.content IS NOT NULL AND position(needle.p in p.content::text) > 0)
  UNION ALL
  SELECT 'page'::text, pg.id, pg.title, pg.slug FROM public.pages pg, needle
  WHERE pg.featured_image_url = _url
     OR position(needle.p in coalesce(pg.featured_image_url, '')) > 0
     OR (pg.content IS NOT NULL AND position(needle.p in pg.content::text) > 0)
  UNION ALL
  SELECT 'page_section'::text, ps.page_id, pg2.title, pg2.slug
  FROM public.page_sections ps JOIN public.pages pg2 ON pg2.id = ps.page_id, needle
  WHERE position(needle.p in ps.data::text) > 0
  UNION ALL
  SELECT 'homepage_hero'::text, hh.id, 'Homepage Hero'::text, ''::text
  FROM public.homepage_hero hh, needle
  WHERE hh.background_url = _url OR position(needle.p in coalesce(hh.background_url, '')) > 0;
$function$;
