import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const categories = ["All", "Healthcare", "ERP", "Cybersecurity", "Implementation"];

const caseStudies = [
  {
    title: "Digital Transformation for a Multi-Site Hospital Network",
    excerpt:
      "Discover how a regional hospital group unified patient records, streamlined clinical workflows, and improved care coordination across 12 facilities.",
    category: "Healthcare",
  },
  {
    title: "ERP Rollout for a Manufacturing & Trading Enterprise",
    excerpt:
      "Learn how an integrated ERP platform transformed inventory, procurement, and financial visibility for a growing manufacturing business.",
    category: "ERP",
  },
  {
    title: "Cybersecurity Resilience for a Healthcare Provider",
    excerpt:
      "See how a comprehensive security assessment and monitoring program helped protect sensitive patient data and ensure regulatory compliance.",
    category: "Cybersecurity",
  },
  {
    title: "End-to-End Implementation of a Cloud-Native HIS",
    excerpt:
      "Explore the journey of deploying a modern hospital information system with full interoperability and EMRAM-aligned workflows.",
    category: "Implementation",
  },
  {
    title: "Revenue Cycle Optimization for a Large Clinic Group",
    excerpt:
      "Find out how automated billing and claims management reduced revenue leakage and accelerated cash flow for a multi-clinic operator.",
    category: "Healthcare",
  },
  {
    title: "Microsoft Dynamics 365 for Distribution Operations",
    excerpt:
      "A case study on centralizing logistics, warehousing, and order management with Dynamics 365 Business Central.",
    category: "ERP",
  },
  {
    title: "AI Imaging Pilot for a Radiology Department",
    excerpt:
      "How AI-assisted imaging tools improved diagnostic accuracy, reduced reporting time, and supported clinical decision-making.",
    category: "Healthcare",
  },
  {
    title: "Compliance Roadmap for UAE Healthcare Regulations",
    excerpt:
      "A practical example of aligning hospital systems with UAE and GCC interoperability standards for sustainable digital maturity.",
    category: "Implementation",
  },
];

function CoverPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[oklch(0.62_0.13_230)] to-[oklch(0.78_0.17_145)] ${className ?? ""}`}
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -left-1/4 -top-1/4 h-full w-full rounded-full bg-white/30 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 h-full w-full rounded-full bg-white/20 blur-3xl" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand-blue)" }}>
              Success Stories
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Our <span style={{ color: "var(--brand-blue)" }}>Case Studies</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Real-world outcomes from healthcare, ERP, and technology engagements across the region.
            </p>
          </motion.div>

          {/* Category filter */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {categories.map((cat, idx) => (
              <button
                key={cat}
                type="button"
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  idx === 0
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-card-foreground hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Case Studies grid */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudies.map((study, idx) => (
              <motion.article
                key={study.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                custom={idx}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="flex flex-col p-6 md:p-8">
                  <span
                    className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--brand-green)", background: "oklch(0.72 0.17 145 / 0.12)" }}
                  >
                    {study.category}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)] md:text-2xl">
                    {study.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground md:text-base">{study.excerpt}</p>
                  <a
                    href="#"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: "var(--brand-blue)" }}
                  >
                    See more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
                <CoverPlaceholder className="aspect-[16/9] w-full" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
