import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  UserCheck,
  FileCheck2,
  ClipboardList,
  FileText,
  Send,
  BarChart3,
  Wallet,
  Banknote,
  Receipt,
  Stethoscope,
  CreditCard,
} from "lucide-react";
import rcmHeroVideo from "@/assets/rcm/rcm-hero.mp4";
import hisVideo from "@/assets/rcm/his-video.mp4";
import rcmProblem1 from "@/assets/rcm/problem-1.jpg";

import rcmProblem3 from "@/assets/rcm/problem-3.jpg";
import rcmProblem4 from "@/assets/rcm/problem-4.jpg";
import rcmProblem5 from "@/assets/rcm/problem-5.jpg";
import rcmProblem2Real from "@/assets/rcm/rcm-problem-2-real.png";
import rcmJourney1 from "@/assets/rcm/journey-1.jpg";
import rcmJourney2 from "@/assets/rcm/journey-2.jpg";
import rcmJourney3 from "@/assets/rcm/journey-3.jpg";
import rcmJourney4 from "@/assets/rcm/journey-4.jpg";
import rcmJourney5 from "@/assets/rcm/journey-5.jpg";
import rcmJourney6 from "@/assets/rcm/journey-6.jpg";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const features = [
  {
    icon: UserCheck,
    title: "Registration & Eligibility Verification",
    body: "Capture complete demographics and verify insurance eligibility in real time against the payer's active policy database. Lapsed coverage, exclusions, and pending authorizations are flagged at the front door — not weeks later when claims are denied.",
  },
  {
    icon: FileCheck2,
    title: "Prior Authorization Management",
    body: "Authorization requests are generated automatically from clinical orders. Status is visible to clinical and admin teams in real time. Expired authorizations trigger renewal alerts before service delivery. Claims are never submitted without a valid authorization.",
  },
  {
    icon: ClipboardList,
    title: "Automated Charge Capture",
    body: "Every billable event — procedures, medications, investigations, bed days — flows from the clinical record to billing without manual entry. Missed-charge detection identifies documentation that suggests a billable service was delivered but not captured.",
  },
  {
    icon: FileText,
    title: "Coding & Code Optimization",
    body: "ICD-10, CPT, and DRG coding with NLP-assisted code suggestions from clinical documentation. Coders work from a structured interface with codes, guidelines, and the clinical record side by side. Coding accuracy tracked by coder, department, and service line.",
  },
  {
    icon: ShieldCheck,
    title: "Pre-Submission Claim Validation",
    body: "Every claim passes through a validation engine checking for missing fields, invalid combinations, authorization mismatches, and known payer-specific denial triggers. Only clean claims reach the payer. First-pass acceptance rates improve immediately.",
  },
  {
    icon: Send,
    title: "Multi-Payer Electronic Submission",
    body: "Claims submitted electronically to insurance companies, government programs, self-pay, and corporate accounts through certified channels. NPHIES (KSA), DHA eClaims (Dubai), and DOH (Abu Dhabi) integrations included. Paper claims eliminated.",
  },
  {
    icon: AlertTriangle,
    title: "Denial Management & Appeals",
    body: "Denied claims are captured, categorized by reason, and routed automatically. Appeal letters are generated from configurable templates with clinical documentation and authorization evidence attached. Appeal deadlines are tracked and escalated before windows close.",
  },
  {
    icon: Banknote,
    title: "Remittance & Underpayment Recovery",
    body: "Electronic remittance is processed automatically — payments matched, adjustments categorized, contractual allowances applied. Actual payer payments are compared against contracted rates to flag systematic underpayments that would otherwise go undetected.",
  },
  {
    icon: CreditCard,
    title: "Patient Financial Services",
    body: "Patient liability is calculated at the point of service. Payment plans are offered and documented digitally. Automated statements and structured collections workflows balance revenue recovery with patient financial experience.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Executive Dashboards",
    body: "Live dashboards for gross charges, net collections, days in A/R, denial rates by payer and reason, first-pass acceptance, and cash flow forecasts. Problems are identified and acted on the week they emerge — not the month after.",
  },
  {
    icon: Receipt,
    title: "Contract & Payer Performance",
    body: "Manage every payer contract — fee schedules, reimbursement rates, bundled payments, capitation. Performance analytics show what each payer is actually paying versus what was contracted, exposing underpayments and informing renegotiation.",
  },
  {
    icon: Wallet,
    title: "ZATCA & National Platform Compliance",
    body: "Native ZATCA Phase 2 e-invoicing for Saudi Arabia: every invoice formatted to Fatoora specifications, cryptographically stamped, and cleared in real time. NPHIES, DHA, and DOH submission pathways pre-configured.",
  },
];

const journey = [
  {
    icon: UserCheck,
    title: "Registration & Eligibility",
    image: rcmJourney1,
    body: "The patient registers. Insurance eligibility is verified in real time. Coverage, authorization requirements, and patient liability are confirmed before the first clinical interaction.",
  },
  {
    icon: FileCheck2,
    title: "Authorization",
    image: rcmJourney2,
    body: "Clinical orders requiring pre-authorization trigger automatic requests. Status is tracked through approval. Services are scheduled only when authorization is confirmed.",
  },
  {
    icon: Stethoscope,
    title: "Care Delivered & Charges Captured",
    image: rcmJourney3,
    body: "Every billable service — procedures, medications, investigations, bed days — is captured automatically from the clinical record. No manual charge entry. No missed charges.",
  },
  {
    icon: FileText,
    title: "Coding & Claim Generation",
    image: rcmJourney4,
    body: "Clinical documentation drives coding suggestions. Coders review, optimize, and finalize codes. Claims are generated automatically and pass through pre-submission validation.",
  },
  {
    icon: Send,
    title: "Submission & Tracking",
    image: rcmJourney5,
    body: "Claims submitted electronically to the correct payer through the correct channel. Status is tracked in real time. Approaching deadlines trigger automatic follow-up.",
  },
  {
    icon: Banknote,
    title: "Payment, Denials & Reconciliation",
    image: rcmJourney6,
    body: "Payments are matched to claims automatically. Underpayments are flagged. Denials are categorized and routed for appeal with documentation attached. The revenue cycle closes completely.",
  },
];

const stats = [
  { value: "96%", label: "Average first-pass claim acceptance rate vs. 75% GCC industry average" },
  { value: "34%", label: "Reduction in days in accounts receivable within the first six months" },
  {
    value: "78%",
    label: "Denial overturn rate on appeals with automated documentation and evidence",
  },
  { value: "14%", label: "Average increase in net collections per patient encounter" },
];

const problemCards = [
  {
    title: "Rejected Claims",
    image: rcmProblem1,
    body: "Claims submitted with incorrect or missing diagnosis codes, procedure codes, or documentation — rejected by payers with no obligation to explain how to fix them.",
  },
  {
    title: "Missed Charges",
    image: rcmProblem2Real,
    body: "Charges for procedures, medications, and bedside investigations never captured in billing because no one manually entered them and no automated capture exists.",
  },
  {
    title: "Expired Authorizations",
    image: rcmProblem3,
    body: "Prior authorizations expire before the procedure is performed, claims are submitted without a valid auth, and the payer denies on a technicality that should never have arisen.",
  },
  {
    title: "Reactive Denial Management",
    image: rcmProblem4,
    body: "Denials sit in a queue, get worked weeks later, some are resubmitted, many are written off because the appeal window has already closed.",
  },
  {
    title: "Monthly-in-Arrears Reporting",
    image: rcmProblem5,
    body: "By the time leadership sees a revenue problem in the data, the causes are weeks old and the financial impact has already accumulated.",
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full`}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.38)_0%,rgba(5,12,24,0.72)_50%,rgba(5,12,24,0.95)_100%)]"
              aria-hidden="true"
            />
            <div
              className={`relative flex h-full min-h-[320px] flex-col ${isActive ? "p-7" : "p-4"}`}
            >
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
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        Step {i + 1}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                        {step.body}
                      </p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-white md:text-base">
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
    q: "How quickly will we see improvement in claim acceptance rates after go-live?",
    a: "Most clients see measurable improvement in first-pass claim acceptance within the first two to three billing cycles after go-live — typically 4 to 8 weeks. The pre-submission validation engine begins catching errors immediately. Coding errors respond quickly to validation and NLP assistance; authorization-related denials improve as the tracking workflow becomes embedded in practice.",
  },
  {
    q: "How does automated charge capture work with our existing clinical systems?",
    a: "Charge capture is driven by integration between the clinical record and billing. When a physician documents a procedure, a pharmacist dispenses a medication, or a lab validates a result, the associated charge is generated automatically and routed to billing. Integration with your HIS, EMR, pharmacy, and lab systems is established during implementation, and charge rules are configured by your teams.",
  },
  {
    q: "Can the system handle multiple insurance companies with different formats and submission requirements?",
    a: "Yes. Secreta RCM maintains pre-configured submission profiles for all major GCC and international payers — including payer-specific claim formats, required documentation, code set requirements, and electronic submission pathways. The correct format and channel are applied automatically. New payers can be added as your contract portfolio evolves.",
  },
  {
    q: "How does underpayment detection work?",
    a: "Each remittance line is compared against the contracted rate for that service, code, and payer. When actual payment is below the contracted rate by more than a configurable threshold, the variance is flagged automatically. Flagged underpayments are queued with the contract reference, claimed amount, paid amount, and variance presented together — ready for a formal dispute with system-generated documentation.",
  },
  {
    q: "Does the system support ZATCA Phase 2 e-invoicing for Saudi Arabia?",
    a: "Yes. Every invoice is formatted to Fatoora specifications, cryptographically stamped, and submitted for real-time clearance through the ZATCA portal automatically. Cleared invoices are archived for the mandatory retention period. B2C simplified and B2B standard tax invoices are handled through separate compliant workflows. No manual intervention is required for compliance.",
  },
  {
    q: "How long does RCM implementation take?",
    a: "Standalone RCM implementation — without replacing an existing HIS — typically takes 6 to 12 weeks depending on payer integrations, charge capture configuration, and contract data volume. For facilities deploying Secreta HIS alongside, RCM modules go live as part of the integrated HIS program. A dedicated revenue cycle specialist manages the entire process through go-live and first-cycle review.",
  },
];

const trustChips = [
  "250+ Hospitals & Clinic Groups",
  "96% First-Pass Acceptance",
  "ZATCA Phase 2 Compliant",
  "NPHIES Integrated",
  "HL7 FHIR Ready",
  "Arabic & English",
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

export default function RCM() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-80%"]);

  return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={rcmHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
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
                Close Every Gap Between Care Delivered{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  and Revenue Collected.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Recover Your Lost Revenue <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Revenue Cycle Assessment
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
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Introducing Secreta RCM
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>From Patient Registration</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              to Final Payment
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Healthcare organizations deliver extraordinary care every day and fail to collect full
            payment for a significant portion of it — not because of poor clinical quality, but
            because of claim errors, missed charges, delayed submissions, and denial management
            processes that cannot keep pace with payer complexity. Secreta Revenue Cycle Management
            closes every gap between the care your team delivers and the revenue your organization
            collects — with end-to-end automation, real-time visibility, and the analytical
            intelligence to turn your revenue cycle from a cost center into a competitive advantage.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "300vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              Most Healthcare Organizations Are Leaving Revenue{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                on the Table.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Not because of poor clinical quality — but because of claim errors, missed charges,
              expired authorizations, and reactive denial management that can't keep pace with payer
              complexity.
            </p>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div
              style={{ x: problemX }}
              className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12"
            >
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
                    <h3 className="mt-3 text-lg font-bold leading-tight text-white md:text-xl">
                      {card.title}
                    </h3>
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
              End-to-End Revenue Cycle Automation
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Every function of the revenue cycle, connected and automated — from the front desk to
              the final dollar collected.
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
              Revenue Cycle Management in 6 Steps
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From first contact to final payment — every step automated, tracked, and reconciled.
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
              Revenue Cycle Performance Across Our Client Network
            </h2>
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
          <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-white/70 md:text-base">
            9% average charge leakage identified and recovered in the first 90 days of automated
            charge capture deployment. 100% of underpayment variances above threshold flagged
            automatically for payer audit.
          </p>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Connected to Every Payer, System, and National Platform
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta RCM connects with your clinical systems, national health platforms, payer
            portals, and financial management infrastructure — creating a revenue cycle that flows
            automatically from clinical activity to collected cash, without manual bridges between
            disconnected systems.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "NPHIES",
              "ZATCA Fatoora",
              "DHA eClaims",
              "DOH Abu Dhabi",
              "Qatar NHIX",
              "Bahrain NHRA",
              "Wasfaty",
              "Epic",
              "Cerner",
              "Meditech",
              "SAP",
              "Oracle Financials",
              "MS Dynamics",
              "HL7 v2 & FHIR R4",
              "ICD-10-AM",
              "CPT-4",
              "DRG GCC Grouper",
              "837/835 EDI",
              "REST API",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm"
              >
                {tag}
              </span>
            ))}
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
        <div className="absolute inset-0">
          <video
            src={hisVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-70"
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(56,189,248,0.25), transparent 55%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.3), transparent 55%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/55 via-[#091628]/45 to-[#091628]/65" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Every Claim You Lose Is Care You Delivered{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              and Were Not Paid For.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Your clinical teams work too hard and your patients receive too much value for your
            revenue cycle to be the place where that value leaks away. That ends today.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Revenue Cycle Assessment <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Pilot
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Revenue cycle baseline assessment included. Implementation and training support from day
            one.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
