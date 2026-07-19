import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

// Section keys mirror the `data.section_name` values saved by the builder.
export type CareersSectionKey =
  | "Hero"
  | "Promise"
  | "Hiring Journey"
  | "Final CTA";

export const CAREERS_DEFAULTS = {
  Hero: {
    eyebrow: "Careers at SBS",
    headline: "Build the Future of Enterprise Technology",
    headlineAccent: "With a Team That Backs You.",
    subheadline:
      "Join a growing team of engineers, consultants, and healthcare technology experts delivering transformation programs that matter — for clients across the region.",
    mediaUrl: "",
  },
  Promise: {
    intro:
      "At SBS, careers are built — not just filled. We invest in the people behind the solutions, because great technology only ships when great teams have the trust, tools, and space to do their best work.",
    items: [
      {
        icon: "Target",
        title: "Our Promise to You",
        description:
          "Meaningful work on programs that shape entire organizations — with clear ownership, senior mentorship, and the autonomy to make real decisions from day one.",
      },
      {
        icon: "Eye",
        title: "How We Work",
        description:
          "Collaborative, low-ego, outcome-focused. We hire humble experts, respect deep work, and reward people who help their teammates win.",
      },
    ],
  },
  "Hiring Journey": {
    eyebrow: "Our Hiring Journey",
    heading: "A Clear, Respectful Path from Application to Offer",
    items: [
      { icon: "Users", title: "Apply", description: "Browse open roles and submit your application. Our talent team reviews every profile personally — no black-box screening." },
      { icon: "HeartHandshake", title: "Introductory Call", description: "A friendly conversation with our recruiters to understand your goals, experience, and what you're looking for in your next role." },
      { icon: "GraduationCap", title: "Technical & Team Interviews", description: "Meet the people you'd actually work with. Structured, respectful interviews focused on real-world scenarios — not trick questions." },
      { icon: "TrendingUp", title: "Offer & Onboarding", description: "A clear, competitive offer followed by a structured onboarding journey that sets you up for success from day one." },
      { icon: "Rocket", title: "Grow With Us", description: "Continuous learning, certifications, mentorship, and clear career paths — so your growth never plateaus at SBS." },
    ],
  },
  "Final CTA": {
    headline: "Ready to Build Something",
    headlineAccent: "That Matters?",
    body1:
      "We're always looking for curious engineers, sharp consultants, and healthcare technology experts who want to work on programs that move entire industries forward.",
    body2:
      "Don't see the perfect role listed? Send us your profile anyway — great people create great opportunities.",
    ctaNote:
      "Explore open roles or introduce yourself to our talent team. We reply to every application personally.",
    ctaLabel: "Get In Touch With Talent",
    ctaHref: "/contact",
  },
} as const;

export type CareersContent = {
  [K in CareersSectionKey]: (typeof CAREERS_DEFAULTS)[K] & Record<string, any>;
} & { _visible: Record<CareersSectionKey, boolean> };

const CAREERS_PAGE_SLUG = "careers";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
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

export function useCareersContent(): CareersContent {
  return useSectionsContent(CAREERS_PAGE_SLUG, CAREERS_DEFAULTS) as CareersContent;
}

export function useCareersContentLegacy(): CareersContent {
  const { data } = useQuery({
    queryKey: ["page-sections", CAREERS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", CAREERS_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) {
        return { byName: {}, visibleByName: {} } as {
          byName: Record<string, any>;
          visibleByName: Record<string, boolean>;
        };
      }
      const { data: sections, error: secErr } = await supabase
        .from("page_sections")
        .select("data, position, is_visible")
        .eq("page_id", page.id)
        .order("position");
      if (secErr) throw secErr;

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
  const merged: any = { _visible: {} as Record<CareersSectionKey, boolean> };
  for (const key of Object.keys(CAREERS_DEFAULTS) as CareersSectionKey[]) {
    merged[key] = merge(CAREERS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as CareersContent;
}
