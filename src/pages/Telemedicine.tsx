import { useRef, useEffect, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Network,
  Video,
  CalendarClock,
  MessageSquare,
  FileText,
  Pill,
  Activity,
  Users,
  Monitor,
  Workflow,
} from "lucide-react";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import bgStepsLight from "@/assets/bg-steps-light.png";
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import journeyRegistration from "@/assets/his-journey/registration.png";
import journeyConsultation from "@/assets/his-journey/outpatient-consultation.png";
import journeyAdmission from "@/assets/his-journey/admission.png";
import journeyInpatient from "@/assets/his-journey/inpatient-care.png";
import journeyDischarge from "@/assets/his-journey/discharge.png";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

import { useHorizontalScroll } from "@/hooks/use-horizontal-scroll";

const features = [
  { icon: CalendarClock, title: "Virtual Appointment Scheduling", body: "Book, reschedule and cancel telemedicine appointments across providers, time zones and specialties. Automated reminders by SMS, email and WhatsApp reduce no-shows and ensure patients arrive prepared to their consultation link." },
  { icon: Video, title: "HD Video Consultations", body: "Secure, encrypted video calls purpose-built for clinical use — with in-call vitals sharing, image capture, screen share, session recording and structured post-call documentation baked in." },
  { icon: MessageSquare, title: "Asynchronous Messaging & Follow-up", body: "Structured messaging threads let patients ask follow-up questions and share photos or symptoms between visits. Every message is attached to the medical record and routed to the right clinician." },
  { icon: FileText, title: "Digital Consent & Intake", body: "Patients complete intake forms, screening questionnaires and informed consent from their phone before the visit begins — so clinical time is spent on care, not paperwork." },
  { icon: Pill, title: "e-Prescriptions & Digital Refills", body: "Prescribe directly from the virtual consult with drug interaction checks, allergy alerts and refill workflows — sent to the patient's pharmacy of choice or delivered digitally." },
  { icon: Activity, title: "Remote Vitals & Device Integration", body: "Connect patient-owned devices — blood pressure cuffs, glucometers, pulse oximeters, wearables — to stream vitals into the visit and the longitudinal record in real time." },
  { icon: Users, title: "Multi-Party & Family Consultations", body: "Add a translator, a specialist, a family member or a caregiver to any consult. Roles and permissions are managed inside the call — no third-party bridge required." },
];

const journey = [
  { icon: CalendarClock, title: "Patient Books Online", image: journeyRegistration, body: "The patient chooses a provider, specialty and time slot from any device. Insurance and payment are captured up front. A secure consultation link is issued instantly with reminders scheduled automatically." },
  { icon: FileText, title: "Digital Intake", image: journeyConsultation, body: "Before the call, the patient completes structured intake, uploads photos and signs digital consent. The clinician reviews the summary before the session starts — every minute of the visit spent on care, not admin." },
  { icon: Video, title: "Secure Video Consult", image: journeyAdmission, body: "Encrypted video begins on time with the full clinical record loaded, vitals streaming from connected devices, and in-call tools for imaging, screen share and note-taking." },
  { icon: Pill, title: "Diagnosis & e-Prescription", image: journeyInpatient, body: "The clinician documents the encounter with reusable templates, orders investigations and prescribes electronically — with drug safety checks running in the background at every order." },
  { icon: MessageSquare, title: "Follow-up & Continuous Care", image: journeyDischarge, body: "After the visit, patients access notes, prescriptions and educational content in their portal. Secure messaging keeps the care team connected until the next scheduled review." },
];

const stats = [
  { value: "52%", label: "Reduction in patient travel time replaced by virtual visits" },
  { value: "3x", label: "Increase in specialist reach across underserved regions" },
  { value: "40%", label: "Fewer no-shows compared with equivalent in-person appointments" },
  { value: "94%", label: "Patient satisfaction score across our telemedicine client network" },
];

const problemCards = [
  { title: "Consumer Video Isn't Clinical", image: problem1, body: "Consultations happening on consumer video apps with no clinical record, no consent trail and no way to prescribe safely — a compliance incident waiting to happen." },
  { title: "Fragmented Follow-Up", image: problem2, body: "A patient sees a virtual doctor once, then disappears — because there is no messaging channel, no follow-up workflow and no shared record with their local physician." },
  { title: "Prescriptions in Limbo", image: problem3, body: "A prescription written on video with no e-prescribing integration ends up as a screenshot the patient walks around with — with no audit trail and no pharmacy link." },
  { title: "Blind Vitals", image: problem4, body: "A clinician makes a treatment decision on a virtual call without any objective vitals — because the patient's home devices don't connect to any clinical system." },
  { title: "Unauditable Consultations", image: problem5, body: "A malpractice claim arrives months later with no recording, no structured notes and no consent — because the tool used for the visit was never designed for healthcare." },
];

const faqs = [
  { q: "Is the video platform HIPAA and GDPR compliant?", a: "Yes. All video traffic is end-to-end encrypted with per-session keys, tenant data is regionally hosted, and full audit trails are captured for every consult, message and prescription — aligned with HIPAA, GDPR and regional privacy regulations." },
  { q: "Can patients join a consultation without downloading an app?", a: "Yes. Patients can join any consultation directly from a modern browser on desktop or mobile. Native apps are available for patients and clinicians who prefer them, with the same features." },
  { q: "Does telemedicine integrate with our existing HIS or EMR?", a: "Yes. HL7 FHIR and REST integrations connect the telemedicine module to major HIS and EMR platforms — appointments, notes, orders and prescriptions flow into the existing patient record without duplicate entry." },
  { q: "How does e-prescribing work for virtual visits?", a: "Clinicians prescribe from inside the consult with built-in drug interaction and allergy checks. Prescriptions route to the patient's pharmacy of choice, and controlled substances follow local regulatory workflows including two-factor verification where required." },
  { q: "Can we run group or multi-party sessions?", a: "Yes. Translators, specialists, caregivers and family members can be added to any consult with role-based permissions. Group visits for chronic care and behavioral health are also supported." },
  { q: "Is the consultation recorded, and who controls the recording?", a: "Recording is optional and consent-based. Where enabled, recordings are stored securely and access is governed by role-based permissions with a full audit trail. Retention policies are configurable per tenant." },
  { q: "How quickly can we go live?", a: "Most healthcare organizations complete implementation in 3 to 6 weeks. Complex enterprise deployments with multiple HIS integrations and clinical workflow customizations may take longer. A dedicated implementation specialist is assigned to every account." },
];

const trustChips = [
  "Trusted across 30+ countries",
  "HIPAA & GDPR Aligned",
  "End-to-End Encrypted",
  "HL7 FHIR Native",
  "e-Prescribing Ready",
  "Multi-Language",
];

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

function ExpandingJourney({ steps }: { steps: typeof journey }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-14 flex flex-col gap-3 md:flex-row md:gap-4 md:h-[520px]">
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
            className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-border bg-card/70 md:h-full ${isActive ? "md:p-8" : "md:p-4"}`}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${step.image})` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,12,24,0.35)_0%,rgba(5,12,24,0.72)_48%,rgba(5,12,24,0.94)_100%)]" aria-hidden="true" />
            <div className={`relative flex h-full min-h-[320px] flex-col ${isActive ? "p-7" : "p-4"}`}>
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
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                        Step {i + 1}
                      </div>
                      <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">{step.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">{step.body}</p>
                    </>
                  )}
                </motion.div>

                {!isActive && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                      Step {i + 1}
                    </div>
                    <h3 className="mt-2 text-sm font-semibold leading-snug text-white md:text-base">
                      {step.title}
                    </h3>
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

export default function Telemedicine() {
  const problemRef = useRef<HTMLDivElement>(null);
  const { viewportRef: problemViewportRef, trackRef: problemTrackRef, x: problemX } = useHorizontalScroll(problemRef, [0.15, 0.82]);

  return (
    <>
      {/* HERO */}
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={hisHeroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,14,26,0.55) 0%, rgba(10,14,26,0.65) 60%, rgba(10,14,26,0.85) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-28 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-5xl flex-col items-center text-center"
            >
              <h1 className="whitespace-nowrap text-2xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                Care Without Walls.{" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                  Clinical-Grade Virtual Visits.
                </span>
              </h1>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  Launch Your Virtual Care Program <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  See It in Action
                </a>
              </div>

              <div className="mt-10 flex flex-nowrap items-center justify-center gap-3 overflow-x-auto pb-2">
                {trustChips.map((chip) => (
                  <span
                    key={chip}
                    className="shrink-0 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur md:text-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* INTRO */}
      <section className="relative z-20 -mt-12 rounded-t-[2.5rem] bg-background px-6 py-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>
            Built for Virtual Care
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight md:text-4xl lg:text-5xl">
            <span style={{ color: "var(--brand-dark)" }}>A Dedicated Platform for the </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              Full Virtual Care Journey.
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Consumer video apps were never built for medicine. Our Telemedicine & Virtual Care platform gives clinicians
            secure video, digital consent, e-prescribing, remote vitals and a real clinical record — connected to your
            HIS and EMR — so virtual visits are as safe, documented and reimbursable as visits inside the clinic walls.
          </p>
        </div>
      </section>

      {/* PROBLEM */}
      <section ref={problemRef} className="relative bg-[#0a0e1a]" style={{ height: "320vh" }}>
        <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden pb-12 md:pb-16">
          <div className="mx-auto w-full max-w-7xl px-6 pt-14 md:px-12 md:pt-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-300 ring-1 ring-red-500/20">
              <AlertTriangle className="h-3.5 w-3.5" /> The Problem
            </span>
            <h2 className="mt-5 max-w-5xl text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
              Consumer Tools Weren't Built for Clinical Care.{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
                Every Visit Is a Risk.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65">
              When virtual visits happen on tools designed for meetings, not medicine, the gaps show up as compliance
              incidents, unsafe prescriptions and patients lost to follow-up.
            </p>
          </div>

          <div ref={problemViewportRef} className="mt-6 flex flex-1 items-center overflow-hidden md:mt-8 scrollbar-hide">
            <motion.div ref={problemTrackRef} style={{ x: problemX }} className="flex items-stretch gap-6 px-6 md:gap-8 md:px-12">
              {problemCards.map((card, i) => (
                <article
                  key={i}
                  className="flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-[2rem] bg-[#0f1424] md:w-[440px] lg:w-[480px]"
                >
                  <div className="relative h-[190px] w-full overflow-hidden md:h-[210px]">
                    <img src={card.image} alt={card.title} loading="lazy" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424] via-[#0f1424]/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-red-300">
                      0{i + 1} — Risk
                    </span>
                    <h3 className="mt-3 text-xl font-bold leading-tight text-white md:text-2xl">{card.title}</h3>
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
              Every Tool a Modern Virtual Care Program Needs
            </h2>
            <p className="mt-5 text-base leading-relaxed text-foreground/70 md:text-lg">
              From booking through diagnosis, prescription and follow-up — every virtual interaction captured in a
              structured, connected clinical record.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-[var(--shadow-brand)]"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-[var(--shadow-brand)] transition-transform group-hover:scale-110"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{f.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="relative px-6 py-24 md:px-12"
        style={{
          backgroundImage: `url(${bgStepsLight})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <Workflow className="h-3.5 w-3.5" /> How It Works
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              The Complete Virtual Visit — Managed in One System
            </h2>
          </div>

          <ExpandingJourney steps={journey} />
        </div>
      </section>

      {/* METRICS */}
      <section className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div
          className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Outcomes</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Access, Efficiency and Satisfaction You Can Measure
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div
                  className="bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  <AnimatedStat value={s.value} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-3xl text-center text-sm text-white/70 md:text-base">
            Zero unencrypted consultations. 100% of visits documented in the patient's clinical record with structured
            notes and consent captured before the session.
          </p>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
            <Network className="h-3.5 w-3.5" /> Integrations
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Connected to Your Clinical and Financial Ecosystem
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-foreground/70 md:text-lg">
            The telemedicine platform integrates natively with your HIS, EMR, LIS, pharmacy network and payer systems
            over HL7 FHIR — so virtual visits create the same complete record as in-person visits, and reimburse the
            same way.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {["HL7 FHIR", "HIPAA", "GDPR", "e-Prescribing"].map((label) => (
              <span
                key={label}
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground/80"
              >
                {label}
              </span>
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
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--brand-blue)]">
              <ShieldCheck className="h-3.5 w-3.5" /> FAQ
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Common Questions</h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-card p-6 transition-shadow open:shadow-[var(--shadow-brand)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left">
                  <span className="flex items-start gap-3 text-base font-semibold text-foreground md:text-lg">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-blue)]" />
                    {f.q}
                  </span>
                  <span
                    className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground/60 transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 pl-8 text-sm leading-relaxed text-foreground/75 md:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-12" style={{ backgroundColor: "#091628" }}>
        <div className="absolute inset-0">
          <video
            src={hisCtaVideo.url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#091628]/75 via-[#091628]/65 to-[#091628]/85" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Virtual Care Starts With{" "}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>
              a Platform Built for Medicine.
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/85">
            Every virtual visit carries the same duty of care as an in-clinic one. Give your clinicians the tools to
            deliver it safely — with encrypted video, structured notes, e-prescribing and real integration into the
            patient's record.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Book Your Free Demo <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/15"
            >
              Start a 30-Day Trial
            </a>
          </div>

          <p className="mt-8 text-sm italic text-white/70">
            No setup fees. No long-term contracts. Dedicated support from day one.
          </p>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
