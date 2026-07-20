import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSectionContent } from "@/lib/homepageContent";
import { useLocale } from "@/i18n/LanguageProvider";


export function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxScroll, setMaxScroll] = useState(0);
  const c = useSectionContent("process");
  const cards = c.cards;
  const { isRTL, locale } = useLocale();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMaxScroll(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [cards.length, locale, isRTL]);

  const x = useTransform(scrollYProgress, [0, 1], isRTL ? [0, maxScroll] : [0, -maxScroll]);


  return (
    <section id="section-process" ref={ref} className="relative bg-background overflow-x-clip" style={{ height: "300vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 pt-16 md:pt-20">
          <div className="grid gap-8 md:grid-cols-2 md:items-end">
            <div>
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-dark)" }}>
                <span className="h-px w-10 bg-current" />
                {c.kicker}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl whitespace-pre-line" style={{ color: "var(--brand-dark)" }}>
                {c.heading}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-6 md:items-end">
              <p className="max-w-md text-start text-base text-muted-foreground md:text-lg">{c.body}</p>
              <a
                href={c.cta_href}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                {c.cta_label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="mt-10 flex flex-1 items-center overflow-hidden scrollbar-hide">
          <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-6 md:gap-8 md:px-12">
            {cards.map((card, i) => (
              <article key={i} className="relative flex h-[55vh] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] md:w-[500px] lg:w-[560px]">
                <video className="absolute inset-0 h-full w-full object-cover" src={card.video_url} autoPlay muted loop playsInline />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="relative z-10 flex h-full w-full flex-col justify-end p-7 pb-16 md:p-10 md:pb-20">
                  <h3 className="max-w-md text-2xl font-bold leading-tight text-white md:text-3xl">{card.title}</h3>
                  <a href={card.link_href || "#"} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                    {isRTL ? "استكشف" : "Explore"}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
