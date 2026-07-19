import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSectionContent } from "@/lib/homepageContent";

export function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const c = useSectionContent("expertise");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 1.05]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5, 1], [120, 24, 24]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.2, 1, 1]);

  return (
    <section id="section-expertise" ref={ref} className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
          {c.kicker}
        </p>

        <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span style={{ color: "var(--brand-dark)" }}>{c.heading1}</span>
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
            {c.heading2}
          </span>
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-base text-muted-foreground md:text-lg">{c.body}</p>

        <a href={c.link_href} className="mt-8 inline-flex items-center gap-2 text-base font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--brand-blue)" }}>
          {c.link_text}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-16 w-full">
        <motion.div style={{ scale, borderRadius, opacity }} className="relative mx-auto overflow-hidden shadow-2xl w-full max-w-[100vw]">
          <img src={c.image_url} alt="Technology expert" className="h-auto w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(8,15,35,0.15) 0%, rgba(8,15,35,0.55) 60%, rgba(8,15,35,0.85) 100%)" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-10 text-center md:pb-16 lg:pb-20">
            <h3 className="max-w-3xl text-2xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              {c.overlay_heading}
            </h3>
            <a
              href={c.overlay_cta_href}
              className="mt-6 inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105 md:mt-8 md:text-base"
              style={{ background: "var(--gradient-brand)" }}
            >
              {c.overlay_cta_label}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
