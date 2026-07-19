import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/implementation/hero.jpg.asset.json";
import cta from "@/assets/implementation/cta.jpg.asset.json";
import s1 from "@/assets/implementation/s1.jpg.asset.json";
import s2 from "@/assets/implementation/s2.jpg.asset.json";
import s3 from "@/assets/implementation/s3.jpg.asset.json";
import s4 from "@/assets/implementation/s4.jpg.asset.json";
import s5 from "@/assets/implementation/s5.jpg.asset.json";
import s6 from "@/assets/implementation/s6.jpg.asset.json";
import s7 from "@/assets/implementation/s7.jpg.asset.json";

export type ImplementationSectionKey =
  | "Hero"
  | "The Problem"
  | "Methodology"
  | "Services"
  | "Why SBS"
  | "Stats"
  | "FAQ"
  | "Final CTA";

export const IMPLEMENTATION_DEFAULTS = {
  Hero: {
    eyebrow: "Implementation & Integration",
    headline: "From Blueprint to Reality.",
    headlineAccent: "Technology That Works — From Day One.",
    body: "A great strategy only creates value when it's executed with precision. SBS delivers end-to-end implementation and integration services that bring your technology investments to life — on time, within budget, and without disrupting your operations.",
    ctaLabel: "Request a Project Scoping Call",
    ctaHref: "#contact",
    ctaLabel2: "Talk to an Implementation Expert",
    ctaHref2: "#contact",
    footnote: "Get a detailed project plan, timeline, and cost estimate — with full transparency.",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Challenge",
    heading: "Technology Projects Have a Failure Problem.",
    headingAccent: "SBS Fixes It.",
    body: "Research consistently shows that more than 70% of technology implementation projects fail to meet their original objectives. The causes are well-known — yet they happen again and again:",
    items: [
      { title: "Scope is poorly defined before work begins" },
      { title: "Systems are deployed in isolation without integration planning" },
      { title: "Projects run over budget due to change orders and rework" },
      { title: "Go-live deadlines slip, disrupting business operations" },
      { title: "Users don't adopt new tools because training is an afterthought" },
      { title: "There's no reliable support once the vendor has been paid" },
    ],
    footer: "The result? Technology that cost significant money sits underused, creates friction, or gets abandoned entirely. At SBS, we've built our entire implementation practice around solving these problems — because we've seen the damage they cause, and we know exactly how to prevent them.",
  },
  Methodology: {
    eyebrow: "How We Deliver",
    heading: "A Proven Methodology.",
    headingAccent: "Relentless Attention to Detail.",
    body: "Successful implementation is not about technology alone. It's about people, process, and technology working in harmony.",
    items: [
      { n: "01", label: "DISCOVER", icon: "Search", body: "We invest deeply in understanding your business requirements, technical environment, constraints, and success criteria before any deployment begins. This phase prevents the costly surprises that derail most projects." },
      { n: "02", label: "DESIGN", icon: "PenTool", body: "We architect solutions that fit your specific context. Every integration, configuration decision, and workflow design is mapped against your actual business processes — not a generic template." },
      { n: "03", label: "DEPLOY", icon: "PlayCircle", body: "We execute with precision using agile delivery practices. Stakeholders receive regular status updates and demos. Issues are surfaced and resolved early — not discovered on go-live day." },
      { n: "04", label: "ENABLE", icon: "GraduationCap", body: "We equip your teams with the knowledge, documentation, and hands-on training needed to take full ownership and operate confidently post-launch." },
      { n: "05", label: "SUPPORT", icon: "LifeBuoy", body: "We stay engaged after go-live to fine-tune configurations, resolve issues, and ensure the solution performs to its full potential in a live environment." },
    ],
  },
  Services: {
    eyebrow: "What We Offer",
    heading: "Our Implementation & Integration",
    headingAccent: "Services.",
    items: [
      { n: "01", icon: "Server", title: "Enterprise Software Implementation", tagline: "Deploy the platforms your business runs on — the right way.", body: "Whether you're implementing an ERP, CRM, ITSM, HCM, or any other enterprise platform, SBS brings the configuration expertise, process alignment skills, and project discipline to deliver a successful deployment that your teams will actually use.", subhead: "Platforms we work with", platforms: ["ERP: SAP, Oracle, Microsoft Dynamics", "CRM: Salesforce, Microsoft Dynamics 365", "ITSM: ServiceNow, Jira Service Management", "HCM: Workday, SAP SuccessFactors"], bullets: ["Requirements gathering and fit-gap analysis", "System configuration and customization", "Data migration planning and execution", "User acceptance testing (UAT) support", "Go-live planning and hypercare support"], image: s1.url },
      { n: "02", icon: "Plug", title: "Systems Integration & API Development", tagline: "Connect your technology ecosystem. Eliminate data silos.", body: "Modern organizations run on dozens of applications. When those systems don't communicate, the result is duplicated data, manual reconciliation work, broken workflows, and frustrated users. SBS designs and builds integrations that make your technology ecosystem work as one.", bullets: ["Integration architecture design", "RESTful and SOAP API development and management", "Middleware and iPaaS platform implementation (MuleSoft, Azure Integration Services, Dell Boomi)", "Real-time and batch data synchronization", "API documentation and governance"], image: s2.url },
      { n: "03", icon: "Cloud", title: "Cloud Migration & Deployment", tagline: "Move to the cloud without the disruption.", body: "Cloud migration is one of the most impactful — and most frequently mishandled — technology initiatives an organization can undertake. SBS provides a disciplined, risk-managed migration approach that ensures continuity, security, and performance from day one.", subhead: "Migration strategies we support", platforms: ["Rehost (Lift & Shift)", "Replatform", "Refactor / Re-architect", "Hybrid cloud deployment"], bullets: ["Migration readiness assessment", "Workload prioritization and sequencing", "Migration execution with minimal downtime", "Post-migration optimization and cost management", "Cloud landing zone and governance setup"], image: s3.url },
      { n: "04", icon: "Network", title: "Network & Infrastructure Implementation", tagline: "Build the foundation your operations depend on.", body: "From LAN/WAN design to data center buildout, SBS implements enterprise network and infrastructure solutions with the reliability, security, and scalability that modern operations demand.", bullets: ["Network architecture design and implementation", "Firewall, switching, and routing deployment", "Data center setup and server provisioning", "SD-WAN and wireless infrastructure implementation", "Infrastructure documentation and configuration management"], image: s4.url },
      { n: "05", icon: "ShieldCheck", title: "Security Solutions Deployment", tagline: "Implement security tools that actually work together.", body: "Security solutions are most effective when deployed as part of a cohesive, integrated architecture — not as isolated point products. SBS implements security technologies within a unified framework, ensuring they communicate, correlate, and reinforce each other.", subhead: "Solutions we deploy", platforms: ["SIEM platforms (Splunk, Microsoft Sentinel, IBM QRadar)", "Endpoint Detection & Response (EDR/XDR)", "Identity & Access Management (IAM/PAM)", "Firewall and network security platforms", "Email and web security gateways", "Data Loss Prevention (DLP)"], bullets: [], image: s5.url },
      { n: "06", icon: "Database", title: "Data Integration & Migration", tagline: "Move and connect your data — safely and accurately.", body: "Data is your most valuable asset. Migrating or integrating it poorly can corrupt records, break processes, and undermine the systems that depend on it. SBS executes data migration and integration projects with rigorous quality controls and full traceability.", bullets: ["Data discovery and profiling", "Data cleansing and transformation", "ETL/ELT pipeline design and development", "Migration validation and reconciliation", "Data lineage documentation"], image: s6.url },
      { n: "07", icon: "Cog", title: "DevOps & Automation Implementation", tagline: "Accelerate delivery. Reduce manual effort. Build better.", body: "Modern software delivery demands speed without sacrificing stability. SBS implements DevOps practices and automation frameworks that shorten release cycles, improve quality, and reduce the toil that slows development teams down.", bullets: ["CI/CD pipeline design and implementation", "Infrastructure as Code (IaC) with Terraform / Ansible", "Container orchestration with Docker and Kubernetes", "Automated testing framework integration", "DevSecOps integration — security embedded in the pipeline"], image: s7.url },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Why Organizations Trust SBS",
    headingAccent: "to Deliver Their Most Critical Projects.",
    items: [
      { icon: "Award", title: "Certified Implementation Engineers", body: "Our team holds certifications across the platforms and technologies we implement. You're not learning on your project — you're benefiting from professionals who have delivered dozens of similar engagements before." },
      { icon: "ClipboardCheck", title: "A Dedicated Project Manager on Every Engagement", body: "Every SBS project has a dedicated project manager responsible for scope, timeline, budget, risk, and stakeholder communication. Nothing falls through the cracks. You always know exactly where your project stands." },
      { icon: "Eye", title: "Transparent Project Reporting", body: "We provide regular status reports, milestone tracking, and risk registers throughout delivery. No surprises. No excuses. Just visibility." },
      { icon: "BadgeCheck", title: "Quality Assurance at Every Stage", body: "Rigorous testing — unit, integration, UAT, and performance — is built into our delivery process. Issues are caught and resolved before they reach your users." },
      { icon: "Headphones", title: "Post-Implementation Support", body: "Our relationship doesn't end at go-live. SBS provides structured post-implementation support with defined SLAs — ensuring your solution stabilizes and performs in a live environment." },
    ],
  },
  Stats: {
    heading: "Delivery Results That Speak for Themselves.",
    items: [
      { prefix: "", value: 200, decimals: 0, suffix: "+", label: "Successful Implementations Delivered" },
      { prefix: "", value: 95, decimals: 0, suffix: "%", label: "On-Time, On-Budget Project Delivery Rate" },
      { prefix: "", value: 30, decimals: 0, suffix: "+", label: "Technology Platforms and Vendors Supported" },
      { prefix: "", value: 0, decimals: 0, suffix: "", label: "Reported Go-Live Failures in Last 3 Years" },
      { prefix: "", value: 50, decimals: 0, suffix: "+", label: "Certified Implementation Professionals" },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    headingAccent: "Questions.",
    items: [
      { q: "How do you handle projects where requirements change during delivery?", a: "Change is normal in complex projects. We use an agile delivery approach with a formal change management process — so scope changes are evaluated, agreed, and incorporated transparently, without derailing the project." },
      { q: "Can you work with our existing vendors and technology partners?", a: "Yes. We frequently collaborate with software vendors, hardware suppliers, and third-party integrators as part of a broader delivery ecosystem. We're experienced at coordinating multi-vendor environments effectively." },
      { q: "Do you provide training as part of implementation?", a: "Always. User enablement and knowledge transfer are mandatory phases in every SBS implementation — because a well-configured system that users don't understand is a failed implementation." },
      { q: "Can you take over an implementation that has stalled or gone wrong?", a: "Yes. We have a track record of rescuing troubled projects. Our team will assess the current state, identify the root causes, and develop a realistic recovery plan." },
      { q: "What size of projects do you work on?", a: "We work on projects of all sizes — from focused integrations taking a few weeks, to multi-year enterprise transformation programs. Our delivery model scales to match the complexity and scale of your initiative." },
    ],
  },
  "Final CTA": {
    headline: "Have a Project in Mind?",
    headlineAccent: "Let's Scope It Together.",
    body: "Tell us about your initiative and we'll build a detailed project plan, resource model, timeline, and cost estimate — with complete transparency from day one. No vague quotes. No hidden scope. Just clarity.",
    ctaLabel: "Request a Project Scoping Call",
    ctaHref: "#form",
    ctaLabel2: "Contact Our Delivery Team",
    ctaHref2: "#form",
    footnote: "",
    image: cta.url,
  },
};

export type ImplementationContent = {
  [K in ImplementationSectionKey]: typeof IMPLEMENTATION_DEFAULTS[K];
} & { _visible: Record<ImplementationSectionKey, boolean> };

const SLUG = "services-implementation";

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

export function useImplementationContent(): ImplementationContent {
  return useSectionsContent(SLUG, IMPLEMENTATION_DEFAULTS) as ImplementationContent;
}

export function useImplementationContentLegacy(): ImplementationContent {
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
  const merged: any = { _visible: {} as Record<ImplementationSectionKey, boolean> };
  for (const key of Object.keys(IMPLEMENTATION_DEFAULTS) as ImplementationSectionKey[]) {
    merged[key] = merge(IMPLEMENTATION_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as ImplementationContent;
}
