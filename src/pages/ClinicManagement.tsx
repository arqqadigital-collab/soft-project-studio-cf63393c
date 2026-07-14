import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
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
  AlertTriangle,
  CheckCircle2,
  UserPlus,
  CalendarCheck,
  FileText,
  ClipboardList,
  HeartPulse,
  Pill,
  Stethoscope,
  Receipt,
  BarChart3,
  Workflow,
  ShieldCheck,
  Network,
  MessageSquare,
  CreditCard,
  Users,
  Bell,
} from "lucide-react";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import bgStepsLight from "@/assets/bg-steps-light.png";
import registrationStep from "@/assets/his-journey/registration.png";
import outpatientConsultationStep from "@/assets/his-journey/outpatient-consultation.png";
import admissionStep from "@/assets/his-journey/admission.png";
import inpatientCareStep from "@/assets/his-journey/inpatient-care.png";
import dischargeStep from "@/assets/his-journey/discharge.png";
import billingSettlementStep from "@/assets/his-journey/billing-settlement.png";

import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

const features = [
  { icon: CalendarCheck, title: "Smart Appointment Scheduling", body: "Online booking, calendar sync, automated reminders and waitlist management — reduce no-shows and keep every provider's day fully optimized without manual coordination." },
  { icon: UserPlus, title: "Patient Registration & Profiles", body: "Fast front-desk check-in with digital intake forms, insurance capture and photo ID. One unified patient profile follows the patient across every visit and every provider in the clinic." },
  { icon: FileText, title: "Electronic Health Records", body: "Structured clinical notes, problem lists, allergies, medications and history — all in one longitudinal record. Templates by specialty accelerate documentation without sacrificing detail." },
  { icon: ClipboardList, title: "e-Prescriptions & Referrals", body: "Prescribe electronically with built-in drug interaction and allergy checks. Send referrals to specialists with the full clinical context attached in one click." },
  { icon: HeartPulse, title: "Vitals & Clinical Assessments", body: "Capture vitals, growth charts, screenings and structured assessments at the point of care. Trends visualize instantly across visits so clinicians see the whole story." },
  { icon: Pill, title: "In-Clinic Pharmacy & Inventory", body: "Track medication stock, expiries and reorder points. Dispense from the clinic with barcode verification — every dose accounted for, every shelf audited." },
  { icon: Receipt, title: "Billing, Invoicing & Insurance Claims", body: "Charges flow automatically from clinical activity into billing. Submit insurance claims electronically, track denials and reconcile patient payments in one place." },
  { icon: MessageSquare, title: "Patient Portal & Messaging", body: "Patients book appointments, view results, request refills and message their care team from a branded mobile-friendly portal — reducing phone volume dramatically." },
  { icon: BarChart3, title: "Clinic Analytics & KPIs", body: "Live dashboards for visit volume, no-show rates, revenue per provider, top diagnoses and payer mix — turn day-to-day operations into strategic insight." },
  { icon: Bell, title: "Automated Reminders & Recalls", body: "SMS, email and WhatsApp reminders for appointments, follow-ups, vaccinations and chronic care recalls — engagement that runs itself." },
  { icon: Users, title: "Multi-Provider & Multi-Location", body: "Run a single clinic or a network of branches from one platform. Shared patient records, per-branch schedules, consolidated reporting across every location." },
  { icon: CreditCard, title: "Payments & Point-of-Sale", body: "Card, wallet, cash and installment payments handled at the front desk with automatic receipts. Reconciliation happens in the background, not at the end of the day." },
];

const journey = [
  { icon: CalendarCheck, title: "Booking", image: registrationStep, body: "Patient books online or by phone. The system checks availability across providers, sends confirmation and adds calendar entries automatically." },
  { icon: UserPlus, title: "Check-In", image: outpatientConsultationStep, body: "On arrival, the patient completes digital intake on a tablet or their phone. Insurance is verified and the chart is ready before the clinician walks in." },
  { icon: Stethoscope, title: "Consultation", image: admissionStep, body: "The clinician sees the full history, documents the encounter with smart templates, orders investigations and prescribes — all in a single unified screen." },
  { icon: HeartPulse, title: "Treatment & Follow-Up", image: inpatientCareStep, body: "Care plans, procedures and vitals are captured live. Follow-up appointments and recalls are scheduled before the patient leaves the room." },
  { icon: FileText, title: "Results & Communication", image: dischargeStep, body: "Lab and imaging results flow back into the chart and are shared with the patient through the portal, with clinician-approved notes attached." },
  { icon: Receipt, title: "Billing & Payment", image: billingSettlementStep, body: "Charges are generated from the visit, insurance claims filed and patient payments collected — the clinical and financial record close together." },
];

const stats = [
  { value: "38%", label: "Average reduction in no-show rates after enabling automated reminders and online booking" },
  { value: "22%", label: "Increase in daily patient throughput per provider within six months" },
  { value: "18%", label: "Uplift in revenue per visit through automated charge capture and claims" },
  { value: "60%", label: "Reduction in front-desk phone volume with the patient self-service portal" },
  { value: "3 min", label: "Average patient check-in time using digital intake — down from 12 minutes" },
  { value: "97%", label: "Clean-claim rate on first insurance submission across our clinic network" },
];

const faqs = [
  { q: "How long does it take to launch the clinic management system?", a: "A single-provider clinic is typically live within 2 to 3 weeks. A multi-provider or multi-branch clinic launches in 4 to 8 weeks depending on integrations, data migration and staff training scope." },
  { q: "Can I migrate patient records from my existing system?", a: "Yes. We migrate patient demographics, clinical history, appointments and billing data from most common clinic systems and spreadsheets. A validation report is produced before go-live so nothing is missed." },
  { q: "Does the platform support multiple branches or providers?", a: "Absolutely. You can run one clinic or a network of branches from a single account with shared patient records, per-branch scheduling and consolidated reporting." },
  { q: "Is the system available on mobile devices?", a: "Yes. Clinicians can use the app on tablets and phones, patients access their portal from any mobile browser, and the front desk works on any modern computer." },
  { q: "How is patient data protected?", a: "All data is encrypted at rest and in transit, hosted on regionally compliant infrastructure, with granular role-based access and full audit trails. The platform is aligned with HIPAA and regional privacy regulations." },
  { q: "Can it integrate with labs, pharmacies and insurance networks?", a: "Yes. Open APIs and prebuilt connectors integrate with major laboratory systems, pharmacies and insurance clearinghouses in the region." },
  { q: "What training and support come with the platform?", a: "Every launch includes structured role-based training, an on-site or remote go-live team and ongoing support with SLA-defined response times. Software updates and new features are included." },
  { q: "What does pricing look like?", a: "Pricing is per active provider per month with volume tiers for multi-branch clinics. There are no per-patient fees and no long lock-in contracts." },
];

const trustChips = [
  "2,500+ Clinics",
  "HIPAA & GDPR Aligned",
  "Multi-Branch Ready",
  "Cloud & Mobile",
  "Arabic & English",
  "Open APIs",
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

import nphiesLogo from "@/assets/logos/nphies.png";
import malaffiLogo from "@/assets/logos/malaffi.png";
import riayatiLogo from "@/assets/logos/riayati.png";
import zatcaLogo from "@/assets/logos/zatca.png";
import emiratesIdLogo from "@/assets/logos/emirates-id.png";
import absherLogo from "@/assets/logos/absher.png";
import nhraLogo from "@/assets/logos/nhra.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";

const integrations = [
  { name: "NPHIES", logo: nphiesLogo },
  { name: "Malaffi", logo: malaffiLogo },
  { name: "Riayati", logo: riayatiLogo },
  { name: "ZATCA Fatoora", logo: zatcaLogo },
  { name: "UAE Emirates ID", logo: emiratesIdLogo },
  { name: "Saudi Absher", logo: absherLogo },
  { name: "Bahrain NHRA", logo: nhraLogo },
  { name: "Wasfaty", logo: wasfatyLogo },
];

function LogoSlider({ platforms }: { platforms: typeof integrations }) {
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

export default function ClinicManagement() {
  const problemImages = [problem1, problem2, problem3, problem4, problem5, problem6];
  const problemTexts = [
    "The front desk is on the phone all day rebooking no-shows because reminders go out manually — or don't go out at all — and half the day's appointments never arrive.",
    "A returning patient's chart cannot be found because it was created under a slightly different name last time, so the clinician starts from scratch and misses a critical allergy.",
    "The clinic runs out of a common medication mid-week because inventory lives in a spreadsheet nobody updates, and nobody notices until a patient is waiting at the counter.",
    "An insurance claim is rejected weeks later for a missing code — the visit is already closed, the patient has gone home, and the revenue is written off silently.",
    "The owner cannot answer basic questions — how many patients did we see, which provider is busiest, what is our top diagnosis — because the numbers live in three tools that don't talk to each other.",
    "A patient calls asking for their lab result, gets transferred three times, and finally hears 'we'll call you back' — because results arrived by fax and haven't been filed yet.",
  ];
  const problemTitles = [
    "No-Show Chaos",
    "Missing Charts",
    "Stockouts at the Counter",
    "Silent Revenue Leak",
    "Blind to the Numbers",
    "Lost Results",
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
                Run Your Entire Clinic —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Bookings, Charts, Billing. One Platform.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See the Clinic Suite in Action <ArrowRight className="h-4 w-4" />
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
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Introducing the Clinic Suite
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>The Simple Way to Run</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              a Modern Clinic
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Clinics juggle appointments, records, prescriptions, inventory, billing and patient communication —
            usually across a mix of paper, spreadsheets and disconnected apps. Our Clinic Management System brings
            every workflow into a single, delightful platform designed for single practices and multi-branch
            groups alike. Front desk, providers, back office and patients — all on the same page, in real time.
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
              A Clinic Held Together by Sticky Notes Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Clinic Leaking Money and Trust.
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
              Everything Your Clinic Runs On — In One Place
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the first appointment request to the final settled invoice — every workflow your clinic depends on,
              connected end-to-end and ready on day one.
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
              The Full Patient Journey — From Booking to Payment
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
              Results Measured Across Our Clinic Network
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
              Connects to the Tools Your Clinic Already Uses
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Calendars, payments, messaging, telehealth and accounting — connect what you already run, replace what
              you've outgrown, and keep everything talking to each other.
            </p>
          </div>

          <p className="mt-10 text-center text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
            Popular Integrations
          </p>
          <LogoSlider platforms={integrations} />
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
            Your Clinic Deserves Software That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Works as Hard as You Do.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Fewer no-shows. Faster check-ins. Cleaner claims. Happier patients. All of it — from one platform your
            whole team actually enjoys using.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            Modern clinic management is not just a tool. It is the operating system your practice runs on, and the
            single biggest lever you have to grow with confidence.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Live Demo
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
            Guided onboarding included. Data migration handled for you. Simple per-provider pricing, no lock-in.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
