import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  UserCheck,
  Droplets,
  FlaskConical,
  TestTube2,
  Boxes,
  Activity,
  Tag,
  ClipboardList,
  Hospital,
  HeartPulse,
  Archive,
} from "lucide-react";
import logo from "@/assets/logo.png";
import heroVideo from "@/assets/blood-bank/hero-video.mp4.asset.json";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { MainNav } from "@/components/MainNav";

const features = [
  { icon: UserCheck, title: "Donor Registration & Eligibility Screening", body: "Build comprehensive donor profiles with full medical history, travel records, medication flags, and deferral tracking. Automated eligibility checks against configurable screening criteria ensure no ineligible donor proceeds to collection. Permanent and temporary deferrals are logged and enforced system-wide." },
  { icon: Droplets, title: "Collection & Component Processing", body: "Record whole blood and apheresis collections with full lot traceability. Document component preparation — packed red cells, platelets, fresh frozen plasma, cryoprecipitate — with processing timestamps, technologist assignments, and quality checks at every step." },
  { icon: FlaskConical, title: "Blood Group Serology & Testing", body: "Manage ABO and Rh typing, antibody screening, and infectious disease testing workflows. Link laboratory results directly to unit records. Units with pending or failed test results are automatically quarantined and blocked from issue." },
  { icon: TestTube2, title: "Crossmatch & Compatibility Testing", body: "Run electronic or serological crossmatch workflows with built-in compatibility logic. The system flags incompatible pairings before issue, providing an additional patient safety checkpoint that never sleeps." },
  { icon: Boxes, title: "Inventory Management & Expiry Alerts", body: "Maintain real-time visibility of every unit across all storage locations — refrigerators, freezers, and satellite stores. Automated expiry alerts surface aging inventory days in advance, giving your team time to act before wastage occurs. FIFO issue logic is enforced by default." },
  { icon: Activity, title: "Transfusion Reaction Reporting & Hemovigilance", body: "When a transfusion reaction occurs, clinicians can log it directly in the system. The blood bank receives an immediate notification, triggering a structured investigation workflow. All reaction data feeds into your hemovigilance reporting module for regulatory submission and trend analysis." },
  { icon: Tag, title: "Regulatory-Compliant Labeling & Chain of Custody", body: "Every unit carries a compliant ISBT 128 label. Every movement — from collection through processing, storage, issue, and transfusion — is logged with user, timestamp, and location. Your audit trail is always complete, always current." },
];

const journey = [
  { icon: UserCheck, title: "Donor Arrives", body: "The system retrieves the donor's full history, runs automated eligibility checks, and either clears them for collection or flags the appropriate deferral reason — all before a needle is placed." },
  { icon: Droplets, title: "Unit Collected & Processed", body: "Collection details are recorded in real time. Components are processed and entered into inventory with full traceability. Testing requests are sent automatically to the laboratory." },
  { icon: FlaskConical, title: "Testing & Quarantine", body: "Units remain in quarantine until all required test results are received and validated. Reactive or incomplete results trigger automatic holds that cannot be overridden without authorization." },
  { icon: TestTube2, title: "Crossmatch & Issue", body: "A transfusion request arrives from the ward. The system performs compatibility checks, confirms crossmatch results, and issues the unit with a complete handover record." },
  { icon: HeartPulse, title: "Transfusion & Follow-up", body: "Transfusion is documented at the bedside. Any adverse events are reported through the integrated hemovigilance pathway. The complete unit lifecycle is archived for audit and regulatory review." },
];

const stats = [
  { value: "34%", label: "Average reduction in blood component wastage" },
  { value: "100%", label: "Chain-of-custody documentation on every unit issued" },
  { value: "60%", label: "Faster regulatory audit preparation with automated compliance reports" },
  { value: "99.9%", label: "Unit traceability from collection to transfusion" },
];

const problemCards = [
  { title: "Mislabeled Units", body: "A mislabeled unit reaching the wrong patient — a single clerical error with life-threatening consequences and no easy path to recovery." },
  { title: "Expired Components", body: "Expired components missed because inventory tracking was manual, wasting precious donations and exposing patients to risk." },
  { title: "Paper-Based Donor History", body: "A donor turned away — or worse, cleared in error — because eligibility history was stored on paper and never reconciled." },
  { title: "Unstructured Reaction Reporting", body: "A transfusion reaction with no structured reporting pathway, no investigation workflow, and no data trail for hemovigilance." },
  { title: "Audit Gaps", body: "A regulatory audit revealing gaps in chain-of-custody documentation — exactly the gaps that erode trust and put licensure at risk." },
];

const faqs = [
  { q: "How does the system prevent incompatible blood from being issued?", a: "Compatibility logic is embedded in the issue workflow. Before any unit can be issued for transfusion, the system validates ABO and Rh compatibility and confirms crossmatch results. An incompatible pairing cannot proceed without a documented clinical override from an authorized user." },
  { q: "Can the system handle both whole blood and apheresis collections?", a: "Yes. Both collection types are fully supported with separate workflow paths, component processing steps, and labeling requirements." },
  { q: "What happens if a unit fails infectious disease testing?", a: "The unit is automatically placed under a system-enforced quarantine. It cannot be issued or moved to available inventory until the hold is reviewed and resolved by an authorized staff member. A complete record of the event is logged." },
  { q: "Does the system support lookback and recall procedures?", a: "Yes. If a donor is later found to be reactive on a previous or subsequent donation, the system can trace all prior donations from that donor and initiate a structured lookback notification workflow." },
  { q: "How does hemovigilance reporting work?", a: "Adverse transfusion events are logged directly by clinical staff. The blood bank is notified immediately. The system guides investigators through a structured root cause analysis and formats the completed report for submission to national or regional hemovigilance authorities." },
  { q: "Is the system compliant with international blood banking standards?", a: "Yes. Secreta Blood Bank is designed to support compliance with AABB standards, EU Blood Directive requirements, FDA 21 CFR Part 11, and ISO 15189. Specific compliance configurations are available by region." },
  { q: "How long does implementation take?", a: "Most blood banks complete full implementation in 3 to 6 weeks. Complex multi-site deployments with multiple HIS integrations may require additional time. A dedicated implementation specialist is assigned to every account." },
];

const trustChips = [
  "Trusted across 25 countries",
  "FDA 21 CFR Part 11 Compliant",
  "AABB & ISO 15189 Ready",
  "Full Hemovigilance Support",
  "ISBT 128 Labeling",
  "HL7 & FHIR",
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

export default function BloodBank() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-80%"]);

  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={heroVideo.url}
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
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/85 backdrop-blur">
                <Droplets className="h-3.5 w-3.5" /> Secreta Blood Bank
              </span>
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Every Unit Matters.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Every Donor Counts.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Secure Your Blood Supply Chain <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See It in Action
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRO */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Built for Blood Banking
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>A Dedicated System for the </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Full Lifecycle of Blood.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A dedicated system for managing the full lifecycle of blood collection, processing, testing, and
            transfusion. Built with safety-first logic to protect patients and streamline blood bank operations under
            the highest regulatory standards — because in blood banking, there is no margin for error.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Secure Your Blood Supply Chain <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              See It in Action
            </a>
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-sm text-muted-foreground md:text-base">
            Trusted by blood banks across 25 countries · FDA 21 CFR Part 11 Compliant · AABB &amp; ISO 15189 Ready ·
            Full Hemovigilance Support
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
              These Are Not Hypothetical Risks.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                They Happen Every Day.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              In blood banks running on outdated or disconnected systems, small failures compound into patient safety
              incidents and compliance crises.
            </p>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => {
                const gradients = [
                  "radial-gradient(ellipse at 30% 30%, rgba(220,38,38,0.55), transparent 60%), linear-gradient(135deg,#1a0a12,#0a0e1a)",
                  "radial-gradient(ellipse at 70% 40%, rgba(190,18,60,0.5), transparent 60%), linear-gradient(135deg,#0f1424,#1a0a12)",
                  "radial-gradient(ellipse at 50% 80%, rgba(159,18,57,0.55), transparent 60%), linear-gradient(135deg,#0a0e1a,#1a0a12)",
                  "radial-gradient(ellipse at 20% 60%, rgba(220,38,38,0.5), transparent 60%), linear-gradient(135deg,#140818,#0a0e1a)",
                  "radial-gradient(ellipse at 80% 30%, rgba(190,18,60,0.55), transparent 60%), linear-gradient(135deg,#0a0e1a,#140818)",
                ];
                return (
                  <article
                    key={card.title}
                    className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[440px] lg:w-[480px]"
                  >
                    <div
                      className="relative flex h-56 w-full items-center justify-center md:h-64"
                      style={{ background: gradients[i % gradients.length] }}
                    >
                      <AlertTriangle className="h-20 w-20 text-white/15" strokeWidth={1.2} />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1424]" />
                    </div>
                    <div className="flex flex-1 flex-col p-7 md:p-8">
                      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                        0{i + 1} — Risk
                      </span>
                      <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">{card.title}</h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">{card.body}</p>
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
              The Platform
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Complete Control Over Every Stage of the Blood Supply Chain
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From donor walk-in to documented transfusion — every action tracked, validated, and recorded with the
              precision that patient safety demands.
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
              Safety Built Into Every Step
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {journey.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="relative rounded-2xl border border-border bg-card p-6"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--brand-blue)]">
                    Step {i + 1}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.body}</p>
                </motion.div>
              );
            })}
          </div>
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
              Safety and Efficiency You Can Measure
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
            Zero compatibility errors reported post-implementation across client sites. 28% increase in donor return
            rates through automated recall and engagement tools.
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
            Connected Across Your Entire Hospital Ecosystem
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta Blood Bank integrates directly with your HIS, LIS, and EMR to eliminate duplicate data entry and
            ensure real-time information flow between departments. Transfusion requests arrive automatically from
            clinical systems. Test results flow in from the laboratory without manual transcription.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              "ISBT 128",
              "HL7 v2 & FHIR",
              "FDA 21 CFR Part 11",
              "AABB Standards",
              "EU Blood Directive",
              "ISO 15189",
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
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(220,38,38,0.35), transparent 55%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.3), transparent 55%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/60 via-[#091628]/45 to-[#091628]/70" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Patient Safety Begins{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Before the Transfusion Starts.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Every unit your blood bank issues carries the weight of a patient's life. Give your team the system that
            matches that responsibility — with the traceability, safety logic, and compliance tools that leave nothing
            to chance.
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

          <p className="mt-8 text-sm italic text-white/60">
            No setup fees. No long-term contracts. Dedicated support from day one.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
