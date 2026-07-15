
CREATE POLICY "media authed read"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media');

CREATE POLICY "media authed upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND owner = auth.uid());

CREATE POLICY "media uploader/editor/admin update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'media' AND (
      owner = auth.uid()
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'editor')
    )
  );

CREATE POLICY "media uploader/editor/admin delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'media' AND (
      owner = auth.uid()
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'editor')
    )
  );
