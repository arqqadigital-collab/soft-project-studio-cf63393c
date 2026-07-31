-- Fixes replace_media_url() (used by the Media Library "Replace file" action)
-- with the same path-based matching as find_media_usage(). Previously it did
-- an exact/full-string replace of the old signed URL, which meant it would
-- silently skip any reference to the same file that happened to carry a
-- different signed-URL token (e.g. re-signed at a different time).
CREATE OR REPLACE FUNCTION public.replace_media_url(_old text, _new text)
 RETURNS integer
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  affected integer := 0;
  n integer;
  old_path text;
  esc_path text;
  pattern text;
BEGIN
  IF _old IS NULL OR _new IS NULL OR length(_old) = 0 THEN RETURN 0; END IF;
  old_path := split_part(_old, '?', 1);
  -- Escape regex metacharacters in the path, then match the path optionally
  -- followed by a "?token=...]" query string (up to the next JSON quote or
  -- backslash), so any previously-issued signed URL for the same underlying
  -- storage object is replaced, not just one with today's exact token.
  esc_path := regexp_replace(old_path, '([.^$|()\[\]{}*+?\\])', '\\\1', 'g');
  pattern := esc_path || '(\?token=[^"\\]*)?';

  UPDATE public.posts SET featured_image_url = _new
   WHERE featured_image_url = _old OR position(old_path in coalesce(featured_image_url, '')) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.posts SET content = regexp_replace(content::text, pattern, _new, 'g')::jsonb
   WHERE content IS NOT NULL AND position(old_path in content::text) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.pages SET featured_image_url = _new
   WHERE featured_image_url = _old OR position(old_path in coalesce(featured_image_url, '')) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.pages SET content = regexp_replace(content::text, pattern, _new, 'g')::jsonb
   WHERE content IS NOT NULL AND position(old_path in content::text) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.page_sections SET data = regexp_replace(data::text, pattern, _new, 'g')::jsonb
   WHERE position(old_path in data::text) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.homepage_hero SET background_url = _new
   WHERE background_url = _old OR position(old_path in coalesce(background_url, '')) > 0;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  RETURN affected;
END;
$function$;
