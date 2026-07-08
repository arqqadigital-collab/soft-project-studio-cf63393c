import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Footer } from "@/components/Footer";

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
        <div className="h-20 w-20 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}

function deslug(slug: string | undefined) {
  if (!slug) return "Article";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function ArticleDetail() {
  const params = useParams();
  const isCaseStudy = window.location.pathname.startsWith("/case-studies/");
  const title = deslug(params.slug);
  const backHref = isCaseStudy ? "/case-studies" : "/blog";
  const backLabel = isCaseStudy ? "Back to Case Studies" : "Back to Blog";

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-left"
          >
            <Link
              to={backHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--brand-blue)", background: "oklch(0.62 0.13 230 / 0.1)" }}
              >
                {isCaseStudy ? "Case Study" : "Article"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                July 1, 2026
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                6 Min Read
              </span>
            </div>

            <h1 className="mt-5 text-left text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="pt-10 md:pt-14">
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CoverPlaceholder className="aspect-[16/9] w-full rounded-3xl" />
          </motion.div>
        </div>
      </section>

      <article className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-10 text-left text-base leading-relaxed text-foreground md:text-lg">
            <div>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-left text-2xl font-bold text-foreground md:text-3xl">
                Understanding the Core Concepts
              </h2>
              <p className="text-muted-foreground">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
                voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
                illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>

            <div>
              <p className="mb-4 text-left text-muted-foreground">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Key benefits
                include:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-left text-muted-foreground">
                <li>Improved operational efficiency across teams and workflows</li>
                <li>Streamlined data management with real-time visibility</li>
                <li>Enhanced compliance with regional and international standards</li>
                <li>Scalable architecture that grows with your organization</li>
                <li>Reduced total cost of ownership over the long term</li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-left text-muted-foreground">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Consider the following best practices:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-left text-muted-foreground">
                <li>Start with a clear discovery and requirements-gathering phase</li>
                <li>Engage stakeholders early and communicate progress transparently</li>
                <li>Adopt an iterative delivery model with measurable milestones</li>
                <li>Invest in change management and end-user training</li>
                <li>Continuously monitor outcomes and refine based on feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  );
}
