
# WordPress-Style CMS Dashboard — Build Plan

Large scope. I'll ship it in **7 review-gated phases**. After each phase you review, then I move to the next. This keeps changes reviewable and avoids one giant unreviewable dump.

Existing `/login`, `/admin`, `/dashboard` auth routing stays untouched — I only layer role checks and nested routes on top.

---

## Phase 1 — Database schema, RLS, auth trigger

Single migration creating everything, with GRANTs + RLS + policies + triggers.

**Enums**
- `app_role`: admin, editor, author, subscriber
- `post_status`: draft, published, scheduled, trashed
- `page_status`: draft, published, trashed
- `page_template`: default, full-width, landing
- `seo_entity`: post, page
- `view_entity`: post, page

**Tables** (all with `created_at` / `updated_at` where spec'd, `updated_at` trigger):
- `profiles` (id = auth.users.id, full_name, avatar_url, bio) — role lives in `user_roles`, NOT here (security requirement)
- `user_roles` (user_id, role) — separate table, queried via `has_role()` SECURITY DEFINER function to avoid RLS recursion
- `categories` (name, slug unique, description, parent_id self-ref)
- `tags` (name, slug unique)
- `posts` (title, slug unique, content, excerpt, featured_image_url, status, author_id → profiles, category_id → categories, published_at)
- `post_tags` (post_id, tag_id) — composite PK
- `pages` (title, slug unique, content, featured_image_url, status, author_id, template, parent_id self-ref)
- `media` (file_name, file_url, file_type, file_size, alt_text, uploaded_by)
- `seo_meta` (entity_type, entity_id, meta_title, meta_description, og_image_url, canonical_url, focus_keyword) — unique on (entity_type, entity_id)
- `page_views` (entity_type, entity_id, viewed_at, referrer)
- `site_settings` (single-row: site_title, site_description, site_logo_url, favicon_url, default_meta_title, default_meta_description)

**Storage**: `media` bucket (public), `branding` bucket (public) for logo/favicon.

**Triggers**
- `handle_new_user()` on `auth.users` insert → creates `profiles` row + `user_roles` row with `subscriber`
- `set_updated_at()` on all mutable tables
- `set_published_at()` on posts when status flips to published

**Security function**
- `public.has_role(_user_id uuid, _role app_role)` — SECURITY DEFINER, stable, `search_path = public`

**RLS policy summary** (enforced at DB, not just UI):
- `profiles`: anyone authed can read; user updates own; admin updates any
- `user_roles`: user reads own; admin manages all (prevents self-promotion)
- `posts`: public reads published; author reads/writes own; editor/admin manage all
- `pages`: same pattern as posts
- `categories` / `tags` / `post_tags`: public read; editor/admin write
- `media`: authed read; uploader manages own; editor/admin manage all
- `seo_meta`: follows parent entity permissions (editor/admin, or author on own post)
- `page_views`: anyone (incl. anon) can INSERT; only admin/editor can SELECT
- `site_settings`: public read; admin write

Every `CREATE TABLE public.*` will be followed by explicit `GRANT` statements in the same migration.

**Storage RLS**: `media` bucket — authed insert, public select, uploader/editor/admin delete/update.

**STOP for review after this migration runs.**

---

## Phase 2 — Dashboard shell + role gating

- Wire React Query provider in `src/main.tsx`
- `src/hooks/use-role.ts` — fetches current user's role from `user_roles`
- `src/components/dashboard/RoleGate.tsx` — redirects unauthorized roles
- Replace current stub `Dashboard.tsx` with a layout using shadcn `Sidebar`:
  - Sidebar: Home, Posts, Pages, Media, Categories & Tags, Users (admin), SEO, Analytics, Settings (admin) — collapsible, mobile drawer via `Sheet`
  - Topbar: global search input (stub), notifications icon, avatar dropdown (profile, logout)
- Nested routes under `/dashboard/*`: `home`, `posts`, `posts/new`, `posts/:id`, `pages`, `pages/new`, `pages/:id`, `media`, `taxonomy`, `users`, `analytics`, `settings`, `profile`
- Home page: 4 stat cards (post/page/user/media counts via `count: 'exact'`), recent activity feed (latest posts + media), "New Post" / "New Page" quick buttons
- Design tokens: neutral palette + single accent — added to `src/styles.css` as semantic tokens, not hardcoded

**STOP for review.**

---

## Phase 3 — Posts module

- `PostsList.tsx`: shadcn `Table`, filters (status/category/author), title search, bulk select → delete / change status, pagination
- `PostEditor.tsx`:
  - Title → auto-slug (editable)
  - WYSIWYG: **TipTap** (`@tiptap/react` + StarterKit + Link + Image) — headings, bold/italic, lists, links, images, embeds
  - Right sidebar: Status, Category `Select`, Tags creatable multi-select, Featured Image (opens Media picker — stub until Phase 4), Publish date/time
  - Tabs: **Content** / **SEO** (SEO tab is a stub until Phase 5)
  - Save Draft / Publish / Preview
  - Autosave every 30s via debounced React Query mutation, only when dirty
- Author role sees only own posts (enforced by RLS; UI mirrors it)

**STOP for review.**

---

## Phase 4 — Pages module + Media Library

**Pages** (mirrors Posts, minus taxonomy):
- Template selector, Parent page dropdown (excludes self + descendants)
- List view: indented tree by `parent_id`

**Media Library**:
- Grid view, upload via drag-and-drop (`react-dropzone`) + file picker → Supabase Storage `media` bucket, insert `media` row
- File modal: preview, editable alt text, copy URL, delete, "used in" (scans posts/pages for URL references)
- Filter by file type, search by name
- `MediaPickerDialog` — reusable modal picker mode consumed by Post/Page editors for featured image

**STOP for review.**

---

## Phase 5 — SEO editor + Categories/Tags

- **SEO tab** inside Post/Page editor (upserts `seo_meta`):
  - Meta title + char counter (60 guidance), meta description + counter (160), focus keyword, OG image picker (defaults to featured), canonical URL
  - Live Google SERP mockup card
- **Categories & Tags** CRUD page: two tables, inline create/edit dialogs, post count per row (via count query)

**STOP for review.**

---

## Phase 6 — Users management + Analytics + Settings

**Users** (admin only, gated by `RoleGate`):
- Table of profiles joined with `user_roles`, avatar, name, email (from `auth.users` via admin edge function), role, joined date
- Invite → **edge function** `invite-user` using service role key (`supabase.auth.admin.inviteUserByEmail`)
- Edit role dropdown → updates `user_roles`
- Deactivate/delete → edge function
- Click row → filtered posts view

**Analytics**:
- Client-side `logPageView()` helper called from public post/page routes
- Analytics page with **recharts**: line (views over time, 7/30/90 toggle), bar (top 5 posts), bar (top 5 pages), total views stat

**Settings** (admin only):
- Form for site title, description, logo upload, favicon upload, default meta title/description → `site_settings`

**STOP for review.**

---

## Phase 7 — Public-facing routes

- `/blog` — grid of published posts (already exists as `Blog.tsx`; either replace or add `/blog-cms` — will confirm during phase)
- `/blog/:slug` — post detail, uses `react-helmet-async` for per-page SEO from `seo_meta` with fallback to `site_settings` defaults; injects favicon/logo
- `/p/:slug` — public pages (avoids clash with existing routes like `/about`, `/careers`)
- Both call `logPageView()` on mount

---

## Technical notes / dependencies

New packages to add across phases: `@tanstack/react-query`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `react-dropzone`, `recharts`, `react-helmet-async`, `date-fns`, `slugify`.

Edge functions: `invite-user`, `delete-user` (both need `SUPABASE_SERVICE_ROLE_KEY`, already in secrets).

Existing pages (Blog, Contact, marketing pages, Header/Footer) are untouched except where Phase 7 needs the `/blog` route — I'll confirm the approach before overwriting.

---

**Ready to implement Phase 1 (schema + RLS + auth trigger) on approval.** I'll stop after the migration runs so you can inspect the DB before I move to Phase 2.
