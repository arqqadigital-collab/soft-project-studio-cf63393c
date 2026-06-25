import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  Workflow,
  Layers,
  ScanSearch,
  Boxes,
  Globe2,
  Cpu,
  FileCode2,

  HardDrive,
  Monitor,
  Users,
  GitBranch,
  Wifi,
  History,
  FileSearch,
  Disc,
  Share2,
  ScanLine,
  Eye,
  FileCheck,
} from "lucide-react";
import problemNoAccess from "@/assets/pacs/problems/no-access.jpg";
import problemLegacy from "@/assets/pacs/problems/legacy.jpg";
import problemCD from "@/assets/pacs/problems/cd-transfer.jpg";
import problemStorage from "@/assets/pacs/problems/storage-fail.jpg";
import problemRemote from "@/assets/pacs/problems/remote.jpg";
import journeyAcquire from "@/assets/pacs/journey/acquire.jpg";
import journeyRetrieve from "@/assets/pacs/journey/retrieve.jpg";
import journeyReport from "@/assets/pacs/journey/report.jpg";
import journeyDeliver from "@/assets/pacs/journey/deliver.jpg";
import heroImage from "@/assets/pacs/hero.jpg";
import bgStepsLight from "@/assets/bg-steps-light.png.asset.json";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const features = [
  { icon: Layers, title: "Universal DICOM Image Acquisition & Storage", body: "Receive, store, and manage DICOM images from every modality — CT, MRI, X-ray, fluoroscopy, mammography, tomosynthesis, ultrasound, nuclear medicine, PET-CT, dental, and interventional. Non-DICOM clinical imaging from endoscopy, dermatology, ophthalmology, and pathology is supported through conversion or native storage with full metadata preservation." },
  { icon: HardDrive, title: "Zero-Loss Archival Architecture", body: "Redundant, geographically distributed storage with no single point of failure. Automatic tiering moves active studies to high-speed primary storage and migrates long-term archives to cost-efficient deep storage — without manual intervention or performance compromise on current studies." },
  { icon: Monitor, title: "High-Performance Diagnostic Viewer", body: "A zero-footprint, browser-based diagnostic workstation delivers radiologist-grade display on any authorized device. Advanced visualization — MPR, MIP, volume rendering, 3D reconstruction, and fusion imaging — is built in. Large volumetric studies load in under three seconds on standard clinical hardware." },
  { icon: Users, title: "Universal Viewing for Clinical Teams", body: "Role-appropriate viewing access for surgeons in theatre, oncologists in MDT, physicians at the bedside, and emergency teams in resuscitation. Image quality and tool availability are matched to clinical role — anywhere, on any authorized device." },
  { icon: GitBranch, title: "Multi-Site Image Management & Sharing", body: "A unified imaging infrastructure across hospital groups and regional networks. Studies acquired at any site are accessible to authorized users at every other site in real time — with the patient's complete imaging history visible in one record." },
  { icon: Wifi, title: "Teleradiology & Remote Reading", body: "High-performance image delivery optimized for remote reading over standard internet connections. Diagnostic-quality viewing on calibrated home workstations, integrated voice recognition, and signed reports delivered to the clinical team in real time." },
  { icon: History, title: "Prior Study Retrieval & Comparison", body: "Every new study automatically retrieves relevant prior imaging — by modality, anatomy, and indication — from your archive, federated PACS, and patient-carried media. Interval change is always assessed against the most clinically relevant prior, not whatever is accessible." },
  { icon: FileSearch, title: "Structured Reporting & RIS Integration", body: "Bidirectional integration with your Radiology Information System. Structured reporting templates launch from the viewer pre-populated. Voice dictation is built in. Signed reports transmit to RIS, referring clinicians, and the patient record simultaneously." },
  { icon: Disc, title: "CD & External Image Import", body: "Patient-carried imaging on CD, DVD, or USB is imported through a dedicated workstation that converts external studies to your archival format, associates them with the correct patient, and makes them available for comparison within minutes." },
  { icon: Share2, title: "Image Exchange & Interoperability", body: "Participate in regional and national image sharing networks via IHE XDS-I and Cross-Enterprise Document Sharing. Send and receive studies electronically — no CD burning, no courier dispatch. Integration with Malaffi, Riayati, and NPHIES image exchange is supported." },
];

const journey = [
  { icon: ScanLine, title: "Image Acquired", image: journeyAcquire, body: "The patient is scanned. The modality transmits the study to Secreta PACS via DICOM immediately after acquisition. The study appears in the archive and on the radiologist's worklist within seconds of the last image being generated." },
  { icon: History, title: "Priors Retrieved", image: journeyRetrieve, body: "Secreta PACS automatically retrieves the patient's relevant prior studies — from the local archive, from federated PACS systems, and from imported external media — and associates them with the current study for comparison viewing." },
  { icon: Eye, title: "Displayed & Reported", image: journeyReport, body: "The radiologist opens the study in the diagnostic viewer. Priors load in the comparison panel automatically. Advanced visualization is available without switching applications. The structured report template opens pre-populated. The radiologist dictates, reviews, and signs." },
  { icon: FileCheck, title: "Report Delivered", image: journeyDeliver, body: "The signed report is transmitted to the RIS, referring clinician's EMR view, and patient portal simultaneously. Images are accessible to authorized clinical team members — surgeons, oncologists, emergency physicians — through role-appropriate viewing portals." },
];

const stats = [
  { value: "50M+", label: "Medical images managed across client networks" },
  { value: "99.9%", label: "Enterprise SLA availability guaranteed monthly" },
  { value: "<3s", label: "Load time for large volumetric studies on standard hardware" },
  { value: "0", label: "Image loss events under our zero-loss archival architecture" },
  { value: "100%", label: "DICOM 3.0 compliance across every supported modality" },
  { value: "24/7", label: "Worldwide access for authorized clinicians on any device" },
];

const problemCards = [
  { title: "No Access Outside Radiology", image: problemNoAccess, body: "A surgeon preparing for a complex procedure cannot access pre-operative imaging from the operating theatre because the PACS is not accessible outside the radiology department." },
  { title: "Legacy Archives, Lost History", image: problemLegacy, body: "Prior studies from a previous admission sit on a legacy system the current PACS cannot retrieve — so the radiologist reads without comparison, missing interval change that would have changed the report." },
  { title: "CDs, Couriers, and Trauma Delays", image: problemCD, body: "A patient arrives in the ED after a road traffic accident. Imaging from the referring hospital cannot be transferred digitally — someone burns a CD, drives it across town, and the trauma team decides from verbal descriptions in the meantime." },
  { title: "Storage Failures, Lost Studies", image: problemStorage, body: "Infrastructure fails during an upgrade and a subset of archived studies becomes inaccessible — triggering a clinical governance incident, a patient safety review, and emergency data recovery that costs more than the original investment." },
  { title: "Remote Reading That Doesn't Perform", image: problemRemote, body: "Radiologists working from home cannot access studies at the same speed or quality as they can in the department — because the PACS architecture was never designed for remote reading." },
];

const faqs = [
  { q: "How does Secreta PACS handle migration from our existing PACS?", a: "Legacy PACS migration is managed by Secreta's dedicated imaging migration team. The process begins with a complete inventory of your existing archive — study count, modality distribution, date range, and storage format. A migration methodology is developed that prioritizes active and recent studies while migrating the full historical archive in the background. Migration runs in parallel with your existing PACS until the cutover date — ensuring no clinical disruption and no period of reduced image availability. Every migrated study is validated for completeness and integrity before the legacy system is retired." },
  { q: "What is the storage architecture and how is data protected against loss?", a: "Secreta PACS uses a tiered storage architecture with automatic replication across geographically separated storage nodes. Primary storage holds recent and active studies for fast retrieval. Near-line storage holds studies accessed less frequently. Deep archive storage holds long-term retention studies at lower cost per terabyte. Every storage tier replicates data automatically — no single hardware failure can result in image loss. Storage health is monitored continuously and alerts are generated before capacity thresholds are approached. Annual disaster recovery testing is included in enterprise SLA agreements." },
  { q: "Can radiologists use their own diagnostic monitors for remote reading?", a: "Yes. Secreta PACS delivers images calibrated to DICOM GSDF standards through the browser-based viewer — the calibration is applied by the viewer, not by the monitor hardware. For formal diagnostic reading from home, radiologists should use DICOM-calibrated diagnostic monitors. For clinical review — non-reporting access by surgeons, oncologists, and other physicians — standard clinical monitors and consumer displays are appropriate. The viewer automatically applies the display parameters appropriate to the viewing context." },
  { q: "How does the system handle studies from referring hospitals that use a different PACS vendor?", a: "Studies from external PACS systems can be received through three pathways — electronic DICOM push from the external PACS where network connectivity exists, patient-carried media import through the CD import workstation, and IHE XDS-I image exchange where both facilities participate in a shared exchange network. All three pathways result in the external study being associated with the correct patient record and available for comparison viewing alongside local studies in the diagnostic viewer." },
  { q: "What happens to image availability during a planned maintenance window?", a: "Planned maintenance is scheduled during low-activity periods — typically overnight — and communicated to clinical teams in advance. During maintenance, the PACS operates in a read-only mode that allows image viewing to continue while archival and administrative functions are temporarily suspended. Emergency maintenance procedures ensure that imaging availability is restored within defined RTO targets specified in your SLA. Our enterprise SLA guarantees 99.9% availability measured on a monthly basis." },
  { q: "How long are images retained in the archive?", a: "Retention periods are configurable by study type, patient age group, and applicable regulatory requirement. Standard configuration follows the retention requirements of your jurisdiction — typically 7 to 10 years for adult studies and until age 25 or beyond for pediatric studies depending on applicable law. Retention policies are enforced automatically — studies approaching the end of their retention period are flagged for clinical governance review before deletion. Studies flagged for retention beyond standard periods — medicolegal holds, research holds — are managed through a structured exception workflow." },
  { q: "Does the system support 3D post-processing and advanced visualization?", a: "Yes. Advanced visualization tools — multiplanar reconstruction, maximum intensity projection, minimum intensity projection, volume rendering, surface rendering, and virtual endoscopy — are available within the diagnostic viewer without launching a separate application or transferring studies to a dedicated post-processing workstation. For highly specialized post-processing workflows — cardiac CT analysis, neurovascular imaging, orthopedic surgical planning — integration with dedicated third-party post-processing platforms is supported through DICOM push and retrieval." },
  { q: "How is the PACS integrated with AI imaging applications?", a: "The Secreta PACS AI integration layer routes studies to configured AI analysis engines immediately upon acquisition using DICOMweb STOW-RS. AI results are returned as DICOM Structured Reports and DICOM Secondary Captures — appearing in the diagnostic viewer as an overlay or comparison panel alongside the original study. Every AI finding is traceable to the specific study and series that generated it. Multiple AI applications can be connected simultaneously, with study routing rules configured by modality, body region, and clinical indication." },
];

const trustChips = [
  "Managing 50M+ Images",
  "Full DICOM 3.0 Compliance",
  "Zero-Loss Architecture",
  "Multi-Modality & Multi-Site",
  "AI-Ready Infrastructure",
  "HL7 & RIS Integrated",
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

export default function PACS() {
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
          <img
            src={heroImage}
            alt="Radiology reading room with diagnostic displays"
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
                Every Image. Every Modality. Every Clinician.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Instantly.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  See Secreta PACS in Action <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book an Imaging Infrastructure Assessment
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
            Built for Medical Imaging
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>Enterprise Imaging Infrastructure for </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Modern Healthcare.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Medical imaging is one of the most data-intensive, time-critical, and clinically consequential workflows in your hospital. When images are delayed, lost, duplicated, or inaccessible at the point of clinical decision-making, patients wait longer, diagnoses are delayed, and procedures are repeated unnecessarily. Secreta PACS is an enterprise-grade picture archiving and communication system that stores, manages, distributes, and displays every medical image your facility produces — instantly, securely, and from any authorized device anywhere in the world.
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
              Imaging Infrastructure Failures Cost Clinicians Time, Patients Safety, and Hospitals Money.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Every Day.
              </span>
            </h2>
          </div>

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
                      0{i + 1} — Failure
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
              Built for the Clinical and Operational Demands of Modern Healthcare
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the scanner room floor to the radiologist's workstation, from the operating theatre to the patient's bedside — Secreta PACS delivers every image with reliability, speed, and universal access.
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
              From Image Acquisition to Clinical Decision — Every Step Seamless
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
              Imaging Performance Measured Across Our Client Network
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
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            The Imaging Infrastructure at the Centre of Your Clinical Ecosystem
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            Secreta PACS integrates with every system that produces, consumes, or references medical imaging — from modalities on the scanner room floor to AI engines in the cloud, from the RIS to the EMR delivering reports to referring clinicians.
          </p>
          <div className="mt-14 grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ScanSearch,
                title: "Modality Integration",
                subtitle: "All DICOM 3.0 compliant",
                items: ["CT", "MRI", "X-Ray", "Fluoroscopy", "Mammography", "Ultrasound", "Nuclear Medicine", "PET-CT", "Dental", "Interventional", "Endoscopy", "Dermatology", "Ophthalmology", "Pathology WSI"],
              },
              {
                icon: Boxes,
                title: "System Integration",
                subtitle: "RIS, EMR & enterprise platforms",
                items: ["Secreta RIS", "Epic", "Cerner", "Meditech", "Agfa", "Philips IntelliSpace", "GE Centricity", "Fujifilm Synapse", "Intelerad", "All RIS via DICOM MWL & HL7"],
              },
              {
                icon: Globe2,
                title: "National Platform Integration",
                subtitle: "Regional health information exchanges",
                items: ["Malaffi", "Riayati", "NPHIES", "Qatar NHIX", "IHE XDS-I Image Exchange Networks"],
              },
              {
                icon: Cpu,
                title: "AI Platform Integration",
                subtitle: "Clinical AI engines & custom vendors",
                items: ["Secreta AI Imaging", "Google Health AI", "Aidoc", "Annalise.ai", "Custom AI vendor integration via DICOM SR & DICOMweb"],
              },
              {
                icon: FileCode2,
                title: "Supported Standards",
                subtitle: "Interoperability protocols",
                items: ["DICOM 3.0", "DICOMweb", "WADO-RS", "STOW-RS", "HL7 v2 & FHIR R4", "IHE Radiology Profiles", "IHE XDS-I", "IHE Cross-Enterprise Document Sharing", "IEC 62494 Radiation Dose Reporting", "REST API"],
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
        <img
          src={heroImage}
          alt=""
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
            Every Image Your Facility Produces Is a Clinical Asset.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Treat It Like One.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/85">
            Medical images drive diagnoses, guide procedures, inform treatment decisions, and create the longitudinal visual record of your patients' health over time. They deserve infrastructure that stores them without loss, delivers them without delay, displays them without compromise, and makes them available to every clinician who needs them — wherever they are, whenever they need them.
          </p>
          <p className="mt-6 text-lg font-medium text-white">
            That is what Secreta PACS delivers. Every image. Every time.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Imaging Infrastructure Assessment <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Request a PACS Migration Consultation
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/70">
            Legacy PACS migration support included. On-premise, cloud, and hybrid deployment available. Infrastructure assessment delivered within two weeks. Pricing tailored to your study volume and site configuration.
          </p>

        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
