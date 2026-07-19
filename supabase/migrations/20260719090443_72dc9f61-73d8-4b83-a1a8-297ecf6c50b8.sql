CREATE OR REPLACE FUNCTION public.find_media_usage(_url text)
RETURNS TABLE (entity_type text, entity_id uuid, title text, slug text)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT 'post'::text, p.id, p.title, p.slug FROM public.posts p
  WHERE p.featured_image_url = _url OR (p.content IS NOT NULL AND p.content::text ILIKE '%' || _url || '%')
  UNION ALL
  SELECT 'page'::text, pg.id, pg.title, pg.slug FROM public.pages pg
  WHERE pg.featured_image_url = _url OR (pg.content IS NOT NULL AND pg.content::text ILIKE '%' || _url || '%')
  UNION ALL
  SELECT 'page_section'::text, ps.page_id, pg2.title, pg2.slug
  FROM public.page_sections ps JOIN public.pages pg2 ON pg2.id = ps.page_id
  WHERE ps.data::text ILIKE '%' || _url || '%'
  UNION ALL
  SELECT 'homepage_hero'::text, hh.id, 'Homepage Hero'::text, ''::text
  FROM public.homepage_hero hh WHERE hh.background_url = _url;
$$;
GRANT EXECUTE ON FUNCTION public.find_media_usage(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.replace_media_url(_old text, _new text)
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER SET search_path = public AS $$
DECLARE affected integer := 0; n integer;
BEGIN
  IF _old IS NULL OR _new IS NULL OR length(_old) = 0 THEN RETURN 0; END IF;

  UPDATE public.posts SET featured_image_url = _new WHERE featured_image_url = _old;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.posts SET content = replace(content::text, _old, _new)::jsonb
   WHERE content IS NOT NULL AND content::text ILIKE '%' || _old || '%';
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.pages SET featured_image_url = _new WHERE featured_image_url = _old;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.pages SET content = replace(content::text, _old, _new)::jsonb
   WHERE content IS NOT NULL AND content::text ILIKE '%' || _old || '%';
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.page_sections SET data = replace(data::text, _old, _new)::jsonb
   WHERE data::text ILIKE '%' || _old || '%';
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  UPDATE public.homepage_hero SET background_url = _new WHERE background_url = _old;
  GET DIAGNOSTICS n = ROW_COUNT; affected := affected + n;

  RETURN affected;
END;
$$;
GRANT EXECUTE ON FUNCTION public.replace_media_url(text, text) TO authenticated;
