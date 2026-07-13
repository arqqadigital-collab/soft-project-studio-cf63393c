## Goal
Keep the horizontal card scroll in the "How We Transform Your Business" section, but remove the visible horizontal scrollbar/overflow track so it matches the clean screenshot look.

## Plan
1. Inspect `src/components/ProcessSection.tsx` and identify the horizontal scrolling container.
2. Apply a scrollbar-hiding style to that container while preserving `overflow-x: auto` / horizontal swipe/scroll behavior.
3. Verify the build still passes and the section looks correct in the preview.

## Why this approach
The user wants the same card layout and scrolling interaction, just without the visible x-axis overflow scrollbar. This is a CSS-only change, so we can keep all existing scroll logic and motion.