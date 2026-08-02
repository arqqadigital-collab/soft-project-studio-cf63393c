-- Performance fix: RLS policies were calling auth.uid() / has_role(auth.uid(), ...)
-- unwrapped, which Postgres re-evaluates for every row scanned instead of once
-- per query. Wrapping the call as (select auth.uid()) lets the planner treat it
-- as a stable InitPlan, evaluated once. This is a pure performance change —
-- every policy's actual access-control logic is byte-for-byte identical,
-- only the auth.uid() call sites are wrapped. Matches the 66 findings from
-- Supabase's own performance advisor (auth_rls_initplan).

-- _archived_nav_groups
ALTER POLICY "nav_groups admin write" ON public._archived_nav_groups
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- _archived_nav_items
ALTER POLICY "nav_items admin write" ON public._archived_nav_items
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- _archived_nav_sections
ALTER POLICY "nav_sections admin write" ON public._archived_nav_sections
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- admin_audit_log
ALTER POLICY "Admins read audit log" ON public.admin_audit_log
  USING (has_role((select auth.uid()), 'admin'::app_role));

-- case_studies
ALTER POLICY "Editors can view all case studies" ON public.case_studies
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors manage case studies" ON public.case_studies
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- categories
ALTER POLICY "Editors/admins manage categories" ON public.categories
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- contact_inquiry_areas
ALTER POLICY "Admins/editors manage inquiry areas" ON public.contact_inquiry_areas
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- contact_offices
ALTER POLICY "Admins/editors manage offices" ON public.contact_offices
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- contact_page
ALTER POLICY "Admins/editors manage contact page" ON public.contact_page
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- contact_submissions
ALTER POLICY "Admins/editors delete submissions" ON public.contact_submissions
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins/editors read submissions" ON public.contact_submissions
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins/editors update submissions" ON public.contact_submissions
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- content_revisions
ALTER POLICY "Authors read own post revisions" ON public.content_revisions
  USING (
    (entity_type = 'post'::text) AND (EXISTS (
      SELECT 1 FROM posts p WHERE p.id = content_revisions.entity_id AND p.author_id = (select auth.uid())
    ))
  );
ALTER POLICY "Editors/admins read all revisions" ON public.content_revisions
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- events
ALTER POLICY "Editors can view all events" ON public.events
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors manage events" ON public.events
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- form_settings
ALTER POLICY "form_settings delete" ON public.form_settings
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "form_settings insert" ON public.form_settings
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "form_settings update" ON public.form_settings
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- header_footer_settings
ALTER POLICY "Editors manage header/footer" ON public.header_footer_settings
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- homepage_hero
ALTER POLICY "Admins and editors can insert hero" ON public.homepage_hero
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins and editors can update hero" ON public.homepage_hero
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- homepage_sections
ALTER POLICY "Admins and editors manage homepage sections" ON public.homepage_sections
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- list_page_hero
ALTER POLICY "Admin/editor write list_page_hero" ON public.list_page_hero
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- media
ALTER POLICY "Authed users can upload media" ON public.media
  WITH CHECK ((select auth.uid()) = uploaded_by);
ALTER POLICY "Uploader/editor/admin delete media" ON public.media
  USING (
    (select auth.uid()) = uploaded_by
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
  );
ALTER POLICY "Uploader/editor/admin update media" ON public.media
  USING (
    (select auth.uid()) = uploaded_by
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
  )
  WITH CHECK (
    (select auth.uid()) = uploaded_by
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
  );
ALTER POLICY "Uploader/editor/admin/seo_specialist read media" ON public.media
  USING (
    (select auth.uid()) = uploaded_by
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
  );

-- media_folders
ALTER POLICY "Admin/editor manage media folders" ON public.media_folders
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Authed users read media folders" ON public.media_folders
  USING ((select auth.uid()) IS NOT NULL);

-- menu_columns
ALTER POLICY "menu_columns editors manage" ON public.menu_columns
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- menu_groups
ALTER POLICY "menu_groups editors manage" ON public.menu_groups
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- menu_links
ALTER POLICY "Admins manage menu links" ON public.menu_links
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));

-- not_found_log
ALTER POLICY "Admins and editors can delete 404 log" ON public.not_found_log
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins and editors can read 404 log" ON public.not_found_log
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins and editors can update 404 log" ON public.not_found_log
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- page_sections
ALTER POLICY "page_sections admin write" ON public.page_sections
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- page_views
ALTER POLICY "Editors/admins read analytics" ON public.page_views
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- pages
ALTER POLICY "Authors read own pages" ON public.pages
  USING ((select auth.uid()) = author_id);
ALTER POLICY "Editors/admins delete pages" ON public.pages
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors/admins insert pages" ON public.pages
  WITH CHECK (
    (select auth.uid()) = author_id
    AND (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  );
ALTER POLICY "Editors/admins read all pages" ON public.pages
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors/admins update pages" ON public.pages
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- post_tags
ALTER POLICY "Post owner or editor/admin manage post tags" ON public.post_tags
  USING (
    (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_tags.post_id AND p.author_id = (select auth.uid())))
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
  )
  WITH CHECK (
    (EXISTS (SELECT 1 FROM posts p WHERE p.id = post_tags.post_id AND p.author_id = (select auth.uid())))
    OR has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
  );

-- posts
ALTER POLICY "Authors delete own posts" ON public.posts
  USING ((select auth.uid()) = author_id);
ALTER POLICY "Authors insert own posts" ON public.posts
  WITH CHECK (
    (select auth.uid()) = author_id
    AND (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  );
ALTER POLICY "Authors read own posts" ON public.posts
  USING ((select auth.uid()) = author_id);
ALTER POLICY "Authors update own posts" ON public.posts
  USING ((select auth.uid()) = author_id)
  WITH CHECK ((select auth.uid()) = author_id);
ALTER POLICY "Editors/admins delete all posts" ON public.posts
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors/admins read all posts" ON public.posts
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Editors/admins update all posts" ON public.posts
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- profiles
ALTER POLICY "Admins and editors can view all profiles" ON public.profiles
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));
ALTER POLICY "Admins can delete profiles" ON public.profiles
  USING (has_role((select auth.uid()), 'admin'::app_role));
ALTER POLICY "Admins can update any profile" ON public.profiles
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));
ALTER POLICY "Users can insert their own profile" ON public.profiles
  WITH CHECK ((select auth.uid()) = id);
ALTER POLICY "Users can update own profile" ON public.profiles
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);
ALTER POLICY "Users can view their own profile" ON public.profiles
  USING ((select auth.uid()) = id);

-- route_map
ALTER POLICY "route_map admin/editor write" ON public.route_map
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- seo_meta
ALTER POLICY "SEO meta managed by editor/admin/seo_specialist or post author" ON public.seo_meta
  USING (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
    OR (
      entity_type = 'post'::seo_entity
      AND EXISTS (SELECT 1 FROM posts p WHERE p.id = seo_meta.entity_id AND p.author_id = (select auth.uid()))
    )
  )
  WITH CHECK (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
    OR (
      entity_type = 'post'::seo_entity
      AND EXISTS (SELECT 1 FROM posts p WHERE p.id = seo_meta.entity_id AND p.author_id = (select auth.uid()))
    )
  );

-- site_settings
ALTER POLICY "Admins/editors/seo_specialist manage site settings" ON public.site_settings
  USING (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
  )
  WITH CHECK (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
  );

-- slug_redirects
ALTER POLICY "Editors/admins/seo_specialist manage redirects" ON public.slug_redirects
  USING (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
  )
  WITH CHECK (
    has_role((select auth.uid()), 'admin'::app_role)
    OR has_role((select auth.uid()), 'editor'::app_role)
    OR has_role((select auth.uid()), 'seo_specialist'::app_role)
  );

-- tags
ALTER POLICY "Editors/admins manage tags" ON public.tags
  USING (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role) OR has_role((select auth.uid()), 'editor'::app_role));

-- user_roles
ALTER POLICY "Admins can manage roles" ON public.user_roles
  USING (has_role((select auth.uid()), 'admin'::app_role))
  WITH CHECK (has_role((select auth.uid()), 'admin'::app_role));
ALTER POLICY "Admins can view all roles" ON public.user_roles
  USING (has_role((select auth.uid()), 'admin'::app_role));
ALTER POLICY "Users can view their own roles" ON public.user_roles
  USING ((select auth.uid()) = user_id);
