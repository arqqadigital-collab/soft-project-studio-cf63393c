import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  FileText,
  Mic,
  Stethoscope,
  Brain,
  Sparkles,
  Languages,
  BadgeCheck,
  Users,
  GitBranch,
  Activity,
  Target,
  ClipboardList,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroVideo from "@/assets/emram/emram-hero.mp4.asset.json";
import ctaVideo from "@/assets/emram/emram-cta.mp4.asset.json";
import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";
import p1 from "@/assets/emram/problem/p1.jpg";
import p2 from "@/assets/emram/problem/p2.jpg";
import p3 from "@/assets/emram/problem/p3.jpg";
import p4 from "@/assets/emram/problem/p4.jpg";
import p5 from "@/assets/emram/problem/p5.jpg";
import p6 from "@/assets/emram/problem/p6.jpg";
import j1 from "@/assets/emram/journey/j1.jpg";
import j2 from "@/assets/emram/journey/j2.jpg";
import j3 from "@/assets/emram/journey/j3.jpg";
import j4 from "@/assets/emram/journey/j4.jpg";
import j5 from "@/assets/emram/journey/j5.jpg";
import j6 from "@/assets/emram/journey/j6.jpg";
import j7 from "@/assets/emram/journey/j7.jpg";

const features = [
  { icon: Mic, title: "Ambient Voice Scribe", body: "Passive, always-on ambient listening during the encounter transcribes the clinician–patient conversation, structures it into a SOAP note and files it into the EMR — with the clinician reviewing and signing rather than typing." },
  { icon: FileText, title: "Structured Note Generation", body: "Free-text dictation, ambient audio and captured findings are transformed into fully structured clinical notes with diagnoses, orders, plans and coded problem lists — ready for billing, coding and downstream analytics." },
  { icon: Stethoscope, title: "Real-Time Clinical Decision Support", body: "Evidence-based prompts, guideline reminders, drug–drug and drug–allergy checks and sepsis / deterioration alerts surface at the point of decision — not buried inside menus after the moment has passed." },
  { icon: Brain, title: "Differential Diagnosis Assistant", body: "The assistant proposes ranked differentials from presenting complaints, vitals, labs and history — with cited evidence and recommended next investigations that the clinician confirms, edits or discards." },
  { icon: Sparkles, title: "Auto-Coding & Charge Capture", body: "ICD-10, CPT and country-specific codes are suggested directly from the documented encounter with confidence scores and evidence spans — reducing coder queries, denials and revenue leakage." },
  { icon: ClipboardList, title: "Discharge Summary Automation", body: "Discharge summaries, referral letters and patient-friendly instructions are drafted automatically from the encounter — bilingual, formatted to local regulator templates and ready for clinician sign-off." },
  { icon: Languages, title: "Bilingual Arabic & English", body: "Every AI-generated artifact — notes, summaries, patient instructions, coding rationales — is fully functional in Arabic and English, with proper medical terminology handling in both languages." },
  { icon: ShieldCheck, title: "Governance, Audit & Human-in-the-Loop", body: "Every AI output is versioned, attributable and reviewable. Model performance, drift and clinician override rates are monitored continuously with governance dashboards for the medical AI committee." },
];

const journey = [
  { icon: ClipboardList, image: j1, title: "Clinical Workflow Discovery", body: "We map the specialties, encounter types, documentation templates and coding workflows in scope — and identify the highest-value opportunities for AI-assisted documentation." },
  { icon: Users, image: j2, title: "Model & Template Configuration", body: "Specialty-specific prompts, note templates, coding rules and safety guardrails are configured to your organization's clinical standards, formulary and regulator requirements." },
  { icon: GitBranch, image: j3, title: "EMR & Voice Integration", body: "Ambient capture devices, mobile app, and the assistant surface are integrated with your EMR via HL7 FHIR — with SSO, role-based access and full audit logging in place." },
  { icon: Sparkles, image: j4, title: "Clinician Pilot & Calibration", body: "A pilot cohort uses the assistant on live encounters. Outputs are graded, prompts are tuned, and clinician-specific personalization is calibrated before wider rollout." },
  { icon: Activity, image: j5, title: "Phased Clinical Rollout", body: "Rollout is phased by department and specialty with on-floor super-users, adoption tracking and daily quality huddles during each go-live wave." },
  { icon: BadgeCheck, image: j6, title: "Governance & Continuous Monitoring", body: "Model performance, override rates, safety events and coding accuracy are monitored continuously. Findings feed a monthly medical AI governance review." },
  { icon: Target, image: j7, title: "Expansion & Advanced AI", body: "Once documentation AI is embedded, adjacent capabilities — predictive risk, population health, imaging AI — are progressively deployed on the same governed foundation." },
];

const stats = [
  { value: "72%", label: "Reduction in average clinical documentation time per encounter across piloted specialties" },
  { value: "2.1", label: "Hours per clinician per day returned to direct patient care after full ambient scribe rollout" },
  { value: "38%", label: "Reduction in coding-related claim denials after auto-coding and evidence-linked charge capture" },
  { value: "94%", label: "Clinician acceptance rate of AI-drafted notes after review, across primary care and specialty settings" },
];

const problemCards = [
  { image: p1, title: "Documentation Burden Is Burning Out Clinicians", body: "Clinicians spend more time typing into the EMR than looking at patients. Documentation is the number-one driver of clinician burnout and attrition in every recent workforce study." },
  { image: p2, title: "Notes That Do Not Serve Care", body: "Copy-forward, template-driven notes have become optimized for billing, not for clinical communication — degrading the very record that downstream care depends on." },
  { image: p3, title: "Coding Leakage and Denials", body: "Manual coding lags the encounter by days, misses documented conditions, and generates preventable denials — leaving significant realized revenue on the table every month." },
  { image: p4, title: "AI Tools Bolted Onto the Side", body: "Point-solution AI scribes live outside the EMR, without governance, audit trails or bilingual support — creating clinical safety, compliance and integration risk instead of solving it." },
  { image: p5, title: "No Governance for Clinical AI", body: "Most organizations deploy AI without model validation, drift monitoring, override tracking or a medical AI committee — a posture regulators are moving quickly to end." },
  { image: p6, title: "Arabic Documentation Is an Afterthought", body: "Most clinical AI tools were built for English-only workflows. Arabic medical terminology, RTL rendering and bilingual patient-facing outputs are handled poorly or not at all." },
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
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${isActive ? "p-6" : "p-3"}`}>
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
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Stage {i + 1}</div>
                      <h3 className="mt-2 text-lg font-bold leading-tight text-white md:text-xl">{step.title}</h3>
                      <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 md:text-sm">{step.body}</p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/65">Stage {i + 1}</div>
                    <h3 className="mt-1.5 text-xs font-semibold leading-snug text-white md:text-sm">{step.title}</h3>
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
  { q: "Is the ambient scribe safe to use on real patient encounters?", a: "Yes. Every AI-generated note is a draft that requires clinician review and sign-off before it becomes part of the medical record. The assistant surfaces evidence spans from the transcript alongside each statement, and all inputs and outputs are logged for audit. Nothing is filed silently, and no clinical action is taken without a human decision." },
  { q: "How does the assistant handle Arabic-speaking patients?", a: "Ambient capture, transcription, note generation and patient-facing artifacts all operate natively in Arabic and English, including code-switched encounters. Medical terminology is normalized in both languages, and outputs preserve the language the clinician chooses for the record and the language the patient needs on their instructions." },
  { q: "Where does the audio and transcript data live?", a: "Deployments run on in-region infrastructure aligned with your local data protection regime — Saudi PDPL, UAE Federal Decree-Law 45, and equivalent GCC frameworks. Raw audio retention is configurable, encryption at rest and in transit is standard, and no data is used to train shared models without explicit contractual opt-in." },
  { q: "Do we have to replace our EMR to use it?", a: "No. The assistant integrates with your existing EMR through HL7 FHIR and standard interoperability profiles. Notes, orders, problems and coded artifacts are filed back into the EMR of record. Where EMR capabilities are limited, the assistant surfaces its own review workspace without displacing the EMR." },
  { q: "How is model performance monitored after go-live?", a: "A medical AI governance dashboard tracks clinician acceptance rates, edit distance on drafts, coding accuracy, override reasons, safety-relevant flags and drift indicators by specialty and site. Findings feed a monthly medical AI committee review, and thresholds trigger automatic retraining or prompt revision cycles." },
];

const trustChips = [
  "Ambient AI Scribe",
  "Structured Note Generation",
  "Real-Time CDS",
  "Auto-Coding (ICD-10 / CPT)",
  "Bilingual Arabic & English",
  "Governed & Auditable",
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

export default function ClinicalAI() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo.url}
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
                Give Clinicians Their Time Back —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Documentation That Writes Itself, Safely.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Deploy Clinical AI <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Live Demo
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Secreta Clinical AI & Documentation
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>Ambient Scribe, Structured Notes,</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Coding and Decision Support — Governed.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Clinical AI is only useful if clinicians trust it and regulators accept it. Secreta Clinical AI &
            Documentation combines an ambient voice scribe, structured note generation, real-time decision support and
            automated coding into a single, EMR-integrated, bilingual and fully governed platform — so your clinicians
            get their time back, your coding gets tighter, and your medical AI committee gets the audit trail it needs.
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
              Clinicians Are Drowning in Documentation.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Point-Solution AI Is Making It Riskier.
              </span>
            </h2>
          </div>

          <div ref={problemViewportRef} className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24 scrollbar-hide">
            <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => (
                <article
                  key={card.title}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] md:w-[440px] lg:w-[480px]"
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
              One Assistant, Every Documentation Task
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Eight integrated capabilities that cover the encounter end to end — from ambient capture through coding,
              CDS and discharge — inside your existing EMR, in Arabic and English.
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
              From Discovery to Governed Rollout — A Structured Program
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Seven sequenced stages that take clinical AI from concept to safe, adopted daily use across your
              specialties and sites.
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
              Clinical AI Outcomes Across Our Client Portfolio
            </h2>
            <p className="mt-4 text-sm text-white/65 md:text-base">
              Validated outcomes from clients running the full Secreta Clinical AI program.
            </p>
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
              Built to Sit Inside the Systems Your Clinicians Already Use
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
              Clinical AI only works when it lives inside the clinician's workflow. Secreta Clinical AI integrates
              directly with the EMR, coding, e-prescribing, imaging and messaging systems already in daily use.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Integration Standards</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "HL7 FHIR R4",
                  "HL7 v2",
                  "SMART on FHIR",
                  "DICOM SR",
                  "SNOMED CT",
                  "LOINC",
                  "RxNorm",
                  "ICD-10 / CPT",
                  "REST API & Webhooks",
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
              <h3 className="text-lg font-bold text-foreground">Capabilities Supported</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Ambient Voice Scribe",
                  "Structured SOAP Notes",
                  "Real-Time CDS",
                  "Differential Diagnosis",
                  "Auto-Coding",
                  "Discharge Summaries",
                  "Referral Letters",
                  "Bilingual Arabic / English",
                  "Model Governance Dashboards",
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
          className="absolute inset-0 h-full w-full object-cover"
          src={ctaVideo.url}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,22,40,0.78)_0%,rgba(9,22,40,0.85)_100%)]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            The Best AI in Healthcare Is the AI Clinicians Actually Use.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Governed, Bilingual, and Inside the EMR.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Give your clinicians their time back, tighten your coding, and give your medical AI committee the audit
            trail it needs — all on one governed platform. See it running on a real encounter in your specialty.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book a Clinical AI Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Download the Clinical AI Brief
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Deployment support in Arabic and English. GCC and international experience. Pilots typically live within 6 weeks.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
