import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
const problem1 = "/src/assets/his/problem-1.jpg";
const problem2 = "/src/assets/his/problem-2.jpg";
const problem3 = "/src/assets/his/problem-3.jpg";
const problem4 = "/src/assets/his/problem-4.jpg";
const problem5 = "/src/assets/his/problem-5.jpg";
const problem6 = "/src/assets/his/problem-6.jpg";
const ArrowRight = "ArrowRight";
const ChevronLeft = "ChevronLeft";
const ChevronRight = "ChevronRight";
const AlertTriangle = "AlertTriangle";
const CheckCircle2 = "CheckCircle2";
const Ambulance = "Ambulance";
const ClipboardList = "ClipboardList";
const Activity = "Activity";
const Stethoscope = "Stethoscope";
const Timer = "Timer";
const BedDouble = "BedDouble";
const FileText = "FileText";
const HeartPulse = "HeartPulse";
const Pill = "Pill";
const Radio = "Radio";
const BarChart3 = "BarChart3";
const Workflow = "Workflow";
const ShieldCheck = "ShieldCheck";
const Network = "Network";
const Users = "Users";
const Siren = "Siren";
const hisHeroVideo = "/__l5e/assets-v1/25b00197-4b5c-4720-962f-41679f2291d8/his-hero.mp4";
const hisCtaVideo = "/__l5e/assets-v1/9120cf10-5388-45f0-8a51-be221f388b8e/his-cta.mp4";
const bgStepsLight = "/src/assets/bg-steps-light.png";
const registrationStep = "/src/assets/his-journey/registration.png";
const outpatientConsultationStep = "/src/assets/his-journey/outpatient-consultation.png";
const admissionStep = "/src/assets/his-journey/admission.png";
const inpatientCareStep = "/src/assets/his-journey/inpatient-care.png";
const dischargeStep = "/src/assets/his-journey/discharge.png";
const billingSettlementStep = "/src/assets/his-journey/billing-settlement.png";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

const nphiesLogo = "/src/assets/logos/nphies.png";
const malaffiLogo = "/src/assets/logos/malaffi.png";
const riayatiLogo = "/src/assets/logos/riayati.png";
const zatcaLogo = "/src/assets/logos/zatca.png";
const emiratesIdLogo = "/src/assets/logos/emirates-id.png";
const absherLogo = "/src/assets/logos/absher.png";
const nhraLogo = "/src/assets/logos/nhra.png";
const wasfatyLogo = "/src/assets/logos/wasfaty.png";
const features = [
  { icon: Siren, title: "Pre-Hospital & Ambulance Alerts", body: "Receive advance notification from EMS with patient vitals, ETA and chief complaint — so the resuscitation bay, team and equipment are ready before the ambulance doors open." },
  { icon: ClipboardList, title: "Triage & Acuity Scoring", body: "Structured triage with ESI, CTAS or MTS scoring at the point of arrival. Acuity is visible on the department board immediately so the sickest patients are seen first — every time." },
  { icon: Activity, title: "ED Tracking Board", body: "A live department board showing every patient, bed, acuity, time in department, pending orders and disposition status — visible on every workstation and every mobile device." },
  { icon: Stethoscope, title: "Rapid Clinical Documentation", body: "Purpose-built ED templates for common chief complaints let physicians document, order and prescribe in a fraction of the time a generic EMR requires." },
  { icon: Pill, title: "ED Medication & Order Sets", body: "Pre-built order sets for sepsis, chest pain, stroke, trauma and pediatric emergencies — with dose calculators, allergy checks and interaction alerts built in." },
  { icon: HeartPulse, title: "Resuscitation & Code Documentation", body: "Real-time code documentation with timestamps, medications, defibrillation and team roles — captured live and finalized without retyping." },
  { icon: BedDouble, title: "Bed & Boarding Management", body: "See every ED bed, hallway placement and boarding patient at a glance. Coordinate admissions, transfers and inpatient bed assignment without phone calls." },
  { icon: Timer, title: "Door-to-Doc & LOS Timers", body: "Automatic timers for door-to-triage, door-to-doctor, decision-to-admit and length of stay — surfaced on every patient card and rolled up to the department dashboard." },
  { icon: Radio, title: "Trauma & Stroke Activation", body: "One-click trauma, stroke and STEMI activation notifies the full response team, pages consultants and starts a synchronized clinical timeline." },
  { icon: FileText, title: "Discharge Summaries & Instructions", body: "Structured discharge summaries generated from the encounter, with patient-friendly instructions in Arabic and English printed or sent to the patient portal." },
  { icon: Users, title: "Team Handover & Shift Change", body: "Digital sign-out tools ensure every patient is handed over safely between shifts — with active issues, pending results and open plans clearly flagged." },
  { icon: BarChart3, title: "ED Analytics & Quality Metrics", body: "Live dashboards for LWBS rates, throughput, boarding time, sepsis bundle compliance, door-to-needle and door-to-balloon — reporting-ready for regulators." },
];

const journey = [
  { icon: Siren, title: "Arrival & Triage", image: registrationStep, body: "Patient arrives by walk-in or ambulance. Registration and triage happen in parallel — acuity is scored and the patient appears on the tracking board within seconds." },
  { icon: Activity, title: "Assessment", image: outpatientConsultationStep, body: "The ED physician sees prior history, vitals and triage notes on one screen. Orders are placed with pre-built sets and route instantly to lab, imaging and pharmacy." },
  { icon: HeartPulse, title: "Diagnostics & Treatment", image: admissionStep, body: "Results return into the same chart. Medications are administered with barcode verification. Every timestamp is recorded automatically for quality reporting." },
  { icon: BedDouble, title: "Disposition Decision", image: inpatientCareStep, body: "Admit, transfer, observe or discharge — the decision is documented and routed. Inpatient bed requests, transfers and consultant referrals happen inside the same workflow." },
  { icon: FileText, title: "Discharge or Admission", image: dischargeStep, body: "Discharge summaries, prescriptions and follow-up appointments are generated from the encounter. Admissions flow into the inpatient system without duplicate entry." },
  { icon: Timer, title: "Debrief & Quality Review", image: billingSettlementStep, body: "Every encounter feeds automated quality metrics — sepsis bundles, stroke times, throughput. Case reviews start with data that is already validated and complete." },
];

const stats = [
  { value: "34%", label: "Average reduction in door-to-doctor time within six months of go-live" },
  { value: "27%", label: "Reduction in emergency department length of stay for discharged patients" },
  { value: "45%", label: "Fewer patients who leave without being seen after triage optimization" },
  { value: "96%", label: "Compliance with sepsis one-hour bundle across ED client network" },
  { value: "18 min", label: "Average door-to-needle time for stroke patients using activation workflows" },
  { value: "100%", label: "Real-time visibility into every patient, bed and pending order in the department" },
];

const nationalPlatforms = [
  { name: "NPHIES", logo: nphiesLogo },
  { name: "Malaffi", logo: malaffiLogo },
  { name: "Riayati", logo: riayatiLogo },
  { name: "ZATCA Fatoora", logo: zatcaLogo },
  { name: "UAE Emirates ID", logo: emiratesIdLogo },
  { name: "Saudi Absher", logo: absherLogo },
  { name: "Bahrain NHRA", logo: nhraLogo },
  { name: "Wasfaty", logo: wasfatyLogo },
];

const faqs = [
  { q: "How long does an ED module implementation take?", a: "A standalone ED module typically deploys in 6 to 10 weeks. Deployment alongside a full HIS go-live follows the HIS project timeline, with the ED module going live as part of the phased rollout." },
  { q: "Does the module support ESI, CTAS and MTS triage?", a: "Yes. Triage protocol is configurable per facility. ESI (levels 1–5), CTAS and MTS are all supported out of the box, with acuity coloring, reassessment triggers and audit trails included." },
  { q: "Can we integrate with our existing ambulance and EMS providers?", a: "Yes. Pre-hospital notification is supported through HL7 FHIR interfaces, direct integrations with regional EMS platforms, and structured web-form intake for smaller providers." },
  { q: "How does the module handle mass casualty and disaster mode?", a: "A dedicated disaster mode expands triage to START/JumpSTART protocols, activates surge dashboards, releases pre-configured incident order sets, and enables rapid patient registration with placeholder identifiers." },
  { q: "Does the tracking board work on mobile devices?", a: "Yes. The ED board, patient cards and disposition workflows are fully responsive and work on tablets and phones — ideal for consultants and bed managers on the move." },
  { q: "What quality and regulatory reports are included?", a: "Out-of-the-box reports for door-to-doctor, door-to-needle, door-to-balloon, sepsis bundle compliance, LWBS, LOS by acuity, and regional regulator submissions (CBAHI, DOH, JAWDA and equivalent) are included." },
  { q: "Can we build our own order sets and clinical pathways?", a: "Yes. A configurable order set builder lets your clinical leadership define and version pathways for chest pain, sepsis, stroke, trauma, pediatric emergencies and any local protocols." },
  { q: "What training and go-live support are included?", a: "Every deployment includes role-based training for triage nurses, ED physicians, consultants, registration and management, plus 24/7 on-site go-live support for the first two weeks." },
];

const trustChips = [
  "150+ Emergency Departments",
  "ESI · CTAS · MTS",
  "HL7 FHIR Native",
  "Trauma & Stroke Ready",
  "Arabic & English",
  "24/7 Uptime",
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
    <div className="mt-14 flex flex-col gap-3 md:flex-row md:gap-4 md:h-[520px]">
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full ${isActive ? "md:p-8" : "md:p-4"}`}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${isActive ? "p-7" : "p-4"}`}>
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

function LogoSlider({ platforms }: { platforms: typeof nationalPlatforms }) {
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
  }, []);

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
        {platforms.map((p) => (
          <div
            key={p.name}
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

export default function EmergencyDepartment() {
  const problemImages = [problem1, problem2, problem3, problem4, problem5, problem6];
  const problemTexts = [
    "A patient with chest pain waits in the queue behind non-urgent cases because triage acuity lives on a paper sheet no one at registration can see.",
    "A trauma patient arrives without warning because the ambulance service and the ED have no shared notification channel — and the team scrambles when the doors open.",
    "The sepsis one-hour bundle is missed because antibiotic orders, lactate results and fluid administration live in three separate systems no one is watching together.",
    "The ED consultant cannot see which patients are boarding, which beds are free upstairs, or how many patients are waiting to be seen — because every number is on a different screen.",
    "A discharged patient returns 48 hours later because their discharge instructions were verbal, in a language they did not fully understand, with no printed follow-up plan.",
    "At the end of the month, the department cannot report door-to-doctor times because timestamps are handwritten, inconsistent and require days of manual compilation.",
  ];
  const problemTitles = [
    "Invisible Acuity",
    "Ambush Arrivals",
    "Sepsis Slippage",
    "Blind Command",
    "Bounce-Back Discharges",
    "Untimed Metrics",
  ];
  const problemCards = problemImages.map((img, i) => ({
    image: img,
    title: problemTitles[i],
    body: problemTexts[i],
  }));

  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  ;(globalThis as any).__PAGE_LOCALS_EmergencyDepartment = { problemImages: (typeof problemImages !== 'undefined' ? problemImages : undefined), problemTexts: (typeof problemTexts !== 'undefined' ? problemTexts : undefined), problemTitles: (typeof problemTitles !== 'undefined' ? problemTitles : undefined), problemCards: (typeof problemCards !== 'undefined' ? problemCards : undefined), problemRef: (typeof problemRef !== 'undefined' ? problemRef : undefined) };
return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video src={hisHeroVideo.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
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
                When Every Second Counts —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Your ED Runs on One Live System.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See the ED Suite in Action <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Live Demo
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
            Introducing the ED Suite
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>The Command Center for</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Modern Emergency Care
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The emergency department is where the hospital is most exposed. Acuity changes minute by minute, teams
            rotate, and there is no room for a system that lags behind. Our Emergency Department Management module
            gives triage, physicians, nurses, consultants and administration one live workspace — with the timers,
            order sets and dashboards purpose-built for high-acuity, high-throughput care.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll on dark */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              A Disconnected Emergency Department Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Life-Threatening Bottleneck.
              </span>
            </h2>
          </div>

          <div ref={problemViewportRef} className="mt-10 flex flex-1 items-center overflow-hidden md:mt-12 scrollbar-hide">
            <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => (
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
              Every ED Workflow. Built for High-Acuity Care.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From ambulance notification to discharge or admission, every step in the emergency department runs on
              one live, timed, connected platform.
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
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
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
              <Workflow className="h-3.5 w-3.5" /> How It Works
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              The Complete ED Journey — From Ambulance Bay to Disposition
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
              Outcomes Measured Across Our ED Client Network
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
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> Integrations
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Connected to Every National Platform Your ED Reports To
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Built on open standards — HL7 FHIR, DICOM and native national platform integrations across the GCC.
            </p>
          </div>

          <p className="mt-10 text-center text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
            National Platforms
          </p>
          <LogoSlider platforms={nationalPlatforms} />
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
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div className="absolute inset-0">
          <video src={hisCtaVideo.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Your Emergency Department Deserves a System That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Moves as Fast as Your Team.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Faster triage. Cleaner handovers. Timed bundles. Live dashboards. Every patient, every bed, every timer —
            visible to everyone who needs to see them.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            A purpose-built ED module is the difference between a department that reacts and a department that leads.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your ED Demo
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Request an Implementation Roadmap
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Structured go-live support. 24/7 on-site launch team. Data migration included.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}

export const __TOP = { features: (typeof features !== 'undefined' ? features : undefined), journey: (typeof journey !== 'undefined' ? journey : undefined), stats: (typeof stats !== 'undefined' ? stats : undefined), nationalPlatforms: (typeof nationalPlatforms !== 'undefined' ? nationalPlatforms : undefined), faqs: (typeof faqs !== 'undefined' ? faqs : undefined), trustChips: (typeof trustChips !== 'undefined' ? trustChips : undefined) };

