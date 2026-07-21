import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useDynamicsContent } from "@/lib/dynamicsContent";

function LIcon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && (Icons as any)[name]) || Icons.Sparkles;
  return <Cmp className={className} />;
}

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const hasNumber = !!match;
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const end = hasNumber ? parseFloat(numStr) : 0;
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;
  const [display, setDisplay] = useState(hasNumber ? (0).toFixed(decimals) : value);

  useEffect(() => {
    if (!hasNumber || !inView) return;
    const controls = animate(0, end, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, hasNumber, end, decimals]);

  if (!hasNumber) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function Dynamics365() {
  const c = useDynamicsContent();
  const v = c._visible;

  return (
    <>
      {/* HERO */}
      {v.Hero && (
        <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
          <div className="absolute inset-0">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 h-full w-full object-cover"
              src={c.Hero.mediaUrl}
              poster={(c.Hero as any).posterUrl}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,11,24,0.78) 0%, rgba(7,20,43,0.65) 60%, rgba(5,11,24,0.88) 100%)",
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
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {c.Hero.headline}{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    {c.Hero.headlineAccent}
                  </span>
                </h1>

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
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {/* INTRODUCTION */}
      {v.Introduction && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              {c.Introduction.headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c.Introduction.headlineAccent}
              </span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">{c.Introduction.body}</p>

            <div className="mt-10 grid grid-cols-1 gap-4 text-start sm:grid-cols-2">
              {c.Introduction.bullets.map((line: string) => (
                <div key={line} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-blue)]" />
                  <span className="text-sm font-medium text-white/90">{line}</span>
                </div>
              ))}
            </div>

            <p className="mt-10 text-sm text-white/60">{c.Introduction.footnote}</p>
          </div>
        </section>
      )}

      {/* WHAT WE DELIVER */}
      {v["What We Deliver"] && (
        <section id="services" className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["What We Deliver"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["What We Deliver"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["What We Deliver"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c["What We Deliver"].body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c["What We Deliver"].items.map((s: any) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <LIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.chips?.map((chip: string) => (
                      <span
                        key={chip}
                        className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GOVERNANCE PROCESS */}
      {v.Process && (
        <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                {c.Process.eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {c.Process.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c.Process.headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {c.Process.body}
              </p>
            </div>

            <div className="mt-14 space-y-5">
              {c.Process.items.map((p: any, idx: number) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: (idx % 2 === 0 ? -20 : 20) * (typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? -1 : 1) }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:grid-cols-[120px_56px_1fr] md:items-start md:p-8"
                >
                  <div className="text-5xl font-bold text-white/15 md:text-6xl">{p.n}</div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <LIcon name={p.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{p.body}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/55">{p.meta}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* USE CASES */}
      {v["Use Cases"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["Use Cases"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["Use Cases"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["Use Cases"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c["Use Cases"].body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c["Use Cases"].items.map((u: any) => (
                <motion.div
                  key={u.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={u.image}
                      alt={u.alt}
                      loading="lazy"
                      width={1024}
                      height={576}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                        {u.n}
                      </span>
                      <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                        {u.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{u.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHO WE SERVE */}
      {v["Who We Serve"] && (
        <section className="relative bg-[#f6f7fb] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["Who We Serve"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["Who We Serve"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["Who We Serve"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c["Who We Serve"].body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {c["Who We Serve"].items.map((a: any) => (
                <motion.div
                  key={a.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <LIcon name={a.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--brand-dark)" }}>
                      {a.role}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>
                    {a.headline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {a.outcomes.map((o: string) => (
                      <li key={o} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand-blue)]" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STANDARD VS STRATEGIC */}
      {v["Standard vs Strategic"] && (
        <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <img
            src={c["Standard vs Strategic"].backgroundUrl}
            alt=""
            loading="lazy"
            width={1920}
            height={800}
            className="absolute inset-0 h-full w-full object-cover opacity-40"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[#0a0e1a]/60" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              {c["Standard vs Strategic"].headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c["Standard vs Strategic"].headlineAccent}
              </span>
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
              {c["Standard vs Strategic"].body1}
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
              {c["Standard vs Strategic"].body2}
            </p>
          </div>
        </section>
      )}

      {/* DISCOVERY SESSION */}
      {v["Discovery Session"] && (
        <section id="contact" className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["Discovery Session"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["Discovery Session"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["Discovery Session"].headingAccent}
                </span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                {c["Discovery Session"].body}
              </p>
              <a
                href={c["Discovery Session"].ctaHref}
                className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                {c["Discovery Session"].ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <ul className="space-y-3 rounded-2xl border border-border bg-card p-7">
              {c["Discovery Session"].items.map((it: string) => (
                <li key={it} className="flex items-start gap-3 text-sm font-medium text-foreground">
                  <div
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div id="cta">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
