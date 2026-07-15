import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as Icons from "lucide-react";
import { useSectionContent } from "@/lib/homepageContent";

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as any)[name] ?? Icons.CheckCircle2;
  return <Cmp className={className} />;
}

export function PromiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const c = useSectionContent("promise");

  return (
    <section id="section-promise" className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--brand-blue)" }}>{c.kicker}</p>
          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>{c.heading1}</span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-brand)" }}>{c.heading2}</span>
            <span style={{ color: "var(--brand-dark)" }}>{c.heading3}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">{c.body}</p>
        </div>

        <div ref={ref} className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {c.items.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-2xl md:p-10"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at top right, color-mix(in oklab, var(--brand-blue) 15%, transparent), transparent 60%)" }} />
              <motion.div whileHover={{ rotate: 8, scale: 1.1 }} className="relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-[var(--shadow-brand)]" style={{ background: "var(--gradient-brand)" }}>
                <Icon name={p.icon} className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="relative mt-8 text-xl font-bold tracking-tight md:text-2xl" style={{ color: "var(--brand-dark)" }}>{p.title}</h3>
              <p className="relative mt-3 text-base text-muted-foreground">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
