import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  ClipboardList,
  Map,
  Workflow,
  Pill,
  Brain,
  Database,
  Sparkles,
  BadgeCheck,
  Users,
  GitBranch,
  Activity,
  Target,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import emramHeroVideo from "@/assets/emram/emram-hero.mp4";
import emramCtaVideo from "@/assets/emram/emram-cta.mp4";
import emramP1 from "@/assets/emram/problem/p1.jpg";
import emramP2 from "@/assets/emram/problem/p2.jpg";
import emramP3 from "@/assets/emram/problem/p3.jpg";
import emramP4 from "@/assets/emram/problem/p4.jpg";
import emramP5 from "@/assets/emram/problem/p5.jpg";
import emramP6 from "@/assets/emram/problem/p6.jpg";
import emramJ1 from "@/assets/emram/journey/j1.jpg";
import emramJ2 from "@/assets/emram/journey/j2.jpg";
import emramJ3 from "@/assets/emram/journey/j3.jpg";
import emramJ4 from "@/assets/emram/journey/j4.jpg";
import emramJ5 from "@/assets/emram/journey/j5.jpg";
import emramJ6 from "@/assets/emram/journey/j6.jpg";
import emramJ7 from "@/assets/emram/journey/j7.jpg";

const features = [
  {
    icon: ClipboardList,
    title: "EMRAM Baseline Assessment",
    body: "Rigorous baseline assessment of your current EMRAM position — clinical systems, integration architecture, workflow digitization, data quality, closed-loop safety and adoption — scored against validated HIMSS EMRAM methodology with a prioritized gap roadmap.",
  },
  {
    icon: Map,
    title: "Stage-by-Stage Roadmap",
    body: "A detailed, time-bound roadmap from your current position to Stage 7. Each stage specifies technology, workflow redesign, integration, adoption milestones and validation criteria — sequenced to minimize operational disruption.",
  },
  {
    icon: Workflow,
    title: "Clinical Workflow Digitization",
    body: "Our clinical transformation team works alongside your leads to redesign workflows, build adoption and achieve the sustained usage rates EMRAM validation requires. Technology without adoption does not pass EMRAM. We manage both.",
  },
  {
    icon: Pill,
    title: "Closed-Loop Medication Safety",
    body: "End-to-end closed-loop medication: ePrescribing, pharmacy verification, dispensing cabinet integration and barcode-verified bedside administration — delivered with the change management needed for consistent staff compliance.",
  },
  {
    icon: Brain,
    title: "Clinical Decision Support Maturity",
    body: "Condition-specific order sets, evidence-based pathways, sepsis screening, deterioration alerts and preventive reminders — built, configured, validated and measured against the clinical outcomes EMRAM assessors look for.",
  },
  {
    icon: Database,
    title: "Data Integration & Interoperability",
    body: "Target integration architecture with HL7 FHIR interfaces, clinical data repositories and master patient index. Every system talks to every other system — patient data follows the patient without gaps, delays or manual reconciliation.",
  },
  {
    icon: Sparkles,
    title: "AI Readiness Assessment",
    body: "Evaluation of data completeness, data quality, governance maturity, clinical AI literacy and infrastructure capacity against the requirements for safe, effective clinical AI deployment — with a targeted program to close every gap.",
  },
  {
    icon: BadgeCheck,
    title: "Validation Preparation & Support",
    body: "Documentation preparation, leadership coaching, pre-validation mock assessments and on-site support through formal HIMSS validation — followed by operational sustainability practices to maintain your stage.",
  },
];

const journey = [
  {
    icon: ClipboardList,
    image: emramJ1,
    title: "Baseline Assessment",
    body: "We assess your current EMRAM position across all criteria. You receive a current-state score, a gap analysis and a prioritized roadmap.",
  },
  {
    icon: Users,
    image: emramJ2,
    title: "Roadmap Agreement",
    body: "Leadership reviews and approves the roadmap. Resources, timelines and governance structures are agreed. The transformation program begins.",
  },
  {
    icon: GitBranch,
    image: emramJ3,
    title: "Technology & Integration",
    body: "Missing systems are implemented. Integration gaps are closed. Closed-loop medication safety, CDS and electronic documentation are built to EMRAM specification.",
  },
  {
    icon: Workflow,
    image: emramJ4,
    title: "Clinical Adoption",
    body: "Workflows are redesigned, staff are trained, adoption is measured and managed. EMRAM operational standards are embedded in daily clinical practice.",
  },
  {
    icon: Sparkles,
    image: emramJ5,
    title: "AI Readiness Foundation",
    body: "Data quality, governance and infrastructure are built to support clinical AI. The readiness assessment confirms readiness for Stage 7 AI-powered analytics.",
  },
  {
    icon: BadgeCheck,
    image: emramJ6,
    title: "Validation & Certification",
    body: "Pre-validation mock assessment is conducted, gaps are closed and the formal HIMSS validation is supported from preparation through on-site assessment.",
  },
  {
    icon: Target,
    image: emramJ7,
    title: "Sustained Excellence",
    body: "Post-validation operational support ensures EMRAM standards are maintained. AI capabilities are progressively deployed on the mature digital foundation.",
  },
];

const stats = [
  {
    value: "100%",
    label:
      "First-attempt EMRAM validation pass rate for clients completing the full Secreta roadmap program",
  },
  {
    value: "1.8",
    label: "Average advancement in EMRAM stages within the first 18 months of program commencement",
  },
  {
    value: "94%",
    label: "Closed-loop medication administration compliance achieved by Stage 6 target clients",
  },
  {
    value: "40+",
    label:
      "Stage 6 and Stage 7 EMRAM achievements supported across the GCC, Middle East and internationally",
  },
];

const problemCards = [
  {
    image: emramP1,
    title: "Fragmented Clinical Data",
    body: "Most hospitals enter the EMRAM journey with fragmented, inconsistent or uncleaned data that cannot be trusted in clinical practice — let alone power AI.",
  },
  {
    image: emramP2,
    title: "Clinical Transformation Gap",
    body: "IT teams understand the technical requirements but lack the clinical transformation expertise to drive the workflow changes Stage 6 and Stage 7 demand.",
  },
  {
    image: emramP3,
    title: "No Framework for Progress",
    body: "Leadership invests in digital transformation without a clear framework for measuring progress, demonstrating value or maintaining operational standards.",
  },
  {
    image: emramP4,
    title: "Workflow Adoption Underestimated",
    body: "EMRAM is not purely technical — it requires clinical leadership engagement, staff behavior change and sustained organizational commitment most programs underestimate.",
  },
  {
    image: emramP5,
    title: "Closed-Loop Medication Complexity",
    body: "ePrescribing through pharmacy verification, dispensing cabinet integration and barcode-verified administration is the requirement hospitals find most challenging.",
  },
  {
    image: emramP6,
    title: "AI Readiness Is Not a Certificate",
    body: "Stage 7 opens the door to clinical AI — but data quality, governance frameworks, validation processes and AI literacy must be built systematically.",
  },
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
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border md:h-full"
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]"
              aria-hidden="true"
            />
            <div
              className={`relative flex h-full min-h-[320px] flex-col ${isActive ? "p-6" : "p-3"}`}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-5 flex h-[calc(100%-2.75rem)] flex-col">
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: isActive ? 0.25 : 0 }}
                  className="flex-1"
                >
                  {isActive && (
                    <>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Stage {i + 1}
                      </div>
                      <h3 className="mt-2 text-lg font-bold leading-tight text-white md:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 md:text-sm">
                        {step.body}
                      </p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/65">
                      Stage {i + 1}
                    </div>
                    <h3 className="mt-1.5 text-xs font-semibold leading-snug text-white md:text-sm">
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

const faqs = [
  {
    q: "How long does it take to achieve EMRAM Stage 7 from a typical starting point?",
    a: "From Stage 3 or Stage 4 — where most hospitals begin a structured EMRAM program — achieving Stage 7 typically takes 3 to 5 years depending on size, complexity, starting maturity and change capacity. The clinical improvements delivered at each stage have measurable patient safety and operational value long before Stage 7 is achieved.",
  },
  {
    q: "What is the difference between EMRAM and other digital health certification frameworks?",
    a: "EMRAM is the most widely recognized and rigorously validated framework globally. Unlike self-reported certifications, Stage 6 and Stage 7 require on-site validation by HIMSS-certified assessors who verify systems are in use, integrated and adopted — not merely implemented. GCC health authorities and international accreditation bodies use it as the digital maturity benchmark.",
  },
  {
    q: "Do we need to implement all of Secreta's modules to achieve EMRAM?",
    a: "No. EMRAM evaluates functional capability and adoption, not specific vendor products. Secreta works with your existing system landscape, filling gaps where needed and integrating what already exists. We do not require replacement of functioning systems as a condition of EMRAM support.",
  },
  {
    q: "What does AI readiness actually require beyond EMRAM Stage 7?",
    a: "Stage 7 provides the integrated, standardized, complete data foundation AI requires. AI readiness additionally requires data quality validation, governance frameworks for model validation and post-deployment monitoring, clinical leadership AI literacy and infrastructure capable of supporting real-time inference at clinical workflow speed. Our AI readiness program addresses each dimension systematically.",
  },
  {
    q: "What happens to our EMRAM stage after validation if systems or workflows change?",
    a: "EMRAM requires annual validation maintenance. Secreta provides post-validation support to ensure system changes, workflow updates and new clinical program launches do not inadvertently compromise compliance. Sustainability governance frameworks are established at Stage 7 go-live to manage this ongoing requirement.",
  },
];

const trustChips = [
  "HIMSS EMRAM Methodology",
  "Stage 6 & Stage 7 Validation",
  "Closed-Loop Medication",
  "Clinical Decision Support",
  "HL7 FHIR R4 Architecture",
  "AI Readiness Program",
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

export default function EMRAM() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-78%"]);

  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={emramHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,11,24,0.7)_0%,rgba(7,20,43,0.78)_60%,rgba(5,11,24,0.9)_100%)]" />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Your Path to EMRAM Stage 7 —{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  and the AI Capabilities That Come With It.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Start Your EMRAM Journey <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Baseline Assessment
                </a>
              </div>

              <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-2 px-2">
                {trustChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur md:text-xs"
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
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            EMRAM Stage 7 — The Global Gold Standard
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>A Fully Paperless, Closed-Loop,</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Analytically Capable Hospital.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            EMRAM Stage 7 is the global gold standard for hospital digital maturity. It signals to
            patients, payers, regulators, and partners that your organization has achieved a fully
            paperless, closed-loop, analytically capable clinical environment. But most hospitals
            are not on a structured path to get there. Secreta EMRAM Roadmap & AI Readiness gives
            your organization the strategy, the technology, and the implementation support to
            advance through every EMRAM stage — and to emerge at Stage 7 genuinely ready for
            AI-powered clinical decision support, predictive analytics, and population health
            management.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll on dark */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "300vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              EMRAM Stage 7 Is Not a Technology Milestone.{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                It Is an Organizational Transformation.
              </span>
            </h2>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div
              style={{ x: problemX }}
              className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12"
            >
              {problemCards.map((card, i) => {
                return (
                  <article
                    key={card.title}
                    className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[440px] lg:w-[480px]"
                  >
                    <div className="relative h-[190px] w-full overflow-hidden md:h-[210px]">
                      <img
                        src={card.image}
                        alt={card.title}
                        loading="lazy"
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                        0{i + 1} — Challenge
                      </span>
                      <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">
                        {card.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">{card.body}</p>
                    </div>
                  </article>
                );
              })}
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
              The Program
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              A Structured, Supported, Stage-by-Stage Path to Digital Excellence
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Eight integrated capabilities that take your organization from baseline assessment
              through Stage 7 validation — and into a future of meaningful clinical AI.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: (i % 4) * 0.08 }}
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
              From Assessment to Stage 7 — A Structured Journey
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Seven sequenced stages that take your organization from current state to validated
              digital excellence — and into sustained AI-enabled operation.
            </p>
          </div>
          <ExpandingJourney steps={journey} />
        </div>
      </section>

      {/* METRICS */}
      <section
        className="relative overflow-hidden px-6 py-24 md:px-12"
        style={{ backgroundColor: "#091628" }}
      >
        <div
          className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Outcomes
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              EMRAM Achievement Outcomes Across Our Client Portfolio
            </h2>
            <p className="mt-4 text-sm text-white/65 md:text-base">
              Validated outcomes from clients on the full Secreta EMRAM program.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur"
              >
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
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> Integrations
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Built on an Integration Architecture Designed for Stage 7
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
              EMRAM Stage 7 requires a fully integrated digital hospital. Our integration framework
              connects every clinical system — EMR, laboratory, radiology, pharmacy, operating
              theatre, ICU and more — through a standards-based interoperability architecture that
              meets HIMSS EMRAM validation requirements.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Integration Standards</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "HL7 FHIR R4",
                  "HL7 v2",
                  "IHE Profiles",
                  "DICOM",
                  "SNOMED CT",
                  "LOINC",
                  "RxNorm",
                  "REST API",
                  "Clinical Data Repository Architecture",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">EMRAM Stages Supported</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Stage 1",
                  "Stage 2",
                  "Stage 3",
                  "Stage 4",
                  "Stage 5",
                  "Stage 6",
                  "Stage 7",
                  "O-EMRAM (Outpatient)",
                  "C-EMRAM (Community)",
                  "INFRAM Alignment",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
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
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Common Questions
            </h2>
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
                <p className="mt-4 pl-8 text-sm leading-relaxed text-foreground/75 md:text-base">
                  {f.a}
                </p>
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
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={emramCtaVideo}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,22,40,0.78)_0%,rgba(9,22,40,0.85)_100%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            EMRAM Stage 7 Is Not the Finish Line.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              It Is the Starting Line for What Healthcare Can Become.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            A Stage 7 hospital has the digital foundation to deploy clinical AI that saves lives,
            predict deterioration before it happens, manage populations proactively and deliver care
            measurably safer, faster and more effective than fragmented systems can support. The
            path starts with knowing where you are today.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your EMRAM Baseline Assessment <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Download the EMRAM Stage Guide
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Advisory and implementation support available in Arabic and English. GCC and
            international experience. Assessment findings delivered within 4 weeks.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
