import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Users,
  UserPlus,
  Briefcase,
  Crown,
  Server,
  ShieldCheck,
  Headphones,
  Cloud,
  AppWindow,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Zap,
  FileCheck,
  UserCheck,
  Handshake,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useStaffAugContent } from "@/lib/staffAugContent";

const ICONS: Record<string, LucideIcon> = {
  Users, UserPlus, Briefcase, Crown, Server, ShieldCheck, Headphones, Cloud,
  AppWindow, Layers, Zap, FileCheck, UserCheck, Handshake, Sparkles,
};
const Ico = (name: string, fallback: LucideIcon = Sparkles) => ICONS[name] ?? fallback;

function Counter({ to, decimals, start }: { to: number; decimals: number; start: boolean }) {
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
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
  return <>{display}</>;
}

function StatsCounter({ items }: { items: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
      {items.map((s, i) => (
        <div key={i} className="text-center">
          <div
            className="text-4xl font-bold md:text-5xl"
            style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {s.prefix ?? ""}<Counter to={Number(s.value) || 0} decimals={Number(s.decimals) || 0} start={inView} />{s.suffix ?? ""}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function StaffAug() {
  const c = useStaffAugContent();
  const hero = c.Hero;
  const prob = c["The Problem"];
  const modelsSec = c.Models;
  const servicesSec = c.Services;
  const whySec = c["Why SBS"];
  const statsSec = c.Stats;
  const faqSec = c.FAQ;
  const finalCta = c["Final CTA"];

  return (
    <>
      {/* HERO */}
      {c._visible.Hero && (
        <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
          <div className="absolute inset-0">
            {hero.image && <img src={hero.image} alt="SBS certified technology professionals" className="absolute inset-0 h-full w-full object-cover" />}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(5,11,24,0.88) 0%, rgba(7,20,43,0.75) 55%, rgba(5,11,24,0.95) 100%)" }}
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
                  <Users className="h-3.5 w-3.5" /> {hero.eyebrow}
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
                  <a
                    href={hero.ctaHref}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={hero.ctaHref2}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                  >
                    {hero.ctaLabel2}
                  </a>
                </div>
                <p className="mt-5 text-xs text-white/60">{hero.footnote}</p>
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {/* THE PROBLEM */}
      {c._visible["The Problem"] && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /> {prob.eyebrow}
              </span>
              <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                {prob.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {prob.headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {prob.body}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
              {prob.items.map((p: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_10px_40px_-15px_rgba(56,189,248,0.35)]"
                >
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm leading-relaxed text-white/85">{p.text ?? p.title}</p>
                </motion.div>
              ))}
            </div>

            {prob.footnote && (
              <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-white/70 md:text-lg">
                {prob.footnote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* MODELS */}
      {c._visible.Models && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {modelsSec.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{modelsSec.heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {modelsSec.headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {modelsSec.body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {modelsSec.items.map((m: any) => {
                const Icon = Ico(m.icon, UserPlus);
                return (
                  <motion.div
                    key={m.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -8 }}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_-15px_rgba(56,189,248,0.35)]"
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(74,222,128,0.08))" }}
                    />
                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                          style={{ background: "var(--gradient-brand)" }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                          Model {m.n} — {m.tag}
                        </p>
                      </div>
                      <h3 className="mt-6 text-2xl font-bold text-foreground">{m.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Best for</p>
                        <p className="mt-2 text-sm text-foreground">{m.best}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {modelsSec.footnote && (
              <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
                {modelsSec.footnote}
              </p>
            )}
          </div>
        </section>
      )}

      {/* SERVICES */}
      {c._visible.Services && (
        <section id="services" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                {servicesSec.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {servicesSec.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {servicesSec.headingAccent}
                </span>
              </h2>
            </div>

            <div className="mt-14 space-y-8">
              {servicesSec.items.map((s: any, idx: number) => {
                const Icon = Ico(s.icon, Server);
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
                      {s.image && (
                        <img
                          src={s.image}
                          alt={s.title}
                          loading="lazy"
                          width={1024}
                          height={768}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      )}
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
                          {s.group} · Service {s.n}
                        </p>
                      </div>
                      <h3 className="mt-4 text-2xl font-bold leading-tight text-white">{s.title}</h3>
                      <p className="mt-3 text-sm font-semibold text-white/85">{s.tagline}</p>
                      <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
                      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">What you get</p>
                      <ul className="mt-3 space-y-2">
                        {(s.bullets ?? []).map((b: string) => (
                          <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* WHY SBS */}
      {c._visible["Why SBS"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {whySec.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{whySec.heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {whySec.headingAccent}
                </span>
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {whySec.items.map((w: any) => {
                const Icon = Ico(w.icon, Layers);
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

      {/* STATS */}
      {c._visible.Stats && (
        <section
          className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24"
          style={{ background: "linear-gradient(135deg, #050b18 0%, #0a1c3a 100%)" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                {statsSec.heading}
              </h2>
            </div>
            <StatsCounter items={statsSec.items} />
          </div>
        </section>
      )}

      {/* FAQ */}
      {c._visible.FAQ && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {faqSec.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                {faqSec.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {faqSec.headingAccent}
                </span>
              </h2>
            </div>
            <div className="mt-12 space-y-4">
              {faqSec.items.map((f: any, i: number) => (
                <details
                  key={i}
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

      {/* FINAL CTA */}
      {c._visible["Final CTA"] && (
        <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
          <div className="absolute inset-0">
            {finalCta.image && <img src={finalCta.image} alt="" aria-hidden loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover" />}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.9) 0%, rgba(7,20,43,0.82) 100%)" }}
            />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {finalCta.headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {finalCta.headlineAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              {finalCta.body}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={finalCta.ctaHref}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                {finalCta.ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={finalCta.ctaHref2}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {finalCta.ctaLabel2}
              </a>
            </div>
            {finalCta.footnote && (
              <p className="mt-5 text-xs text-white/60">{finalCta.footnote}</p>
            )}
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
