import { motion } from "framer-motion";
import {
  ArrowRight,
  Warehouse,
  Boxes,
  PackageCheck,
  ShoppingCart,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon,
  Settings2,
  Workflow,
  Rocket,
  TrendingUp,
  RefreshCw,
  Eye,
  Network,
  ShieldCheck,
  Zap,
  Gauge,
  LineChart,
  Target,
  Radar,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/logistics/hero.jpg";
import traditionalFailImg from "@/assets/logistics/traditional-fail.jpg";
import p1 from "@/assets/logistics/p1.jpg";
import p2 from "@/assets/logistics/p2.jpg";
import p3 from "@/assets/logistics/p3.jpg";
import uc1 from "@/assets/logistics/uc1.jpg";
import uc2 from "@/assets/logistics/uc2.jpg";
import uc3 from "@/assets/logistics/uc3.jpg";
import uc4 from "@/assets/logistics/uc4.jpg";
import uc5 from "@/assets/logistics/uc5.jpg";

const problems = [
  {
    n: "01",
    label: "RISK",
    title: "Inventory Inconsistencies",
    body: "Stock levels differ across warehouses. Reports say one thing, shelves show another — and every mismatch becomes a delayed order or a lost sale.",
    image: p1,
  },
  {
    n: "02",
    label: "RISK",
    title: "Shipment Delays",
    body: "Dispatch, routing, and tracking live in separate tools. Poor coordination between teams turns predictable deliveries into daily firefighting.",
    image: p2,
  },
  {
    n: "03",
    label: "RISK",
    title: "Manual Movement Tracking",
    body: "Goods movement is logged on paper and re-entered later. Real-time stock visibility is impossible when data is always hours behind reality.",
    image: p3,
  },
];

const failures = [
  "Warehouse data is updated after movement, not during it",
  "Shipment tracking is external and disconnected",
  "Inventory is not synchronized across nodes",
  "No unified view of supply chain flow",
  "Distribution planning is static instead of dynamic",
];

const approach = [
  { icon: RefreshCw, text: "Real-time warehouse synchronization" },
  { icon: Eye, text: "Unified inventory visibility across locations" },
  { icon: Radar, text: "Automated stock movement tracking" },
  { icon: Network, text: "Demand-driven replenishment logic" },
  { icon: ShieldCheck, text: "Integrated procurement, warehousing & distribution" },
];

const capabilities = [
  {
    icon: Warehouse,
    title: "Warehouse Management",
    items: [
      "Multi-warehouse coordination",
      "Real-time stock updates",
      "Location-based inventory tracking",
    ],
  },
  {
    icon: Boxes,
    title: "Inventory Control",
    items: [
      "Centralized inventory visibility",
      "Automated stock adjustments",
      "Cycle counting support",
    ],
  },
  {
    icon: PackageCheck,
    title: "Order Fulfillment",
    items: [
      "End-to-end order tracking",
      "Automated picking and packing workflows",
      "Delivery status synchronization",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Procurement & Supply Planning",
    items: [
      "Demand-based purchasing",
      "Supplier coordination workflows",
      "Lead time optimization",
    ],
  },
  {
    icon: Truck,
    title: "Distribution Management",
    items: [
      "Dispatch scheduling",
      "Route coordination support",
      "Shipment tracking integration",
    ],
  },
];

const useCases = [
  {
    n: "01",
    title: "Multi-warehouse distribution networks",
    body: "Unified visibility and synchronized inventory across every warehouse, so stock decisions reflect the entire network — not one location.",
    image: uc1,
  },
  {
    n: "02",
    title: "High-volume order fulfillment operations",
    body: "Automated picking, packing, and dispatch workflows built to absorb spikes without breaking service levels.",
    image: uc2,
  },
  {
    n: "03",
    title: "Import/export supply chain coordination",
    body: "Coordinated procurement, customs, and inbound logistics so international movement is tracked as one continuous flow.",
    image: uc3,
  },
  {
    n: "04",
    title: "Retail distribution networks",
    body: "Store replenishment driven by real demand — connecting distribution centers, transport, and retail outlets in one system.",
    image: uc4,
  },
  {
    n: "05",
    title: "3PL logistics operations",
    body: "Client-segregated inventory, billing rules, and SLAs managed inside a single control tower purpose-built for third-party logistics.",
    image: uc5,
  },
];

const impact = [
  { icon: Eye, text: "Real-time visibility across all warehouses" },
  { icon: ShieldCheck, text: "Reduced stock discrepancies and losses" },
  { icon: Zap, text: "Faster order fulfillment cycles" },
  { icon: LineChart, text: "Improved supply chain predictability" },
  { icon: Gauge, text: "Lower operational overhead through automation" },
];

const implementation = [
  { icon: MapIcon, n: "01", title: "Supply chain mapping across nodes", body: "Document how goods, data, and decisions actually move across your warehouses, suppliers, and distribution points." },
  { icon: Warehouse, n: "02", title: "Warehouse structure design", body: "Model zones, bins, and locations that reflect real operations — not generic templates." },
  { icon: Settings2, n: "03", title: "Inventory system configuration", body: "Configure stock rules, replenishment triggers, and multi-location synchronization aligned to demand patterns." },
  { icon: Workflow, n: "04", title: "Integration with logistics operations", body: "Connect procurement, fulfillment, dispatch, and tracking into one live operational fabric." },
  { icon: TrendingUp, n: "05", title: "Optimization and scaling", body: "Refine workflows, expand automation, and scale the system as new locations, SKUs, and channels come online." },
];

export default function Logistics() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Logistics distribution hub" className="absolute inset-0 h-full w-full object-cover" />
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
                In logistics, delays are not just operational issues —{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  they are cost leakage points.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS builds ERP systems for logistics and distribution companies that need end-to-end visibility across warehouses, shipments, and inventory movement in real time.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Talk to a logistics ERP consultant <ArrowRight className="h-4 w-4" />
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
              Where Logistics Operations{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Lose Control.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Logistics complexity is rarely about transportation — it is about synchronization. Small inefficiencies compound into systemic delivery failure.
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
          <div className="flex items-center px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-xl">
              <h3 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
                Why Traditional ERP Systems Fail Logistics Companies
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Most ERP systems treat logistics as a reporting layer — not a real-time operational system:
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
                Logistics requires live operational orchestration, not record keeping.
              </p>
            </div>
          </div>

          <div className="relative h-80 min-h-full md:h-auto">
            <img
              src={traditionalFailImg}
              alt="Disconnected logistics systems"
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
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>SBS Logistics</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                ERP Approach.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              SBS builds logistics ERP systems that function as a live supply chain control tower.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              We focus on
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
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

          <div className="mt-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              The goal is simple
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-lg font-medium leading-relaxed text-foreground md:text-xl">
              every item is traceable, every movement is visible, every decision is data-driven.
            </p>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="capabilities" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              Core Logistics ERP Capabilities
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Everything a modern distribution network{" "}
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
              Logistics Use Cases We Solve
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Real distribution environments</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                we solve for.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                shipment after shipment.
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
              <span style={{ color: "var(--brand-dark)" }}>A structured logistics</span>{" "}
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">Why SBS for Logistics ERP</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            Built for movement,{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              not static data.
            </span>
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              "Strong focus on real-time operational systems",
              "Ability to unify fragmented warehouse environments",
              "Deep experience in multi-location distribution logic",
              "ERP architecture designed for movement, not static data",
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
            Build a logistics system that{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              moves as fast as your operations.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            If your logistics decisions rely on delayed reports or disconnected systems, your supply chain is operating blind. SBS builds ERP systems that bring real-time clarity to every movement in your network.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request a logistics ERP consultation <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
