import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Rocket,
  AlertTriangle,
  Search,
  PenTool,
  PlayCircle,
  GraduationCap,
  LifeBuoy,
  Server,
  Plug,
  Cloud,
  Network,
  ShieldCheck,
  Database,
  Cog,
  CheckCircle2,
  Award,
  ClipboardCheck,
  Eye,
  BadgeCheck,
  Headphones,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/implementation/hero.jpg";
import s1 from "@/assets/implementation/s1.jpg";
import s2 from "@/assets/implementation/s2.jpg";
import s3 from "@/assets/implementation/s3.jpg";
import s4 from "@/assets/implementation/s4.jpg";
import s5 from "@/assets/implementation/s5.jpg";
import s6 from "@/assets/implementation/s6.jpg";
import s7 from "@/assets/implementation/s7.jpg";
import ctaBg from "@/assets/implementation/cta.jpg";

const problems = [
  "Scope is poorly defined before work begins",
  "Systems are deployed in isolation without integration planning",
  "Projects run over budget due to change orders and rework",
  "Go-live deadlines slip, disrupting business operations",
  "Users don't adopt new tools because training is an afterthought",
  "There's no reliable support once the vendor has been paid",
];

const phases = [
  { n: "01", label: "DISCOVER", icon: Search, body: "We invest deeply in understanding your business requirements, technical environment, constraints, and success criteria before any deployment begins. This phase prevents the costly surprises that derail most projects." },
  { n: "02", label: "DESIGN", icon: PenTool, body: "We architect solutions that fit your specific context. Every integration, configuration decision, and workflow design is mapped against your actual business processes — not a generic template." },
  { n: "03", label: "DEPLOY", icon: PlayCircle, body: "We execute with precision using agile delivery practices. Stakeholders receive regular status updates and demos. Issues are surfaced and resolved early — not discovered on go-live day." },
  { n: "04", label: "ENABLE", icon: GraduationCap, body: "We equip your teams with the knowledge, documentation, and hands-on training needed to take full ownership and operate confidently post-launch." },
  { n: "05", label: "SUPPORT", icon: LifeBuoy, body: "We stay engaged after go-live to fine-tune configurations, resolve issues, and ensure the solution performs to its full potential in a live environment." },
];

const services = [
  {
    n: "01",
    icon: Server,
    title: "Enterprise Software Implementation",
    tagline: "Deploy the platforms your business runs on — the right way.",
    body: "Whether you're implementing an ERP, CRM, ITSM, HCM, or any other enterprise platform, SBS brings the configuration expertise, process alignment skills, and project discipline to deliver a successful deployment that your teams will actually use.",
    subhead: "Platforms we work with",
    platforms: [
      "ERP: SAP, Oracle, Microsoft Dynamics",
      "CRM: Salesforce, Microsoft Dynamics 365",
      "ITSM: ServiceNow, Jira Service Management",
      "HCM: Workday, SAP SuccessFactors",
    ],
    bullets: [
      "Requirements gathering and fit-gap analysis",
      "System configuration and customization",
      "Data migration planning and execution",
      "User acceptance testing (UAT) support",
      "Go-live planning and hypercare support",
    ],
    image: s1,
  },
  {
    n: "02",
    icon: Plug,
    title: "Systems Integration & API Development",
    tagline: "Connect your technology ecosystem. Eliminate data silos.",
    body: "Modern organizations run on dozens of applications. When those systems don't communicate, the result is duplicated data, manual reconciliation work, broken workflows, and frustrated users. SBS designs and builds integrations that make your technology ecosystem work as one.",
    bullets: [
      "Integration architecture design",
      "RESTful and SOAP API development and management",
      "Middleware and iPaaS platform implementation (MuleSoft, Azure Integration Services, Dell Boomi)",
      "Real-time and batch data synchronization",
      "API documentation and governance",
    ],
    image: s2,
  },
  {
    n: "03",
    icon: Cloud,
    title: "Cloud Migration & Deployment",
    tagline: "Move to the cloud without the disruption.",
    body: "Cloud migration is one of the most impactful — and most frequently mishandled — technology initiatives an organization can undertake. SBS provides a disciplined, risk-managed migration approach that ensures continuity, security, and performance from day one.",
    subhead: "Migration strategies we support",
    platforms: [
      "Rehost (Lift & Shift)",
      "Replatform",
      "Refactor / Re-architect",
      "Hybrid cloud deployment",
    ],
    bullets: [
      "Migration readiness assessment",
      "Workload prioritization and sequencing",
      "Migration execution with minimal downtime",
      "Post-migration optimization and cost management",
      "Cloud landing zone and governance setup",
    ],
    image: s3,
  },
  {
    n: "04",
    icon: Network,
    title: "Network & Infrastructure Implementation",
    tagline: "Build the foundation your operations depend on.",
    body: "From LAN/WAN design to data center buildout, SBS implements enterprise network and infrastructure solutions with the reliability, security, and scalability that modern operations demand.",
    bullets: [
      "Network architecture design and implementation",
      "Firewall, switching, and routing deployment",
      "Data center setup and server provisioning",
      "SD-WAN and wireless infrastructure implementation",
      "Infrastructure documentation and configuration management",
    ],
    image: s4,
  },
  {
    n: "05",
    icon: ShieldCheck,
    title: "Security Solutions Deployment",
    tagline: "Implement security tools that actually work together.",
    body: "Security solutions are most effective when deployed as part of a cohesive, integrated architecture — not as isolated point products. SBS implements security technologies within a unified framework, ensuring they communicate, correlate, and reinforce each other.",
    subhead: "Solutions we deploy",
    platforms: [
      "SIEM platforms (Splunk, Microsoft Sentinel, IBM QRadar)",
      "Endpoint Detection & Response (EDR/XDR)",
      "Identity & Access Management (IAM/PAM)",
      "Firewall and network security platforms",
      "Email and web security gateways",
      "Data Loss Prevention (DLP)",
    ],
    bullets: [],
    image: s5,
  },
  {
    n: "06",
    icon: Database,
    title: "Data Integration & Migration",
    tagline: "Move and connect your data — safely and accurately.",
    body: "Data is your most valuable asset. Migrating or integrating it poorly can corrupt records, break processes, and undermine the systems that depend on it. SBS executes data migration and integration projects with rigorous quality controls and full traceability.",
    bullets: [
      "Data discovery and profiling",
      "Data cleansing and transformation",
      "ETL/ELT pipeline design and development",
      "Migration validation and reconciliation",
      "Data lineage documentation",
    ],
    image: s6,
  },
  {
    n: "07",
    icon: Cog,
    title: "DevOps & Automation Implementation",
    tagline: "Accelerate delivery. Reduce manual effort. Build better.",
    body: "Modern software delivery demands speed without sacrificing stability. SBS implements DevOps practices and automation frameworks that shorten release cycles, improve quality, and reduce the toil that slows development teams down.",
    bullets: [
      "CI/CD pipeline design and implementation",
      "Infrastructure as Code (IaC) with Terraform / Ansible",
      "Container orchestration with Docker and Kubernetes",
      "Automated testing framework integration",
      "DevSecOps integration — security embedded in the pipeline",
    ],
    image: s7,
  },
];

const why = [
  { icon: Award, title: "Certified Implementation Engineers", body: "Our team holds certifications across the platforms and technologies we implement. You're not learning on your project — you're benefiting from professionals who have delivered dozens of similar engagements before." },
  { icon: ClipboardCheck, title: "A Dedicated Project Manager on Every Engagement", body: "Every SBS project has a dedicated project manager responsible for scope, timeline, budget, risk, and stakeholder communication. Nothing falls through the cracks. You always know exactly where your project stands." },
  { icon: Eye, title: "Transparent Project Reporting", body: "We provide regular status reports, milestone tracking, and risk registers throughout delivery. No surprises. No excuses. Just visibility." },
  { icon: BadgeCheck, title: "Quality Assurance at Every Stage", body: "Rigorous testing — unit, integration, UAT, and performance — is built into our delivery process. Issues are caught and resolved before they reach your users." },
  { icon: Headphones, title: "Post-Implementation Support", body: "Our relationship doesn't end at go-live. SBS provides structured post-implementation support with defined SLAs — ensuring your solution stabilizes and performs in a live environment." },
];

const stats: { prefix?: string; value: number; suffix: string; l: string }[] = [
  { value: 200, suffix: "+", l: "Successful Implementations Delivered" },
  { value: 95, suffix: "%", l: "On-Time, On-Budget Project Delivery Rate" },
  { value: 30, suffix: "+", l: "Technology Platforms and Vendors Supported" },
  { value: 0, suffix: "", l: "Reported Go-Live Failures in Last 3 Years" },
  { value: 50, suffix: "+", l: "Certified Implementation Professionals" },
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
  { q: "How do you handle projects where requirements change during delivery?", a: "Change is normal in complex projects. We use an agile delivery approach with a formal change management process — so scope changes are evaluated, agreed, and incorporated transparently, without derailing the project." },
  { q: "Can you work with our existing vendors and technology partners?", a: "Yes. We frequently collaborate with software vendors, hardware suppliers, and third-party integrators as part of a broader delivery ecosystem. We're experienced at coordinating multi-vendor environments effectively." },
  { q: "Do you provide training as part of implementation?", a: "Always. User enablement and knowledge transfer are mandatory phases in every SBS implementation — because a well-configured system that users don't understand is a failed implementation." },
  { q: "Can you take over an implementation that has stalled or gone wrong?", a: "Yes. We have a track record of rescuing troubled projects. Our team will assess the current state, identify the root causes, and develop a realistic recovery plan." },
  { q: "What size of projects do you work on?", a: "We work on projects of all sizes — from focused integrations taking a few weeks, to multi-year enterprise transformation programs. Our delivery model scales to match the complexity and scale of your initiative." },
];

function MethodologyTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - trackRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);

  const sectionHeight = trackWidth > 0 ? `calc(100vh + ${trackWidth}px)` : "150vh";

  return (
    <div ref={sectionRef} className="relative bg-background" style={{ height: sectionHeight }}>
      <section className="sticky top-0 h-screen overflow-hidden bg-background px-6 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12 lg:pb-12 lg:pt-32">
        <div className="relative mx-auto flex h-full max-w-7xl flex-col">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              How We Deliver
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              A Proven Methodology.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Relentless Attention to Detail.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Successful implementation is not about technology alone. It's about people, process, and technology working in harmony.
            </p>
          </div>

          <div className="relative mt-8 min-h-[240px] flex-1 sm:mt-10 lg:mt-12">
            {/* Horizontal timeline line */}
            <div className="pointer-events-none absolute left-0 right-0 top-[44px] h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent sm:top-[48px]" />

            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex items-start gap-0"
            >
              {phases.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.n}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group relative w-[280px] shrink-0 px-4 sm:w-[320px] sm:px-5 lg:w-[360px]"
                  >
                    {/* Phase label above line */}
                    <div className="flex h-[24px] items-end justify-center sm:h-[28px]">
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                        Phase {p.n}
                      </p>
                    </div>

                    {/* Dot on the line */}
                    <div className="relative flex h-7 items-center justify-center sm:h-8">
                      <div className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full bg-foreground/60 transition-all group-hover:scale-110 group-hover:bg-foreground sm:h-3.5 sm:w-3.5" />
                    </div>

                    {/* Content below */}
                    <div className="mt-2 text-center">
                      <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg text-primary-foreground shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-foreground sm:text-sm">
                        {p.label}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{p.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Implementation() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SBS implementation and integration" className="absolute inset-0 h-full w-full object-cover" />
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
                <Rocket className="h-3.5 w-3.5" /> Implementation &amp; Integration
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                From Blueprint to Reality.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Technology That Works — From Day One.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                A great strategy only creates value when it's executed with precision. SBS delivers end-to-end implementation and integration services that bring your technology investments to life — on time, within budget, and without disrupting your operations.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Request a Project Scoping Call <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Talk to an Implementation Expert
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">
                Get a detailed project plan, timeline, and cost estimate — with full transparency.
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
              Technology Projects Have a Failure Problem.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                SBS Fixes It.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Research consistently shows that more than 70% of technology implementation projects fail to meet their original objectives. The causes are well-known — yet they happen again and again:
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
            The result? Technology that cost significant money sits underused, creates friction, or gets abandoned entirely. At SBS, we've built our entire implementation practice around <span className="font-semibold text-white">solving these problems</span> — because we've seen the damage they cause, and we know exactly how to prevent them.
          </p>
        </div>
      </section>

      {/* METHODOLOGY / 5 PHASES — HORIZONTAL TIMELINE */}
      <MethodologyTimeline />

      {/* SERVICES */}
      <section className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              What We Offer
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Our Implementation &amp; Integration{" "}
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
                      width={1200}
                      height={900}
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

                    {s.platforms && (
                      <>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{s.subhead}</p>
                        <ul className="mt-3 space-y-2">
                          {s.platforms.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {s.bullets.length > 0 && (
                      <>
                        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">What you get</p>
                        <ul className="mt-3 space-y-2">
                          {s.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2.5 text-sm text-white/80">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--brand-blue)]" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
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
              <span style={{ color: "var(--brand-dark)" }}>Why Organizations Trust SBS</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                to Deliver Their Most Critical Projects.
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
              Delivery Results That Speak for Themselves.
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
            Have a Project in Mind?{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Let's Scope It Together.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Tell us about your initiative and we'll build a detailed project plan, resource model, timeline, and cost estimate — with complete transparency from day one. No vague quotes. No hidden scope. Just clarity.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request a Project Scoping Call <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Contact Our Delivery Team
            </a>
          </div>
          <p className="mt-5 text-xs text-white/60">
            Your project scoping call is free, detailed, and delivered by a senior implementation professional.
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
