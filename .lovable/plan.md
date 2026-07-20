
# Independent Arabic Version (/ar/*) — Implementation Plan

## Goal
Ship a fully independent Arabic site living under `/ar/...` with Arabic slugs editable from the CMS, forced RTL on every Arabic route, and animations that mirror correctly. English (`/...`) stays untouched.

---

## 1. Routing model

- Keep the current English routes exactly as they are.
- Add a parallel `/ar` route tree that renders the same page components but locks the locale to `ar` and direction to `rtl`.
- Two flavors of Arabic routes:
  - **Static pages** (Home, About, Contact, Blog list, Case Studies list, Events list, Careers, all Healthcare/ERP/Services product pages): each English route gets an Arabic twin whose path segment comes from a new CMS field `slug_ar`. Example: `/healthcare/his` ⇄ `/ar/الرعاية-الصحية/نظام-معلومات-المستشفى`.
  - **Dynamic detail pages** (`/blog/:slug`, `/case-studies/:slug`, `/events/:slug`, `/p/:slug`): Arabic equivalents live at `/ar/blog/:slug_ar`, etc., resolved from a per-entity `slug_ar` field.

Router layout:

```text
<Routes>
  <Route element={<LocaleLayout locale="en" />}> ...current tree... </Route>
  <Route path="/ar" element={<LocaleLayout locale="ar" />}>
     ...same page components, resolved by ar slug...
  </Route>
</Routes>
```

`LocaleLayout` sets `i18n.language`, `dir="rtl"` on `<html>`, and provides a `LocaleContext` so all hooks (including `use-horizontal-scroll`) react instantly.

## 2. Data model changes (Supabase)

Add Arabic slug + path columns where needed (all nullable, unique per locale):

- `pages`: `slug_ar text unique`
- `posts`: `slug_ar text unique`
- `case_studies`: `slug_ar text unique`
- `events`: `slug_ar text unique`
- `slug_redirects`: add `locale text default 'en'` so old ⇄ new works per language.
- `menu_links`: already translatable via `translations` JSONB; add optional `href_ar text` for links that must point to a different Arabic path.
- New table `route_map` (or reuse `pages.slug_ar` for built-in product routes) mapping each built-in English route key (e.g. `healthcare.his`) → `{ slug_ar, title_ar }`. This is what lets the CMS edit Arabic paths for hardcoded product pages.

All new columns get proper GRANTs and RLS mirrored from existing columns.

## 3. CMS additions (no style changes)

- **Page/Post/Case Study/Event editors**: add an "Arabic slug" input beside the English slug inside the existing AR tab. Auto-suggest from Arabic title using a transliteration-safe slugifier (keep Arabic letters, strip punctuation, replace spaces with `-`).
- **Built-in routes editor** (new small screen under Dashboard → Pages & Navigation → "Built-in routes"): a table of the 32 hardcoded product routes with `English path`, `Arabic path`, `Arabic title`. Saves to `route_map`.
- Header/Footer editor already supports AR labels; wire link resolution to prefer `href_ar` when locale is `ar`.

## 4. Language switcher behavior

- On any English URL, switcher jumps to the mapped `/ar/...` URL (looked up from `route_map` or the entity's `slug_ar`). Falls back to `/ar/` (Arabic home) if no mapping exists.
- Same in reverse from AR → EN.
- Remove the "locale is a client toggle" behavior — locale is now derived from URL prefix.

## 5. RTL + animations

- Force `dir="rtl"` and `lang="ar"` at `LocaleLayout` level for every `/ar/*` route (dashboard stays LTR as today).
- Audit and fix any remaining physical CSS (`left-*`, `right-*`, `ml-*`, `mr-*`, `translate-x`, `origin-left`) in shared components; convert to logical utilities (`start/end`, `ms/me`, `origin-inline-start`).
- Framer Motion: sweep every horizontal `x:` animation. Anything driven by `useHorizontalScroll` already flips; other one-off `x` transforms (hero marquees, card reveals, drawer slide-ins) get an `isRTL ? -v : v` wrapper via a small `useDirX(v)` helper.
- Icons that imply direction (`ArrowRight`, `ChevronRight`) get `rtl:-scale-x-100` where they mean "next/forward".
- Header mobile drawer already reads `mobile_drawer_side` — on AR default to opposite side.

## 6. SEO

- `<html lang>` and `dir` set per route.
- Each page emits `<link rel="alternate" hreflang="en" href="…"/>` and `hreflang="ar"`, plus `x-default` → EN.
- Canonical points to the locale-specific URL.
- Sitemap edge function updated to emit both EN and AR URLs with hreflang annotations.

## 7. Migration / backfill

- Add columns via one migration (with GRANTs and RLS mirrored).
- Backfill `slug_ar` for every existing page/post/case study/event by auto-transliterating the Arabic title (using the existing `translate-content` edge function output where available); admins can edit afterwards.
- Seed `route_map` with Arabic paths for the 32 built-in product routes using existing AR translations.

## 8. Testing + audit (post-implementation)

Automated + manual passes I'll run before handing back:

1. Build + typecheck clean.
2. Playwright: visit `/`, `/ar/`, `/healthcare/his`, `/ar/الرعاية-الصحية/نظام-معلومات-المستشفى`, a blog article in both locales. Assert `document.documentElement.dir`, page `<title>`, hreflang tags, and screenshot each to verify layout mirroring.
3. Language switcher click test: EN page → AR twin → back → same page.
4. Regression sweep of the last SEO editor changes: open Page Editor, confirm EN/AR SEO tabs still save and appear on the public page in both locales.
5. Console + network snapshot for any 404 on migrated routes or missing `slug_ar` fallbacks.

Report will include: what passed, any pages missing Arabic slugs, and any residual physical-CSS/animation issues found during the audit.

---

## Technical notes

- Router: keep `react-router-dom`, use nested route with `path="/ar/*"` + `useParams` to look up `slug_ar` → entity id. For built-in product routes, wrap each route element in a small `ArabicRoute routeKey="healthcare.his"` that resolves from `route_map` and renders the shared component.
- LocaleProvider stops reading `localStorage`; source of truth becomes the URL prefix. `LanguageSwitcher` becomes a `<Link>` to the mapped counterpart.
- Slug uniqueness enforced with partial unique indexes per locale.
- No visual/CSS changes to the CMS itself, per your instruction.

## Open questions before I start

1. For built-in product routes (e.g. `/healthcare/his`), do you want the Arabic path to keep the English structure (`/ar/healthcare/his`) or be fully translated (`/ar/الرعاية-الصحية/نظام-معلومات-المستشفى`)? Fully translated is better for SEO but longer to configure.
2. If an Arabic slug is missing for a page, should `/ar/...` fall back to the English slug under `/ar/` or 404?
3. Should the sitemap/hreflang work go in this same batch, or ship after routing lands?

Once you confirm those, I'll execute in this order: migration → LocaleLayout + routing → CMS slug fields → language switcher rewrite → RTL/animation sweep → SEO/sitemap → audit.
