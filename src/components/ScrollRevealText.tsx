import { useEffect, useRef, useState } from "react";

interface ScrollRevealTextProps {
  segments: { text: string; gradient?: boolean }[];
  className?: string;
}

export const ScrollRevealText = ({ segments, className = "" }: ScrollRevealTextProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // start when top hits 85% of viewport, fully revealed when bottom hits 25%
      const start = vh * 0.85;
      const end = vh * 0.15;
      const total = start - end;
      const current = start - rect.top;
      const p = Math.max(0, Math.min(1, current / total));
      setProgress(p);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const words: { text: string; gradient: boolean }[] = [];
  segments.forEach((seg) => {
    seg.text.split(/(\s+)/).forEach((w) => {
      if (w.length === 0) return;
      words.push({ text: w, gradient: !!seg.gradient });
    });
  });

  const visibleWords = words.filter((w) => w.text.trim().length > 0);
  const totalWords = visibleWords.length;
  let wordIdx = 0;

  return (
    <h2 ref={containerRef} className={className}>
      {words.map((w, i) => {
        if (w.text.trim().length === 0) {
          return <span key={i}>{w.text}</span>;
        }
        const myIdx = wordIdx++;
        const wordProgress = progress * totalWords - myIdx;
        const opacity = Math.max(0.12, Math.min(1, wordProgress));
        return (
          <span
            key={i}
            className={w.gradient ? "bg-clip-text text-transparent" : "text-white"}
            style={{
              opacity,
              transition: "opacity 0.15s ease-out",
              ...(w.gradient
                ? { backgroundImage: "var(--gradient-brand)", WebkitBackgroundClip: "text" }
                : {}),
            }}
          >
            {w.text}
          </span>
        );
      })}
    </h2>
  );
};
