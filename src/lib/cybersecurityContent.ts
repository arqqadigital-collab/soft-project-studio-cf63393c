import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import hero from "@/assets/cybersecurity/hero.jpg.asset.json";
import cta from "@/assets/cybersecurity/cta.jpg.asset.json";
import t1 from "@/assets/cybersecurity/threat1.jpg.asset.json";
import t2 from "@/assets/cybersecurity/threat2.jpg.asset.json";
import t3 from "@/assets/cybersecurity/threat3.jpg.asset.json";
import s1 from "@/assets/cybersecurity/s1.jpg.asset.json";
import s2 from "@/assets/cybersecurity/s2.jpg.asset.json";
import s3 from "@/assets/cybersecurity/s3.jpg.asset.json";
import s4 from "@/assets/cybersecurity/s4.jpg.asset.json";
import s5 from "@/assets/cybersecurity/s5.jpg.asset.json";
import s6 from "@/assets/cybersecurity/s6.jpg.asset.json";
import s7 from "@/assets/cybersecurity/s7.jpg.asset.json";

export type CybersecuritySectionKey =
  | "Hero"
  | "The Problem"
  | "Pillars"
  | "Services"
  | "Why SBS"
  | "Stats"
  | "FAQ"
  | "Final CTA";

export const CYBERSECURITY_DEFAULTS = {
  Hero: {
    eyebrow: "Cybersecurity Services",
    headline: "Defend Your Organization",
    headlineAccent: "Before the Threat Arrives.",
    body: "SBS delivers end-to-end cybersecurity solutions that protect your people, systems, and data — with a proactive, intelligence-driven approach designed for today's most dangerous threat landscape.",
    ctaLabel: "Get a Free Security Assessment",
    ctaHref: "#contact",
    ctaLabel2: "Speak to a Cybersecurity Expert",
    ctaHref2: "#contact",
    footnote: "No commitment required. Walk away with a clear picture of your security posture.",
    image: hero.url,
  },
  "The Problem": {
    eyebrow: "The Reality of Cyber Risk Today",
    heading: "The Threats Are Real.",
    headingAccent: "The Stakes Have Never Been Higher.",
    body: "Ransomware, phishing, insider threats, zero-day exploits, and supply chain vulnerabilities are no longer distant risks — they are daily realities. The question is not whether you will be targeted. It's whether you will be ready.",
    items: [
      { n: "01", title: "Ransomware & Zero-Day Exploits", body: "Financial losses averaging $4.4 million per incident — operations frozen, backups compromised, and negotiations you never wanted to have.", image: t1.url },
      { n: "02", title: "Phishing & Insider Threats", body: "Over 80% of breaches involve a human element. One click on a well-crafted email is enough to hand attackers the keys to your environment.", image: t2.url },
      { n: "03", title: "Supply Chain & Data Breaches", body: "Regulatory fines, legal consequences, and irreparable damage to customer trust — long after the incident itself has ended.", image: t3.url },
    ],
  },
  Pillars: {
    eyebrow: "How We Work",
    heading: "Comprehensive. Proactive.",
    headingAccent: "Tailored to Your Risk Profile.",
    body: "We reject the one-size-fits-all approach. Every environment, every threat, and every regulatory obligation is different — so our methodology is built around your context, on three core pillars.",
    items: [
      { n: "01", label: "ASSESS", icon: "Search", title: "Understand where you are exposed.", body: "Risk assessments, penetration testing, and compliance gap analysis to identify weak points and prioritize what needs to be addressed first." },
      { n: "02", label: "PROTECT", icon: "ShieldCheck", title: "Harden every potential entry point.", body: "Layered, defense-in-depth security architectures across your network, endpoints, cloud environments, identities, and applications." },
      { n: "03", label: "RESPOND", icon: "Radar", title: "Detect early. Contain fast.", body: "Continuous monitoring, real-time anomaly detection, and rapid response so your operations remain resilient — even when incidents occur." },
    ],
  },
  Services: {
    eyebrow: "What We Offer",
    heading: "Our Cybersecurity",
    headingAccent: "Services.",
    items: [
      { n: "01", icon: "Search", title: "Vulnerability Assessment & Penetration Testing", tagline: "Find your weaknesses before attackers do.", body: "Certified ethical hackers run rigorous simulated attacks across your infrastructure, web and mobile apps, and internal networks to uncover vulnerabilities that automated tools miss.", image: s1.url, bullets: ["Detailed technical findings with severity ratings", "Step-by-step remediation recommendations", "Executive summary for leadership and board reporting", "Re-testing after remediation to verify fixes"], ideal: "Annual compliance, pre-launch testing, post-incident validation, proactive risk management." },
      { n: "02", icon: "Radar", title: "Security Operations Center (SOC) as a Service", tagline: "24/7 eyes on your environment — without the overhead.", body: "Immediate access to a fully equipped, expert-staffed SOC that monitors your environment around the clock, detects threats early, and responds fast.", image: s2.url, bullets: ["Continuous monitoring of logs, endpoints, and network traffic", "Real-time threat detection and alerting", "Incident triage, investigation, and containment", "Monthly threat intelligence and security reporting"], ideal: "Organizations without internal SOC capacity, regulated industries, sensitive-data businesses." },
      { n: "03", icon: "Lock", title: "Identity & Access Management (IAM)", tagline: "Control access. Eliminate unnecessary risk.", body: "IAM frameworks that enforce the right level of access for every user, device, and application — closing off one of the leading causes of breaches.", image: s3.url, bullets: ["Single Sign-On (SSO) and Multi-Factor Authentication (MFA)", "Role-based access control (RBAC) design", "Privileged Access Management (PAM) solutions", "Identity governance and lifecycle management"], ideal: "Large workforces, cloud migrations, and high-compliance environments." },
      { n: "04", icon: "Cloud", title: "Cloud Security", tagline: "Secure your cloud — without slowing it down.", body: "End-to-end cloud security services across AWS, Microsoft Azure, and Google Cloud Platform, built for the attack surfaces traditional tools were never designed for.", image: s4.url, bullets: ["Cloud security architecture design and review", "Configuration hardening and CIS benchmark compliance", "Cloud-native threat detection and response", "Continuous posture management (CSPM)", "Data encryption and DLP implementation"], ideal: "Cloud migrations, hybrid environments, and cloud-native DevOps teams." },
      { n: "05", icon: "FileCheck2", title: "Compliance & Regulatory Advisory", tagline: "Meet your obligations. Avoid penalties. Build trust.", body: "Advisors who help you understand your obligations and build the controls, documentation, and processes to meet and sustain them.", image: s5.url, bullets: ["ISO/IEC 27001, NIST CSF, GDPR, PCI-DSS, HIPAA", "NCA Essential Cybersecurity Controls (ECC) & SAMA CSF", "Policy and procedure development", "Audit preparation and evidence collection support", "Ongoing compliance monitoring and advisory"], ideal: "Regulated organizations preparing for certification, audit, or cross-border compliance." },
      { n: "06", icon: "Users", title: "Security Awareness Training", tagline: "Your people are your most important security control.", body: "Customized programs that turn your workforce into an active line of defense — not a vulnerability.", image: s6.url, bullets: ["Role-based training modules for all staff levels", "Simulated phishing campaigns with real-time reporting", "Engaging, interactive content — not just slides", "Behavioral metrics and training effectiveness reports"], ideal: "Large non-technical workforces, remote teams, high-value data handlers." },
      { n: "07", icon: "Siren", title: "Incident Response & Digital Forensics", tagline: "When a breach happens, every second counts.", body: "Rapid incident response and forensic investigation to contain damage, understand what happened, and recover quickly — while preserving evidence for regulatory and legal purposes.", image: s7.url, bullets: ["24/7 incident response hotline and on-call team", "Rapid containment and eradication", "Root cause analysis and forensic investigation", "Post-incident reporting and lessons-learned review", "Legal and regulatory notification support"], ideal: "Every organization — because no one plans to be breached, but everyone should plan for it." },
    ],
  },
  "Why SBS": {
    eyebrow: "Why SBS",
    heading: "Why Leading Organizations Choose",
    headingAccent: "SBS for Cybersecurity.",
    items: [
      { icon: "Award", title: "Certified Expertise", body: "CISSP, CISM, CEH, CompTIA Security+, and cloud security credentials across AWS and Azure. Specialists, not generalists." },
      { icon: "Handshake", title: "Vendor-Agnostic Recommendations", body: "We are not tied to any vendor. Recommendations are based on what is right for your organization — honest advice you can trust." },
      { icon: "Building2", title: "Proven Across Industries", body: "Programs delivered across banking, healthcare, government, retail, and telecommunications. We understand your sector's risks and constraints." },
      { icon: "Workflow", title: "End-to-End Ownership", body: "From initial assessment through monitoring and incident response — one partner, one accountable team across the entire security lifecycle." },
      { icon: "BarChart3", title: "Business-Aligned Security", body: "We speak both security and business. Solutions that protect your organization without impeding productivity or user experience." },
    ],
  },
  Stats: {
    heading: "Numbers That Speak for Themselves.",
    items: [
      { prefix: "", value: 500, decimals: 0, suffix: "+", label: "Security Assessments Conducted" },
      { prefix: "", value: 99.9, decimals: 1, suffix: "%", label: "SOC Uptime SLA" },
      { prefix: "<", value: 30, decimals: 0, suffix: " Min", label: "Avg. Incident Response Initiation" },
      { prefix: "", value: 15, decimals: 0, suffix: "+", label: "Compliance Frameworks Supported" },
      { prefix: "", value: 100, decimals: 0, suffix: "+", label: "Certified Security Professionals" },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Frequently Asked",
    headingAccent: "Questions.",
    items: [
      { q: "How do we get started with SBS cybersecurity services?", a: "It starts with a free, no-obligation security assessment. Our team will evaluate your current environment and provide a clear picture of your risk exposure and recommended next steps — at no cost." },
      { q: "Do you work with organizations that already have an internal IT team?", a: "Absolutely. We frequently work alongside existing IT and security teams as an extension of their capabilities — providing specialized expertise, additional capacity, or specific services they don't have in-house." },
      { q: "How long does a penetration test typically take?", a: "Depending on scope, most penetration tests take between 1 and 3 weeks, followed by a detailed report and a debrief session with your team." },
      { q: "Can you help us achieve ISO 27001 or NCA compliance?", a: "Yes. We have extensive experience guiding organizations through compliance programs from gap assessment through audit readiness and certification." },
      { q: "Do you offer ongoing security services or only project-based work?", a: "Both. We offer project-based engagements as well as ongoing retainer and managed security services — including our 24/7 SOC offering." },
    ],
  },
  "Final CTA": {
    headline: "Start with a Free",
    headlineAccent: "Cybersecurity Assessment.",
    body: "You can't protect what you don't understand. Let SBS give you a clear, honest view of your security posture — with no obligation and no cost. Our experts will identify your top risks and give you a concrete starting point.",
    ctaLabel: "Book My Free Assessment",
    ctaHref: "#form",
    ctaLabel2: "Contact Our Security Team",
    ctaHref2: "#form",
    footnote: "No sales pressure. No jargon. Just clarity.",
    image: cta.url,
  },
};

export type CybersecurityContent = {
  [K in CybersecuritySectionKey]: typeof CYBERSECURITY_DEFAULTS[K];
} & { _visible: Record<CybersecuritySectionKey, boolean> };

const SLUG = "services-cybersecurity";

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

export function useCybersecurityContent(): CybersecurityContent {
  return useSectionsContent(SLUG, CYBERSECURITY_DEFAULTS) as CybersecurityContent;
}

export function useCybersecurityContentLegacy(): CybersecurityContent {
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
  const merged: any = { _visible: {} as Record<CybersecuritySectionKey, boolean> };
  for (const key of Object.keys(CYBERSECURITY_DEFAULTS) as CybersecuritySectionKey[]) {
    merged[key] = merge(CYBERSECURITY_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as CybersecurityContent;
}
