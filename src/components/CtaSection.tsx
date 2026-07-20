import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useSectionContent } from "@/lib/homepageContent";
import { ContactForm } from "@/components/ContactForm";

export function CtaSection() {
  const c = useSectionContent("cta");
  const [active, setActive] = useState(0);

  const t = c.testimonials[active] ?? c.testimonials[0];


  return (
    <section id="section-cta" className="relative overflow-hidden px-6 py-24 md:px-12 md:py-32" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, color-mix(in oklab, var(--brand-blue) 6%, hsl(var(--background))) 100%)" }}>
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.kicker}</p>
        <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span style={{ color: "var(--brand-dark)" }}>{c.heading1}</span>
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.heading2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{c.body}</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur md:p-10">
          <ContactForm source="footer_cta" variant="light" />
        </div>


        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <video src={c.video_url} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/85 via-[#0a1628]/70 to-[#0a1628]/85" />
          <div className="relative flex h-full min-h-[520px] flex-col justify-between p-8 md:p-10">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" style={{ color: "var(--brand-green)" }} />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="my-6">
                <p className="text-lg leading-relaxed text-white/90 md:text-xl">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-8">
                  <div className="text-lg font-bold text-white">{t.name}</div>
                  <div className="mt-1 text-sm font-semibold" style={{ color: "var(--brand-green)" }}>{t.company}</div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2">
              {c.testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} aria-label={`Testimonial ${i + 1}`} className="h-1.5 rounded-full transition-all" style={{ width: i === active ? 40 : 24, background: i === active ? "var(--brand-green)" : "rgba(255,255,255,0.25)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

