import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  MapPin,
  Settings,
  GraduationCap,
  RefreshCw,
  Building2,
  Hospital,
  Share2,
  Database,
  Globe2,
  FileBadge,
  Languages,
  Layers,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import uaeHeroVideo from "@/assets/uae-compliance/uae-hero.mp4.asset.json";
import problem1 from "@/assets/uae-compliance/problem/p1.jpg";
import problem2 from "@/assets/uae-compliance/problem/p2.jpg";
import problem3 from "@/assets/uae-compliance/problem/p3.jpg";
import problem4 from "@/assets/uae-compliance/problem/p4.jpg";
import problem5 from "@/assets/uae-compliance/problem/p5.jpg";
import problem6 from "@/assets/uae-compliance/problem/p6.jpg";
import journey1 from "@/assets/uae-compliance/journey/j1.jpg";
import journey2 from "@/assets/uae-compliance/journey/j2.jpg";
import journey3 from "@/assets/uae-compliance/journey/j3.jpg";
import journey4 from "@/assets/uae-compliance/journey/j4.jpg";
import uaeCtaVideo from "@/assets/uae-compliance/uae-cta.mp4.asset.json";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

const features = [
  { icon: Building2, title: "MOH Saudi Arabia Compliance", body: "Full alignment with Ministry of Health regulations. MOH-formatted clinical documentation, licensing verification for practitioners and facilities, and mandatory public health reporting workflows built in." },
  { icon: Hospital, title: "CBAHI Accreditation Support", body: "Structured compliance with CBAHI standards across clinical, operational, and safety domains — with built-in evidence collection, audit trails, and readiness dashboards for accreditation cycles." },
  { icon: Share2, title: "NPHIES Integration", body: "Certified NPHIES connectivity for eligibility verification, prior authorization, claims submission, and remittance — with pre-configured payer profiles for every major KSA insurer and TPA." },
  { icon: Database, title: "SEHA & Sehhaty Integration", body: "Real-time integration with SEHA virtual hospital services and Sehhaty citizen health records. Clinical summaries, appointments, and prescriptions flow automatically with MOH-compliant consent." },
  { icon: Globe2, title: "ZATCA e-Invoicing (Fatoora)", body: "Full ZATCA Phase 2 e-invoicing compliance. XML-compliant invoices, cryptographic stamps, QR codes, and real-time clearance integration with the Fatoora platform — no external add-ons required." },
  { icon: FileBadge, title: "SCFHS Licensing & Credentialing", body: "Live integration with Saudi Commission for Health Specialties for practitioner licensing, credential validation, CME tracking, and automated renewal alerts across your workforce." },
  { icon: MapPin, title: "Vision 2030 Healthcare Alignment", body: "Configured for the Health Sector Transformation Program — value-based care contracting, cluster reporting models, and preventive health KPIs aligned with Vision 2030 mandates." },
  { icon: ShieldCheck, title: "PDPL & NCA Cybersecurity", body: "Compliance with the Saudi Personal Data Protection Law and NCA Essential Cybersecurity Controls. Data residency in-Kingdom, consent management, and breach notification workflows built in." },
  { icon: Languages, title: "Arabic & English Bilingual", body: "Every screen, clinical form, patient document, and regulatory report is fully functional in Arabic and English — with proper RTL rendering and Hijri/Gregorian date handling throughout." },
  { icon: Layers, title: "Cluster & Group Consolidation", body: "Unified management layer for health clusters and multi-facility operators. Local compliance at each site, cluster-wide visibility, and MOH cluster reporting in a single view." },
];

const journey = [
  { icon: MapPin, title: "Kingdom Compliance Mapping", image: journey1, body: "Our KSA implementation team maps your operational footprint — facilities, payer mix, regulatory frameworks, and integration obligations — and produces a prioritized MOH/CBAHI/NPHIES gap analysis." },
  { icon: Settings, title: "Configuration & National Integration", image: journey2, body: "Each facility is configured to KSA-specific standards. NPHIES payer profiles, ZATCA e-invoicing, SCFHS credentialing, and SEHA/Sehhaty integrations are activated and tested end to end." },
  { icon: GraduationCap, title: "Bilingual Training & Phased Go-Live", image: journey3, body: "Staff are trained in Arabic and English by KSA-specialist consultants. Go-live is phased by facility with on-site live support, MOH readiness sign-off, and CBAHI evidence handover." },
  { icon: RefreshCw, title: "Continuous Regulatory Alignment", image: journey4, body: "Our KSA compliance team monitors MOH, CBAHI, NPHIES, ZATCA, and SCFHS updates continuously — and deploys changes before effective dates so your facilities stay compliant automatically." },
];

const stats = [
  { value: "97%", label: "Average first-pass NPHIES claim acceptance rate across KSA deployments" },
  { value: "100%", label: "ZATCA Phase 2 e-invoicing clearance compliance since go-live" },
  { value: "60%", label: "Reduction in CBAHI accreditation preparation time for multi-facility operators" },
  { value: "78%", label: "Reduction in prior authorization turnaround time via NPHIES integration" },
];

const problemCards = [
  { image: problem1, title: "Overlapping Regulator Mandates", body: "KSA operators face parallel obligations from MOH, CBAHI, CCHI, SCFHS, and ZATCA — each with its own portals, formats, and deadlines that generic systems cannot orchestrate in one workflow." },
  { image: problem2, title: "NPHIES Complexity", body: "NPHIES imposes strict FHIR-based transaction structures for eligibility, authorization, and claims — and payer-specific quirks that break generic integrations at scale." },
  { image: problem3, title: "ZATCA Phase 2 Enforcement", body: "ZATCA e-invoicing Phase 2 requires cryptographic stamping and real-time clearance for every invoice. Non-compliant facilities face financial penalties and blocked collections." },
  { image: problem4, title: "CBAHI Evidence Burden", body: "CBAHI accreditation cycles demand extensive evidence trails across clinical, operational, and safety domains — most systems force teams to assemble it manually every three years." },
  { image: problem5, title: "PDPL & Data Residency", body: "The Saudi Personal Data Protection Law and NCA controls require in-Kingdom data residency and strict consent handling — a hard constraint most global platforms cannot satisfy." },
  { image: problem6, title: "Cluster-Level Reporting Gaps", body: "Under the Health Sector Transformation, clusters must report consolidated KPIs across hospitals and PHCs — impossible when each facility runs a different system on different data models." },
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border md:h-full`}
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
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Stage {i + 1}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.body}</p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">Stage {i + 1}</div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-white md:text-base">{step.title}</h3>
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
  { q: "Is your NPHIES integration certified end to end?", a: "Yes. Our NPHIES integration is certified and covers the full transaction set — eligibility, prior authorization, claims, remittance, and status inquiries — with pre-configured profiles for every major KSA payer and TPA. It is tested against each NPHIES release before rollout." },
  { q: "Do you handle ZATCA Phase 2 e-invoicing natively?", a: "Yes. Secreta generates ZATCA-compliant XML invoices with cryptographic stamps and QR codes, and clears them in real time through the Fatoora platform. No third-party middleware is required, and B2B, B2C, and simplified invoice flows are supported out of the box." },
  { q: "How does the platform support CBAHI accreditation?", a: "CBAHI standards are mapped to workflows across clinical, operational, and safety modules. Evidence is captured continuously through daily use, not assembled at audit time. Readiness dashboards show live compliance status per standard for each facility." },
  { q: "Is patient data hosted inside the Kingdom?", a: "Yes. KSA deployments run on in-Kingdom infrastructure to meet PDPL and NCA data residency requirements. Backups, disaster recovery, and processing all remain inside the country, and consent and data-subject-rights workflows are built in." },
  { q: "Can clusters and multi-facility groups get consolidated reporting?", a: "Yes. The cluster management layer consolidates clinical, operational, and financial data across hospitals and PHCs into a unified view aligned with Health Sector Transformation reporting, while each facility retains its own MOH and CBAHI local reporting." },
  { q: "How long does a typical KSA implementation take?", a: "Single-facility implementations typically complete in 4 to 8 weeks. Multi-facility cluster deployments typically span 3 to 6 months with a dedicated KSA project team covering MOH readiness, NPHIES onboarding, ZATCA activation, and CBAHI evidence setup." },
];

const trustChips = [
  "MOH Saudi Arabia Aligned",
  "NPHIES Certified",
  "ZATCA Phase 2 Ready",
  "CBAHI Accreditation Support",
  "SCFHS Integrated",
  "Arabic & English Interface",
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

export default function KSACompliance() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video src={uaeHeroVideo.url} autoPlay muted loop playsInline className="h-full w-full object-cover" />
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
                One Platform. Every KSA Regulator.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Full Kingdom Compliance.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Achieve Full KSA Compliance <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Kingdom Assessment
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
            Introducing Secreta KSA
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>Regulator-Specific Depth.</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Kingdom-Wide Management Breadth.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The Saudi healthcare sector operates under one of the most demanding regulatory environments in the region —
            spanning MOH, CBAHI, CCHI, SCFHS, ZATCA, and Vision 2030 transformation mandates. Secreta KSA is the only
            healthcare management platform that delivers full Kingdom compliance in a single unified system, with the
            NPHIES, ZATCA, and SEHA integration depth that generic platforms cannot match.
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
              Every KSA Regulator is a Different{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Compliance Landscape.
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
                      className="h-full w-full object-cover"
                    />
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
              Built for Every KSA Regulator
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              A single integrated platform with regulator-specific configuration depth — pre-built for MOH, CBAHI,
              NPHIES, ZATCA, SCFHS, and every major Saudi payer.
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
              KSA Compliance in 4 Stages
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From mapping to continuous alignment — MOH, CBAHI, NPHIES, ZATCA, and SCFHS covered end to end.
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
              Kingdom Compliance Performance
            </h2>
            <p className="mt-4 text-sm text-white/65 md:text-base">Across our Saudi client network.</p>
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
              Certified Across Every KSA National Platform
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
              Secreta KSA holds active, certified integrations with every major national health, insurance, and
              regulatory platform in the Kingdom — maintained and updated as specifications evolve.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">National Platform Integrations</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "NPHIES — CCHI",
                  "ZATCA Fatoora (Phase 2)",
                  "SEHA Virtual Hospital",
                  "Sehhaty Citizen App",
                  "SCFHS Practitioner Registry",
                  "MOH Public Health Reporting",
                  "Wasfaty e-Prescribing",
                  "Absher Identity Verification",
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
              <h3 className="text-lg font-bold text-foreground">Supported Standards in the Kingdom</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "HL7 FHIR R4 (NPHIES Profiles)",
                  "ICD-10-AM",
                  "CPT-4",
                  "SNOMED CT",
                  "Saudi PDPL",
                  "NCA Essential Cybersecurity Controls",
                  "ZATCA XML e-Invoice",
                  "REST API",
                  "Arabic Unicode & Hijri Dates",
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
        <div className="absolute inset-0">
          <video
            src={uaeCtaVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/80 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            The Kingdom Rewards Organizations That{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Get Compliance Right.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Give your organization the platform that makes KSA compliance a strength rather than a burden.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Kingdom Compliance Assessment <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            Riyadh-based implementation team. Arabic and English support. In-Kingdom hosting. Regulatory updates included.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
