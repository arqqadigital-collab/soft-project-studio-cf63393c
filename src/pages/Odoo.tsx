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
  type LucideIcon,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { ScrollRevealText } from "@/components/ScrollRevealText";
import { useOdooContent } from "@/lib/odooContent";

const ICONS: Record<string, LucideIcon> = {
  Layers, Workflow, Network, BarChart3, Wrench, DatabaseZap,
  ShieldCheck, Code2, CheckCircle2, Rocket, Wallet, Cpu, Crown, Users, ScanSearch,
};

export default function Odoo() {
  const c = useOdooContent();
  const hero = c.Hero;
  const intro = c.Introduction;
  const build = c["What We Build"];
  const process = c["Development Process"];
  const useCases = c["Use Cases"];
  const eighty = c["80/20 Statement"];
  const audiences = c["Who We Serve"];
  const objective = c["ERP Objective"];
  const discovery = c["Discovery Session"];
  const v = c._visible;

  return (
    <>
      {v.Hero && (
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <video
            src={hero.mediaUrl}
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
              className="mx-auto flex w-full max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                {hero.headline}{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  {hero.headlineAccent}
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href={hero.ctaHref}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {hero.ctaLabel} <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={hero.ctaHref2}
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {hero.ctaLabel2}
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
              {intro.headline}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {intro.headlineAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              {intro.body}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {intro.bullets.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--brand-blue)]" />
                <p className="text-sm leading-relaxed text-white/80">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center">
            <p className="text-sm text-white/60">{intro.footnote}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {intro.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm font-semibold text-white/80">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>
      )}

      {v["What We Build"] && (
      <section id="services" className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {build.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{build.heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {build.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {build.body}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {build.items.map((s) => {
              const Icon = ICONS[s.icon] ?? Layers;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-brand)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.chips.map((cc) => (
                      <span key={cc} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground/80">
                        {cc}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {v["Development Process"] && (
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              {process.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              {process.heading}{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {process.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              {process.body}
            </p>
          </div>

          <div className="mt-14 space-y-5">
            {process.items.map((p, idx) => {
              const Icon = ICONS[p.icon] ?? ScanSearch;
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
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
      )}

      {v["Use Cases"] && (
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {useCases.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{useCases.heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {useCases.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {useCases.body}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.items.map((u) => (
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
                    <span className="text-2xl font-bold" style={{ color: "var(--brand-blue)" }}>{u.n}</span>
                    <h3 className="text-base font-bold leading-tight" style={{ color: "var(--brand-dark)" }}>{u.title}</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{u.body}</p>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-wider text-[var(--brand-blue)]">{u.modules}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {v["80/20 Statement"] && (
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <img
          src={eighty.backgroundUrl}
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
            {eighty.headline}{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              {eighty.headlineAccent}
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">{eighty.body1}</p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">{eighty.body2}</p>
        </div>
      </section>
      )}

      {v["Who We Serve"] && (
      <section className="relative bg-[#f6f7fb] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {audiences.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{audiences.heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {audiences.headingAccent}
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {audiences.body}
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {audiences.items.map((a) => {
              const Icon = ICONS[a.icon] ?? Users;
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold" style={{ color: "var(--brand-dark)" }}>{a.role}</h3>
                  </div>
                  <p className="mt-4 text-sm font-semibold" style={{ color: "var(--brand-blue)" }}>{a.headline}</p>
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
      )}

      {v["ERP Objective"] && (
      <section className="relative overflow-hidden bg-[#0a0e1a] px-6 py-32 md:px-12 md:py-48">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0d1322] to-[#0a0e1a]" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <ScrollRevealText
            className="text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl"
            segments={[
              { text: `${objective.text1} ` },
              { text: objective.text2, gradient: true },
            ]}
          />
        </div>
      </section>
      )}

      {v["Discovery Session"] && (
      <section id="contact" className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              {discovery.eyebrow}
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>{discovery.heading}</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                {discovery.headingAccent}
              </span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              {discovery.body}
            </p>
            <a
              href={discovery.ctaHref}
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold sm:px-8 sm:py-4 text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              {discovery.ctaLabel} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <ul className="space-y-3 rounded-2xl border border-border bg-card p-7">
            {discovery.items.map((it) => (
              <li key={it} className="flex items-start gap-3 text-sm font-medium text-foreground">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ background: "var(--gradient-brand)" }}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                {it}
              </li>
            ))}
          </ul>
        </div>
      </section>
      )}

      <div id="cta">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
