import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Eye,
  Sparkles,
  Rocket,
  Users,
  GraduationCap,
  Globe2,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import aboutHeroVideo from "@/assets/about-hero.mp4";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { SeoHead } from "@/components/SeoHead";
import { useCareersContent } from "@/lib/careersContent";

const ICONS: Record<string, LucideIcon> = {
  Target,
  Eye,
  Rocket,
  Users,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
};
const iconFor = (name: string, fb: LucideIcon = CheckCircle2) => ICONS[name] ?? fb;

export default function Careers() {
  const c = useCareersContent();
  const v = c._visible;
  const hero = c.Hero;
  const promise = c.Promise;
  const journey = c["Hiring Journey"];
  const cta = c["Final CTA"];

  return (
    <>
      <SeoHead
        title="Careers at SBS — Build Enterprise Technology"
        description="Join a growing team of engineers, consultants, and healthcare technology experts delivering transformation programs across the region."
        ogType="website"
      />

      {v.Hero && (
        <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
          <div className="absolute inset-0">
            <video
              src={hero.mediaUrl || aboutHeroVideo}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          </div>

          <div className="relative z-10 flex min-h-[90vh] flex-col">
            <section className="flex flex-1 items-center justify-center px-6 pb-32 pt-4 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mx-auto flex max-w-4xl flex-col items-center text-center"
              >
                {hero.eyebrow && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" /> {hero.eyebrow}
                  </span>
                )}
                <h1 className="mt-6 text-2xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                  {hero.headline}{" "}
                  {hero.headlineAccent && (
                    <span
                      className="bg-clip-text text-transparent"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    >
                      {hero.headlineAccent}
                    </span>
                  )}
                </h1>
                {hero.subheadline && (
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                    {hero.subheadline}
                  </p>
                )}
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v.Promise && (
        <section className="relative z-20 -mt-16 rounded-t-[2.5rem] bg-white px-6 pb-24 pt-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12">
          <div className="mx-auto max-w-6xl">
            {promise.intro && (
              <div className="mx-auto max-w-4xl text-center">
                <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
                  {promise.intro}
                </p>
              </div>
            )}

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {(promise.items ?? []).map((item: any, i: number) => {
                const Icon = iconFor(item.icon, Target);
                return (
                  <motion.div
                    key={item.title ?? i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden rounded-3xl border border-border bg-card p-10 transition-shadow hover:shadow-[var(--shadow-brand)]"
                  >
                    <div
                      className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                      style={{ background: "var(--gradient-brand)" }}
                    />
                    <div
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-foreground">{item.title}</h2>
                    <p className="mt-4 text-base leading-relaxed text-foreground/75">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {v["Hiring Journey"] && (
        <section
          className="px-6 py-24 md:px-12"
          style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              {journey.eyebrow && (
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
                  {journey.eyebrow}
                </span>
              )}
              {journey.heading && (
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                  {journey.heading}
                </h2>
              )}
            </div>

            <div className="relative mt-20">
              <div
                className="absolute left-8 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
                style={{ background: "var(--gradient-brand)", opacity: 0.25 }}
              />

              <div className="space-y-12">
                {(journey.items ?? []).map((step: any, i: number) => {
                  const Icon = iconFor(step.icon, Rocket);
                  const isRight = i % 2 === 1;
                  return (
                    <motion.div
                      key={step.title ?? i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className={`relative flex items-start gap-6 md:items-center ${isRight ? "md:flex-row-reverse" : ""}`}
                    >
                      <div className="absolute left-8 z-10 -translate-x-1/2 md:left-1/2" aria-hidden>
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background text-white shadow-[var(--shadow-brand)]"
                          style={{ background: "var(--gradient-brand)" }}
                        >
                          <Icon className="h-7 w-7" />
                        </div>
                      </div>

                      <div className="hidden md:block md:w-1/2" />

                      <div className="ms-24 w-full md:ms-0 md:w-1/2 md:px-12">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                          <h3 className="text-xl font-bold text-foreground md:text-2xl">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-base leading-relaxed text-foreground/75">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {v["Final CTA"] && (
        <section
          className="relative overflow-hidden px-6 py-24 md:px-12"
          style={{ backgroundColor: "#091628" }}
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <Globe2 className="mx-auto h-10 w-10 text-white/70" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white md:text-5xl">
              {cta.headline}{" "}
              {cta.headlineAccent && (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  {cta.headlineAccent}
                </span>
              )}
            </h2>
            {cta.body1 && (
              <p className="mt-8 text-lg leading-relaxed text-white/80">{cta.body1}</p>
            )}
            {cta.body2 && (
              <p className="mt-6 text-lg leading-relaxed text-white/80">{cta.body2}</p>
            )}

            <div className="mt-12 inline-flex flex-col items-center gap-6">
              {cta.ctaNote && (
                <p className="max-w-2xl text-base font-medium text-white/90 md:text-lg">
                  {cta.ctaNote}
                </p>
              )}
              {cta.ctaLabel && (
                <Link
                  to={cta.ctaHref || "/contact"}
                  className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-semibold sm:px-10 sm:py-5 sm:text-base text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {cta.ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
