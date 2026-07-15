# Nav-Driven Pages & Mega Menu

Rebuild the Pages area so it mirrors the site's mega-menu structure, and make the public header render from that same data.

## Data model (new tables)

Three-level tree:

```text
nav_groups (HealthCare, ERP & Business, Services, Company)
   └─ nav_sections (Hospital & Clinical Systems, Specialized Clinical Modules, …)
         └─ pages (Hospital Information System, Clinic Management, …)
```

New tables:

- `nav_groups` — `id, label, slug, position, is_visible`
- `nav_sections` — `id, group_id → nav_groups, label, description, position, is_visible`
- `pages` — add `section_id → nav_sections (nullable)`, `nav_label` (short label for menu), `position`

All three: admin/editor write, public read. Standard GRANTs + RLS.

## Dashboard: Pages workspace

Replace the flat `PagesList` with a two-pane manager at `/dashboard/pages`:

- Left tree
  - Groups (collapsible), each with its Sections, each with its Pages.
  - Inline actions per row: rename, add child, delete, drag-handle for reorder.
  - Buttons: **+ Group**, **+ Section** (inside a group), **+ Page** (inside a section).
- Right pane
  - Selecting a page opens the existing `PageEditor` inline (or navigates to `/dashboard/pages/:id`).
  - Selecting a group/section shows a small form: label, description, visibility, position.

Seed the current 4 groups + their sections from `MainNav.tsx` on first migration so the tree isn't empty. User can then edit freely.

## Public header (MainNav)

Rewrite `MainNav.tsx` to fetch groups → sections → pages from Supabase (single query, cached with React Query). Same visual mega-menu layout as today; hidden groups/sections/pages are skipped. Falls back to the hardcoded menu while loading.

Page URLs continue to use each page's existing `slug` (`/{slug}`), so already-created routes keep working.

## Sidebar entry

`Pages` sidebar item stays; it now points to the new tree manager. `New Page` quick action prompts for the target section.

## Out of scope

- No changes to Posts, Media, SEO, Settings.
- No change to public page routing/rendering — only how pages are grouped and how the menu is built.
- Reordering uses simple up/down buttons first; drag-and-drop can come later.

## Files touched

- Migration: create `nav_groups`, `nav_sections`, alter `pages`, seed data.
- New: `src/pages/dashboard/PagesManager.tsx`, `src/components/dashboard/NavTree.tsx`.
- Edited: `src/pages/dashboard/PagesList.tsx` (replaced by manager route), `src/components/MainNav.tsx` (data-driven), `src/pages/dashboard/PageEditor.tsx` (add section picker).
