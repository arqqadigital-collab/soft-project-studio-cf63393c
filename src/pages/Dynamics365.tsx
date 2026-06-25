import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Workflow,
  Network,
  BarChart3,
  Wrench,
  DatabaseZap,
  ClipboardList,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Rocket,
  Building2,
  Wallet,
  Cpu,
  Crown,
  Users,
  ListChecks,
  GitBranch,
  ScanSearch,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import useCase1Asset from "@/assets/dynamics/use-case-1.jpg.asset.json";
import useCase2Asset from "@/assets/dynamics/use-case-2.jpg.asset.json";
import useCase3Asset from "@/assets/dynamics/use-case-3.jpg.asset.json";
import useCase4Asset from "@/assets/dynamics/use-case-4.jpg.asset.json";
import patternBg from "@/assets/dynamics/dynamics-pattern.jpg.asset.json";
import heroVideo from "@/assets/dynamics/dynamics-hero-bg.mp4.asset.json";

const services = [
  {
    icon: Layers,
    title: "Microsoft Dynamics Implementation",
    body: "End-to-end implementation of Dynamics 365 environments structured around operational requirements, data integrity, and long-term scalability — not default configurations.",
    chips: ["D365 Finance", "SCM", "Business Central", "Multi-company"],
  },
  {
    icon: Workflow,
    title: "Workflow & Process Automation",
    body: "Custom approval structures, procurement workflows, and operational automation aligned to your governance model — eliminating manual coordination without creating process gaps.",
    chips: ["Approval matrices", "Power Automate", "Escalation logic", "HR workflows"],
  },
  {
    icon: Network,
    title: "Microsoft Ecosystem Integration",
    body: "Integration between Dynamics 365 and the full Microsoft stack — plus external banking systems, logistics platforms, and enterprise applications — designed for operational continuity, not point-to-point patches.",
    chips: ["Power Platform", "Azure", "M365", "External ERP"],
  },
  {
    icon: BarChart3,
    title: "Reporting & Power BI Architecture",
    body: "Operational and financial reporting environments that transform D365 data into executive dashboards and decision-ready intelligence — not just static exports.",
    chips: ["Power BI", "KPI dashboards", "Financial reporting", "Automated distribution"],
  },
  {
    icon: Wrench,
    title: "Customization & Extensions",
    body: "Custom entities, role-specific interfaces, and operational logic that standard D365 configurations cannot address — built with long-term maintainability and upgrade compatibility in mind.",
    chips: ["Custom entities", "Role interfaces", "Industry logic", "Automation layers"],
  },
  {
    icon: DatabaseZap,
    title: "Data Migration & Modernization",
    body: "Structured migration from legacy ERP systems into Dynamics 365 — prioritizing data integrity, operational continuity, and validated transition over speed of cutover.",
    chips: ["Legacy ERP migration", "Data cleansing", "Staged execution", "Validation"],
  },
];

const process = [
  {
    icon: ScanSearch,
    n: "01",
    title: "Operational Discovery & Requirements Mapping",
    body: "We evaluate business processes, reporting dependencies, and organizational structure to define how D365 should support the enterprise — before any configuration begins.",
    meta: "Output: Requirements assessment · Process map · Architecture recommendation · Implementation roadmap",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "Solution Architecture & Governance Design",
    body: "System structure, role-based access, approval workflows, integration topology, and reporting architecture are designed and documented before development begins.",
    meta: "Output: Architecture blueprint · Access model · Workflow design · Integration plan",
  },
  {
    icon: Code2,
    n: "03",
    title: "Configuration, Development & Integration",
    body: "D365 is configured and extended against approved requirements. Integrations, automation layers, and custom logic are built within a structured delivery framework — version-controlled, not ad hoc.",
    meta: "Stack: D365 · Power Platform · Azure · Power BI · Microsoft 365",
  },
  {
    icon: CheckCircle2,
    n: "04",
    title: "Testing, Validation & User Acceptance",
    body: "All workflows, integrations, and reporting structures are validated in a controlled test environment. UAT covers operational scenarios — not just technical function. Nothing reaches production without sign-off.",
    meta: "Coverage: Workflow · Financial · Integration · Regression · Reporting",
  },
  {
    icon: Rocket,
    n: "05",
    title: "Deployment, Training & Operational Transition",
    body: "Production rollout via controlled deployment procedures, supported by user training, operational documentation, and a defined hypercare period. Go-live is the beginning of stabilization — not the end of the program.",
    meta: "Deliverables: Production deployment · Training · Documentation · Post-launch support",
  },
];

const useCases = [
  {
    n: "01",
    title: "Multi-Entity Financial Management",
    body: "Centralized financial operations across multiple companies, branches, or operational entities with standardized reporting, approval governance, and consolidated visibility.",
    image: useCase1Asset.url,
    alt: "Multi-entity financial consolidation",
  },
  {
    n: "02",
    title: "Procurement & Approval Workflow Automation",
    body: "Automated procurement approvals based on department structure, budget thresholds, operational hierarchy, and compliance policies.",
    image: useCase2Asset.url,
    alt: "Procurement and approval workflow automation",
  },
  {
    n: "03",
    title: "Executive Power BI Reporting Layer",
    body: "Centralized operational and financial dashboards providing leadership teams with real-time visibility into KPIs, operational performance, and enterprise metrics.",
    image: useCase3Asset.url,
    alt: "Executive Power BI reporting dashboard",
  },
  {
    n: "04",
    title: "Cross-System ERP Integration",
    body: "Integration between Microsoft Dynamics and external operational systems including banking platforms, logistics providers, healthcare systems, and enterprise applications.",
    image: useCase4Asset.url,
    alt: "Cross-system ERP integration",
  },
];

const audiences = [
  {
    icon: Users,
    role: "Operations Directors",
    headline: "Execution consistency across departments",
    body: "Standardized workflows and centralized operational visibility reduce dependency on manual coordination and improve execution consistency across locations and business units.",
    outcomes: ["Reduced bottlenecks", "Faster workflow execution", "Cross-functional visibility", "Lower manual process dependency"],
  },
  {
    icon: Wallet,
    role: "CFOs & Finance Leaders",
    headline: "Financial control and audit readiness",
    body: "Integrated financial operations improve reporting accuracy, consolidation speed, compliance readiness, and cost visibility — replacing fragmented finance tooling with a governed D365 environment.",
    outcomes: ["Faster consolidation", "Improved audit readiness", "Reduced reconciliation effort", "Better cost visibility"],
  },
  {
    icon: Cpu,
    role: "CIOs & Transformation Leaders",
    headline: "A scalable enterprise technology foundation",
    body: "Dynamics 365 creates a unified operational platform capable of supporting automation, integration, and long-term digital transformation — without rebuilding from scratch at each growth stage.",
    outcomes: ["Unified systems", "Reduced legacy dependency", "Improved data governance", "Scalable architecture"],
  },
  {
    icon: Crown,
    role: "Enterprise Leadership",
    headline: "Operational agility and investment protection",
    body: "Well-structured D365 environments improve organizational agility and long-term scalability while protecting enterprise technology investments from the cost of repeated ERP transitions.",
    outcomes: ["Operational alignment", "Increased scalability", "Better decision infrastructure", "Reduced fragmentation"],
  },
];

const discoveryItems = [
  "Operational workflow review",
  "Integration dependency mapping",
  "Reporting requirements audit",
  "Architecture recommendation",
  "Implementation roadmap",
];


function AnimatedNumber({ value }: { value: string }) {
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

export default function Dynamics365() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            src={heroVideo.url}
            poster={patternBg.url}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,11,24,0.78) 0%, rgba(7,20,43,0.65) 60%, rgba(5,11,24,0.88) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Standardized where beneficial.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Engineered where it matters.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Request project scoping <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  View capabilities
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRODUCTION */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
            Microsoft Dynamics 365{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Implementation, Integration & Customization
            </span>
          </h2>

          <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
            SBS implements, customizes, and integrates Microsoft Dynamics 365 environments structured around how you
            operate — delivering end-to-end value across finance, operations, and analytics.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
            {[
              "End-to-end D365 Finance, SCM & Business Central",
              "Power Platform, Azure & Microsoft 365 integration",
              "Custom workflows, approvals & process automation",
              "Power BI reporting architecture & executive dashboards",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand-blue)]" />
                <span className="text-sm font-medium text-white/90">{line}</span>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-white/60">
            Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.
          </p>
        </div>
      </section>

      {/* WHAT WE DELIVER */}
      <section id="services" className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              What We Deliver
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Enterprise Microsoft Dynamics services across</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                implementation, integration, and operational transformation.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Every engagement is scoped to operational requirements, governance structures, and
              long-term maintainability — not software deployment timelines.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GOVERNANCE PROCESS */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              Implementation Governance Process
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              How we scope, architect, and deliver{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Microsoft Dynamics environments.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              ERP failures are rarely software failures. They result from unclear scope, weak governance,
              and implementations that treat go-live as the finish line. Our five-phase framework is
              designed against those outcomes.
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {process.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur md:grid-cols-[120px_56px_1fr] md:items-start md:p-8"
                >
                  <div className="text-5xl font-bold text-white/15 md:text-6xl">{p.n}</div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white md:text-2xl">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75 md:text-base">{p.body}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-wider text-white/55">{p.meta}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Enterprise Use Cases
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>What enterprises actually build</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                with Dynamics 365.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Representative operational transformation initiatives — not generic ERP demos.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => (
              <motion.div
                key={u.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={u.image}
                    alt={u.alt}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                      {u.n}
                    </span>
                    <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                      {u.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{u.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="relative bg-[#f6f7fb] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Who We Serve
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Built for the leaders who</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                own enterprise operations.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Different roles carry different operational stakes in a D365 program. We structure our delivery around all of them.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-border bg-white p-7"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--brand-dark)" }}>
                      {a.role}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>
                    {a.headline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {a.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--brand-blue)]" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STANDARD VS STRATEGIC */}
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <img
          src={patternBg.url}
          alt=""
          loading="lazy"
          width={1920}
          height={800}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[#0a0e1a]/60"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
            Standard D365 covers the operational baseline.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Strategic implementation aligns it with how you actually work.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
            Out-of-the-box Dynamics 365 handles the standard. It does not handle your approval governance,
            your multi-entity reporting structure, your integration contracts with legacy systems, or the
            operational logic that defines how your enterprise runs.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
            SBS builds that layer — structured around your operational requirements, governed through a
            defined implementation process, and maintained for long-term scalability.
          </p>
        </div>
      </section>

      {/* DISCOVERY SESSION */}
      <section id="contact" className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Discovery Session
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>What does your D365 program</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                actually require?
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              A structured discovery session — covering your workflows, operational dependencies, reporting
              requirements, and implementation priorities — produces a documented assessment and D365
              architecture recommendation before any commitment is made.
            </p>
            <a
              href="#cta"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Schedule a discovery session <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-3 rounded-2xl border border-border bg-card p-7">
            {discoveryItems.map((it) => (
              <li key={it} className="flex items-start gap-3 text-sm font-medium text-foreground">
                <div
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="cta">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
