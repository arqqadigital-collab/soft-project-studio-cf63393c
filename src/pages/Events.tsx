import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar, MapPin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

const categories = ["All", "Webinar", "Conference", "Workshop", "Roundtable", "Product Demo"];

const featuredEvent = {
  title: "Healthcare AI Summit 2026: Transforming Patient Care with Intelligent Systems",
  excerpt:
    "Join regional healthcare leaders, CIOs, and clinical experts for a full-day summit exploring AI-driven diagnostics, integrated EHR platforms, and the future of patient experience.",
  category: "Conference",
  duration: "Full Day",
  date: "September 18, 2026",
  location: "Dubai, UAE",
  format: "In-Person",
  host: {
    name: "SBS Healthcare",
    role: "Event Host",
    initials: "SB",
  },
};

const events = [
  {
    title: "Live Demo: Odoo ERP for Manufacturing Excellence",
    excerpt:
      "See how leading manufacturers are streamlining production, inventory, and quality with a live end-to-end walkthrough of Odoo ERP.",
    category: "Product Demo",
    duration: "45 Min",
    date: "August 12, 2026",
    location: "Online",
    format: "Webinar",
    host: { name: "Joel Kenley", initials: "JK" },
  },
  {
    title: "CISO Roundtable: Cyber Resilience in the Age of AI",
    excerpt:
      "An invite-only executive roundtable for security leaders on defending against AI-powered threats and building resilient response programs.",
    category: "Roundtable",
    duration: "2 Hours",
    date: "August 20, 2026",
    location: "Riyadh, KSA",
    format: "In-Person",
    host: { name: "David Chen", initials: "DC" },
  },
  {
    title: "Webinar: NPHIES & KSA Healthcare Compliance Explained",
    excerpt:
      "Everything providers need to know about NPHIES onboarding, MOH mandates, and interoperability requirements — with live Q&A.",
    category: "Webinar",
    duration: "60 Min",
    date: "August 28, 2026",
    location: "Online",
    format: "Webinar",
    host: { name: "Sarah Mitchell", initials: "SM" },
  },
  {
    title: "Workshop: Building Your Cloud Migration Roadmap",
    excerpt:
      "A hands-on workshop for IT leaders covering readiness assessment, workload prioritization, and cost modelling for cloud migration.",
    category: "Workshop",
    duration: "Half Day",
    date: "September 5, 2026",
    location: "Abu Dhabi, UAE",
    format: "In-Person",
    host: { name: "Emma Wilson", initials: "EW" },
  },
  {
    title: "Webinar: Dynamics 365 for Modern Finance Teams",
    excerpt:
      "See how CFOs and finance leaders are using Dynamics 365 to close books faster, forecast smarter, and unify reporting across entities.",
    category: "Webinar",
    duration: "50 Min",
    date: "September 10, 2026",
    location: "Online",
    format: "Webinar",
    host: { name: "Michael Smith", initials: "MS" },
  },
  {
    title: "Workshop: AI Readiness Bootcamp for Enterprise Leaders",
    excerpt:
      "A structured, hands-on session to assess your organization's AI readiness and leave with a concrete 90-day activation plan.",
    category: "Workshop",
    duration: "Half Day",
    date: "September 24, 2026",
    location: "Dubai, UAE",
    format: "In-Person",
    host: { name: "Omar Hassan", initials: "OH" },
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
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm">
          <Calendar className="h-7 w-7 text-white/90" />
        </div>
      </div>
    </div>
  );
}

function HostBadge({ host }: { host: { name: string; initials: string } }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {host.initials}
      </div>
      <div>
        <p className="text-sm font-medium text-card-foreground">{host.name}</p>
      </div>
    </div>
  );
}

function CardMeta({ duration, date, location, format }: { duration: string; date: string; location: string; format: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5" />
        {date}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {duration}
      </span>
      <span className="flex items-center gap-1">
        {format === "Webinar" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
        {location}
      </span>
    </div>
  );
}

export default function Events() {
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
              Learn, Connect, Grow
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Events & <span style={{ color: "var(--brand-blue)" }}>Webinars</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Live sessions, workshops, and executive roundtables designed for healthcare, ERP, and technology leaders across the region.
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

      {/* Featured event */}
      <section className="bg-background pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.article
            className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="grid lg:grid-cols-2">
              <CoverPlaceholder className="h-72 lg:h-auto" />
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span
                  className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-blue)", background: "oklch(0.62 0.13 230 / 0.1)" }}
                >
                  {featuredEvent.category}
                </span>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-card-foreground md:text-3xl lg:text-4xl">
                  {featuredEvent.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{featuredEvent.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <HostBadge host={featuredEvent.host} />
                  <CardMeta
                    duration={featuredEvent.duration}
                    date={featuredEvent.date}
                    location={featuredEvent.location}
                    format={featuredEvent.format}
                  />
                </div>
                <div className="mt-8">
                  <Button className="group/btn inline-flex items-center gap-2">
                    Register Now
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Events grid */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Upcoming Events</h2>
            <Button variant="outline" className="hidden items-center gap-2 md:inline-flex">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => (
              <motion.article
                key={event.title}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                custom={idx}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                <CoverPlaceholder className="aspect-[16/10] w-full" />
                <div className="flex flex-1 flex-col p-6">
                  <span
                    className="w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--brand-blue)", background: "oklch(0.62 0.13 230 / 0.1)" }}
                  >
                    {event.category}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)]">
                    {event.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{event.excerpt}</p>
                  <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5">
                    <HostBadge host={event.host} />
                    <CardMeta
                      duration={event.duration}
                      date={event.date}
                      location={event.location}
                      format={event.format}
                    />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 md:hidden">
            <Button variant="outline" className="w-full items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="border-t border-border bg-muted/30 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Never Miss an Event
            </h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to receive invitations to our upcoming webinars, workshops, and executive events.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none ring-ring focus:ring-2 sm:w-80"
              />
              <Button className="w-full sm:w-auto">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
