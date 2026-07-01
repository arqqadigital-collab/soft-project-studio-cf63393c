import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Search,
  Lock,
  Radar,
  Cloud,
  FileCheck2,
  Users,
  Siren,
  CheckCircle2,
  Award,
  Handshake,
  Building2,
  Workflow,
  BarChart3,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/cybersecurity/hero.jpg";
import t1 from "@/assets/cybersecurity/threat1.jpg";
import t2 from "@/assets/cybersecurity/threat2.jpg";
import t3 from "@/assets/cybersecurity/threat3.jpg";
import s1 from "@/assets/cybersecurity/s1.jpg";
import s2 from "@/assets/cybersecurity/s2.jpg";
import s3 from "@/assets/cybersecurity/s3.jpg";
import s4 from "@/assets/cybersecurity/s4.jpg";
import s5 from "@/assets/cybersecurity/s5.jpg";
import s6 from "@/assets/cybersecurity/s6.jpg";
import s7 from "@/assets/cybersecurity/s7.jpg";
import ctaBg from "@/assets/cybersecurity/cta.jpg";

const threats = [
  {
    n: "01",
    title: "Ransomware & Zero-Day Exploits",
    body: "Financial losses averaging $4.4 million per incident — operations frozen, backups compromised, and negotiations you never wanted to have.",
    image: t1,
  },
  {
    n: "02",
    title: "Phishing & Insider Threats",
    body: "Over 80% of breaches involve a human element. One click on a well-crafted email is enough to hand attackers the keys to your environment.",
    image: t2,
  },
  {
    n: "03",
    title: "Supply Chain & Data Breaches",
    body: "Regulatory fines, legal consequences, and irreparable damage to customer trust — long after the incident itself has ended.",
    image: t3,
  },
];

const pillars = [
  {
    n: "01",
    label: "ASSESS",
    icon: Search,
    title: "Understand where you are exposed.",
    body: "Risk assessments, penetration testing, and compliance gap analysis to identify weak points and prioritize what needs to be addressed first.",
  },
  {
    n: "02",
    label: "PROTECT",
    icon: ShieldCheck,
    title: "Harden every potential entry point.",
    body: "Layered, defense-in-depth security architectures across your network, endpoints, cloud environments, identities, and applications.",
  },
  {
    n: "03",
    label: "RESPOND",
    icon: Radar,
    title: "Detect early. Contain fast.",
    body: "Continuous monitoring, real-time anomaly detection, and rapid response so your operations remain resilient — even when incidents occur.",
  },
];

const services = [
  {
    n: "01",
    icon: Search,
    title: "Vulnerability Assessment & Penetration Testing",
    tagline: "Find your weaknesses before attackers do.",
    body: "Certified ethical hackers run rigorous simulated attacks across your infrastructure, web and mobile apps, and internal networks to uncover vulnerabilities that automated tools miss.",
    bullets: [
      "Detailed technical findings with severity ratings",
      "Step-by-step remediation recommendations",
      "Executive summary for leadership and board reporting",
      "Re-testing after remediation to verify fixes",
    ],
    ideal: "Annual compliance, pre-launch testing, post-incident validation, proactive risk management.",
    image: s1,
  },
  {
    n: "02",
    icon: Radar,
    title: "Security Operations Center (SOC) as a Service",
    tagline: "24/7 eyes on your environment — without the overhead.",
    body: "Immediate access to a fully equipped, expert-staffed SOC that monitors your environment around the clock, detects threats early, and responds fast.",
    bullets: [
      "Continuous monitoring of logs, endpoints, and network traffic",
      "Real-time threat detection and alerting",
      "Incident triage, investigation, and containment",
      "Monthly threat intelligence and security reporting",
    ],
    ideal: "Organizations without internal SOC capacity, regulated industries, sensitive-data businesses.",
    image: s2,
  },
  {
    n: "03",
    icon: Lock,
    title: "Identity & Access Management (IAM)",
    tagline: "Control access. Eliminate unnecessary risk.",
    body: "IAM frameworks that enforce the right level of access for every user, device, and application — closing off one of the leading causes of breaches.",
    bullets: [
      "Single Sign-On (SSO) and Multi-Factor Authentication (MFA)",
      "Role-based access control (RBAC) design",
      "Privileged Access Management (PAM) solutions",
      "Identity governance and lifecycle management",
    ],
    ideal: "Large workforces, cloud migrations, and high-compliance environments.",
    image: s3,
  },
  {
    n: "04",
    icon: Cloud,
    title: "Cloud Security",
    tagline: "Secure your cloud — without slowing it down.",
    body: "End-to-end cloud security services across AWS, Microsoft Azure, and Google Cloud Platform, built for the attack surfaces traditional tools were never designed for.",
    bullets: [
      "Cloud security architecture design and review",
      "Configuration hardening and CIS benchmark compliance",
      "Cloud-native threat detection and response",
      "Continuous posture management (CSPM)",
      "Data encryption and DLP implementation",
    ],
    ideal: "Cloud migrations, hybrid environments, and cloud-native DevOps teams.",
    image: s4,
  },
  {
    n: "05",
    icon: FileCheck2,
    title: "Compliance & Regulatory Advisory",
    tagline: "Meet your obligations. Avoid penalties. Build trust.",
    body: "Advisors who help you understand your obligations and build the controls, documentation, and processes to meet and sustain them.",
    bullets: [
      "ISO/IEC 27001, NIST CSF, GDPR, PCI-DSS, HIPAA",
      "NCA Essential Cybersecurity Controls (ECC) & SAMA CSF",
      "Policy and procedure development",
      "Audit preparation and evidence collection support",
      "Ongoing compliance monitoring and advisory",
    ],
    ideal: "Regulated organizations preparing for certification, audit, or cross-border compliance.",
    image: s5,
  },
  {
    n: "06",
    icon: Users,
    title: "Security Awareness Training",
    tagline: "Your people are your most important security control.",
    body: "Customized programs that turn your workforce into an active line of defense — not a vulnerability.",
    bullets: [
      "Role-based training modules for all staff levels",
      "Simulated phishing campaigns with real-time reporting",
      "Engaging, interactive content — not just slides",
      "Behavioral metrics and training effectiveness reports",
    ],
    ideal: "Large non-technical workforces, remote teams, high-value data handlers.",
    image: s6,
  },
  {
    n: "07",
    icon: Siren,
    title: "Incident Response & Digital Forensics",
    tagline: "When a breach happens, every second counts.",
    body: "Rapid incident response and forensic investigation to contain damage, understand what happened, and recover quickly — while preserving evidence for regulatory and legal purposes.",
    bullets: [
      "24/7 incident response hotline and on-call team",
      "Rapid containment and eradication",
      "Root cause analysis and forensic investigation",
      "Post-incident reporting and lessons-learned review",
      "Legal and regulatory notification support",
    ],
    ideal: "Every organization — because no one plans to be breached, but everyone should plan for it.",
    image: s7,
  },
];

const why = [
  { icon: Award, title: "Certified Expertise", body: "CISSP, CISM, CEH, CompTIA Security+, and cloud security credentials across AWS and Azure. Specialists, not generalists." },
  { icon: Handshake, title: "Vendor-Agnostic Recommendations", body: "We are not tied to any vendor. Recommendations are based on what is right for your organization — honest advice you can trust." },
  { icon: Building2, title: "Proven Across Industries", body: "Programs delivered across banking, healthcare, government, retail, and telecommunications. We understand your sector's risks and constraints." },
  { icon: Workflow, title: "End-to-End Ownership", body: "From initial assessment through monitoring and incident response — one partner, one accountable team across the entire security lifecycle." },
  { icon: BarChart3, title: "Business-Aligned Security", body: "We speak both security and business. Solutions that protect your organization without impeding productivity or user experience." },
];

const stats: { prefix?: string; value: number; decimals?: number; suffix: string; l: string }[] = [
  { value: 500, suffix: "+", l: "Security Assessments Conducted" },
  { value: 99.9, decimals: 1, suffix: "%", l: "SOC Uptime SLA" },
  { prefix: "<", value: 30, suffix: " Min", l: "Avg. Incident Response Initiation" },
  { value: 15, suffix: "+", l: "Compliance Frameworks Supported" },
  { value: 100, suffix: "+", l: "Certified Security Professionals" },
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
    q: "How do we get started with SBS cybersecurity services?",
    a: "It starts with a free, no-obligation security assessment. Our team will evaluate your current environment and provide a clear picture of your risk exposure and recommended next steps — at no cost.",
  },
  {
    q: "Do you work with organizations that already have an internal IT team?",
    a: "Absolutely. We frequently work alongside existing IT and security teams as an extension of their capabilities — providing specialized expertise, additional capacity, or specific services they don't have in-house.",
  },
  {
    q: "How long does a penetration test typically take?",
    a: "Depending on scope, most penetration tests take between 1 and 3 weeks, followed by a detailed report and a debrief session with your team.",
  },
  {
    q: "Can you help us achieve ISO 27001 or NCA compliance?",
    a: "Yes. We have extensive experience guiding organizations through compliance programs from gap assessment through audit readiness and certification.",
  },
  {
    q: "Do you offer ongoing security services or only project-based work?",
    a: "Both. We offer project-based engagements as well as ongoing retainer and managed security services — including our 24/7 SOC offering.",
  },
];

export default function Cybersecurity() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SBS cybersecurity operations" className="absolute inset-0 h-full w-full object-cover" />
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
                <ShieldCheck className="h-3.5 w-3.5" /> Cybersecurity Services
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Defend Your Organization{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Before the Threat Arrives.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                SBS delivers end-to-end cybersecurity solutions that protect your people, systems, and data — with a proactive, intelligence-driven approach designed for today's most dangerous threat landscape.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Get a Free Security Assessment <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Speak to a Cybersecurity Expert
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">
                No commitment required. Walk away with a clear picture of your security posture.
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
              <AlertTriangle className="h-3.5 w-3.5" /> The Reality of Cyber Risk Today
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              The Threats Are Real.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                The Stakes Have Never Been Higher.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              Ransomware, phishing, insider threats, zero-day exploits, and supply chain vulnerabilities are no longer distant risks — they are daily realities. The question is not whether you will be targeted. It's whether you will be ready.
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
                    {p.n} — Threat
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
              <span style={{ color: "var(--brand-dark)" }}>Comprehensive. Proactive.</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Tailored to Your Risk Profile.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              We reject the one-size-fits-all approach. Every environment, every threat, and every regulatory obligation is different — so our methodology is built around your context, on three core pillars.
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
              Our Cybersecurity{" "}
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
                SBS for Cybersecurity.
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
              Cybersecurity Assessment.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            You can't protect what you don't understand. Let SBS give you a clear, honest view of your security posture — with no obligation and no cost. Our experts will identify your top risks and give you a concrete starting point.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book My Free Assessment <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Contact Our Security Team
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
