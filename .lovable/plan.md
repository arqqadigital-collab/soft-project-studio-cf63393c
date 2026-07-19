# Bilingual Site: English + Arabic (with RTL)

Add full English/Arabic support across the public site, with per-section translations editable in the dashboard and proper RTL layout.

## Scope

**In scope**
- Language switcher in the header (EN / العربية), persisted in `localStorage` and URL (`?lang=ar`).
- Automatic `dir="rtl"` + `lang="ar"` on `<html>` when Arabic is active, with global RTL styling fixes.
- UI chrome (nav, footer, buttons, form labels, toasts) translated via i18n dictionaries.
- Per-section content translations: every `page_sections` row gets an Arabic variant editable in the dashboard side-by-side with English.
- Translations for: Homepage hero, all 32 pages' sections, Header/Footer settings (CTAs, tagline), Contact page (hero, offices, inquiry areas), Menu labels (groups, columns, links), Posts (title, excerpt, content), Case studies, Events.
- SEO: `hreflang` alternates, translated `<title>` / meta description per locale.

**Out of scope (for now)**
- Auto-translation via AI (can be added later as a "Translate with AI" button per section).
- Additional languages beyond EN/AR.
- Translating admin dashboard UI itself (stays English).

## Approach

### 1. Data model
Add a `translations` JSONB column to content tables, keyed by locale:
- `page_sections.translations` → `{ ar: { data: {...same shape as data...} } }`
- `pages.translations` → `{ ar: { title, content, meta_title, meta_description } }`
- `posts.translations` → `{ ar: { title, excerpt, content } }`
- `menu_groups.translations`, `menu_columns.translations`, `menu_links.translations` → `{ ar: { label / title / description } }`
- `header_footer_settings.translations`, `homepage_hero.translations`, `contact_page.translations`, `contact_offices.translations`, `contact_inquiry_areas.translations`, `case_studies.translations`, `events.translations`.

At read time, if current locale is `ar`, merge `translations.ar` over the base row (English is the default/base).

### 2. Frontend i18n
- Add `i18next` + `react-i18next` + language detector.
- Create `src/i18n/index.ts` with `en` and `ar` dictionaries for UI strings (buttons, nav fallbacks, form labels, footer boilerplate, common CTAs).
- `LanguageProvider` sets `document.documentElement.dir` and `lang` based on active locale.
- `useLocale()` hook returns current locale; content hooks (e.g. `useHISContent`, `useContactPage`, etc.) accept locale and return the merged Arabic-or-English content.
- `LanguageSwitcher` component in header — toggle EN / العربية, updates URL param + localStorage.

### 3. RTL styling
- Global CSS: swap `left/right` for `start/end` where possible; audit Tailwind classes using `rtl:` variants for known offenders (margins, flex direction on nav/footer, chevrons).
- Fonts: keep current system stack for Latin; add a suitable Arabic web font (e.g. Cairo or IBM Plex Arabic) loaded only when `lang=ar`.
- Icons that imply direction (arrows) flip via `rtl:rotate-180`.

### 4. Dashboard editor
- Add a language tab (EN / AR) at the top of Page Builder, Post editor, Contact editor, Menu editor, Header/Footer editor, Homepage editor.
- Switching to AR shows the same form fields but writes into `translations.ar` instead of the base columns.
- Placeholder in AR fields shows the English value in gray so translators see context.
- "Copy from English" button per field.

### 5. SEO
- `SeoHead` accepts locale; emits `<html lang>`, `hreflang="en"` and `hreflang="ar"` alternates, and translated title/description.

## Technical details

**New/modified files (high level)**
- `src/i18n/index.ts`, `src/i18n/en.ts`, `src/i18n/ar.ts`
- `src/i18n/LanguageProvider.tsx`, `src/hooks/useLocale.ts`
- `src/components/LanguageSwitcher.tsx` (mounted in `Header.tsx`)
- Update all `use*Content` hooks to accept `locale` and merge `translations[locale]` over the base row/section
- `src/pages/dashboard/*` editors: add language tab and route field writes to `translations.ar` when AR active
- `src/components/SeoHead.tsx`: hreflang alternates
- `src/index.css`: RTL adjustments, Arabic font import
- One Supabase migration adding `translations JSONB DEFAULT '{}'::jsonb` columns to all listed tables

**Rollout order (I will do in this order across follow-up turns)**
1. i18n foundation + language switcher + RTL + UI dictionary (visible immediately, chrome-only).
2. Migration adding `translations` columns.
3. Wire section reads to merge `translations.ar`.
4. Add AR tab to Page Builder (covers all 32 pages at once).
5. Extend AR tab to Contact / Menu / Header-Footer / Homepage / Posts editors.
6. SEO hreflang + Arabic font polish.

## Notes

- English stays the source of truth; Arabic is a per-field overlay. Missing Arabic fields fall back to English so nothing ever appears blank.
- No content is lost — existing rows keep working with `translations = {}`.
- You (or a translator) fill Arabic text in the dashboard; nothing is auto-translated unless you later ask for an AI translate button.
