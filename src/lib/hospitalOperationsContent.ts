import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSectionsContent } from "@/lib/useSectionsContent";

import heroVideo from "@/assets/his-hero.mp4.asset.json";
import ctaVideo from "@/assets/his-cta.mp4.asset.json";
import p1 from "@/assets/his/problem-1.jpg.asset.json";
import p2 from "@/assets/his/problem-2.jpg.asset.json";
import p3 from "@/assets/his/problem-3.jpg.asset.json";
import p4 from "@/assets/his/problem-4.jpg.asset.json";
import p5 from "@/assets/his/problem-5.jpg.asset.json";
import jRegistration from "@/assets/his-journey/registration.png.asset.json";
import jConsultation from "@/assets/his-journey/outpatient-consultation.png.asset.json";
import jAdmission from "@/assets/his-journey/admission.png.asset.json";
import jInpatient from "@/assets/his-journey/inpatient-care.png.asset.json";
import jDischarge from "@/assets/his-journey/discharge.png.asset.json";

export type HOSectionKey =
  | "Hero"
  | "Introduction"
  | "The Problem"
  | "The Platform"
  | "Patient Journey"
  | "Outcomes"
  | "Integrations"
  | "FAQ"
  | "Final CTA";

export const HOSPITAL_OPERATIONS_DEFAULTS = {
  Hero: {
    headline: "See Every Bed.",
    headlineAccent: "Find Every Asset.",
    ctaLabel: "Digitize Your Hospital Operations",
    ctaHref: "#contact",
    ctaLabel2: "See It in Action",
    ctaHref2: "#contact",
    chips: [
      "Deployed in 60+ hospitals",
      "BLE · UWB · Wi-Fi · IR",
      "HIPAA & GDPR Aligned",
      "24/7 Cold Chain Monitoring",
      "Wearable Duress Ready",
      "HL7 FHIR Native",
    ],
    mediaUrl: heroVideo.url,
    mediaKind: "video",
  },
  Introduction: {
    eyebrow: "Built for Hospital Operations",
    headline: "A Live Digital Twin of",
    headlineAccent: "Every Corridor and Every Asset.",
    body:
      "Modern hospitals cannot run on whiteboards, walkie-talkies and gut feel. Our Hospital Operations & RTLS platform combines real-time location intelligence, bed management, environmental monitoring and staff safety into a single operational nervous system — so leaders see the whole hospital, live, and every workflow moves faster than the phone tree it replaces.",
  },
  "The Problem": {
    eyebrow: "The Problem",
    heading: "You Cannot Improve What You Cannot See.",
    headingAccent: "Most Hospitals Are Flying Blind.",
    subheading:
      "Without live location and operational data, small delays compound into hours of lost productivity, unsafe conditions and capital wasted on the wrong problems.",
    items: [
      { title: "Beds Nobody Can Find", image: p1.url, description: "An admitted ED patient waits four hours for a bed that has actually been ready for two — because there is no live view of cleaning and occupancy status across the wards." },
      { title: "The Equipment Hunt", image: p2.url, description: "Nurses spend an hour a day searching for infusion pumps, wheelchairs and vital signs monitors — because inventory location lives in memory, not in a system." },
      { title: "Silent Cold Chain Failure", image: p3.url, description: "A vaccine fridge drifts out of range overnight. No one notices until morning rounds — and thousands of dollars of stock is discarded, unreported until the next audit." },
      { title: "Slow Duress Response", image: p4.url, description: "A staff member facing an aggressive visitor cannot reach a phone. There is no wearable alert, no location broadcast, no automated escalation — help arrives too late." },
      { title: "Guesswork Capacity Planning", image: p5.url, description: "The executive team plans capital investment based on gut feeling — because true equipment utilization, room dwell time and bottleneck data simply do not exist." },
    ],
  },
  "The Platform": {
    eyebrow: "The Platform",
    heading: "Every Corridor, Every Asset, Every Person — In Real Time",
    body:
      "A unified operational platform that turns your buildings into live, queryable, actionable data — so every decision runs on fact, not folklore.",
    items: [
      { icon: "MapPin", title: "Real-Time Location Services (RTLS)", description: "Track staff, patients and equipment across every corridor, ward and OR with sub-meter precision using BLE, Wi-Fi, UWB or infrared tags — whichever fits your building and budget best." },
      { icon: "BedDouble", title: "Live Bed & Room Management", description: "See every bed, room, cleaning status and occupancy in real time. Turnover automatically triggers housekeeping requests, so beds move from occupied to available without a single phone call." },
      { icon: "Wrench", title: "Equipment Tracking & Utilization", description: "Locate every infusion pump, wheelchair and portable X-ray in seconds. Utilization dashboards reveal which assets sit idle and which are chronically short — data your capital planning has never had before." },
      { icon: "Radio", title: "Staff Duress & Safety Alerts", description: "Wearable duress buttons let staff summon help instantly with their exact location — with automated escalation to security and clinical response teams if help does not arrive in seconds." },
      { icon: "Thermometer", title: "Cold Chain & Environmental Monitoring", description: "Continuous, wireless monitoring of fridges, freezers, pharmacy vaults and operating room temperature and humidity — with automated alerts before excursions become excursions." },
      { icon: "Users", title: "Patient Flow & Journey Tracking", description: "Track patients from admission through every waiting area, treatment room and diagnostic step. Bottlenecks surface on live dashboards long before they become complaints." },
      { icon: "Boxes", title: "Consumables & Inventory Automation", description: "RFID-tagged inventory automatically decrements as items are used. Reorder points trigger requisitions without manual counting. Waste and stockouts drop together." },
    ],
  },
  "Patient Journey": {
    eyebrow: "How It Works",
    heading: "From Live Signal to Operational Command",
    body: "",
    items: [
      { icon: "MapPin", title: "Assets & People Tagged", image: jRegistration.url, description: "Staff badges, patient wristbands and equipment tags stream location data into the platform. A digital twin of the hospital updates continuously — every asset, every bay, every person accounted for." },
      { icon: "BedDouble", title: "Live Operational Command", image: jConsultation.url, description: "Bed managers, charge nurses and operations leaders work from a single live dashboard — occupancy, cleaning status, staffing coverage and equipment availability visible at a glance." },
      { icon: "Activity", title: "Automated Workflows Trigger", image: jAdmission.url, description: "A patient discharge triggers housekeeping, a fridge excursion triggers pharmacy notification, a duress button triggers security — automation replaces the pager and the phone call." },
      { icon: "Wrench", title: "Utilization Insights", image: jInpatient.url, description: "Every movement, dwell time and status change feeds analytics. Leadership sees exactly how bays are used, where patients wait, and which equipment truly needs replacement." },
      { icon: "ClipboardList", title: "Continuous Improvement", image: jDischarge.url, description: "Weekly and monthly performance reviews are built from validated operational data — not anecdotes. Every improvement initiative starts with real numbers and ends with a measurable outcome." },
    ],
  },
  Outcomes: {
    eyebrow: "Outcomes",
    heading: "Operational Gains You Can Take to the Board",
    items: [
      { value: "42%", label: "Reduction in average bed turnover time from discharge to next admission" },
      { value: "30%", label: "Fewer 'lost equipment' incidents thanks to real-time asset tracking" },
      { value: "3x", label: "Faster staff duress response with location-aware alerts" },
      { value: "100%", label: "Continuous cold chain and environmental monitoring, audit-ready" },
    ],
    footnote:
      "Typical ROI recovered inside 24 months through shorter bed turnover, reduced equipment loss and avoided cold chain wastage — with structured business-case reporting built in from day one.",
  },
  Integrations: {
    eyebrow: "Integrations",
    heading: "Plugs Into the Systems You Already Run",
    body:
      "Bed status flows into your HIS. Equipment tickets flow into your CMMS. Environmental alerts flow into pharmacy and lab systems. Staff safety alerts flow into your security platform. Every signal reaches the team best placed to act on it.",
    tags: ["HL7 FHIR", "CMMS", "IoT Sensors", "Wearables", "BLE", "UWB", "Wi-Fi", "Infrared", "RFID"],
  },
  FAQ: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { q: "Which RTLS technologies do you support?", a: "We support Bluetooth Low Energy (BLE), Wi-Fi, Ultra-Wideband (UWB), infrared and RFID — often blended in the same deployment. The right mix depends on the accuracy your use cases require and the buildings you operate in. Our team assesses this during site design." },
      { q: "Do we need to rewire the hospital to deploy RTLS?", a: "No. Most deployments overlay onto your existing network with battery-powered anchors and tags — no structural cabling required. On new builds and major renovations, we design cabling into the plans for optimal accuracy." },
      { q: "How long does implementation take?", a: "A single-ward pilot goes live in 4 to 6 weeks. Full hospital deployments typically take 4 to 9 months depending on square footage, use case scope and integration complexity. Every project ships in phases with measurable outcomes at each stage." },
      { q: "Can this integrate with our existing HIS and CMMS?", a: "Yes. Bed status flows into your HIS, equipment work orders flow into your CMMS, and environmental alerts flow into pharmacy and lab systems — all over HL7 FHIR, REST APIs and prebuilt connectors for major platforms." },
      { q: "Is patient location data privacy-compliant?", a: "Yes. Patient tags stream only inside the facility. Data is encrypted, access is role-based with full audit trails, and retention policies are configurable per tenant — aligned with HIPAA, GDPR and regional privacy regulations." },
      { q: "What kind of operational return should we expect?", a: "Clients typically recover investment within 12 to 24 months through reduced bed turnover time, lower equipment shrinkage, avoided cold chain losses and reduced overtime spent searching. Business case modelling is included in the pre-sales phase." },
      { q: "Do wearable duress alerts work outside cellular coverage?", a: "Yes. Alerts route through the RTLS network itself — they do not depend on cellular or Wi-Fi being reachable from the wearable's location." },
    ],
  },
  "Final CTA": {
    headline: "Run Your Hospital With",
    headlineAccent: "Data That Actually Reflects Reality.",
    body:
      "Faster turnover. Fewer lost assets. Safer staff. Protected cold chain. Capital decisions grounded in truth. Every improvement your operations team wants starts with knowing where everything actually is.",
    primaryLabel: "Book Your Free Demo",
    primaryHref: "#",
    secondaryLabel: "Request a Pilot Design",
    secondaryHref: "#",
    footnote: "Phased deployment. Measurable outcomes at every stage. Dedicated support from day one.",
    mediaUrl: ctaVideo.url,
    mediaKind: "video",
  },
} as const;

export type HOContent = {
  [K in HOSectionKey]: typeof HOSPITAL_OPERATIONS_DEFAULTS[K] & Record<string, any>;
} & { _visible: Record<HOSectionKey, boolean> };

const HO_SLUG = "healthcare-operations";

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

export function useHospitalOperationsContent(): HOContent {
  return useSectionsContent(HO_SLUG, HOSPITAL_OPERATIONS_DEFAULTS) as HOContent;
}

export function useHospitalOperationsContentLegacy(): HOContent {
  const { data } = useQuery({
    queryKey: ["page-sections", HO_SLUG],
    queryFn: async () => {
      const { data: page, error: pageErr } = await supabase
        .from("pages").select("id").eq("slug", HO_SLUG).maybeSingle();
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
  const merged: any = { _visible: {} as Record<HOSectionKey, boolean> };
  for (const key of Object.keys(HOSPITAL_OPERATIONS_DEFAULTS) as HOSectionKey[]) {
    merged[key] = merge(HOSPITAL_OPERATIONS_DEFAULTS[key] as any, overrides[key] ?? {});
    merged._visible[key] = visibility[key] ?? true;
  }
  return merged as HOContent;
}
