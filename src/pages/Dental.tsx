import { useState, useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  Smile,
  ClipboardList,
  CalendarCheck,
  Scan,
  BellRing,
  FileSignature,
  ShieldCheck,
  Receipt,
  Users,
  Activity,
  FlaskConical,
  UserCog,
  ChevronDown,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import { useDentalContent } from "@/lib/dentalContent";

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle, Smile, ClipboardList, CalendarCheck, Scan, BellRing,
  FileSignature, ShieldCheck, Receipt, Users, Activity, FlaskConical,
  UserCog, CheckCircle2,
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
    const controls = animate(0, end, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
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
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 min-h-[380px] md:min-h-0 md:h-full"
            style={{ flexBasis: isDesktop ? 0 : 'auto', minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.38)_0%,rgba(5,12,24,0.72)_50%,rgba(5,12,24,0.95)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${showExpanded ? 'p-7' : 'p-4'}`}>
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
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.description ?? step.body}</p>
                    </>
                  )}
                </motion.div>
                {!showExpanded && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">Step {i + 1}</div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-white md:text-base">{step.title}</h3>
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

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-start"
      >
        <span className="text-base font-semibold text-foreground md:text-lg">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 pe-9 text-sm leading-relaxed text-muted-foreground md:text-base">{a}</p>}
    </div>
  );
}

export default function Dental() {
  const c = useDentalContent();
  const v = c._visible;
  const hero = c.Hero;
  const intro = c.Introduction;
  const problem = c["The Problem"];
  const platform = c["The Platform"];
  const journey = c["Patient Journey"];
  const outcomes = c.Outcomes;
  const integrations = c.Integrations;
  const faq = c.FAQ;
  const cta = c["Final CTA"];

  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {v.Hero && (
        <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-[var(--brand-dark)]">
          <div className="absolute inset-0">
            {hero.mediaUrl && (
              <video
                src={hero.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
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
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    {hero.headlineAccent}
                  </span>
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
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v.Introduction && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {intro.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              <span style={{ color: "var(--brand-dark)" }}>{intro.headline}</span>
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {intro.headlineAccent}
              </span>
            </h2>
            <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {intro.body}
            </p>
          </div>
        </section>
      )}

      {v["The Problem"] && (
        <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "360vh" }}>
          <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
            <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
                <AlertTriangle className="h-3.5 w-3.5" /> {problem.eyebrow}
              </span>
              <h2 className="mt-5 max-w-5xl text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
                {problem.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {problem.headingAccent}
                </span>
              </h2>
              {problem.subheading && (
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
                  {problem.subheading}
                </p>
              )}
            </div>

            <div ref={problemViewportRef} className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24 scrollbar-hide">
              <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
                {(problem.items ?? []).map((card: any, i: number) => (
                  <article
                    key={card.title ?? i}
                    className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] md:w-[420px] lg:w-[460px]"
                  >
                    <div className="relative h-[170px] w-full shrink-0 overflow-hidden md:h-[190px]">
                      {card.image && (
                        <img
                          src={card.image}
                          alt={card.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                        0{i + 1} — Risk
                      </span>
                      <h3 className="mt-3 text-lg font-bold leading-tight text-white md:text-xl">{card.title}</h3>
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
        <section
          className="px-6 py-24 md:px-12"
          style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                {platform.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {platform.heading}
              </h2>
              {platform.body && (
                <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
                  {platform.body}
                </p>
              )}
            </div>

            <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(platform.items ?? []).map((f: any, i: number) => {
                const FIcon = Icon(f.icon);
                return (
                  <motion.article
                    key={f.title ?? i}
                    initial={{ opacity: 0, y: 36, scale: 0.97, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    whileHover={{ y: -6 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.45, delay: i * 0.05 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)] transition-transform duration-300 group-hover:scale-110"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <FIcon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v["Patient Journey"] && (
        <section className="bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                {journey.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {journey.heading}
              </h2>
              {journey.body && (
                <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
                  {journey.body}
                </p>
              )}
            </div>
            <ExpandingJourney steps={[...(journey.items ?? [])]} />
          </div>
        </section>
      )}

      {v.Outcomes && (
        <section
          className="px-6 py-24 md:px-12"
          style={{ background: "linear-gradient(135deg, var(--brand-dark) 0%, #0d2a52 100%)" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{outcomes.eyebrow}</span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
                {outcomes.heading}
              </h2>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(outcomes.items ?? []).map((s: any) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
                >
                  <div
                    className="bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    <AnimatedStat value={s.value} />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v.Integrations && (
        <section className="bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                {integrations.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {integrations.heading}
              </h2>
              {integrations.body && (
                <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
                  {integrations.body}
                </p>
              )}
            </div>

            <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2">
              {(integrations.groups ?? []).map((g: any) => {
                const cells: Array<{ name: string; logo?: string }> = (g.items ?? []).slice(0, 6);
                const shrinkLogo = ["Intraoral Cameras", "Accounting & Payments", "Insurance Payers"].includes(g.title);
                return (
                  <div key={g.title}>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                      {g.title}
                    </h3>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {cells.map((c, i) => (
                        <div
                          key={i}
                          className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-card p-3 transition hover:border-[color:var(--brand-blue)]/40 hover:shadow-sm"
                        >
                          {c.logo ? (
                            <img
                              src={c.logo}
                              alt={`${c.name} logo`}
                              loading="lazy"
                              className={`object-contain ${shrinkLogo ? "max-h-[80%] max-w-[80%]" : "max-h-full max-w-full"}`}
                            />
                          ) : c.name ? (
                            <span className="text-center text-[11px] font-medium leading-tight text-foreground/70 md:text-xs">
                              {c.name}
                            </span>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v.FAQ && (
        <section
          className="px-6 py-24 md:px-12"
          style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                {faq.eyebrow}
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">{faq.heading}</h2>
            </div>
            <div className="mt-12">
              {(faq.items ?? []).map((f: any) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Final CTA"] && (
        <section
          id="contact"
          className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36"
          style={{ backgroundColor: "#091628" }}
        >
          <div className="absolute inset-0">
            {cta.mediaUrl && (
              <video
                src={cta.mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
          </div>
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-brand)", mixBlendMode: "soft-light" }} />
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {cta.headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {cta.headlineAccent}
              </span>
            </h2>
            {cta.body && (
              <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
                {cta.body}
              </p>
            )}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {cta.primaryLabel && (
                <a
                  href={cta.primaryHref || "#contact"}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {cta.primaryLabel} <ArrowRight className="h-4 w-4" />
                </a>
              )}
              {cta.secondaryLabel && (
                <a
                  href={cta.secondaryHref || "#contact"}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {cta.secondaryLabel}
                </a>
              )}
            </div>
            {cta.footnote && (
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/55">
                {cta.footnote}
              </p>
            )}
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
