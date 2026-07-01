import { motion } from "framer-motion";
import {
  ArrowRight,
  Factory,
  Layers,
  Boxes,
  Activity,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  ScanSearch,
  Settings2,
  Workflow,
  Rocket,
  TrendingUp,
  Cpu,
  RefreshCw,
  DollarSign,
  Network,
  ShieldCheck,
  Zap,
  Recycle,
  LineChart,
  Eye,
  Target,
} from "lucide-react";
import traditionalFailImg from "@/assets/manufacturing/traditional-fail.jpg";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/manufacturing/hero.jpg";
import p1 from "@/assets/manufacturing/problem-p1.jpg";
import p2 from "@/assets/manufacturing/problem-p2.jpg";
import p3 from "@/assets/manufacturing/problem-p3.jpg";
import uc1 from "@/assets/manufacturing/uc-1.jpg";
import uc2 from "@/assets/manufacturing/uc-2.jpg";
import uc3 from "@/assets/manufacturing/uc-3.jpg";
import uc4 from "@/assets/manufacturing/uc-4.jpg";

const problems = [
  {
    n: "01",
    label: "RISK",
    title: "Disconnected Planning",
    body: "Production plans change without inventory visibility. Raw materials arrive too late or overstocked, and procurement never sees what production actually needs.",
    image: p1,
  },
  {
    n: "02",
    label: "RISK",
    title: "Manual Work Orders",
    body: "Work orders are managed manually across departments. BOM changes are not reflected in real time, so engineering updates never reach the shop floor.",
    image: p2,
  },
  {
    n: "03",
    label: "RISK",
    title: "Invisible Costing",
    body: "Costing is calculated after production, not during it. No live view of shop floor performance means decisions are made on delayed, incomplete reports.",
    image: p3,
  },
];

const failures = [
  "Production, procurement, and warehouse operate in silos",
  "No live connection between demand and material planning",
  "Shop floor data is not captured in real time",
  "Costing is static instead of dynamic",
  "Planning is disconnected from execution",
];

const approach = [
  { icon: Cpu, text: "Production-first system architecture" },
  { icon: RefreshCw, text: "Real-time material and inventory synchronization" },
  { icon: DollarSign, text: "Cost-aware manufacturing workflows" },
  { icon: Network, text: "End-to-end traceability across production cycles" },
  { icon: ShieldCheck, text: "Integration between planning, execution, and finance" },
];

const capabilities = [
  {
    icon: Factory,
    title: "Production Management",
    items: [
      "Work order lifecycle management",
      "Multi-stage production tracking",
      "Capacity-aware scheduling",
    ],
  },
  {
    icon: Layers,
    title: "Bill of Materials (BOM)",
    items: [
      "Multi-level BOM structures",
      "Version control for engineering changes",
      "Costed BOM visibility",
    ],
  },
  {
    icon: Boxes,
    title: "Inventory & Material Planning",
    items: [
      "Raw material forecasting",
      "Automated replenishment triggers",
      "Multi-warehouse synchronization",
    ],
  },
  {
    icon: Activity,
    title: "Shop Floor Control",
    items: [
      "Production progress tracking",
      "Workstation performance visibility",
      "Delay and bottleneck identification",
    ],
  },
  {
    icon: Calculator,
    title: "Costing & Finance Integration",
    items: [
      "Real-time production cost calculation",
      "Labor and material cost tracking",
      "Profitability per batch or order",
    ],
  },
];

const useCases = [
  {
    n: "01",
    title: "High-volume production with fluctuating demand",
    body: "Synchronized demand planning, material readiness, and capacity scheduling to absorb volume variability without overstock or delays.",
    image: uc1,
  },
  {
    n: "02",
    title: "Multi-warehouse manufacturing operations",
    body: "Unified material visibility, inter-warehouse transfers, and live inventory positioning across multiple production and storage sites.",
    image: uc2,
  },
  {
    n: "03",
    title: "Batch production with strict traceability",
    body: "Lot-controlled production with end-to-end traceability across raw materials, in-process operations, and finished goods.",
    image: uc3,
  },
  {
    n: "04",
    title: "Custom manufacturing with frequent BOM changes",
    body: "Version-controlled BOMs with engineering change management built into the production and costing workflow.",
    image: uc4,
  },
];

const impact = [
  { icon: Zap, text: "Reduced production delays through real-time planning" },
  { icon: Recycle, text: "Improved material utilization and reduced waste" },
  { icon: LineChart, text: "Accurate cost tracking per production cycle" },
  { icon: Eye, text: "Increased shop floor visibility and accountability" },
  { icon: Target, text: "Better demand-to-production alignment" },
];

const implementation = [
  { icon: ScanSearch, n: "01", title: "Production process mapping", body: "Document existing production flows, dependencies, and operational gaps before configuring anything." },
  { icon: Settings2, n: "02", title: "BOM and workflow structuring", body: "Design multi-level BOMs, work order routes, and approval flows aligned with how production actually runs." },
  { icon: Workflow, n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with finance, procurement, and shop floor data sources." },
  { icon: Rocket, n: "04", title: "Shop floor enablement", body: "Train operators, supervisors, and planners on the new workflows with hands-on operational readiness checks." },
  { icon: TrendingUp, n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new production cells and product lines." },
];

export default function Manufacturing() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Smart manufacturing floor" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,11,24,0.82) 0%, rgba(7,20,43,0.7) 60%, rgba(5,11,24,0.95) 100%)",
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
                Manufacturing ERP that runs on{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  real production reality.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS delivers a manufacturing ERP that aligns your entire production lifecycle into a single operational model — so decisions are based on real-time production reality, not delayed reports.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Talk to an ERP consultant <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#capabilities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Explore capabilities
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* THE PROBLEM */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> THE PROBLEM
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              A Disconnected Factory Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Dangerous Factory.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Most manufacturers don't struggle with production itself — they struggle with coordination. The result is not inefficiency; it is loss of production control.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {problems.map((p) => (
              <div
                key={p.n}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">
                    {p.n} — {p.label}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHERE TRADITIONAL SYSTEMS FAIL */}
      <section className="relative bg-background">
        <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-2">
          {/* Text */}
          <div className="flex items-center px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-xl">
              <h3 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
                Where Traditional Systems Fail Manufacturing Companies
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Generic ERP systems typically fail because they do not reflect how manufacturing actually works:
              </p>
              <ul className="mt-6 space-y-3">
                {failures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: "var(--brand-blue)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Manufacturing requires continuous synchronization between planning and execution—not periodic reporting.
              </p>
            </div>
          </div>

          {/* Image — full height */}
          <div className="relative h-80 min-h-full md:h-auto">
            <img
              src={traditionalFailImg}
              alt="Disconnected manufacturing systems"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SBS APPROACH */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              SBS Manufacturing ERP Approach
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Designed around your production reality —</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                not generic templates.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              This is not ERP implementation. It is manufacturing process reconstruction inside ERP.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {approach.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-foreground/85">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* CORE CAPABILITIES */}
      <section id="capabilities" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              Core Capabilities
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Everything a modern factory{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                needs to operate in sync.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight text-white">{c.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {c.items.map((i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                        {i}
                      </li>
                    ))}
                  </ul>
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
              Manufacturing Use Cases
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Real production environments</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                we solve for.
              </span>
            </h2>
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
                    alt={u.title}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>{u.n}</span>
                    <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                      {u.title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">
            Also serving cost-sensitive production environments where margin discipline depends on accurate, real-time costing.
          </p>
        </div>
      </section>

      {/* BUSINESS IMPACT */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">Business Impact</p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Measurable outcomes,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                cycle after cycle.
              </span>
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impact.map((i) => {
              const Icon = i.icon;
              return (
                <div
                  key={i.text}
                  className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-7"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-base leading-relaxed text-white/85">{i.text}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* IMPLEMENTATION APPROACH */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Implementation Approach
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>A structured manufacturing</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                ERP rollout.
              </span>
            </h2>
          </div>

          <div className="mt-14 space-y-5">
            {implementation.map((p, idx) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-[120px_56px_1fr] md:items-start md:p-8"
                >
                  <div className="text-5xl font-bold text-foreground/15 md:text-6xl">{p.n}</div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold md:text-2xl" style={{ color: "var(--brand-dark)" }}>{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY SBS */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">Why SBS</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            Operational design first,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              software setup second.
            </span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              "Deep focus on operational design, not just software setup",
              "Industry-aligned ERP architecture approach",
              "Strong integration across production and finance layers",
              "Custom workflow capability for complex manufacturing environments",
            ].map((w) => (
              <div key={w} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                <p className="text-sm leading-relaxed text-white/85">{w}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="absolute inset-0 opacity-30">
          <img src={heroImg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0a0e1a]/80" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Build a manufacturing system that{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              matches your production reality.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            If your production system depends on spreadsheets, delayed updates, or disconnected planning tools — it is not a system. It is fragmentation. SBS helps you rebuild manufacturing control inside a unified ERP environment.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request a manufacturing ERP assessment <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
