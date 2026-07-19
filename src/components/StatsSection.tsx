import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import statsBg from "@/assets/stats-bg.jpg";
import { useSectionContent } from "@/lib/homepageContent";

function Counter({ to, suffix, start }: { to: number; suffix: string; start: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1800;
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start]);

  return (
    <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
      {val}{suffix}
    </span>
  );
}

function Icon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  const Cmp = (Icons as any)[name] ?? Icons.Building2;
  return <Cmp className={className} style={style} />;
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const c = useSectionContent("stats");

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1.4]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.3]);

  return (
    <section id="section-stats" ref={sectionRef} className="relative overflow-hidden py-24 md:py-32">
      <motion.div style={{ y: bgY, scale: bgScale, backgroundImage: `url(${statsBg})` }} className="absolute inset-0 -z-10 bg-cover bg-center will-change-transform" aria-hidden />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg, rgba(8,15,35,0.85) 0%, rgba(8,15,35,0.7) 50%, rgba(8,15,35,0.9) 100%)" }} aria-hidden />

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="mx-auto max-w-6xl px-6 will-change-transform">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.kicker}</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-white">{c.heading1}</span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.heading2}</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`mt-16 grid gap-6 grid-cols-1 sm:grid-cols-2 ${
            c.items.length >= 3 ? "lg:grid-cols-3" : c.items.length >= 2 ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {c.items.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.15 }} className="p-6 text-center md:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
                <Icon name={stat.icon} className="h-6 w-6" style={{ color: "var(--brand-blue)" }} />
              </div>
              <div className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl md:mt-8 md:text-7xl">
                <Counter to={Number(stat.value)} suffix={stat.suffix} start={inView} />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 md:mt-6">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
