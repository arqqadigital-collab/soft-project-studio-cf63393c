import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  GraduationCap,
  AlertTriangle,
  Search,
  Users,
  Monitor,
  Award,
  UserCog,
  Code2,
  BarChart3,
  CheckCircle2,
  Handshake,
  Building2,
  Workflow,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/learning/hero.jpg";
import t1 from "@/assets/learning/threat1.jpg";
import t2 from "@/assets/learning/threat2.jpg";
import t3 from "@/assets/learning/threat3.jpg";
import s1 from "@/assets/learning/s1.jpg";
import s2 from "@/assets/learning/s2.jpg";
import s3 from "@/assets/learning/s3.jpg";
import s4 from "@/assets/learning/s4.jpg";
import s5 from "@/assets/learning/s5.jpg";
import s6 from "@/assets/learning/s6.jpg";
import s7 from "@/assets/learning/s7.jpg";
import ctaBg from "@/assets/learning/cta.jpg";

const threats = [
  {
    n: "01",
    title: "Disengaged, Outdated Training Programs",
    body: "Generic slide decks and one-off sessions that fail to shift behavior — leaving teams unprepared for the tools, systems, and challenges they face every day.",
    image: t1,
  },
  {
    n: "02",
    title: "Widening Skills Gaps",
    body: "Technology and business models evolve faster than in-house capabilities. Critical roles go unfilled, projects stall, and transformation initiatives lose momentum.",
    image: t2,
  },
  {
    n: "03",
    title: "Talent Attrition & Lost Knowledge",
    body: "Top performers leave when they stop growing. Institutional knowledge walks out the door, and replacement costs quickly exceed the price of investing in your people.",
    image: t3,
  },
];

const pillars = [
  {
    n: "01",
    label: "ASSESS",
    icon: Search,
    title: "Understand where your capability gaps are.",
    body: "Skills assessments, role-based competency mapping, and learning-needs analysis to identify what your workforce needs — and prioritize what will move the needle first.",
  },
  {
    n: "02",
    label: "ENABLE",
    icon: GraduationCap,
    title: "Deliver learning that actually sticks.",
    body: "Blended programs combining instructor-led workshops, self-paced digital courses, hands-on labs, and coaching — designed for adults, aligned to real work.",
  },
  {
    n: "03",
    label: "SUSTAIN",
    icon: Sparkles,
    title: "Turn learning into lasting capability.",
    body: "Reinforcement, analytics, and continuous learning journeys so new skills convert into on-the-job performance — not just certificates on a wall.",
  },
];

const services = [
  {
    n: "01",
    icon: Search,
    title: "Skills Assessment & Learning Needs Analysis",
    tagline: "Know exactly where your people stand — and where they need to go.",
    body: "Structured assessments that map current capabilities against role requirements and strategic priorities, giving you a clear, data-driven baseline to design targeted learning journeys.",
    bullets: [
      "Role-based competency frameworks and skills matrices",
      "Individual and team-level skills diagnostics",
      "Gap analysis with prioritized learning roadmaps",
      "Executive summary for leadership and HR alignment",
    ],
    ideal: "Annual planning, restructuring, digital transformation programs, capability-building initiatives.",
    image: s1,
  },
  {
    n: "02",
    icon: Users,
    title: "Instructor-Led Training & Workshops",
    tagline: "Live, expert-led learning that drives real behavior change.",
    body: "Interactive workshops delivered on-site or virtually by senior practitioners — combining frameworks, discussion, and hands-on practice built around your business context.",
    bullets: [
      "Custom curriculum aligned to your goals and tools",
      "Delivered by certified instructors and industry experts",
      "Case studies and exercises using your real scenarios",
      "Post-workshop resources and follow-up coaching",
    ],
    ideal: "Team upskilling, leadership offsites, new-system rollouts, change-management programs.",
    image: s2,
  },
  {
    n: "03",
    icon: Monitor,
    title: "Digital Learning & LMS Solutions",
    tagline: "Scalable, self-paced learning available anywhere.",
    body: "End-to-end digital learning — from LMS platform deployment to bespoke content production — that lets your entire workforce learn at their own pace, on any device.",
    bullets: [
      "LMS selection, implementation, and administration",
      "Custom eLearning content and micro-learning modules",
      "SCORM/xAPI-compliant course libraries",
      "Learner engagement, gamification, and social features",
    ],
    ideal: "Distributed workforces, onboarding at scale, compliance training, continuous learning cultures.",
    image: s3,
  },
  {
    n: "04",
    icon: Award,
    title: "Certification & Exam Preparation",
    tagline: "Prepare your teams to earn the credentials that matter.",
    body: "Structured preparation programs across leading technology, project management, and business certifications — with practice exams, mentoring, and success guarantees.",
    bullets: [
      "PMP, PRINCE2, ITIL, TOGAF, Six Sigma tracks",
      "AWS, Azure, Google Cloud, and Microsoft certifications",
      "SAP, Oracle, and Salesforce credential preparation",
      "Mock exams, study plans, and dedicated mentor support",
    ],
    ideal: "Individual career development, team credentialing, partner certification requirements.",
    image: s4,
  },
  {
    n: "05",
    icon: UserCog,
    title: "Leadership & Executive Development",
    tagline: "Build the leaders who will drive your next chapter.",
    body: "Multi-touch leadership programs that combine assessment, coaching, and experiential learning — developing the strategic, people, and change-leadership skills modern executives need.",
    bullets: [
      "360-degree assessments and executive coaching",
      "Strategic leadership and change-management modules",
      "Peer learning cohorts and action-learning projects",
      "Succession planning and high-potential development",
    ],
    ideal: "Emerging leaders, senior managers, succession pipelines, board-level talent programs.",
    image: s5,
  },
  {
    n: "06",
    icon: Code2,
    title: "Technical & Digital Bootcamps",
    tagline: "Accelerated, hands-on training for the skills you need now.",
    body: "Immersive bootcamps that take your teams from foundational to job-ready in weeks — across software engineering, data, AI, and modern cloud disciplines.",
    bullets: [
      "Full-stack development, DevOps, and cloud engineering",
      "Data analytics, data science, and applied AI",
      "Cybersecurity fundamentals and specialist tracks",
      "Live projects, code reviews, and capstone assessments",
    ],
    ideal: "Reskilling initiatives, graduate programs, technology transformations, talent redeployment.",
    image: s6,
  },
  {
    n: "07",
    icon: BarChart3,
    title: "Learning Analytics & Advisory",
    tagline: "Prove impact. Improve outcomes. Justify investment.",
    body: "Turn learning data into decisions — with dashboards, ROI models, and advisory support that connect training activity to business performance.",
    bullets: [
      "Learning KPIs, dashboards, and executive reporting",
      "Kirkpatrick-based evaluation and impact measurement",
      "Learning strategy, governance, and operating models",
      "Vendor selection and content curation advisory",
      "Continuous improvement based on learner outcomes",
    ],
    ideal: "L&D leaders scaling their function, CHROs building capability strategies, transformation offices.",
    image: s7,
  },
];

const why = [
  { icon: Award, title: "Certified Expertise", body: "Master trainers, executive coaches, and subject-matter experts credentialed across leading technology, methodology, and leadership frameworks." },
  { icon: Handshake, title: "Vendor-Agnostic Curriculum", body: "We are not tied to any single platform or publisher. Recommendations are based on what will actually build capability in your teams — honest advice you can trust." },
  { icon: Building2, title: "Proven Across Industries", body: "Programs delivered across banking, healthcare, government, retail, and telecommunications. We understand your sector's language, roles, and constraints." },
  { icon: Workflow, title: "End-to-End Ownership", body: "From needs analysis through delivery, reinforcement, and impact measurement — one partner, one accountable team across the entire learning lifecycle." },
  { icon: BarChart3, title: "Business-Aligned Learning", body: "We speak both learning and business. Programs that build real capability without disrupting productivity or the day job." },
];

const stats: { prefix?: string; value: number; decimals?: number; suffix: string; l: string }[] = [
  { value: 1200, suffix: "+", l: "Workshops & Programs Delivered" },
  { value: 95, suffix: "%", l: "Learner Satisfaction Score" },
  { value: 60, suffix: "K+", l: "Professionals Trained" },
  { value: 200, suffix: "+", l: "Certification Tracks Supported" },
  { value: 80, suffix: "+", l: "Master Trainers & Coaches" },
];

function Counter({ to, decimals = 0, start }: { to: number; decimals?: number; start: boolean }) {
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
  return <>{val.toFixed(decimals)}</>;
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
            style={{
              background: "var(--gradient-brand)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {s.prefix ?? ""}
            <Counter to={s.value} decimals={s.decimals ?? 0} start={inView} />
            {s.suffix}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

const faqs = [
  {
    q: "How do we get started with SBS learning services?",
    a: "It starts with a free, no-obligation learning needs conversation. Our team will help you clarify your capability priorities and recommend the right first step — whether that's an assessment, a pilot program, or a broader strategy engagement.",
  },
  {
    q: "Do you work with organizations that already have an internal L&D team?",
    a: "Absolutely. We regularly work alongside internal L&D and HR teams as an extension of their capabilities — providing specialist facilitators, content production capacity, or programs they don't run in-house.",
  },
  {
    q: "How long does a typical learning program take to design and deliver?",
    a: "Short workshops can be scoped and delivered within 2–3 weeks. Blended, multi-cohort programs typically run from 6 weeks to 6 months, depending on scale, content depth, and reinforcement needs.",
  },
  {
    q: "Can you deliver training in Arabic and English?",
    a: "Yes. Our facilitators and content teams work fluently in both Arabic and English, and we regularly deliver bilingual programs across the region.",
  },
  {
    q: "Do you offer one-off workshops or long-term learning partnerships?",
    a: "Both. We deliver targeted workshops and bootcamps, as well as multi-year managed learning services — including academy operating models, LMS management, and ongoing content production.",
  },
];

export default function Learning() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SBS learning and knowledge programs" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(5,11,24,0.85) 0%, rgba(7,20,43,0.72) 55%, rgba(5,11,24,0.95) 100%)",
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
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                <GraduationCap className="h-3.5 w-3.5" /> Learning & Knowledge Services
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Build the Capabilities{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Your Future Depends On.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS delivers end-to-end learning and knowledge services that turn your people into your strongest competitive advantage — through assessment, world-class training, and continuous enablement.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Get a Free Learning Needs Review <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Speak to a Learning Expert
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">
                No commitment required. Walk away with a clear view of your capability gaps.
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
              <AlertTriangle className="h-3.5 w-3.5" /> The Reality of Capability Risk Today
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              The Skills Race Is Real.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                The Cost of Falling Behind Has Never Been Higher.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              AI, cloud, data, and new operating models are rewriting the definition of every job. Generic training and one-off workshops don't close the gap. The question isn't whether your workforce needs to evolve. It's whether they'll be ready in time.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {threats.map((p) => (
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
                    {p.n} — Risk
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK — 3 PILLARS */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              How We Work
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Comprehensive. Practical.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Tailored to Your Workforce.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We reject the one-size-fits-all approach. Every workforce, every role, and every business goal is different — so our methodology is built around your context, on three core pillars.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-border bg-card p-7"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                    Pillar {p.n} — {p.label}
                  </p>
                  <h3 className="mt-3 text-xl font-bold text-foreground">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
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
              Our Learning & Knowledge{" "}
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
                    <p className="mt-5 text-xs leading-relaxed text-white/55">
                      <span className="font-semibold text-white/70">Ideal for:</span> {s.ideal}
                    </p>
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
              <span style={{ color: "var(--brand-dark)" }}>Why Leading Organizations Choose</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                SBS for Learning.
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
              Numbers That Speak for Themselves.
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

      {/* FINAL CTA WITH BACKGROUND */}
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32">
        <div className="absolute inset-0">
          <img src={ctaBg} alt="" aria-hidden loading="lazy" width={1920} height={900} className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(5,11,24,0.9) 0%, rgba(7,20,43,0.82) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            Start with a Free{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Learning Needs Review.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            You can't grow what you don't measure. Let SBS give you a clear, honest view of your capability gaps — with no obligation and no cost. Our experts will pinpoint your top priorities and outline a concrete first step.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book My Free Review <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Contact Our Learning Team
            </a>
          </div>
          <p className="mt-5 text-xs text-white/60">No sales pressure. No jargon. Just clarity.</p>
        </div>
      </section>

      <div id="form">
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
