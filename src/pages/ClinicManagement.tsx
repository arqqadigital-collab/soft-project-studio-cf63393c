import { useRef, useEffect, useState } from "react";
import * as Icons from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Workflow,
  ShieldCheck,
  Network,
} from "lucide-react";
import bgStepsLight from "@/assets/bg-steps-light.png";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { useClinicContent } from "@/lib/clinicContent";

function IconByName({ name, className }: { name?: string; className?: string }) {
  const C = (name && (Icons as any)[name]) || Icons.Sparkles;
  return <C className={className} />;
}

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

function ExpandingJourney({ steps }: { steps: readonly any[] }) {
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
    <div className="mt-14 flex flex-col gap-3 md:flex-row md:gap-4 md:h-[520px]">
      {steps.map((step, i) => {
        const isActive = active === i;
        const showExpanded = isActive || !isDesktop;
        return (
          <motion.div
            key={step.title + i}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={isDesktop ? { flexGrow: isActive ? 4 : 1 } : { flexGrow: 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 min-h-[380px] md:min-h-0 md:h-full ${isDesktop && !isActive ? "md:p-4" : "md:p-8"}`}
            style={{ flexBasis: isDesktop ? 0 : 'auto', minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${showExpanded ? "p-7" : "p-4"}`}>
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <IconByName name={step.icon} className="h-7 w-7" />
              </div>

              <div className="mt-6 flex h-[calc(100%-3.5rem)] flex-col">
                <motion.div
                  animate={{ opacity: showExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: showExpanded ? 0.25 : 0 }}
                  className="flex-1"
                >
                  {showExpanded && (
                    <>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        Step {i + 1}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.description}</p>
                    </>
                  )}
                </motion.div>

                {!showExpanded && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-white [writing-mode:horizontal-tb] md:text-base">
                      {step.title}
                    </h3>
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

function LogoSlider({ platforms }: { platforms: readonly any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [platforms.length]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative mt-12">
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-opacity hover:bg-muted md:flex"
        style={{ opacity: canScrollLeft ? 1 : 0.3 }}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {platforms.map((p, i) => (
          <div
            key={p.name + i}
            className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-20 w-full items-center justify-center">
              <img src={p.logo} alt={`${p.name} logo`} className="max-h-full max-w-full object-contain" loading="lazy" />
            </div>
            <span className="text-center text-xs font-medium text-foreground/70">{p.name}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background shadow-md transition-opacity hover:bg-muted md:flex"
        style={{ opacity: canScrollRight ? 1 : 0.3 }}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function ClinicManagement() {
  const c = useClinicContent();
  const v = c._visible;

  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  const hero = c.Hero;
  const intro = c.Introduction;
  const problem = c["The Problem"];
  const platform = c["The Platform"];
  const journey = c["Patient Journey"];
  const outcomes = c.Outcomes;
  const integrations = c.Integrations;
  const faq = c.FAQ;
  const finalCta = c["Final CTA"];

  return (
    <>
      {/* HERO */}
      {v.Hero && (
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          {hero.mediaUrl && (
            /\.(mp4|webm|mov)$/i.test(hero.mediaUrl) ? (
              <video src={hero.mediaUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <img src={hero.mediaUrl} alt="" className="h-full w-full object-cover" />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {hero.headline}{" "}
                {hero.headlineAccent && (
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    {hero.headlineAccent}
                  </span>
                )}
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                {hero.ctaLabel && (
                  <a
                    href={hero.ctaHref || "#contact"}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                {hero.ctaLabel2 && (
                  <a
                    href={hero.ctaHref2 || "#contact"}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                  >
                    {hero.ctaLabel2}
                  </a>
                )}
              </div>

              {Array.isArray(hero.chips) && hero.chips.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  {hero.chips.map((chip: string) => (
                    <span
                      key={chip}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </section>
        </div>
      </main>
      )}

      {/* INTRO */}
      {v.Introduction && (
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {intro.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {intro.eyebrow}
            </p>
          )}
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>{intro.headline}</span>
            <br />
            {intro.headlineAccent && (
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {intro.headlineAccent}
              </span>
            )}
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {intro.body}
          </p>
        </div>
      </section>
      )}

      {/* PROBLEM */}
      {v["The Problem"] && (
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> {problem.eyebrow}
            </span>
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              {problem.heading}{" "}
              {problem.headingAccent && (
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {problem.headingAccent}
                </span>
              )}
            </h2>
          </div>

          <div ref={problemViewportRef} className="mt-10 flex flex-1 items-center overflow-hidden md:mt-12 scrollbar-hide">
            <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {(problem.items ?? []).map((card: any, i: number) => (
                <article
                  key={i}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] md:w-[440px] lg:w-[480px]"
                >
                  <div className="relative h-[190px] w-full overflow-hidden md:h-[210px]">
                    <img src={card.image} alt={card.title} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                      0{i + 1} — Risk
                    </span>
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

      {/* PLATFORM / FEATURES */}
      {v["The Platform"] && (
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            {platform.eyebrow && (
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                {platform.eyebrow}
              </span>
            )}
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {platform.heading}
            </h2>
            {platform.body && (
              <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">{platform.body}</p>
            )}
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(platform.items ?? []).map((f: any, i: number) => (
              <motion.div
                key={f.title + i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
              >
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <IconByName name={f.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* PATIENT JOURNEY */}
      {v["Patient Journey"] && (
      <section
        className="relative px-6 py-24 md:px-12"
        style={{
          backgroundImage: `url(${bgStepsLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Workflow className="h-3.5 w-3.5" /> {journey.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {journey.heading}
            </h2>
          </div>

          <ExpandingJourney steps={journey.items ?? []} />
        </div>
      </section>
      )}

      {/* OUTCOMES */}
      {v.Outcomes && (
      <section className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div
          className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{outcomes.eyebrow}</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              {outcomes.heading}
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(outcomes.items ?? []).map((s: any, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div
                  className="bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <AnimatedStat value={s.value} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* INTEGRATIONS */}
      {v.Integrations && (
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> {integrations.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {integrations.headline}
            </h2>
            {integrations.body && (
              <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">{integrations.body}</p>
            )}
          </div>

          {integrations.sliderLabel && (
            <p className="mt-10 text-center text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
              {integrations.sliderLabel}
            </p>
          )}
          <LogoSlider platforms={integrations.items ?? []} />
        </div>
      </section>
      )}

      {/* FAQ */}
      {v.FAQ && (
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <ShieldCheck className="h-3.5 w-3.5" /> {faq.eyebrow}
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{faq.heading}</h2>
          </div>

          <div className="mt-12 space-y-4">
            {(faq.items ?? []).map((f: any, i: number) => (
              <details
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 transition-shadow open:shadow-[var(--shadow-brand)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-start">
                  <span className="flex items-start gap-3 text-base font-semibold text-foreground md:text-lg">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-blue)]" />
                    {f.q}
                  </span>
                  <span
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 ps-8 text-sm leading-relaxed text-foreground/75 md:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FINAL CTA */}
      {v["Final CTA"] && (
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div className="absolute inset-0">
          {finalCta.mediaUrl && (
            /\.(mp4|webm|mov)$/i.test(finalCta.mediaUrl) ? (
              <video src={finalCta.mediaUrl} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <img src={finalCta.mediaUrl} alt="" className="h-full w-full object-cover" />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            {finalCta.headline}{" "}
            {finalCta.headlineAccent && (
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {finalCta.headlineAccent}
              </span>
            )}
          </h2>
          {finalCta.body && (
            <p className="mt-8 text-lg leading-relaxed text-white/80">{finalCta.body}</p>
          )}
          {finalCta.body2 && (
            <p className="mt-6 text-lg leading-relaxed text-white/80">{finalCta.body2}</p>
          )}

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {finalCta.primaryLabel && (
              <a
                href={finalCta.primaryHref || "#"}
                className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-10 sm:py-5 sm:text-base text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                {finalCta.primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </a>
            )}
            {finalCta.secondaryLabel && (
              <a
                href={finalCta.secondaryHref || "#"}
                className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-10 sm:py-5 sm:text-base text-white backdrop-blur transition-colors hover:bg-white/15"
              >
                {finalCta.secondaryLabel}
              </a>
            )}
          </div>

          {finalCta.footnote && (
            <p className="mt-8 text-sm italic text-white/60">{finalCta.footnote}</p>
          )}
        </div>
      </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
