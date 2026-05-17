import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import healthcare from "@/assets/service-healthcare-compliance.png";
import erp from "@/assets/service-erp.png";
import ai from "@/assets/service-ai-healthcare.png";
import staff from "@/assets/service-staff.png";
import integration from "@/assets/service-integration.png";

type Service = {
  number: string;
  title: string;
  description: string;
  image: string;
};

const services: Service[] = [
  {
    number: "Service 01",
    title: "Healthcare Compliance",
    description:
      "Ensure your operations strictly adhere to DHA, DoH, ADHICS, and regional healthcare standards.",
    image: healthcare,
  },
  {
    number: "Service 02",
    title: "ERP Implementation & Optimization",
    description:
      "Tailored deployment and continuous enhancement of enterprise systems to streamline your operations.",
    image: erp,
  },
  {
    number: "Service 03",
    title: "AI Healthcare Transformation",
    description:
      "Leverage artificial intelligence to optimize clinical workflows and drive medical innovation.",
    image: ai,
  },
  {
    number: "Service 04",
    title: "Staff Augmentation & Managed Services",
    description:
      "Scale your teams rapidly with specialized IT professionals and comprehensive managed support solutions.",
    image: staff,
  },
  {
    number: "Service 05",
    title: "Implementation & Integration",
    description:
      "Seamlessly connect disparate systems to create a unified, data-driven technological ecosystem.",
    image: integration,
  },
];

export function ServicesSection() {
  const [active, setActive] = useState(0);
  const current = services[active];

  const next = () => setActive((i) => (i + 1) % services.length);
  const prev = () => setActive((i) => (i - 1 + services.length) % services.length);

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Our Services
          </motion.p>
          <motion.h2
            className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <span style={{ color: "var(--brand-dark)" }}>Solutions Built for </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Impact
            </span>
          </motion.h2>
        </motion.div>

        {/* Main feature card */}
        <motion.div
          className="relative mt-16 overflow-hidden rounded-[2.5rem] shadow-2xl"
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div className="relative h-[520px] md:h-[620px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image}
                alt={current.title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

            {/* Arrows */}
            <div className="absolute right-6 top-6 flex gap-2 md:right-10 md:top-10">
              <button
                onClick={prev}
                aria-label="Previous service"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next service"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center p-8 pb-32 md:p-16 md:pb-40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="inline-flex items-center rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
                    {current.number}
                  </span>
                  <h3 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">
                    {current.title.split(" ").map((word, wi, arr) => (
                      <span key={wi} className="inline-block whitespace-nowrap">
                        {word.split("").map((char, ci) => (
                          <motion.span
                            key={ci}
                            className="inline-block"
                            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                              duration: 0.5,
                              ease: "easeOut",
                              delay:
                                0.2 +
                                (arr.slice(0, wi).join(" ").length + ci) * 0.03,
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                        {wi < arr.length - 1 && "\u00A0"}
                      </span>
                    ))}
                  </h3>
                  <p className="mt-6 max-w-lg text-base text-white/80 md:text-lg">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails overlaid on the image */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 md:p-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
                {services.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button
                      key={s.title}
                      onClick={() => setActive(i)}
                      className="group relative h-20 overflow-hidden rounded-2xl text-left transition md:h-24"
                      style={{
                        boxShadow: isActive
                          ? "0 0 0 2px var(--brand-green)"
                          : "0 0 0 1px rgba(255,255,255,0.2)",
                      }}
                    >
                      <img
                        src={s.image}
                        alt={s.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div
                        className="absolute inset-0 transition"
                        style={{
                          background: isActive
                            ? "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))"
                            : "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))",
                        }}
                      />
                      <span className="absolute inset-x-0 bottom-0 p-2.5 text-[11px] font-semibold leading-tight text-white md:p-3 md:text-sm">
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
