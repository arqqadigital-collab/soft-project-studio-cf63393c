import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/logo.png";
import headerVideo from "@/assets/header-bg.mp4";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { StatsSection } from "@/components/StatsSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PromiseSection } from "@/components/PromiseSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ClientsSection } from "@/components/ClientsSection";
import { SuccessStoriesSection } from "@/components/SuccessStoriesSection";
import { PartnersSection } from "@/components/PartnersSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SBS — Transforming Complexity Into Digital Clarity" },
      {
        name: "description",
        content:
          "End-to-end digital transformation for modern enterprises and healthcare organizations.",
      },
    ],
  }),
});

const navLinks = ["Products", "Solutions", "Company", "Clients", "Case Studies", "Contact"];

function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax: background moves slower, content fades & lifts on scroll out
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <main
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        {/* Parallax background video */}
        <motion.video
          style={{ y: bgY }}
          className="absolute inset-0 -top-[10%] h-[120%] w-full object-cover"
          src={headerVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex h-full flex-col"
        >
          <header className="flex items-center justify-between px-6 py-6 md:px-12">
            <img
              src={logo}
              alt="SBS — Superior Business Solutions"
              className="h-12 w-auto md:h-14"
            />

            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </nav>

            <button
              className="rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Get Started
            </button>
          </header>

          <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-white">Transforming Complexity</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Into Digital Clarity
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
              End-to-end digital transformation for modern enterprises and healthcare organizations.
            </p>

            <button
              className="mt-12 inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              Start Your Digital Transformation
              <ArrowRight className="h-5 w-5" />
            </button>
          </section>
        </motion.div>
      </main>

      {/* Blur transition between hero and Expertise */}
      <div
        aria-hidden
        className="relative z-20 -mt-32 h-32 w-full"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.6) 50%, hsl(var(--background)) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 60%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%, black 100%)",
        }}
      />

      {/* Parallax reveal: Expertise sits above hero as user scrolls */}
      <div className="relative z-20 rounded-t-[2.5rem] bg-background shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)]">
        <ExpertiseSection />
        <ProcessSection />
        <ServicesSection />
        <PromiseSection />
        <StatsSection />
        <ClientsSection />
        <SuccessStoriesSection />
        <PartnersSection />
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
