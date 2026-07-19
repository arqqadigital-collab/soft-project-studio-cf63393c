import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import risProblem1 from "@/assets/ris/problem-1.jpg";
import risProblem2 from "@/assets/ris/problem-2.jpg";
import risProblem3 from "@/assets/ris/problem-3.jpg";
import risProblem4 from "@/assets/ris/problem-4.jpg";
import risProblem5 from "@/assets/ris/problem-5.jpg";
import risJourney1 from "@/assets/ris/journey-1.jpg";
import risJourney2 from "@/assets/ris/journey-2.jpg";
import risJourney3 from "@/assets/ris/journey-3.jpg";
import risJourney4 from "@/assets/ris/journey-4.jpg";
import risJourney5 from "@/assets/ris/journey-5.jpg";
import philipsLogo from "@/assets/ris/integrations/philips.png";
import iheLogo from "@/assets/ris/integrations/ihe.png";
import epicLogo from "@/assets/ris/integrations/epic.png";
import dicomLogo from "@/assets/ris/integrations/dicom.png";
import cernerLogo from "@/assets/ris/integrations/cerner.png";
import agfaLogo from "@/assets/ris/integrations/agfa.png";

export type RisSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const RIS_DEFAULTS = {
  Hero: {
    headline: "See More. Diagnose Faster.",
    headlineAccent: "Report Smarter.",
    ctaLabel: "Reimagine Your Radiology Workflow",
    ctaHref: "#contact",
    ctaLabel2: "Watch a Live Demo",
    ctaHref2: "#contact",
    chips: [
      "150+ Imaging Centers",
      "DICOM Compliant",
      "HL7 & PACS Ready",
      "HIPAA Certified",
      "IHE Radiology Profiles",
    ] as string[],
    mediaUrl: risJourney3,
    mediaKind: "image",
  },
  Introduction: {
    eyebrow: "Introducing Secreta RIS",
    headline: "From Order to Archive,",
    headlineAccent: "Every Step Connected",
    body:
      "A radiology workflow platform that connects your imaging department from order to archive. Designed to " +
      "reduce turnaround times, eliminate paperwork, and give radiologists the tools they need to deliver " +
      "confident, timely reads — every shift, every modality, every patient.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Is Your Radiology Department",
    headingAccent: "Held Back By This?",
    subheading: "Your imaging department moves fast. Your system should too.",
    items: [
      { title: "Unorganized Worklists", image: risProblem1, description: "Radiologists buried in unprioritized worklists with no triage logic — critical studies waiting behind routine ones." },
      { title: "No Referrer Portal", image: risProblem2, description: "Referring physicians calling for results because the portal doesn't exist or doesn't work — wasting everyone's time." },
      { title: "Unreported Criticals", image: risProblem3, description: "Critical findings sitting unreported because there's no escalation workflow or mandatory acknowledgment." },
      { title: "Manual Image Matching", image: risProblem4, description: "Hours lost each week manually matching images to orders and reports — and errors when they don't line up." },
      { title: "Paper Scheduling", image: risProblem5, description: "Paper-based scheduling causing double bookings, missed slots, and avoidable machine downtime." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "One Platform. Every Step of the Radiology Workflow.",
    body:
      "From the moment an imaging order is placed to the second the final report lands in the physician's " +
      "hands — Secreta RIS keeps everything connected, documented, and moving.",
    items: [
      { icon: "CalendarClock", title: "Order Management & Scheduling", description: "Receive imaging orders directly from your HIS or EMR. Schedule patients against modality availability, technologist assignments, and room capacity. Eliminate double bookings with real-time calendar logic and automated patient notifications." },
      { icon: "ScanLine", title: "DICOM Image Linking & Viewer", description: "Automatically link acquired images to their corresponding orders and patient records. Launch your PACS viewer directly from within the RIS with a single click — no hunting through separate systems." },
      { icon: "FileText", title: "Structured Reporting & Voice", description: "Give radiologists a faster way to report. Choose procedure-specific structured templates or dictate findings with integrated voice recognition. Reports are auto-populated and ready for sign-off in seconds." },
      { icon: "ListChecks", title: "Intelligent Worklist Prioritization", description: "Studies are automatically triaged by urgency, modality, patient age, and clinical indication. Critical and STAT studies surface to the top so nothing urgent is missed or delayed." },
      { icon: "UserCheck", title: "Referring Physician Portal", description: "Give referring doctors instant, secure access to final reports and linked images the moment they're signed. A clean, role-based portal accessible from any device — no phone calls, no faxes." },
      { icon: "BellRing", title: "Critical Finding Alerts", description: "When a radiologist identifies a critical finding, the system triggers an immediate notification to the ordering physician with a mandatory acknowledgment workflow — a defensible communication record." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "From Order to Archive in 5 Steps",
    body: "Every step connected, every study moving — from intake to delivery.",
    items: [
      { icon: "Inbox", title: "Order Received", image: risJourney1, description: "Imaging requests arrive from the EMR, HIS, or are entered directly. Patient demographics, clinical indication, and priority level are captured automatically." },
      { icon: "CalendarCheck", title: "Patient Scheduled", image: risJourney2, description: "The system matches the order to the right modality, time slot, and technologist. The patient receives a confirmation — no manual coordination required." },
      { icon: "ImagePlus", title: "Images Acquired & Linked", image: risJourney3, description: "After the scan, DICOM images are automatically associated with the order and patient record. The study appears instantly on the radiologist's worklist." },
      { icon: "Mic", title: "Report Dictated & Signed", image: risJourney4, description: "The radiologist opens the study, reviews images in the integrated viewer, dictates or types findings using structured templates, and signs the report digitally." },
      { icon: "Send", title: "Report Delivered", image: risJourney5, description: "The final report is immediately available to the referring physician via portal, HL7 message, or print. The complete study is archived with a full audit trail." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Outcomes That Speak for Themselves",
    footnote: "Zero missed critical findings with mandatory escalation and acknowledgment workflows.",
    items: [
      { value: "75%", label: "Reduction in average report turnaround time" },
      { value: "100%", label: "DICOM image-to-order matching rate with automated linking" },
      { value: "3×", label: "Faster report sign-off with structured templates and voice dictation" },
      { value: "50%", label: "Reduction in scheduling conflicts with real-time calendar integration" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Plugs Into Your Existing Ecosystem",
    subheading:
      "Secreta RIS connects with your PACS, HIS, and EMR without disrupting existing workflows. Pre-built " +
      "integrations with Epic, Cerner, Agfa, Philips IntelliSpace, and all major HL7-compatible platforms. Full " +
      "DICOM Worklist (DICOM MWL) support. Open REST API for custom connections.",
    groups: [
      {
        title: "Partners",
        items: [
          { name: "Philips", logo: philipsLogo },
          { name: "IHE International", logo: iheLogo },
          { name: "Epic", logo: epicLogo },
          { name: "DICOM", logo: dicomLogo },
          { name: "Cerner", logo: cernerLogo },
          { name: "AGFA", logo: agfaLogo },
        ],
      },
    ] as Array<{ title: string; items: Array<{ name: string; logo: string }> }>,
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Does this replace our PACS?", a: "No. Secreta RIS works alongside your existing PACS. It manages the workflow — orders, scheduling, worklists, and reporting — while your PACS handles image storage and viewing. The two systems talk seamlessly." },
      { q: "How does the voice dictation work?", a: "Voice recognition is embedded directly in the reporting screen. Radiologists speak their findings, which are transcribed in real time and mapped to the structured report template. No third-party software required." },
      { q: "Can we customize the report templates?", a: "Yes. Templates are fully customizable per modality, procedure type, and department. Your team can build and manage templates without any coding." },
      { q: "What happens if a critical finding is not acknowledged?", a: "The system escalates automatically. If the initial notification isn't acknowledged within your defined timeframe, a second alert is sent to a backup contact, and the event is logged in the audit trail." },
      { q: "How long does onboarding take?", a: "Most radiology departments are live within 2 to 6 weeks depending on the number of modalities, PACS connections, and custom workflow requirements." },
      { q: "Is patient data secure?", a: "All data is encrypted in transit and at rest. Role-based access controls ensure users only see what they're authorized to view. HIPAA compliant with local data residency options." },
    ],
  },
  "Final CTA": {
    headline: "Your Radiology Department",
    headlineAccent: "Deserves Better Tools.",
    body:
      "Stop losing time to manual worklists, disconnected systems, and delayed reports. Give your radiologists " +
      "and referring physicians the platform that keeps every study moving.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#",
    secondaryLabel: "Start a 30-Day Trial",
    secondaryHref: "#",
    footnote: "No setup fees. No contracts. Full support from day one.",
  },
} as const;

export type RisContent = {
  [K in RisSectionKey]: typeof RIS_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<RisSectionKey, boolean> };

const RIS_PAGE_SLUG = "ris";

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

export function useRisContent(): RisContent {
  return useSectionsContent(RIS_PAGE_SLUG, RIS_DEFAULTS) as RisContent;
}

export function useRisContentLegacy(): RisContent {
  const { data } = useQuery({
    queryKey: ["page-sections", RIS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", RIS_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<RisSectionKey, boolean> };
  for (const key of Object.keys(RIS_DEFAULTS) as RisSectionKey[]) {
    merged[key] = merge(RIS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as RisContent;
}
