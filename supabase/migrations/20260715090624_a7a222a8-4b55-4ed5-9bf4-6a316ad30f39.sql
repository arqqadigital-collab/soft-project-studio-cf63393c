
-- 1) Per-post/page indexing toggles
ALTER TABLE public.seo_meta
  ADD COLUMN IF NOT EXISTS noindex boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS nofollow boolean NOT NULL DEFAULT false;

-- 2) Site URL for absolute links in sitemap/RSS
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS site_url text;

-- 3) Slug redirects
CREATE TABLE IF NOT EXISTS public.slug_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('post','page')),
  entity_id uuid,
  old_slug text NOT NULL,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, old_slug)
);
CREATE INDEX IF NOT EXISTS slug_redirects_lookup_idx ON public.slug_redirects(entity_type, old_slug);

GRANT SELECT ON public.slug_redirects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.slug_redirects TO authenticated;
GRANT ALL ON public.slug_redirects TO service_role;

ALTER TABLE public.slug_redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read redirects" ON public.slug_redirects
  FOR SELECT USING (true);

CREATE POLICY "Editors/admins manage redirects" ON public.slug_redirects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- 4) Automatic slug-change capture
CREATE OR REPLACE FUNCTION public.capture_slug_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  et text := CASE WHEN TG_TABLE_NAME = 'posts' THEN 'post' ELSE 'page' END;
BEGIN
  IF NEW.slug IS DISTINCT FROM OLD.slug AND OLD.slug IS NOT NULL AND length(OLD.slug) > 0 THEN
    -- Remove any redirect whose old_slug matches the NEW slug (avoids loops)
    DELETE FROM public.slug_redirects WHERE entity_type = et AND old_slug = NEW.slug;
    -- Upsert the OLD -> NEW mapping
    INSERT INTO public.slug_redirects(entity_type, entity_id, old_slug, new_slug)
    VALUES (et, NEW.id, OLD.slug, NEW.slug)
    ON CONFLICT (entity_type, old_slug) DO UPDATE
      SET new_slug = EXCLUDED.new_slug, entity_id = EXCLUDED.entity_id, created_at = now();
    -- Update any chains: if some other row pointed to OLD.slug as new_slug, point it to NEW.slug
    UPDATE public.slug_redirects
      SET new_slug = NEW.slug
      WHERE entity_type = et AND new_slug = OLD.slug;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.capture_slug_change() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_posts_slug_change ON public.posts;
CREATE TRIGGER trg_posts_slug_change
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.capture_slug_change();

DROP TRIGGER IF EXISTS trg_pages_slug_change ON public.pages;
CREATE TRIGGER trg_pages_slug_change
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.capture_slug_change();
