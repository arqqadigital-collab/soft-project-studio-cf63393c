import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Network,
  Workflow,
  BarChart3,
  UserPlus,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { useAboutContent, splitAccent } from "@/lib/aboutContent";

const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  HeartPulse,
  Network,
  Workflow,
  BarChart3,
  UserPlus,
  ClipboardList,
  CheckCircle2,
};
const iconFor = (name: string, fallback: LucideIcon = CheckCircle2) => ICONS[name] ?? fallback;

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

export default function About() {
  const c = useAboutContent();
  const v = c._visible;

  const hero = c.Hero;
  const heroSplit = splitAccent(hero.headline ?? "", hero.headlineAccent ?? "");
  const intro = c.Introduction;
  const introSplit = splitAccent(intro.heading ?? "", intro.headingAccent ?? "");
  const mission = c.Mission;
  const values = c.Values;
  const valuesSplit = splitAccent(values.heading ?? "", values.headingAccent ?? "");
  const milestones = c.Milestones;
  const milestonesSplit = splitAccent(milestones.heading ?? "", milestones.headingAccent ?? "");
  const nums = c["By The Numbers"];
  const cta = c["Final CTA"];

  return (
    <main className="min-h-screen bg-background">
      <SeoHead
        title="About — Who We Are"
        description="A technology and consulting group with deep roots in healthcare, ERP, cybersecurity and cloud — trusted by hundreds of enterprises across the region."
        ogType="website"
      />

      {/* Hero */}
      {v.Hero && (
        <section className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div
              className="mx-auto max-w-4xl text-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                <span>{heroSplit.lead}</span>
                {heroSplit.accent && (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    {heroSplit.accent}
                  </span>
                )}
              </h1>
              {hero.subheadline && (
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                  {hero.subheadline}
                </p>
              )}

              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                {hero.ctaLabel && hero.ctaHref && (
                  <Link
                    to={hero.ctaHref}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {hero.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {hero.ctaLabel2 && hero.ctaHref2 && (
                  <Link
                    to={hero.ctaHref2}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
                  >
                    {hero.ctaLabel2}
                  </Link>
                )}
              </div>

              {Array.isArray(hero.chips) && hero.chips.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                  {hero.chips.map((chip: string) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Introduction */}
      {v.Introduction && (
        <section className="bg-background pb-20 md:pb-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            {intro.eyebrow && (
              <p
                className="text-sm font-semibold uppercase tracking-[0.2em]"
                style={{ color: "var(--brand-blue)" }}
              >
                {intro.eyebrow}
              </p>
            )}
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              <span>{introSplit.lead}</span>
              {introSplit.accent && (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  {introSplit.accent}
                </span>
              )}
            </h2>
            {intro.body && (
              <p className="mx-auto mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
                {intro.body}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Mission */}
      {v.Mission && (
        <section id="story" className="border-y border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {mission.headline}
            </h2>
            {mission.body && (
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {mission.body}
              </p>
            )}
            {(mission.primaryLabel || mission.secondaryLabel) && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {mission.primaryLabel && mission.primaryHref && (
                  <a
                    href={mission.primaryHref}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    {mission.primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                )}
                {mission.secondaryLabel && mission.secondaryHref && (
                  <a
                    href={mission.secondaryHref}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
                  >
                    {mission.secondaryLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Values */}
      {v.Values && Array.isArray(values.items) && values.items.length > 0 && (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              {values.eyebrow && (
                <p
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--brand-blue)" }}
                >
                  {values.eyebrow}
                </p>
              )}
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                <span>{valuesSplit.lead}</span>
                {valuesSplit.accent && (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    {valuesSplit.accent}
                  </span>
                )}
              </h2>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {values.items.map((item: any, idx: number) => {
                const Icon = iconFor(item.icon);
                return (
                  <motion.div
                    key={`${item.title}-${idx}`}
                    className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: "oklch(0.62 0.13 230 / 0.1)", color: "var(--brand-blue)" }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-card-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Milestones */}
      {v.Milestones && Array.isArray(milestones.items) && milestones.items.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              {milestones.eyebrow && (
                <p
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--brand-blue)" }}
                >
                  {milestones.eyebrow}
                </p>
              )}
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                <span>{milestonesSplit.lead}</span>
                {milestonesSplit.accent && (
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    {milestonesSplit.accent}
                  </span>
                )}
              </h2>
            </div>

            <ol className="relative mt-14 space-y-6 border-l border-border pl-6 md:pl-10">
              {milestones.items.map((item: any, idx: number) => {
                const Icon = iconFor(item.icon);
                return (
                  <motion.li
                    key={`${item.title}-${idx}`}
                    className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <span
                      className="absolute -left-[34px] top-6 flex h-8 w-8 items-center justify-center rounded-full md:-left-[52px]"
                      style={{ background: "var(--gradient-brand)", color: "white" }}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-lg font-semibold text-card-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {/* By The Numbers */}
      {v["By The Numbers"] && Array.isArray(nums.items) && nums.items.length > 0 && (
        <section className="bg-background py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {nums.heading}
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {nums.items.map((item: any, idx: number) => (
                <motion.div
                  key={`${item.label}-${idx}`}
                  className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                >
                  <div
                    className="bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    <AnimatedStat value={item.value} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      {v["Final CTA"] && (
        <section className="border-t border-border bg-muted/30 py-24 md:py-32">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              {cta.headline}
            </h2>
            {cta.body && (
              <p className="mx-auto mt-6 text-lg leading-relaxed text-muted-foreground">{cta.body}</p>
            )}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {cta.primaryLabel && cta.primaryHref && (
                <Link
                  to={cta.primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {cta.primaryLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              {cta.secondaryLabel && cta.secondaryHref && (
                <Link
                  to={cta.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-muted"
                >
                  {cta.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
