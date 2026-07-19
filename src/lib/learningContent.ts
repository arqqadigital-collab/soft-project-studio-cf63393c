import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/learning/hero.jpg.asset.json";
import cta from "@/assets/learning/cta.jpg.asset.json";
import t1 from "@/assets/learning/threat1.jpg.asset.json";
import t2 from "@/assets/learning/threat2.jpg.asset.json";
import t3 from "@/assets/learning/threat3.jpg.asset.json";
import s1 from "@/assets/learning/s1.jpg.asset.json";
import s2 from "@/assets/learning/s2.jpg.asset.json";
import s3 from "@/assets/learning/s3.jpg.asset.json";
import s4 from "@/assets/learning/s4.jpg.asset.json";
import s5 from "@/assets/learning/s5.jpg.asset.json";
import s6 from "@/assets/learning/s6.jpg.asset.json";
import s7 from "@/assets/learning/s7.jpg.asset.json";

export type LearningSectionKey =
  | "Hero"
  | "The Problem"
  | "Pillars"
  | "Services"
  | "Why SBS"
  | "Stats"
  | "FAQ"
  | "Final CTA";

export const LEARNING_DEFAULTS = {
  Hero: {
    eyebrow: "Learning & Knowledge Services",
    headline: "Build the Capabilities",
    headlineAccent: "Your Future Depends On.",
    body: "SBS delivers end-to-end learning and knowledge services that turn your people into your strongest competitive advantage — through assessment, world-class training, and continuous enablement.",
    ctaLabel: "Get a Free Learning Needs Review",
    ctaHref: "#contact",
    ctaLabel2: "Speak to a Learning Expert",
    ctaHref2: "#contact",
    footnote: "No commitment required. Walk away with a clear view of your capability gaps.",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Reality of Capability Risk Today",
    heading: "The Skills Race Is Real.",
    headingAccent: "The Cost of Falling Behind Has Never Been Higher.",
    body: "AI, cloud, data, and new operating models are rewriting the definition of every job. Generic training and one-off workshops don't close the gap. The question isn't whether your workforce needs to evolve. It's whether they'll be ready in time.",
    items: [
      { n: "01", title: "Disengaged, Outdated Training Programs", body: "Generic slide decks and one-off sessions that fail to shift behavior — leaving teams unprepared for the tools, systems, and challenges they face every day.", image: t1.url },
      { n: "02", title: "Widening Skills Gaps", body: "Technology and business models evolve faster than in-house capabilities. Critical roles go unfilled, projects stall, and transformation initiatives lose momentum.", image: t2.url },
      { n: "03", title: "Talent Attrition & Lost Knowledge", body: "Top performers leave when they stop growing. Institutional knowledge walks out the door, and replacement costs quickly exceed the price of investing in your people.", image: t3.url },
    ],
  },
  Pillars: {
    eyebrow: "How We Work",
    heading: "Comprehensive. Practical.",
    headingAccent: "Tailored to Your Workforce.",
    body: "We reject the one-size-fits-all approach. Every workforce, every role, and every business goal is different — so our methodology is built around your context, on three core pillars.",
    items: [
      { n: "01", label: "ASSESS", icon: "Search", title: "Understand where your capability gaps are.", body: "Skills assessments, role-based competency mapping, and learning-needs analysis to identify what your workforce needs — and prioritize what will move the needle first." },
      { n: "02", label: "ENABLE", icon: "GraduationCap", title: "Deliver learning that actually sticks.", body: "Blended programs combining instructor-led workshops, self-paced digital courses, hands-on labs, and coaching — designed for adults, aligned to real work." },
      { n: "03", label: "SUSTAIN", icon: "Sparkles", title: "Turn learning into lasting capability.", body: "Reinforcement, analytics, and continuous learning journeys so new skills convert into on-the-job performance — not just certificates on a wall." },
    ],
  },
  Services: {
    eyebrow: "What We Offer",
    heading: "Our Learning & Knowledge",
    headingAccent: "Services.",
    items: [
      { n: "01", icon: "Search", title: "Skills Assessment & Learning Needs Analysis", tagline: "Know exactly where your people stand — and where they need to go.", body: "Structured assessments that map current capabilities against role requirements and strategic priorities, giving you a clear, data-driven baseline to design targeted learning journeys.", image: s1.url, bullets: ["Role-based competency frameworks and skills matrices", "Individual and team-level skills diagnostics", "Gap analysis with prioritized learning roadmaps", "Executive summary for leadership and HR alignment"], ideal: "Annual planning, restructuring, digital transformation programs, capability-building initiatives." },
      { n: "02", icon: "Users", title: "Instructor-Led Training & Workshops", tagline: "Live, expert-led learning that drives real behavior change.", body: "Interactive workshops delivered on-site or virtually by senior practitioners — combining frameworks, discussion, and hands-on practice built around your business context.", image: s2.url, bullets: ["Custom curriculum aligned to your goals and tools", "Delivered by certified instructors and industry experts", "Case studies and exercises using your real scenarios", "Post-workshop resources and follow-up coaching"], ideal: "Team upskilling, leadership offsites, new-system rollouts, change-management programs." },
      { n: "03", icon: "Monitor", title: "Digital Learning & LMS Solutions", tagline: "Scalable, self-paced learning available anywhere.", body: "End-to-end digital learning — from LMS platform deployment to bespoke content production — that lets your entire workforce learn at their own pace, on any device.", image: s3.url, bullets: ["LMS selection, implementation, and administration", "Custom eLearning content and micro-learning modules", "SCORM/xAPI-compliant course libraries", "Learner engagement, gamification, and social features"], ideal: "Distributed workforces, onboarding at scale, compliance training, continuous learning cultures." },
      { n: "04", icon: "Award", title: "Certification & Exam Preparation", tagline: "Prepare your teams to earn the credentials that matter.", body: "Structured preparation programs across leading technology, project management, and business certifications — with practice exams, mentoring, and success guarantees.", image: s4.url, bullets: ["PMP, PRINCE2, ITIL, TOGAF, Six Sigma tracks", "AWS, Azure, Google Cloud, and Microsoft certifications", "SAP, Oracle, and Salesforce credential preparation", "Mock exams, study plans, and dedicated mentor support"], ideal: "Individual career development, team credentialing, partner certification requirements." },
      { n: "05", icon: "UserCog", title: "Leadership & Executive Development", tagline: "Build the leaders who will drive your next chapter.", body: "Multi-touch leadership programs that combine assessment, coaching, and experiential learning — developing the strategic, people, and change-leadership skills modern executives need.", image: s5.url, bullets: ["360-degree assessments and executive coaching", "Strategic leadership and change-management modules", "Peer learning cohorts and action-learning projects", "Succession planning and high-potential development"], ideal: "Emerging leaders, senior managers, succession pipelines, board-level talent programs." },
      { n: "06", icon: "Code2", title: "Technical & Digital Bootcamps", tagline: "Accelerated, hands-on training for the skills you need now.", body: "Immersive bootcamps that take your teams from foundational to job-ready in weeks — across software engineering, data, AI, and modern cloud disciplines.", image: s6.url, bullets: ["Full-stack development, DevOps, and cloud engineering", "Data analytics, data science, and applied AI", "Cybersecurity fundamentals and specialist tracks", "Live projects, code reviews, and capstone assessments"], ideal: "Reskilling initiatives, graduate programs, technology transformations, talent redeployment." },
      { n: "07", icon: "BarChart3", title: "Learning Analytics & Advisory", tagline: "Prove impact. Improve outcomes. Justify investment.", body: "Turn learning data into decisions — with dashboards, ROI models, and advisory support that connect training activity to business performance.", image: s7.url, bullets: ["Learning KPIs, dashboards, and executive reporting", "Kirkpatrick-based evaluation and impact measurement", "Learning strategy, governance, and operating models", "Vendor selection and content curation advisory", "Continuous improvement based on learner outcomes"], ideal: "L&D leaders scaling their function, CHROs building capability strategies, transformation offices." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Why Leading Organizations Choose",
    headingAccent: "SBS for Learning.",
    items: [
      { icon: "Award", title: "Certified Expertise", body: "Master trainers, executive coaches, and subject-matter experts credentialed across leading technology, methodology, and leadership frameworks." },
      { icon: "Handshake", title: "Vendor-Agnostic Curriculum", body: "We are not tied to any single platform or publisher. Recommendations are based on what will actually build capability in your teams — honest advice you can trust." },
      { icon: "Building2", title: "Proven Across Industries", body: "Programs delivered across banking, healthcare, government, retail, and telecommunications. We understand your sector's language, roles, and constraints." },
      { icon: "Workflow", title: "End-to-End Ownership", body: "From needs analysis through delivery, reinforcement, and impact measurement — one partner, one accountable team across the entire learning lifecycle." },
      { icon: "BarChart3", title: "Business-Aligned Learning", body: "We speak both learning and business. Programs that build real capability without disrupting productivity or the day job." },
    ],
  },
  Stats: {
    heading: "Numbers That Speak for Themselves.",
    items: [
      { prefix: "", value: 1200, decimals: 0, suffix: "+", label: "Workshops & Programs Delivered" },
      { prefix: "", value: 95, decimals: 0, suffix: "%", label: "Learner Satisfaction Score" },
      { prefix: "", value: 60, decimals: 0, suffix: "K+", label: "Professionals Trained" },
      { prefix: "", value: 200, decimals: 0, suffix: "+", label: "Certification Tracks Supported" },
      { prefix: "", value: 80, decimals: 0, suffix: "+", label: "Master Trainers & Coaches" },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    headingAccent: "Questions.",
    items: [
      { q: "How do we get started with SBS learning services?", a: "It starts with a free, no-obligation learning needs conversation. Our team will help you clarify your capability priorities and recommend the right first step — whether that's an assessment, a pilot program, or a broader strategy engagement." },
      { q: "Do you work with organizations that already have an internal L&D team?", a: "Absolutely. We regularly work alongside internal L&D and HR teams as an extension of their capabilities — providing specialist facilitators, content production capacity, or programs they don't run in-house." },
      { q: "How long does a typical learning program take to design and deliver?", a: "Short workshops can be scoped and delivered within 2–3 weeks. Blended, multi-cohort programs typically run from 6 weeks to 6 months, depending on scale, content depth, and reinforcement needs." },
      { q: "Can you deliver training in Arabic and English?", a: "Yes. Our facilitators and content teams work fluently in both Arabic and English, and we regularly deliver bilingual programs across the region." },
      { q: "Do you offer one-off workshops or long-term learning partnerships?", a: "Both. We deliver targeted workshops and bootcamps, as well as multi-year managed learning services — including academy operating models, LMS management, and ongoing content production." },
    ],
  },
  "Final CTA": {
    headline: "Start with a Free",
    headlineAccent: "Learning Needs Review.",
    body: "You can't grow what you don't measure. Let SBS give you a clear, honest view of your capability gaps — with no obligation and no cost. Our experts will pinpoint your top priorities and outline a concrete first step.",
    ctaLabel: "Book My Free Review",
    ctaHref: "#form",
    ctaLabel2: "Contact Our Learning Team",
    ctaHref2: "#form",
    footnote: "No sales pressure. No jargon. Just clarity.",
    image: cta.url,
  },
};

export type LearningContent = {
  [K in LearningSectionKey]: typeof LEARNING_DEFAULTS[K];
} & { _visible: Record<LearningSectionKey, boolean> };

const SLUG = "services-learning";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    const allObjects = over.every((v) => v && typeof v === "object" && !Array.isArray(v));
    if (allObjects) {
      return over.map((o: any, i: number) =>
        i < (base as any[]).length ? merge((base as any[])[i], o) : o,
      ) as T;
    }
    return over as T;
  }
  if (Array.isArray(base) || Array.isArray(over)) return (over ?? base) as T;
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out: any = { ...(base as any) };
    for (const k of Object.keys(over)) {
      out[k] = merge((base as any)[k], (over as any)[k]);
    }
    return out;
  }
  return (over ?? base) as T;
}

export function useLearningContent(): LearningContent {
  return useSectionsContent(SLUG, LEARNING_DEFAULTS) as LearningContent;
}

export function useLearningContentLegacy(): LearningContent {
  const { data } = useQuery({
    queryKey: ["page-sections", SLUG],
    queryFn: async () => {
      const { data: page } = await supabase.from("pages").select("id").eq("slug", SLUG).maybeSingle();
      if (!page?.id) return { byName: {}, visibleByName: {} } as { byName: Record<string, any>; visibleByName: Record<string, boolean> };
      const { data: sections } = await supabase
        .from("page_sections")
        .select("data, position, is_visible")
        .eq("page_id", page.id)
        .order("position");
      const byName: Record<string, any> = {};
      const visibleByName: Record<string, boolean> = {};
      for (const row of sections ?? []) {
        const d = (row.data ?? {}) as any;
        const name = d.section_name;
        if (typeof name === "string" && name.length > 0) {
          byName[name] = d;
          visibleByName[name] = row.is_visible !== false;
        }
      }
      return { byName, visibleByName };
    },
    staleTime: 30_000,
  });

  const overrides = data?.byName ?? {};
  const visibility = data?.visibleByName ?? {};
  const merged: any = { _visible: {} as Record<LearningSectionKey, boolean> };
  for (const key of Object.keys(LEARNING_DEFAULTS) as LearningSectionKey[]) {
    merged[key] = merge(LEARNING_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as LearningContent;
}
