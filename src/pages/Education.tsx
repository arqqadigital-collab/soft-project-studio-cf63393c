import { motion } from "framer-motion";
import {
  ArrowRight,
  GraduationCap,
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
import traditionalFailImg from "@/assets/education/traditional-fail.jpg";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/education/hero.jpg";
import p1 from "@/assets/education/problem-p1.jpg";
import p2 from "@/assets/education/problem-p2.jpg";
import p3 from "@/assets/education/problem-p3.jpg";
import uc1 from "@/assets/education/uc-1.jpg";
import uc2 from "@/assets/education/uc-2.jpg";
import uc3 from "@/assets/education/uc-3.jpg";
import uc4 from "@/assets/education/uc-4.jpg";

const problems = [
  {
    n: "01",
    label: "RISK",
    title: "Disconnected Admissions",
    body: "Admissions, registration, and student services run on separate tools. Applicants fall through the cracks and enrolled students face rework, delays, and lost documents.",
    image: p1,
  },
  {
    n: "02",
    label: "RISK",
    title: "Manual Research Administration",
    body: "Grants, ethics approvals, and project tracking live in spreadsheets. Principal investigators lose time to paperwork instead of research — and finance never sees a real spend picture.",
    image: p2,
  },
  {
    n: "03",
    label: "RISK",
    title: "Invisible Academic Finance",
    body: "Tuition, sponsorships, and department budgets are reconciled after the term ends. Deans and CFOs make decisions on delayed, incomplete reports instead of live financial reality.",
    image: p3,
  },
];

const failures = [
  "Student, HR, and finance systems operate in silos",
  "No live connection between enrollment and revenue",
  "Research grants and outcomes are not captured in real time",
  "Timetabling is disconnected from resources and rooms",
  "Academic planning is disconnected from execution",
];

const approach = [
  { icon: Cpu, text: "Academic-first system architecture" },
  { icon: RefreshCw, text: "Real-time student and finance synchronization" },
  { icon: DollarSign, text: "Grant- and budget-aware academic workflows" },
  { icon: Network, text: "End-to-end traceability across the student lifecycle" },
  { icon: ShieldCheck, text: "Integration between academics, research, and finance" },
];

const capabilities = [
  {
    icon: GraduationCap,
    title: "Student Lifecycle Management",
    items: [
      "Applications, admissions, and enrollment",
      "Program, course, and section management",
      "Attendance, grading, and transcripts",
    ],
  },
  {
    icon: Layers,
    title: "Curriculum & Timetabling",
    items: [
      "Program and course catalog with versioning",
      "Automated timetabling and room assignment",
      "Faculty workload and teaching load tracking",
    ],
  },
  {
    icon: Boxes,
    title: "Research & Grants Management",
    items: [
      "Proposal, award, and milestone tracking",
      "Ethics, compliance, and publication records",
      "Multi-source grant funding visibility",
    ],
  },
  {
    icon: Activity,
    title: "Faculty & HR Operations",
    items: [
      "Faculty profiles, ranks, and tenure tracking",
      "Workload, evaluation, and development plans",
      "Payroll and benefits integration",
    ],
  },
  {
    icon: Calculator,
    title: "Finance & Fee Management",
    items: [
      "Tuition, scholarships, and sponsor billing",
      "Real-time department and grant budgets",
      "Profitability per program and cohort",
    ],
  },
];

const useCases = [
  {
    n: "01",
    title: "Universities with hybrid classroom and online delivery",
    body: "Unified course, timetable, and assessment management across in-person, hybrid, and fully online cohorts — with a single student record across every mode.",
    image: uc1,
  },
  {
    n: "02",
    title: "Research-intensive institutions with active grants",
    body: "Proposal-to-close grant tracking, milestone visibility, and integrated finance — so PIs, deans, and CFOs work from the same live view of research activity.",
    image: uc2,
  },
  {
    n: "03",
    title: "Multi-campus universities and college groups",
    body: "Central academic catalog and finance, local campus execution, and consolidated reporting across faculties, schools, and campuses.",
    image: uc3,
  },
  {
    n: "04",
    title: "Institutions scaling student services and support",
    body: "Unified student profile, self-service portals, and case-managed student support — reducing time-to-response and improving retention across the student journey.",
    image: uc4,
  },
];

const impact = [
  { icon: Zap, text: "Faster admissions and enrollment cycles" },
  { icon: Recycle, text: "Reduced administrative rework across departments" },
  { icon: LineChart, text: "Accurate finance per program, faculty, and grant" },
  { icon: Eye, text: "Live visibility across every campus and school" },
  { icon: Target, text: "Better alignment between academic plans and delivery" },
];

const implementation = [
  { icon: ScanSearch, n: "01", title: "Academic process mapping", body: "Document existing student, research, and finance flows, dependencies, and operational gaps before configuring anything." },
  { icon: Settings2, n: "02", title: "Program and workflow structuring", body: "Design programs, courses, timetabling rules, and approval flows aligned with how the institution actually runs." },
  { icon: Workflow, n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with LMS, finance, HR, and research systems already in use." },
  { icon: Rocket, n: "04", title: "Faculty and staff enablement", body: "Train faculty, registrars, and administrators on the new workflows with hands-on operational readiness checks." },
  { icon: TrendingUp, n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new programs, campuses, and research centers." },
];

export default function Education() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Modern university campus" className="absolute inset-0 h-full w-full object-cover" />
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
                Education & Research ERP that runs on{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  real academic reality.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS delivers an academic ERP that unifies the entire student, research, and finance lifecycle into a single operational model — so leaders decide on live academic data, not delayed reports.
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
              A Disconnected Institution Is a{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Fragile Institution.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Most institutions don't struggle with teaching or research — they struggle with coordination. The result is not inefficiency; it is loss of academic and financial control.
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
                Where Traditional Systems Fail Education and Research Institutions
              </h3>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Generic ERP systems typically fail because they do not reflect how academia actually works:
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
                Academic institutions require continuous synchronization between planning and execution — not periodic reporting.
              </p>
            </div>
          </div>

          <div className="relative h-80 min-h-full md:h-auto">
            <img
              src={traditionalFailImg}
              alt="Disconnected academic systems"
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
              SBS Education & Research ERP Approach
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Designed around your academic reality —</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                not generic templates.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              This is not ERP implementation. It is academic process reconstruction inside ERP.
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
              Everything a modern institution{" "}
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
              Education Use Cases
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Real academic environments</span>{" "}
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
            Also serving grant-sensitive academic environments where financial discipline depends on accurate, real-time reporting.
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
                term after term.
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
              <span style={{ color: "var(--brand-dark)" }}>A structured academic</span>{" "}
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
              "Industry-aligned academic architecture approach",
              "Strong integration across academic, research, and finance layers",
              "Custom workflow capability for complex educational environments",
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
            Build an academic system that{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              matches your institutional reality.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            If your institution depends on spreadsheets, delayed updates, or disconnected admissions, research, and finance tools — it is not a system. It is fragmentation. SBS helps you rebuild academic control inside a unified ERP environment.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Request an academic ERP assessment <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
