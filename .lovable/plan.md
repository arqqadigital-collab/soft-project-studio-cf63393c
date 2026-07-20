## Goal
1. Track **which page** every form submission came from (Footer CTA + Contact page + any future form).
2. Build a **Submissions Inbox** in the dashboard so you can browse, filter, and export leads without opening Supabase.

---

## Part 1 — Capture the source page

**Database (migration)**
Add two columns to `contact_submissions`:
- `page_path` (text) — e.g. `/ar/من-نحن` or `/healthcare/his`
- `page_title` (text) — e.g. "About Us" or "HIS" (whatever the browser tab shows at submit time)

Both nullable so old rows stay valid. No RLS changes — existing insert policy already allows anonymous inserts.

**Frontend (auto-fill, no user-visible field)**
- `FooterCta.tsx` → include `page_path: window.location.pathname` and `page_title: document.title` in the insert payload.
- `Contact.tsx` → same two fields.
- Wrap in a tiny helper `src/lib/submissionMeta.ts` so future forms use one line.

No UI change on the public site. Nothing shown to visitors.

---

## Part 2 — Submissions Inbox (dashboard)

**New page:** `src/pages/dashboard/Submissions.tsx` at route `/dashboard/submissions`.

**Layout**
```text
Submissions                                       [Export CSV]
────────────────────────────────────────────────────────────
Source: [All ▾]  Page: [All ▾]  Search: [_______]  [Refresh]
────────────────────────────────────────────────────────────
Date        Name        Email           Source        Page          
2026-07-20  Ahmed …     a@x.com         Footer CTA    /ar/about     [View]
2026-07-19  Sara …      s@y.com         Contact form  /contact      [View]
...
```

**Features**
- List newest first, 50 per page, pagination.
- **Filters:** Source (`contact_form` / `footer_cta` / all), Page (dropdown built from distinct `page_path` values), free-text search over name/email/message.
- **Row → drawer:** full details (name, email, phone, area, message, page_path, page_title, source, user_agent, timestamp).
- **Export CSV** of the current filtered view.
- **Mark as read / archived** using existing `status` column on `contact_submissions` (if not present, migration adds it).
- Admin-only via existing `RoleGate`.

**Sidebar entry**
Add "Submissions" under the Content section of `DashboardSidebar.tsx` with an inbox icon.

---

## Technical notes
- Reuses `contact_submissions` — no new table.
- Query built with Supabase JS client (typed, no raw SQL).
- CSV export is client-side (no edge function needed).
- All strings ready for EN/AR toggle if you later want to localize the inbox UI, but the dashboard itself stays LTR/EN per your earlier decision.

---

## Files touched
- **Migration:** add `page_path`, `page_title`, `status` (if missing) to `contact_submissions`.
- **New:** `src/lib/submissionMeta.ts`, `src/pages/dashboard/Submissions.tsx`.
- **Edited:** `src/components/FooterCta.tsx`, `src/pages/Contact.tsx`, `src/components/dashboard/DashboardSidebar.tsx`, `src/pages/Dashboard.tsx` (route registration).

Say **go** and I'll run the migration, then ship the inbox + auto-capture in one pass.