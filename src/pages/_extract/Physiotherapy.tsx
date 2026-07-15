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
const CalendarCheck = "CalendarCheck";
const ClipboardList = "ClipboardList";
const Activity = "Activity";
const Dumbbell = "Dumbbell";
const HeartPulse = "HeartPulse";
const LineChart = "LineChart";
const FileText = "FileText";
const Users = "Users";
const MessageSquare = "MessageSquare";
const Receipt = "Receipt";
const BarChart3 = "BarChart3";
const Workflow = "Workflow";
const ShieldCheck = "ShieldCheck";
const Network = "Network";
const Video = "Video";
const Sparkles = "Sparkles";
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
  { icon: ClipboardList, title: "Initial Assessment & Evaluation", body: "Structured intake for musculoskeletal, neurological, cardiac and pediatric assessments — with range-of-motion, pain scoring and functional baseline captured in one place." },
  { icon: Activity, title: "Treatment Plans & Protocols", body: "Build individualized treatment plans from a library of evidence-based protocols. Adjust frequency, progression and goals as the patient improves — with every change versioned." },
  { icon: Dumbbell, title: "Exercise Prescription Library", body: "A rich, illustrated exercise library with sets, reps and progression tracks. Assign prescriptions to patients with video guidance delivered straight to their phone." },
  { icon: LineChart, title: "Outcome Measures & Progress Tracking", body: "Track validated outcome measures — Oswestry, DASH, Berg Balance, NPRS, TUG and more — with automated charts that show progress across every session." },
  { icon: CalendarCheck, title: "Session Scheduling & Recurrence", body: "Book full treatment blocks in one action. Recurring sessions, waitlists, room and equipment booking are handled together so no session, room or therapist is double-booked." },
  { icon: HeartPulse, title: "SOAP Notes & Session Documentation", body: "Fast SOAP notes with reusable templates for common conditions. Every session links to the treatment plan, so progress against goals is always in view." },
  { icon: Video, title: "Telerehab & Remote Sessions", body: "Deliver supervised sessions by video with in-call annotation, exercise demonstration and structured post-session notes — without leaving the platform." },
  { icon: Users, title: "Multi-Therapist & Multi-Discipline", body: "Coordinate care across physiotherapy, occupational therapy, speech therapy and sports rehab — one patient record, one plan, one shared clinical view." },
  { icon: MessageSquare, title: "Patient Portal & Home Program", body: "Patients see their home program, track adherence, log pain scores and message their therapist between sessions — from a mobile-friendly portal in Arabic and English." },
  { icon: Receipt, title: "Insurance & Session Authorization", body: "Manage session authorizations, remaining approved visits and insurance claims from the same workflow — never delivering an unfunded session by mistake." },
  { icon: Sparkles, title: "Goniometry & Wearable Integrations", body: "Integrate with digital goniometers, force plates, dynamometers and wearables to capture objective data automatically into the patient's progress chart." },
  { icon: BarChart3, title: "Clinic Analytics & Outcome Reporting", body: "Track therapist productivity, room utilization, treatment outcomes and payer performance — data your leadership team can act on every week." },
];

const journey = [
  { icon: ClipboardList, title: "Referral & Assessment", image: registrationStep, body: "Referrals arrive from physicians, insurers or self-referral. The first session captures a structured assessment, goals and baseline measures — ready in minutes." },
  { icon: Activity, title: "Treatment Plan", image: outpatientConsultationStep, body: "Therapist selects an evidence-based protocol, personalizes the plan and books the full course of sessions in one flow. The patient gets their schedule and home program instantly." },
  { icon: Dumbbell, title: "Guided Sessions", image: admissionStep, body: "Each session is documented against the plan. Exercises are progressed or regressed based on response. Objective and subjective measures update the patient's chart automatically." },
  { icon: LineChart, title: "Progress Review", image: inpatientCareStep, body: "At regular reassessment points, outcome measures are compared to baseline. Progress charts drive the conversation with the patient and the referring physician." },
  { icon: HeartPulse, title: "Home Program & Adherence", image: dischargeStep, body: "Between sessions the patient follows a personalized home program with video, adherence logging and messaging — extending therapy well beyond the clinic walls." },
  { icon: FileText, title: "Discharge & Report", image: billingSettlementStep, body: "On discharge, an outcome report is generated for the patient, the referrer and the insurer — closing the episode with data that proves the value delivered." },
];

const stats = [
  { value: "42%", label: "Improvement in patient adherence to home exercise programs via mobile app" },
  { value: "31%", label: "Increase in therapist productive treatment hours per week" },
  { value: "25%", label: "Faster time to functional recovery on structured evidence-based protocols" },
  { value: "3.2x", label: "More outcome measures captured per patient versus paper-based documentation" },
  { value: "92%", label: "Patient satisfaction score across our rehabilitation client network" },
  { value: "60%", label: "Reduction in unbilled sessions with integrated authorization tracking" },
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
  { q: "How long does implementation take for a physiotherapy clinic?", a: "A single-location physiotherapy or rehabilitation clinic typically launches within 3 to 5 weeks. A multi-branch or multi-discipline group launches in 6 to 10 weeks depending on data migration and integration scope." },
  { q: "Can we bring our own protocols and exercise library?", a: "Yes. You can import your existing exercise library, add clinic-branded videos, and build custom protocols that only your team sees — alongside the built-in evidence-based content." },
  { q: "Does the system support telerehab sessions?", a: "Yes. Video sessions run directly in the platform with structured session notes, exercise demonstration and payment flow attached — no third-party video tool required." },
  { q: "Which outcome measures are supported?", a: "Oswestry Disability Index, DASH, QuickDASH, Neck Disability Index, Berg Balance, TUG, NPRS, ROM, MMT, LEFS, PSFS and more. New measures can be added as configuration." },
  { q: "Can patients access their home program on mobile?", a: "Yes. Every patient gets a mobile-friendly portal with their scheduled exercises, video guidance, adherence tracking and messaging with the therapist." },
  { q: "How does insurance session authorization work?", a: "Authorizations are logged against the patient with approved session counts. The system warns before an unauthorized session is booked and helps the billing team request extensions ahead of time." },
  { q: "Does it integrate with wearables and digital assessment devices?", a: "Yes. Integrations are available for digital goniometers, dynamometers, force plates and common wearables — with data flowing directly into the patient's progress chart." },
  { q: "What training and support are included?", a: "Every launch includes role-based training for therapists, front desk and management, on-site or remote go-live support, and ongoing SLA-backed support. Software updates are included." },
];

const trustChips = [
  "500+ Rehab Clinics",
  "Physio · OT · Speech · Sports",
  "Telerehab Ready",
  "HIPAA & GDPR Aligned",
  "Arabic & English",
  "Wearables Integrated",
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

export default function Physiotherapy() {
  const problemImages = [problem1, problem2, problem3, problem4, problem5, problem6];
  const problemTexts = [
    "A patient's assessment lives in the therapist's paper notebook, their exercises on a printed sheet at home, and their pain diary in a note on their phone — no one has the full picture.",
    "The insurance company approved twelve sessions, but nobody tracked the count, so the thirteenth session was delivered unpaid and written off silently.",
    "Home exercise adherence is verbal — 'yes I did them' — with no way to know whether the patient practiced three times or zero times between sessions.",
    "A therapist inherits a colleague's caseload without a clear treatment plan, current outcome measures or clinical rationale — and the patient starts explaining their history from scratch.",
    "Outcome measures are captured on paper, filed in a folder, and never turned into progress charts — so no one can prove that the therapy is actually working.",
    "The clinic owner cannot tell which therapist is most productive, which conditions get the best outcomes, or which insurer pays late — because reporting means chasing spreadsheets.",
  ];
  const problemTitles = [
    "Fragmented Record",
    "Silent Session Loss",
    "Invisible Adherence",
    "Handover Vacuum",
    "Unmeasured Outcomes",
    "Blind to Performance",
  ];
  const problemCards = problemImages.map((img, i) => ({
    image: img,
    title: problemTitles[i],
    body: problemTexts[i],
  }));

  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

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
                Better Outcomes, Session After Session —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  On One Rehab Platform.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See the Rehab Suite in Action <ArrowRight className="h-4 w-4" />
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
            Introducing the Rehab Suite
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>Purpose-Built for</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Physiotherapy & Rehabilitation
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Rehabilitation is a long, structured, outcome-driven journey — and generic clinic software was never built
            for it. Our Physiotherapy & Rehabilitation module gives therapists, patients and administrators the
            protocols, exercise libraries, outcome measures, home programs and telerehab tools they actually need,
            in one connected platform designed for recovery.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              Rehab Without Data Is Just{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Guesswork With Good Intentions.
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
              Every Rehab Workflow. Built Around Outcomes.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Assessment, planning, sessions, home programs, outcomes and insurance — one platform designed for the
              full arc of recovery.
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
              The Complete Rehabilitation Journey — Assessment to Discharge
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
              Outcomes Measured Across Our Rehab Client Network
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
              Connected to the Payers, Regulators and Systems Your Clinic Depends On
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Native integrations with regional national platforms and open standards for referrers, insurers and
              wearable devices — your data flows where it needs to.
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
            Your Rehab Clinic Deserves Software That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Measures What You Deliver.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Better assessments. Smarter protocols. Higher home program adherence. Cleaner outcome reports.
            Every session, every patient, every measure — connected.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Modern rehabilitation software is not just documentation. It is the operating system for outcomes your
            clinic will be measured on for the next decade.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Rehab Demo
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Talk to a Product Specialist
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Guided onboarding. Data migration handled. Simple per-therapist pricing, no lock-in.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}

export const __EXTRACTED = { features: (typeof features !== 'undefined' ? features : undefined), journey: (typeof journey !== 'undefined' ? journey : undefined), stats: (typeof stats !== 'undefined' ? stats : undefined), nationalPlatforms: (typeof nationalPlatforms !== 'undefined' ? nationalPlatforms : undefined), faqs: (typeof faqs !== 'undefined' ? faqs : undefined), trustChips: (typeof trustChips !== 'undefined' ? trustChips : undefined) };
