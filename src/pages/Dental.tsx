import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  Smile,
  ClipboardList,
  CalendarCheck,
  Scan,
  BellRing,
  FileSignature,
  ShieldCheck,
  Receipt,
  Users,
  Activity,
  FlaskConical,
  UserCog,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import dentalHeroVideo from "@/assets/dental/dental-hero.mp4.asset.json";
import problem1 from "@/assets/dental/problem-1.jpg";
import problem2 from "@/assets/dental/problem-2.jpg";
import problem3 from "@/assets/dental/problem-3.jpg";
import problem4 from "@/assets/dental/problem-4.jpg";
import problem5 from "@/assets/dental/problem-5.jpg";
import problem6 from "@/assets/dental/problem-6.jpg";
import preVisitOnlineBooking from "@/assets/dental/journey/pre-visit-online-booking.png.asset.json";
import checkInReception from "@/assets/dental/journey/check-in-reception.png.asset.json";
import examinationCharting from "@/assets/dental/journey/examination-charting.png.asset.json";
import treatmentPlanApproval from "@/assets/dental/journey/treatment-plan-approval.png.asset.json";
import treatmentDeliveredDocumented from "@/assets/dental/journey/treatment-delivered-documented.png.asset.json";
import claimPaymentRecallSet from "@/assets/dental/journey/claim-payment-recall-set.png.asset.json";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";
import { MainNav } from "@/components/MainNav";
import dentalCtaVideo from "@/assets/dental/dental-cta.mp4.asset.json";

function AnimatedStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const hasNumber = !!match;
  const prefix = match?.[1] ?? "";
  const numStr = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const end = hasNumber ? parseFloat(numStr) : 0;
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;
  const [display, setDisplay] = useState(hasNumber ? (0).toFixed(decimals) : value);

  useEffect(() => {
    if (!hasNumber || !inView) return;
    const controls = animate(0, end, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, hasNumber, end, decimals]);

  if (!hasNumber) return <span ref={ref}>{value}</span>;
  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const problems = [
  { title: "Paper Charts Steal Chair Time", image: problem1, body: "Dentists spend the last 20 minutes of every appointment updating paper charts instead of talking to patients about treatment, prevention, and next steps." },
  { title: "Verbal Treatment Plans", image: problem2, body: "Plans presented at the chair without written estimates or formal approval — leading to billing disputes, patient confusion, and revenue loss." },
  { title: "Recalls Drifting Away", image: problem3, body: "Manual recall management means patient lists go months out of date and patients quietly drift between acute episodes." },
  { title: "Imaging Lives Elsewhere", image: problem4, body: "Radiographs scattered across envelopes, folders, and disconnected viewers — forcing the dentist to switch systems mid-appointment." },
  { title: "Rejected Insurance Claims", image: problem5, body: "Claims submitted manually with missing tooth codes or clinical justification — rejected and resubmitted weeks later from a spreadsheet." },
  { title: "No Multi-Chair Visibility", image: problem6, body: "No real-time view of which chair is busy, which practitioner is running late, or which patient has been waiting too long." },
];

const features = [
  { icon: Smile, title: "Digital Dental Charting", body: "Interactive chart that maps every tooth in real time. Record restorations, caries, missing teeth, RCT, crowns, bridges, implants, periodontal conditions — surface by surface with clicks and color codes. Full periodontal charting built in: six-point pocket depth, BoP, recession, furcation, mobility, BPE." },
  { icon: FileSignature, title: "Treatment Planning & Approvals", body: "Build multi-stage treatment plans directly from the digital chart. Procedures link automatically to your fee schedule for itemized, real-time cost estimates. Alternative options presented side by side. Patient approvals captured digitally with timestamped consent." },
  { icon: CalendarCheck, title: "Chair & Practitioner Scheduling", body: "Visual, color-coded scheduler shows every chair, practitioner, and slot. Drag-and-drop booking. Conflicts prevented automatically. Automated SMS, email, and WhatsApp reminders — reducing no-shows without a single phone call." },
  { icon: Scan, title: "Radiograph & Image Management", body: "DICOM-integrated periapical, bitewing, panoramic, and CBCT imaging — auto-attached to teeth and treatment plans. Intraoral and clinical photographs in the same record. Pre/post comparisons built in. Integrated CBCT viewer inside the chart." },
  { icon: BellRing, title: "Automated Recall & Communication", body: "Never manage a recall list manually again. Patients are tracked automatically for examinations, hygiene, perio maintenance, and ongoing treatment with multi-channel reminders." },
  { icon: ShieldCheck, title: "Insurance & Pre-Authorization", body: "Generate insurer-ready claims directly from the clinical record — correct tooth codes, clinical justification, and attachments. Submit electronically and track adjudication in real time." },
  { icon: Receipt, title: "Billing & Patient Accounts", body: "Itemized invoicing, installment plans, multi-modal payments, and reconciliation against patient accounts. Outstanding balances and aging AR tracked in real time." },
  { icon: Activity, title: "Periodontal Management Program", body: "Structured periodontal care — staging, active therapy, SPT scheduling, and long-term recall. Pocket depth and bleeding scores tracked longitudinally with graphical comparisons." },
  { icon: FlaskConical, title: "Dental Laboratory Management", body: "Digital lab prescriptions with shade, material, dimensions, and instructions. Track cases from despatch to fit. Reconcile invoices against orders. Monitor turnaround by lab and case type." },
  { icon: UserCog, title: "Staff Management & Governance", body: "Manage practitioner schedules, leave, CPD records, and clinical governance reporting. Audit trails on every record. Role-based access aligned to your clinical structure." },
  { icon: Users, title: "Multi-Site Group Practices", body: "Patients move between branches with one continuous record. Group leadership gets unified analytics across every location while each site keeps its own configuration." },
  { icon: ClipboardList, title: "Paperless Patient Onboarding", body: "Digital medical history, consent, and registration forms sent before the appointment — completed at home and ready before the patient walks in." },
];

const journey = [
  { icon: ClipboardList, title: "Pre-Visit & Online Booking", image: preVisitOnlineBooking.url, body: "Patient books online or via reception. Digital medical history, consent, and registration forms are sent and completed before arrival." },
  { icon: Users, title: "Check-In & Reception", image: checkInReception.url, body: "Patient checks in at reception or self-service kiosk. The record opens with full history, outstanding plan items, recalls, medical alerts, and insurance visible to the team." },
  { icon: Smile, title: "Examination & Charting", image: examinationCharting.url, body: "Dentist conducts the exam with the digital chart on the chairside screen. Radiographs auto-appear in the record. Clinical photos attach to the relevant teeth." },
  { icon: FileSignature, title: "Treatment Plan & Approval", image: treatmentPlanApproval.url, body: "A plan is built from the findings. Costs calculate automatically. The patient reviews, asks questions, and approves digitally — a copy is sent immediately." },
  { icon: CheckCircle2, title: "Treatment Delivered & Documented", image: treatmentDeliveredDocumented.url, body: "Completed procedures are marked on the chart. Structured templates and voice input speed up notes. Post-op instructions are delivered digitally. Charges post automatically." },
  { icon: Receipt, title: "Claim, Payment & Recall Set", image: claimPaymentRecallSet.url, body: "Insurance claims submitted electronically. Payment processed and receipted. The patient's next recall is scheduled, reminders set, and they leave with a complete record." },
];

const stats = [
  { value: "32%", label: "Reduction in chairside admin time after going digital" },
  { value: "2.3x", label: "More treatment plans formally approved with digital consent workflows" },
  { value: "91%", label: "First-pass dental claim acceptance with integrated insurance workflows" },
  { value: "45%", label: "Increase in recall attendance with automated multi-channel reminders" },
  { value: "100%", label: "Paperless charting from day one of go-live" },
  { value: "<2 weeks", label: "Average single-clinic deployment from kick-off to go-live" },
];

const integrationGroups = [
  { title: "Digital Imaging", items: ["Carestream", "Dentsply Sirona", "Planmeca", "Acteon", "Apteryx", "Vatech", "Romexis", "All DICOM-compliant systems"] },
  { title: "Intraoral Cameras", items: ["Carestream CS 3700", "DEXIS", "Sirona Schick", "Apteryx XVWeb", "TWAIN/DICOM compliant cameras"] },
  { title: "Accounting & Payments", items: ["Xero", "QuickBooks", "Sage", "Stripe", "Network International", "Telr", "REST API"] },
  { title: "Insurance Payers", items: ["GCC dental payers", "DHA Dubai", "DOH Abu Dhabi", "NPHIES Saudi Arabia", "Custom EDI / API"] },
  { title: "Standards", items: ["DICOM 3.0", "HL7 FHIR", "FDI & Universal Tooth Numbering", "ISO Dental Codes", "ICD-10", "WhatsApp Business API"] },
];

const faqs = [
  { q: "How does the system handle treatment across multiple visits within a single plan?", a: "Multi-visit treatment plans are managed through structured treatment sequencing. Each appointment is linked to the items scheduled for that visit. As appointments complete, items are marked done, the chart updates, and charges post automatically. Outstanding items remain visible on the patient's active plan with the next appointment linked. Complete progress — done, remaining, and scheduled — is visible at a glance." },
  { q: "Does the system support specialist referrals within a group practice?", a: "Yes. Internal referral workflows let general dentists refer patients to endodontists, periodontists, oral surgeons, orthodontists, and implantologists within the group — with clinical notes, radiographs, and plan context attached. The specialist receives the referral with full background and books the patient directly. Treatment outcomes flow back to the referring dentist's record automatically." },
  { q: "How does the laboratory management module work for external dental labs?", a: "Lab prescriptions are generated digitally from the treatment plan and transmitted electronically to your chosen lab. Case status is tracked from despatch through fabrication, return, and fit appointment. Invoices are reconciled against orders automatically and turnaround performance is reported by lab and case type." },
  { q: "Is the platform suitable for both single-chair clinics and multi-site groups?", a: "Yes. The platform scales from a single-chair practice to multi-branch dental groups. Single clinics deploy in 2 to 3 weeks. Multi-site groups deploy by location, with each site going live sequentially over 4 to 8 weeks depending on group size." },
  { q: "How is patient data protected and what compliance standards are supported?", a: "Role-based access, audit logs, encryption in transit and at rest, and configurable data residency. The platform supports HIPAA, GDPR, and GCC-region data protection requirements with full audit trails on every record." },
  { q: "What training and onboarding support is provided?", a: "A dedicated onboarding specialist manages setup, data migration, hardware integration, staff training, and go-live support for every account. Pre-go-live training is role-based and post-go-live support is provided through a dedicated team with SLA-defined response times." },
];

function ExpandingJourney({ steps }: { steps: typeof journey }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-14 flex flex-col gap-3 md:h-[520px] md:flex-row md:gap-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = active === i;
        return (
          <motion.div
            key={step.title}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            animate={{ flexGrow: isActive ? 4 : 1 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full"
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.38)_0%,rgba(5,12,24,0.72)_50%,rgba(5,12,24,0.95)_100%)]" aria-hidden="true" />
            <div className="relative flex h-full min-h-[320px] flex-col p-7">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <div className="mt-6 flex h-[calc(100%-3.5rem)] flex-col">
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: isActive ? 0.25 : 0 }}
                  className="flex-1"
                >
                  {isActive && (
                    <>
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Step {i + 1}</div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.body}</p>
                    </>
                  )}
                </motion.div>
                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/65">Step {i + 1}</div>
                    <h3 className="mt-2 text-lg font-semibold text-white md:text-xl">{step.title}</h3>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-semibold text-foreground md:text-lg">{q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 pr-9 text-sm leading-relaxed text-muted-foreground md:text-base">{a}</p>}
    </div>
  );
}

export default function Dental() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: problemProgress } = useScroll({
    target: problemRef,
    offset: ["start start", "end end"],
  });
  const problemX = useTransform(problemProgress, [0.15, 0.82], ["0%", "-83.3333%"]);

  return (
    <>
      {/* HERO */}
      <main className="relative min-h-[90vh] w-full overflow-hidden bg-[var(--brand-dark)]">
        <div className="absolute inset-0">
          <video
            src={dentalHeroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/85" />
        </div>
        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <header className="flex items-center justify-between px-6 py-6 md:px-12">
            <Link to="/">
              <img src={logo} alt="SBS — Superior Business Solutions" className="h-12 w-auto md:h-14" />
            </Link>
            <MainNav />
            <Link
              to="/"
              className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get Started
            </Link>
          </header>

          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
                Every Smile Starts With a{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Smarter Practice.
                </span>
              </h1>

              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Build a Smarter Dental Practice <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See a Live Demo
                </a>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRODUCING */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Introducing Secreta Dental
          </p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>One Unified Platform for</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Modern Dental Practices
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A full-featured dental management system covering everything from chair-side charting to final payment.
            Built for modern dental clinics that want to deliver exceptional patient care while running a seamless,
            paperless, and financially optimized practice.
          </p>
        </div>
      </section>

      {/* PROBLEM — horizontal scroll on dark */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "360vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-2xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
              Running a Dental Practice Has Never Been{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                More Complex.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Most systems were not built for where dentistry is today. Dentistry is a precision discipline. Your
              practice management platform should be too.
            </p>
          </div>

          <div className="mt-8 flex flex-1 items-center overflow-hidden pb-16 md:mt-10 md:pb-24">
            <motion.div style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problems.map((card, i) => (
                <article
                  key={card.title}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] shadow-2xl ring-1 ring-white/10 md:w-[420px] lg:w-[460px]"
                >
                  <div className="relative h-[170px] w-full shrink-0 overflow-hidden md:h-[190px]">
                    <img
                      src={card.image}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                      0{i + 1} — Risk
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-tight text-white md:text-xl">{card.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">{card.body}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUTION / FEATURES */}
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              The Platform
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Everything Your Dental Practice Needs — in One Unified Platform.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the moment a patient books their first appointment to the moment their treatment plan is complete and their account is settled — Secreta Dental manages every clinical and administrative workflow in one intuitive system.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.article
                  key={f.title}
                  initial={{ opacity: 0, y: 36, scale: 0.97, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  whileHover={{ y: -6 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45, delay: i * 0.05 + 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)] transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              How It Works
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              A Seamless Patient Journey — End to End.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From the first online booking to the final settled invoice — every step connected, every record current.
            </p>
          </div>
          <ExpandingJourney steps={journey} />
        </div>
      </section>

      {/* STATS */}
      <section
        className="px-6 py-24 md:px-12"
        style={{
          background: "linear-gradient(135deg, var(--brand-dark) 0%, #0d2a52 100%)",
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Outcomes</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Outcomes Dental Practices Across Our Network Are Achieving.
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"
              >
                <div
                  className="bg-clip-text text-5xl font-bold text-transparent md:text-6xl"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <AnimatedStat value={s.value} />
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="bg-background px-6 py-24 md:px-12 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              Integrations
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Connects With Your Equipment, Insurers, and Business Systems.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              Clinical and financial data flows where it needs to go — without manual import, duplication, or reconciliation.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {integrationGroups.map((g) => (
              <div key={g.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--brand-blue)]">
                  {g.title}
                </h3>
                <ul className="mt-4 space-y-2">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-foreground/75">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-blue)]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Common Questions</h2>
          </div>
          <div className="mt-12">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        id="contact"
        className="relative overflow-hidden px-6 py-28 md:px-12 md:py-36"
        style={{ backgroundColor: "#091628" }}
      >
        <div className="absolute inset-0">
          <video
            src={dentalCtaVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/85 via-[#091628]/75 to-[#091628]/90" />
        </div>
        <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-brand)", mixBlendMode: "soft-light" }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
            A Great Dental Practice Is Built on Great Clinical Care.{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              And Great Care Deserves Great Systems Behind It.
            </span>
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
            Every treatment plan, every radiograph, every recall, every claim — all of it either builds or erodes the practice you are working to create. Give your practice the platform it deserves.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Free Demo <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/55">
            No setup fees · No long-term contracts · Full onboarding & data migration support
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
