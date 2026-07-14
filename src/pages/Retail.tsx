import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
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
import traditionalFailImg from "@/assets/retail/traditional-fail.jpg";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/retail/hero.jpg";
import p1 from "@/assets/retail/problem-p1.jpg";
import p2 from "@/assets/retail/problem-p2.jpg";
import p3 from "@/assets/retail/problem-p3.jpg";
import uc1 from "@/assets/retail/uc-1.jpg";
import uc2 from "@/assets/retail/uc-2.jpg";
import uc3 from "@/assets/retail/uc-3.jpg";
import uc4 from "@/assets/retail/uc-4.jpg";

const problems = [
  {
    n: "01",
    label: "RISK",
    title: "Disconnected Channels",
    body: "Stores, online storefronts, and marketplaces run on separate stock and pricing rules. Customers see one price online, another in store, and out-of-stock messages that don't reflect reality.",
    image: p1,
  },
  {
    n: "02",
    label: "RISK",
    title: "Manual Fulfilment",
    body: "Orders are re-keyed between webshop, POS, and warehouse. Missed SLAs, wrong picks, and refunds pile up because no single system owns the order lifecycle end to end.",
    image: p2,
  },
  {
    n: "03",
    label: "RISK",
    title: "Invisible Margins",
    body: "Margin is calculated after the season, not per order. Promotions, returns, and marketplace fees eat into profit long before finance sees the number.",
    image: p3,
  },
];

const failures = [
  "POS, e-commerce, and warehouse operate in silos",
  "No live connection between demand and replenishment",
  "Marketplace and channel data is not captured in real time",
  "Pricing and promotions are static instead of dynamic",
  "Merchandising is disconnected from execution",
];

const approach = [
  { icon: Cpu, text: "Commerce-first system architecture" },
  { icon: RefreshCw, text: "Real-time stock and pricing synchronization" },
  { icon: DollarSign, text: "Margin-aware promotion workflows" },
  { icon: Network, text: "End-to-end traceability across every order" },
  { icon: ShieldCheck, text: "Integration between commerce, warehouse, and finance" },
];

const capabilities = [
  {
    icon: ShoppingBag,
    title: "Omnichannel Order Management",
    items: [
      "Unified order lifecycle across web, POS, and marketplaces",
      "Buy online, pick up in store and ship-from-store",
      "Split shipments and partial fulfilment",
    ],
  },
  {
    icon: Layers,
    title: "Product & Catalog Management",
    items: [
      "Central product master with variants",
      "Channel-specific enrichment and pricing",
      "Bundles, kits, and configurable products",
    ],
  },
  {
    icon: Boxes,
    title: "Inventory & Replenishment",
    items: [
      "Live stock across stores and warehouses",
      "Automated reorder and transfer rules",
      "Safety stock aware of channel demand",
    ],
  },
  {
    icon: Activity,
    title: "POS & Store Operations",
    items: [
      "Fast, offline-tolerant point of sale",
      "Store-level performance visibility",
      "Cashier, shift, and cash reconciliation",
    ],
  },
  {
    icon: Calculator,
    title: "Pricing, Promotions & Finance",
    items: [
      "Real-time margin per order and channel",
      "Loyalty, coupons, and dynamic promotions",
      "Marketplace fee and payout reconciliation",
    ],
  },
];

const useCases = [
  {
    n: "01",
    title: "Omnichannel retailers with store and online demand",
    body: "Unified inventory, pricing, and order orchestration so store and online demand are served from one operational model — with no oversell and no stranded stock.",
    image: uc1,
  },
  {
    n: "02",
    title: "Multi-store chains across regions",
    body: "Central catalog and pricing, local store execution, and consolidated reporting across regions with role-based visibility for HQ, area, and store managers.",
    image: uc2,
  },
  {
    n: "03",
    title: "Pure-play e-commerce and marketplace sellers",
    body: "High-volume fulfilment with automated picking, packing, and courier assignment — plus marketplace listing, order, and payout reconciliation built in.",
    image: uc3,
  },
  {
    n: "04",
    title: "Loyalty-driven brands with personalized offers",
    body: "Unified customer profile across channels, segmentation, and personalized promotions tied directly to margin-aware pricing at the point of sale.",
    image: uc4,
  },
];

const impact = [
  { icon: Zap, text: "Fewer stockouts through real-time replenishment" },
  { icon: Recycle, text: "Lower returns via accurate stock and order data" },
  { icon: LineChart, text: "Accurate margin per order, channel, and store" },
  { icon: Eye, text: "Live visibility across every store and warehouse" },
  { icon: Target, text: "Better demand-to-fulfilment alignment" },
];

const implementation = [
  { icon: ScanSearch, n: "01", title: "Commerce process mapping", body: "Document existing channel flows, order paths, and operational gaps before configuring anything." },
  { icon: Settings2, n: "02", title: "Catalog and workflow structuring", body: "Design product master, pricing rules, and fulfilment routes aligned with how commerce actually runs." },
  { icon: Workflow, n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with POS, e-commerce platforms, marketplaces, and finance." },
  { icon: Rocket, n: "04", title: "Store and warehouse enablement", body: "Train cashiers, store managers, and fulfilment staff on the new workflows with hands-on operational readiness checks." },
  { icon: TrendingUp, n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new channels, stores, and categories." },
];

export default function Retail() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Modern omnichannel retail store" className="absolute inset-0 h-full w-full object-cover" />
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
                Retail & E-commerce ERP that runs on{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  real commerce reality.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS delivers a retail and e-commerce ERP that unifies stores, online, and marketplaces into a single operational model — so decisions are based on live commerce data, not disconnected reports.
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
              A Disconnected Storefront Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Leaking Storefront.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Most retailers don't struggle with selling — they struggle with coordination. The result is not inefficiency; it is lost customers, lost stock, and lost margin.
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
                Where Traditional Systems Fail Retail and E-commerce Companies
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Generic ERP systems typically fail because they do not reflect how modern commerce actually works:
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
                Retail requires continuous synchronization between demand, stock, and fulfilment — not periodic reporting.
              </p>
            </div>
          </div>

          <div className="relative h-80 min-h-full md:h-auto">
            <img
              src={traditionalFailImg}
              alt="Disconnected retail systems"
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
              SBS Retail & E-commerce ERP Approach
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Designed around your commerce reality —</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                not generic templates.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              This is not ERP implementation. It is commerce process reconstruction inside ERP.
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
              Everything a modern retailer{" "}
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
              Retail Use Cases
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Real commerce environments</span>{" "}
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
            Also serving margin-sensitive commerce environments where profitability depends on accurate, real-time pricing and stock.
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
                order after order.
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
              <span style={{ color: "var(--brand-dark)" }}>A structured retail</span>{" "}
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
              "Industry-aligned commerce architecture approach",
              "Strong integration across channels and finance layers",
              "Custom workflow capability for complex retail environments",
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
            Build a retail system that{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              matches your commerce reality.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            If your commerce depends on spreadsheets, delayed stock updates, or disconnected channels — it is not a system. It is fragmentation. SBS helps you rebuild retail control inside a unified ERP environment.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request a retail ERP assessment <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
