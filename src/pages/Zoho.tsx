import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Mail,
  BarChart3,
  TrendingUp,
  ScanSearch,
  Layers,
  Workflow,
  Rocket,
  ShieldCheck,
  Users,
  Wallet,
  Cpu,
  Crown,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/zoho/hero.jpg";
import patternBg from "@/assets/zoho/pattern.jpg";
import useCase1 from "@/assets/zoho/use-case-1.jpg";
import useCase2 from "@/assets/zoho/use-case-2.jpg";
import useCase3 from "@/assets/zoho/use-case-3.jpg";
import useCase4 from "@/assets/zoho/use-case-4.jpg";

const heroChecks = [
  "Redesign workflows before configuring software.",
  "Align sales, finance, operations, and reporting environments into one operational structure.",
  "Focus on user adoption, not technical completion.",
  "Design system for organizational growth, reporting maturity, and operational governance.",
];

const problems = [
  {
    icon: Database,
    title: "Data lives in three places at once",
    body: "Sales updates the CRM. Finance updates the spreadsheet. Ops works from email threads. Nobody has the full picture — and every decision is made on stale data.",
  },
  {
    icon: Mail,
    title: "Approvals stall in inboxes",
    body: "Invoice approvals, contract sign-offs, and onboarding tasks route through email chains. Things slip. Delays compound. No one knows where anything is stuck.",
  },
  {
    icon: BarChart3,
    title: "Reporting is a manual assembly job",
    body: "Leadership needs pipeline visibility. Finance needs expense tracking. Getting those numbers means someone spending Friday afternoon pulling data from disconnected tools.",
  },
  {
    icon: TrendingUp,
    title: "You've outgrown your current setup",
    body: "What worked at 20 people breaks at 60. The processes that got you here — ad-hoc, flexible, people-dependent — are now the bottleneck holding you back.",
  },
];

const process = [
  {
    n: "01",
    icon: ScanSearch,
    title: "Operational Discovery & Workflow Assessment",
    body: "Before any configuration begins, we map your current workflows — where they work, where they break, and where automation can eliminate manual effort. We're looking for process dependencies, reporting gaps, and approval bottlenecks that a standard implementation would miss.",
    meta: "Deliverable: Workflow map + implementation roadmap",
  },
  {
    n: "02",
    icon: Layers,
    title: "Solution Design & Process Structuring",
    body: "We design how data, users, and workflows interact across your Zoho environment. This includes approval structures, role-based access, reporting requirements, and cross-department coordination — before a single field is configured.",
    meta: "Deliverable: Approved architecture design",
  },
  {
    n: "03",
    icon: Workflow,
    title: "Configuration, Automation & Integration",
    body: "Your Zoho environment is built to spec — CRM, Books, Creator, Analytics, and Flow configured together, not in isolation. Automation logic is built to reduce execution overhead, not just trigger notifications.",
    meta: "Deliverable: Configured, integrated Zoho environment",
  },
  {
    n: "04",
    icon: ShieldCheck,
    title: "Testing, Validation & User Readiness",
    body: "Every workflow, integration, and automation is tested against real operational scenarios — not just technical checklists. User acceptance testing is part of the process, not an afterthought.",
    meta: "Deliverable: UAT sign-off + validated workflows",
  },
  {
    n: "05",
    icon: Rocket,
    title: "Deployment & Operational Transition",
    body: "Go-live is supported by onboarding, documentation, and post-launch stabilization. The objective is adoption — teams that understand the system and can operate it independently, not a dependency on external support.",
    meta: "Deliverable: Production deployment + knowledge transfer",
  },
];

const useCases = [
  {
    n: "01",
    title: "Multi-Stage Sales Process Automation",
    body: "Automated lead qualification, opportunity management, approval workflows, and sales pipeline tracking across multiple sales teams and operational stages.",
    image: useCase1,
    impacts: ["Improved sales visibility", "Faster lead progression", "Reduced manual coordination", "Standardized sales execution"],
  },
  {
    n: "02",
    title: "Customer Onboarding Workflow Management",
    body: "Centralized onboarding workflows connecting sales, finance, operations, and customer support teams through automated task routing and process visibility.",
    image: useCase2,
    impacts: ["Faster onboarding cycles", "Improved customer experience", "Better internal coordination", "Reduced operational delays"],
  },
  {
    n: "03",
    title: "Finance & Invoice Approval Automation",
    body: "Automated invoice routing, expense approvals, payment tracking, and finance notifications aligned to organizational approval structures and operational controls.",
    image: useCase3,
    impacts: ["Faster financial approvals", "Reduced processing delays", "Improved financial visibility", "Better operational accountability"],
  },
  {
    n: "04",
    title: "Executive Reporting & Operational Dashboards",
    body: "Centralized reporting environments providing leadership teams with visibility into sales performance, workflow execution, finance operations, and organizational KPIs.",
    image: useCase4,
    impacts: ["Improved decision-making", "Real-time operational visibility", "Reduced manual reporting effort", "Better performance monitoring"],
  },
];

const audiences = [
  {
    icon: Users,
    role: "For Operations Teams",
    body: "Centralized workflows and process automation improve execution consistency and reduce operational bottlenecks across departments.",
  },
  {
    icon: TrendingUp,
    role: "For Sales Leadership",
    body: "CRM visibility and workflow automation improve pipeline management, customer follow-up consistency, and sales process governance.",
  },
  {
    icon: Wallet,
    role: "For Finance Teams",
    body: "Integrated financial workflows improve approval visibility, reporting accuracy, and operational accountability across finance operations.",
  },
  {
    icon: Crown,
    role: "For Business Leadership",
    body: "Connected operational systems improve scalability, visibility, decision-making, and organizational alignment across the business.",
  },
];

const faqs = [
  {
    q: "Can Zoho support our operational complexity?",
    a: "Yes — when the implementation is structured correctly. The limitation is rarely the platform itself. Most operational failures come from poor workflow architecture, disconnected process design, and weak adoption planning.",
  },
  {
    q: "Will this disrupt current operations?",
    a: "Not if deployment is phased correctly. SBS structures implementation priorities around operational continuity, validation checkpoints, and controlled rollout planning to reduce disruption during transition.",
  },
  {
    q: "Can you integrate Zoho with our existing systems?",
    a: "Yes. We regularly integrate Zoho environments with finance platforms, operational systems, communication tools, and external business applications to improve data continuity and process visibility.",
  },
  {
    q: "What happens after deployment?",
    a: "Post-launch support focuses on stabilization, optimization, adoption monitoring, and workflow refinement. Operational environments evolve, and your Zoho structure should evolve with them.",
  },
];

export default function Zoho() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Zoho implementation partner"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,11,24,0.85) 0%, rgba(7,20,43,0.7) 60%, rgba(5,11,24,0.95) 100%)",
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
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Zoho implementation built around your operations —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  not generic templates.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Talk to our team <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#process"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See how we work
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* OVERVIEW CHECKLIST */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <p className="text-lg leading-relaxed text-white/90 md:text-xl">
                When your CRM, finance, and ops tools don't talk to each other, your team fills the gaps manually. SBS rebuilds those workflows inside Zoho — designed around how your business actually operates, not how the platform defaults.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {heroChecks.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                  <p className="text-sm leading-relaxed text-white/80">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 border-t border-white/10 pt-8 sm:flex-row sm:justify-between">
            <p className="text-sm text-white/70">
              Trusted by growing organizations across healthcare, distribution, professional services, and enterprise operations.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/80">
                Zoho Partner status
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/80">
                Years of implementation experience
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="relative z-20 bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              The Problem
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>What breaks when systems</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                don't talk to each other.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {problems.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="process" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              How We Work
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Connected Zoho environments,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                designed for operational scale.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Our implementation capabilities extend beyond CRM configuration into operational architecture, automation, integrations, and business process enablement.
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
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--brand-blue)]">
                      {p.meta}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section
        className="relative px-6 py-24 md:px-12 md:py-32"
        style={{
          backgroundImage: `linear-gradient(rgba(10,14,26,0.92), rgba(10,14,26,0.96)), url(${patternBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              Enterprise Use Cases
            </p>
            <h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              How organizations use Zoho to centralize operations,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                automate workflows, and improve visibility.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70">
              Representative examples of operational improvements enabled through Zoho implementation and customization.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u) => (
              <motion.div
                key={u.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img src={u.image} alt={u.title} className="h-full w-full object-cover" loading="lazy" width={1024} height={1024} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {u.n}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-base font-bold text-white">{u.title}</h3>
                  <p className="mt-3 text-xs leading-relaxed text-white/70">{u.body}</p>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-[var(--brand-blue)]">
                    Business impact
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {u.impacts.map((i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-white/75">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--brand-blue)]" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS IMPACT */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Business Impact
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Zoho implementation is not just a software initiative.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                It's a business operations optimization framework.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Organizations rarely struggle because they lack applications. Zoho helps centralize operations within a connected, automated, and scalable business environment.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.role}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold" style={{ color: "var(--brand-dark)" }}>
                    {a.role}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* OBJECTIVE DARK */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span className="text-white">The objective is not to implement software for its own sake.</span>{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              It is to create a connected operational environment where workflows, approvals, reporting, customer management, and internal processes operate together with greater visibility, efficiency, and scalability.
            </span>
          </h2>
          <p className="mx-auto mt-10 max-w-2xl text-base leading-relaxed text-white/70">
            A 60-minute discovery session maps your current workflows, surfaces automation opportunities, and defines the right implementation approach — before any commitment is made.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Schedule a discovery session <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">
            Typically scheduled within 3 business days · No sales pitch, no lock-in
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              FAQ
            </p>
            <h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
              <span style={{ color: "var(--brand-dark)" }}>What enterprise buyers</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                usually ask.
              </span>
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-2xl border border-border bg-card p-6 md:p-7"
              >
                <h3 className="text-base font-bold md:text-lg" style={{ color: "var(--brand-dark)" }}>
                  {f.q}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
