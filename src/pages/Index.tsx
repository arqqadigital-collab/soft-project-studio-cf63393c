import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SeoHead } from "@/components/SeoHead";
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
import { useHomepageVisibility } from "@/lib/homepageContent";
import { useLocale } from "@/hooks/useLocale";

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
  heading_line1_color: "#ffffff",
  heading_line2_from: "#3b82f6",
  heading_line2_to: "#22d3ee",
  subheadline_color: "#e5e7ebcc",
  cta_bg_from: "#3b82f6",
  cta_bg_to: "#22d3ee",
  cta_text_color: "#ffffff",
  heading_size: "lg" as "sm" | "md" | "lg" | "xl",
  text_align: "center" as "left" | "center" | "right",
  vertical_position: "center" as "top" | "center" | "bottom",
};

const HEADING_SIZE_CLASS: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "text-2xl md:text-3xl lg:text-4xl",
  md: "text-3xl md:text-4xl lg:text-5xl",
  lg: "text-3xl md:text-5xl lg:text-6xl",
  xl: "text-4xl md:text-6xl lg:text-7xl",
};
const ALIGN_TEXT: Record<"left" | "center" | "right", string> = {
  left: "text-start items-start",
  center: "text-center items-center",
  right: "text-end items-end",
};
const VPOS_JUSTIFY: Record<"top" | "center" | "bottom", string> = {
  top: "justify-start pt-24",
  center: "justify-center",
  bottom: "justify-end pb-24",
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

  const { locale } = useLocale();
  const arOverlay = (locale === "ar" ? ((heroRow as any)?.translations?.ar ?? {}) : {}) as Record<string, any>;
  const hero = { ...HERO_DEFAULTS, ...(heroRow ?? {}), ...arOverlay } as typeof HERO_DEFAULTS & { is_visible?: boolean };
  const heroVisible = (heroRow as any)?.is_visible !== false;
  const isVisible = useHomepageVisibility();
  const bgSrc = hero.background_url || headerVideo;
  const isVideo = hero.background_url ? hero.background_type === "video" : true;

  const { data: seo } = useQuery({
    queryKey: ["seo_meta", "homepage", (heroRow as any)?.id],
    enabled: !!(heroRow as any)?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_meta")
        .select("*")
        .eq("entity_type", "homepage")
        .eq("entity_id", (heroRow as any).id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  const seoAr = (seo?.translations as any)?.ar || {};
  const seoTitle = (locale === "ar" ? seoAr.meta_title : null) || seo?.meta_title || hero.heading_line1 || "Home";
  const seoDesc = (locale === "ar" ? seoAr.meta_description : null) || seo?.meta_description || hero.subheadline;

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={seoDesc}
        canonical={seo?.canonical_url || undefined}
        ogImage={seo?.og_image_url || undefined}
        noindex={!!seo?.noindex}
        nofollow={!!seo?.nofollow}
      />
      {heroVisible && (
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

          <section className={`flex flex-1 flex-col ${VPOS_JUSTIFY[hero.vertical_position]} ${ALIGN_TEXT[hero.text_align]} px-6`}>
            <h1 className={`max-w-3xl font-bold leading-[1.1] tracking-tight ${HEADING_SIZE_CLASS[hero.heading_size]}`}>
              <span style={{ color: hero.heading_line1_color }}>{hero.heading_line1}</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(135deg, ${hero.heading_line2_from}, ${hero.heading_line2_to})` }}
              >
                {hero.heading_line2}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base md:text-lg" style={{ color: hero.subheadline_color }}>
              {hero.subheadline}
            </p>

            <a
              href={hero.cta_href || "/contact"}
              className="mt-10 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-[var(--shadow-brand)] transition-transform hover:scale-105 sm:gap-3 sm:px-8 sm:py-4 sm:text-base md:mt-12 md:px-10 md:py-5"
              style={{
                background: `linear-gradient(135deg, ${hero.cta_bg_from}, ${hero.cta_bg_to})`,
                color: hero.cta_text_color,
              }}
            >
              {hero.cta_label}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </section>
        </motion.div>
      </main>
      )}

      {heroVisible && (
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
      )}

      <div className="relative z-20 rounded-t-[2.5rem] bg-background shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.4)]">
        {isVisible("expertise") && <ExpertiseSection />}
        {isVisible("process") && <ProcessSection />}
        {isVisible("services") && <ServicesSection />}
        {isVisible("promise") && <PromiseSection />}
        {isVisible("stats") && <StatsSection />}
        {isVisible("clients") && <ClientsSection />}
        {isVisible("success_stories") && <SuccessStoriesSection />}
        {isVisible("partners") && <PartnersSection />}
        {isVisible("cta") && <CtaSection />}
      </div>
      <Footer />
    </>
  );
}
