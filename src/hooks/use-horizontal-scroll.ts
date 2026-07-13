import { useEffect, useRef, useState, type RefObject } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

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
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, progressRange, [0, -maxScroll]);
  return { viewportRef, trackRef, x };
}
