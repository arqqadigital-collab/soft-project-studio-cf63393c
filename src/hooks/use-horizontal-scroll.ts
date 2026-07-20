import { useEffect, useRef, useState, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLocale } from "@/i18n/LanguageProvider";

/**
 * Measures a horizontal cards track against its viewport and returns a pixel-based
 * scroll-linked x MotionValue so the last card always lands flush with the right edge.
 */
export function useHorizontalScroll(
  sectionRef: RefObject<HTMLElement | null>,
  progressRange: [number, number] = [0, 1],
): {
  viewportRef: RefObject<HTMLDivElement | null>;
  trackRef: RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
} {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  // Subscribe to locale/dir so the hook re-runs on EN⇄AR switch without a hard refresh.
  const { isRTL, locale } = useLocale();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMaxScroll(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    // Re-measure on next frame so layout has settled after a dir/locale swap.
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [locale, isRTL]);

  const x = useTransform(
    scrollYProgress,
    progressRange,
    isRTL ? [0, maxScroll] : [0, -maxScroll],
  );
  return { viewportRef, trackRef, x };
}

