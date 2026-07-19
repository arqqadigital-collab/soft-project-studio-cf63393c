-- Stop anonymous enumeration of every signed URL in the media library.
DROP POLICY IF EXISTS "Media public read" ON public.media;

CREATE POLICY "Authed can read media"
  ON public.media
  FOR SELECT
  TO authenticated
  USING (true);

REVOKE SELECT ON public.media FROM anon;

-- Tighten storage.objects: drop the broad any-authenticated-user read policy.
-- Media URLs on public pages already carry a signed token, so no API read is needed.
DROP POLICY IF EXISTS "media authed read" ON storage.objects;

CREATE POLICY "media owner/editor/admin read"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'media'
    AND (owner = auth.uid()
         OR public.has_role(auth.uid(), 'admin'::app_role)
         OR public.has_role(auth.uid(), 'editor'::app_role))
  );