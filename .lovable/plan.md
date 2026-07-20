# Forms Dashboard Tab

Consolidate all form management into one place with editable labels/placeholders in English and Arabic.

## New sidebar entry

Replace the standalone "Submissions" link with a **Forms** section at `/dashboard/forms` containing three sub-tabs:

1. **Submissions** — the existing inbox (moved, not rewritten)
2. **Contact form** — field editor for the `/contact` page form
3. **Footer CTA form** — field editor for the site-wide bottom CTA form

## What's editable per form

For each form, an EN/AR tab lets the admin edit:

- Heading + subheading (Footer CTA only — Contact page already has its own hero)
- Field labels: Name, Email, Phone, Company, Message
- Field placeholders (same 5)
- Submit button label
- Success message (title + body shown after submit)
- Consent/privacy note under the button
- Toggle: which fields are required (name/email always required)

## Where it's stored

New table `form_settings` with one row per form key (`contact_form`, `footer_cta`):

- `key` (unique)
- `labels` jsonb — EN copy
- `labels_ar` jsonb — AR overlay
- `required_fields` text[] 
- `updated_at`

Seeded with the current hardcoded strings so nothing visually changes until an admin edits.

## Runtime wiring

`ContactForm.tsx` reads its copy from `form_settings` via a new `useFormSettings(key)` hook. Falls back to hardcoded defaults if the row is missing. AR overlay applied when `locale === 'ar'`. Auto-translate button on each form editor calls the existing `translate-content` edge function.

## Technical notes

- Migration: create `form_settings` table with GRANTs (admin write / public read), RLS, updated_at trigger, seed 2 rows.
- Files added: `src/pages/dashboard/Forms.tsx` (tabbed shell), `src/pages/dashboard/forms/FormEditor.tsx` (reusable EN/AR editor), `src/hooks/useFormSettings.ts`.
- Files updated: `src/components/ContactForm.tsx` (consume settings), `DashboardSidebar.tsx` (rename entry), `App.tsx` (new route; keep `/dashboard/submissions` redirecting to `/dashboard/forms`).
- No changes to submission storage, email delivery, or spam protection.
