import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Users,
  UserPlus,
  Briefcase,
  Crown,
  Server,
  ShieldCheck,
  Headphones,
  Cloud,
  AppWindow,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Zap,
  FileCheck,
  UserCheck,
  Handshake,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import heroImg from "@/assets/staffaug/hero.jpg";
import managedItInfrastructureAsset from "@/assets/staffaug/managed-it-new.jpg.asset.json";
import s2 from "@/assets/staffaug/s2.jpg";
import s3 from "@/assets/staffaug/s3.jpg";
import s4Asset from "@/assets/staffaug/s4-new.jpg.asset.json";
const s1 = managedItInfrastructureAsset.url;
const s4 = s4Asset.url;
import s5 from "@/assets/staffaug/s5.jpg";
import s6 from "@/assets/staffaug/s6.jpg";
import cloudServicesAsset from "@/assets/staffaug/managed-cloud-services.png.asset.json";
import s7 from "@/assets/staffaug/s7.jpg";
import s8 from "@/assets/staffaug/s8.jpg";
import ctaBg from "@/assets/staffaug/cta.jpg";

const problems = [
  "Critical projects stall due to resource gaps",
  "Full-time hiring takes months and costs significantly more",
  "IT operations are inconsistent without the right specialists in place",
  "Your best people are buried in routine tasks instead of driving growth",
  "Vendor fragmentation creates accountability gaps and service inconsistency",
];

const models = [
  {
    n: "01",
    tag: "Staff Augmentation",
    icon: UserPlus,
    title: "On-Demand Certified Professionals",
    body: "Pre-vetted, certified technology professionals who embed directly into your team. They work under your direction, follow your processes, and deliver to your standards — with none of the overhead of permanent hiring.",
    best: "Project-specific resource needs, skill gap coverage, team scaling, and interim leadership roles.",
  },
  {
    n: "02",
    tag: "Managed Services",
    icon: ShieldCheck,
    title: "Fully Outsourced IT Operations",
    body: "Fully outsourced management of defined IT functions — from infrastructure and security operations to helpdesk and application support. SBS takes full ownership, accountability, and SLA responsibility so your teams can focus on what moves the business forward.",
    best: "IT operations offloading, cost optimization, 24/7 coverage, and organizations without in-house IT maturity.",
  },
];

const services = [
  {
    n: "01",
    icon: UserCheck,
    group: "Staff Augmentation",
    title: "Technology Staff Augmentation",
    tagline: "Access the specialists you need — without the hiring delay.",
    body: "SBS maintains a deep bench of certified technology professionals across all major disciplines. Whether you need a cybersecurity engineer for six months, a cloud architect for a transformation project, or a network specialist to support a critical deployment, we deploy the right person quickly — fully vetted, certified, and ready to contribute.",
    bullets: [
      "Pre-screened candidates with verified credentials and references",
      "Rapid deployment — most resources placed within 5–10 business days",
      "Full replacement guarantee if a resource doesn't meet expectations",
      "Ongoing performance management support from SBS",
    ],
    image: s1,
  },
  {
    n: "02",
    icon: Users,
    group: "Staff Augmentation",
    title: "Project-Based Resource Teams",
    tagline: "Assemble the right team for the right project — without permanent headcount.",
    body: "Some initiatives require a team of specialists rather than a single resource. SBS builds and deploys purpose-built teams for specific projects — from a scrum team for a software development initiative to a full delivery squad for an enterprise implementation.",
    bullets: [
      "Team design aligned to your project requirements",
      "Combined technical and functional expertise",
      "Integrated project management and quality assurance",
      "Flexible scaling as project phases change",
    ],
    image: s2,
  },
  {
    n: "03",
    icon: Crown,
    group: "Staff Augmentation",
    title: "Interim & Executive IT Leadership",
    tagline: "Senior technology leadership — available immediately.",
    body: "Leadership gaps at the CTO, CISO, or IT Director level can be devastating to organizational momentum. SBS provides experienced, credible technology leaders who can step in at short notice, stabilize operations, drive strategy, and hold the function accountable until a permanent appointment is made.",
    bullets: [
      "Chief Information Officer (CIO)",
      "Chief Technology Officer (CTO)",
      "Chief Information Security Officer (CISO)",
      "IT Director / Head of IT",
      "Program Director / PMO Lead",
    ],
    image: s3,
  },
  {
    n: "04",
    icon: Server,
    group: "Managed Services",
    title: "Managed IT Infrastructure",
    tagline: "Keep your infrastructure running — without the overhead.",
    body: "Your servers, networks, storage, and cloud environments need constant monitoring, maintenance, and management. SBS takes full ownership of your infrastructure operations, delivering proactive monitoring, rapid response, and guaranteed uptime — so your team is free to focus on strategic priorities.",
    bullets: [
      "24/7 proactive monitoring and alerting",
      "Patch management and system updates",
      "Performance optimization and capacity planning",
      "Incident management and root cause analysis",
      "Monthly operations reporting and service reviews",
      "Defined SLAs with uptime guarantees",
    ],
    image: s4,
  },
  {
    n: "05",
    icon: ShieldCheck,
    group: "Managed Services",
    title: "Managed Security Services (MSSP)",
    tagline: "Enterprise-grade security operations — without building it in-house.",
    body: "Cybersecurity operations require constant vigilance, specialized skills, and significant investment. SBS delivers fully managed security services through our 24/7 Security Operations Center — giving you enterprise-class protection at a fraction of the cost of doing it yourself.",
    bullets: [
      "24/7 SOC monitoring and threat detection",
      "Security incident response and containment",
      "Vulnerability management and patching coordination",
      "Threat intelligence feeds and analysis",
      "Monthly security reports and executive briefings",
      "Compliance monitoring and alerting",
    ],
    image: s5,
  },
  {
    n: "06",
    icon: Headphones,
    group: "Managed Services",
    title: "Managed Help Desk & End-User Support",
    tagline: "Responsive IT support — exactly when your users need it.",
    body: "User productivity depends on fast, reliable IT support. SBS manages your help desk function end-to-end — handling incidents, service requests, and escalations with defined SLAs, consistent quality, and full visibility into performance.",
    bullets: [
      "Multi-channel support: phone, email, chat, on-site",
      "Tiered support model (L1, L2, L3)",
      "Defined response and resolution SLAs",
      "Self-service knowledge base setup and management",
      "Monthly ticket analysis and trend reporting",
      "User satisfaction tracking and reporting",
    ],
    image: s6,
  },
  {
    n: "07",
    icon: Cloud,
    group: "Managed Services",
    title: "Managed Cloud Services",
    tagline: "Get maximum value from your cloud investment.",
    body: "Cloud environments that aren't actively managed quickly become expensive, insecure, and inefficient. SBS manages your cloud operations on an ongoing basis — optimizing performance, controlling costs, ensuring security, and maintaining governance.",
    bullets: [
      "Cloud health monitoring and performance management",
      "Cost optimization and rightsizing",
      "Security posture management and compliance reporting",
      "Backup and disaster recovery management",
      "Platform updates and release management",
    ],
    image: cloudServicesAsset.url,
  },
  {
    n: "08",
    icon: AppWindow,
    group: "Managed Services",
    title: "Application Managed Services",
    tagline: "Keep your business-critical applications running at their best.",
    body: "Mission-critical applications require ongoing care — monitoring, patching, enhancements, and user support. SBS provides end-to-end application managed services that ensure your platforms perform reliably and continue to evolve alongside your business needs.",
    bullets: [
      "Application monitoring and availability management",
      "Bug fixes, patches, and routine updates",
      "Minor enhancements and configuration changes",
      "Vendor liaison and escalation management",
      "Monthly application health reports",
    ],
    image: s8,
  },
];

const why = [
  { icon: Layers, title: "A Deep Bench of Certified Professionals", body: "SBS maintains a roster of 200+ technology professionals across 20+ disciplines. Every individual is technically vetted, reference-checked, and certified in their area of expertise. When we commit to a deployment, we deliver." },
  { icon: Zap, title: "Speed of Deployment", body: "We understand that resource gaps create urgency. Our standard deployment time is 5–10 business days for individual resources — with the ability to mobilize faster for critical needs. You don't wait months for the right person." },
  { icon: FileCheck, title: "SLA-Backed Managed Services", body: "Our managed services are governed by clear, contractual SLAs covering availability, response times, and resolution targets. We report against them every month — and we're accountable when we fall short." },
  { icon: Handshake, title: "Single Point of Accountability", body: "Whether you're using staff augmentation, managed services, or both — you deal with one account team, one contract, and one escalation path. No finger-pointing between vendors. No gaps in ownership." },
  { icon: Briefcase, title: "Flexible Engagement Models", body: "We offer time-and-materials, fixed-fee, and dedicated team models. Contracts can be structured monthly, quarterly, or annually — with the flexibility to scale up or down as your needs evolve." },
  { icon: Sparkles, title: "Seamless Integration with Your Culture", body: "Our professionals don't just bring technical skills — they bring professionalism, communication skills, and a client-first mindset. They integrate with your team, respect your culture, and represent your organization well." },
];

const stats: { value: number; suffix: string; l: string }[] = [
  { value: 200, suffix: "+", l: "Professionals Deployed Across Client Organizations" },
  { value: 10, suffix: " days", l: "Average Deployment Time (5–10 Business Days)" },
  { value: 99.5, suffix: "%", l: "Managed Services Uptime SLA" },
  { value: 90, suffix: "%+", l: "Staff Augmentation Retention Rate" },
  { value: 20, suffix: "+", l: "Technology Disciplines Covered" },
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
  const display = Number.isInteger(to) ? Math.round(val) : val.toFixed(1);
  return <>{display}</>;
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
            <Counter to={s.value} start={inView} />{s.suffix}
          </div>
          <div className="mt-3 text-xs leading-snug text-white/70">{s.l}</div>
        </div>
      ))}
    </div>
  );
}

const faqs = [
  { q: "How quickly can SBS deploy a resource?", a: "In most cases, we can deploy a pre-vetted professional within 5 to 10 business days. For urgent requirements, we have an accelerated process that can reduce this significantly." },
  { q: "What happens if a deployed resource isn't the right fit?", a: "We stand behind our placements with a replacement guarantee. If a resource doesn't meet your expectations within an agreed period, we will replace them at no additional cost." },
  { q: "Can we transition a staff augmentation resource to a permanent hire?", a: "Yes. Many of our clients convert augmented resources to permanent employees. We support this transition and can discuss commercial terms for conversion." },
  { q: "How are managed services SLAs measured and reported?", a: "We provide monthly service reports covering all SLA metrics — availability, response times, resolution times, and open incident aging. You always have full visibility into our performance." },
  { q: "Can we use both staff augmentation and managed services together?", a: "Absolutely. Many clients combine both models — for example, using managed services for infrastructure and helpdesk while augmenting their internal team with specialized project resources. SBS provides a unified account management model across both." },
  { q: "Do you provide resources for on-site, remote, or hybrid arrangements?", a: "All three. We tailor the working arrangement to your preferences and the nature of the role." },
];

export default function StaffAug() {
  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-background pt-20">
        <div className="absolute inset-0">
          <img src={heroImg} alt="SBS certified technology professionals" className="absolute inset-0 h-full w-full object-cover" />
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
                <Users className="h-3.5 w-3.5" /> Staff Augmentation & Managed Services
              </span>
              <h1 className="mt-6 text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                The Right Talent. The Right Support.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Exactly When and How You Need It.
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/75 md:text-lg">
                Scale your team with certified technology professionals on demand — or hand off your IT operations entirely to SBS. Either way, you get the expertise, reliability, and accountability your business requires to operate and grow with confidence.
              </p>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Find the Right Talent <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  Explore Managed Services
                </a>
              </div>
              <p className="mt-5 text-xs text-white/60">
                Most resources deployed within 5–10 business days. SLA-backed managed services from day one.
              </p>
            </motion.div>
          </section>
        </div>
      </main>

      {/* THE CHALLENGE */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-[#0a0e1a] px-6 py-20 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" /> The Challenge
            </span>
            <h2 className="mx-auto mt-6 max-w-4xl text-3xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
              Technology Demands Are Growing.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                The Talent to Meet Them Isn't.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              The technology skills shortage is a global crisis — and it's getting worse. Organizations are struggling to find, hire, and retain the specialized professionals they need to run their IT operations and deliver critical projects. At the same time, the day-to-day management of IT environments is consuming the bandwidth of internal teams who should be focused on strategic work, not keeping the lights on.
            </p>
            <p className="mx-auto mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/50">
              The result?
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
            There is a better model. <span className="font-semibold text-white">SBS provides it.</span>
          </p>
        </div>
      </section>

      {/* OUR APPROACH — TWO MODELS */}
      <section className="relative bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
              Our Approach — Two Models. One Trusted Partner.
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Flexible Engagement Models</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Designed Around Your Needs.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              SBS offers two complementary service models that can be deployed independently or combined for maximum impact.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {models.map((m) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.n}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:border-transparent hover:shadow-[0_20px_50px_-15px_rgba(56,189,248,0.35)]"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(74,222,128,0.08))" }}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
                        Model {m.n} — {m.tag}
                      </p>
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-foreground">{m.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                    <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Best for</p>
                      <p className="mt-2 text-sm text-foreground">{m.best}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="mx-auto mt-10 max-w-3xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            Both models come with a <span className="font-semibold text-foreground">single point of contact</span>, transparent reporting, and the full backing of SBS's technical bench and management infrastructure.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative bg-[#0a0e1a] px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--brand-blue)]">
              What We Offer
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Our Staff Augmentation &{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Managed Services.
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
                        {s.group} · Service {s.n}
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
              The SBS Advantage
            </p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              <span style={{ color: "var(--brand-dark)" }}>Talent, Technology, and</span>{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Total Accountability.
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
              Trusted by Organizations That Can't Afford Downtime.
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
            Let's Build or Manage Your Technology{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Capability — Starting Now.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Whether you need one specialist, a full team, or a trusted partner to run your IT operations — SBS can deliver. Share your requirements and we'll respond with a tailored proposal within 48 hours.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Tell Us What You Need <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#form"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Book a Consultation
            </a>
          </div>
          <p className="mt-5 text-xs text-white/60">
            Fast response. No pressure. Tailored to your specific situation.
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
