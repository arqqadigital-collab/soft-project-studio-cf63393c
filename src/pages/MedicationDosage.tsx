import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
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
} from "lucide-react";
import problemAllergy from "@/assets/medication/problems/allergy.jpg";
import problemPaper from "@/assets/medication/problems/paper-mar.jpg";
import problemInteraction from "@/assets/medication/problems/interaction.jpg";
import problemControlled from "@/assets/medication/problems/controlled.jpg";
import problemPediatric from "@/assets/medication/problems/pediatric-dose.jpg";
import journeyPrescribe from "@/assets/medication/journey/prescribe.jpg";
import journeyVerify from "@/assets/medication/journey/verify.jpg";
import journeyDispense from "@/assets/medication/journey/dispense.jpg";
import journeyAdminister from "@/assets/medication/journey/administer.jpg";
import journeyDocument from "@/assets/medication/journey/document.jpg";
import bgStepsLight from "@/assets/bg-steps-light.png.asset.json";
import ctaVideo from "@/assets/medication/cta-video.mp4.asset.json";
import heroVideo from "@/assets/medication/hero-video.mp4.asset.json";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const features = [
  { icon: Stethoscope, title: "Electronic Prescribing with Clinical Decision Support", body: "Physicians prescribe digitally with real-time clinical decision support running in the background. Drug-drug interaction checks, allergy cross-referencing, duplicate therapy alerts, and contraindication warnings fire at the point of prescribing — before the order is placed, not after. Alerts are tiered by severity so clinicians see what matters without alert fatigue." },
  { icon: Pill, title: "Weight- and Age-Based Dosage Calculation Engine", body: "For pediatric, neonatal, and renally impaired patients, dosing errors are most dangerous and most common. Our built-in calculation engine pulls the patient's current weight, age, and renal function from the clinical record and computes the correct dose range automatically. Prescribers see the recommended dose alongside safe minimum and maximum thresholds — every time." },
  { icon: ClipboardCheck, title: "Pharmacy Order Verification & Dispensing Queues", body: "Every electronic prescription lands directly in the pharmacy queue. Pharmacists review, clinically verify, and approve orders from a single organized screen — with patient history, current medication list, and interaction summaries always visible. Dispensing labels are generated automatically. Priority and urgent orders are surfaced to the top of the queue." },
  { icon: ScanLine, title: "Medication Administration Records with Barcode Scanning", body: "Nurses access a live, always-current eMAR at the bedside. Before administering any medication, they scan the patient wristband and the medication barcode. The system confirms the five rights — right patient, right drug, right dose, right route, right time — and flags any mismatch before administration occurs. Every administration is timestamped and logged automatically." },
  { icon: Lock, title: "Controlled Substance Tracking & Reconciliation", body: "Track every controlled substance from receipt to administration to waste. Tamper-evident digital logs record who accessed what, when, and how much was used or discarded. End-of-shift reconciliation is guided by the system, with discrepancy alerts escalating automatically to pharmacy supervisors. Diversion detection logic flags statistical anomalies for review." },
  { icon: Boxes, title: "Real-Time Pharmacy Inventory & Stock Visibility", body: "Pharmacists and ward managers see live stock levels across every dispensing location — central pharmacy, satellite pharmacies, automated dispensing cabinets, and ward stocks. Low-stock alerts trigger reorder workflows before shortages occur. Expiry tracking prevents expired medications from reaching patients." },
  { icon: RefreshCcw, title: "Medication Reconciliation at Care Transitions", body: "When a patient is admitted, transferred, or discharged, the system generates a complete reconciliation view — comparing home medications, inpatient orders, and discharge prescriptions side by side. Clinicians can identify, resolve, and document discrepancies in a structured workflow that reduces post-discharge adverse drug events." },
];

const journey = [
  { icon: FileText, title: "Prescribe", image: journeyPrescribe, body: "The physician opens the patient record and enters a medication order. Clinical decision support checks for allergies, interactions, and dose appropriateness in real time. The order is placed only when it is safe to proceed." },
  { icon: ClipboardCheck, title: "Verify", image: journeyVerify, body: "The prescription arrives instantly in the pharmacy queue. The pharmacist reviews the order in clinical context, approves it, and prepares the medication. Dispensing labels are printed automatically with all required identifiers." },
  { icon: Boxes, title: "Dispense", image: journeyDispense, body: "The medication is dispensed from the correct location — central pharmacy, automated cabinet, or ward stock — with every movement logged against the patient order. Controlled substances require dual verification." },
  { icon: Syringe, title: "Administer", image: journeyAdminister, body: "The nurse scans the patient wristband and the medication barcode at the bedside. The system confirms a match against the live eMAR and gives a green light for administration. Any mismatch stops the process and triggers an alert." },
  { icon: FileCheck, title: "Document & Review", image: journeyDocument, body: "Administration is recorded automatically. Missed doses, refusals, and partial doses are flagged for clinical review. Pharmacists and physicians see the complete medication administration history in real time." },
];

const stats = [
  { value: "87%", label: "Reduction in medication administration errors after eMAR and barcode scanning go-live" },
  { value: "100%", label: "Of controlled substance transactions logged with full audit trail" },
  { value: "92%", label: "Of drug interaction alerts resolved at the prescribing stage — before the order is placed" },
  { value: "40%", label: "Reduction in time spent on end-of-shift controlled substance reconciliation" },
  { value: "3×", label: "Faster pharmacy order processing with digital queues and automated label generation" },
  { value: "0", label: "Missed allergy alerts reported across all client sites post-implementation" },
];

const problemCards = [
  { title: "Prescribing Without Allergy Awareness", image: problemAllergy, body: "A physician prescribes a drug without knowing the patient is allergic. Cross-reactive drug families are missed, and the patient is exposed to a preventable adverse reaction." },
  { title: "Outdated Paper MARs", image: problemPaper, body: "A nurse administers the wrong dose because the paper MAR was updated after she printed it. What she holds in her hand is already out of date — and the patient pays the price." },
  { title: "Missed Drug Interactions", image: problemInteraction, body: "A pharmacist misses a dangerous interaction because two prescribers are using separate systems. The warning never fires, and a harmful combination reaches the patient." },
  { title: "Unaccounted Controlled Substances", image: problemControlled, body: "A controlled substance goes unaccounted for because reconciliation is done manually at end of shift. Paper logs are incomplete, and diversion goes undetected." },
  { title: "Weight-Based Dosing Errors", image: problemPediatric, body: "A child receives an adult dose because weight-based calculation was done on a pocket calculator. A decimal place error, a unit conversion mistake — both can be fatal in pediatric care." },
];

const faqs = [
  { q: "How does the system handle drug allergy checking?", a: "Allergy information is pulled directly from the patient's clinical record. When a prescriber selects a medication, the system cross-references it against the full allergy list — including cross-reactive drug families — and displays a graded alert if any match is found. The prescriber must document a clinical justification to proceed past a high-severity alert." },
  { q: "Can clinical decision support rules be customized?", a: "Yes. Your pharmacy and clinical informatics team can configure interaction thresholds, alert severity tiers, custom dosing protocols, and formulary restrictions. Customization does not require vendor involvement after initial setup." },
  { q: "Does the system work with automated dispensing cabinets?", a: "Yes. Secreta integrates with leading ADC systems including Omnicell and Pyxis. Dispensing cabinet transactions sync automatically with the patient medication record and pharmacy inventory in real time." },
  { q: "How does the pediatric dosing engine get patient weight?", a: "Weight is pulled automatically from the patient's clinical record at the time of prescribing. If no current weight is recorded, the system prompts the prescriber to enter or confirm one before the dose calculation is displayed. Manual override is available with mandatory documentation." },
  { q: "What happens if a nurse scans a wrong medication at the bedside?", a: "The barcode scan triggers an immediate mismatch alert on the eMAR screen. The administration is blocked and the nurse is shown what the correct medication should be. The event is logged automatically for pharmacy and clinical review." },
  { q: "How is controlled substance diversion detected?", a: "The system tracks statistical patterns in controlled substance access and waste across users, shifts, and locations. When a user's behavior deviates significantly from peer benchmarks — for example, consistently higher waste rates or access outside normal patterns — a confidential alert is generated for the pharmacy director." },
  { q: "How long does implementation take?", a: "Most hospitals complete full implementation in 4 to 8 weeks. Complex multi-site deployments with multiple HIS integrations may require additional time. A dedicated implementation specialist is assigned to every account, and training is delivered on-site and virtually." },
];

const trustChips = [
  "Deployed across 300+ hospitals",
  "HIPAA & GDPR Compliant",
  "Joint Commission Ready",
  "Supports CPOE & eMAR Standards",
  "HL7 v2 & FHIR",
  "GS1 Barcodes",
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
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full md:p-8"
            style={{ flexBasis: 0, minWidth: 0 }}
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
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.body}</p>
                    </>
                  )}
                </motion.div>

                {!isActive && (
                  <div className="mt-auto text-left">
                    <div className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] text-white/65">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-2 text-left text-lg font-semibold text-white md:text-xl">
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

export default function MedicationDosage() {
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
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo.url}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,14,26,0.75) 0%, rgba(10,14,26,0.65) 40%, rgba(10,14,26,0.85) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">

          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="whitespace-nowrap text-2xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                Every Dose Precise.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Every Patient Protected.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Eliminate Medication Errors Today <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See How It Works
                </a>
              </div>

              <div className="mt-10 flex flex-nowrap items-center justify-center gap-3 overflow-x-auto pb-2">
                {trustChips.map((chip) => (
                  <span
                    key={chip}
                    className="shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur md:text-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRO */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Built for Medication Management
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>A Closed-Loop System for the </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Full Medication Lifecycle.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Eliminate medication errors and streamline pharmaceutical workflows across every ward and department. Our system gives clinicians, pharmacists, and nurses a unified platform to prescribe, verify, dispense, and administer with confidence — closing the gaps where errors happen, and patients get hurt.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll on dark */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
          {/* Header */}
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
              Medication Errors Are the Most Preventable Patient Safety Crisis in Healthcare.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                They Happen Every Day.
              </span>
            </h2>
          </div>

          {/* Horizontally scrolling cards */}
          <div className="mt-6 flex flex-1 items-center overflow-hidden md:mt-8">
            <motion.div style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => (
                <article
                  key={i}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[440px] lg:w-[480px]"
                >
                  <div className="relative h-[190px] w-full overflow-hidden md:h-[210px]">
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
                    <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      {card.body}
                    </p>
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
              A Closed-Loop Medication System That Protects Patients at Every Step
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the prescriber's screen to the patient's bedside, every handoff in the medication process is validated, documented, and traceable. No gaps. No guesswork. No exceptions.
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

      {/* HOW IT WORKS — expanding journey */}
      <section
        className="relative px-6 py-24 md:px-12"
        style={{
          backgroundImage: `url(${bgStepsLight.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Workflow className="h-3.5 w-3.5" /> How It Works
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Closed-Loop Medication Management in 5 Steps
            </h2>
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
              Safety Outcomes Measured Across Our Client Network
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-white/70 md:text-base">
            Zero missed allergy alerts reported across all client sites post-implementation. 3× faster pharmacy order turnaround with digital queues.
          </p>
        </div>
      </section>

      {/* INTEGRATIONS — single row */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            One Platform That Connects Your Entire Medication Ecosystem
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta Medication Management integrates with your EMR, HIS, laboratory systems, and automated dispensing cabinets to create a seamless closed-loop environment. Lab results flow in to support real-time dose adjustment. Pharmacy data syncs with clinical records automatically.
          </p>
          <div className="mt-10 flex flex-nowrap items-center gap-3 overflow-x-auto pb-2 md:justify-center md:overflow-visible">
            {[
              "Epic",
              "Cerner",
              "Meditech",
              "Omnicell",
              "Pyxis",
              "BD Rowa",
              "Kirby Lester",
              "HL7 v2 & FHIR",
              "NCPDP SCRIPT",
              "GS1 Barcodes",
              "REST API",
              "CPOE & eMAR Standards",
            ].map((tag) => (
              <span
                key={tag}
                className="shrink-0 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm"
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
        <video
          src={ctaVideo.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,22,40,0.85) 0%, rgba(9,22,40,0.75) 50%, rgba(9,22,40,0.9) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Patient Safety Begins{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Before the First Dose Is Given.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/85">
            Every medication your team administers carries the weight of a patient's trust. Give your clinicians, pharmacists, and nurses the system that matches that responsibility — with the decision support, barcode verification, and audit trails that leave nothing to chance.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Free Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/70">
            No setup fees. No long-term contracts. Dedicated support from day one.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
