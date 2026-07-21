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
  Plus,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { useZohoContent } from "@/lib/zohoContent";

const ICONS: Record<string, LucideIcon> = {
  Database, Mail, BarChart3, TrendingUp, ScanSearch, Layers, Workflow, Rocket, ShieldCheck, Users, Wallet, Cpu, Crown,
};

export default function Zoho() {
  const c = useZohoContent();
  const v = c._visible;

  return (
    <>
      {v.Hero && (
        <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
          <div className="absolute inset-0">
            <video
              src={c.Hero.mediaUrl}
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
                className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
              >
                <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                  {c.Hero.headline}{" "}
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                    {c.Hero.headlineAccent}
                  </span>
                </h1>

                <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                  <a
                    href={c.Hero.ctaHref}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    {c.Hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={c.Hero.ctaHref2}
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                  >
                    {c.Hero.ctaLabel2}
                  </a>
                </div>
              </motion.div>
            </section>
          </div>
        </main>
      )}

      {v.Introduction && (
        <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="mx-auto max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                {c.Introduction.headline}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c.Introduction.headlineAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {c.Introduction.body}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {c.Introduction.bullets.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                  <p className="text-sm leading-relaxed text-white/80">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-sm text-white/60">{c.Introduction.footnote}</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {c.Introduction.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-white/80">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["The Problem"] && (
        <section className="relative z-20 bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["The Problem"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["The Problem"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["The Problem"].headingAccent}
                </span>
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {c["The Problem"].items.map((p) => {
                const Icon = ICONS[p.icon] ?? Database;
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
      )}

      {v["How We Work"] && (
        <section id="process" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                {c["How We Work"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {c["How We Work"].heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["How We Work"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
                {c["How We Work"].body}
              </p>
            </div>

            <div className="mt-14 space-y-5">
              {c["How We Work"].items.map((p, idx) => {
                const Icon = ICONS[p.icon] ?? Workflow;
                return (
                  <motion.div
                    key={p.n}
                    initial={{ opacity: 0, x: (idx % 2 === 0 ? -20 : 20) * (typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? -1 : 1) }}
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
      )}

      {v["Use Cases"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                {c["Use Cases"].eyebrow}
              </p>
              <h2 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {c["Use Cases"].heading}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["Use Cases"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
                {c["Use Cases"].body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {c["Use Cases"].items.map((u) => (
                <motion.div
                  key={u.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={u.image}
                      alt={u.title}
                      loading="lazy"
                      width={1024}
                      height={640}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>
                        {u.n}
                      </span>
                      <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                        {u.title}
                      </h3>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{u.body}</p>
                    <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-blue)]">
                      {u.impacts.join(" · ")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {v["Business Impact"] && (
        <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                {c["Business Impact"].eyebrow}
              </p>
              <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
                <span style={{ color: "var(--brand-dark)" }}>{c["Business Impact"].heading}</span>{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {c["Business Impact"].headingAccent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {c["Business Impact"].body}
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {c["Business Impact"].items.map((a) => {
                const Icon = ICONS[a.icon] ?? Users;
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
      )}

      {v.Objective && (
        <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
              <span className="text-white">{c.Objective.headline}</span>
            </h2>
            <p className="mx-auto mt-8 max-w-4xl text-2xl font-bold leading-[1.25] tracking-tight md:text-3xl lg:text-4xl">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {c.Objective.headlineAccent}
              </span>
            </p>
            <p className="mx-auto mt-10 max-w-3xl text-base leading-relaxed text-white/70">
              {c.Objective.body}
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href={c.Objective.ctaHref}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                style={{ background: "var(--gradient-brand)" }}
              >
                {c.Objective.ctaLabel} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-xs text-white/50">{c.Objective.footnote}</p>
          </div>
        </section>
      )}

      {v.FAQ && (
        <section className="relative bg-[#eff7fb] px-6 py-24 md:px-12 md:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-blue)]/20 bg-white px-5 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-[var(--brand-blue)]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-blue)]">FAQ</span>
              </div>
              <h2 className="mt-8 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl" style={{ color: "var(--brand-dark)" }}>
                {c.FAQ.heading}
              </h2>
            </div>

            <Accordion type="single" collapsible className="mt-12 space-y-4">
              {c.FAQ.items.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${i}`}
                  className="overflow-hidden rounded-2xl border border-[var(--brand-blue)]/10 bg-white shadow-sm transition-shadow data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="group px-6 py-5 hover:no-underline md:px-8 md:py-6 [&>svg]:hidden">
                    <div className="flex flex-1 items-center gap-4 text-start">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                      <span className="text-base font-bold md:text-lg" style={{ color: "var(--brand-dark)" }}>
                        {f.q}
                      </span>
                    </div>
                    <span className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition-transform group-data-[state=open]:rotate-45">
                      <Plus className="h-4 w-4" />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 md:px-8 md:pb-7">
                    <div className="ps-9 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      <CtaSection />
      <Footer />
    </>
  );
}
