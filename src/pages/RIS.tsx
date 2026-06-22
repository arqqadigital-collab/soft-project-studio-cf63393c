import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  CalendarClock,
  ScanLine,
  FileText,
  ListChecks,
  UserCheck,
  BellRing,
  Inbox,
  CalendarCheck,
  ImagePlus,
  Mic,
  Send,
} from "lucide-react";
import risProblem1 from "@/assets/ris/problem-1.jpg";
import risProblem2 from "@/assets/ris/problem-2.jpg";
import risProblem3 from "@/assets/ris/problem-3.jpg";
import risProblem4 from "@/assets/ris/problem-4.jpg";
import risProblem5 from "@/assets/ris/problem-5.jpg";
import risJourney1 from "@/assets/ris/journey-1.jpg";
import risJourney2 from "@/assets/ris/journey-2.jpg";
import risJourney3 from "@/assets/ris/journey-3.jpg";
import risJourney4 from "@/assets/ris/journey-4.jpg";
import risJourney5 from "@/assets/ris/journey-5.jpg";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const features = [
  { icon: CalendarClock, title: "Order Management & Scheduling", body: "Receive imaging orders directly from your HIS or EMR. Schedule patients against modality availability, technologist assignments, and room capacity. Eliminate double bookings with real-time calendar logic and automated patient notifications." },
  { icon: ScanLine, title: "DICOM Image Linking & Viewer", body: "Automatically link acquired images to their corresponding orders and patient records. Launch your PACS viewer directly from within the RIS with a single click — no hunting through separate systems." },
  { icon: FileText, title: "Structured Reporting & Voice", body: "Give radiologists a faster way to report. Choose procedure-specific structured templates or dictate findings with integrated voice recognition. Reports are auto-populated and ready for sign-off in seconds." },
  { icon: ListChecks, title: "Intelligent Worklist Prioritization", body: "Studies are automatically triaged by urgency, modality, patient age, and clinical indication. Critical and STAT studies surface to the top so nothing urgent is missed or delayed." },
  { icon: UserCheck, title: "Referring Physician Portal", body: "Give referring doctors instant, secure access to final reports and linked images the moment they're signed. A clean, role-based portal accessible from any device — no phone calls, no faxes." },
  { icon: BellRing, title: "Critical Finding Alerts", body: "When a radiologist identifies a critical finding, the system triggers an immediate notification to the ordering physician with a mandatory acknowledgment workflow — a defensible communication record." },
];

const journey = [
  { icon: Inbox, title: "Order Received", image: risJourney1, body: "Imaging requests arrive from the EMR, HIS, or are entered directly. Patient demographics, clinical indication, and priority level are captured automatically." },
  { icon: CalendarCheck, title: "Patient Scheduled", image: risJourney2, body: "The system matches the order to the right modality, time slot, and technologist. The patient receives a confirmation — no manual coordination required." },
  { icon: ImagePlus, title: "Images Acquired & Linked", image: risJourney3, body: "After the scan, DICOM images are automatically associated with the order and patient record. The study appears instantly on the radiologist's worklist." },
  { icon: Mic, title: "Report Dictated & Signed", image: risJourney4, body: "The radiologist opens the study, reviews images in the integrated viewer, dictates or types findings using structured templates, and signs the report digitally." },
  { icon: Send, title: "Report Delivered", image: risJourney5, body: "The final report is immediately available to the referring physician via portal, HL7 message, or print. The complete study is archived with a full audit trail." },
];

const stats = [
  { value: "75%", label: "Reduction in average report turnaround time" },
  { value: "100%", label: "DICOM image-to-order matching rate with automated linking" },
  { value: "3×", label: "Faster report sign-off with structured templates and voice dictation" },
  { value: "50%", label: "Reduction in scheduling conflicts with real-time calendar integration" },
];

const problemCards = [
  { title: "Unorganized Worklists", image: risProblem1, body: "Radiologists buried in unprioritized worklists with no triage logic — critical studies waiting behind routine ones." },
  { title: "No Referrer Portal", image: risProblem2, body: "Referring physicians calling for results because the portal doesn't exist or doesn't work — wasting everyone's time." },
  { title: "Unreported Criticals", image: risProblem3, body: "Critical findings sitting unreported because there's no escalation workflow or mandatory acknowledgment." },
  { title: "Manual Image Matching", image: risProblem4, body: "Hours lost each week manually matching images to orders and reports — and errors when they don't line up." },
  { title: "Paper Scheduling", image: risProblem5, body: "Paper-based scheduling causing double bookings, missed slots, and avoidable machine downtime." },
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
  { q: "Does this replace our PACS?", a: "No. Secreta RIS works alongside your existing PACS. It manages the workflow — orders, scheduling, worklists, and reporting — while your PACS handles image storage and viewing. The two systems talk seamlessly." },
  { q: "How does the voice dictation work?", a: "Voice recognition is embedded directly in the reporting screen. Radiologists speak their findings, which are transcribed in real time and mapped to the structured report template. No third-party software required." },
  { q: "Can we customize the report templates?", a: "Yes. Templates are fully customizable per modality, procedure type, and department. Your team can build and manage templates without any coding." },
  { q: "What happens if a critical finding is not acknowledged?", a: "The system escalates automatically. If the initial notification isn't acknowledged within your defined timeframe, a second alert is sent to a backup contact, and the event is logged in the audit trail." },
  { q: "How long does onboarding take?", a: "Most radiology departments are live within 2 to 6 weeks depending on the number of modalities, PACS connections, and custom workflow requirements." },
  { q: "Is patient data secure?", a: "All data is encrypted in transit and at rest. Role-based access controls ensure users only see what they're authorized to view. HIPAA compliant with local data residency options." },
];

const trustChips = [
  "150+ Imaging Centers",
  "DICOM Compliant",
  "HL7 & PACS Ready",
  "HIPAA Certified",
  "IHE Radiology Profiles",
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

export default function RIS() {
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
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${risJourney3})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/90" />
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
                See More. Diagnose Faster.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Report Smarter.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Reimagine Your Radiology Workflow <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Watch a Live Demo
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
            Introducing Secreta RIS
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>From Order to Archive,</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Every Step Connected
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A radiology workflow platform that connects your imaging department from order to archive. Designed to
            reduce turnaround times, eliminate paperwork, and give radiologists the tools they need to deliver
            confident, timely reads — every shift, every modality, every patient.
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
              Is Your Radiology Department{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Held Back By This?
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Your imaging department moves fast. Your system should too.
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
              One Platform. Every Step of the Radiology Workflow.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the moment an imaging order is placed to the second the final report lands in the physician's
              hands — Secreta RIS keeps everything connected, documented, and moving.
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
              From Order to Archive in 5 Steps
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Every step connected, every study moving — from intake to delivery.
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
              Outcomes That Speak for Themselves
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
          <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-white/70 md:text-base">
            Zero missed critical findings with mandatory escalation and acknowledgment workflows.
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
            Plugs Into Your Existing Ecosystem
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta RIS connects with your PACS, HIS, and EMR without disrupting existing workflows. Pre-built
            integrations with Epic, Cerner, Agfa, Philips IntelliSpace, and all major HL7-compatible platforms. Full
            DICOM Worklist (DICOM MWL) support. Open REST API for custom connections.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {["Epic", "Cerner", "Agfa", "Philips IntelliSpace", "HL7 v2", "HL7 FHIR", "DICOM", "DICOM MWL", "IHE Radiology", "REST API"].map(
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
            Your Radiology Department{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Deserves Better Tools.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Stop losing time to manual worklists, disconnected systems, and delayed reports. Give your radiologists
            and referring physicians the platform that keeps every study moving.
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

          <p className="mt-8 text-sm italic text-white/60">No setup fees. No contracts. Full support from day one.</p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
