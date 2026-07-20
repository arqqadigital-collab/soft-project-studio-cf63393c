
-- Add blog-parity fields
ALTER TABLE public.case_studies
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS preview_token uuid NOT NULL DEFAULT gen_random_uuid();

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS preview_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}'::text[];

-- Extend SEO enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.seo_entity'::regtype AND enumlabel = 'case_study') THEN
    ALTER TYPE public.seo_entity ADD VALUE 'case_study';
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'public.seo_entity'::regtype AND enumlabel = 'event') THEN
    ALTER TYPE public.seo_entity ADD VALUE 'event';
  END IF;
END $$;

-- Extend content_revisions check constraint
ALTER TABLE public.content_revisions DROP CONSTRAINT IF EXISTS content_revisions_entity_type_check;
ALTER TABLE public.content_revisions
  ADD CONSTRAINT content_revisions_entity_type_check
  CHECK (entity_type IN ('post','page','case_study','event'));

-- Extend slug_redirects check constraint
ALTER TABLE public.slug_redirects DROP CONSTRAINT IF EXISTS slug_redirects_entity_type_check;
ALTER TABLE public.slug_redirects
  ADD CONSTRAINT slug_redirects_entity_type_check
  CHECK (entity_type IN ('post','page','case_study','event'));

-- Snapshot revisions on case_studies / events updates
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
  ELSIF TG_TABLE_NAME = 'case_studies' THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.summary IS DISTINCT FROM OLD.summary
       OR NEW.challenge IS DISTINCT FROM OLD.challenge
       OR NEW.solution IS DISTINCT FROM OLD.solution
       OR NEW.results IS DISTINCT FROM OLD.results
       OR NEW.excerpt IS DISTINCT FROM OLD.excerpt
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.cover_image_url IS DISTINCT FROM OLD.cover_image_url THEN
      INSERT INTO public.content_revisions(entity_type, entity_id, snapshot, editor_id)
      VALUES ('case_study', OLD.id, to_jsonb(OLD), auth.uid());
    END IF;
  ELSIF TG_TABLE_NAME = 'events' THEN
    IF NEW.title IS DISTINCT FROM OLD.title
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.excerpt IS DISTINCT FROM OLD.excerpt
       OR NEW.status IS DISTINCT FROM OLD.status
       OR NEW.cover_image_url IS DISTINCT FROM OLD.cover_image_url THEN
      INSERT INTO public.content_revisions(entity_type, entity_id, snapshot, editor_id)
      VALUES ('event', OLD.id, to_jsonb(OLD), auth.uid());
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_case_studies_revision ON public.case_studies;
CREATE TRIGGER trg_case_studies_revision
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content_revision();

DROP TRIGGER IF EXISTS trg_events_revision ON public.events;
CREATE TRIGGER trg_events_revision
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.snapshot_content_revision();
