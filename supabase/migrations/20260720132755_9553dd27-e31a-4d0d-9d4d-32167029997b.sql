ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS page_path text,
  ADD COLUMN IF NOT EXISTS page_title text;
CREATE INDEX IF NOT EXISTS contact_submissions_page_path_idx ON public.contact_submissions(page_path);
CREATE INDEX IF NOT EXISTS contact_submissions_source_idx ON public.contact_submissions(source);
CREATE INDEX IF NOT EXISTS contact_submissions_status_idx ON public.contact_submissions(status);