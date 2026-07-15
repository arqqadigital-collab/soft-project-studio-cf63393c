# Page Builder — Pattern + HIS Pilot

Reusable section-based editor for every page. Ship the framework this turn and use **Hospital Information System (HIS)** as the pilot page. Once you approve, we roll the same setup to the other 40+ pages.

## Data model

New table `page_sections`:

- `id` uuid
- `page_id` uuid → `pages` (cascade)
- `kind` text — which section component to render (`hero`, `features`, `stats`, `cta`, `richtext`, `media`, `logos`, `faq`)
- `position` int
- `is_visible` bool
- `data` jsonb — the section's editable fields (title, subtitle, image, items, etc.)
- standard timestamps

Public read; admin/editor write. Standard GRANTs + RLS.

## Section registry

`src/lib/pageSections.tsx` — a single registry mapping `kind` → { label, defaultData, Render, Edit }.

Initial kinds (covers 90% of the existing static pages):

- **hero** — eyebrow, headline, subheadline, media (image or video), CTA
- **features** — heading, subheading, list of feature cards `{ icon, title, description }`
- **stats** — heading, list of stats `{ label, value, suffix }`
- **richtext** — free HTML/markdown block (uses existing RichTextEditor)
- **media** — image or video with caption
- **logos** — heading + logo grid
- **cta** — headline, body, primary/secondary buttons, background media
- **faq** — heading + list of `{ q, a }`

Each section pulls colors, fonts, and spacing from existing design tokens so pages stay on-brand.

## Dashboard editor

New `src/pages/dashboard/PageBuilder.tsx` (or extend `PageEditor` with a "Builder" tab):

- Top: page title, slug, status, nav section (already existing).
- New **Builder** tab: vertical list of sections with drag-handle, reorder up/down, hide/show, delete, and an "Add section" button that opens a picker with the registry.
- Each section row expands into its form (`Edit` component from the registry) — same MediaPicker used elsewhere for images/videos.
- Live preview iframe alongside (same pattern as `SectionPreview` used in `HomepageEditor`).

## Public rendering

New `src/components/PageRenderer.tsx` — fetches the page's sections and renders each via the registry's `Render`. The `PublicPage` route uses this whenever the page has any `page_sections` rows; otherwise it falls back to the existing rich-text content.

## Pilot: HIS

- Import the current `src/pages/HIS.tsx` content into `page_sections` rows for the HIS page (hero + a few features/stats/cta) so the dashboard immediately shows the real page structure.
- Swap the `/healthcare/his` route to render via `PageRenderer`. The visual output should match today's static HIS closely.

## Rollout after approval (not this turn)

Repeat the same seed step for each remaining static page: read its JSX, translate to section rows, swap its route to `PageRenderer`. Delete the static file once verified. Straightforward per-page work.

## Files this turn

- Migration: create `page_sections`, seed HIS.
- New: `src/lib/pageSections.tsx`, `src/components/PageRenderer.tsx`, `src/components/dashboard/PageBuilder.tsx`.
- Edited: `src/pages/dashboard/PageEditor.tsx` (add Builder tab), `src/pages/PublicPage.tsx` (use renderer), route for `/healthcare/his`.
