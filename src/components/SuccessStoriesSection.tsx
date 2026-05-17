import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import caseErp from "@/assets/case-erp.jpg";
import caseHealthcare from "@/assets/case-healthcare.jpg";
import caseFintech from "@/assets/case-fintech.jpg";

type Story = {
  quote: string;
  name: string;
  company: string;
  image: string;
};

const stories: Story[] = [
  {
    quote:
      "Their team managed a full ERP migration seamlessly, providing us with unified reporting and automated workflows.",
    name: "Ahmed Al-Mansoori",
    company: "Global Logistics Corp",
    image: caseErp,
  },
  {
    quote:
      "Their healthcare transformation framework secured our data and enhanced our clinical efficiency by 40%.",
    name: "Dr. Sarah Jenkins",
    company: "Prime Care Hospitals",
    image: caseHealthcare,
  },
  {
    quote:
      "They handle our cybersecurity posture and infrastructure scaling, letting us focus on core business growth.",
    name: "Michael Chang",
    company: "FinTech Solutions",
    image: caseFintech,
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="relative overflow-hidden bg-[#0a1628] px-6 py-24 md:px-12 md:py-32">
      {/* Header */}
      <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--brand-green)" }}
          />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Success Stories
          </span>
        </div>

        <h2 className="mt-8 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          <span className="text-white">Case </span>
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Studies
          </span>
        </h2>

        <p className="mt-4 text-base text-white/60 md:text-lg">
          Real Results from Real Organizations
        </p>
      </div>

      {/* Cards */}
      <div className="mx-auto mt-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stories.map((story, i) => (
          <motion.article
            key={story.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
            className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={story.image}
                alt={story.company}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-1 flex-col p-7">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-current"
                    style={{ color: "var(--brand-green)" }}
                  />
                ))}
              </div>

              <p className="mt-5 flex-1 text-base leading-relaxed text-white/85">
                &ldquo;{story.quote}&rdquo;
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="text-base font-bold text-white">{story.name}</div>
                <div
                  className="mt-1 text-sm font-semibold"
                  style={{ color: "var(--brand-green)" }}
                >
                  {story.company}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* See all button */}
      <div className="mt-14 flex justify-center">
        <button
          className="inline-flex items-center gap-3 rounded-full px-9 py-4 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
          style={{ background: "var(--gradient-brand)" }}
        >
          See all case studies
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
