import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  MapPin,
  BedDouble,
  Radio,
  Wrench,
  Thermometer,
  Users,
  Activity,
  Boxes,
  Workflow,
  ClipboardList,
} from "lucide-react";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import bgStepsLight from "@/assets/bg-steps-light.png";
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import journeyRegistration from "@/assets/his-journey/registration.png";
import journeyConsultation from "@/assets/his-journey/outpatient-consultation.png";
import journeyAdmission from "@/assets/his-journey/admission.png";
import journeyInpatient from "@/assets/his-journey/inpatient-care.png";
import journeyDischarge from "@/assets/his-journey/discharge.png";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

const features = [
  { icon: MapPin, title: "Real-Time Location Services (RTLS)", body: "Track staff, patients and equipment across every corridor, ward and OR with sub-meter precision using BLE, Wi-Fi, UWB or infrared tags — whichever fits your building and budget best." },
  { icon: BedDouble, title: "Live Bed & Room Management", body: "See every bed, room, cleaning status and occupancy in real time. Turnover automatically triggers housekeeping requests, so beds move from occupied to available without a single phone call." },
  { icon: Wrench, title: "Equipment Tracking & Utilization", body: "Locate every infusion pump, wheelchair and portable X-ray in seconds. Utilization dashboards reveal which assets sit idle and which are chronically short — data your capital planning has never had before." },
  { icon: Radio, title: "Staff Duress & Safety Alerts", body: "Wearable duress buttons let staff summon help instantly with their exact location — with automated escalation to security and clinical response teams if help does not arrive in seconds." },
  { icon: Thermometer, title: "Cold Chain & Environmental Monitoring", body: "Continuous, wireless monitoring of fridges, freezers, pharmacy vaults and operating room temperature and humidity — with automated alerts before excursions become excursions." },
  { icon: Users, title: "Patient Flow & Journey Tracking", body: "Track patients from admission through every waiting area, treatment room and diagnostic step. Bottlenecks surface on live dashboards long before they become complaints." },
  { icon: Boxes, title: "Consumables & Inventory Automation", body: "RFID-tagged inventory automatically decrements as items are used. Reorder points trigger requisitions without manual counting. Waste and stockouts drop together." },
];

const journey = [
  { icon: MapPin, title: "Assets & People Tagged", image: journeyRegistration, body: "Staff badges, patient wristbands and equipment tags stream location data into the platform. A digital twin of the hospital updates continuously — every asset, every bay, every person accounted for." },
  { icon: BedDouble, title: "Live Operational Command", image: journeyConsultation, body: "Bed managers, charge nurses and operations leaders work from a single live dashboard — occupancy, cleaning status, staffing coverage and equipment availability visible at a glance." },
  { icon: Activity, title: "Automated Workflows Trigger", image: journeyAdmission, body: "A patient discharge triggers housekeeping, a fridge excursion triggers pharmacy notification, a duress button triggers security — automation replaces the pager and the phone call." },
  { icon: Wrench, title: "Utilization Insights", image: journeyInpatient, body: "Every movement, dwell time and status change feeds analytics. Leadership sees exactly how bays are used, where patients wait, and which equipment truly needs replacement." },
  { icon: ClipboardList, title: "Continuous Improvement", image: journeyDischarge, body: "Weekly and monthly performance reviews are built from validated operational data — not anecdotes. Every improvement initiative starts with real numbers and ends with a measurable outcome." },
];

const stats = [
  { value: "42%", label: "Reduction in average bed turnover time from discharge to next admission" },
  { value: "30%", label: "Fewer 'lost equipment' incidents thanks to real-time asset tracking" },
  { value: "3x", label: "Faster staff duress response with location-aware alerts" },
  { value: "100%", label: "Continuous cold chain and environmental monitoring, audit-ready" },
];

const problemCards = [
  { title: "Beds Nobody Can Find", image: problem1, body: "An admitted ED patient waits four hours for a bed that has actually been ready for two — because there is no live view of cleaning and occupancy status across the wards." },
  { title: "The Equipment Hunt", image: problem2, body: "Nurses spend an hour a day searching for infusion pumps, wheelchairs and vital signs monitors — because inventory location lives in memory, not in a system." },
  { title: "Silent Cold Chain Failure", image: problem3, body: "A vaccine fridge drifts out of range overnight. No one notices until morning rounds — and thousands of dollars of stock is discarded, unreported until the next audit." },
  { title: "Slow Duress Response", image: problem4, body: "A staff member facing an aggressive visitor cannot reach a phone. There is no wearable alert, no location broadcast, no automated escalation — help arrives too late." },
  { title: "Guesswork Capacity Planning", image: problem5, body: "The executive team plans capital investment based on gut feeling — because true equipment utilization, room dwell time and bottleneck data simply do not exist." },
];

const faqs = [
  { q: "Which RTLS technologies do you support?", a: "We support Bluetooth Low Energy (BLE), Wi-Fi, Ultra-Wideband (UWB), infrared and RFID — often blended in the same deployment. The right mix depends on the accuracy your use cases require and the buildings you operate in. Our team assesses this during site design." },
  { q: "Do we need to rewire the hospital to deploy RTLS?", a: "No. Most deployments overlay onto your existing network with battery-powered anchors and tags — no structural cabling required. On new builds and major renovations, we design cabling into the plans for optimal accuracy." },
  { q: "How long does implementation take?", a: "A single-ward pilot goes live in 4 to 6 weeks. Full hospital deployments typically take 4 to 9 months depending on square footage, use case scope and integration complexity. Every project ships in phases with measurable outcomes at each stage." },
  { q: "Can this integrate with our existing HIS and CMMS?", a: "Yes. Bed status flows into your HIS, equipment work orders flow into your CMMS, and environmental alerts flow into pharmacy and lab systems — all over HL7 FHIR, REST APIs and prebuilt connectors for major platforms." },
  { q: "Is patient location data privacy-compliant?", a: "Yes. Patient tags stream only inside the facility. Data is encrypted, access is role-based with full audit trails, and retention policies are configurable per tenant — aligned with HIPAA, GDPR and regional privacy regulations." },
  { q: "What kind of operational return should we expect?", a: "Clients typically recover investment within 12 to 24 months through reduced bed turnover time, lower equipment shrinkage, avoided cold chain losses and reduced overtime spent searching. Business case modelling is included in the pre-sales phase." },
  { q: "Do wearable duress alerts work outside cellular coverage?", a: "Yes. Alerts route through the RTLS network itself — they do not depend on cellular or Wi-Fi being reachable from the wearable's location." },
];

const trustChips = [
  "Deployed in 60+ hospitals",
  "BLE · UWB · Wi-Fi · IR",
  "HIPAA & GDPR Aligned",
  "24/7 Cold Chain Monitoring",
  "Wearable Duress Ready",
  "HL7 FHIR Native",
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

export default function HospitalOperations() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={hisHeroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,14,26,0.55) 0%, rgba(10,14,26,0.65) 60%, rgba(10,14,26,0.85) 100%)",
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
                See Every Bed.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Find Every Asset.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Digitize Your Hospital Operations <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See It in Action
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
            Built for Hospital Operations
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>A Live Digital Twin of </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Every Corridor and Every Asset.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Modern hospitals cannot run on whiteboards, walkie-talkies and gut feel. Our Hospital Operations & RTLS
            platform combines real-time location intelligence, bed management, environmental monitoring and staff
            safety into a single operational nervous system — so leaders see the whole hospital, live, and every
            workflow moves faster than the phone tree it replaces.
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
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
              You Cannot Improve What You Cannot See.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Most Hospitals Are Flying Blind.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
              Without live location and operational data, small delays compound into hours of lost productivity, unsafe
              conditions and capital wasted on the wrong problems.
            </p>
          </div>

          <div ref={problemViewportRef} className="mt-6 flex flex-1 items-center overflow-hidden md:mt-8 scrollbar-hide">
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
              Every Corridor, Every Asset, Every Person — In Real Time
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              A unified operational platform that turns your buildings into live, queryable, actionable data — so every
              decision runs on fact, not folklore.
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
              From Live Signal to Operational Command
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
              Operational Gains You Can Take to the Board
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
            Typical ROI recovered inside 24 months through shorter bed turnover, reduced equipment loss and avoided
            cold chain wastage — with structured business-case reporting built in from day one.
          </p>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Plugs Into the Systems You Already Run
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Bed status flows into your HIS. Equipment tickets flow into your CMMS. Environmental alerts flow into
            pharmacy and lab systems. Staff safety alerts flow into your security platform. Every signal reaches the
            team best placed to act on it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {["HL7 FHIR", "CMMS", "IoT Sensors", "Wearables"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground/80"
              >
                {label}
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
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div className="absolute inset-0">
          <video
            src={hisCtaVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/75 via-[#091628]/65 to-[#091628]/85" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Run Your Hospital With{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Data That Actually Reflects Reality.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/85">
            Faster turnover. Fewer lost assets. Safer staff. Protected cold chain. Capital decisions grounded in truth.
            Every improvement your operations team wants starts with knowing where everything actually is.
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
              Request a Pilot Design
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/70">
            Phased deployment. Measurable outcomes at every stage. Dedicated support from day one.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
