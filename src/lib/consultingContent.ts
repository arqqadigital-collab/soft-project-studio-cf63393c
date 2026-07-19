import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/consulting/hero.jpg.asset.json";
import cta from "@/assets/consulting/cta.jpg.asset.json";
import s1 from "@/assets/consulting/s1.jpg.asset.json";
import s2 from "@/assets/consulting/s2.jpg.asset.json";
import s3 from "@/assets/consulting/s3.jpg.asset.json";
import s4 from "@/assets/consulting/s4.jpg.asset.json";
import s5 from "@/assets/consulting/s5.jpg.asset.json";
import s6 from "@/assets/consulting/s6.jpg.asset.json";
import s7 from "@/assets/consulting/s7.jpg.asset.json";

export type ConsultingSectionKey =
  | "Hero"
  | "The Problem"
  | "Philosophy"
  | "Services"
  | "Why SBS"
  | "Stats"
  | "FAQ"
  | "Final CTA";

export const CONSULTING_DEFAULTS = {
  Hero: {
    eyebrow: "Business Consulting Services",
    headline: "Turn Complexity Into Clarity.",
    headlineAccent: "Strategy That Moves Your Business Forward.",
    body: "SBS consulting services help organizations cut through uncertainty, align technology with business goals, and build the roadmaps, frameworks, and capabilities that drive lasting transformation — not just short-term fixes.",
    ctaLabel: "Book a Free Strategy Session",
    ctaHref: "#contact",
    ctaLabel2: "Talk to a Consultant",
    ctaHref2: "#contact",
    footnote: "A complimentary 60-minute session with a senior SBS consultant. No obligation.",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Challenge",
    heading: "Most Technology Investments Underperform.",
    headingAccent: "Here's Why.",
    body: "Organizations invest heavily in technology every year — yet many of those investments fail to deliver the expected returns. Not because the technology is wrong, but because the strategy behind it is missing, misaligned, or poorly executed.",
    subheading: "Sound familiar?",
    footnote: "These are not technology problems. They are strategy and governance problems — and that is exactly where SBS excels.",
    items: [
      { text: "Your IT roadmap doesn't connect to business priorities" },
      { text: "Decisions are made reactively rather than strategically" },
      { text: "Digital transformation initiatives stall or lose momentum" },
      { text: "You have too many systems that don't integrate or scale well" },
      { text: "Projects run over budget and past deadline — repeatedly" },
      { text: "Compliance obligations create confusion rather than clarity" },
    ],
  },
  Philosophy: {
    eyebrow: "Consulting Philosophy",
    heading: "We Don't Just Advise.",
    headingAccent: "We Deliver.",
    body: "Many consulting engagements end with a report on a shelf. At SBS, we measure our success by outcomes — not deliverables. Our approach is built on four principles.",
    items: [
      { n: "01", label: "LISTEN FIRST", icon: "Ear", body: "Every engagement begins with genuine discovery. We invest time understanding your business model, your competitive context, your internal challenges, and what success actually looks like for your leadership team." },
      { n: "02", label: "THINK INDEPENDENTLY", icon: "Brain", body: "We have no vendor affiliations, no hidden commercial interests, and no preferred solutions to push. Our recommendations are driven entirely by your needs. That independence is what makes our advice trustworthy." },
      { n: "03", label: "DESIGN FOR REALITY", icon: "DraftingCompass", body: "Strategies that can't be executed are worthless. We design recommendations around your actual budget, team capacity, risk appetite, and organizational culture — not an idealized version of your company." },
      { n: "04", label: "STAY THROUGH EXECUTION", icon: "Handshake", body: "We don't hand over a document and disappear. SBS consultants stay engaged through implementation, adoption, and optimization — ensuring that the strategy we design is the strategy that gets delivered." },
    ],
  },
  Services: {
    eyebrow: "What We Offer",
    heading: "Our Consulting",
    headingAccent: "Services.",
    items: [
      { n: "01", icon: "Map", title: "IT Strategy & Technology Roadmap Development", tagline: "Build a clear, prioritized path forward.", body: "Many organizations operate without a coherent IT strategy — responding to immediate needs rather than building toward a long-term vision. SBS helps you define where you want to go, what it will take to get there, and how to sequence your investments for maximum impact.", image: s1.url, bullets: ["Current-state assessment of your IT landscape and capabilities", "Future-state vision aligned with business strategy", "Multi-year technology roadmap with prioritized initiatives", "Business case development for key investments", "Executive presentation and stakeholder alignment support"] },
      { n: "02", icon: "Rocket", title: "Digital Transformation Advisory", tagline: "Transform intelligently — not just rapidly.", body: "Digital transformation is one of the most overused and least understood terms in business today. SBS cuts through the noise with a structured, people-centered transformation approach that addresses technology, process, and organizational change together.", image: s2.url, bullets: ["Digital maturity assessment and benchmarking", "Transformation strategy and phased execution plan", "Change management framework and communication planning", "Technology enablement recommendations", "Executive sponsorship and governance model design"] },
      { n: "03", icon: "Building2", title: "Enterprise Architecture Consulting", tagline: "Build an architecture that scales with your ambitions.", body: "An organization's enterprise architecture is the foundation on which all technology decisions rest. Poor architecture leads to technical debt, integration failures, and systems that constrain rather than enable growth. SBS architects design future-ready, scalable, and secure enterprise architectures aligned with your strategic objectives.", image: s3.url, bullets: ["Business, application, data, and technology architecture design", "Architecture assessment and gap analysis", "Reference architecture and standards development", "Integration architecture design", "Architecture governance framework"] },
      { n: "04", icon: "ClipboardCheck", title: "Technology Assessment & Vendor Selection", tagline: "Choose the right technology with confidence.", body: "With thousands of technology vendors competing for your attention, making the wrong choice is easy. SBS provides an objective, structured evaluation process that cuts through vendor noise and identifies the solution that genuinely fits your requirements.", image: s4.url, bullets: ["Requirements gathering and functional specification development", "Market scan and vendor longlist/shortlist development", "RFP/RFI development and management", "Vendor evaluation scorecards and demos facilitation", "Final recommendation with detailed rationale"] },
      { n: "05", icon: "ListChecks", title: "Project Management Office (PMO) & Governance", tagline: "Bring discipline and accountability to your technology programs.", body: "Technology programs fail most often due to poor governance — unclear accountability, inadequate risk management, and insufficient executive visibility. SBS establishes or strengthens your PMO to ensure every initiative is delivered with discipline and transparency.", image: s5.url, bullets: ["PMO setup and operating model design", "Project governance frameworks and escalation paths", "Portfolio, program, and project management methodology", "Reporting dashboards and executive status updates", "Risk and issue management processes"] },
      { n: "06", icon: "Workflow", title: "Business Process Optimization", tagline: "Eliminate waste. Unlock productivity.", body: "Many organizations carry significant operational inefficiency that silently drains resources and limits growth. SBS maps, analyzes, and redesigns your business processes to eliminate bottlenecks, reduce manual effort, and create the operational foundation for scalable growth.", image: s6.url, bullets: ["Current-state process mapping and analysis", "Bottleneck and waste identification", "Future-state process design", "Automation opportunity assessment", "Implementation planning and change management support"] },
      { n: "07", icon: "ShieldCheck", title: "Compliance & Risk Management Consulting", tagline: "Know your obligations. Manage your exposure.", body: "Regulatory complexity is growing in every industry. SBS helps organizations build sustainable compliance and risk management programs that satisfy regulators, protect operations, and create genuine business value.", image: s7.url, bullets: ["Regulatory landscape mapping and obligation inventory", "Risk assessment and risk register development", "Control framework design and implementation", "Policy and procedure documentation", "Audit readiness and evidence preparation support", "Ongoing compliance advisory retainer options"] },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Why Clients Choose SBS Consulting",
    headingAccent: "Over the Alternatives.",
    items: [
      { icon: "Award", title: "Senior Practitioners, Not Junior Analysts", body: "Every SBS consulting engagement is led and delivered by senior professionals with 10 to 20+ years of hands-on industry experience. You get people who have done this before — not recent graduates running frameworks from a textbook." },
      { icon: "Layers", title: "Sector Depth Across Multiple Industries", body: "We have worked inside banking, healthcare, government, retail, manufacturing, and telecommunications. We speak your industry's language, understand your regulatory environment, and have seen the specific challenges you face." },
      { icon: "Compass", title: "Zero Vendor Bias", body: "SBS has no commercial relationships that influence our recommendations. We will tell you the honest truth about what you need — even if the answer is \"you don't need to buy anything new right now.\"" },
      { icon: "GitBranch", title: "Execution Partnership", body: "Unlike firms that disappear after the strategy deck, SBS stays engaged through delivery. Our consultants can transition into implementation roles, provide oversight during execution, or remain as advisors throughout your transformation journey." },
      { icon: "Users", title: "Transparent Engagement Models", body: "We offer fixed-fee, time-and-materials, and retainer-based engagements. Scope, timeline, and cost are agreed upfront with no hidden surprises." },
    ],
  },
  Stats: {
    heading: "Our Track Record.",
    items: [
      { value: 150, suffix: "+", label: "Strategy & Consulting Engagements Completed" },
      { value: 10, suffix: "+", label: "Industries Served" },
      { value: 92, suffix: "%", label: "Client Satisfaction Score" },
      { value: 8, suffix: "+", label: "Years of Consulting Excellence" },
      { value: 40, suffix: "+", label: "Senior Consultants & Domain Experts" },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    headingAccent: "Questions.",
    items: [
      { q: "How is SBS different from a large consulting firm?", a: "With SBS, you get senior practitioners — not a bait-and-switch where a partner sells the engagement and a junior analyst delivers it. Every engagement is led by experienced professionals who are accountable for outcomes, not just deliverables." },
      { q: "How long does a typical consulting engagement take?", a: "It depends on scope. A focused technology assessment may take 2–4 weeks. A full IT strategy or transformation roadmap typically takes 6–12 weeks. We'll agree on scope and timeline before we begin." },
      { q: "Can you help us build internal capabilities, not just deliver a report?", a: "Yes. Knowledge transfer and capability building are built into every SBS engagement. We want your team to be stronger after working with us — not dependent on us indefinitely." },
      { q: "Do you offer ongoing advisory services?", a: "Yes. Many of our clients retain SBS on an ongoing basis as a strategic technology advisor — providing monthly guidance, review of key decisions, and access to our broader team of specialists." },
      { q: "Can you work with our existing vendors and technology partners?", a: "Absolutely. We collaborate with your existing ecosystem rather than replacing it. Our role is to ensure that every technology investment is aligned, optimized, and delivering value." },
    ],
  },
  "Final CTA": {
    headline: "Let's Build Your Technology",
    headlineAccent: "Strategy Together.",
    body: "Book a complimentary 60-minute strategy session with a senior SBS consultant. We'll discuss your current challenges, where you want to go, and what a realistic path forward looks like — with no obligation and no sales pitch.",
    ctaLabel: "Book My Free Strategy Session",
    ctaHref: "#form",
    ctaLabel2: "Contact Our Consulting Team",
    ctaHref2: "#form",
    footnote: "Confidential. No obligation. Delivered by a senior consultant — not a sales rep.",
    image: cta.url,
  },
} as const;

export type ConsultingContent = {
  [K in ConsultingSectionKey]: typeof CONSULTING_DEFAULTS[K];
} & { _visible: Record<ConsultingSectionKey, boolean> };

const SLUG = "services-consulting";

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

export function useConsultingContent(): ConsultingContent {
  return useSectionsContent(SLUG, CONSULTING_DEFAULTS) as ConsultingContent;
}

export function useConsultingContentLegacy(): ConsultingContent {
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
  const merged: any = { _visible: {} as Record<ConsultingSectionKey, boolean> };
  for (const key of Object.keys(CONSULTING_DEFAULTS) as ConsultingSectionKey[]) {
    merged[key] = merge(CONSULTING_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ConsultingContent;
}
