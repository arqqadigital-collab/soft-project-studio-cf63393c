-- Media library upgrades: folders + tags
ALTER TABLE public.media
  ADD COLUMN IF NOT EXISTS folder text NOT NULL DEFAULT 'root',
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS media_folder_idx ON public.media (folder);
CREATE INDEX IF NOT EXISTS media_tags_idx ON public.media USING gin (tags);
