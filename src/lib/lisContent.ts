import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import lisHeroVideo from "@/assets/lis/lis-hero.mp4.asset.json";
import problem1 from "@/assets/lis/problem-1.jpg";
import problem2 from "@/assets/lis/problem-2.jpg";
import problem3 from "@/assets/lis/problem-3.jpg";
import problem4 from "@/assets/lis/problem-4.jpg";
import journey1 from "@/assets/lis/journey-1.jpg";
import journey2 from "@/assets/lis/journey-2.png";
import journey3 from "@/assets/lis/journey-3.png";
import journey4 from "@/assets/lis/journey-4.jpg";

export type LisSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const LIS_DEFAULTS = {
  Hero: {
    headline: "Precision at Every Test.",
    headlineAccent: "Clarity at Every Result.",
    ctaLabel: "Start Your Free Trial",
    ctaHref: "#contact",
    ctaLabel2: "Watch a Demo",
    ctaHref2: "#contact",
    chips: [
      "Trusted by 200+ Labs",
      "18 Countries",
      "HIPAA Compliant",
      "HL7 & FHIR Ready",
      "CAP · CLIA · ISO 15189 Ready",
    ] as string[],
    mediaUrl: lisHeroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing Secreta LIS",
    headline: "One Platform for the",
    headlineAccent: "Entire Lab Workflow",
    body:
      "Transform your lab operations with a system built for speed, accuracy, and complete traceability. From " +
      "sample intake to final report, every step is tracked, automated, and audit-ready — so your team can " +
      "focus on what matters: accurate diagnoses and faster care.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Is Your Lab Struggling",
    headingAccent: "With This?",
    subheading: "There's a better way to run your laboratory.",
    items: [
      { title: "Mislabeled Samples", image: problem1, description: "Manual sample logging leads to mislabeling and lost specimens — putting patient safety and lab credibility at risk." },
      { title: "Delayed Results", image: problem2, description: "Disconnected systems and paper-based reporting create delays that slow down diagnosis and treatment decisions." },
      { title: "Audit Failures", image: problem3, description: "Incomplete chain-of-custody records make accreditation audits stressful — and sometimes impossible to pass." },
      { title: "Wasted Staff Time", image: problem4, description: "Hours lost every day re-entering the same data between instruments, worksheets, and the hospital record." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Everything Your Lab Needs. Nothing It Doesn't.",
    body:
      "A single, integrated platform that covers your entire laboratory workflow — from the moment a sample " +
      "arrives to the second a result is delivered.",
    items: [
      { icon: "FlaskConical", title: "Sample Management", description: "Track every specimen from collection to disposal with barcode scanning, real-time location updates, and automated rejection flags for compromised samples." },
      { icon: "ClipboardCheck", title: "Result Entry & Validation", description: "Enter, review, and authorize results through configurable validation rules. Flag abnormal values automatically and route critical results to the right clinician instantly." },
      { icon: "Microscope", title: "Instrument Integration", description: "Connect directly to your analyzers and diagnostic instruments. Eliminate manual transcription errors with bidirectional data transfer and real-time result import." },
      { icon: "LineChart", title: "Quality Control", description: "Run Levey-Jennings charts, Westgard rules, and peer comparison programs. Get immediate QC failure alerts before results are released." },
      { icon: "FileSearch", title: "Reporting & Delivery", description: "Generate formatted patient reports in seconds. Deliver results via portal, print, email, or HL7 message — with full audit trail on every action." },
      { icon: "Activity", title: "Patient History & Trends", description: "View longitudinal data across visits. Compare results over time and flag clinically significant changes automatically." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "Up and Running in 4 Steps",
    body: "From configuration to optimization — every step connected, every workflow streamlined.",
    items: [
      { icon: "Settings", title: "Configure Your Lab", image: journey1, description: "Set up your departments, test catalog, reference ranges, and user roles in a guided onboarding session." },
      { icon: "Link2", title: "Connect Your Instruments", image: journey2, description: "Integrate your analyzers and existing hospital systems using our pre-built connectors and HL7 interfaces." },
      { icon: "Rocket", title: "Go Live", image: journey3, description: "Your team starts processing samples, entering results, and generating reports — all from one screen." },
      { icon: "TrendingUp", title: "Optimize Over Time", image: journey4, description: "Use built-in analytics to track turnaround times, error rates, and workload distribution. Improve continuously with real data." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Results You Can Measure",
    items: [
      { value: "40%", label: "Average reduction in turnaround time" },
      { value: "99.97%", label: "Sample traceability rate across all workflows" },
      { value: "60%", label: "Fewer data entry errors after instrument integration" },
      { value: "3×", label: "Faster audit preparation with automated compliance reports" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connects With Your Existing Systems",
    subheading:
      "Works seamlessly with your HIS, EMR, PACS, and billing platforms. Pre-built connectors for Epic, Cerner, " +
      "Meditech, and all major HL7-compatible systems. Open API available for custom integrations.",
    items: [
      { title: "HIS" },
      { title: "EMR" },
      { title: "PACS" },
      { title: "Billing" },
      { title: "Epic" },
      { title: "Cerner" },
      { title: "Meditech" },
      { title: "HL7 v2" },
      { title: "FHIR" },
      { title: "REST API" },
    ] as Array<{ title: string }>,
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How long does implementation take?", a: "Most labs are fully live within 2 to 4 weeks, depending on the number of instruments and integrations required." },
      { q: "Is the system cloud-based or on-premises?", a: "Both options are available. Cloud-hosted with 99.9% uptime SLA, or on-premises deployment for facilities with strict data residency requirements." },
      { q: "Does it support multiple lab locations?", a: "Yes. The Enterprise plan supports multi-site management with centralized reporting and per-location configuration." },
      { q: "Is it compliant with CAP, CLIA, and ISO 15189?", a: "The system is designed to support compliance with all major laboratory accreditation standards, including audit trail requirements and QC documentation." },
      { q: "Can it connect to our existing HIS?", a: "Yes. We support HL7 v2, HL7 FHIR, and REST API integrations with all major hospital information systems." },
    ],
  },
  "Final CTA": {
    headline: "Ready to Modernize",
    headlineAccent: "Your Laboratory?",
    body: "Join hundreds of labs that have already cut errors, reduced delays, and passed audits with confidence.",
    primaryLabel: "Book a Free Demo",
    primaryHref: "#",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#",
    footnote: "No contracts. No setup fees. Cancel anytime.",
  },
} as const;

export type LisContent = {
  [K in LisSectionKey]: typeof LIS_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<LisSectionKey, boolean> };

const LIS_PAGE_SLUG = "lis";

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

export function useLisContent(): LisContent {
  return useSectionsContent(LIS_PAGE_SLUG, LIS_DEFAULTS) as LisContent;
}

export function useLisContentLegacy(): LisContent {
  const { data } = useQuery({
    queryKey: ["page-sections", LIS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", LIS_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) return { byName: {}, visibleByName: {} };

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
  const merged: any = { _visible: {} as Record<LisSectionKey, boolean> };
  for (const key of Object.keys(LIS_DEFAULTS) as LisSectionKey[]) {
    merged[key] = merge(LIS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as LisContent;
}
