import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  Search,
  Users,
  Monitor,
  Award,
  UserCog,
  Code2,
  BarChart3,
  CheckCircle2,
  Handshake,
  Building2,
  Workflow,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useLearningContent } from "@/lib/learningContent";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Search, GraduationCap, Sparkles, Users, Monitor, Award, UserCog, Code2,
  BarChart3, Handshake, Building2, Workflow,
};
const Ico = (n?: string) => (n && ICONS[n]) || Search;

function Counter({ to, decimals = 0, start }: { to: number; decimals?: number; start: boolean }) {
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
  return <>{val.toFixed(decimals)}</>;
}

function StatsCounter({ items }: { items: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
      {items.map((s: any) => (
        <div key={s.label} className="text-center">
          <div
            className="text-4xl font-bold md:text-5xl"
            style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {s.prefix ?? ""}
            <Counter to={Number(s.value) || 0} decimals={s.decimals ?? 0} start={inView} />
            {s.suffix}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Learning() {
  const c = useLearningContent();
  const v = c._visible;

  return (
    <>
      {v.Hero && (
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={c.Hero.image} alt="SBS learning and knowledge programs" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,11,24,0.85) 0%, rgba(7,20,43,0.72) 55%, rgba(5,11,24,0.95) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                <GraduationCap className="h-3.5 w-3.5" /> {c.Hero.eyebrow}
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {c.Hero.headline}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c.Hero.headlineAccent}
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                {c.Hero.body}
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href={c.Hero.ctaHref}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {c.Hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={c.Hero.ctaHref2}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {c.Hero.ctaLabel2}
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">{c.Hero.footnote}</p>
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
              <AlertTriangle className="h-3.5 w-3.5" /> {c["The Problem"].eyebrow}
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              {c["The Problem"].heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c["The Problem"].headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              {c["The Problem"].body}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {c["The Problem"].items.map((p: any) => (
              <div
                key={p.n}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                    {p.n} — Risk
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {v.Pillars && (
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {c.Pillars.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{c.Pillars.heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c.Pillars.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {c.Pillars.body}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {c.Pillars.items.map((p: any) => {
              const Icon = Ico(p.icon);
              return (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-border bg-card p-7"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                    Pillar {p.n} — {p.label}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {v.Services && (
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              {c.Services.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {c.Services.heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c.Services.headingAccent}
              </span>
            </h2>
          </div>

          <div className="mt-14 space-y-8">
            {c.Services.items.map((s: any, idx: number) => {
              const Icon = Ico(s.icon);
              const reverse = idx % 2 === 1;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2"
                >
                  <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[380px] ${reverse ? "md:order-2" : ""}`}>
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                        Service {s.n}
                      </p>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold leading-tight text-white">{s.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-white/85">{s.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">What you get</p>
                    <ul className="mt-3 space-y-2">
                      {(s.bullets || []).map((b: string) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-xs leading-relaxed text-white/55">
                      <span className="font-semibold text-white/70">Ideal for:</span> {s.ideal}
                    </p>
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
              {c["Why SBS"].eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{c["Why SBS"].heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c["Why SBS"].headingAccent}
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c["Why SBS"].items.map((w: any) => {
              const Icon = Ico(w.icon);
              return (
                <div key={w.title} className="rounded-2xl border border-border bg-card p-7">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
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
      <section
        className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24"
        style={{ background: "linear-gradient(135deg, #050b18 0%, #0a1c3a 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              {c.Stats.heading}
            </h2>
          </div>
          <StatsCounter items={c.Stats.items} />
        </div>
      </section>
      )}

      {v.FAQ && (
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {c.FAQ.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              {c.FAQ.heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c.FAQ.headingAccent}
              </span>
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {c.FAQ.items.map((f: any) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-6 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                  {f.q}
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-open:rotate-45"
                    style={{ background: "var(--gradient-brand)" }}
                  >
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
          <img src={c["Final CTA"].image} alt="" aria-hidden loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(5,11,24,0.9) 0%, rgba(7,20,43,0.82) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            {c["Final CTA"].headline}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              {c["Final CTA"].headlineAccent}
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            {c["Final CTA"].body}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={c["Final CTA"].ctaHref}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              {c["Final CTA"].ctaLabel} <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={c["Final CTA"].ctaHref2}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              {c["Final CTA"].ctaLabel2}
            </a>
          </div>
          <p className="mt-5 text-xs text-white/60">{c["Final CTA"].footnote}</p>
        </div>
      </section>
      )}

      <div id="form">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
