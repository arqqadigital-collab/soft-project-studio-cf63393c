
-- Restrict archived nav tables to admins/editors only (deprecated data)
DROP POLICY IF EXISTS "nav_groups public read" ON public._archived_nav_groups;
DROP POLICY IF EXISTS "nav_sections public read" ON public._archived_nav_sections;
DROP POLICY IF EXISTS "nav_items public read" ON public._archived_nav_items;

-- Restrict post_tags public read to only tags of published posts
DROP POLICY IF EXISTS "Post tags public read" ON public.post_tags;
CREATE POLICY "Post tags public read for published posts"
ON public.post_tags
FOR SELECT
TO anon, authenticated
USING (EXISTS (
  SELECT 1 FROM public.posts p
  WHERE p.id = post_tags.post_id AND p.status = 'published'
));
