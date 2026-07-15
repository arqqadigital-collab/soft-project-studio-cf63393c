
-- 1) Preview tokens for drafts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS preview_token uuid NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS preview_token uuid NOT NULL DEFAULT gen_random_uuid();

-- 2) Content revisions
CREATE TABLE IF NOT EXISTS public.content_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('post','page')),
  entity_id uuid NOT NULL,
  snapshot jsonb NOT NULL,
  editor_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS content_revisions_entity_idx ON public.content_revisions(entity_type, entity_id, created_at DESC);

GRANT SELECT ON public.content_revisions TO authenticated;
GRANT ALL ON public.content_revisions TO service_role;

ALTER TABLE public.content_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors/admins read all revisions" ON public.content_revisions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Authors read own post revisions" ON public.content_revisions
  FOR SELECT TO authenticated
  USING (
    entity_type = 'post' AND EXISTS (
      SELECT 1 FROM public.posts p WHERE p.id = content_revisions.entity_id AND p.author_id = auth.uid()
    )
  );

-- Snapshot trigger — captures the OLD row on every UPDATE
CREATE OR REPLACE FUNCTION public.snapshot_content_revision()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_TABLE_NAME = 'posts' THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.content IS DISTINCT FROM OLD.content
       OR NEW.excerpt IS DISTINCT FROM OLD.excerpt
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.featured_image_url IS DISTINCT FROM OLD.featured_image_url THEN
      INSERT INTO public.content_revisions(entity_type, entity_id, snapshot, editor_id)
      VALUES ('post', OLD.id, to_jsonb(OLD), auth.uid());
    END IF;
  ELSIF TG_TABLE_NAME = 'pages' THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.content IS DISTINCT FROM OLD.content
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.featured_image_url IS DISTINCT FROM OLD.featured_image_url THEN
      INSERT INTO public.content_revisions(entity_type, entity_id, snapshot, editor_id)
      VALUES ('page', OLD.id, to_jsonb(OLD), auth.uid());
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_posts_revision ON public.posts;
CREATE TRIGGER trg_posts_revision
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content_revision();

DROP TRIGGER IF EXISTS trg_pages_revision ON public.pages;
CREATE TRIGGER trg_pages_revision
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content_revision();

-- 3) Admin audit log
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  target_user_id uuid,
  metadata jsonb,
  ip text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_log_created_idx ON public.admin_audit_log(created_at DESC);

GRANT SELECT ON public.admin_audit_log TO authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4) page_views deduplication
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS viewer_hash text;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS viewed_day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date;
CREATE UNIQUE INDEX IF NOT EXISTS page_views_dedupe_idx
  ON public.page_views(entity_type, entity_id, viewer_hash, viewed_day)
  WHERE viewer_hash IS NOT NULL;

-- Force logging through the edge function (service role) — remove anon/authenticated insert
DROP POLICY IF EXISTS "Anyone can log a view" ON public.page_views;
REVOKE INSERT ON public.page_views FROM anon, authenticated;
