import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  FlaskConical,
  ClipboardCheck,
  Microscope,
  LineChart,
  FileSearch,
  Activity,
  Settings,
  Link2,
  Rocket,
  TrendingUp,
} from "lucide-react";
import logo from "@/assets/logo.png";
import lisHeroVideo from "@/assets/lis/lis-hero.mp4.asset.json";
import lisProblem1 from "@/assets/lis/problem-1.jpg";
import lisProblem2 from "@/assets/lis/problem-2.jpg";
import lisProblem3 from "@/assets/lis/problem-3.jpg";
import lisProblem4 from "@/assets/lis/problem-4.jpg";
import lisJourney1 from "@/assets/lis/journey-1.jpg";
import lisJourney2Asset from "@/assets/lis/journey-2.png.asset.json";
import lisJourney3Asset from "@/assets/lis/journey-3.png.asset.json";
const lisJourney2 = lisJourney2Asset.url;
const lisJourney3 = lisJourney3Asset.url;
import lisJourney4 from "@/assets/lis/journey-4.jpg";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { MainNav } from "@/components/MainNav";

const features = [
  { icon: FlaskConical, title: "Sample Management", body: "Track every specimen from collection to disposal with barcode scanning, real-time location updates, and automated rejection flags for compromised samples." },
  { icon: ClipboardCheck, title: "Result Entry & Validation", body: "Enter, review, and authorize results through configurable validation rules. Flag abnormal values automatically and route critical results to the right clinician instantly." },
  { icon: Microscope, title: "Instrument Integration", body: "Connect directly to your analyzers and diagnostic instruments. Eliminate manual transcription errors with bidirectional data transfer and real-time result import." },
  { icon: LineChart, title: "Quality Control", body: "Run Levey-Jennings charts, Westgard rules, and peer comparison programs. Get immediate QC failure alerts before results are released." },
  { icon: FileSearch, title: "Reporting & Delivery", body: "Generate formatted patient reports in seconds. Deliver results via portal, print, email, or HL7 message — with full audit trail on every action." },
  { icon: Activity, title: "Patient History & Trends", body: "View longitudinal data across visits. Compare results over time and flag clinically significant changes automatically." },
];

const journey = [
  { icon: Settings, title: "Configure Your Lab", image: lisJourney1, body: "Set up your departments, test catalog, reference ranges, and user roles in a guided onboarding session." },
  { icon: Link2, title: "Connect Your Instruments", image: lisJourney2, body: "Integrate your analyzers and existing hospital systems using our pre-built connectors and HL7 interfaces." },
  { icon: Rocket, title: "Go Live", image: lisJourney3, body: "Your team starts processing samples, entering results, and generating reports — all from one screen." },
  { icon: TrendingUp, title: "Optimize Over Time", image: lisJourney4, body: "Use built-in analytics to track turnaround times, error rates, and workload distribution. Improve continuously with real data." },
];

const stats = [
  { value: "40%", label: "Average reduction in turnaround time" },
  { value: "99.97%", label: "Sample traceability rate across all workflows" },
  { value: "60%", label: "Fewer data entry errors after instrument integration" },
  { value: "3×", label: "Faster audit preparation with automated compliance reports" },
];

const problemCards = [
  { title: "Mislabeled Samples", image: lisProblem1, body: "Manual sample logging leads to mislabeling and lost specimens — putting patient safety and lab credibility at risk." },
  { title: "Delayed Results", image: lisProblem2, body: "Disconnected systems and paper-based reporting create delays that slow down diagnosis and treatment decisions." },
  { title: "Audit Failures", image: lisProblem3, body: "Incomplete chain-of-custody records make accreditation audits stressful — and sometimes impossible to pass." },
  { title: "Wasted Staff Time", image: lisProblem4, body: "Hours lost every day re-entering the same data between instruments, worksheets, and the hospital record." },
];

function ExpandingJourney({ steps }: { steps: typeof journey }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-14 flex flex-col gap-3 md:h-[520px] md:flex-row md:gap-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = active === i;
        return (
          <motion.div
            key={step.title}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={{ flexGrow: isActive ? 4 : 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full"
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.38)_0%,rgba(5,12,24,0.72)_50%,rgba(5,12,24,0.95)_100%)]" aria-hidden="true" />
            <div className="relative flex h-full min-h-[320px] flex-col p-7">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div className="mt-6 flex h-[calc(100%-3.5rem)] flex-col">
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: isActive ? 0.25 : 0 }}
                  className="flex-1"
                >
                  {isActive && (
                    <>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Step {i + 1}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.body}</p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">Step {i + 1}</div>
                    <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">{step.title}</h3>
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

const faqs = [
  { q: "How long does implementation take?", a: "Most labs are fully live within 2 to 4 weeks, depending on the number of instruments and integrations required." },
  { q: "Is the system cloud-based or on-premises?", a: "Both options are available. Cloud-hosted with 99.9% uptime SLA, or on-premises deployment for facilities with strict data residency requirements." },
  { q: "Does it support multiple lab locations?", a: "Yes. The Enterprise plan supports multi-site management with centralized reporting and per-location configuration." },
  { q: "Is it compliant with CAP, CLIA, and ISO 15189?", a: "The system is designed to support compliance with all major laboratory accreditation standards, including audit trail requirements and QC documentation." },
  { q: "Can it connect to our existing HIS?", a: "Yes. We support HL7 v2, HL7 FHIR, and REST API integrations with all major hospital information systems." },
];

const trustChips = [
  "Trusted by 200+ Labs",
  "18 Countries",
  "HIPAA Compliant",
  "HL7 & FHIR Ready",
  "CAP · CLIA · ISO 15189 Ready",
];

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

export default function LIS() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-75%"]);

  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={lisHeroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <header className="flex items-center justify-between px-6 py-6 md:px-12">
            <Link to="/">
              <img src={logo} alt="SBS — Superior Business Solutions" className="h-12 w-auto md:h-14" />
            </Link>
            <MainNav />
            <Link
              to="/"
              className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get Started
            </Link>
          </header>

          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Precision at Every Test.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Clarity at Every Result.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Start Your Free Trial <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Watch a Demo
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                {trustChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRO */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Introducing Secreta LIS
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>One Platform for the</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Entire Lab Workflow
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Transform your lab operations with a system built for speed, accuracy, and complete traceability. From
            sample intake to final report, every step is tracked, automated, and audit-ready — so your team can
            focus on what matters: accurate diagnoses and faster care.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll on dark */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "260vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              Is Your Lab Struggling{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                With This?
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              There's a better way to run your laboratory.
            </p>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => (
                <article
                  key={card.title}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[420px] lg:w-[460px]"
                >
                  <div className="relative h-[170px] w-full shrink-0 overflow-hidden md:h-[190px]">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                      0{i + 1} — Risk
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-tight text-white md:text-xl">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">{card.body}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTION / FEATURES */}
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              The Platform
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Everything Your Lab Needs. Nothing It Doesn't.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              A single, integrated platform that covers your entire laboratory workflow — from the moment a sample
              arrives to the second a result is delivered.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)] transition-transform group-hover:scale-110"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Up and Running in 4 Steps
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From configuration to optimization — every step connected, every workflow streamlined.
            </p>
          </div>
          <ExpandingJourney steps={journey} />
        </div>
      </section>

      {/* METRICS */}
      <section className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div
          className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Outcomes</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Results You Can Measure
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
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

      {/* INTEGRATIONS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Connects With Your Existing Systems
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            Works seamlessly with your HIS, EMR, PACS, and billing platforms. Pre-built connectors for Epic, Cerner,
            Meditech, and all major HL7-compatible systems. Open API available for custom integrations.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["HIS", "EMR", "PACS", "Billing", "Epic", "Cerner", "Meditech", "HL7 v2", "FHIR", "REST API"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <ShieldCheck className="h-3.5 w-3.5" /> FAQ
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Common Questions</h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-6 transition-shadow open:shadow-[var(--shadow-brand)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
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
                <p className="mt-4 pl-8 text-sm leading-relaxed text-foreground/75 md:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-24 md:px-12"
        style={{ backgroundColor: "#091628" }}
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.35), transparent 55%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.4), transparent 55%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Ready to Modernize{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Your Laboratory?
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Join hundreds of labs that have already cut errors, reduced delays, and passed audits with confidence.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book a Free Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">No contracts. No setup fees. Cancel anytime.</p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
