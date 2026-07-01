import { motion } from "framer-motion";
import { Clock, ArrowRight, Calendar } from "lucide-react";
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

const categories = ["All", "Healthcare", "ERP", "Cybersecurity", "Consulting", "Implementation"];

const featuredPost = {
  title: "The Future of Healthcare Digital Transformation in 2026",
  excerpt:
    "Explore how integrated healthcare systems, AI-driven diagnostics, and compliance-ready platforms are reshaping patient care and operational efficiency across the region.",
  category: "Healthcare",
  readTime: "8 Min Read",
  date: "June 28, 2026",
  author: {
    name: "Sarah Mitchell",
    role: "Healthcare Strategist",
    initials: "SM",
  },
};

const posts = [
  {
    title: "Optimizing Workflow Processes for Maximum Efficiency",
    excerpt:
      "Understand the importance of optimizing workflow processes to enhance efficiency across clinical and administrative teams.",
    category: "Consulting",
    readTime: "4 Min Read",
    date: "June 25, 2026",
    author: {
      name: "Joel Kenley",
      initials: "JK",
    },
  },
  {
    title: "Best Practices for Effective Project Documentation",
    excerpt:
      "Dive into the importance of maintaining thorough project documentation throughout implementation and integration lifecycles.",
    category: "Implementation",
    readTime: "10 Min Read",
    date: "June 22, 2026",
    author: {
      name: "Sarah Davis",
      initials: "SD",
    },
  },
  {
    title: "Managing Stakeholder Expectations for Project Success",
    excerpt:
      "Understand the importance of stakeholder management in project planning and delivery for large enterprise deployments.",
    category: "ERP",
    readTime: "14 Min Read",
    date: "June 18, 2026",
    author: {
      name: "Michael Smith",
      initials: "MS",
    },
  },
  {
    title: "Building a Resilient Cybersecurity Posture in Healthcare",
    excerpt:
      "Learn how hospitals and clinics can protect patient data, ensure compliance, and respond to evolving cyber threats.",
    category: "Cybersecurity",
    readTime: "6 Min Read",
    date: "June 15, 2026",
    author: {
      name: "David Chen",
      initials: "DC",
    },
  },
  {
    title: "ERP Implementation: From Strategy to Go-Live",
    excerpt:
      "A practical guide to planning, deploying, and optimizing ERP systems for manufacturing, logistics, and trading businesses.",
    category: "ERP",
    readTime: "12 Min Read",
    date: "June 10, 2026",
    author: {
      name: "Emma Wilson",
      initials: "EW",
    },
  },
  {
    title: "AI Readiness: Preparing Your Organization for Adoption",
    excerpt:
      "Discover the key steps to assess AI readiness, align stakeholders, and build a roadmap for successful AI deployment.",
    category: "Healthcare",
    readTime: "9 Min Read",
    date: "June 5, 2026",
    author: {
      name: "Omar Hassan",
      initials: "OH",
    },
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

function AuthorBadge({ author }: { author: { name: string; initials: string } }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {author.initials}
      </div>
      <div>
        <p className="text-sm font-medium text-card-foreground">{author.name}</p>
      </div>
    </div>
  );
}

function CardMeta({ readTime, date }: { readTime: string; date: string }) {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" />
        {readTime}
      </span>
      <span className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5" />
        {date}
      </span>
    </div>
  );
}

export default function Blog() {
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
              Insights & Updates
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Our <span style={{ color: "var(--brand-blue)" }}>Blog</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Thought leadership, industry trends, and practical guidance for healthcare, ERP, and technology leaders.
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

      {/* Featured post */}
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
                  {featuredPost.category}
                </span>
                <h2 className="mt-5 text-2xl font-bold leading-tight text-card-foreground md:text-3xl lg:text-4xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 text-muted-foreground">{featuredPost.excerpt}</p>
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                  <AuthorBadge author={featuredPost.author} />
                  <CardMeta readTime={featuredPost.readTime} date={featuredPost.date} />
                </div>
                <div className="mt-8">
                  <Button className="group/btn inline-flex items-center gap-2">
                    Read Article
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-background pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Latest Articles</h2>
            <Button variant="outline" className="hidden items-center gap-2 md:inline-flex">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <motion.article
                key={post.title}
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
                    {post.category}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-card-foreground transition-colors group-hover:text-[var(--brand-blue)]">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                    <AuthorBadge author={post.author} />
                    <CardMeta readTime={post.readTime} date={post.date} />
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
              Stay Ahead with Industry Insights
            </h2>
            <p className="mt-4 text-muted-foreground">
              Subscribe to receive the latest articles, case studies, and updates delivered to your inbox.
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
