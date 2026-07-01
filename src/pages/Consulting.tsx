import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Lightbulb,
  Compass,
  Ear,
  Brain,
  DraftingCompass,
  Handshake,
  Map,
  Rocket,
  Building2,
  ClipboardCheck,
  ListChecks,
  GitBranch,
  Workflow,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Users,
  Layers,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/consulting/hero.jpg";
import s1 from "@/assets/consulting/s1.jpg";
import s2 from "@/assets/consulting/s2.jpg";
import s3 from "@/assets/consulting/s3.jpg";
import s4 from "@/assets/consulting/s4.jpg";
import s5 from "@/assets/consulting/s5.jpg";
import s6 from "@/assets/consulting/s6.jpg";
import s7 from "@/assets/consulting/s7.jpg";
import ctaBg from "@/assets/consulting/cta.jpg";

const problems = [
  "Your IT roadmap doesn't connect to business priorities",
  "Decisions are made reactively rather than strategically",
  "Digital transformation initiatives stall or lose momentum",
  "You have too many systems that don't integrate or scale well",
  "Projects run over budget and past deadline — repeatedly",
  "Compliance obligations create confusion rather than clarity",
];

const principles = [
  { n: "01", label: "LISTEN FIRST", icon: Ear, body: "Every engagement begins with genuine discovery. We invest time understanding your business model, your competitive context, your internal challenges, and what success actually looks like for your leadership team." },
  { n: "02", label: "THINK INDEPENDENTLY", icon: Brain, body: "We have no vendor affiliations, no hidden commercial interests, and no preferred solutions to push. Our recommendations are driven entirely by your needs. That independence is what makes our advice trustworthy." },
  { n: "03", label: "DESIGN FOR REALITY", icon: DraftingCompass, body: "Strategies that can't be executed are worthless. We design recommendations around your actual budget, team capacity, risk appetite, and organizational culture — not an idealized version of your company." },
  { n: "04", label: "STAY THROUGH EXECUTION", icon: Handshake, body: "We don't hand over a document and disappear. SBS consultants stay engaged through implementation, adoption, and optimization — ensuring that the strategy we design is the strategy that gets delivered." },
];

const services = [
  {
    n: "01",
    icon: Map,
    title: "IT Strategy & Technology Roadmap Development",
    tagline: "Build a clear, prioritized path forward.",
    body: "Many organizations operate without a coherent IT strategy — responding to immediate needs rather than building toward a long-term vision. SBS helps you define where you want to go, what it will take to get there, and how to sequence your investments for maximum impact.",
    bullets: [
      "Current-state assessment of your IT landscape and capabilities",
      "Future-state vision aligned with business strategy",
      "Multi-year technology roadmap with prioritized initiatives",
      "Business case development for key investments",
      "Executive presentation and stakeholder alignment support",
    ],
    image: s1,
  },
  {
    n: "02",
    icon: Rocket,
    title: "Digital Transformation Advisory",
    tagline: "Transform intelligently — not just rapidly.",
    body: "Digital transformation is one of the most overused and least understood terms in business today. SBS cuts through the noise with a structured, people-centered transformation approach that addresses technology, process, and organizational change together.",
    bullets: [
      "Digital maturity assessment and benchmarking",
      "Transformation strategy and phased execution plan",
      "Change management framework and communication planning",
      "Technology enablement recommendations",
      "Executive sponsorship and governance model design",
    ],
    image: s2,
  },
  {
    n: "03",
    icon: Building2,
    title: "Enterprise Architecture Consulting",
    tagline: "Build an architecture that scales with your ambitions.",
    body: "An organization's enterprise architecture is the foundation on which all technology decisions rest. Poor architecture leads to technical debt, integration failures, and systems that constrain rather than enable growth. SBS architects design future-ready, scalable, and secure enterprise architectures aligned with your strategic objectives.",
    bullets: [
      "Business, application, data, and technology architecture design",
      "Architecture assessment and gap analysis",
      "Reference architecture and standards development",
      "Integration architecture design",
      "Architecture governance framework",
    ],
    image: s3,
  },
  {
    n: "04",
    icon: ClipboardCheck,
    title: "Technology Assessment & Vendor Selection",
    tagline: "Choose the right technology with confidence.",
    body: "With thousands of technology vendors competing for your attention, making the wrong choice is easy. SBS provides an objective, structured evaluation process that cuts through vendor noise and identifies the solution that genuinely fits your requirements.",
    bullets: [
      "Requirements gathering and functional specification development",
      "Market scan and vendor longlist/shortlist development",
      "RFP/RFI development and management",
      "Vendor evaluation scorecards and demos facilitation",
      "Final recommendation with detailed rationale",
    ],
    image: s4,
  },
  {
    n: "05",
    icon: ListChecks,
    title: "Project Management Office (PMO) & Governance",
    tagline: "Bring discipline and accountability to your technology programs.",
    body: "Technology programs fail most often due to poor governance — unclear accountability, inadequate risk management, and insufficient executive visibility. SBS establishes or strengthens your PMO to ensure every initiative is delivered with discipline and transparency.",
    bullets: [
      "PMO setup and operating model design",
      "Project governance frameworks and escalation paths",
      "Portfolio, program, and project management methodology",
      "Reporting dashboards and executive status updates",
      "Risk and issue management processes",
    ],
    image: s5,
  },
  {
    n: "06",
    icon: Workflow,
    title: "Business Process Optimization",
    tagline: "Eliminate waste. Unlock productivity.",
    body: "Many organizations carry significant operational inefficiency that silently drains resources and limits growth. SBS maps, analyzes, and redesigns your business processes to eliminate bottlenecks, reduce manual effort, and create the operational foundation for scalable growth.",
    bullets: [
      "Current-state process mapping and analysis",
      "Bottleneck and waste identification",
      "Future-state process design",
      "Automation opportunity assessment",
      "Implementation planning and change management support",
    ],
    image: s6,
  },
  {
    n: "07",
    icon: ShieldCheck,
    title: "Compliance & Risk Management Consulting",
    tagline: "Know your obligations. Manage your exposure.",
    body: "Regulatory complexity is growing in every industry. SBS helps organizations build sustainable compliance and risk management programs that satisfy regulators, protect operations, and create genuine business value.",
    bullets: [
      "Regulatory landscape mapping and obligation inventory",
      "Risk assessment and risk register development",
      "Control framework design and implementation",
      "Policy and procedure documentation",
      "Audit readiness and evidence preparation support",
      "Ongoing compliance advisory retainer options",
    ],
    image: s7,
  },
];

const why = [
  { icon: Award, title: "Senior Practitioners, Not Junior Analysts", body: "Every SBS consulting engagement is led and delivered by senior professionals with 10 to 20+ years of hands-on industry experience. You get people who have done this before — not recent graduates running frameworks from a textbook." },
  { icon: Layers, title: "Sector Depth Across Multiple Industries", body: "We have worked inside banking, healthcare, government, retail, manufacturing, and telecommunications. We speak your industry's language, understand your regulatory environment, and have seen the specific challenges you face." },
  { icon: Compass, title: "Zero Vendor Bias", body: "SBS has no commercial relationships that influence our recommendations. We will tell you the honest truth about what you need — even if the answer is \"you don't need to buy anything new right now.\"" },
  { icon: GitBranch, title: "Execution Partnership", body: "Unlike firms that disappear after the strategy deck, SBS stays engaged through delivery. Our consultants can transition into implementation roles, provide oversight during execution, or remain as advisors throughout your transformation journey." },
  { icon: Users, title: "Transparent Engagement Models", body: "We offer fixed-fee, time-and-materials, and retainer-based engagements. Scope, timeline, and cost are agreed upfront with no hidden surprises." },
];

const stats: { prefix?: string; value: number; suffix: string; l: string }[] = [
  { value: 150, suffix: "+", l: "Strategy & Consulting Engagements Completed" },
  { value: 10, suffix: "+", l: "Industries Served" },
  { value: 92, suffix: "%", l: "Client Satisfaction Score" },
  { value: 8, suffix: "+", l: "Years of Consulting Excellence" },
  { value: 40, suffix: "+", l: "Senior Consultants & Domain Experts" },
];

function Counter({ to, start }: { to: number; start: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 1800;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, start]);
  return <>{Math.round(val)}</>;
}

function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-5">
      {stats.map((s) => (
        <div key={s.l} className="text-center">
          <div
            className="text-4xl font-bold md:text-5xl"
            style={{ background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {s.prefix ?? ""}<Counter to={s.value} start={inView} />{s.suffix}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

const faqs = [
  { q: "How is SBS different from a large consulting firm?", a: "With SBS, you get senior practitioners — not a bait-and-switch where a partner sells the engagement and a junior analyst delivers it. Every engagement is led by experienced professionals who are accountable for outcomes, not just deliverables." },
  { q: "How long does a typical consulting engagement take?", a: "It depends on scope. A focused technology assessment may take 2–4 weeks. A full IT strategy or transformation roadmap typically takes 6–12 weeks. We'll agree on scope and timeline before we begin." },
  { q: "Can you help us build internal capabilities, not just deliver a report?", a: "Yes. Knowledge transfer and capability building are built into every SBS engagement. We want your team to be stronger after working with us — not dependent on us indefinitely." },
  { q: "Do you offer ongoing advisory services?", a: "Yes. Many of our clients retain SBS on an ongoing basis as a strategic technology advisor — providing monthly guidance, review of key decisions, and access to our broader team of specialists." },
  { q: "Can you work with our existing vendors and technology partners?", a: "Absolutely. We collaborate with your existing ecosystem rather than replacing it. Our role is to ensure that every technology investment is aligned, optimized, and delivering value." },
];

export default function Consulting() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SBS consulting strategy session" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(5,11,24,0.88) 0%, rgba(7,20,43,0.75) 55%, rgba(5,11,24,0.95) 100%)" }}
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
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                <Lightbulb className="h-3.5 w-3.5" /> Business Consulting Services
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Turn Complexity Into Clarity.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Strategy That Moves Your Business Forward.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS consulting services help organizations cut through uncertainty, align technology with business goals, and build the roadmaps, frameworks, and capabilities that drive lasting transformation — not just short-term fixes.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Book a Free Strategy Session <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Talk to a Consultant
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">
                A complimentary 60-minute session with a senior SBS consultant. No obligation.
              </p>
            </motion.div>
          </section>
        </div>
      </main>

      {/* THE PROBLEM */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> The Challenge
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              Most Technology Investments Underperform.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Here's Why.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Organizations invest heavily in technology every year — yet many of those investments fail to deliver the expected returns. Not because the technology is wrong, but because the strategy behind it is missing, misaligned, or poorly executed.
            </p>
            <p className="mx-auto mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              Sound familiar?
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
            {problems.map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_10px_40px_-15px_rgba(56,189,248,0.35)]"
              >
                <div
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-sm leading-relaxed text-white/85">{p}</p>
              </motion.div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-white/70 md:text-lg">
            These are not technology problems. They are <span className="font-semibold text-white">strategy and governance problems</span> — and that is exactly where SBS excels.
          </p>
        </div>
      </section>

      {/* CONSULTING PHILOSOPHY */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Consulting Philosophy
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>We Don't Just Advise.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                We Deliver.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Many consulting engagements end with a report on a shelf. At SBS, we measure our success by outcomes — not deliverables. Our approach is built on four principles.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_-15px_rgba(56,189,248,0.35)]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(74,222,128,0.08))" }}
                  />
                  <div className="relative">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                      style={{ background: "var(--gradient-brand)" }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                      {p.n} — {p.label}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              What We Offer
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Our Consulting{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Services.
              </span>
            </h2>
          </div>

          <div className="mt-14 space-y-8">
            {services.map((s, idx) => {
              const Icon = s.icon;
              const reverse = idx % 2 === 1;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] md:grid-cols-2"
                >
                  <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[380px] ${reverse ? "md:order-2" : ""}`}>
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      width={1024}
                      height={768}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-8 md:p-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
                        Service {s.n}
                      </p>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold leading-tight text-white">{s.title}</h3>
                    <p className="mt-3 text-sm font-semibold text-white/85">{s.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">{s.body}</p>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">What you get</p>
                    <ul className="mt-3 space-y-2">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY SBS */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Why SBS
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Why Clients Choose SBS Consulting</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Over the Alternatives.
              </span>
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {why.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-2xl border border-border bg-card p-7">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{w.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{w.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="relative overflow-hidden px-6 py-20 md:px-12 md:py-24"
        style={{ background: "linear-gradient(135deg, #050b18 0%, #0a1c3a 100%)" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              Our Track Record.
            </h2>
          </div>
          <StatsCounter />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              FAQ
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              Frequently Asked{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Questions.
              </span>
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-6 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-foreground">
                  {f.q}
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform group-open:rotate-45"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
        <div className="absolute inset-0">
          <img src={ctaBg} alt="" aria-hidden loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(5,11,24,0.9) 0%, rgba(7,20,43,0.82) 100%)" }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Let's Build Your Technology{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Strategy Together.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Book a complimentary 60-minute strategy session with a senior SBS consultant. We'll discuss your current challenges, where you want to go, and what a realistic path forward looks like — with no obligation and no sales pitch.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book My Free Strategy Session <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Contact Our Consulting Team
            </a>
          </div>
          <p className="mt-5 text-xs text-white/60">
            Confidential. No obligation. Delivered by a senior consultant — not a sales rep.
          </p>
        </div>
      </section>

      <div id="form">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
