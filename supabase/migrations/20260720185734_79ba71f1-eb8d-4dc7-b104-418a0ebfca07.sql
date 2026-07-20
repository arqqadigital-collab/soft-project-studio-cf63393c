ALTER TABLE public.categories
ADD COLUMN content_type text NOT NULL DEFAULT 'blog';

CREATE OR REPLACE FUNCTION public.validate_category_content_type()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.content_type NOT IN ('blog', 'case_study', 'event') THEN
    RAISE EXCEPTION 'Invalid category content type: %', NEW.content_type;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_category_content_type_before_write
BEFORE INSERT OR UPDATE OF content_type ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.validate_category_content_type();

ALTER TABLE public.categories DROP CONSTRAINT categories_slug_key;
ALTER TABLE public.categories
ADD CONSTRAINT categories_content_type_slug_key UNIQUE (content_type, slug);

CREATE INDEX categories_content_type_name_idx
ON public.categories (content_type, name);