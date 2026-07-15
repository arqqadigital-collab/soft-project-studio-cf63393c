import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

const HERO_DEFAULTS = {
  heading_line1: "Transforming Complexity",
  heading_line2: "Into Digital Clarity",
  subheadline:
    "End-to-end digital transformation for modern enterprises and healthcare organizations.",
  cta_label: "Start Your Digital Transformation",
  cta_href: "/contact",
  background_url: "",
  background_type: "video" as "video" | "image",
  overlay_opacity: 0.6,
};

export default function Index() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "75%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: heroRow } = useQuery({
    queryKey: ["homepage-hero-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_hero")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const hero = { ...HERO_DEFAULTS, ...(heroRow ?? {}) } as typeof HERO_DEFAULTS;
  const bgSrc = hero.background_url || headerVideo;
  const isVideo = hero.background_url ? hero.background_type === "video" : true;

  return (
    <>
      <main
        ref={heroRef}
        className="pt-20 relative h-screen w-full overflow-hidden bg-background"
      >
        {isVideo ? (
          <motion.video
            key={bgSrc}
            style={{ y: bgY }}
            className="absolute inset-0 -top-[10%] h-[120%] w-full object-cover"
            src={bgSrc}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <motion.img
            key={bgSrc}
            style={{ y: bgY }}
            className="absolute inset-0 -top-[10%] h-[120%] w-full object-cover"
            src={bgSrc}
            alt=""
          />
        )}
        <div
          className="absolute inset-0 backdrop-blur-[2px]"
          style={{ backgroundColor: `rgba(0,0,0,${hero.overlay_opacity})` }}
        />

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex h-full flex-col"
        >

          <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              <span className="text-white">{hero.heading_line1}</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                {hero.heading_line2}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
              {hero.subheadline}
            </p>

            <a
              href={hero.cta_href || "/contact"}
              className="mt-12 inline-flex items-center gap-3 rounded-full px-10 py-5 text-base font-semibold text-white shadow-[var(--shadow-brand)] transition-transform hover:scale-105"
              style={{ background: "var(--gradient-brand)" }}
            >
              {hero.cta_label}
              <ArrowRight className="h-5 w-5" />
            </a>
          </section>
        </motion.div>
      </main>

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
