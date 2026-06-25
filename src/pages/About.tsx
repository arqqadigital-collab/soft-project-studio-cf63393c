import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Eye,
  Sparkles,
  Building2,
  Layers,
  Stethoscope,
  Handshake,
  Rocket,
} from "lucide-react";
import aboutHeroVideo from "@/assets/about-hero.mp4";
import { Footer } from "@/components/Footer";
import { CtaSection } from "@/components/CtaSection";

const journey = [
  {
    icon: Building2,
    title: "Foundation",
    body: "SBS was established to help organisations solve operational challenges through smart, scalable technology solutions.",
  },
  {
    icon: Layers,
    title: "Expansion",
    body: "We evolved into a full-service provider, delivering ERP implementation, system integration, and process automation across industries.",
  },
  {
    icon: Stethoscope,
    title: "Healthcare Focus",
    body: "SBS expanded into healthcare, providing solutions such as HIS, EMR, PACS, and RCM systems, strengthening our industry specialisation.",
  },
  {
    icon: Handshake,
    title: "Strategic Partnerships",
    body: "Collaborations with platforms like Odoo and Microsoft Dynamics 365 enabled us to deliver enterprise-grade, flexible solutions.",
  },
  {
    icon: Rocket,
    title: "Today",
    body: "We continue to drive digital transformation through integrated systems, automation, and data-driven solutions that help organisations scale and innovate.",
  },
];

export default function About() {
  return (
    <>
      <main className="pt-20 relative min-h-[90vh] w-full overflow-hidden bg-background">
        <div className="absolute inset-0">
          <video
            src={aboutHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        </div>

        <div className="relative z-10 flex min-h-[90vh] flex-col">
          <section className="flex flex-1 items-center justify-center px-6 pb-32 pt-4 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto flex max-w-4xl flex-col items-center text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> About SBS
              </span>
              <h1 className="mt-6 text-2xl font-bold leading-[1.15] tracking-tight text-white md:text-4xl lg:text-5xl">
                Empowering Organizations Through{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                >
                  Intelligent Technology Solutions
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
                By combining ERP expertise, healthcare system integration, and enterprise
                consulting, SBS helps organisations transform fragmented processes into connected,
                intelligent ecosystems.
              </p>
            </motion.div>
          </section>
        </div>
      </main>

      <section className="relative z-20 -mt-16 rounded-t-[2.5rem] bg-white px-6 pb-24 pt-24 shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)] md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
              SBS is a specialised provider of enterprise software solutions, healthcare
              technologies, and digital transformation services designed to help organisations
              modernise operations, improve efficiency, and unlock data-driven decision-making.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[
              {
                icon: Target,
                title: "Our Mission",
                body: "To help organisations leverage technology as a strategic asset, enabling operational excellence, automation, and data-driven growth.",
              },
              {
                icon: Eye,
                title: "Our Vision",
                body: "To become a leading regional provider of integrated enterprise and healthcare technology solutions, empowering organisations with scalable, intelligent systems.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-10 transition-shadow hover:shadow-[var(--shadow-brand)]"
              >
                <div
                  className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20"
                  style={{ background: "var(--gradient-brand)" }}
                />
                <div
                  className="inline-flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-[var(--shadow-brand)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <item.icon className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-foreground">{item.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-foreground/75">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="px-6 py-24 md:px-12"
        style={{ background: "color-mix(in oklab, var(--brand-blue) 4%, var(--background))" }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--brand-blue)]">
              Our Journey
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              From Vision to Trusted Technology Partner
            </h2>
          </div>

          <div className="relative mt-20">
            <div
              className="absolute left-8 top-0 h-full w-px md:left-1/2 md:-translate-x-1/2"
              style={{ background: "var(--gradient-brand)", opacity: 0.25 }}
            />

            <div className="space-y-12">
              {journey.map((step, i) => {
                const Icon = step.icon;
                const isRight = i % 2 === 1;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className={`relative flex items-start gap-6 md:items-center ${isRight ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="absolute left-8 z-10 -translate-x-1/2 md:left-1/2" aria-hidden>
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-background text-white shadow-[var(--shadow-brand)]"
                        style={{ background: "var(--gradient-brand)" }}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                    </div>

                    <div className="hidden md:block md:w-1/2" />

                    <div className="ml-24 w-full md:ml-0 md:w-1/2 md:px-12">
                      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
                        <h3 className="text-xl font-bold text-foreground md:text-2xl">
                          {step.title}
                        </h3>
                        <p className="mt-3 text-base leading-relaxed text-foreground/75">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-6 py-24 md:px-12"
        style={{ backgroundColor: "#091628" }}
      >
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Building the Future with{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Intelligent Systems
            </span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-white/80">
            As organizations continue to navigate digital transformation, the need for{" "}
            <strong className="text-white">integrated, scalable, and intelligent systems</strong>{" "}
            has never been greater.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/80">
            SBS remains committed to helping organizations adopt technologies that enhance
            efficiency, strengthen decision-making, and create long-term competitive advantage.
          </p>

          <div className="mt-12 inline-flex flex-col items-center gap-6">
            <p className="max-w-2xl text-base font-medium text-white/90 md:text-lg">
              Looking to modernize your operations with smarter technology solutions? Connect with
              SBS to explore how our expertise can support your organization's digital
              transformation journey.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Connect With SBS
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <CtaSection />
      <Footer />
    </>
  );
}
