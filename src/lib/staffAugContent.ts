import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/staffaug/hero.jpg.asset.json";
import cta from "@/assets/staffaug/cta.jpg.asset.json";
import s1 from "@/assets/staffaug/managed-it-new.jpg.asset.json";
import s2 from "@/assets/staffaug/s2.jpg.asset.json";
import s3 from "@/assets/staffaug/s3.jpg.asset.json";
import s4 from "@/assets/staffaug/s4-new.jpg.asset.json";
import s5 from "@/assets/staffaug/s5.jpg.asset.json";
import s6 from "@/assets/staffaug/s6.jpg.asset.json";
import s7 from "@/assets/staffaug/managed-cloud-services.png.asset.json";
import s8 from "@/assets/staffaug/s8.jpg.asset.json";

export type StaffAugSectionKey =
  | "Hero"
  | "The Problem"
  | "Models"
  | "Services"
  | "Why SBS"
  | "Stats"
  | "FAQ"
  | "Final CTA";

export const STAFF_AUG_DEFAULTS = {
  Hero: {
    eyebrow: "Staff Augmentation & Managed Services",
    headline: "The Right Talent. The Right Support.",
    headlineAccent: "Exactly When and How You Need It.",
    body: "Scale your team with certified technology professionals on demand — or hand off your IT operations entirely to SBS. Either way, you get the expertise, reliability, and accountability your business requires to operate and grow with confidence.",
    ctaLabel: "Find the Right Talent",
    ctaHref: "#contact",
    ctaLabel2: "Explore Managed Services",
    ctaHref2: "#services",
    footnote: "Most resources deployed within 5–10 business days. SLA-backed managed services from day one.",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Challenge",
    heading: "Technology Demands Are Growing.",
    headingAccent: "The Talent to Meet Them Isn't.",
    body: "The technology skills shortage is a global crisis — and it's getting worse. Organizations are struggling to find, hire, and retain the specialized professionals they need to run their IT operations and deliver critical projects. At the same time, the day-to-day management of IT environments is consuming the bandwidth of internal teams who should be focused on strategic work, not keeping the lights on.",
    footnote: "There is a better model. SBS provides it.",
    items: [
      { text: "Critical projects stall due to resource gaps" },
      { text: "Full-time hiring takes months and costs significantly more" },
      { text: "IT operations are inconsistent without the right specialists in place" },
      { text: "Your best people are buried in routine tasks instead of driving growth" },
      { text: "Vendor fragmentation creates accountability gaps and service inconsistency" },
    ],
  },
  Models: {
    eyebrow: "Our Approach — Two Models. One Trusted Partner.",
    heading: "Flexible Engagement Models",
    headingAccent: "Designed Around Your Needs.",
    body: "SBS offers two complementary service models that can be deployed independently or combined for maximum impact.",
    footnote: "Both models come with a single point of contact, transparent reporting, and the full backing of SBS's technical bench and management infrastructure.",
    items: [
      { n: "01", tag: "Staff Augmentation", icon: "UserPlus", title: "On-Demand Certified Professionals", body: "Pre-vetted, certified technology professionals who embed directly into your team. They work under your direction, follow your processes, and deliver to your standards — with none of the overhead of permanent hiring.", best: "Project-specific resource needs, skill gap coverage, team scaling, and interim leadership roles." },
      { n: "02", tag: "Managed Services", icon: "ShieldCheck", title: "Fully Outsourced IT Operations", body: "Fully outsourced management of defined IT functions — from infrastructure and security operations to helpdesk and application support. SBS takes full ownership, accountability, and SLA responsibility so your teams can focus on what moves the business forward.", best: "IT operations offloading, cost optimization, 24/7 coverage, and organizations without in-house IT maturity." },
    ],
  },
  Services: {
    eyebrow: "What We Offer",
    heading: "Our Staff Augmentation &",
    headingAccent: "Managed Services.",
    items: [
      { n: "01", icon: "UserCheck", group: "Staff Augmentation", title: "Technology Staff Augmentation", tagline: "Access the specialists you need — without the hiring delay.", body: "SBS maintains a deep bench of certified technology professionals across all major disciplines. Whether you need a cybersecurity engineer for six months, a cloud architect for a transformation project, or a network specialist to support a critical deployment, we deploy the right person quickly — fully vetted, certified, and ready to contribute.", bullets: ["Pre-screened candidates with verified credentials and references", "Rapid deployment — most resources placed within 5–10 business days", "Full replacement guarantee if a resource doesn't meet expectations", "Ongoing performance management support from SBS"], image: s1.url },
      { n: "02", icon: "Users", group: "Staff Augmentation", title: "Project-Based Resource Teams", tagline: "Assemble the right team for the right project — without permanent headcount.", body: "Some initiatives require a team of specialists rather than a single resource. SBS builds and deploys purpose-built teams for specific projects — from a scrum team for a software development initiative to a full delivery squad for an enterprise implementation.", bullets: ["Team design aligned to your project requirements", "Combined technical and functional expertise", "Integrated project management and quality assurance", "Flexible scaling as project phases change"], image: s2.url },
      { n: "03", icon: "Crown", group: "Staff Augmentation", title: "Interim & Executive IT Leadership", tagline: "Senior technology leadership — available immediately.", body: "Leadership gaps at the CTO, CISO, or IT Director level can be devastating to organizational momentum. SBS provides experienced, credible technology leaders who can step in at short notice, stabilize operations, drive strategy, and hold the function accountable until a permanent appointment is made.", bullets: ["Chief Information Officer (CIO)", "Chief Technology Officer (CTO)", "Chief Information Security Officer (CISO)", "IT Director / Head of IT", "Program Director / PMO Lead"], image: s3.url },
      { n: "04", icon: "Server", group: "Managed Services", title: "Managed IT Infrastructure", tagline: "Keep your infrastructure running — without the overhead.", body: "Your servers, networks, storage, and cloud environments need constant monitoring, maintenance, and management. SBS takes full ownership of your infrastructure operations, delivering proactive monitoring, rapid response, and guaranteed uptime — so your team is free to focus on strategic priorities.", bullets: ["24/7 proactive monitoring and alerting", "Patch management and system updates", "Performance optimization and capacity planning", "Incident management and root cause analysis", "Monthly operations reporting and service reviews", "Defined SLAs with uptime guarantees"], image: s4.url },
      { n: "05", icon: "ShieldCheck", group: "Managed Services", title: "Managed Security Services (MSSP)", tagline: "Enterprise-grade security operations — without building it in-house.", body: "Cybersecurity operations require constant vigilance, specialized skills, and significant investment. SBS delivers fully managed security services through our 24/7 Security Operations Center — giving you enterprise-class protection at a fraction of the cost of doing it yourself.", bullets: ["24/7 SOC monitoring and threat detection", "Security incident response and containment", "Vulnerability management and patching coordination", "Threat intelligence feeds and analysis", "Monthly security reports and executive briefings", "Compliance monitoring and alerting"], image: s5.url },
      { n: "06", icon: "Headphones", group: "Managed Services", title: "Managed Help Desk & End-User Support", tagline: "Responsive IT support — exactly when your users need it.", body: "User productivity depends on fast, reliable IT support. SBS manages your help desk function end-to-end — handling incidents, service requests, and escalations with defined SLAs, consistent quality, and full visibility into performance.", bullets: ["Multi-channel support: phone, email, chat, on-site", "Tiered support model (L1, L2, L3)", "Defined response and resolution SLAs", "Self-service knowledge base setup and management", "Monthly ticket analysis and trend reporting", "User satisfaction tracking and reporting"], image: s6.url },
      { n: "07", icon: "Cloud", group: "Managed Services", title: "Managed Cloud Services", tagline: "Get maximum value from your cloud investment.", body: "Cloud environments that aren't actively managed quickly become expensive, insecure, and inefficient. SBS manages your cloud operations on an ongoing basis — optimizing performance, controlling costs, ensuring security, and maintaining governance.", bullets: ["Cloud health monitoring and performance management", "Cost optimization and rightsizing", "Security posture management and compliance reporting", "Backup and disaster recovery management", "Platform updates and release management"], image: s7.url },
      { n: "08", icon: "AppWindow", group: "Managed Services", title: "Application Managed Services", tagline: "Keep your business-critical applications running at their best.", body: "Mission-critical applications require ongoing care — monitoring, patching, enhancements, and user support. SBS provides end-to-end application managed services that ensure your platforms perform reliably and continue to evolve alongside your business needs.", bullets: ["Application monitoring and availability management", "Bug fixes, patches, and routine updates", "Minor enhancements and configuration changes", "Vendor liaison and escalation management", "Monthly application health reports"], image: s8.url },
    ],
  },
  "Why SBS": {
    eyebrow: "The SBS Advantage",
    heading: "Talent, Technology, and",
    headingAccent: "Total Accountability.",
    items: [
      { icon: "Layers", title: "A Deep Bench of Certified Professionals", body: "SBS maintains a roster of 200+ technology professionals across 20+ disciplines. Every individual is technically vetted, reference-checked, and certified in their area of expertise. When we commit to a deployment, we deliver." },
      { icon: "Zap", title: "Speed of Deployment", body: "We understand that resource gaps create urgency. Our standard deployment time is 5–10 business days for individual resources — with the ability to mobilize faster for critical needs. You don't wait months for the right person." },
      { icon: "FileCheck", title: "SLA-Backed Managed Services", body: "Our managed services are governed by clear, contractual SLAs covering availability, response times, and resolution targets. We report against them every month — and we're accountable when we fall short." },
      { icon: "Handshake", title: "Single Point of Accountability", body: "Whether you're using staff augmentation, managed services, or both — you deal with one account team, one contract, and one escalation path. No finger-pointing between vendors. No gaps in ownership." },
      { icon: "Briefcase", title: "Flexible Engagement Models", body: "We offer time-and-materials, fixed-fee, and dedicated team models. Contracts can be structured monthly, quarterly, or annually — with the flexibility to scale up or down as your needs evolve." },
      { icon: "Sparkles", title: "Seamless Integration with Your Culture", body: "Our professionals don't just bring technical skills — they bring professionalism, communication skills, and a client-first mindset. They integrate with your team, respect your culture, and represent your organization well." },
    ],
  },
  Stats: {
    heading: "Trusted by Organizations That Can't Afford Downtime.",
    items: [
      { prefix: "", value: 200, decimals: 0, suffix: "+", label: "Professionals Deployed Across Client Organizations" },
      { prefix: "", value: 10, decimals: 0, suffix: " days", label: "Average Deployment Time (5–10 Business Days)" },
      { prefix: "", value: 99.5, decimals: 1, suffix: "%", label: "Managed Services Uptime SLA" },
      { prefix: "", value: 90, decimals: 0, suffix: "%+", label: "Staff Augmentation Retention Rate" },
      { prefix: "", value: 20, decimals: 0, suffix: "+", label: "Technology Disciplines Covered" },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    headingAccent: "Questions.",
    items: [
      { q: "How quickly can SBS deploy a resource?", a: "In most cases, we can deploy a pre-vetted professional within 5 to 10 business days. For urgent requirements, we have an accelerated process that can reduce this significantly." },
      { q: "What happens if a deployed resource isn't the right fit?", a: "We stand behind our placements with a replacement guarantee. If a resource doesn't meet your expectations within an agreed period, we will replace them at no additional cost." },
      { q: "Can we transition a staff augmentation resource to a permanent hire?", a: "Yes. Many of our clients convert augmented resources to permanent employees. We support this transition and can discuss commercial terms for conversion." },
      { q: "How are managed services SLAs measured and reported?", a: "We provide monthly service reports covering all SLA metrics — availability, response times, resolution times, and open incident aging. You always have full visibility into our performance." },
      { q: "Can we use both staff augmentation and managed services together?", a: "Absolutely. Many clients combine both models — for example, using managed services for infrastructure and helpdesk while augmenting their internal team with specialized project resources. SBS provides a unified account management model across both." },
      { q: "Do you provide resources for on-site, remote, or hybrid arrangements?", a: "All three. We tailor the working arrangement to your preferences and the nature of the role." },
    ],
  },
  "Final CTA": {
    headline: "Let's Build or Manage Your Technology",
    headlineAccent: "Capability — Starting Now.",
    body: "Whether you need one specialist, a full team, or a trusted partner to run your IT operations — SBS can deliver. Share your requirements and we'll respond with a tailored proposal within 48 hours.",
    ctaLabel: "Tell Us What You Need",
    ctaHref: "#form",
    ctaLabel2: "Book a Consultation",
    ctaHref2: "#form",
    footnote: "Fast response. No pressure. Tailored to your specific situation.",
    image: cta.url,
  },
};

export type StaffAugContent = {
  [K in StaffAugSectionKey]: typeof STAFF_AUG_DEFAULTS[K];
} & { _visible: Record<StaffAugSectionKey, boolean> };

const SLUG = "services-staff-aug";

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

export function useStaffAugContent(): StaffAugContent {
  return useSectionsContent(SLUG, STAFF_AUG_DEFAULTS) as StaffAugContent;
}

export function useStaffAugContentLegacy(): StaffAugContent {
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
  const merged: any = { _visible: {} as Record<StaffAugSectionKey, boolean> };
  for (const key of Object.keys(STAFF_AUG_DEFAULTS) as StaffAugSectionKey[]) {
    merged[key] = merge(STAFF_AUG_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as StaffAugContent;
}
