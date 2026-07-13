## Problem
The last card leaves empty space on the right because the horizontal translate is a fixed `-66.6667%` (assumes 3 equal viewport-wide cards), but cards are actually fixed-pixel widths (`w-[560px]` on lg, `w-[500px]` on md). So the transform overshoots or undershoots the real track width, leaving the visible gap in the screenshot.

## Fix
Make the translate distance dynamic based on the real rendered width of the cards track vs. the viewport container, so the last card always lands flush against the right edge.

### Steps in `src/components/ProcessSection.tsx`
1. Add refs to the sticky viewport container and the motion cards track.
2. Measure `track.scrollWidth - container.clientWidth` on mount and on resize (ResizeObserver).
3. Replace the percentage-based `useTransform` with a pixel-based one: `x = useTransform(scrollYProgress, [0, 1], [0, -maxScroll])`.
4. Keep everything else (scrollbar-hide, layout, motion) unchanged.

## Why this approach
Percentage transforms only work when card widths are also percentage/viewport based. Since the design uses fixed pixel card widths for a consistent look, measuring the actual overflow is the correct, responsive fix — no more trailing gap at any breakpoint.
