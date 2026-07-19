import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import rcmHeroVideo from "@/assets/rcm/rcm-hero.mp4.asset.json";
import hisVideo from "@/assets/rcm/his-video.mp4.asset.json";
import rcmProblem1 from "@/assets/rcm/problem-1.jpg";
import rcmProblem3 from "@/assets/rcm/problem-3.jpg";
import rcmProblem4 from "@/assets/rcm/problem-4.jpg";
import rcmProblem5 from "@/assets/rcm/problem-5.jpg";
import rcmProblem2Real from "@/assets/rcm/rcm-problem-2-real.png";
import rcmJourney1 from "@/assets/rcm/journey-1.jpg";
import rcmJourney2 from "@/assets/rcm/journey-2.jpg";
import rcmJourney3 from "@/assets/rcm/journey-3.jpg";
import rcmJourney4 from "@/assets/rcm/journey-4.jpg";
import rcmJourney5 from "@/assets/rcm/journey-5.jpg";
import rcmJourney6 from "@/assets/rcm/journey-6.jpg";

export type RcmSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const RCM_DEFAULTS = {
  Hero: {
    headline: "Close Every Gap Between Care Delivered",
    headlineAccent: "and Revenue Collected.",
    ctaLabel: "Recover Your Lost Revenue",
    ctaHref: "#contact",
    ctaLabel2: "Book a Revenue Cycle Assessment",
    ctaHref2: "#contact",
    chips: [
      "250+ Hospitals & Clinic Groups",
      "96% First-Pass Acceptance",
      "ZATCA Phase 2 Compliant",
      "NPHIES Integrated",
      "HL7 FHIR Ready",
      "Arabic & English",
    ] as string[],
    mediaUrl: rcmHeroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Introducing Secreta RCM",
    headline: "From Patient Registration",
    headlineAccent: "to Final Payment",
    body:
      "Healthcare organizations deliver extraordinary care every day and fail to collect full payment for a significant portion of it — not because of poor clinical quality, but because of claim errors, missed charges, delayed submissions, and denial management processes that cannot keep pace with payer complexity. Secreta Revenue Cycle Management closes every gap between the care your team delivers and the revenue your organization collects — with end-to-end automation, real-time visibility, and the analytical intelligence to turn your revenue cycle from a cost center into a competitive advantage.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Most Healthcare Organizations Are Leaving Revenue",
    headingAccent: "on the Table.",
    subheading:
      "Not because of poor clinical quality — but because of claim errors, missed charges, expired authorizations, and reactive denial management that can't keep pace with payer complexity.",
    items: [
      { title: "Rejected Claims", image: rcmProblem1, description: "Claims submitted with incorrect or missing diagnosis codes, procedure codes, or documentation — rejected by payers with no obligation to explain how to fix them." },
      { title: "Missed Charges", image: rcmProblem2Real, description: "Charges for procedures, medications, and bedside investigations never captured in billing because no one manually entered them and no automated capture exists." },
      { title: "Expired Authorizations", image: rcmProblem3, description: "Prior authorizations expire before the procedure is performed, claims are submitted without a valid auth, and the payer denies on a technicality that should never have arisen." },
      { title: "Reactive Denial Management", image: rcmProblem4, description: "Denials sit in a queue, get worked weeks later, some are resubmitted, many are written off because the appeal window has already closed." },
      { title: "Monthly-in-Arrears Reporting", image: rcmProblem5, description: "By the time leadership sees a revenue problem in the data, the causes are weeks old and the financial impact has already accumulated." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "End-to-End Revenue Cycle Automation",
    body: "Every function of the revenue cycle, connected and automated — from the front desk to the final dollar collected.",
    items: [
      { icon: "UserCheck", title: "Registration & Eligibility Verification", description: "Capture complete demographics and verify insurance eligibility in real time against the payer's active policy database. Lapsed coverage, exclusions, and pending authorizations are flagged at the front door — not weeks later when claims are denied." },
      { icon: "FileCheck2", title: "Prior Authorization Management", description: "Authorization requests are generated automatically from clinical orders. Status is visible to clinical and admin teams in real time. Expired authorizations trigger renewal alerts before service delivery. Claims are never submitted without a valid authorization." },
      { icon: "ClipboardList", title: "Automated Charge Capture", description: "Every billable event — procedures, medications, investigations, bed days — flows from the clinical record to billing without manual entry. Missed-charge detection identifies documentation that suggests a billable service was delivered but not captured." },
      { icon: "FileText", title: "Coding & Code Optimization", description: "ICD-10, CPT, and DRG coding with NLP-assisted code suggestions from clinical documentation. Coders work from a structured interface with codes, guidelines, and the clinical record side by side. Coding accuracy tracked by coder, department, and service line." },
      { icon: "ShieldCheck", title: "Pre-Submission Claim Validation", description: "Every claim passes through a validation engine checking for missing fields, invalid combinations, authorization mismatches, and known payer-specific denial triggers. Only clean claims reach the payer. First-pass acceptance rates improve immediately." },
      { icon: "Send", title: "Multi-Payer Electronic Submission", description: "Claims submitted electronically to insurance companies, government programs, self-pay, and corporate accounts through certified channels. NPHIES (KSA), DHA eClaims (Dubai), and DOH (Abu Dhabi) integrations included. Paper claims eliminated." },
      { icon: "AlertTriangle", title: "Denial Management & Appeals", description: "Denied claims are captured, categorized by reason, and routed automatically. Appeal letters are generated from configurable templates with clinical documentation and authorization evidence attached. Appeal deadlines are tracked and escalated before windows close." },
      { icon: "Banknote", title: "Remittance & Underpayment Recovery", description: "Electronic remittance is processed automatically — payments matched, adjustments categorized, contractual allowances applied. Actual payer payments are compared against contracted rates to flag systematic underpayments that would otherwise go undetected." },
      { icon: "CreditCard", title: "Patient Financial Services", description: "Patient liability is calculated at the point of service. Payment plans are offered and documented digitally. Automated statements and structured collections workflows balance revenue recovery with patient financial experience." },
      { icon: "BarChart3", title: "Real-Time Executive Dashboards", description: "Live dashboards for gross charges, net collections, days in A/R, denial rates by payer and reason, first-pass acceptance, and cash flow forecasts. Problems are identified and acted on the week they emerge — not the month after." },
      { icon: "Receipt", title: "Contract & Payer Performance", description: "Manage every payer contract — fee schedules, reimbursement rates, bundled payments, capitation. Performance analytics show what each payer is actually paying versus what was contracted, exposing underpayments and informing renegotiation." },
      { icon: "Wallet", title: "ZATCA & National Platform Compliance", description: "Native ZATCA Phase 2 e-invoicing for Saudi Arabia: every invoice formatted to Fatoora specifications, cryptographically stamped, and cleared in real time. NPHIES, DHA, and DOH submission pathways pre-configured." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "Revenue Cycle Management in 6 Steps",
    body: "From first contact to final payment — every step automated, tracked, and reconciled.",
    items: [
      { icon: "UserCheck", title: "Registration & Eligibility", image: rcmJourney1, description: "The patient registers. Insurance eligibility is verified in real time. Coverage, authorization requirements, and patient liability are confirmed before the first clinical interaction." },
      { icon: "FileCheck2", title: "Authorization", image: rcmJourney2, description: "Clinical orders requiring pre-authorization trigger automatic requests. Status is tracked through approval. Services are scheduled only when authorization is confirmed." },
      { icon: "Stethoscope", title: "Care Delivered & Charges Captured", image: rcmJourney3, description: "Every billable service — procedures, medications, investigations, bed days — is captured automatically from the clinical record. No manual charge entry. No missed charges." },
      { icon: "FileText", title: "Coding & Claim Generation", image: rcmJourney4, description: "Clinical documentation drives coding suggestions. Coders review, optimize, and finalize codes. Claims are generated automatically and pass through pre-submission validation." },
      { icon: "Send", title: "Submission & Tracking", image: rcmJourney5, description: "Claims submitted electronically to the correct payer through the correct channel. Status is tracked in real time. Approaching deadlines trigger automatic follow-up." },
      { icon: "Banknote", title: "Payment, Denials & Reconciliation", image: rcmJourney6, description: "Payments are matched to claims automatically. Underpayments are flagged. Denials are categorized and routed for appeal with documentation attached. The revenue cycle closes completely." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Revenue Cycle Performance Across Our Client Network",
    footnote:
      "9% average charge leakage identified and recovered in the first 90 days of automated charge capture deployment. 100% of underpayment variances above threshold flagged automatically for payer audit.",
    items: [
      { value: "96%", label: "Average first-pass claim acceptance rate vs. 75% GCC industry average" },
      { value: "34%", label: "Reduction in days in accounts receivable within the first six months" },
      { value: "78%", label: "Denial overturn rate on appeals with automated documentation and evidence" },
      { value: "14%", label: "Average increase in net collections per patient encounter" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Connected to Every Payer, System, and National Platform",
    subheading:
      "Secreta RCM connects with your clinical systems, national health platforms, payer portals, and financial management infrastructure — creating a revenue cycle that flows automatically from clinical activity to collected cash, without manual bridges between disconnected systems.",
    items: [
      { title: "NPHIES" },
      { title: "ZATCA Fatoora" },
      { title: "DHA eClaims" },
      { title: "DOH Abu Dhabi" },
      { title: "Qatar NHIX" },
      { title: "Bahrain NHRA" },
      { title: "Wasfaty" },
      { title: "Epic" },
      { title: "Cerner" },
      { title: "Meditech" },
      { title: "SAP" },
      { title: "Oracle Financials" },
      { title: "MS Dynamics" },
      { title: "HL7 v2 & FHIR R4" },
      { title: "ICD-10-AM" },
      { title: "CPT-4" },
      { title: "DRG GCC Grouper" },
      { title: "837/835 EDI" },
      { title: "REST API" },
    ] as Array<{ title: string }>,
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How quickly will we see improvement in claim acceptance rates after go-live?", a: "Most clients see measurable improvement in first-pass claim acceptance within the first two to three billing cycles after go-live — typically 4 to 8 weeks. The pre-submission validation engine begins catching errors immediately. Coding errors respond quickly to validation and NLP assistance; authorization-related denials improve as the tracking workflow becomes embedded in practice." },
      { q: "How does automated charge capture work with our existing clinical systems?", a: "Charge capture is driven by integration between the clinical record and billing. When a physician documents a procedure, a pharmacist dispenses a medication, or a lab validates a result, the associated charge is generated automatically and routed to billing. Integration with your HIS, EMR, pharmacy, and lab systems is established during implementation, and charge rules are configured by your teams." },
      { q: "Can the system handle multiple insurance companies with different formats and submission requirements?", a: "Yes. Secreta RCM maintains pre-configured submission profiles for all major GCC and international payers — including payer-specific claim formats, required documentation, code set requirements, and electronic submission pathways. The correct format and channel are applied automatically. New payers can be added as your contract portfolio evolves." },
      { q: "How does underpayment detection work?", a: "Each remittance line is compared against the contracted rate for that service, code, and payer. When actual payment is below the contracted rate by more than a configurable threshold, the variance is flagged automatically. Flagged underpayments are queued with the contract reference, claimed amount, paid amount, and variance presented together — ready for a formal dispute with system-generated documentation." },
      { q: "Does the system support ZATCA Phase 2 e-invoicing for Saudi Arabia?", a: "Yes. Every invoice is formatted to Fatoora specifications, cryptographically stamped, and submitted for real-time clearance through the ZATCA portal automatically. Cleared invoices are archived for the mandatory retention period. B2C simplified and B2B standard tax invoices are handled through separate compliant workflows. No manual intervention is required for compliance." },
      { q: "How long does RCM implementation take?", a: "Standalone RCM implementation — without replacing an existing HIS — typically takes 6 to 12 weeks depending on payer integrations, charge capture configuration, and contract data volume. For facilities deploying Secreta HIS alongside, RCM modules go live as part of the integrated HIS program. A dedicated revenue cycle specialist manages the entire process through go-live and first-cycle review." },
    ],
  },
  "Final CTA": {
    headline: "Every Claim You Lose Is Care You Delivered",
    headlineAccent: "and Were Not Paid For.",
    body:
      "Your clinical teams work too hard and your patients receive too much value for your revenue cycle to be the place where that value leaks away. That ends today.",
    primaryLabel: "Book Your Revenue Cycle Assessment",
    primaryHref: "#",
    secondaryLabel: "Start a 30-Day Pilot",
    secondaryHref: "#",
    footnote: "Revenue cycle baseline assessment included. Implementation and training support from day one.",
    mediaUrl: hisVideo.url,
    mediaKind: "video",
  },
} as const;

export type RcmContent = {
  [K in RcmSectionKey]: typeof RCM_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<RcmSectionKey, boolean> };

const RCM_PAGE_SLUG = "rcm";

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

export function useRcmContent(): RcmContent {
  return useSectionsContent(RCM_PAGE_SLUG, RCM_DEFAULTS) as RcmContent;
}

export function useRcmContentLegacy(): RcmContent {
  const { data } = useQuery({
    queryKey: ["page-sections", RCM_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", RCM_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<RcmSectionKey, boolean> };
  for (const key of Object.keys(RCM_DEFAULTS) as RcmSectionKey[]) {
    merged[key] = merge(RCM_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as RcmContent;
}
