import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  Workflow,
  Brain,
  Activity,
  ScanLine,
  Bone,
  HeartPulse,
  Microscope,
  ListOrdered,
  GitCompare,
  LineChart,
  Layers,
  Cpu,
  FileCode2,
  Boxes,
  ScanSearch,
  Eye,
  FileCheck,
  Sparkles,
} from "lucide-react";
import heroVideo from "@/assets/ai-imaging/hero-video.mp4";
import journeyAcquire from "@/assets/ai-imaging/journey/acquire.jpg";
import journeyAnalyze from "@/assets/ai-imaging/journey/analyze.jpg";
import journeyPrioritize from "@/assets/ai-imaging/journey/prioritize.jpg";
import journeyReview from "@/assets/ai-imaging/journey/review.jpg";
import journeyDeliver from "@/assets/ai-imaging/journey/deliver.jpg";
import problemWorkload from "@/assets/ai-imaging/problems/workload.jpg";
import problemSubtle from "@/assets/ai-imaging/problems/subtle.jpg";
import problemWorklist from "@/assets/ai-imaging/problems/worklist.jpg";
import problemIncidental from "@/assets/ai-imaging/problems/incidental.jpg";
import problemRural from "@/assets/ai-imaging/problems/rural.jpg";
import bgStepsLight from "@/assets/bg-steps-light.png";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: Layers,
    title: "AI-Powered Image Analysis Across All Modalities",
    body: "Deploy validated deep learning models across CT, MRI, plain X-ray, ultrasound, mammography, and digital pathology whole slide images. Every analysis result is presented as a structured finding with confidence scores, annotated regions of interest, and comparison against prior studies — not as a black box.",
  },
  {
    icon: Activity,
    title: "Chest X-Ray AI — Triage & Detection",
    body: "Automatically analyze every chest radiograph for pneumonia, pleural effusion, pneumothorax, cardiomegaly, consolidation, atelectasis, pulmonary nodules, and rib fractures. Critical findings are escalated to the top of the worklist with the AI annotation visible before the radiologist opens the image.",
  },
  {
    icon: ScanSearch,
    title: "CT Pulmonary Nodule Detection & Management",
    body: "Detect, measure, and characterize pulmonary nodules with sub-millimeter precision. Fleischner Society and Lung-RADS guidelines are integrated, generating structured follow-up recommendations. Surveillance workflows generate recall alerts before follow-up windows are missed.",
  },
  {
    icon: Brain,
    title: "CT Brain — Acute Intracranial Pathology",
    body: "Triage non-contrast CT brain for intracranial hemorrhage, midline shift, large vessel occlusion, early ischemic change, and hydrocephalus. Critical positive studies generate an immediate alert to the radiologist and referring clinician simultaneously.",
  },
  {
    icon: Bone,
    title: "Musculoskeletal & Fracture Detection",
    body: "Detect fractures, joint space narrowing, bone lesions, and alignment abnormalities on plain X-ray and CT. Subtle scaphoid, radial head, stress, and non-displaced hip fractures are flagged with annotated regions of interest overlaid on the original image.",
  },
  {
    icon: HeartPulse,
    title: "Mammography AI — Breast Cancer Detection",
    body: "Analyze digital mammography and DBT for masses, calcifications, architectural distortion, and asymmetries. AI second-read performance matches a second radiologist — letting single-reader workflows achieve double-reader sensitivity. BI-RADS density is automated.",
  },
  {
    icon: ScanLine,
    title: "MRI Prostate — PI-RADS Structured Reporting",
    body: "Analyze multiparametric prostate MRI for clinically significant cancer with automated lesion detection, localization, and PI-RADS v2.1 scoring. Findings pre-populate the radiology report template — radiologists review, confirm, modify, and sign.",
  },
  {
    icon: Microscope,
    title: "Digital Pathology AI — Whole Slide Analysis",
    body: "Deploy AI for histopathological analysis across oncology — prostate grading, breast cancer receptor scoring, colorectal polyp classification, and lymph node metastasis detection. AI surfaces the highest-yield regions of each slide for primary attention.",
  },
  {
    icon: ListOrdered,
    title: "AI Worklist Prioritization & Smart Routing",
    body: "Every study is scored by AI for clinical urgency before a human reviews it. Studies route to the right radiologist by subspecialty, urgency, and availability — automatically. The worklist self-organizes in real time as new studies arrive.",
  },
  {
    icon: GitCompare,
    title: "Longitudinal Comparison & Change Detection",
    body: "AI automatically retrieves prior studies for direct comparison. Change detection quantifies interval change in nodule size, lesion enhancement, effusion volume, and ventricular size — with reproducible, objective measurements.",
  },
  {
    icon: LineChart,
    title: "AI Performance Monitoring & Audit",
    body: "Every AI finding is logged against the radiologist's final report. Agreement and disagreement rates are tracked over time. Declining model performance triggers an alert before it affects clinical outcomes.",
  },
  {
    icon: Sparkles,
    title: "Always Human-in-the-Loop",
    body: "Every AI finding is reviewed, confirmed, and signed by a qualified radiologist before clinical action. The AI never generates a report, communicates with referring clinicians, or triggers action without human authorization.",
  },
];

const journey = [
  {
    icon: ScanLine,
    title: "Image Acquired",
    image: journeyAcquire,
    body: "The patient is scanned. Images are transmitted to your PACS as normal. No change to acquisition protocols or technologist workflows.",
  },
  {
    icon: Cpu,
    title: "AI Analysis Runs Automatically",
    image: journeyAnalyze,
    body: "The moment images arrive in the PACS, Secreta AI begins analysis in the background. For urgent pathologies — intracranial hemorrhage, pneumothorax, large vessel occlusion — analysis completes within 60 seconds of acquisition.",
  },
  {
    icon: ListOrdered,
    title: "Worklist Prioritized & Annotated",
    image: journeyPrioritize,
    body: "The worklist updates automatically with AI urgency scores. Critical studies rise to the top. AI annotations — highlighted regions, measurements, confidence scores, and structured findings — are waiting when the radiologist opens the study.",
  },
  {
    icon: Eye,
    title: "Radiologist Reviews & Reports",
    image: journeyReview,
    body: "The radiologist reviews the image with AI annotations as a second opinion layer. They accept, modify, or dismiss each AI finding with a click. AI structured findings pre-populate the report template — the radiologist adds clinical judgment, context, and signs.",
  },
  {
    icon: FileCheck,
    title: "Report Delivered & Outcome Tracked",
    image: journeyDeliver,
    body: "The final report is delivered to the referring clinician. AI findings and radiologist decisions are logged. Agreement data feeds the performance monitoring dashboard. Over time, the AI is continuously validated against the clinical environment.",
  },
];

const stats = [
  {
    value: "94.7%",
    label: "Sensitivity for intracranial hemorrhage detection on non-contrast CT brain",
  },
  { value: "91.2%", label: "Sensitivity for pulmonary nodule detection on CT above 4mm" },
  {
    value: "87%",
    label: "Reduction in time-to-radiologist-review for critical chest X-ray findings",
  },
  {
    value: "2.3%",
    label: "Of reported studies contain AI-identified findings flagged for governance review",
  },
  { value: "40%", label: "Reduction in prostate biopsy reporting time with AI-assisted pathology" },
  {
    value: "0",
    label: "AI-only clinical decisions — every finding signed by a qualified radiologist",
  },
];

const problemCards = [
  {
    title: "Radiologist Workload Crisis",
    body: "Workloads have increased over 30% in the last decade while trained radiologists have not kept pace. Studies are read faster, under greater pressure, with less time per image — and the error rate reflects it.",
    image: problemWorkload,
  },
  {
    title: "Subtle Findings Get Missed",
    body: "A 4mm pulmonary nodule, early diabetic retinopathy, a hairline fracture on a night shift plain film — the findings most likely to be missed are the ones most likely to matter.",
    image: problemSubtle,
  },
  {
    title: "Critical Studies Sit in Worklists",
    body: "Time-sensitive studies sit in queues for hours because there is no automated triage logic to surface them before a radiologist manually reviews the worklist.",
    image: problemWorklist,
  },
  {
    title: "Incidental Findings Go Unreported",
    body: "Findings in non-target organs are missed because no structured system prompts the radiologist to look beyond the primary clinical indication.",
    image: problemIncidental,
  },
  {
    title: "Rural Sites Wait for Subspecialty Reads",
    body: "Under-resourced facilities perform imaging without access to subspecialty expertise — patients wait days or weeks for a specialist read that AI-assisted workflows could support in minutes.",
    image: problemRural,
  },
];

const faqs = [
  {
    q: "Does the AI make clinical decisions autonomously?",
    a: "No. Secreta AI operates exclusively as a decision support tool. Every AI finding is presented to a qualified radiologist or pathologist for review, confirmation, modification, or dismissal before any clinical action is taken. The AI never generates a clinical report, never communicates directly with referring clinicians, and never triggers clinical action without human authorization. The radiologist or pathologist remains fully responsible for the final report.",
  },
  {
    q: "How are the AI algorithms validated?",
    a: "Each algorithm is validated on large, diverse, multi-site datasets before clinical deployment. Validation studies are conducted against subspecialty ground truth — not general radiologist reads — and published in peer-reviewed literature where available. Post-market performance monitoring continues after deployment, comparing AI findings against radiologist final reports and tracking sensitivity, specificity, and false positive rates over time in the live clinical environment.",
  },
  {
    q: "What happens when the AI disagrees with the radiologist?",
    a: "When a radiologist dismisses an AI finding, the dismissal is logged with the rationale provided. Cases where AI-flagged findings were dismissed and the patient subsequently had a related clinical outcome are surfaced through the clinical governance module. Systematic disagreement patterns are reviewed by the clinical AI committee to determine whether the AI, the radiologist practice, or both require adjustment.",
  },
  {
    q: "How does the AI handle rare or unusual cases it was not trained on?",
    a: "AI models perform most reliably within the distribution of cases on which they were trained. For unusual presentations, the AI may produce a low-confidence output or no output at all. Low-confidence findings are clearly labeled with confidence scores so radiologists understand the reliability of the AI input. The AI is designed to be most helpful on high-frequency, high-stakes findings — not to replace subspecialty expertise on rare conditions.",
  },
  {
    q: "Can we deploy AI on our existing PACS without replacing it?",
    a: "Yes. Secreta AI integrates with your existing PACS through standard DICOM interfaces. Images are routed to the AI analysis engine automatically as they arrive in the PACS. Annotated results are returned as DICOM structured reports and secondary captures. No changes to PACS configuration, acquisition protocols, or radiologist reporting workflow are required.",
  },
  {
    q: "How is patient data handled within the AI platform?",
    a: "Images submitted for AI analysis are processed in a secure, encrypted environment. Patient data is not used for model training without explicit institutional consent and a formal data use agreement. Processing can be configured for on-premise deployment within your own infrastructure for facilities with strict data residency or sovereignty requirements.",
  },
  {
    q: "What is the implementation timeline?",
    a: "Core AI modules with standard PACS integration are typically live within 2 to 4 weeks. Advanced and Full Spectrum deployments with multiple modality integrations, digital pathology connectivity, and custom reporting template configuration typically take 6 to 10 weeks. A dedicated clinical AI implementation specialist manages the process from integration testing through clinical validation and go-live.",
  },
  {
    q: "How do we demonstrate clinical value to our leadership and governance committees?",
    a: "The AI performance monitoring module generates ongoing reports on AI utilization, finding rates, agreement rates, critical finding escalation times, and worklist prioritization impact. These reports are designed for clinical governance committees, department heads, and executive leadership — providing the evidence base to demonstrate value, justify continued investment, and meet regulatory requirements for AI medical device post-market surveillance.",
  },
];

const trustChips = [
  "FDA 510(k) Cleared Algorithms",
  "CE Mark Certified",
  "Validated Across 2.4M Clinical Images",
  "CT · MRI · X-Ray · Ultrasound · Pathology",
  "DICOM Native",
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full ${isActive ? "md:p-8" : "md:p-5"}`}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]"
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
                  <div className="mt-auto text-left">
                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/65">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-2 text-left text-sm font-semibold leading-snug text-white md:text-base">
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

export default function AIImaging() {
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
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,14,26,0.78) 0%, rgba(10,14,26,0.68) 40%, rgba(10,14,26,0.88) 100%)",
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
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                See What Human Eyes Miss. Diagnose{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  With Certainty.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See AI Imaging in Action <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Clinical Demonstration
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
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Clinical AI for Imaging
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>AI That Makes Radiologists </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Faster, More Accurate, More Confident.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Artificial intelligence is not replacing radiologists. It is making them faster, more
            accurate, and more confident — by processing every pixel of every image before the human
            eye arrives, surfacing findings that matter, and eliminating the cognitive load that
            leads to fatigue-driven errors. Secreta AI Imaging brings clinical-grade artificial
            intelligence to your radiology department, your pathology lab, and your point-of-care
            imaging workflows — seamlessly integrated, rigorously validated, and ready to work from
            day one.
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
              Medical Imaging Is Facing a Crisis That Technology Must Help{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Solve.
              </span>
            </h2>
          </div>

          <div className="mt-6 flex flex-1 items-center overflow-hidden md:mt-8">
            <motion.div
              style={{ x: problemX }}
              className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12"
            >
              {problemCards.map((card, i) => (
                <article
                  key={i}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[440px] lg:w-[480px]"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      width={896}
                      height={512}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                      0{i + 1} — Pressure Point
                    </span>
                    <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">
                      {card.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">
                      {card.body}
                    </p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
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
              Clinical AI That Works Alongside Your Radiologists. Not Instead of Them.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Secreta AI Imaging is a modality-spanning, specialty-covering platform that integrates
              directly into your existing imaging workflow — enhancing every read, accelerating
              every worklist, and catching what fatigue and time pressure cause humans to miss.
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
              AI That Fits Into Your Workflow — Not the Other Way Around
            </h2>
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
              Clinical Performance Validated at Scale
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
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Native Integration With Your Imaging Infrastructure
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta AI Imaging integrates directly with your PACS, RIS, and reporting platform —
            requiring no changes to your acquisition protocols, network architecture, or radiologist
            reporting workflow. AI runs as an invisible layer between image acquisition and
            radiologist review.
          </p>
          <div className="mt-14 grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Boxes,
                title: "Compatible PACS Platforms",
                subtitle: "Vendor-neutral DICOM integration",
                items: [
                  "Secreta RIS",
                  "Agfa Enterprise Imaging",
                  "Philips IntelliSpace",
                  "GE Centricity",
                  "Fujifilm Synapse",
                  "Siemens Healthineers teamplay",
                  "Intelerad",
                  "Ambra Health",
                  "Custom PACS via DICOM",
                ],
              },
              {
                icon: ScanSearch,
                title: "Supported Modalities",
                subtitle: "Across radiology and pathology",
                items: [
                  "CT",
                  "MRI",
                  "Digital X-Ray",
                  "CR",
                  "Mammography",
                  "DBT",
                  "Ultrasound",
                  "Nuclear Medicine",
                  "Digital Pathology WSI",
                ],
              },
              {
                icon: FileCode2,
                title: "Standards & Certifications",
                subtitle: "Regulatory-grade quality assurance",
                items: [
                  "DICOM 3.0",
                  "HL7 FHIR",
                  "DICOMweb",
                  "WADO-RS",
                  "FDA 510(k) Cleared",
                  "CE Mark Class IIb",
                  "ISO 13485",
                  "IEC 62304",
                ],
              },
            ].map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{group.title}</h3>
                  <p className="mt-1 text-sm text-foreground/60">{group.subtitle}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-foreground/75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
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
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(9,22,40,0.92) 0%, rgba(9,22,40,0.82) 50%, rgba(9,22,40,0.95) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            The Question Is No Longer Whether AI Belongs in Radiology.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              It Is Whether You Can Afford to Practice Without It.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/85">
            Every day your radiologists read without AI assistance, they are working harder than
            they need to, missing findings they should not miss, and managing worklists manually
            that a system could organize in seconds. The technology exists. The clinical evidence is
            solid. The regulatory pathways are clear.
          </p>
          <p className="mt-6 text-base leading-relaxed text-white/75">
            The only question is when your department makes the transition — and whether you do it
            with a platform built for clinical rigor or one built for a sales demo.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Clinical AI Demonstration <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Request a Validation Data Pack
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            No algorithmic black boxes. Full performance transparency. Clinical implementation
            support from day one.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
