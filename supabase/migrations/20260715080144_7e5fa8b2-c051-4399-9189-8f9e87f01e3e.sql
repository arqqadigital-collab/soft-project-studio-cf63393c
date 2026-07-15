
-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'author', 'subscriber');
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'scheduled', 'trashed');
CREATE TYPE public.page_status AS ENUM ('draft', 'published', 'trashed');
CREATE TYPE public.page_template AS ENUM ('default', 'full-width', 'landing');
CREATE TYPE public.seo_entity AS ENUM ('post', 'page');
CREATE TYPE public.view_entity AS ENUM ('post', 'page');

-- =========================================================================
-- UTILITY: updated_at trigger fn
-- =========================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================================
-- PROFILES
-- =========================================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- USER_ROLES (separate table, never on profiles)
-- =========================================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer role checker to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- =========================================================================
-- PROFILES policies
-- =========================================================================
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- USER_ROLES policies
-- =========================================================================
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================================
-- CATEGORIES
-- =========================================================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_categories_updated
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Categories are public"
  ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors/admins manage categories"
  ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- =========================================================================
-- TAGS
-- =========================================================================
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tags TO authenticated;
GRANT ALL ON public.tags TO service_role;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_tags_updated
BEFORE UPDATE ON public.tags
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Tags are public"
  ON public.tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Editors/admins/authors manage tags"
  ON public.tags FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'author')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR public.has_role(auth.uid(), 'author')
  );

-- =========================================================================
-- POSTS
-- =========================================================================
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  featured_image_url TEXT,
  status public.post_status NOT NULL DEFAULT 'draft',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_posts_updated
BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-set published_at when status becomes 'published'
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status IS DISTINCT FROM 'published') AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_posts_publish
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION public.set_published_at();

CREATE POLICY "Public reads published posts"
  ON public.posts FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Authors read own posts"
  ON public.posts FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Editors/admins read all posts"
  ON public.posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Authors insert own posts"
  ON public.posts FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND (
      public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'editor')
      OR public.has_role(auth.uid(), 'author')
    )
  );
CREATE POLICY "Authors update own posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Editors/admins update all posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Authors delete own posts"
  ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Editors/admins delete all posts"
  ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- =========================================================================
-- POST_TAGS
-- =========================================================================
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
GRANT SELECT ON public.post_tags TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_tags TO authenticated;
GRANT ALL ON public.post_tags TO service_role;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Post tags public read"
  ON public.post_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Post owner or editor/admin manage post tags"
  ON public.post_tags FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.author_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  );

-- =========================================================================
-- PAGES
-- =========================================================================
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  featured_image_url TEXT,
  status public.page_status NOT NULL DEFAULT 'draft',
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template public.page_template NOT NULL DEFAULT 'default',
  parent_id UUID REFERENCES public.pages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_pages_updated
BEFORE UPDATE ON public.pages
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Public reads published pages"
  ON public.pages FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Authors read own pages"
  ON public.pages FOR SELECT TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Editors/admins read all pages"
  ON public.pages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Editors/admins insert pages"
  ON public.pages FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = author_id AND (
      public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
    )
  );
CREATE POLICY "Editors/admins update pages"
  ON public.pages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));
CREATE POLICY "Editors/admins delete pages"
  ON public.pages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- =========================================================================
-- MEDIA
-- =========================================================================
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  alt_text TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_media_updated
BEFORE UPDATE ON public.media
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Media public read"
  ON public.media FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Authed users can upload media"
  ON public.media FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Uploader/editor/admin update media"
  ON public.media FOR UPDATE TO authenticated
  USING (
    auth.uid() = uploaded_by
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    auth.uid() = uploaded_by
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  );
CREATE POLICY "Uploader/editor/admin delete media"
  ON public.media FOR DELETE TO authenticated
  USING (
    auth.uid() = uploaded_by
    OR public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
  );

-- =========================================================================
-- SEO_META
-- =========================================================================
CREATE TABLE public.seo_meta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type public.seo_entity NOT NULL,
  entity_id UUID NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  focus_keyword TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id)
);
GRANT SELECT ON public.seo_meta TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_meta TO authenticated;
GRANT ALL ON public.seo_meta TO service_role;
ALTER TABLE public.seo_meta ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_seo_meta_updated
BEFORE UPDATE ON public.seo_meta
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "SEO meta public read"
  ON public.seo_meta FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "SEO meta managed by author or editor/admin"
  ON public.seo_meta FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR (
      entity_type = 'post' AND EXISTS (
        SELECT 1 FROM public.posts p WHERE p.id = entity_id AND p.author_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin')
    OR public.has_role(auth.uid(), 'editor')
    OR (
      entity_type = 'post' AND EXISTS (
        SELECT 1 FROM public.posts p WHERE p.id = entity_id AND p.author_id = auth.uid()
      )
    )
  );

-- =========================================================================
-- PAGE_VIEWS
-- =========================================================================
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type public.view_entity NOT NULL,
  entity_id UUID NOT NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  referrer TEXT
);
GRANT INSERT ON public.page_views TO anon, authenticated;
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a view"
  ON public.page_views FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Editors/admins read analytics"
  ON public.page_views FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE INDEX idx_page_views_entity ON public.page_views (entity_type, entity_id);
CREATE INDEX idx_page_views_viewed_at ON public.page_views (viewed_at);

-- =========================================================================
-- SITE_SETTINGS (singleton)
-- =========================================================================
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title TEXT,
  site_description TEXT,
  site_logo_url TEXT,
  favicon_url TEXT,
  default_meta_title TEXT,
  default_meta_description TEXT,
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_site_settings_updated
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Site settings public read"
  ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (site_title, site_description)
VALUES ('My CMS', 'Powered by Lovable');

-- =========================================================================
-- AUTH SIGNUP TRIGGER: create profile + assign subscriber role
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'subscriber');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: create profiles + subscriber role for any existing users
INSERT INTO public.profiles (id, full_name)
SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email)
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'subscriber'::public.app_role
FROM auth.users u
LEFT JOIN public.user_roles r ON r.user_id = u.id
WHERE r.user_id IS NULL;

-- =========================================================================
-- Helpful indexes
-- =========================================================================
CREATE INDEX idx_posts_status ON public.posts (status);
CREATE INDEX idx_posts_author ON public.posts (author_id);
CREATE INDEX idx_posts_category ON public.posts (category_id);
CREATE INDEX idx_pages_status ON public.pages (status);
CREATE INDEX idx_pages_parent ON public.pages (parent_id);
CREATE INDEX idx_media_uploader ON public.media (uploaded_by);
