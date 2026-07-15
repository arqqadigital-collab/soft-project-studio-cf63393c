## Contact page — dashboard integration

Bring the `/contact` page fully under the dashboard so its content, form options, form submissions, and SEO can all be managed without code.

### 1. Database (migration)

New tables in `public` (RLS on, with GRANTs):

- **`contact_page`** — single row (`singleton = true`) holding:
  - Hero: eyebrow, headline, subheadline, background image URL, CTA label/href
  - Form section: heading, subheading, submit button label
  - Quick info cards (JSONB array): `{ icon, title, value, subtitle }`
  - Offices section heading + description
  - Read: public. Write: `admin` / `editor`.

- **`contact_offices`** — one row per office:
  - `city`, `address`, `phone`, `email`, `image_url`, `position` (ordering)
  - Read: public. Write: `admin` / `editor`.

- **`contact_inquiry_areas`** — dropdown options:
  - `label`, `position`, `is_active`
  - Read: public. Write: `admin` / `editor`.

- **`contact_submissions`** — form inbox:
  - `name`, `email`, `phone`, `area`, `message`, `consent`, `status` (`new` / `read` / `archived`), `ip`, `user_agent`, `created_at`
  - Insert: `anon` + `authenticated` (public form).
  - Select / Update / Delete: `admin` / `editor` only.

- Seed all four tables with the current hardcoded content from `src/pages/Contact.tsx` (hero copy, 3 quick info cards, 5 offices, 9 inquiry areas).

- Add `updated_at` triggers on the editable tables.

### 2. Frontend — public `/contact` page

Refactor `src/pages/Contact.tsx` to:

- Fetch `contact_page`, `contact_offices`, `contact_inquiry_areas`, and use them to render the same layout (hero, form, quick info, offices).
- Submit the form to `contact_submissions` (insert as anon), show a success toast, and clear the fields. Validate with zod (name ≤100, email ≤255, phone ≤30, message ≤1000, consent required).
- Keep the existing visual design; only the data source changes.
- Attach `<Helmet>` reading SEO fields from `seo_meta` for `/contact` (falling back to defaults) — matches how other pages already handle SEO.

### 3. Dashboard — new "Contact" section

Add a new item in the dashboard sidebar under content: **Contact**, gated to `admin` + `editor`. Route: `/dashboard/contact`.

Single page with tabs:

- **Page content** — form fields for hero, quick info cards (add/remove/reorder), and form section copy. Media picker for hero background and card icons.
- **Offices** — table + editor: add/edit/delete/reorder offices with a media picker for images.
- **Inquiry areas** — simple add/edit/delete/reorder list with active toggle.
- **Submissions** — inbox table (newest first) showing name, email, phone, area, message, status, timestamp. Row actions: mark read, archive, delete. Filter by status. Export to CSV button.
- **SEO** — reuse existing `SeoEditor` component bound to the `/contact` page's `seo_meta` row.

Wire it into `Dashboard.tsx` routes and the sidebar nav.

### 4. Files touched

- Migration (via migration tool) — new tables, policies, grants, seed data, triggers.
- `src/pages/Contact.tsx` — rewrite to consume Supabase data and submit to `contact_submissions`.
- `src/pages/Dashboard.tsx` — add route.
- `src/pages/dashboard/ContactEditor.tsx` — new (tabs above).
- `src/components/dashboard/Sidebar.tsx` (or wherever nav items live) — add Contact link.

### Out of scope (ask if you want them)

- Email notifications on new submissions (would need an edge function + email provider).
- Spam/CAPTCHA protection.
- Multilingual content.
