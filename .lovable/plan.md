## Issues
1. **Page-level horizontal overflow** — the whole site shows a bottom horizontal scrollbar. The `ProcessSection` cards track (`px-6 md:px-12` + fixed-width cards) extends past the viewport, and the sticky viewport uses `overflow-hidden` but the outer section still contributes to page width in some browsers. Additionally, no global guard prevents any child from causing body-level horizontal scroll.
2. **Card shadows** — each process card uses `shadow-xl`, visible as a soft drop shadow around the rounded cards.

## Fix

### `src/components/ProcessSection.tsx`
- Remove `shadow-xl` from the `<article>` card className.
- Ensure the outer `<section>` clips horizontally: add `overflow-x-clip` (or `overflow-hidden`) to the section wrapper so it can never contribute to page-level horizontal scroll.

### `src/styles.css` (global safety net)
- Add:
  ```css
  html, body { overflow-x: clip; }
  ```
  This prevents any stray wide element anywhere on the site from creating a page-level horizontal scrollbar, while still allowing intentional vertical scroll and internal horizontal scroll containers (like the process track) to work.

## Why
- `overflow-x: clip` on `html, body` is the modern, side-effect-free way to kill accidental page-wide horizontal scroll (unlike `overflow: hidden` which can break `position: sticky`).
- Clipping the section as well provides defense-in-depth so the sticky horizontal scroll effect never leaks outward.
- Removing `shadow-xl` matches the flat look requested.
