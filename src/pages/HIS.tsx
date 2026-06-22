import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import problem6 from "@/assets/his/problem-6.jpg";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  CalendarCheck,
  BedDouble,
  FileText,
  ClipboardList,
  HeartPulse,
  Pill,
  FlaskConical,
  Scan,
  Stethoscope,
  Receipt,
  BarChart3,
  Workflow,
  ShieldCheck,
  Network,
} from "lucide-react";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import bgStepsLight from "@/assets/bg-steps-light.png.asset.json";
import registrationStep from "@/assets/his-journey/registration.png.asset.json";
import outpatientConsultationStep from "@/assets/his-journey/outpatient-consultation.png.asset.json";
import admissionStep from "@/assets/his-journey/admission.png.asset.json";
import inpatientCareStep from "@/assets/his-journey/inpatient-care.png.asset.json";
import dischargeStep from "@/assets/his-journey/discharge.png.asset.json";
import billingSettlementStep from "@/assets/his-journey/billing-settlement.png.asset.json";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const features = [
  { icon: UserPlus, title: "Patient Registration & Master Patient Index", body: "Capture complete demographics, identity verification, insurance and consent at first registration. A Master Patient Index ensures every patient has one unique record across your facility — eliminating duplicates and merging fragmented histories. Biometric identity verification is available at registration and every subsequent point of care." },
  { icon: CalendarCheck, title: "Outpatient & Appointment Management", body: "Manage the full outpatient cycle — booking, scheduling, waiting lists, check-in, consultation documentation and post-consultation workflow. No-show management, recall scheduling and referral tracking are integrated into the same workflow." },
  { icon: BedDouble, title: "Inpatient Admission, Transfer & Discharge", body: "Manage every stage of the inpatient journey with real-time bed visibility across every ward. Discharge summaries are generated from structured clinical data — not written from scratch under time pressure." },
  { icon: FileText, title: "Electronic Medical Records", body: "A complete longitudinal EMR — problem lists, diagnoses, medications, allergies, vital signs, clinical notes, results, imaging and correspondence — accessible to every authorized clinician. One source of truth. No paper backup." },
  { icon: ClipboardList, title: "Physician Order Management & CPOE", body: "Physicians enter all orders electronically with clinical decision support running at the point of every order — drug interactions, allergy alerts, dose validation and duplicate detection. Orders route instantly to the receiving department." },
  { icon: HeartPulse, title: "Nursing Clinical Documentation", body: "Structured assessments, care plans, vitals, fluid balance, wound and pain scoring, fall risk and pressure injury documentation — all electronic, all connected, all visible to the medical team in real time." },
  { icon: Pill, title: "Pharmacy & Medication Management", body: "A closed-loop medication system — prescribing through pharmacy verification, dispensing and barcode-verified bedside administration. Every dose checked, every administration verified, every record current." },
  { icon: FlaskConical, title: "Laboratory Information System", body: "Integrated lab workflows — sample registration, ordering, result entry, validation and delivery — fully connected to the clinical record. Critical values trigger automatic alerts. Result trends visible without leaving the chart." },
  { icon: Scan, title: "Radiology Information System", body: "Integrated radiology order management, scheduling, DICOM image linking and structured reporting. PACS integration delivers images alongside reports without a separate system login." },
  { icon: Stethoscope, title: "Operating Theatre & Surgical Management", body: "Surgical scheduling, pre-op assessment, operative and anesthesia records, implant tracking, recovery and post-op care — all in the HIS. Theatre utilization and outcomes reported automatically." },
  { icon: Receipt, title: "Revenue Cycle & Billing Management", body: "Charges are captured automatically from clinical activity and flow into billing without manual entry. Pre-authorization, claims, adjudication, denials and patient payments — all managed within the HIS." },
  { icon: BarChart3, title: "Clinical Analytics & Executive Reporting", body: "Real-time dashboards for census, occupancy, length of stay, readmissions, infections, surgical outcomes, revenue cycle and productivity — without manual data compilation." },
];

const journey = [
  { icon: UserPlus, title: "Registration", image: registrationStep.url, body: "Patient registered with verified identity and complete demographics. A unique master record is created or retrieved. Duplicate detection prevents fragmented histories." },
  { icon: CalendarCheck, title: "Outpatient Consultation", image: outpatientConsultationStep.url, body: "Appointment conducted with full clinical history visible. The physician documents, orders, prescribes and refers — all in one screen, all in one workflow." },
  { icon: BedDouble, title: "Admission", image: admissionStep.url, body: "If admission is required, the patient moves from outpatient directly into inpatient workflow. Bed assignment, assessment, reconciliation and nursing documentation begin immediately." },
  { icon: HeartPulse, title: "Inpatient Care", image: inpatientCareStep.url, body: "Every clinical event — rounds, assessments, investigations, procedures, medications, transfers — is documented in the unified record with continuous decision support." },
  { icon: FileText, title: "Discharge", image: dischargeStep.url, body: "Discharge planning begins at admission. The summary is generated from structured data. Medications are reconciled and follow-up appointments booked through the patient portal." },
  { icon: Receipt, title: "Billing & Settlement", image: billingSettlementStep.url, body: "All clinical activity is captured automatically. Bills are generated from the clinical record, claims submitted electronically and payment reconciled — closing the financial and clinical record together." },
];

const stats = [
  { value: "1.2 days", label: "Average reduction in length of stay within 12 months of full HIS go-live" },
  { value: "11%", label: "Average increase in net revenue per admission through automated charge capture" },
  { value: "35%", label: "Reduction in IT operational cost by replacing point solutions with unified HIS" },
  { value: "94%", label: "First-pass insurance claim acceptance with integrated revenue cycle management" },
  { value: "Zero", label: "Medication reconciliation failures reported across closed-loop medication clients" },
  { value: "100%", label: "Of HIS clients pursuing EMRAM Stage 6 achieved it within their target timeline" },
];

import nphiesLogo from "@/assets/logos/nphies.png.asset.json";
import malaffiLogo from "@/assets/logos/malaffi.png.asset.json";
import riayatiLogo from "@/assets/logos/riayati.png.asset.json";
import zatcaLogo from "@/assets/logos/zatca.png.asset.json";
import emiratesIdLogo from "@/assets/logos/emirates-id.png.asset.json";
import absherLogo from "@/assets/logos/absher.png.asset.json";
import nhraLogo from "@/assets/logos/nhra.png.asset.json";
import wasfatyLogo from "@/assets/logos/wasfaty.png.asset.json";

const nationalPlatforms = [
  { name: "NPHIES", logo: nphiesLogo.url },
  { name: "Malaffi", logo: malaffiLogo.url },
  { name: "Riayati", logo: riayatiLogo.url },
  { name: "ZATCA Fatoora", logo: zatcaLogo.url },
  { name: "UAE Emirates ID", logo: emiratesIdLogo.url },
  { name: "Saudi Absher", logo: absherLogo.url },
  { name: "Bahrain NHRA", logo: nhraLogo.url },
  { name: "Wasfaty", logo: wasfatyLogo.url },
];

const faqs = [
  { q: "How long does a full HIS implementation take?", a: "A community hospital typically completes in 4 to 6 months. A large general hospital with full module deployment and multiple third-party integrations typically takes 9 to 18 months. A phased approach — going live with core modules first and adding clinical modules progressively — is recommended for large facilities." },
  { q: "Can Secreta HIS replace our existing systems module by module, or does it require a full replacement?", a: "Both approaches are supported. Some clients implement Secreta HIS as a full replacement in a phased go-live. Others implement specific modules — such as the EMR or revenue cycle — alongside existing systems, using integration interfaces, and migrate additional modules over time." },
  { q: "How is clinical data migrated from our existing systems?", a: "Data migration is managed by Secreta's dedicated team. Clinical data is extracted, transformed to Secreta's data model, validated for completeness and accuracy, and loaded into the new system before go-live. A detailed migration plan is produced before any data movement begins." },
  { q: "Does the system support both cloud and on-premise deployment?", a: "Yes. Secreta HIS is available as a cloud-hosted solution on regionally compliant infrastructure — including within-country hosting for KSA, UAE and Qatar — and as on-premise. Hybrid deployment is also supported." },
  { q: "How does the system handle multiple facilities within the same health group?", a: "Multi-site deployment is a core capability of the Health System tier. Each facility runs its own clinical environment with its own configuration, while group leadership accesses a consolidated view — unified patient records, group analytics and centralized governance reporting." },
  { q: "What clinical decision support is included in the HIS?", a: "Drug interaction checking, allergy cross-referencing, dose validation, duplicate detection, sepsis screening, early warning score automation, preventive care reminders, evidence-based order sets and condition-specific pathways. The CDS library is configurable by your clinical informatics team." },
  { q: "How does the system support nursing handover and shift communication?", a: "Structured handover tools are built in — allowing nurses to complete a standardized handover record for every patient, flagging active concerns, pending results and anticipated events. Handover completion is tracked and reported as part of the clinical documentation." },
  { q: "What training and support are provided after go-live?", a: "Every deployment includes a structured pre-go-live training program by role, on-site go-live support, and ongoing support through a dedicated team with SLA-defined response times. Updates, compliance releases and new features are included." },
];

const trustChips = [
  "300+ Hospitals",
  "HIMSS EMRAM Stage 6 Ready",
  "HL7 FHIR & DICOM Native",
  "HIPAA · GDPR · GCC Compliant",
  "Arabic & English",
  "Cloud & On-Premise",
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full ${isActive ? 'md:p-8' : 'md:p-4'}`}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${isActive ? 'p-7' : 'p-4'}`}>
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

export default function HIS() {
  const problemImages = [problem1, problem2, problem3, problem4, problem5, problem6];
  const problemTexts = [
    "A physician orders a medication without seeing the laboratory result that arrived twenty minutes ago — because the lab system and the prescribing system are not integrated and no one thought to check.",
    "A patient is transferred from the ED to a general ward and their care team changes, their medication reconciliation is not completed, and their allergy history does not follow them because the systems do not talk to each other.",
    "A bed manager cannot give the CEO an accurate census at 9am because bed status lives on a whiteboard, in three nursing stations, and in two separate IT systems that each show different numbers.",
    "A patient is billed for a procedure that was cancelled and not billed for one that was added — because the clinical record and the billing system are updated manually and independently.",
    "Clinical governance teams cannot produce meaningful quality reports because clinical data is stored in formats that cannot be queried, combined, or analyzed across departments.",
    "New physicians joining the hospital spend weeks learning which system holds which information — because there is no single place where the complete patient story lives.",
  ];
  const problemTitles = [
    "Disconnected Orders",
    "Lost in Transfer",
    "Invisible Census",
    "Billing Drift",
    "Unreportable Data",
    "Tribal Knowledge",
  ];
  const problemCards = problemImages.map((img, i) => ({
    image: img,
    title: problemTitles[i],
    body: problemTexts[i],
  }));

  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  // vertical breathing room before horizontal scroll, and a settle pause at the end
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-83.3333%"]);

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
                Every Department. Every Patient.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Every Decision. One System.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See Secreta HIS in Action <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book an Enterprise Demonstration
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
            Introducing Secreta HIS
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>One Unified Platform for</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Modern Healthcare
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A hospital generates thousands of clinical decisions, administrative transactions, and
            operational events every single day. When the systems supporting those events are
            disconnected — different platforms for pharmacy, laboratory, radiology, nursing, billing,
            and management — information is delayed, duplicated, and lost. Secreta HIS is a fully
            integrated, enterprise-grade Hospital Information System that connects every department,
            every workflow, and every data point in your facility into one unified clinical and
            operational platform. Built for the complexity of modern healthcare. Designed for the
            humans who deliver it.
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
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              A Disconnected Hospital Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Dangerous Hospital.
              </span>
            </h2>
          </div>

          {/* Horizontally scrolling cards */}
          <div className="mt-10 flex flex-1 items-center overflow-hidden md:mt-12">
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
              Every Core Hospital Function. One Integrated Platform.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the moment a patient is registered to the moment their account is settled and their record is
              archived — every department, every discipline and every data point connected in real time.
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
              The Complete Patient Journey — Managed in One System
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
              Enterprise Outcomes Measured Across Our HIS Client Network
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> Integrations
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              An Open Architecture That Connects Your Entire Healthcare Ecosystem
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Secreta HIS is built on open standards — not a proprietary integration model that locks you into a single
              vendor ecosystem. Every external system that needs to connect, can.
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
          <video
            src={hisCtaVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Your Hospital Deserves a System That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Matches Its Ambition.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Every patient deserves complete information at the point of care. Every clinician deserves a system that
            supports their work instead of obstructing it. Every leader deserves accurate, real-time data.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            A truly integrated Hospital Information System is not a technology investment. It is the foundation of every
            clinical, operational and financial improvement your organization will make for the next decade.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Enterprise Demonstration
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
            Structured implementation support. Data migration included. Pricing tailored to your scale and deployment
            model.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
