import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/i18n/LanguageProvider";

// Import default assets so we can reference them as URL strings
import expertiseImg from "@/assets/expertise.png";
import process1 from "@/assets/process-1.mov";
import process2 from "@/assets/process-2.mov";
import process3 from "@/assets/process-3.mov";
import healthcare from "@/assets/service-healthcare-compliance.png";
import erp from "@/assets/service-erp.png";
import ai from "@/assets/service-ai-healthcare.png";
import staffAsset from "@/assets/service-staff-new.png";
import integration from "@/assets/service-integration.png";
import client1 from "@/assets/clients/01.png";
import client2 from "@/assets/clients/02.png";
import client3 from "@/assets/clients/03.png";
import client4 from "@/assets/clients/04.png";
import client5 from "@/assets/clients/05.png";
import client6 from "@/assets/clients/06.png";
import client7 from "@/assets/clients/07.png";
import client8 from "@/assets/clients/08.png";
import client9 from "@/assets/clients/09.png";
import partner1 from "@/assets/partners/01.png";
import partner2 from "@/assets/partners/02.png";
import partner3 from "@/assets/partners/03.png";
import partner4 from "@/assets/partners/04.png";
import partner5 from "@/assets/partners/05.png";
import partner6 from "@/assets/partners/06.png";
import partner7 from "@/assets/partners/07.png";
import partner8 from "@/assets/partners/08.png";
import caseErp from "@/assets/case-erp.jpg";
import caseHealthcare from "@/assets/case-healthcare.jpg";
import caseFintech from "@/assets/case-fintech.jpg";
import ctaVideo from "@/assets/cta-testimonial.mov";

export type SectionKey =
  | "expertise" | "process" | "services" | "promise" | "stats"
  | "clients" | "success_stories" | "partners" | "cta";

export const DEFAULTS = {
  expertise: {
    kicker: "Our Expertise",
    heading1: "Technology Expertise Built Around",
    heading2: "Business Needs",
    body: "Through years of experience delivering ERP systems, healthcare technology solutions, and digital transformation services, we collaborate closely with organizations to implement systems that simplify processes, integrate data, and unlock new opportunities for innovation.",
    link_text: "Discover Our Approach",
    link_href: "#",
    image_url: expertiseImg,
    overlay_heading: "Turning Complexity Into Clear Digital Solutions",
    overlay_cta_label: "Start Your Transformation Today",
    overlay_cta_href: "/contact",
  },
  process: {
    kicker: "Our Process",
    heading: "How We Transform\nYour Business",
    body: "Our solutions combine technology, automation, and industry expertise to help organizations modernize operations and accelerate digital growth.",
    cta_label: "View All Services",
    cta_href: "#",
    cards: [
      {
        title: "Power Your Business with Scalable ERP Ecosystems",
        video_url: process1,
        link_href: "#",
      },
      {
        title: "Smarter Care Through Connected Health Technology",
        video_url: process2,
        link_href: "#",
      },
      {
        title: "Expert Support That Powers Successful Transformation",
        video_url: process3,
        link_href: "#",
      },
    ],
  },
  services: {
    kicker: "Our Services",
    heading1: "Solutions Built for ",
    heading2: "Impact",
    items: [
      { number: "Service 01", title: "Healthcare Compliance", description: "Ensure your operations strictly adhere to DHA, DoH, ADHICS, and regional healthcare standards.", image_url: healthcare },
      { number: "Service 02", title: "ERP Implementation & Optimization", description: "Tailored deployment and continuous enhancement of enterprise systems to streamline your operations.", image_url: erp },
      { number: "Service 03", title: "AI Healthcare Transformation", description: "Leverage artificial intelligence to optimize clinical workflows and drive medical innovation.", image_url: ai },
      { number: "Service 04", title: "Staff Augmentation & Managed Services", description: "Scale your teams rapidly with specialized IT professionals and comprehensive managed support solutions.", image_url: staffAsset },
      { number: "Service 05", title: "Implementation & Integration", description: "Seamlessly connect disparate systems to create a unified, data-driven technological ecosystem.", image_url: integration },
    ],
  },
  promise: {
    kicker: "Our Promise",
    heading1: "What We ",
    heading2: "Deliver",
    heading3: " to You",
    body: "Our commitment to excellence is reflected in these core promises, ensuring your digital transformation journey is seamless, impactful, and aligned with your strategic goals.",
    items: [
      { icon: "CheckCircle2", title: "100% Client Satisfaction", description: "We prioritize your success and deliver solutions that exceed expectations." },
      { icon: "Headphones", title: "24/7 Dedicated Support", description: "Reliable, around-the-clock assistance to keep your operations running smoothly." },
      { icon: "Clock", title: "On-Time, Precise Delivery", description: "Keeping your projects on schedule and aligned with goals." },
      { icon: "Users", title: "Strategic Collaboration", description: "Partnering closely with leadership for seamless execution." },
      { icon: "Compass", title: "Expert Guidance", description: "Providing trusted advice to navigate complex challenges." },
      { icon: "TrendingUp", title: "Sustainable Growth Focus", description: "Building solutions that scale with your business." },
    ],
  },
  stats: {
    kicker: "By the Numbers",
    heading1: "Impact you can ",
    heading2: "measure",
    items: [
      { icon: "Building2", value: 200, suffix: "+", label: "Organizations Transformed" },
      { icon: "Layers", value: 15, suffix: "+", label: "Industries Served" },
      { icon: "Smile", value: 98, suffix: "%", label: "Client Satisfaction Rate" },
    ],
  },
  clients: {
    kicker: "Our Clients",
    heading1: "Trusted by ",
    heading2: "leading organizations",
    body: "Partnering with enterprises and healthcare institutions to deliver impactful digital transformation solutions across the MENA region and the United States.",
    logos: [
      { src: client1, name: "Al Tanfith Aldwaliah" },
      { src: client2, name: "APIC Agri Export" },
      { src: client3, name: "Ameco" },
      { src: client4, name: "Beehive Giveaways" },
      { src: client5, name: "Boss Office Furniture" },
      { src: client6, name: "Dazzle Advertising" },
      { src: client7, name: "De Backer's" },
      { src: client8, name: "Siddiq Farsi Holding" },
      { src: client9, name: "Etal" },
    ],
  },
  success_stories: {
    badge: "Success Stories",
    heading1: "Case ",
    heading2: "Studies",
    subtitle: "Real Results from Real Organizations",
    cta_label: "See all case studies",
    cta_href: "#",
    items: [
      { quote: "Their team managed a full ERP migration seamlessly, providing us with unified reporting and automated workflows.", name: "Ahmed Al-Mansoori", company: "Global Logistics Corp", image_url: caseErp },
      { quote: "Their healthcare transformation framework secured our data and enhanced our clinical efficiency by 40%.", name: "Dr. Sarah Jenkins", company: "Prime Care Hospitals", image_url: caseHealthcare },
      { quote: "They handle our cybersecurity posture and infrastructure scaling, letting us focus on core business growth.", name: "Michael Chang", company: "FinTech Solutions", image_url: caseFintech },
    ],
  },
  partners: {
    kicker: "Our Partners",
    heading1: "Powered By ",
    heading2: "Strategic Partnerships",
    body: "Collaborating with world-class technology providers to deliver enterprise-grade solutions, innovation, and proven platforms to our clients.",
    logos: [
      { src: partner1, name: "Cerner" },
      { src: partner2, name: "Infinitt Healthcare" },
      { src: partner3, name: "EndNote" },
      { src: partner4, name: "Fortinet" },
      { src: partner5, name: "Imprivata" },
      { src: partner6, name: "Odoo" },
      { src: partner7, name: "Microsoft Dynamics 365 Business Central" },
      { src: partner8, name: "Totara" },
    ],
  },
  cta: {
    kicker: "Let's Get Started",
    heading1: "Start Your Next ",
    heading2: "Big Move",
    body: "We're ready to help with your digital transformation. Get in touch with our experts within 24 hours.",
    video_url: ctaVideo,
    inquiry_areas: [
      "Healthcare Compliance",
      "ERP Implementation",
      "AI Healthcare Transformation",
      "Staff Augmentation",
      "Implementation & Integration",
      "Other",
    ],
    testimonials: [
      { quote: "From day one, the level of professionalism and technical expertise was outstanding. They turned our complex requirements into an elegant, scalable solution.", name: "Dr. Sarah Jenkins", company: "Prime Care Hospitals" },
      { quote: "The team feels like an extension of our own. Strategic, responsive, and consistently ahead of the curve. We could not recommend them more highly.", name: "Michael Chang", company: "FinTech Solutions" },
      { quote: "A true transformation partner. Their ERP migration delivered measurable ROI within the first quarter and unified our entire reporting stack.", name: "Ahmed Al-Mansoori", company: "Global Logistics Corp" },
    ],
  },
} as const;

export type SectionContent<K extends SectionKey> = typeof DEFAULTS[K];

// Deep merge: array/scalar in override wins; objects merged
function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (typeof base === "object" && typeof over === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(over)) {
      out[k] = merge((base as any)[k], (over as any)[k]);
    }
    return out;
  }
  return (over ?? base) as T;
}

export function useSectionContent<K extends SectionKey>(key: K): SectionContent<K> {
  const { locale } = useLocale();
  const { data } = useQuery({
    queryKey: ["homepage-section", key, locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("content, translations")
        .eq("section_key", key)
        .maybeSingle();
      if (error) throw error;
      const base = (data?.content ?? {}) as any;
      const translations = (data?.translations ?? {}) as Record<string, any>;
      const overlay = locale !== "en" ? translations?.[locale] ?? null : null;
      return overlay ? merge(base, overlay) : base;
    },
  });
  return merge(DEFAULTS[key] as any, data ?? {});
}

export function useHomepageVisibility() {
  const { data } = useQuery({
    queryKey: ["homepage-sections-visibility"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("section_key, is_visible");
      if (error) throw error;
      return data as { section_key: SectionKey; is_visible: boolean }[];
    },
  });
  const map: Partial<Record<SectionKey, boolean>> = {};
  (data ?? []).forEach((r) => { map[r.section_key] = r.is_visible; });
  return (key: SectionKey) => map[key] !== false; // default visible
}
