import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSectionContent } from "@/lib/homepageContent";
import { useLocale } from "@/i18n/LanguageProvider";

export function ServicesSection() {
  const c = useSectionContent("services");
  const services = c.items;
  const [active, setActive] = useState(0);
  const current = services[active] ?? services[0];
  const { isRTL } = useLocale();

  const advance = () => setActive((i) => (i + 1) % services.length);
  const retreat = () => setActive((i) => (i - 1 + services.length) % services.length);
  const onLeft = isRTL ? advance : retreat;
  const onRight = isRTL ? retreat : advance;

  return (
    <section id="section-services" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.kicker}</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>{c.heading1}</span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.heading2}</span>
          </h2>
        </motion.div>

        <motion.div className="relative mt-16 overflow-hidden rounded-[2.5rem] shadow-2xl" initial={{ opacity: 0, y: 60, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <div className="relative h-[560px] sm:h-[520px] md:h-[620px]">
            <AnimatePresence mode="wait">
              <motion.img key={current.image_url} src={current.image_url} alt={current.title} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20" />

            <div className="absolute end-4 top-4 flex gap-2 md:end-10 md:top-10">
              <button onClick={onLeft} aria-label={isRTL ? "Next" : "Previous"} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:h-12 md:w-12">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={onRight} aria-label={isRTL ? "Previous" : "Next"} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:h-12 md:w-12">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 flex h-full max-w-2xl flex-col justify-center p-6 pb-40 sm:p-8 md:p-16 md:pb-40">
              <AnimatePresence mode="wait">
                <motion.div key={current.number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                  <span className="inline-flex items-center rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/90 md:px-4 md:py-1.5 md:text-xs md:tracking-[0.25em]">{current.number}</span>
                  <h3 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight text-white sm:text-4xl md:mt-6 md:text-6xl">{current.title}</h3>
                  <p className="mt-4 max-w-lg text-sm text-white/80 md:mt-6 md:text-lg">{current.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 p-3 md:p-6">
              {/* Mobile: horizontal scroll strip so labels stay readable */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {services.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button key={i} onClick={() => setActive(i)} className="group relative h-20 w-[140px] shrink-0 overflow-hidden rounded-xl text-start transition" style={{ boxShadow: isActive ? "0 0 0 2px var(--brand-green)" : "0 0 0 1px rgba(255,255,255,0.2)" }}>
                      <img src={s.image_url} alt={s.title} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background: isActive ? "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))" : "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))" }} />
                      <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-2 text-[11px] font-semibold leading-tight text-white">{s.title}</span>
                    </button>
                  );
                })}
              </div>
              {/* Desktop grid */}
              <div className="hidden gap-4 md:grid" style={{ gridTemplateColumns: `repeat(${Math.min(services.length, 5)}, minmax(0, 1fr))` }}>
                {services.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <button key={i} onClick={() => setActive(i)} className="group relative h-24 overflow-hidden rounded-2xl text-start transition" style={{ boxShadow: isActive ? "0 0 0 2px var(--brand-green)" : "0 0 0 1px rgba(255,255,255,0.2)" }}>
                      <img src={s.image_url} alt={s.title} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 transition" style={{ background: isActive ? "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2))" : "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))" }} />
                      <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold leading-tight text-white">{s.title}</span>
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
