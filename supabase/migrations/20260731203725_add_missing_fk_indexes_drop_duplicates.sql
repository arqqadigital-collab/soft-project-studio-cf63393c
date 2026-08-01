-- Production readiness audit fixes: add covering indexes for foreign keys
-- that had none (real query-performance risk on category/author filters),
-- and drop confirmed duplicate indexes (zero behavior change — in each
-- pair, one index is a plain, non-constraint-backed duplicate of the other).

CREATE INDEX IF NOT EXISTS idx_case_studies_category_id ON public.case_studies (category_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories (parent_id);
CREATE INDEX IF NOT EXISTS idx_events_category_id ON public.events (category_id);
CREATE INDEX IF NOT EXISTS idx_media_folders_created_by ON public.media_folders (created_by);
CREATE INDEX IF NOT EXISTS idx_pages_author_id ON public.pages (author_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags (tag_id);

-- contact_submissions: idx_contact_submissions_source and
-- contact_submissions_source_idx are identical, non-unique, non-constraint
-- indexes on (source). Keep one.
DROP INDEX IF EXISTS public.idx_contact_submissions_source;

-- slug_redirects: slug_redirects_entity_type_old_slug_key backs the real
-- UNIQUE (entity_type, old_slug) constraint used by ON CONFLICT upserts
-- throughout the app — keep it. slug_redirects_type_old_slug_key is a
-- plain duplicate index with no constraint behind it — safe to drop.
DROP INDEX IF EXISTS public.slug_redirects_type_old_slug_key;
