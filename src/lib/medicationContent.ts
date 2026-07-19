import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/medication/hero-video.mp4.asset.json";
import ctaVideo from "@/assets/medication/cta-video.mp4.asset.json";
import problemAllergy from "@/assets/medication/problems/allergy.jpg";
import problemPaper from "@/assets/medication/problems/paper-mar.jpg";
import problemInteraction from "@/assets/medication/problems/interaction.jpg";
import problemControlled from "@/assets/medication/problems/controlled.jpg";
import problemPediatric from "@/assets/medication/problems/pediatric-dose.jpg";
import journeyPrescribe from "@/assets/medication/journey/prescribe.jpg";
import journeyVerify from "@/assets/medication/journey/verify.jpg";
import journeyDispense from "@/assets/medication/journey/dispense.jpg";
import journeyAdminister from "@/assets/medication/journey/administer.jpg";
import journeyDocument from "@/assets/medication/journey/document.jpg";

export type MedSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const MEDICATION_DEFAULTS = {
  Hero: {
    headline: "Every Dose Precise.",
    headlineAccent: "Every Patient Protected.",
    ctaLabel: "Eliminate Medication Errors Today",
    ctaHref: "#contact",
    ctaLabel2: "See How It Works",
    ctaHref2: "#contact",
    chips: [
      "Deployed across 300+ hospitals",
      "HIPAA & GDPR Compliant",
      "Joint Commission Ready",
      "Supports CPOE & eMAR Standards",
      "HL7 v2 & FHIR",
      "GS1 Barcodes",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Built for Medication Management",
    headline: "A Closed-Loop System for the",
    headlineAccent: "Full Medication Lifecycle.",
    body:
      "Eliminate medication errors and streamline pharmaceutical workflows across every ward and department. Our system gives clinicians, pharmacists, and nurses a unified platform to prescribe, verify, dispense, and administer with confidence — closing the gaps where errors happen, and patients get hurt.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Medication Errors Are the Most Preventable Patient Safety Crisis in Healthcare.",
    headingAccent: "They Happen Every Day.",
    subheading: "",
    items: [
      { title: "Prescribing Without Allergy Awareness", image: problemAllergy, description: "A physician prescribes a drug without knowing the patient is allergic. Cross-reactive drug families are missed, and the patient is exposed to a preventable adverse reaction." },
      { title: "Outdated Paper MARs", image: problemPaper, description: "A nurse administers the wrong dose because the paper MAR was updated after she printed it. What she holds in her hand is already out of date — and the patient pays the price." },
      { title: "Missed Drug Interactions", image: problemInteraction, description: "A pharmacist misses a dangerous interaction because two prescribers are using separate systems. The warning never fires, and a harmful combination reaches the patient." },
      { title: "Unaccounted Controlled Substances", image: problemControlled, description: "A controlled substance goes unaccounted for because reconciliation is done manually at end of shift. Paper logs are incomplete, and diversion goes undetected." },
      { title: "Weight-Based Dosing Errors", image: problemPediatric, description: "A child receives an adult dose because weight-based calculation was done on a pocket calculator. A decimal place error, a unit conversion mistake — both can be fatal in pediatric care." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "A Closed-Loop Medication System That Protects Patients at Every Step",
    body:
      "From the prescriber's screen to the patient's bedside, every handoff in the medication process is validated, documented, and traceable. No gaps. No guesswork. No exceptions.",
    items: [
      { icon: "Stethoscope", title: "Electronic Prescribing with Clinical Decision Support", description: "Physicians prescribe digitally with real-time clinical decision support running in the background. Drug-drug interaction checks, allergy cross-referencing, duplicate therapy alerts, and contraindication warnings fire at the point of prescribing — before the order is placed, not after. Alerts are tiered by severity so clinicians see what matters without alert fatigue." },
      { icon: "Pill", title: "Weight- and Age-Based Dosage Calculation Engine", description: "For pediatric, neonatal, and renally impaired patients, dosing errors are most dangerous and most common. Our built-in calculation engine pulls the patient's current weight, age, and renal function from the clinical record and computes the correct dose range automatically. Prescribers see the recommended dose alongside safe minimum and maximum thresholds — every time." },
      { icon: "ClipboardCheck", title: "Pharmacy Order Verification & Dispensing Queues", description: "Every electronic prescription lands directly in the pharmacy queue. Pharmacists review, clinically verify, and approve orders from a single organized screen — with patient history, current medication list, and interaction summaries always visible. Dispensing labels are generated automatically. Priority and urgent orders are surfaced to the top of the queue." },
      { icon: "ScanLine", title: "Medication Administration Records with Barcode Scanning", description: "Nurses access a live, always-current eMAR at the bedside. Before administering any medication, they scan the patient wristband and the medication barcode. The system confirms the five rights — right patient, right drug, right dose, right route, right time — and flags any mismatch before administration occurs. Every administration is timestamped and logged automatically." },
      { icon: "Lock", title: "Controlled Substance Tracking & Reconciliation", description: "Track every controlled substance from receipt to administration to waste. Tamper-evident digital logs record who accessed what, when, and how much was used or discarded. End-of-shift reconciliation is guided by the system, with discrepancy alerts escalating automatically to pharmacy supervisors. Diversion detection logic flags statistical anomalies for review." },
      { icon: "Boxes", title: "Real-Time Pharmacy Inventory & Stock Visibility", description: "Pharmacists and ward managers see live stock levels across every dispensing location — central pharmacy, satellite pharmacies, automated dispensing cabinets, and ward stocks. Low-stock alerts trigger reorder workflows before shortages occur. Expiry tracking prevents expired medications from reaching patients." },
      { icon: "RefreshCcw", title: "Medication Reconciliation at Care Transitions", description: "When a patient is admitted, transferred, or discharged, the system generates a complete reconciliation view — comparing home medications, inpatient orders, and discharge prescriptions side by side. Clinicians can identify, resolve, and document discrepancies in a structured workflow that reduces post-discharge adverse drug events." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "Closed-Loop Medication Management in 5 Steps",
    body: "",
    items: [
      { icon: "FileText", title: "Prescribe", image: journeyPrescribe, description: "The physician opens the patient record and enters a medication order. Clinical decision support checks for allergies, interactions, and dose appropriateness in real time. The order is placed only when it is safe to proceed." },
      { icon: "ClipboardCheck", title: "Verify", image: journeyVerify, description: "The prescription arrives instantly in the pharmacy queue. The pharmacist reviews the order in clinical context, approves it, and prepares the medication. Dispensing labels are printed automatically with all required identifiers." },
      { icon: "Boxes", title: "Dispense", image: journeyDispense, description: "The medication is dispensed from the correct location — central pharmacy, automated cabinet, or ward stock — with every movement logged against the patient order. Controlled substances require dual verification." },
      { icon: "Syringe", title: "Administer", image: journeyAdminister, description: "The nurse scans the patient wristband and the medication barcode at the bedside. The system confirms a match against the live eMAR and gives a green light for administration. Any mismatch stops the process and triggers an alert." },
      { icon: "FileCheck", title: "Document & Review", image: journeyDocument, description: "Administration is recorded automatically. Missed doses, refusals, and partial doses are flagged for clinical review. Pharmacists and physicians see the complete medication administration history in real time." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Safety Outcomes Measured Across Our Client Network",
    items: [
      { value: "87%", label: "Reduction in medication administration errors after eMAR and barcode scanning go-live" },
      { value: "100%", label: "Of controlled substance transactions logged with full audit trail" },
      { value: "92%", label: "Of drug interaction alerts resolved at the prescribing stage — before the order is placed" },
      { value: "40%", label: "Reduction in time spent on end-of-shift controlled substance reconciliation" },
      { value: "3×", label: "Faster pharmacy order processing with digital queues and automated label generation" },
      { value: "0", label: "Missed allergy alerts reported across all client sites post-implementation" },
    ],
    footnote:
      "Zero missed allergy alerts reported across all client sites post-implementation. 3× faster pharmacy order turnaround with digital queues.",
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "One Platform That Connects Your Entire Medication Ecosystem",
    body:
      "Secreta Medication Management integrates with your EMR, HIS, laboratory systems, and automated dispensing cabinets to create a seamless closed-loop environment. Lab results flow in to support real-time dose adjustment. Pharmacy data syncs with clinical records automatically.",
    tags: [
      "Epic","Cerner","Meditech","Omnicell","Pyxis","BD Rowa","Kirby Lester",
      "HL7 v2 & FHIR","NCPDP SCRIPT","GS1 Barcodes","REST API","CPOE & eMAR Standards",
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How does the system handle drug allergy checking?", a: "Allergy information is pulled directly from the patient's clinical record. When a prescriber selects a medication, the system cross-references it against the full allergy list — including cross-reactive drug families — and displays a graded alert if any match is found. The prescriber must document a clinical justification to proceed past a high-severity alert." },
      { q: "Can clinical decision support rules be customized?", a: "Yes. Your pharmacy and clinical informatics team can configure interaction thresholds, alert severity tiers, custom dosing protocols, and formulary restrictions. Customization does not require vendor involvement after initial setup." },
      { q: "Does the system work with automated dispensing cabinets?", a: "Yes. Secreta integrates with leading ADC systems including Omnicell and Pyxis. Dispensing cabinet transactions sync automatically with the patient medication record and pharmacy inventory in real time." },
      { q: "How does the pediatric dosing engine get patient weight?", a: "Weight is pulled automatically from the patient's clinical record at the time of prescribing. If no current weight is recorded, the system prompts the prescriber to enter or confirm one before the dose calculation is displayed. Manual override is available with mandatory documentation." },
      { q: "What happens if a nurse scans a wrong medication at the bedside?", a: "The barcode scan triggers an immediate mismatch alert on the eMAR screen. The administration is blocked and the nurse is shown what the correct medication should be. The event is logged automatically for pharmacy and clinical review." },
      { q: "How is controlled substance diversion detected?", a: "The system tracks statistical patterns in controlled substance access and waste across users, shifts, and locations. When a user's behavior deviates significantly from peer benchmarks — for example, consistently higher waste rates or access outside normal patterns — a confidential alert is generated for the pharmacy director." },
      { q: "How long does implementation take?", a: "Most hospitals complete full implementation in 4 to 8 weeks. Complex multi-site deployments with multiple HIS integrations may require additional time. A dedicated implementation specialist is assigned to every account, and training is delivered on-site and virtually." },
    ],
  },
  "Final CTA": {
    headline: "Patient Safety Begins",
    headlineAccent: "Before the First Dose Is Given.",
    body:
      "Every medication your team administers carries the weight of a patient's trust. Give your clinicians, pharmacists, and nurses the system that matches that responsibility — with the decision support, barcode verification, and audit trails that leave nothing to chance.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#contact",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#contact",
    footnote: "No setup fees. No long-term contracts. Dedicated support from day one.",
    mediaUrl: ctaVideo.url,
    mediaKind: "video",
  },
} as const;

export type MedContent = {
  [K in MedSectionKey]: typeof MEDICATION_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<MedSectionKey, boolean> };

const MED_SLUG = "healthcare-medication-dosage";

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
    for (const k of Object.keys(over)) out[k] = merge((base as any)[k], (over as any)[k]);
    return out;
  }
  return (over ?? base) as T;
}

export function useMedicationContent(): MedContent {
  return useSectionsContent(MED_SLUG, MEDICATION_DEFAULTS) as MedContent;
}

export function useMedicationContentLegacy(): MedContent {
  const { data } = useQuery({
    queryKey: ["page-sections", MED_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages").select("id").eq("slug", MED_SLUG).maybeSingle();
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
  const merged: any = { _visible: {} as Record<MedSectionKey, boolean> };
  for (const key of Object.keys(MEDICATION_DEFAULTS) as MedSectionKey[]) {
    merged[key] = merge(MEDICATION_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as MedContent;
}
