-- Replace the unused "author" role with "seo_specialist"; grant it access to
-- SEO-related tables. "subscriber" remains as an inert, unreachable enum
-- label (Postgres cannot drop enum values) but is removed from all app code.

ALTER TYPE app_role RENAME VALUE 'author' TO 'seo_specialist';

-- Tags/posts policies previously included the (now renamed) role; scope back
-- down to admin/editor only.
DROP POLICY IF EXISTS "Editors/admins/authors manage tags" ON public.tags;
CREATE POLICY "Editors/admins manage tags" ON public.tags
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role));

DROP POLICY IF EXISTS "Authors insert own posts" ON public.posts;
CREATE POLICY "Authors insert own posts" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role)));

-- seo_meta: admin/editor/seo_specialist, or the post's own author
DROP POLICY IF EXISTS "SEO meta managed by author or editor/admin" ON public.seo_meta;
CREATE POLICY "SEO meta managed by editor/admin/seo_specialist or post author" ON public.seo_meta
  FOR ALL TO authenticated
  USING (
    has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role)
    OR (entity_type = 'post'::seo_entity AND EXISTS (SELECT 1 FROM posts p WHERE p.id = seo_meta.entity_id AND p.author_id = auth.uid()))
  )
  WITH CHECK (
    has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role)
    OR (entity_type = 'post'::seo_entity AND EXISTS (SELECT 1 FROM posts p WHERE p.id = seo_meta.entity_id AND p.author_id = auth.uid()))
  );

-- slug_redirects: admin/editor/seo_specialist
DROP POLICY IF EXISTS "Editors/admins manage redirects" ON public.slug_redirects;
CREATE POLICY "Editors/admins/seo_specialist manage redirects" ON public.slug_redirects
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role));

-- site_settings: was admin-only (a pre-existing gap since editor already had
-- UI access to the SEO tab that writes here); now admin/editor/seo_specialist
DROP POLICY IF EXISTS "Admins manage site settings" ON public.site_settings;
CREATE POLICY "Admins/editors/seo_specialist manage site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role));

-- media: let seo_specialist browse the library to pick OG images
DROP POLICY IF EXISTS "Uploader/editor/admin read media" ON public.media;
CREATE POLICY "Uploader/editor/admin/seo_specialist read media" ON public.media
  FOR SELECT TO authenticated
  USING (auth.uid() = uploaded_by OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'editor'::app_role) OR has_role(auth.uid(),'seo_specialist'::app_role));
