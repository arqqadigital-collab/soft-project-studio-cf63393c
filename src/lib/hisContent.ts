import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

// Default assets — imported so the URLs stay valid across builds.
import problem1 from "@/assets/his/problem-1.jpg";
import problem2 from "@/assets/his/problem-2.jpg";
import problem3 from "@/assets/his/problem-3.jpg";
import problem4 from "@/assets/his/problem-4.jpg";
import problem5 from "@/assets/his/problem-5.jpg";
import problem6 from "@/assets/his/problem-6.jpg";
import hisHeroVideo from "@/assets/his-hero.mp4.asset.json";
import hisCtaVideo from "@/assets/his-cta.mp4.asset.json";
import registrationStep from "@/assets/his-journey/registration.png";
import outpatientConsultationStep from "@/assets/his-journey/outpatient-consultation.png";
import admissionStep from "@/assets/his-journey/admission.png";
import inpatientCareStep from "@/assets/his-journey/inpatient-care.png";
import dischargeStep from "@/assets/his-journey/discharge.png";
import billingSettlementStep from "@/assets/his-journey/billing-settlement.png";
import nphiesLogo from "@/assets/logos/nphies.png";
import malaffiLogo from "@/assets/logos/malaffi.png";
import riayatiLogo from "@/assets/logos/riayati.png";
import zatcaLogo from "@/assets/logos/zatca.png";
import emiratesIdLogo from "@/assets/logos/emirates-id.png";
import absherLogo from "@/assets/logos/absher.png";
import nhraLogo from "@/assets/logos/nhra.png";
import wasfatyLogo from "@/assets/logos/wasfaty.png";

// Section keys mirror the `data.section_name` values saved by the builder.
export type HISSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const HIS_DEFAULTS = {
  Hero: {
    headline: "Every Department. Every Patient.",
    headlineAccent: "Every Decision. One System.",
    ctaLabel: "See Secreta HIS in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book an Enterprise Demonstration",
    ctaHref2: "#contact",
    chips: [
      "300+ Hospitals",
      "HIMSS EMRAM Stage 6 Ready",
      "HL7 FHIR & DICOM Native",
      "HIPAA · GDPR · GCC Compliant",
      "Arabic & English",
      "Cloud & On-Premise",
    ],
    mediaUrl: hisHeroVideo.url,
  },
  Introduction: {
    eyebrow: "Introducing Secreta HIS",
    headline: "One Unified Platform for Modern Healthcare",
    headlineAccent: "Modern Healthcare",
    body:
      "A hospital generates thousands of clinical decisions, administrative transactions, and " +
      "operational events every single day. When the systems supporting those events are " +
      "disconnected — different platforms for pharmacy, laboratory, radiology, nursing, billing, " +
      "and management — information is delayed, duplicated, and lost. Secreta HIS is a fully " +
      "integrated, enterprise-grade Hospital Information System that connects every department, " +
      "every workflow, and every data point in your facility into one unified clinical and " +
      "operational platform. Built for the complexity of modern healthcare. Designed for the " +
      "humans who deliver it.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "A Disconnected Hospital Is a Dangerous Hospital.",
    headingAccent: "Dangerous Hospital.",
    items: [
      { title: "Disconnected Orders", description: "A physician orders a medication without seeing the laboratory result that arrived twenty minutes ago — because the lab system and the prescribing system are not integrated and no one thought to check.", image: problem1 },
      { title: "Lost in Transfer", description: "A patient is transferred from the ED to a general ward and their care team changes, their medication reconciliation is not completed, and their allergy history does not follow them because the systems do not talk to each other.", image: problem2 },
      { title: "Invisible Census", description: "A bed manager cannot give the CEO an accurate census at 9am because bed status lives on a whiteboard, in three nursing stations, and in two separate IT systems that each show different numbers.", image: problem3 },
      { title: "Billing Drift", description: "A patient is billed for a procedure that was cancelled and not billed for one that was added — because the clinical record and the billing system are updated manually and independently.", image: problem4 },
      { title: "Unreportable Data", description: "Clinical governance teams cannot produce meaningful quality reports because clinical data is stored in formats that cannot be queried, combined, or analyzed across departments.", image: problem5 },
      { title: "Tribal Knowledge", description: "New physicians joining the hospital spend weeks learning which system holds which information — because there is no single place where the complete patient story lives.", image: problem6 },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every Core Hospital Function. One Integrated Platform.",
    body:
      "From the moment a patient is registered to the moment their account is settled and their record is " +
      "archived — every department, every discipline and every data point connected in real time.",
    items: [
      { icon: "UserPlus", title: "Patient Registration & Master Patient Index", description: "Capture complete demographics, identity verification, insurance and consent at first registration. A Master Patient Index ensures every patient has one unique record across your facility — eliminating duplicates and merging fragmented histories. Biometric identity verification is available at registration and every subsequent point of care." },
      { icon: "CalendarCheck", title: "Outpatient & Appointment Management", description: "Manage the full outpatient cycle — booking, scheduling, waiting lists, check-in, consultation documentation and post-consultation workflow. No-show management, recall scheduling and referral tracking are integrated into the same workflow." },
      { icon: "BedDouble", title: "Inpatient Admission, Transfer & Discharge", description: "Manage every stage of the inpatient journey with real-time bed visibility across every ward. Discharge summaries are generated from structured clinical data — not written from scratch under time pressure." },
      { icon: "FileText", title: "Electronic Medical Records", description: "A complete longitudinal EMR — problem lists, diagnoses, medications, allergies, vital signs, clinical notes, results, imaging and correspondence — accessible to every authorized clinician. One source of truth. No paper backup." },
      { icon: "ClipboardList", title: "Physician Order Management & CPOE", description: "Physicians enter all orders electronically with clinical decision support running at the point of every order — drug interactions, allergy alerts, dose validation and duplicate detection. Orders route instantly to the receiving department." },
      { icon: "HeartPulse", title: "Nursing Clinical Documentation", description: "Structured assessments, care plans, vitals, fluid balance, wound and pain scoring, fall risk and pressure injury documentation — all electronic, all connected, all visible to the medical team in real time." },
      { icon: "Pill", title: "Pharmacy & Medication Management", description: "A closed-loop medication system — prescribing through pharmacy verification, dispensing and barcode-verified bedside administration. Every dose checked, every administration verified, every record current." },
      { icon: "FlaskConical", title: "Laboratory Information System", description: "Integrated lab workflows — sample registration, ordering, result entry, validation and delivery — fully connected to the clinical record. Critical values trigger automatic alerts. Result trends visible without leaving the chart." },
      { icon: "Scan", title: "Radiology Information System", description: "Integrated radiology order management, scheduling, DICOM image linking and structured reporting. PACS integration delivers images alongside reports without a separate system login." },
      { icon: "Stethoscope", title: "Operating Theatre & Surgical Management", description: "Surgical scheduling, pre-op assessment, operative and anesthesia records, implant tracking, recovery and post-op care — all in the HIS. Theatre utilization and outcomes reported automatically." },
      { icon: "Receipt", title: "Revenue Cycle & Billing Management", description: "Charges are captured automatically from clinical activity and flow into billing without manual entry. Pre-authorization, claims, adjudication, denials and patient payments — all managed within the HIS." },
      { icon: "BarChart3", title: "Clinical Analytics & Executive Reporting", description: "Real-time dashboards for census, occupancy, length of stay, readmissions, infections, surgical outcomes, revenue cycle and productivity — without manual data compilation." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "The Complete Patient Journey — Managed in One System",
    items: [
      { icon: "UserPlus", title: "Registration", image: registrationStep, description: "Patient registered with verified identity and complete demographics. A unique master record is created or retrieved. Duplicate detection prevents fragmented histories." },
      { icon: "CalendarCheck", title: "Outpatient Consultation", image: outpatientConsultationStep, description: "Appointment conducted with full clinical history visible. The physician documents, orders, prescribes and refers — all in one screen, all in one workflow." },
      { icon: "BedDouble", title: "Admission", image: admissionStep, description: "If admission is required, the patient moves from outpatient directly into inpatient workflow. Bed assignment, assessment, reconciliation and nursing documentation begin immediately." },
      { icon: "HeartPulse", title: "Inpatient Care", image: inpatientCareStep, description: "Every clinical event — rounds, assessments, investigations, procedures, medications, transfers — is documented in the unified record with continuous decision support." },
      { icon: "FileText", title: "Discharge", image: dischargeStep, description: "Discharge planning begins at admission. The summary is generated from structured data. Medications are reconciled and follow-up appointments booked through the patient portal." },
      { icon: "Receipt", title: "Billing & Settlement", image: billingSettlementStep, description: "All clinical activity is captured automatically. Bills are generated from the clinical record, claims submitted electronically and payment reconciled — closing the financial and clinical record together." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Enterprise Outcomes Measured Across Our HIS Client Network",
    items: [
      { value: "1.2 days", label: "Average reduction in length of stay within 12 months of full HIS go-live" },
      { value: "11%", label: "Average increase in net revenue per admission through automated charge capture" },
      { value: "35%", label: "Reduction in IT operational cost by replacing point solutions with unified HIS" },
      { value: "94%", label: "First-pass insurance claim acceptance with integrated revenue cycle management" },
      { value: "Zero", label: "Medication reconciliation failures reported across closed-loop medication clients" },
      { value: "100%", label: "Of HIS clients pursuing EMRAM Stage 6 achieved it within their target timeline" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    headline: "An Open Architecture That Connects Your Entire Healthcare Ecosystem",
    body:
      "Secreta HIS is built on open standards — not a proprietary integration model that locks you into a single " +
      "vendor ecosystem. Every external system that needs to connect, can.",
    sliderLabel: "National Platforms",
    items: [
      { name: "NPHIES", logo: nphiesLogo },
      { name: "Malaffi", logo: malaffiLogo },
      { name: "Riayati", logo: riayatiLogo },
      { name: "ZATCA Fatoora", logo: zatcaLogo },
      { name: "UAE Emirates ID", logo: emiratesIdLogo },
      { name: "Saudi Absher", logo: absherLogo },
      { name: "Bahrain NHRA", logo: nhraLogo },
      { name: "Wasfaty", logo: wasfatyLogo },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How long does a full HIS implementation take?", a: "A community hospital typically completes in 4 to 6 months. A large general hospital with full module deployment and multiple third-party integrations typically takes 9 to 18 months. A phased approach — going live with core modules first and adding clinical modules progressively — is recommended for large facilities." },
      { q: "Can Secreta HIS replace our existing systems module by module, or does it require a full replacement?", a: "Both approaches are supported. Some clients implement Secreta HIS as a full replacement in a phased go-live. Others implement specific modules — such as the EMR or revenue cycle — alongside existing systems, using integration interfaces, and migrate additional modules over time." },
      { q: "How is clinical data migrated from our existing systems?", a: "Data migration is managed by Secreta's dedicated team. Clinical data is extracted, transformed to Secreta's data model, validated for completeness and accuracy, and loaded into the new system before go-live. A detailed migration plan is produced before any data movement begins." },
      { q: "Does the system support both cloud and on-premise deployment?", a: "Yes. Secreta HIS is available as a cloud-hosted solution on regionally compliant infrastructure — including within-country hosting for KSA, UAE and Qatar — and as on-premise. Hybrid deployment is also supported." },
      { q: "How does the system handle multiple facilities within the same health group?", a: "Multi-site deployment is a core capability of the Health System tier. Each facility runs its own clinical environment with its own configuration, while group leadership accesses a consolidated view — unified patient records, group analytics and centralized governance reporting." },
      { q: "What clinical decision support is included in the HIS?", a: "Drug interaction checking, allergy cross-referencing, dose validation, duplicate detection, sepsis screening, early warning score automation, preventive care reminders, evidence-based order sets and condition-specific pathways. The CDS library is configurable by your clinical informatics team." },
      { q: "How does the system support nursing handover and shift communication?", a: "Structured handover tools are built in — allowing nurses to complete a standardized handover record for every patient, flagging active concerns, pending results and anticipated events. Handover completion is tracked and reported as part of the clinical documentation." },
      { q: "What training and support are provided after go-live?", a: "Every deployment includes a structured pre-go-live training program by role, on-site go-live support, and ongoing support through a dedicated team with SLA-defined response times. Updates, compliance releases and new features are included." },
    ],
  },
  "Final CTA": {
    headline: "Your Hospital Deserves a System That Matches Its Ambition.",
    headlineAccent: "Matches Its Ambition.",
    body:
      "Every patient deserves complete information at the point of care. Every clinician deserves a system that " +
      "supports their work instead of obstructing it. Every leader deserves accurate, real-time data.",
    body2:
      "A truly integrated Hospital Information System is not a technology investment. It is the foundation of every " +
      "clinical, operational and financial improvement your organization will make for the next decade.",
    primaryLabel: "Book Your Enterprise Demonstration",
    primaryHref: "#",
    secondaryLabel: "Request an Implementation Roadmap",
    secondaryHref: "#",
    footnote:
      "Structured implementation support. Data migration included. Pricing tailored to your scale and deployment model.",
    mediaUrl: hisCtaVideo.url,
  },
} as const;

export type HISContent = {
  [K in HISSectionKey]: typeof HIS_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<HISSectionKey, boolean> };

const HIS_PAGE_SLUG = "his";

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

/**
 * Fetches all page_sections for the HIS page and returns a fully-merged
 * content object keyed by section_name, with HIS_DEFAULTS as the fallback
 * for any field the builder hasn't populated. `_visible` reflects the
 * `is_visible` column so the page can hide sections that the dashboard
 * has toggled off.
 */
export function useHISContent(): HISContent {
  return useSectionsContent(HIS_PAGE_SLUG, HIS_DEFAULTS) as HISContent;
}

export function useHISContentLegacy(): HISContent {
  const { data } = useQuery({
    queryKey: ["page-sections", HIS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", HIS_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<HISSectionKey, boolean> };
  for (const key of Object.keys(HIS_DEFAULTS) as HISSectionKey[]) {
    merged[key] = merge(HIS_DEFAULTS[key] as any, overrides[key] ?? {});
    // Default to visible when the row isn't in the DB yet.
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as HISContent;
}

/**
 * Splits an edited headline into (lead, accent) so the accent gradient
 * matches the original design.
 * - If `full` ends with `accent`, split there (single-string convention).
 * - Else, treat `full` and `accent` as two separate pieces joined by a
 *   space (two-field convention used by the page builder).
 * - Empty `accent` → whole headline is the lead.
 */
export function splitAccent(full: string, accent: string): { lead: string; accent: string } {
  if (!full && !accent) return { lead: "", accent: "" };
  if (!accent) return { lead: full, accent: "" };
  if (!full) return { lead: "", accent };
  if (full === accent) return { lead: "", accent: full };
  if (full.endsWith(accent)) {
    return { lead: full.slice(0, full.length - accent.length).trimEnd() + " ", accent };
  }
  return { lead: full + " ", accent };
}

