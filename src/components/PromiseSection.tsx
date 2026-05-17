import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  Headphones,
  Clock,
  Users,
  Compass,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

type Promise = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const promises: Promise[] = [
  {
    icon: CheckCircle2,
    title: "100% Client Satisfaction",
    description: "We prioritize your success and deliver solutions that exceed expectations.",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated Support",
    description: "Reliable, around-the-clock assistance to keep your operations running smoothly.",
  },
  {
    icon: Clock,
    title: "On-Time, Precise Delivery",
    description: "Keeping your projects on schedule and aligned with goals.",
  },
  {
    icon: Users,
    title: "Strategic Collaboration",
    description: "Partnering closely with leadership for seamless execution.",
  },
  {
    icon: Compass,
    title: "Expert Guidance",
    description: "Providing trusted advice to navigate complex challenges.",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Growth Focus",
    description: "Building solutions that scale with your business.",
  },
];

export function PromiseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <p
            className="text-sm font-semibold uppercase tracking-[0.25em]"
            style={{ color: "var(--brand-blue)" }}
          >
            Our Promise
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            <span style={{ color: "var(--brand-dark)" }}>What We </span>
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Deliver
            </span>
            <span style={{ color: "var(--brand-dark)" }}> to You</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base text-muted-foreground md:text-lg">
            Our commitment to excellence is reflected in these core promises, ensuring your digital
            transformation journey is seamless, impactful, and aligned with your strategic goals.
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promises.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-2xl md:p-10"
              >
                {/* Hover gradient glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle at top right, color-mix(in oklab, var(--brand-blue) 15%, transparent), transparent 60%)",
                  }}
                />

                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-[var(--shadow-brand)]"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Icon className="h-6 w-6 text-white" />
                </motion.div>

                <h3
                  className="relative mt-8 text-xl font-bold tracking-tight transition-colors md:text-2xl"
                  style={{ color: "var(--brand-dark)" }}
                >
                  {p.title}
                </h3>

                <p className="relative mt-3 text-base text-muted-foreground">{p.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
