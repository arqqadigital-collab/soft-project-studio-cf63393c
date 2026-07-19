import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/blood-bank/hero-video.mp4";
import ctaVideo from "@/assets/blood-bank/cta-video.mp4.asset.json";
import problemMislabeled from "@/assets/blood-bank/problems/mislabeled.jpg";
import problemExpired from "@/assets/blood-bank/problems/expired.jpg";
import problemPaper from "@/assets/blood-bank/problems/paper.jpg";
import problemReaction from "@/assets/blood-bank/problems/reaction.jpg";
import problemAudit from "@/assets/blood-bank/problems/audit.jpg";
import journeyDonor from "@/assets/blood-bank/journey/donor-arrives-new.jpg";
import journeyCollection from "@/assets/blood-bank/journey/collection.jpg";
import journeyTesting from "@/assets/blood-bank/journey/testing.jpg";
import journeyCrossmatch from "@/assets/blood-bank/journey/crossmatch.jpg";
import journeyTransfusion from "@/assets/blood-bank/journey/transfusion.jpg";
import aabbLogo from "@/assets/bloodbank/integrations/aabb.png";
import fdaLogo from "@/assets/bloodbank/integrations/fda.png";
import iccbbaLogo from "@/assets/bloodbank/integrations/iccbba.png";
import iso15189Logo from "@/assets/bloodbank/integrations/iso15189.png";

export type BloodBankSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const BLOOD_BANK_DEFAULTS = {
  Hero: {
    headline: "Every Unit Matters.",
    headlineAccent: "Every Donor Counts.",
    ctaLabel: "Secure Your Blood Supply Chain",
    ctaHref: "#contact",
    ctaLabel2: "See It in Action",
    ctaHref2: "#contact",
    chips: [
      "Trusted across 25 countries",
      "FDA 21 CFR Part 11 Compliant",
      "AABB & ISO 15189 Ready",
      "Full Hemovigilance Support",
      "ISBT 128 Labeling",
      "HL7 & FHIR",
    ],
    mediaUrl: heroVideo,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Built for Blood Banking",
    headline: "A Dedicated System for the",
    headlineAccent: "Full Lifecycle of Blood.",
    body:
      "A dedicated system for managing the full lifecycle of blood collection, processing, testing, and " +
      "transfusion. Built with safety-first logic to protect patients and streamline blood bank operations under " +
      "the highest regulatory standards — because in blood banking, there is no margin for error.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "These Are Not Hypothetical Risks.",
    headingAccent: "They Happen Every Day.",
    subheading:
      "In blood banks running on outdated or disconnected systems, small failures compound into patient safety incidents and compliance crises.",
    items: [
      { title: "Mislabeled Units", image: problemMislabeled, description: "A mislabeled unit reaching the wrong patient — a single clerical error with life-threatening consequences and no easy path to recovery." },
      { title: "Expired Components", image: problemExpired, description: "Expired components missed because inventory tracking was manual, wasting precious donations and exposing patients to risk." },
      { title: "Paper-Based Donor History", image: problemPaper, description: "A donor turned away — or worse, cleared in error — because eligibility history was stored on paper and never reconciled." },
      { title: "Unstructured Reaction Reporting", image: problemReaction, description: "A transfusion reaction with no structured reporting pathway, no investigation workflow, and no data trail for hemovigilance." },
      { title: "Audit Gaps", image: problemAudit, description: "A regulatory audit revealing gaps in chain-of-custody documentation — exactly the gaps that erode trust and put licensure at risk." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Complete Control Over Every Stage of the Blood Supply Chain",
    body:
      "From donor walk-in to documented transfusion — every action tracked, validated, and recorded with the precision that patient safety demands.",
    items: [
      { icon: "UserCheck", title: "Donor Registration & Eligibility Screening", description: "Build comprehensive donor profiles with full medical history, travel records, medication flags, and deferral tracking. Automated eligibility checks against configurable screening criteria ensure no ineligible donor proceeds to collection. Permanent and temporary deferrals are logged and enforced system-wide." },
      { icon: "Droplets", title: "Collection & Component Processing", description: "Record whole blood and apheresis collections with full lot traceability. Document component preparation — packed red cells, platelets, fresh frozen plasma, cryoprecipitate — with processing timestamps, technologist assignments, and quality checks at every step." },
      { icon: "FlaskConical", title: "Blood Group Serology & Testing", description: "Manage ABO and Rh typing, antibody screening, and infectious disease testing workflows. Link laboratory results directly to unit records. Units with pending or failed test results are automatically quarantined and blocked from issue." },
      { icon: "TestTube2", title: "Crossmatch & Compatibility Testing", description: "Run electronic or serological crossmatch workflows with built-in compatibility logic. The system flags incompatible pairings before issue, providing an additional patient safety checkpoint that never sleeps." },
      { icon: "Boxes", title: "Inventory Management & Expiry Alerts", description: "Maintain real-time visibility of every unit across all storage locations — refrigerators, freezers, and satellite stores. Automated expiry alerts surface aging inventory days in advance, giving your team time to act before wastage occurs. FIFO issue logic is enforced by default." },
      { icon: "Activity", title: "Transfusion Reaction Reporting & Hemovigilance", description: "When a transfusion reaction occurs, clinicians can log it directly in the system. The blood bank receives an immediate notification, triggering a structured investigation workflow. All reaction data feeds into your hemovigilance reporting module for regulatory submission and trend analysis." },
      { icon: "Tag", title: "Regulatory-Compliant Labeling & Chain of Custody", description: "Every unit carries a compliant ISBT 128 label. Every movement — from collection through processing, storage, issue, and transfusion — is logged with user, timestamp, and location. Your audit trail is always complete, always current." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Complete Blood Journey — Managed in One System",
    body: "",
    items: [
      { icon: "UserCheck", title: "Donor Arrives", image: journeyDonor, description: "The system retrieves the donor's full history, runs automated eligibility checks, and either clears them for collection or flags the appropriate deferral reason — all before a needle is placed." },
      { icon: "Droplets", title: "Unit Collected & Processed", image: journeyCollection, description: "Collection details are recorded in real time. Components are processed and entered into inventory with full traceability. Testing requests are sent automatically to the laboratory." },
      { icon: "FlaskConical", title: "Testing & Quarantine", image: journeyTesting, description: "Units remain in quarantine until all required test results are received and validated. Reactive or incomplete results trigger automatic holds that cannot be overridden without authorization." },
      { icon: "TestTube2", title: "Crossmatch & Issue", image: journeyCrossmatch, description: "A transfusion request arrives from the ward. The system performs compatibility checks, confirms crossmatch results, and issues the unit with a complete handover record." },
      { icon: "HeartPulse", title: "Transfusion & Follow-up", image: journeyTransfusion, description: "Transfusion is documented at the bedside. Any adverse events are reported through the integrated hemovigilance pathway. The complete unit lifecycle is archived for audit and regulatory review." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Safety and Efficiency You Can Measure",
    items: [
      { value: "34%", label: "Average reduction in blood component wastage" },
      { value: "100%", label: "Chain-of-custody documentation on every unit issued" },
      { value: "60%", label: "Faster regulatory audit preparation with automated compliance reports" },
      { value: "99.9%", label: "Unit traceability from collection to transfusion" },
    ],
    footnote:
      "Zero compatibility errors reported post-implementation across client sites. 28% increase in donor return rates through automated recall and engagement tools.",
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connected Across Your Entire Hospital Ecosystem",
    body:
      "Secreta Blood Bank integrates directly with your HIS, LIS, and EMR to eliminate duplicate data entry and ensure real-time information flow between departments. Transfusion requests arrive automatically from clinical systems. Test results flow in from the laboratory without manual transcription.",
    items: [
      { name: "AABB Accredited", logo: aabbLogo },
      { name: "FDA 21 CFR Part 11 Compliance", logo: fdaLogo },
      { name: "ICCBBA ISBT 128", logo: iccbbaLogo },
      { name: "ISO 15189 Accreditation", logo: iso15189Logo },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How does the system prevent incompatible blood from being issued?", a: "Compatibility logic is embedded in the issue workflow. Before any unit can be issued for transfusion, the system validates ABO and Rh compatibility and confirms crossmatch results. An incompatible pairing cannot proceed without a documented clinical override from an authorized user." },
      { q: "Can the system handle both whole blood and apheresis collections?", a: "Yes. Both collection types are fully supported with separate workflow paths, component processing steps, and labeling requirements." },
      { q: "What happens if a unit fails infectious disease testing?", a: "The unit is automatically placed under a system-enforced quarantine. It cannot be issued or moved to available inventory until the hold is reviewed and resolved by an authorized staff member. A complete record of the event is logged." },
      { q: "Does the system support lookback and recall procedures?", a: "Yes. If a donor is later found to be reactive on a previous or subsequent donation, the system can trace all prior donations from that donor and initiate a structured lookback notification workflow." },
      { q: "How does hemovigilance reporting work?", a: "Adverse transfusion events are logged directly by clinical staff. The blood bank is notified immediately. The system guides investigators through a structured root cause analysis and formats the completed report for submission to national or regional hemovigilance authorities." },
      { q: "Is the system compliant with international blood banking standards?", a: "Yes. Secreta Blood Bank is designed to support compliance with AABB standards, EU Blood Directive requirements, FDA 21 CFR Part 11, and ISO 15189. Specific compliance configurations are available by region." },
      { q: "How long does implementation take?", a: "Most blood banks complete full implementation in 3 to 6 weeks. Complex multi-site deployments with multiple HIS integrations may require additional time. A dedicated implementation specialist is assigned to every account." },
    ],
  },
  "Final CTA": {
    headline: "Patient Safety Begins",
    headlineAccent: "Before the Transfusion Starts.",
    body:
      "Every unit your blood bank issues carries the weight of a patient's life. Give your team the system that matches that responsibility — with the traceability, safety logic, and compliance tools that leave nothing to chance.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#contact",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#contact",
    footnote: "No setup fees. No long-term contracts. Dedicated support from day one.",
    mediaUrl: ctaVideo.url,
    mediaKind: "video",
  },
} as const;

export type BloodBankContent = {
  [K in BloodBankSectionKey]: typeof BLOOD_BANK_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<BloodBankSectionKey, boolean> };

const BLOOD_BANK_PAGE_SLUG = "blood-bank-and-donor-management";

function merge<T>(base: T, over: any): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    // Merge object arrays element-by-element so DB text edits layer over
    // code-side defaults (images, icons). Primitive arrays: override.
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

export function useBloodBankContent(): BloodBankContent {
  return useSectionsContent(BLOOD_BANK_PAGE_SLUG, BLOOD_BANK_DEFAULTS) as BloodBankContent;
}

export function useBloodBankContentLegacy(): BloodBankContent {
  const { data } = useQuery({
    queryKey: ["page-sections", BLOOD_BANK_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", BLOOD_BANK_PAGE_SLUG)
        .maybeSingle();
      if (pageErr) throw pageErr;
      if (!page?.id) return { byName: {}, visibleByName: {} } as {
        byName: Record<string, any>;
        visibleByName: Record<string, boolean>;
      };
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
  const merged: any = { _visible: {} as Record<BloodBankSectionKey, boolean> };
  for (const key of Object.keys(BLOOD_BANK_DEFAULTS) as BloodBankSectionKey[]) {
    merged[key] = merge(BLOOD_BANK_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as BloodBankContent;
}
