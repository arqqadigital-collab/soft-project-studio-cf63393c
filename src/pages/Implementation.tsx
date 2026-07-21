import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Rocket,
  AlertTriangle,
  Search,
  PenTool,
  PlayCircle,
  GraduationCap,
  LifeBuoy,
  Server,
  Plug,
  Cloud,
  Network,
  ShieldCheck,
  Database,
  Cog,
  CheckCircle2,
  Award,
  ClipboardCheck,
  Eye,
  BadgeCheck,
  Headphones,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useImplementationContent } from "@/lib/implementationContent";
import { useLocale } from "@/i18n/LanguageProvider";

const ICONS: Record<string, LucideIcon> = {
  Search, PenTool, PlayCircle, GraduationCap, LifeBuoy,
  Server, Plug, Cloud, Network, ShieldCheck, Database, Cog,
  Award, ClipboardCheck, Eye, BadgeCheck, Headphones,
};
const Ico = (n?: string): LucideIcon => (n && ICONS[n]) || CheckCircle2;

function Counter({ to, start }: { to: number; start: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1800;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start]);
  return <>{Math.round(val)}</>;
}

function StatsCounter({ items }: { items: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
      {items.map((s) => (
        <div key={s.label} className="text-center">
          <div
            className="text-4xl font-bold md:text-5xl"
            style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {s.prefix ?? ""}<Counter to={s.value} start={inView} />{s.suffix}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function MethodologyTimeline({ data }: { data: any }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const { isRTL, locale } = useLocale();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - trackRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [data, locale, isRTL]);

  const x = useTransform(scrollYProgress, [0, 1], isRTL ? [0, trackWidth] : [0, -trackWidth]);
  const sectionHeight = trackWidth > 0 ? `calc(100vh + ${trackWidth}px)` : "150vh";

  return (
    <div ref={sectionRef} className="relative bg-background" style={{ height: sectionHeight }}>
      <section className="sticky top-0 h-screen overflow-hidden bg-background px-6 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12 lg:pb-12 lg:pt-32">
        <div className="relative mx-auto flex h-full max-w-7xl flex-col">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              {data.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {data.heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {data.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {data.body}
            </p>
          </div>

          <div className="relative mt-8 min-h-[240px] flex-1 sm:mt-10 lg:mt-12">
            <div className="pointer-events-none absolute left-0 right-0 top-[44px] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent sm:top-[48px]" />
            <motion.div ref={trackRef} style={{ x }} className="flex items-start gap-0">
              {(data.items ?? []).map((p: any, i: number) => {
                const Icon = Ico(p.icon);
                return (
                  <motion.div
                    key={p.n ?? i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative w-[280px] shrink-0 px-4 sm:w-[320px] sm:px-5 lg:w-[360px]"
                  >
                    <div className="flex h-[24px] items-end justify-center sm:h-[28px]">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                        Phase {p.n}
                      </p>
                    </div>
                    <div className="relative flex h-7 items-center justify-center sm:h-8">
                      <div className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full bg-foreground/60 transition-all group-hover:scale-110 group-hover:bg-foreground sm:h-3.5 sm:w-3.5" />
                    </div>
                    <div className="mt-2 text-center">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground sm:text-sm">
                        {p.label}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{p.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Implementation() {
  const c = useImplementationContent();
  const v = c._visible;
  const hero = c.Hero;
  const problem = c["The Problem"];
  const services = c.Services;
  const why = c["Why SBS"];
  const stats = c.Stats;
  const faq = c.FAQ;
  const cta = c["Final CTA"];

  return (
    <>
      {v.Hero && (
        <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
          <div className="absolute inset-0">
            <img src={hero.image} alt="SBS implementation and integration" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,11,24,0.88) 0%, rgba(7,20,43,0.75) 55%, rgba(5,11,24,0.95) 100%)" }} />
          </div>
          <div className="relative z-10 flex min-h-[90vh] flex-col">
            <section className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 md:px-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                  <Rocket className="h-3.5 w-3.5" /> {hero.eyebrow}
                </span>
                <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {hero.headline}{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    {hero.headlineAccent}
                  </span>
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                  {hero.body}
                </p>
                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                  <a href={hero.ctaHref} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                    {hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={hero.ctaHref2} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15">
                    {hero.ctaLabel2}
                  </a>
                </div>
                {hero.footnote && <p className="mt-5 text-xs text-white/60">{hero.footnote}</p>}
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v["The Problem"] && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /> {problem.eyebrow}
              </span>
              <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                {problem.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {problem.headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {problem.body}
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
              {(problem.items ?? []).map((p: any, i: number) => (
                <motion.div
                  key={p.title ?? i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_10px_40px_-15px_rgba(56,189,248,0.35)]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" style={{ background: "var(--gradient-brand)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm leading-relaxed text-white/85">{p.title}</p>
                </motion.div>
              ))}
            </div>
            {problem.footer && (
              <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-white/70 md:text-lg">
                {problem.footer}
              </p>
            )}
          </div>
        </section>
      )}

      {v.Methodology && <MethodologyTimeline data={c.Methodology} />}

      {v.Services && (
        <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                {services.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {services.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {services.headingAccent}
                </span>
              </h2>
            </div>
            <div className="mt-14 space-y-8">
              {(services.items ?? []).map((s: any, idx: number) => {
                const Icon = Ico(s.icon);
                const reverse = idx % 2 === 1;
                return (
                  <motion.div
                    key={s.n ?? idx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2"
                  >
                    <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[380px] ${reverse ? "md:order-2" : ""}`}>
                      <img src={s.image} alt={s.title} loading="lazy" width={1200} height={900} className="absolute inset-0 h-full w-full object-cover" />
                    </div>
                    <div className="p-8 md:p-10">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ background: "var(--gradient-brand)" }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                          Service {s.n}
                        </p>
                      </div>
                      <h3 className="mt-4 text-2xl font-bold leading-tight text-white">{s.title}</h3>
                      {s.tagline && <p className="mt-3 text-sm font-semibold text-white/85">{s.tagline}</p>}
                      {s.body && <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>}
                      {s.platforms && s.platforms.length > 0 && (
                        <>
                          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{s.subhead}</p>
                          <ul className="mt-3 space-y-2">
                            {s.platforms.map((b: string) => (
                              <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {s.bullets && s.bullets.length > 0 && (
                        <>
                          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">What you get</p>
                          <ul className="mt-3 space-y-2">
                            {s.bullets.map((b: string) => (
                              <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v["Why SBS"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {why.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{why.heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {why.headingAccent}
                </span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(why.items ?? []).map((w: any) => {
                const Icon = Ico(w.icon);
                return (
                  <div key={w.title} className="rounded-2xl border border-border bg-card p-7">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{w.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v.Stats && (
        <section className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24" style={{ background: "linear-gradient(135deg, #050b18 0%, #0a1c3a 100%)" }}>
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                {stats.heading}
              </h2>
            </div>
            <StatsCounter items={stats.items ?? []} />
          </div>
        </section>
      )}

      {v.FAQ && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {faq.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                {faq.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {faq.headingAccent}
                </span>
              </h2>
            </div>
            <div className="mt-12 space-y-4">
              {(faq.items ?? []).map((f: any) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-6 open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                    {f.q}
                    <span className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-open:rotate-45" style={{ background: "var(--gradient-brand)" }}>
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Final CTA"] && (
        <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
          <div className="absolute inset-0">
            <img src={cta.image} alt="" aria-hidden loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.9) 0%, rgba(7,20,43,0.82) 100%)" }} />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {cta.headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {cta.headlineAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {cta.body}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={cta.ctaHref} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                {cta.ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
              <a href={cta.ctaHref2} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15">
                {cta.ctaLabel2}
              </a>
            </div>
            {cta.footnote && <p className="mt-5 text-xs text-white/60">{cta.footnote}</p>}
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
