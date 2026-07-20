# Arabic Locale Persistence — Verification Checklist

Use this checklist to confirm that switching to Arabic (`/ar/*`) stays sticky
across every navigation path. All steps must pass with `dir="rtl"` on `<html>`
and no unexpected redirect back to English (`/`).

## Quick manual checklist

1. Load `/` → click the Arabic toggle in the header. URL becomes `/ar`. `<html dir>` = `rtl`.
2. From `/ar`, click each top-level menu item (About, HIS, HIS category pages,
   ERP, Services, Blog, Events, Case Studies, Contact). Every URL must start
   with `/ar/`.
3. Open a blog post from `/ar/المدونة`. URL becomes `/ar/المدونة/<slug-ar>`
   (or `/ar/blog/<slug>` if no AR slug). Back link returns to `/ar/المدونة`.
4. Repeat step 3 for `/ar/الفعاليات` (events) and `/ar/دراسات-الحالة` (case studies).
5. From any Arabic detail page, click the header logo → returns to `/ar`.
6. From any Arabic page, click the footer CTA / footer nav links → all stay
   under `/ar/`.
7. Toggle the language switcher on an Arabic detail page → lands on the exact
   English counterpart (same post/event/case), not the home page.
8. Refresh (`F5`) any `/ar/*` URL → still renders Arabic, no 404, no flash of EN.

## Automated smoke test

Run:

```bash
python3 tests/e2e/arabic_locale_persistence.py
```

The script visits the running dev server at `http://localhost:8080`, exercises
the flows above with Playwright, and asserts:
- every navigated URL starts with `/ar/` (or is exactly `/ar`)
- `document.documentElement.dir === "rtl"` on every page
- detail pages load without a client-side redirect to `/`
- the language switcher on an AR detail page produces a non-`/` EN URL

The script exits non-zero on the first failure and prints the offending step.
