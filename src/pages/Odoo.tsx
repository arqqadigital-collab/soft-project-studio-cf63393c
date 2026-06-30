import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  Workflow,
  Network,
  BarChart3,
  Wrench,
  DatabaseZap,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Rocket,
  Wallet,
  Cpu,
  Crown,
  Users,
  ScanSearch,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import patternBg from "@/assets/odoo/pattern.jpg";
import useCase1 from "@/assets/odoo/use-case-1.jpg";
import useCase2 from "@/assets/odoo/use-case-2.jpg";
import useCase3 from "@/assets/odoo/use-case-3.jpg";
import useCase4 from "@/assets/odoo/use-case-4.jpg";
import heroVideo from "@/assets/odoo/odoo-hero.mp4.asset.json";
import { ScrollRevealText } from "@/components/ScrollRevealText";

const services = [
  {
    icon: Layers,
    title: "Custom module development",
    body: "Purpose-built Odoo modules for business processes that standard modules do not cover. Developed to OCA standards so they survive version upgrades without rewriting.",
    chips: ["OCA standards", "Ground-up modules", "Upgrade-safe", "Python · XML"],
  },
  {
    icon: Workflow,
    title: "Core module extension",
    body: "Extending Odoo's standard modules — accounting, inventory, HR, sales — without modifying core code. Inheritance-based customizations that stay upgradable and maintainable.",
    chips: ["Inheritance model", "No core edits", "Accounting · HR", "Inventory · Sales"],
  },
  {
    icon: Network,
    title: "API & integration development",
    body: "Custom REST endpoints, webhook handlers, and integration middleware connecting Odoo to SAP, Oracle, payment gateways, logistics platforms, and proprietary internal systems.",
    chips: ["REST APIs", "Webhooks", "SAP · Oracle", "Middleware"],
  },
  {
    icon: BarChart3,
    title: "Reporting & BI customization",
    body: "Custom Odoo reports, financial statement formats, and operational dashboards — built on QWeb and connected to external BI tools via structured data exports or API.",
    chips: ["QWeb reports", "Financial statements", "Dashboards", "BI exports"],
  },
  {
    icon: Wrench,
    title: "UI/UX & portal customization",
    body: "Custom Odoo web portals, customer-facing views, and back-office interface modifications — using OWL components and Odoo's frontend framework to maintain upgrade compatibility.",
    chips: ["OWL components", "Custom portals", "Back-office UI", "Frontend framework"],
  },
  {
    icon: DatabaseZap,
    title: "Performance & scalability engineering",
    body: "Query optimisation, caching strategies, background job architecture, and database indexing for Odoo deployments handling high transaction volumes or large data sets.",
    chips: ["Query optimization", "Caching", "Background jobs", "DB indexing"],
  },
];

const process = [
  {
    icon: ScanSearch,
    n: "01",
    title: "Technical Discovery & Scoping",
    body: "We map the business requirement to Odoo's framework capabilities, identify what can be achieved via configuration versus what requires custom code, and define the technical specification before any development begins.",
    meta: "Output: Technical spec · Module dependency map · Effort estimate",
  },
  {
    icon: ShieldCheck,
    n: "02",
    title: "Architecture & Upgrade-Safety Design",
    body: "Every custom module is architected using Odoo's inheritance model — not direct core modifications. We design for maintainability across version upgrades from day one, not as an afterthought.",
    meta: "Standards: OCA guidelines · Inheritance-first · No core file edits",
  },
  {
    icon: Code2,
    n: "03",
    title: "Development & Code Review",
    body: "All code is version-controlled, peer-reviewed, and linted against Odoo's coding standards. No custom module reaches staging without a code review that checks ORM usage, security rules, and access control definitions.",
    meta: "Stack: Python · OWL · XML · PostgreSQL · Git",
  },
  {
    icon: CheckCircle2,
    n: "04",
    title: "Testing in Staging Environment",
    body: "Unit tests, integration tests, and UAT conducted in a staging environment that mirrors production. Regression testing covers existing modules affected by the new development.",
    meta: "Coverage: Unit tests · Integration tests · UAT checklist · Regression",
  },
  {
    icon: Rocket,
    n: "05",
    title: "Deployment & Documentation",
    body: "Production deployment via CI/CD pipeline with rollback capability. Every module ships with technical documentation covering the data model, business logic, configuration parameters, and known limitations.",
    meta: "Deliverables: Deployed module · Technical docs · Change log · Source repo",
  },
];

const useCases = [
  {
    n: "01",
    title: "Multi-Level Purchase Approval Workflow",
    body: "Configurable approval structures based on purchase value, departments, cost centers, and procurement categories — routing requests automatically across L1, L2, and executive approval chains. Includes delegation rules, escalation logic, and audit tracking.",
    image: useCase1,
    alt: "Multi-level purchase approval workflow",
    modules: "Purchase · Accounting · Approvals",
  },
  {
    n: "02",
    title: "SAP Financial Synchronization Connector",
    body: "Real-time synchronization between Odoo and SAP FI environments, aligning journal entries, chart of accounts, cost centers, and financial structures. Built with reconciliation controls, conflict detection, and scheduled delta synchronization.",
    image: useCase2,
    alt: "SAP financial synchronization connector",
    modules: "Accounting · Integration · API",
  },
  {
    n: "03",
    title: "Customer Self-Service Portal",
    body: "Custom Odoo portal allowing customers to manage operational interactions through a branded self-service experience. Includes order tracking, invoice access, document downloads, service requests, and dispute management via OWL-based interfaces.",
    image: useCase3,
    alt: "Customer self-service portal",
    modules: "Website · Portal · OWL",
  },
  {
    n: "04",
    title: "High-Volume Inventory API Infrastructure",
    body: "Custom API layer exposing real-time inventory availability, reservation status, and inbound supply data to external WMS, 3PL, retail, and eCommerce platforms — with queue-based processing, authentication, and response caching.",
    image: useCase4,
    alt: "High-volume inventory API infrastructure",
    modules: "Inventory · API · Queue",
  },
];

const audiences = [
  {
    icon: Users,
    role: "Operations Directors",
    headline: "Execution consistency across departments",
    body: "Standardized workflows reduce operational bottlenecks, eliminate manual coordination, and improve execution consistency across departments, locations, and teams.",
    outcomes: ["Faster approval cycles", "Reduced process fragmentation", "Cross-department coordination", "Real-time operational visibility"],
  },
  {
    icon: Wallet,
    role: "CFOs & Finance Leaders",
    headline: "Reporting accuracy and audit readiness",
    body: "Integrated financial workflows and centralized operational data improve reporting accuracy, compliance readiness, and cost control across the organization.",
    outcomes: ["Reduced reconciliation effort", "Accurate financial reporting", "Better audit traceability", "Improved cost allocation"],
  },
  {
    icon: Cpu,
    role: "Digital Transformation Leaders",
    headline: "A scalable operational backbone",
    body: "Custom Odoo creates a scalable operational backbone capable of supporting growth, automation, integration, and future modernization initiatives.",
    outcomes: ["Unified workflows", "Cross-system integration", "Scalable automation", "Faster adoption of new models"],
  },
  {
    icon: Crown,
    role: "Enterprise Decision Makers",
    headline: "Protect your ERP investment",
    body: "Well-architected customization protects ERP investments by allowing the platform to evolve with the organization instead of forcing operational compromise.",
    outcomes: ["Extended ERP lifespan", "Preserved upgrade flexibility", "Improved enterprise agility", "Strategic alignment"],
  },
];

const discoveryItems = [
  "Operational workflow review",
  "Integration dependency mapping",
  "Custom module scoping",
  "Upgrade-safety assessment",
  "Effort estimate & roadmap",
];

export default function Odoo() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <video
            src={heroVideo.url}
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
                "linear-gradient(180deg, rgba(5,11,24,0.82) 0%, rgba(7,20,43,0.65) 60%, rgba(5,11,24,0.92) 100%)",
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
                Odoo engineered for your enterprise.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Configured where possible. Customized where it matters.
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
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              Custom Odoo, built around{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                how your business actually operates.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              SBS designs and delivers custom Odoo modules, extends standard functionality, and builds integrations so Odoo supports your operating model—not the other way around.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Custom module development from ground up",
              "Core Odoo extension without breaking upgradability",
              "Third-party API & system integration",
              "Performance optimization for high-volume operations",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                <p className="text-sm leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            <p className="text-sm text-white/60">
              Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-white/80">
              Odoo Partner status
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-white/80">
              Years of implementation experience
            </span>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section id="services" className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              What We Build
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Six development disciplines.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                One coherent technical team.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Every engagement is scoped, architected, and delivered by developers with deep Odoo framework knowledge — not generalist teams learning the platform on your project.
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

      {/* DEVELOPMENT PROCESS */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              Development Process
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              How we scope, build,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                and deliver custom Odoo.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Enterprise customization requires governance, upgrade discipline, and controlled delivery —
              not ad hoc development. Our delivery process provides all three.
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
              <span style={{ color: "var(--brand-dark)" }}>What enterprises actually</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                build with custom Odoo.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Representative examples of how custom Odoo development solves operational, integration, and
              scalability challenges across complex enterprise environments — beyond standard configurations.
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
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[var(--brand-blue)]">
                    {u.modules}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 80/20 STATEMENT */}
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <img
          src={patternBg}
          alt=""
          loading="lazy"
          width={1920}
          height={800}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#0a0e1a]/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
            Standard Odoo covers ~80% of most operations.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              We build the remaining ~20% — precisely.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
            That final 20% is where differentiation lives: your approvals, reporting formats, controls, and
            integration contracts.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
            We build that layer with the same engineering discipline as the rest of your stack — designed for
            maintainability, tested before deployment, and documented for the teams that support it long term.
          </p>
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="relative bg-[#f6f7fb] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Business Impact
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Not just a technical initiative.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                An operational transformation layer.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Enterprise organizations rarely struggle because their ERP lacks features. They struggle when
              workflows fragment, approvals slow execution, reporting lacks visibility, and teams rely on
              disconnected tools outside the ERP.
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

      {/* ERP OBJECTIVE */}
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-32 md:px-12 md:py-48">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d1322] to-[#0a0e1a]" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <ScrollRevealText
            className="text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl"
            segments={[
              { text: "The objective is not customization for its own sake. " },
              {
                text: "The objective is to create an ERP environment that supports how your organization operates today — while remaining scalable for how it will operate tomorrow.",
                gradient: true,
              },
            ]}
          />
        </div>
      </section>

      {/* DISCOVERY SESSION */}
      <section id="contact" className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Technical Scoping Session
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Let's evaluate what your operations</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                actually require.
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Our team can help assess your workflows, integration requirements, and operational constraints
              to define the right Odoo customization approach before development begins.
            </p>
            <a
              href="#cta"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Schedule a technical scoping session <ArrowRight className="h-4 w-4" />
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
