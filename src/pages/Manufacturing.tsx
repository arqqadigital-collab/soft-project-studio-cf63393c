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
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useManufacturingContent } from "@/lib/manufacturingContent";

const ICONS: Record<string, LucideIcon> = {
  Factory, Layers, Boxes, Activity, Calculator, ScanSearch, Settings2, Workflow, Rocket, TrendingUp,
  Cpu, RefreshCw, DollarSign, Network, ShieldCheck, Zap, Recycle, LineChart, Eye, Target,
};
const Ico = ({ name, className }: { name?: string; className?: string }) => {
  const C = (name && ICONS[name]) || Factory;
  return <C className={className} />;
};

export default function Manufacturing() {
  const c = useManufacturingContent();
  const v = c._visible;

  return (
    <>
      {v.Hero && (
        <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
          <div className="absolute inset-0">
            <img src={c.Hero.image} alt="Smart manufacturing floor" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(5,11,24,0.82) 0%, rgba(7,20,43,0.7) 60%, rgba(5,11,24,0.95) 100%)" }} />
          </div>
          <div className="relative z-10 flex min-h-[90vh] flex-col">
            <section className="flex flex-1 items-center justify-center px-6 pb-16 pt-4 md:px-12">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
                <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {c.Hero.headline}{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Hero.headlineAccent}</span>
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">{c.Hero.body}</p>
                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                  <a href={c.Hero.ctaHref} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                    {c.Hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a href={c.Hero.ctaHref2} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15">
                    {c.Hero.ctaLabel2}
                  </a>
                </div>
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v["The Problem"] && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
                <AlertTriangle className="h-3.5 w-3.5" /> {c["The Problem"].eyebrow}
              </span>
              <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                {c["The Problem"].heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["The Problem"].headingAccent}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">{c["The Problem"].body}</p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
              {c["The Problem"].items.map((p: any) => (
                <div key={p.n} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/20">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-400">{p.n} — {p.label}</p>
                    <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Traditional Fail"] && (
        <section className="relative bg-background">
          <div className="grid min-h-[600px] grid-cols-1 md:grid-cols-2">
            <div className="flex items-center px-6 py-20 md:px-12 md:py-28">
              <div className="mx-auto max-w-xl">
                <h3 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">{c["Traditional Fail"].heading}</h3>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c["Traditional Fail"].body}</p>
                <ul className="mt-6 space-y-3">
                  {c["Traditional Fail"].bullets.map((f: string) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: "var(--brand-blue)" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">{c["Traditional Fail"].footnote}</p>
              </div>
            </div>
            <div className="relative h-80 min-h-full md:h-auto">
              <img src={c["Traditional Fail"].image} alt="Disconnected manufacturing systems" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>
        </section>
      )}

      {v.Approach && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.Approach.eyebrow}</p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c.Approach.heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Approach.headingAccent}</span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">{c.Approach.body}</p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {c.Approach.items.map((item: any) => (
                <div key={item.text} className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                    <Ico name={item.icon} className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-foreground/85">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v.Capabilities && (
        <section id="capabilities" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">{c.Capabilities.eyebrow}</p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {c.Capabilities.heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Capabilities.headingAccent}</span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c.Capabilities.items.map((cap: any) => (
                <motion.div key={cap.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                    <Ico name={cap.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight text-white">{cap.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {cap.items.map((i: string) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Use Cases"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c["Use Cases"].eyebrow}</p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["Use Cases"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["Use Cases"].headingAccent}</span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c["Use Cases"].items.map((u: any) => (
                <motion.div key={u.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5 }} className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={u.image} alt={u.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>{u.n}</span>
                      <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>{u.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-muted-foreground">{c["Use Cases"].footnote}</p>
          </div>
        </section>
      )}

      {v["Business Impact"] && (
        <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">{c["Business Impact"].eyebrow}</p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {c["Business Impact"].heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["Business Impact"].headingAccent}</span>
              </h2>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {c["Business Impact"].items.map((i: any) => (
                <div key={i.text} className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                    <Ico name={i.icon} className="h-6 w-6" />
                  </div>
                  <p className="text-base leading-relaxed text-white/85">{i.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v.Implementation && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.Implementation.eyebrow}</p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c.Implementation.heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.Implementation.headingAccent}</span>
              </h2>
            </div>
            <div className="mt-14 space-y-5">
              {c.Implementation.items.map((p: any, idx: number) => (
                <motion.div key={p.n} initial={{ opacity: 0, x: (idx % 2 === 0 ? -20 : 20) * (typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? -1 : 1) }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-[120px_56px_1fr] md:items-start md:p-8">
                  <div className="text-5xl font-bold text-foreground/15 md:text-6xl">{p.n}</div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                    <Ico name={p.icon} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold md:text-2xl" style={{ color: "var(--brand-dark)" }}>{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Why SBS"] && (
        <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">{c["Why SBS"].eyebrow}</p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {c["Why SBS"].heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["Why SBS"].headingAccent}</span>
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
              {c["Why SBS"].bullets.map((w: string) => (
                <div key={w} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-start">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                  <p className="text-sm leading-relaxed text-white/85">{w}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Final CTA"] && (
        <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="absolute inset-0 opacity-30">
            <img src={c["Final CTA"].image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[#0a0e1a]/80" />
          </div>
          <div className="relative mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {c["Final CTA"].headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c["Final CTA"].headlineAccent}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{c["Final CTA"].body}</p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={c["Final CTA"].ctaHref} className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105" style={{ background: "var(--gradient-brand)" }}>
                {c["Final CTA"].ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
