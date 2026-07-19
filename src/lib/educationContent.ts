import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/education/hero.jpg.asset.json";
import tradFail from "@/assets/education/traditional-fail.jpg.asset.json";
import p1 from "@/assets/education/problem-p1.jpg.asset.json";
import p2 from "@/assets/education/problem-p2.jpg.asset.json";
import p3 from "@/assets/education/problem-p3.jpg.asset.json";
import u1 from "@/assets/education/uc-1.jpg.asset.json";
import u2 from "@/assets/education/uc-2.jpg.asset.json";
import u3 from "@/assets/education/uc-3.jpg.asset.json";
import u4 from "@/assets/education/uc-4.jpg.asset.json";

export type EducationSectionKey =
  | "Hero"
  | "The Problem"
  | "Traditional Fail"
  | "Approach"
  | "Capabilities"
  | "Use Cases"
  | "Business Impact"
  | "Implementation"
  | "Why SBS"
  | "Final CTA";

export const EDUCATION_DEFAULTS = {
  Hero: {
    headline: "Education & Research ERP that runs on",
    headlineAccent: "real academic reality.",
    body:
      "SBS delivers an academic ERP that unifies the entire student, research, and finance lifecycle into a single operational model — so leaders decide on live academic data, not delayed reports.",
    ctaLabel: "Talk to an ERP consultant",
    ctaHref: "#contact",
    ctaLabel2: "Explore capabilities",
    ctaHref2: "#capabilities",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Disconnected Institution Is a",
    headingAccent: "Fragile Institution.",
    body:
      "Most institutions don't struggle with teaching or research — they struggle with coordination. The result is not inefficiency; it is loss of academic and financial control.",
    items: [
      { n: "01", label: "RISK", title: "Disconnected Admissions", body: "Admissions, registration, and student services run on separate tools. Applicants fall through the cracks and enrolled students face rework, delays, and lost documents.", image: p1.url },
      { n: "02", label: "RISK", title: "Manual Research Administration", body: "Grants, ethics approvals, and project tracking live in spreadsheets. Principal investigators lose time to paperwork instead of research — and finance never sees a real spend picture.", image: p2.url },
      { n: "03", label: "RISK", title: "Invisible Academic Finance", body: "Tuition, sponsorships, and department budgets are reconciled after the term ends. Deans and CFOs make decisions on delayed, incomplete reports instead of live financial reality.", image: p3.url },
    ],
  },
  "Traditional Fail": {
    heading: "Where Traditional Systems Fail Education and Research Institutions",
    body: "Generic ERP systems typically fail because they do not reflect how academia actually works:",
    footnote: "Academic institutions require continuous synchronization between planning and execution — not periodic reporting.",
    image: tradFail.url,
    bullets: [
      "Student, HR, and finance systems operate in silos",
      "No live connection between enrollment and revenue",
      "Research grants and outcomes are not captured in real time",
      "Timetabling is disconnected from resources and rooms",
      "Academic planning is disconnected from execution",
    ],
  },
  Approach: {
    eyebrow: "SBS Education & Research ERP Approach",
    heading: "Designed around your academic reality —",
    headingAccent: "not generic templates.",
    body: "This is not ERP implementation. It is academic process reconstruction inside ERP.",
    items: [
      { icon: "Cpu", text: "Academic-first system architecture" },
      { icon: "RefreshCw", text: "Real-time student and finance synchronization" },
      { icon: "DollarSign", text: "Grant- and budget-aware academic workflows" },
      { icon: "Network", text: "End-to-end traceability across the student lifecycle" },
      { icon: "ShieldCheck", text: "Integration between academics, research, and finance" },
    ],
  },
  Capabilities: {
    eyebrow: "Core Capabilities",
    heading: "Everything a modern institution",
    headingAccent: "needs to operate in sync.",
    items: [
      { icon: "GraduationCap", title: "Student Lifecycle Management", items: ["Applications, admissions, and enrollment", "Program, course, and section management", "Attendance, grading, and transcripts"] },
      { icon: "Layers", title: "Curriculum & Timetabling", items: ["Program and course catalog with versioning", "Automated timetabling and room assignment", "Faculty workload and teaching load tracking"] },
      { icon: "Boxes", title: "Research & Grants Management", items: ["Proposal, award, and milestone tracking", "Ethics, compliance, and publication records", "Multi-source grant funding visibility"] },
      { icon: "Activity", title: "Faculty & HR Operations", items: ["Faculty profiles, ranks, and tenure tracking", "Workload, evaluation, and development plans", "Payroll and benefits integration"] },
      { icon: "Calculator", title: "Finance & Fee Management", items: ["Tuition, scholarships, and sponsor billing", "Real-time department and grant budgets", "Profitability per program and cohort"] },
    ],
  },
  "Use Cases": {
    eyebrow: "Education Use Cases",
    heading: "Real academic environments",
    headingAccent: "we solve for.",
    footnote: "Also serving grant-sensitive academic environments where financial discipline depends on accurate, real-time reporting.",
    items: [
      { n: "01", title: "Universities with hybrid classroom and online delivery", body: "Unified course, timetable, and assessment management across in-person, hybrid, and fully online cohorts — with a single student record across every mode.", image: u1.url },
      { n: "02", title: "Research-intensive institutions with active grants", body: "Proposal-to-close grant tracking, milestone visibility, and integrated finance — so PIs, deans, and CFOs work from the same live view of research activity.", image: u2.url },
      { n: "03", title: "Multi-campus universities and college groups", body: "Central academic catalog and finance, local campus execution, and consolidated reporting across faculties, schools, and campuses.", image: u3.url },
      { n: "04", title: "Institutions scaling student services and support", body: "Unified student profile, self-service portals, and case-managed student support — reducing time-to-response and improving retention across the student journey.", image: u4.url },
    ],
  },
  "Business Impact": {
    eyebrow: "Business Impact",
    heading: "Measurable outcomes,",
    headingAccent: "term after term.",
    items: [
      { icon: "Zap", text: "Faster admissions and enrollment cycles" },
      { icon: "Recycle", text: "Reduced administrative rework across departments" },
      { icon: "LineChart", text: "Accurate finance per program, faculty, and grant" },
      { icon: "Eye", text: "Live visibility across every campus and school" },
      { icon: "Target", text: "Better alignment between academic plans and delivery" },
    ],
  },
  Implementation: {
    eyebrow: "Implementation Approach",
    heading: "A structured academic",
    headingAccent: "ERP rollout.",
    items: [
      { icon: "ScanSearch", n: "01", title: "Academic process mapping", body: "Document existing student, research, and finance flows, dependencies, and operational gaps before configuring anything." },
      { icon: "Settings2", n: "02", title: "Program and workflow structuring", body: "Design programs, courses, timetabling rules, and approval flows aligned with how the institution actually runs." },
      { icon: "Workflow", n: "03", title: "System configuration and integration", body: "Configure ERP modules and integrate with LMS, finance, HR, and research systems already in use." },
      { icon: "Rocket", n: "04", title: "Faculty and staff enablement", body: "Train faculty, registrars, and administrators on the new workflows with hands-on operational readiness checks." },
      { icon: "TrendingUp", n: "05", title: "Continuous optimization", body: "Monitor adoption, refine workflows, and extend automation across new programs, campuses, and research centers." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Operational design first,",
    headingAccent: "software setup second.",
    bullets: [
      "Deep focus on operational design, not just software setup",
      "Industry-aligned academic architecture approach",
      "Strong integration across academic, research, and finance layers",
      "Custom workflow capability for complex educational environments",
    ],
  },
  "Final CTA": {
    headline: "Build an academic system that",
    headlineAccent: "matches your institutional reality.",
    body:
      "If your institution depends on spreadsheets, delayed updates, or disconnected admissions, research, and finance tools — it is not a system. It is fragmentation. SBS helps you rebuild academic control inside a unified ERP environment.",
    ctaLabel: "Request an academic ERP assessment",
    ctaHref: "#contact",
    image: hero.url,
  },
} as const;

export type EducationContent = {
  [K in EducationSectionKey]: typeof EDUCATION_DEFAULTS[K];
} & { _visible: Record<EducationSectionKey, boolean> };

const SLUG = "erp-education";

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

export function useEducationContent(): EducationContent {
  return useSectionsContent(SLUG, EDUCATION_DEFAULTS) as EducationContent;
}

export function useEducationContentLegacy(): EducationContent {
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
  const merged: any = { _visible: {} as Record<EducationSectionKey, boolean> };
  for (const key of Object.keys(EDUCATION_DEFAULTS) as EducationSectionKey[]) {
    merged[key] = merge(EDUCATION_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as EducationContent;
}
