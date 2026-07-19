import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  Stethoscope,
  Pill,
  ClipboardCheck,
  ScanLine,
  Lock,
  Boxes,
  RefreshCcw,
  FileText,
  Syringe,
  FileCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import bgStepsLight from "@/assets/bg-steps-light.png";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { useMedicationContent } from "@/lib/medicationContent";

const ICONS: Record<string, LucideIcon> = {
  Stethoscope, Pill, ClipboardCheck, ScanLine, Lock, Boxes, RefreshCcw,
  FileText, Syringe, FileCheck, AlertTriangle, CheckCircle2, ShieldCheck, Network, Workflow,
};
const Icon = (name?: string): LucideIcon => (name && ICONS[name]) || AlertTriangle;

function AnimatedStat({ value }: { value: string }) {
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
    const controls = animate(0, end, { duration: 2, ease: "easeOut", onUpdate: (v) => setDisplay(v.toFixed(decimals)) });
    return () => controls.stop();
  }, [inView, hasNumber, end, decimals]);
  if (!hasNumber) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

function ExpandingJourney({ steps }: { steps: any[] }) {
    const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return (
    <div className="mt-14 flex flex-col gap-3 md:h-[520px] md:flex-row md:gap-4">
      {steps.map((step, i) => {
        const StepIcon = Icon(step.icon);
        const isActive = active === i;
        const showExpanded = isActive || !isDesktop;
        return (
          <motion.div
            key={step.title ?? i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={isDesktop ? { flexGrow: isActive ? 4 : 1 } : { flexGrow: 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 min-h-[380px] md:min-h-0 md:h-full md:p-8"
            style={{ flexBasis: isDesktop ? 0 : 'auto', minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className="relative flex h-full min-h-[320px] flex-col p-7">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <StepIcon className="h-7 w-7" />
              </div>
              <div className="mt-6 flex h-[calc(100%-3.5rem)] flex-col">
                <motion.div
                  animate={{ opacity: showExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: showExpanded ? 0.25 : 0 }}
                  className="flex-1"
                >
                  {showExpanded && (
                    <>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Step {i + 1}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.description}</p>
                    </>
                  )}
                </motion.div>
                {!showExpanded && (
                  <div className="mt-auto text-start">
                    <div className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] text-white/65">Step {i + 1}</div>
                    <h3 className="mt-2 text-start text-lg font-semibold text-white md:text-xl">{step.title}</h3>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function MedicationDosage() {
  const c = useMedicationContent();
  const v = c._visible;
  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {v.Hero && (
        <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
          <div className="absolute inset-0">
            {c.Hero.mediaUrl && (
              <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" src={c.Hero.mediaUrl} />
            )}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.65) 40%, rgba(10,14,26,0.85) 100%)" }}
            />
          </div>
          <div className="relative z-10 flex min-h-[90vh] flex-col">
            <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  {c.Hero.headline}{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Hero.headlineAccent}</span>
                </h1>
                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                  {c.Hero.ctaLabel && (
                    <a href={c.Hero.ctaHref || "#contact"} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                      {c.Hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                  {c.Hero.ctaLabel2 && (
                    <a href={c.Hero.ctaHref2 || "#contact"} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15">
                      {c.Hero.ctaLabel2}
                    </a>
                  )}
                </div>
                {c.Hero.chips && c.Hero.chips.length > 0 && (
                  <div className="mt-10 flex flex-nowrap items-center justify-center gap-3 overflow-x-auto pb-2">
                    {c.Hero.chips.map((chip: string) => (
                      <span key={chip} className="shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur md:text-sm">{chip}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v.Introduction && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.Introduction.eyebrow}</p>
            <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{c.Introduction.headline} </span>
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Introduction.headlineAccent}</span>
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{c.Introduction.body}</p>
          </div>
        </section>
      )}

      {v["The Problem"] && (
        <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
          <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
            <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
                <AlertTriangle className="h-3.5 w-3.5" /> {c["The Problem"].eyebrow}
              </span>
              <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
                {c["The Problem"].heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["The Problem"].headingAccent}</span>
              </h2>
              {c["The Problem"].subheading && (
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">{c["The Problem"].subheading}</p>
              )}
            </div>
            <div ref={problemViewportRef} className="mt-6 flex flex-1 items-center overflow-hidden md:mt-8 scrollbar-hide">
              <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
                {c["The Problem"].items.map((card: any, i: number) => (
                  <article key={i} className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] md:w-[440px] lg:w-[480px]">
                    <div className="relative h-[190px] w-full overflow-hidden md:h-[210px]">
                      <img src={card.image} alt={card.title} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">0{i + 1} — Risk</span>
                      <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">{card.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">{card.description}</p>
                    </div>
                  </article>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {v["The Platform"] && (
        <section className="px-6 py-24 md:px-12" style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}>
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">{c["The Platform"].eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{c["The Platform"].heading}</h2>
              <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">{c["The Platform"].body}</p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c["The Platform"].items.map((f: any, i: number) => {
                const FIcon = Icon(f.icon);
                return (
                  <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: (i % 3) * 0.1 }} whileHover={{ y: -6 }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)] transition-transform group-hover:scale-110" style={{ background: "var(--gradient-brand)" }}>
                      <FIcon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v["Patient Journey"] && (
        <section className="relative px-6 py-24 md:px-12" style={{ backgroundImage: `url(${bgStepsLight})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
                <Workflow className="h-3.5 w-3.5" /> {c["Patient Journey"].eyebrow}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{c["Patient Journey"].heading}</h2>
            </div>
            <ExpandingJourney steps={[...(c["Patient Journey"].items as any)]} />
          </div>
        </section>
      )}

      {v.Outcomes && (
        <section className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
          <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-brand)" }} aria-hidden />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{c.Outcomes.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">{c.Outcomes.heading}</h2>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c.Outcomes.items.map((s: any) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                  <div className="bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    <AnimatedStat value={s.value} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
            {c.Outcomes.footnote && (
              <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-white/70 md:text-base">{c.Outcomes.footnote}</p>
            )}
          </div>
        </section>
      )}

      {v.Integrations && (
        <section className="px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> {c.Integrations.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{c.Integrations.heading}</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">{c.Integrations.body}</p>
            <div className="mt-10 flex flex-nowrap items-center gap-3 overflow-x-auto pb-2 md:justify-center md:overflow-visible">
              {((c.Integrations.tags as any) as string[] | undefined)?.map((tag) => (
                <span key={tag} className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm">{tag}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {v.FAQ && (
        <section className="px-6 py-24 md:px-12" style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}>
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
                <ShieldCheck className="h-3.5 w-3.5" /> {c.FAQ.eyebrow}
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{c.FAQ.heading}</h2>
            </div>
            <div className="mt-12 space-y-4">
              {c.FAQ.items.map((f: any) => (
                <details key={f.q} className="group rounded-2xl border border-border bg-card p-6 transition-shadow open:shadow-[var(--shadow-brand)]">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-start">
                    <span className="flex items-start gap-3 text-base font-semibold text-foreground md:text-lg">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-blue)]" />
                      {f.q}
                    </span>
                    <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition-transform group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-4 ps-8 text-sm leading-relaxed text-foreground/75 md:text-base">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Final CTA"] && (
        <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
          {c["Final CTA"].mediaUrl && (
            <video src={c["Final CTA"].mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(9,22,40,0.85) 0%, rgba(9,22,40,0.75) 50%, rgba(9,22,40,0.9) 100%)" }} />
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              {c["Final CTA"].headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["Final CTA"].headlineAccent}</span>
            </h2>
            <p className="mt-8 text-lg leading-relaxed text-white/85">{c["Final CTA"].body}</p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {c["Final CTA"].primaryLabel && (
                <a href={c["Final CTA"].primaryHref || "#contact"} className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-10 sm:py-5 sm:text-base text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                  {c["Final CTA"].primaryLabel} <ArrowRight className="h-5 w-5" />
                </a>
              )}
              {c["Final CTA"].secondaryLabel && (
                <a href={c["Final CTA"].secondaryHref || "#contact"} className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-10 sm:py-5 sm:text-base text-white backdrop-blur transition-colors hover:bg-white/15">
                  {c["Final CTA"].secondaryLabel}
                </a>
              )}
            </div>
            {c["Final CTA"].footnote && <p className="mt-8 text-sm italic text-white/70">{c["Final CTA"].footnote}</p>}
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
