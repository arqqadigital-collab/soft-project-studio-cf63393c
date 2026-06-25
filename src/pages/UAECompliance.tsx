import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate, useScroll, useTransform } from "framer-motion";
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
import uaeHeroVideo from "@/assets/uae-compliance/uae-hero.mp4";
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
import uaeCtaVideo from "@/assets/uae-compliance/uae-cta.mp4";

const features = [
  {
    icon: Building2,
    title: "UAE DHA Compliance — Dubai",
    body: "Full alignment with Dubai Health Authority regulations. Compliant eClaims submission, DHA-formatted clinical documentation, integration with Dubai HIE, and practitioner licensing verification.",
  },
  {
    icon: Hospital,
    title: "UAE DOH Compliance — Abu Dhabi",
    body: "Full DOH compliance with Malaffi integration, Thiqa/Daman payer workflows, prior authorization through DOH-certified pathways, and JAWDA quality reporting.",
  },
  {
    icon: Share2,
    title: "Riayati Integration — Dubai HIE",
    body: "Real-time integration with Riayati. Clinical summaries, medications, and care history are shared and retrieved automatically at the point of care with DHA-compliant consent workflows.",
  },
  {
    icon: Database,
    title: "Malaffi Integration — Abu Dhabi HIE",
    body: "Certified Malaffi integration for real-time record sharing. Admissions, discharges, diagnoses, medications, and allergies are submitted automatically with full DOH compliance.",
  },
  {
    icon: Globe2,
    title: "Qatar NHIX Integration",
    body: "Connect to Qatar's National Health Information Exchange for eligibility verification, prior authorization, claims processing, and clinical data sharing with pre-built Qatari payer profiles.",
  },
  {
    icon: FileBadge,
    title: "Bahrain NHRA Compliance",
    body: "Full NHRA alignment with certified claim submission pathways, Bahraini clinical coding standards, licensing and credentialing records, and MOH Bahrain public health integrations.",
  },
  {
    icon: MapPin,
    title: "Kuwait & Oman Alignment",
    body: "Country-specific insurance workflows, clinical coding standards, MOH reporting formats, and regulatory documentation for facilities in Kuwait and Oman — no manual adaptation needed.",
  },
  {
    icon: ShieldCheck,
    title: "UAE Federal Data Protection",
    body: "Full compliance with UAE Federal Decree-Law No. 45 of 2021. Data residency options, consent management, data subject rights, and breach notification workflows built in.",
  },
  {
    icon: Languages,
    title: "Arabic & English Bilingual",
    body: "Every screen, clinical form, patient document, and regulatory report is fully functional in Arabic and English across all GCC country configurations — with no loss of functionality.",
  },
  {
    icon: Layers,
    title: "Group-Level Consolidation",
    body: "Unified management layer consolidating clinical, operational, and financial data across all sites and countries. Local compliance, group-wide visibility — in a single view.",
  },
];

const journey = [
  {
    icon: MapPin,
    title: "Regional Compliance Mapping",
    image: journey1,
    body: "Our GCC implementation team maps your operational footprint — countries, facilities, regulatory frameworks, and payers — and produces a prioritized country-by-country gap analysis.",
  },
  {
    icon: Settings,
    title: "Country Configuration & Integration",
    image: journey2,
    body: "Each facility is configured to its local regulatory environment. Country-specific payer profiles, coding standards, claim formats, and national platform integrations are activated and tested.",
  },
  {
    icon: GraduationCap,
    title: "Bilingual Training & Phased Go-Live",
    image: journey3,
    body: "Staff across all markets are trained in Arabic and English by country-specialist consultants. Go-live is phased by country or facility with on-site live support during each go-live.",
  },
  {
    icon: RefreshCw,
    title: "Continuous Regulatory Alignment",
    image: journey4,
    body: "Our regional compliance team monitors all GCC markets continuously and deploys updates before effective dates — so your facilities stay compliant without tracking changes themselves.",
  },
];

const stats = [
  {
    value: "96%",
    label:
      "Average first-pass insurance claim acceptance across UAE, Qatar, and Bahrain deployments",
  },
  {
    value: "100%",
    label: "Malaffi & Riayati integration obligations met within regulatory deadlines",
  },
  {
    value: "55%",
    label: "Reduction in group-level compliance reporting time for multi-country operators",
  },
  {
    value: "82%",
    label: "Reduction in prior authorization turnaround time via regional payer integrations",
  },
];

const problemCards = [
  {
    image: problem1,
    title: "Three Frameworks at Once",
    body: "A group operating in Dubai, Abu Dhabi, and Doha is subject to three different insurance frameworks, data protection regimes, and e-health platform requirements — simultaneously.",
  },
  {
    image: problem2,
    title: "DHA vs DOH Specifications",
    body: "UAE facilities must comply with both DHA in Dubai and DOH in Abu Dhabi — similar in intent but different in technical specification. Generic systems can't bridge both.",
  },
  {
    image: problem3,
    title: "HIE Integration as Afterthought",
    body: "Malaffi and Riayati require active integration and real-time data sharing — yet most systems treat HIE connectivity as a checkbox rather than a core capability.",
  },
  {
    image: problem4,
    title: "Disparate National Platforms",
    body: "Qatar's NHIX, Bahrain's NHRA, and Kuwait's MOH all have distinct integration requirements that a single generic system cannot address without country-specific configuration.",
  },
  {
    image: problem5,
    title: "Strict Data Protection Laws",
    body: "UAE Federal Personal Data Protection Law and equivalent GCC frameworks impose strict requirements on how patient data is stored, processed, and transferred.",
  },
  {
    image: problem6,
    title: "Manual Group Reporting",
    body: "Multi-country groups produce compliance reports for each market separately using manual processes — slow, error-prone, and impossible to consolidate at group level.",
  },
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
                        Stage {i + 1}
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
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                      Stage {i + 1}
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

const faqs = [
  {
    q: "Do you support both DHA and DOH compliance in the same system?",
    a: "Yes. Facilities operating in both Dubai and Abu Dhabi can run both DHA and DOH compliance configurations within a single Secreta deployment. Claims, reports, and integrations are automatically routed through the correct regulatory pathway based on each facility's location and license.",
  },
  {
    q: "Is your Malaffi integration currently certified?",
    a: "Yes. Our Malaffi integration holds active DOH certification and covers the full mandatory data sharing transaction set — admissions, discharges, diagnoses, medications, allergies, and clinical summaries. It is tested against each Malaffi platform release before deployment.",
  },
  {
    q: "How do you handle regulatory changes across six GCC markets?",
    a: "Secreta employs a dedicated GCC regulatory compliance team that monitors all markets continuously. When changes are confirmed, the relevant modules are updated and deployed before the effective date, with advance communication to clients.",
  },
  {
    q: "Can a healthcare group see consolidated reporting across all GCC operations?",
    a: "Yes. The group management layer consolidates clinical, operational, and financial data from all facilities and countries into a unified executive view, while country-specific compliance reports remain available for local regulatory use.",
  },
  {
    q: "How is patient data handled across borders within a GCC group?",
    a: "Data handling is configured to comply with each country's data protection law. Cross-border transfers within a group are governed by the most restrictive applicable framework, and data residency options are available for each country.",
  },
  {
    q: "How long does regional implementation take for a multi-country group?",
    a: "Single-country implementations typically complete in 4 to 8 weeks. Full GCC regional deployments across four to five countries typically span 4 to 6 months with a dedicated regional project team.",
  },
];

const trustChips = [
  "UAE DHA & HAAD Certified",
  "Qatar NHIX Ready",
  "Bahrain NHRA Compliant",
  "Kuwait MOH Aligned",
  "Oman TPA Integration",
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

export default function UAECompliance() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-78%"]);

  return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={uaeHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
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
                One Platform. Every GCC Market.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  Full Regulatory Compliance.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Achieve Full GCC Compliance <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Book a Regional Assessment
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
            Introducing Secreta UAE & GCC
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>Country-Specific Depth.</span>
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Regional Management Breadth.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            The Gulf healthcare sector operates across six distinct regulatory environments — each
            with its own insurance frameworks, data protection laws, e-health mandates, and
            reporting obligations. Secreta UAE & GCC is the only healthcare management platform that
            delivers full compliance across the UAE, Qatar, Bahrain, Kuwait, and Oman in a single
            unified system — with the country-specific configuration depth that generic regional
            platforms cannot match.
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
              Every GCC Country is a Different{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Compliance Landscape.
              </span>
            </h2>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div
              style={{ x: problemX }}
              className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12"
            >
              {problemCards.map((card, i) => (
                <article
                  key={card.title}
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
              Built for Every GCC Regulator
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              A single integrated platform with country-specific configuration depth — pre-built for
              every major GCC regulator, payer, and national health platform.
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
              Regional Compliance in 4 Stages
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From mapping to continuous alignment — every country, every regulator, every payer
              covered end to end.
            </p>
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
              Regional Compliance Performance
            </h2>
            <p className="mt-4 text-sm text-white/65 md:text-base">
              Across our GCC client network.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Network className="h-3.5 w-3.5" /> Integrations
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Certified Across Every GCC National Health Platform
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
              Secreta UAE & GCC holds active, certified integrations with every major national
              health and insurance platform across the Gulf — maintained and updated as
              specifications evolve in each market.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">National Platform Integrations</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Malaffi — Abu Dhabi HIE",
                  "Riayati — Dubai HIE",
                  "DHA eClaims Portal",
                  "DOH Abu Dhabi Insurance Gateway",
                  "Qatar NHIX",
                  "NHRA Bahrain Insurance Portal",
                  "Kuwait MOH Reporting Platform",
                  "Oman TPA Integration Gateway",
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
              <h3 className="text-lg font-bold text-foreground">
                Supported Standards Across GCC Markets
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "HL7 FHIR R4",
                  "ICD-10-AM",
                  "CPT-4",
                  "DRG GCC Grouper Variants",
                  "UAE Federal Data Protection Law",
                  "Qatar Personal Data Privacy Law",
                  "GCC Cybersecurity Frameworks",
                  "REST API",
                  "Arabic Unicode Clinical Documentation",
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
        <div className="absolute inset-0">
          <video
            src={uaeCtaVideo}
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
            The GCC Market Rewards Organizations That{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Get Compliance Right.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            Give your organization the platform that makes GCC compliance a strength rather than a
            burden.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Regional Compliance Assessment <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/60">
            GCC-based implementation team. Arabic and English support across all markets. Regulatory
            updates included.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
