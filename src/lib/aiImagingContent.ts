import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/ai-imaging/hero-video.mp4.asset.json";
import journeyAcquire from "@/assets/ai-imaging/journey/acquire.jpg.asset.json";
import journeyAnalyze from "@/assets/ai-imaging/journey/analyze.jpg.asset.json";
import journeyPrioritize from "@/assets/ai-imaging/journey/prioritize.jpg.asset.json";
import journeyReview from "@/assets/ai-imaging/journey/review.jpg.asset.json";
import journeyDeliver from "@/assets/ai-imaging/journey/deliver.jpg.asset.json";
import problemWorkload from "@/assets/ai-imaging/problems/workload.jpg.asset.json";
import problemSubtle from "@/assets/ai-imaging/problems/subtle.jpg.asset.json";
import problemWorklist from "@/assets/ai-imaging/problems/worklist.jpg.asset.json";
import problemIncidental from "@/assets/ai-imaging/problems/incidental.jpg.asset.json";
import problemRural from "@/assets/ai-imaging/problems/rural.jpg.asset.json";

export type AIImagingSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const AI_IMAGING_DEFAULTS = {
  Hero: {
    headline: "See What Human Eyes Miss. Diagnose",
    headlineAccent: "With Certainty.",
    ctaLabel: "See AI Imaging in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book a Clinical Demonstration",
    ctaHref2: "#contact",
    chips: [
      "FDA 510(k) Cleared Algorithms",
      "CE Mark Certified",
      "Validated Across 2.4M Clinical Images",
      "CT · MRI · X-Ray · Ultrasound · Pathology",
      "DICOM Native",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Clinical AI for Imaging",
    headline: "AI That Makes Radiologists",
    headlineAccent: "Faster, More Accurate, More Confident.",
    body:
      "Artificial intelligence is not replacing radiologists. It is making them faster, more accurate, and more confident — by processing every pixel of every image before the human eye arrives, surfacing findings that matter, and eliminating the cognitive load that leads to fatigue-driven errors. Secreta AI Imaging brings clinical-grade artificial intelligence to your radiology department, your pathology lab, and your point-of-care imaging workflows — seamlessly integrated, rigorously validated, and ready to work from day one.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Medical Imaging Is Facing a Crisis That Technology Must Help",
    headingAccent: "Solve.",
    items: [
      { title: "Radiologist Workload Crisis", description: "Workloads have increased over 30% in the last decade while trained radiologists have not kept pace. Studies are read faster, under greater pressure, with less time per image — and the error rate reflects it.", image: problemWorkload.url },
      { title: "Subtle Findings Get Missed", description: "A 4mm pulmonary nodule, early diabetic retinopathy, a hairline fracture on a night shift plain film — the findings most likely to be missed are the ones most likely to matter.", image: problemSubtle.url },
      { title: "Critical Studies Sit in Worklists", description: "Time-sensitive studies sit in queues for hours because there is no automated triage logic to surface them before a radiologist manually reviews the worklist.", image: problemWorklist.url },
      { title: "Incidental Findings Go Unreported", description: "Findings in non-target organs are missed because no structured system prompts the radiologist to look beyond the primary clinical indication.", image: problemIncidental.url },
      { title: "Rural Sites Wait for Subspecialty Reads", description: "Under-resourced facilities perform imaging without access to subspecialty expertise — patients wait days or weeks for a specialist read that AI-assisted workflows could support in minutes.", image: problemRural.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Clinical AI That Works Alongside Your Radiologists. Not Instead of Them.",
    body: "Secreta AI Imaging is a modality-spanning, specialty-covering platform that integrates directly into your existing imaging workflow — enhancing every read, accelerating every worklist, and catching what fatigue and time pressure cause humans to miss.",
    items: [
      { icon: "Layers", title: "AI-Powered Image Analysis Across All Modalities", description: "Deploy validated deep learning models across CT, MRI, plain X-ray, ultrasound, mammography, and digital pathology whole slide images. Every analysis result is presented as a structured finding with confidence scores, annotated regions of interest, and comparison against prior studies — not as a black box." },
      { icon: "Activity", title: "Chest X-Ray AI — Triage & Detection", description: "Automatically analyze every chest radiograph for pneumonia, pleural effusion, pneumothorax, cardiomegaly, consolidation, atelectasis, pulmonary nodules, and rib fractures. Critical findings are escalated to the top of the worklist with the AI annotation visible before the radiologist opens the image." },
      { icon: "ScanSearch", title: "CT Pulmonary Nodule Detection & Management", description: "Detect, measure, and characterize pulmonary nodules with sub-millimeter precision. Fleischner Society and Lung-RADS guidelines are integrated, generating structured follow-up recommendations. Surveillance workflows generate recall alerts before follow-up windows are missed." },
      { icon: "Brain", title: "CT Brain — Acute Intracranial Pathology", description: "Triage non-contrast CT brain for intracranial hemorrhage, midline shift, large vessel occlusion, early ischemic change, and hydrocephalus. Critical positive studies generate an immediate alert to the radiologist and referring clinician simultaneously." },
      { icon: "Bone", title: "Musculoskeletal & Fracture Detection", description: "Detect fractures, joint space narrowing, bone lesions, and alignment abnormalities on plain X-ray and CT. Subtle scaphoid, radial head, stress, and non-displaced hip fractures are flagged with annotated regions of interest overlaid on the original image." },
      { icon: "HeartPulse", title: "Mammography AI — Breast Cancer Detection", description: "Analyze digital mammography and DBT for masses, calcifications, architectural distortion, and asymmetries. AI second-read performance matches a second radiologist — letting single-reader workflows achieve double-reader sensitivity. BI-RADS density is automated." },
      { icon: "ScanLine", title: "MRI Prostate — PI-RADS Structured Reporting", description: "Analyze multiparametric prostate MRI for clinically significant cancer with automated lesion detection, localization, and PI-RADS v2.1 scoring. Findings pre-populate the radiology report template — radiologists review, confirm, modify, and sign." },
      { icon: "Microscope", title: "Digital Pathology AI — Whole Slide Analysis", description: "Deploy AI for histopathological analysis across oncology — prostate grading, breast cancer receptor scoring, colorectal polyp classification, and lymph node metastasis detection. AI surfaces the highest-yield regions of each slide for primary attention." },
      { icon: "ListOrdered", title: "AI Worklist Prioritization & Smart Routing", description: "Every study is scored by AI for clinical urgency before a human reviews it. Studies route to the right radiologist by subspecialty, urgency, and availability — automatically. The worklist self-organizes in real time as new studies arrive." },
      { icon: "GitCompare", title: "Longitudinal Comparison & Change Detection", description: "AI automatically retrieves prior studies for direct comparison. Change detection quantifies interval change in nodule size, lesion enhancement, effusion volume, and ventricular size — with reproducible, objective measurements." },
      { icon: "LineChart", title: "AI Performance Monitoring & Audit", description: "Every AI finding is logged against the radiologist's final report. Agreement and disagreement rates are tracked over time. Declining model performance triggers an alert before it affects clinical outcomes." },
      { icon: "Sparkles", title: "Always Human-in-the-Loop", description: "Every AI finding is reviewed, confirmed, and signed by a qualified radiologist before clinical action. The AI never generates a report, communicates with referring clinicians, or triggers action without human authorization." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "AI That Fits Into Your Workflow — Not the Other Way Around",
    items: [
      { icon: "ScanLine", title: "Image Acquired", image: journeyAcquire.url, description: "The patient is scanned. Images are transmitted to your PACS as normal. No change to acquisition protocols or technologist workflows." },
      { icon: "Cpu", title: "AI Analysis Runs Automatically", image: journeyAnalyze.url, description: "The moment images arrive in the PACS, Secreta AI begins analysis in the background. For urgent pathologies — intracranial hemorrhage, pneumothorax, large vessel occlusion — analysis completes within 60 seconds of acquisition." },
      { icon: "ListOrdered", title: "Worklist Prioritized & Annotated", image: journeyPrioritize.url, description: "The worklist updates automatically with AI urgency scores. Critical studies rise to the top. AI annotations — highlighted regions, measurements, confidence scores, and structured findings — are waiting when the radiologist opens the study." },
      { icon: "Eye", title: "Radiologist Reviews & Reports", image: journeyReview.url, description: "The radiologist reviews the image with AI annotations as a second opinion layer. They accept, modify, or dismiss each AI finding with a click. AI structured findings pre-populate the report template — the radiologist adds clinical judgment, context, and signs." },
      { icon: "FileCheck", title: "Report Delivered & Outcome Tracked", image: journeyDeliver.url, description: "The final report is delivered to the referring clinician. AI findings and radiologist decisions are logged. Agreement data feeds the performance monitoring dashboard. Over time, the AI is continuously validated against the clinical environment." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Clinical Performance Validated at Scale",
    items: [
      { value: "94.7%", label: "Sensitivity for intracranial hemorrhage detection on non-contrast CT brain" },
      { value: "91.2%", label: "Sensitivity for pulmonary nodule detection on CT above 4mm" },
      { value: "87%", label: "Reduction in time-to-radiologist-review for critical chest X-ray findings" },
      { value: "2.3%", label: "Of reported studies contain AI-identified findings flagged for governance review" },
      { value: "40%", label: "Reduction in prostate biopsy reporting time with AI-assisted pathology" },
      { value: "0", label: "AI-only clinical decisions — every finding signed by a qualified radiologist" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Native Integration With Your Imaging Infrastructure",
    body: "Secreta AI Imaging integrates directly with your PACS, RIS, and reporting platform — requiring no changes to your acquisition protocols, network architecture, or radiologist reporting workflow. AI runs as an invisible layer between image acquisition and radiologist review.",
    groups: [
      {
        icon: "Boxes",
        title: "Compatible PACS Platforms",
        subtitle: "Vendor-neutral DICOM integration",
        items: ["Secreta RIS", "Agfa Enterprise Imaging", "Philips IntelliSpace", "GE Centricity", "Fujifilm Synapse", "Siemens Healthineers teamplay", "Intelerad", "Ambra Health", "Custom PACS via DICOM"],
      },
      {
        icon: "ScanSearch",
        title: "Supported Modalities",
        subtitle: "Across radiology and pathology",
        items: ["CT", "MRI", "Digital X-Ray", "CR", "Mammography", "DBT", "Ultrasound", "Nuclear Medicine", "Digital Pathology WSI"],
      },
      {
        icon: "FileCode2",
        title: "Standards & Certifications",
        subtitle: "Regulatory-grade quality assurance",
        items: ["DICOM 3.0", "HL7 FHIR", "DICOMweb", "WADO-RS", "FDA 510(k) Cleared", "CE Mark Class IIb", "ISO 13485", "IEC 62304"],
      },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Does the AI make clinical decisions autonomously?", a: "No. Secreta AI operates exclusively as a decision support tool. Every AI finding is presented to a qualified radiologist or pathologist for review, confirmation, modification, or dismissal before any clinical action is taken. The AI never generates a clinical report, never communicates directly with referring clinicians, and never triggers clinical action without human authorization. The radiologist or pathologist remains fully responsible for the final report." },
      { q: "How are the AI algorithms validated?", a: "Each algorithm is validated on large, diverse, multi-site datasets before clinical deployment. Validation studies are conducted against subspecialty ground truth — not general radiologist reads — and published in peer-reviewed literature where available. Post-market performance monitoring continues after deployment, comparing AI findings against radiologist final reports and tracking sensitivity, specificity, and false positive rates over time in the live clinical environment." },
      { q: "What happens when the AI disagrees with the radiologist?", a: "When a radiologist dismisses an AI finding, the dismissal is logged with the rationale provided. Cases where AI-flagged findings were dismissed and the patient subsequently had a related clinical outcome are surfaced through the clinical governance module. Systematic disagreement patterns are reviewed by the clinical AI committee to determine whether the AI, the radiologist practice, or both require adjustment." },
      { q: "How does the AI handle rare or unusual cases it was not trained on?", a: "AI models perform most reliably within the distribution of cases on which they were trained. For unusual presentations, the AI may produce a low-confidence output or no output at all. Low-confidence findings are clearly labeled with confidence scores so radiologists understand the reliability of the AI input. The AI is designed to be most helpful on high-frequency, high-stakes findings — not to replace subspecialty expertise on rare conditions." },
      { q: "Can we deploy AI on our existing PACS without replacing it?", a: "Yes. Secreta AI integrates with your existing PACS through standard DICOM interfaces. Images are routed to the AI analysis engine automatically as they arrive in the PACS. Annotated results are returned as DICOM structured reports and secondary captures. No changes to PACS configuration, acquisition protocols, or radiologist reporting workflow are required." },
      { q: "How is patient data handled within the AI platform?", a: "Images submitted for AI analysis are processed in a secure, encrypted environment. Patient data is not used for model training without explicit institutional consent and a formal data use agreement. Processing can be configured for on-premise deployment within your own infrastructure for facilities with strict data residency or sovereignty requirements." },
      { q: "What is the implementation timeline?", a: "Core AI modules with standard PACS integration are typically live within 2 to 4 weeks. Advanced and Full Spectrum deployments with multiple modality integrations, digital pathology connectivity, and custom reporting template configuration typically take 6 to 10 weeks. A dedicated clinical AI implementation specialist manages the process from integration testing through clinical validation and go-live." },
      { q: "How do we demonstrate clinical value to our leadership and governance committees?", a: "The AI performance monitoring module generates ongoing reports on AI utilization, finding rates, agreement rates, critical finding escalation times, and worklist prioritization impact. These reports are designed for clinical governance committees, department heads, and executive leadership — providing the evidence base to demonstrate value, justify continued investment, and meet regulatory requirements for AI medical device post-market surveillance." },
    ],
  },
  "Final CTA": {
    headline: "The Question Is No Longer Whether AI Belongs in Radiology.",
    headlineAccent: "It Is Whether You Can Afford to Practice Without It.",
    body: "Every day your radiologists read without AI assistance, they are working harder than they need to, missing findings they should not miss, and managing worklists manually that a system could organize in seconds. The technology exists. The clinical evidence is solid. The regulatory pathways are clear.",
    body2: "The only question is when your department makes the transition — and whether you do it with a platform built for clinical rigor or one built for a sales demo.",
    primaryLabel: "Book Your Clinical AI Demonstration",
    primaryHref: "#",
    secondaryLabel: "Request a Validation Data Pack",
    secondaryHref: "#",
    footnote: "No algorithmic black boxes. Full performance transparency. Clinical implementation support from day one.",
    mediaUrl: heroVideo.url,
  },
} as const;

export type AIImagingContent = {
  [K in AIImagingSectionKey]: typeof AI_IMAGING_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<AIImagingSectionKey, boolean> };

const AI_IMAGING_PAGE_SLUG = "healthcare-ai-imaging";

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

export function useAIImagingContent(): AIImagingContent {
  return useSectionsContent(AI_IMAGING_PAGE_SLUG, AI_IMAGING_DEFAULTS) as AIImagingContent;
}

export function useAIImagingContentLegacy(): AIImagingContent {
  const { data } = useQuery({
    queryKey: ["page-sections", AI_IMAGING_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", AI_IMAGING_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<AIImagingSectionKey, boolean> };
  for (const key of Object.keys(AI_IMAGING_DEFAULTS) as AIImagingSectionKey[]) {
    merged[key] = merge(AI_IMAGING_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as AIImagingContent;
}
