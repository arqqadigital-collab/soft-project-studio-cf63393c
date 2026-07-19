import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroImage from "@/assets/pacs/hero.jpg.asset.json";
import problemNoAccess from "@/assets/pacs/problems/no-access.jpg.asset.json";
import problemLegacy from "@/assets/pacs/problems/legacy.jpg.asset.json";
import problemCD from "@/assets/pacs/problems/cd-transfer.jpg.asset.json";
import problemStorage from "@/assets/pacs/problems/storage-fail.jpg.asset.json";
import problemRemote from "@/assets/pacs/problems/remote.jpg.asset.json";
import journeyAcquire from "@/assets/pacs/journey/acquire.jpg.asset.json";
import journeyRetrieve from "@/assets/pacs/journey/retrieve.jpg.asset.json";
import journeyReport from "@/assets/pacs/journey/report.jpg.asset.json";
import journeyDeliver from "@/assets/pacs/journey/deliver.jpg.asset.json";

export type PACSSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const PACS_DEFAULTS = {
  Hero: {
    headline: "Every Image. Every Modality. Every Clinician.",
    headlineAccent: "Instantly.",
    ctaLabel: "See Secreta PACS in Action",
    ctaHref: "#contact",
    ctaLabel2: "Book an Imaging Infrastructure Assessment",
    ctaHref2: "#contact",
    chips: [
      "Managing 50M+ Images",
      "Full DICOM 3.0 Compliance",
      "Zero-Loss Architecture",
      "Multi-Modality & Multi-Site",
      "AI-Ready Infrastructure",
      "HL7 & RIS Integrated",
    ],
    mediaUrl: heroImage.url,
    mediaKind: "image",
  },
  Introduction: {
    eyebrow: "Built for Medical Imaging",
    headline: "Enterprise Imaging Infrastructure for",
    headlineAccent: "Modern Healthcare.",
    body:
      "Medical imaging is one of the most data-intensive, time-critical, and clinically consequential workflows in your hospital. When images are delayed, lost, duplicated, or inaccessible at the point of clinical decision-making, patients wait longer, diagnoses are delayed, and procedures are repeated unnecessarily. Secreta PACS is an enterprise-grade picture archiving and communication system that stores, manages, distributes, and displays every medical image your facility produces — instantly, securely, and from any authorized device anywhere in the world.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "Imaging Infrastructure Failures Cost Clinicians Time, Patients Safety, and Hospitals Money.",
    headingAccent: "Every Day.",
    items: [
      { title: "No Access Outside Radiology", description: "A surgeon preparing for a complex procedure cannot access pre-operative imaging from the operating theatre because the PACS is not accessible outside the radiology department.", image: problemNoAccess.url },
      { title: "Legacy Archives, Lost History", description: "Prior studies from a previous admission sit on a legacy system the current PACS cannot retrieve — so the radiologist reads without comparison, missing interval change that would have changed the report.", image: problemLegacy.url },
      { title: "CDs, Couriers, and Trauma Delays", description: "A patient arrives in the ED after a road traffic accident. Imaging from the referring hospital cannot be transferred digitally — someone burns a CD, drives it across town, and the trauma team decides from verbal descriptions in the meantime.", image: problemCD.url },
      { title: "Storage Failures, Lost Studies", description: "Infrastructure fails during an upgrade and a subset of archived studies becomes inaccessible — triggering a clinical governance incident, a patient safety review, and emergency data recovery that costs more than the original investment.", image: problemStorage.url },
      { title: "Remote Reading That Doesn't Perform", description: "Radiologists working from home cannot access studies at the same speed or quality as they can in the department — because the PACS architecture was never designed for remote reading.", image: problemRemote.url },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Built for the Clinical and Operational Demands of Modern Healthcare",
    body: "From the scanner room floor to the radiologist's workstation, from the operating theatre to the patient's bedside — Secreta PACS delivers every image with reliability, speed, and universal access.",
    items: [
      { icon: "Layers", title: "Universal DICOM Image Acquisition & Storage", description: "Receive, store, and manage DICOM images from every modality — CT, MRI, X-ray, fluoroscopy, mammography, tomosynthesis, ultrasound, nuclear medicine, PET-CT, dental, and interventional. Non-DICOM clinical imaging from endoscopy, dermatology, ophthalmology, and pathology is supported through conversion or native storage with full metadata preservation." },
      { icon: "HardDrive", title: "Zero-Loss Archival Architecture", description: "Redundant, geographically distributed storage with no single point of failure. Automatic tiering moves active studies to high-speed primary storage and migrates long-term archives to cost-efficient deep storage — without manual intervention or performance compromise on current studies." },
      { icon: "Monitor", title: "High-Performance Diagnostic Viewer", description: "A zero-footprint, browser-based diagnostic workstation delivers radiologist-grade display on any authorized device. Advanced visualization — MPR, MIP, volume rendering, 3D reconstruction, and fusion imaging — is built in. Large volumetric studies load in under three seconds on standard clinical hardware." },
      { icon: "Users", title: "Universal Viewing for Clinical Teams", description: "Role-appropriate viewing access for surgeons in theatre, oncologists in MDT, physicians at the bedside, and emergency teams in resuscitation. Image quality and tool availability are matched to clinical role — anywhere, on any authorized device." },
      { icon: "GitBranch", title: "Multi-Site Image Management & Sharing", description: "A unified imaging infrastructure across hospital groups and regional networks. Studies acquired at any site are accessible to authorized users at every other site in real time — with the patient's complete imaging history visible in one record." },
      { icon: "Wifi", title: "Teleradiology & Remote Reading", description: "High-performance image delivery optimized for remote reading over standard internet connections. Diagnostic-quality viewing on calibrated home workstations, integrated voice recognition, and signed reports delivered to the clinical team in real time." },
      { icon: "History", title: "Prior Study Retrieval & Comparison", description: "Every new study automatically retrieves relevant prior imaging — by modality, anatomy, and indication — from your archive, federated PACS, and patient-carried media. Interval change is always assessed against the most clinically relevant prior, not whatever is accessible." },
      { icon: "FileSearch", title: "Structured Reporting & RIS Integration", description: "Bidirectional integration with your Radiology Information System. Structured reporting templates launch from the viewer pre-populated. Voice dictation is built in. Signed reports transmit to RIS, referring clinicians, and the patient record simultaneously." },
      { icon: "Disc", title: "CD & External Image Import", description: "Patient-carried imaging on CD, DVD, or USB is imported through a dedicated workstation that converts external studies to your archival format, associates them with the correct patient, and makes them available for comparison within minutes." },
      { icon: "Share2", title: "Image Exchange & Interoperability", description: "Participate in regional and national image sharing networks via IHE XDS-I and Cross-Enterprise Document Sharing. Send and receive studies electronically — no CD burning, no courier dispatch. Integration with Malaffi, Riayati, and NPHIES image exchange is supported." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "From Image Acquisition to Clinical Decision — Every Step Seamless",
    items: [
      { icon: "ScanLine", title: "Image Acquired", image: journeyAcquire.url, description: "The patient is scanned. The modality transmits the study to Secreta PACS via DICOM immediately after acquisition. The study appears in the archive and on the radiologist's worklist within seconds of the last image being generated." },
      { icon: "History", title: "Priors Retrieved", image: journeyRetrieve.url, description: "Secreta PACS automatically retrieves the patient's relevant prior studies — from the local archive, from federated PACS systems, and from imported external media — and associates them with the current study for comparison viewing." },
      { icon: "Eye", title: "Displayed & Reported", image: journeyReport.url, description: "The radiologist opens the study in the diagnostic viewer. Priors load in the comparison panel automatically. Advanced visualization is available without switching applications. The structured report template opens pre-populated. The radiologist dictates, reviews, and signs." },
      { icon: "FileCheck", title: "Report Delivered", image: journeyDeliver.url, description: "The signed report is transmitted to the RIS, referring clinician's EMR view, and patient portal simultaneously. Images are accessible to authorized clinical team members — surgeons, oncologists, emergency physicians — through role-appropriate viewing portals." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Imaging Performance Measured Across Our Client Network",
    items: [
      { value: "50M+", label: "Medical images managed across client networks" },
      { value: "99.9%", label: "Enterprise SLA availability guaranteed monthly" },
      { value: "<3s", label: "Load time for large volumetric studies on standard hardware" },
      { value: "0", label: "Image loss events under our zero-loss archival architecture" },
      { value: "100%", label: "DICOM 3.0 compliance across every supported modality" },
      { value: "24/7", label: "Worldwide access for authorized clinicians on any device" },
    ],
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "The Imaging Infrastructure at the Centre of Your Clinical Ecosystem",
    body: "Secreta PACS integrates with every system that produces, consumes, or references medical imaging — from modalities on the scanner room floor to AI engines in the cloud, from the RIS to the EMR delivering reports to referring clinicians.",
    groups: [
      { icon: "ScanSearch", title: "Modality Integration", subtitle: "All DICOM 3.0 compliant", items: ["CT", "MRI", "X-Ray", "Fluoroscopy", "Mammography", "Ultrasound", "Nuclear Medicine", "PET-CT", "Dental", "Interventional", "Endoscopy", "Dermatology", "Ophthalmology", "Pathology WSI"] },
      { icon: "Boxes", title: "System Integration", subtitle: "RIS, EMR & enterprise platforms", items: ["Secreta RIS", "Epic", "Cerner", "Meditech", "Agfa", "Philips IntelliSpace", "GE Centricity", "Fujifilm Synapse", "Intelerad", "All RIS via DICOM MWL & HL7"] },
      { icon: "Globe2", title: "National Platform Integration", subtitle: "Regional health information exchanges", items: ["Malaffi", "Riayati", "NPHIES", "Qatar NHIX", "IHE XDS-I Image Exchange Networks"] },
      { icon: "Cpu", title: "AI Platform Integration", subtitle: "Clinical AI engines & custom vendors", items: ["Secreta AI Imaging", "Google Health AI", "Aidoc", "Annalise.ai", "Custom AI vendor integration via DICOM SR & DICOMweb"] },
      { icon: "FileCode2", title: "Supported Standards", subtitle: "Interoperability protocols", items: ["DICOM 3.0", "DICOMweb", "WADO-RS", "STOW-RS", "HL7 v2 & FHIR R4", "IHE Radiology Profiles", "IHE XDS-I", "IHE Cross-Enterprise Document Sharing", "IEC 62494 Radiation Dose Reporting", "REST API"] },
    ],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "How does Secreta PACS handle migration from our existing PACS?", a: "Legacy PACS migration is managed by Secreta's dedicated imaging migration team. The process begins with a complete inventory of your existing archive — study count, modality distribution, date range, and storage format. A migration methodology is developed that prioritizes active and recent studies while migrating the full historical archive in the background. Migration runs in parallel with your existing PACS until the cutover date — ensuring no clinical disruption and no period of reduced image availability. Every migrated study is validated for completeness and integrity before the legacy system is retired." },
      { q: "What is the storage architecture and how is data protected against loss?", a: "Secreta PACS uses a tiered storage architecture with automatic replication across geographically separated storage nodes. Primary storage holds recent and active studies for fast retrieval. Near-line storage holds studies accessed less frequently. Deep archive storage holds long-term retention studies at lower cost per terabyte. Every storage tier replicates data automatically — no single hardware failure can result in image loss. Storage health is monitored continuously and alerts are generated before capacity thresholds are approached. Annual disaster recovery testing is included in enterprise SLA agreements." },
      { q: "Can radiologists use their own diagnostic monitors for remote reading?", a: "Yes. Secreta PACS delivers images calibrated to DICOM GSDF standards through the browser-based viewer — the calibration is applied by the viewer, not by the monitor hardware. For formal diagnostic reading from home, radiologists should use DICOM-calibrated diagnostic monitors. For clinical review — non-reporting access by surgeons, oncologists, and other physicians — standard clinical monitors and consumer displays are appropriate. The viewer automatically applies the display parameters appropriate to the viewing context." },
      { q: "How does the system handle studies from referring hospitals that use a different PACS vendor?", a: "Studies from external PACS systems can be received through three pathways — electronic DICOM push from the external PACS where network connectivity exists, patient-carried media import through the CD import workstation, and IHE XDS-I image exchange where both facilities participate in a shared exchange network. All three pathways result in the external study being associated with the correct patient record and available for comparison viewing alongside local studies in the diagnostic viewer." },
      { q: "What happens to image availability during a planned maintenance window?", a: "Planned maintenance is scheduled during low-activity periods — typically overnight — and communicated to clinical teams in advance. During maintenance, the PACS operates in a read-only mode that allows image viewing to continue while archival and administrative functions are temporarily suspended. Emergency maintenance procedures ensure that imaging availability is restored within defined RTO targets specified in your SLA. Our enterprise SLA guarantees 99.9% availability measured on a monthly basis." },
      { q: "How long are images retained in the archive?", a: "Retention periods are configurable by study type, patient age group, and applicable regulatory requirement. Standard configuration follows the retention requirements of your jurisdiction — typically 7 to 10 years for adult studies and until age 25 or beyond for pediatric studies depending on applicable law. Retention policies are enforced automatically — studies approaching the end of their retention period are flagged for clinical governance review before deletion. Studies flagged for retention beyond standard periods — medicolegal holds, research holds — are managed through a structured exception workflow." },
      { q: "Does the system support 3D post-processing and advanced visualization?", a: "Yes. Advanced visualization tools — multiplanar reconstruction, maximum intensity projection, minimum intensity projection, volume rendering, surface rendering, and virtual endoscopy — are available within the diagnostic viewer without launching a separate application or transferring studies to a dedicated post-processing workstation. For highly specialized post-processing workflows — cardiac CT analysis, neurovascular imaging, orthopedic surgical planning — integration with dedicated third-party post-processing platforms is supported through DICOM push and retrieval." },
      { q: "How is the PACS integrated with AI imaging applications?", a: "The Secreta PACS AI integration layer routes studies to configured AI analysis engines immediately upon acquisition using DICOMweb STOW-RS. AI results are returned as DICOM Structured Reports and DICOM Secondary Captures — appearing in the diagnostic viewer as an overlay or comparison panel alongside the original study. Every AI finding is traceable to the specific study and series that generated it. Multiple AI applications can be connected simultaneously, with study routing rules configured by modality, body region, and clinical indication." },
    ],
  },
  "Final CTA": {
    headline: "Every Image Your Facility Produces Is a Clinical Asset.",
    headlineAccent: "Treat It Like One.",
    body: "Medical images drive diagnoses, guide procedures, inform treatment decisions, and create the longitudinal visual record of your patients' health over time. They deserve infrastructure that stores them without loss, delivers them without delay, displays them without compromise, and makes them available to every clinician who needs them — wherever they are, whenever they need them.",
    body2: "That is what Secreta PACS delivers. Every image. Every time.",
    primaryLabel: "Book Your Imaging Infrastructure Assessment",
    primaryHref: "#",
    secondaryLabel: "Request a PACS Migration Consultation",
    secondaryHref: "#",
    footnote: "Legacy PACS migration support included. On-premise, cloud, and hybrid deployment available. Infrastructure assessment delivered within two weeks. Pricing tailored to your study volume and site configuration.",
    mediaUrl: heroImage.url,
  },
} as const;

export type PACSContent = {
  [K in PACSSectionKey]: typeof PACS_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<PACSSectionKey, boolean> };

const PACS_PAGE_SLUG = "healthcare-pacs";

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

export function usePACSContent(): PACSContent {
  return useSectionsContent(PACS_PAGE_SLUG, PACS_DEFAULTS) as PACSContent;
}

export function usePACSContentLegacy(): PACSContent {
  const { data } = useQuery({
    queryKey: ["page-sections", PACS_PAGE_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages")
        .select("id")
        .eq("slug", PACS_PAGE_SLUG)
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
  const merged: any = { _visible: {} as Record<PACSSectionKey, boolean> };
  for (const key of Object.keys(PACS_DEFAULTS) as PACSSectionKey[]) {
    merged[key] = merge(PACS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as PACSContent;
}
