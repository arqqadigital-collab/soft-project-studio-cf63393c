
-- Tighten media SELECT to uploader/editor/admin
DROP POLICY IF EXISTS "Authed can read media" ON public.media;
CREATE POLICY "Uploader/editor/admin read media" ON public.media
  FOR SELECT TO authenticated
  USING (auth.uid() = uploaded_by OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Restrict menu_links admin policy to authenticated role
DROP POLICY IF EXISTS "Admins manage menu links" ON public.menu_links;
CREATE POLICY "Admins manage menu links" ON public.menu_links
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow anonymous + authenticated inserts into page_views for analytics
GRANT INSERT ON public.page_views TO anon, authenticated;
CREATE POLICY "Anyone can record page views" ON public.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);
