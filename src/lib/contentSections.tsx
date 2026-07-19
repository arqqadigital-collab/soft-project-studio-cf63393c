import { createContext, useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { CLINICAL_AI_DEFAULTS } from "@/lib/clinicalAiContent";
import { AI_IMAGING_DEFAULTS } from "@/lib/aiImagingContent";
import { PE_DEFAULTS } from "@/lib/patientEngagementContent";
import { RC_DEFAULTS } from "@/lib/revenueCycleContent";
import { BLOOD_BANK_DEFAULTS } from "@/lib/bloodBankContent";
import { CLINIC_DEFAULTS } from "@/lib/clinicContent";
import { DENTAL_DEFAULTS } from "@/lib/dentalContent";
import { ED_DEFAULTS } from "@/lib/edContent";
import { HIS_DEFAULTS } from "@/lib/hisContent";
import { LIS_DEFAULTS } from "@/lib/lisContent";
import { MEDICATION_DEFAULTS } from "@/lib/medicationContent";
import { PHYSIO_DEFAULTS } from "@/lib/physioContent";
import { RCM_DEFAULTS } from "@/lib/rcmContent";
import { RIS_DEFAULTS } from "@/lib/risContent";
import { EMRAM_DEFAULTS } from "@/lib/emramContent";
import { HOSPITAL_OPERATIONS_DEFAULTS } from "@/lib/hospitalOperationsContent";
import { PACS_DEFAULTS } from "@/lib/pacsContent";
import { TELEMEDICINE_DEFAULTS } from "@/lib/telemedicineContent";
import { KSA_COMPLIANCE_DEFAULTS } from "@/lib/ksaComplianceContent";
import { UAE_COMPLIANCE_DEFAULTS } from "@/lib/uaeComplianceContent";
import { DYNAMICS_DEFAULTS } from "@/lib/dynamicsContent";
import { ODOO_DEFAULTS } from "@/lib/odooContent";
import { ZOHO_DEFAULTS } from "@/lib/zohoContent";
import { MANUFACTURING_DEFAULTS } from "@/lib/manufacturingContent";
import { RETAIL_DEFAULTS } from "@/lib/retailContent";
import { LOGISTICS_DEFAULTS } from "@/lib/logisticsContent";
import { EDUCATION_DEFAULTS } from "@/lib/educationContent";
import { CONSULTING_DEFAULTS } from "@/lib/consultingContent";
import { CYBERSECURITY_DEFAULTS } from "@/lib/cybersecurityContent";
import { IMPLEMENTATION_DEFAULTS } from "@/lib/implementationContent";
import { LEARNING_DEFAULTS } from "@/lib/learningContent";
import { STAFF_AUG_DEFAULTS } from "@/lib/staffAugContent";
import { ABOUT_DEFAULTS } from "@/lib/aboutContent";
import { BLOG_DEFAULTS } from "@/lib/blogContent";
import { CAREERS_DEFAULTS } from "@/lib/careersContent";
import { CASE_STUDIES_DEFAULTS } from "@/lib/caseStudiesContent";
import { EVENTS_DEFAULTS } from "@/lib/eventsContent";

// Map page slug → its content defaults. Editor uses this to show the RIGHT
// fields for the current page (each page has its own content shape).
const DEFAULTS_BY_SLUG: Record<string, Record<string, any>> = {
  "healthcare-clinical-ai": CLINICAL_AI_DEFAULTS as any,
  "healthcare-ai-imaging": AI_IMAGING_DEFAULTS as any,
  "healthcare-patient-engagement": PE_DEFAULTS as any,
  "healthcare-revenue-cycle": RC_DEFAULTS as any,
  "blood-bank-and-donor-management": BLOOD_BANK_DEFAULTS as any,
  "clinic": CLINIC_DEFAULTS as any,
  "dental-management-suite": DENTAL_DEFAULTS as any,
  "emergency": ED_DEFAULTS as any,
  "his": HIS_DEFAULTS as any,
  "lis": LIS_DEFAULTS as any,
  "healthcare-medication-dosage": MEDICATION_DEFAULTS as any,
  "physiotherapy": PHYSIO_DEFAULTS as any,
  "rcm": RCM_DEFAULTS as any,
  "ris": RIS_DEFAULTS as any,
  "healthcare-emram": EMRAM_DEFAULTS as any,
  "healthcare-operations": HOSPITAL_OPERATIONS_DEFAULTS as any,
  "healthcare-pacs": PACS_DEFAULTS as any,
  "healthcare-telemedicine": TELEMEDICINE_DEFAULTS as any,
  "healthcare-ksa-compliance": KSA_COMPLIANCE_DEFAULTS as any,
  "healthcare-uae-compliance": UAE_COMPLIANCE_DEFAULTS as any,
  "erp-dynamics-365": DYNAMICS_DEFAULTS as any,
  "erp-odoo": ODOO_DEFAULTS as any,
  "erp-zoho": ZOHO_DEFAULTS as any,
  "erp-manufacturing": MANUFACTURING_DEFAULTS as any,
  "erp-retail": RETAIL_DEFAULTS as any,
  "erp-logistics": LOGISTICS_DEFAULTS as any,
  "erp-education": EDUCATION_DEFAULTS as any,
  "services-consulting": CONSULTING_DEFAULTS as any,
  "services-cybersecurity": CYBERSECURITY_DEFAULTS as any,
  "services-implementation": IMPLEMENTATION_DEFAULTS as any,
  "services-learning": LEARNING_DEFAULTS as any,
  "services-staff-aug": STAFF_AUG_DEFAULTS as any,
  "about": ABOUT_DEFAULTS as any,
  "blog": BLOG_DEFAULTS as any,
  "careers": CAREERS_DEFAULTS as any,
  "case-studies": CASE_STUDIES_DEFAULTS as any,
  "events": EVENTS_DEFAULTS as any,
};

const PageSlugContext = createContext<string | undefined>(undefined);

export function PageDefaultsProvider({ slug, children }: { slug?: string; children: React.ReactNode }) {
  return <PageSlugContext.Provider value={slug}>{children}</PageSlugContext.Provider>;
}

function usePageDefaultsFor(sectionName: string): Record<string, any> {
  const slug = useContext(PageSlugContext);
  const bySlug = slug ? DEFAULTS_BY_SLUG[slug] : undefined;
  if (bySlug?.[sectionName]) return bySlug[sectionName];
  // Fallback: try any page that defines this section (first match)
  for (const src of Object.values(DEFAULTS_BY_SLUG)) {
    if (src?.[sectionName]) return src[sectionName];
  }
  return {};
}


/**
 * Generic section registry for the 12 product/service pages that share the
 * 9-block content shape (Hero, Introduction, The Problem, The Platform,
 * How It Works / Patient Journey, Outcomes, Integrations, FAQ, Final CTA).
 *
 * The Edit form introspects the row's actual `data` — so it works for ANY
 * page (AI Imaging, HIS, LIS, RCM, RIS, Dental, Blood Bank, Clinic, ED,
 * Medication, Physio, Clinical AI) without a per-page adapter.
 */

type SectionData = Record<string, any>;
type SectionDef = {
  kind: string;
  label: string;
  description: string;
  defaultData: SectionData;
  Render: React.ComponentType<{ data: SectionData }>;
  Edit: React.ComponentType<{ data: SectionData; onChange: (next: SectionData) => void }>;
};

// ---------- Field primitives ----------

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function LongTextField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

function MediaField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  const isVideo = /\.(mp4|webm|mov)$/i.test(value ?? "");
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          isVideo ? (
            <video src={value} className="h-14 w-24 rounded border object-cover" muted autoPlay loop playsInline />
          ) : (
            <img src={value} alt="" className="h-14 w-24 rounded border object-cover" />
          )
        ) : (
          <div className="flex h-14 w-24 items-center justify-center rounded border bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>Choose</Button>
          {value && <Button size="sm" variant="ghost" onClick={() => onChange("")}>Clear</Button>}
        </div>
      </div>
      <MediaPickerDialog open={open} onOpenChange={setOpen} onPick={(m: any) => onChange(m.file_url)} />
    </div>
  );
}

function StringListField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <Button size="sm" variant="ghost" onClick={() => onChange([...list, ""])}>
          <Plus className="mr-1 h-3 w-3" /> Add
        </Button>
      </div>
      <div className="space-y-2">
        {list.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input value={v} onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))} />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onChange(list.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Field-type inference ----------

const MEDIA_KEYS = /^(image|logo|mediaurl|src|cover|thumb|background|bg|video|poster)$/i;
const LONG_KEYS = /^(body|body2|description|subheadline|subheading|footnote|answer|a)$/i;

function isUrlString(v: any) {
  return typeof v === "string" && /^(https?:|\/|data:image)/.test(v);
}

function AnyField({ k, value, onChange }: { k: string; value: any; onChange: (v: any) => void }) {
  // arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      // Empty array — assume string chips if key hints, else objects
      if (/chips|tags|items|list/i.test(k)) {
        return <StringListField label={k} value={[]} onChange={onChange} />;
      }
      return <StringListField label={k} value={[]} onChange={onChange} />;
    }
    const first = value[0];
    if (typeof first === "string") {
      return <StringListField label={k} value={value} onChange={onChange} />;
    }
    if (first && typeof first === "object") {
      // Groups pattern: {title, items: string[]} or {title, subtitle, items: string[]}
      if (Array.isArray(first.items) && (first.items.length === 0 || typeof first.items[0] === "string")) {
        return <GroupsField label={k} value={value} onChange={onChange} />;
      }
      return <ItemsField label={k} value={value} template={first} onChange={onChange} />;
    }
  }
  // string / undefined
  if (value == null || typeof value === "string") {
    if (MEDIA_KEYS.test(k) || (typeof value === "string" && isUrlString(value) && /\.(png|jpe?g|gif|webp|svg|avif|mp4|webm|mov)(\?|$)/i.test(value))) {
      return <MediaField label={k} value={value ?? ""} onChange={onChange} />;
    }
    if (LONG_KEYS.test(k) || (typeof value === "string" && value.length > 100)) {
      return <LongTextField label={k} value={value ?? ""} onChange={onChange} rows={4} />;
    }
    return <TextField label={k} value={value ?? ""} onChange={onChange} />;
  }
  // fallback
  return <TextField label={k} value={String(value ?? "")} onChange={onChange} />;
}

function ItemsField({ label, value, template, onChange }: { label: string; value: any[]; template: Record<string, any>; onChange: (v: any[]) => void }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label} ({list.length})</Label>
        <Button size="sm" variant="ghost" onClick={() => onChange([...list, buildEmpty(template)])}>
          <Plus className="mr-1 h-3 w-3" /> Add item
        </Button>
      </div>
      <div className="space-y-3">
        {list.map((item, i) => {
          // Union of keys across template and this item so we render all fields.
          const keys = Array.from(new Set([...Object.keys(template ?? {}), ...Object.keys(item ?? {})]));
          return (
            <div key={i} className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0} onClick={() => {
                    const next = [...list]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next);
                  }}>↑</Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === list.length - 1} onClick={() => {
                    const next = [...list]; [next[i + 1], next[i]] = [next[i], next[i + 1]]; onChange(next);
                  }}>↓</Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onChange(list.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {keys.map((k) => (
                <AnyField
                  key={k}
                  k={k}
                  value={item?.[k]}
                  onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)))}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupsField({ label, value, onChange }: { label: string; value: any[]; onChange: (v: any[]) => void }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label} ({list.length})</Label>
        <Button size="sm" variant="ghost" onClick={() => onChange([...list, { title: "", items: [] }])}>
          <Plus className="mr-1 h-3 w-3" /> Add group
        </Button>
      </div>
      {list.map((g, i) => {
        const keys = Array.from(new Set(["title", "subtitle", "icon", ...Object.keys(g ?? {})]));
        return (
          <div key={i} className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Group {i + 1}</span>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onChange(list.filter((_, j) => j !== i))}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {keys.map((k) => {
              if (k === "items") {
                return (
                  <StringListField
                    key={k}
                    label="items"
                    value={g?.items ?? []}
                    onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, items: v } : x)))}
                  />
                );
              }
              return (
                <AnyField
                  key={k}
                  k={k}
                  value={g?.[k]}
                  onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)))}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function buildEmpty(template: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k of Object.keys(template ?? {})) {
    const v = template[k];
    if (Array.isArray(v)) out[k] = [];
    else if (v && typeof v === "object") out[k] = {};
    else if (typeof v === "number") out[k] = 0;
    else if (typeof v === "boolean") out[k] = false;
    else out[k] = "";
  }
  return out;
}

// ---------- Generic Edit / Render ----------

function makeEdit(sectionName: string) {
  return function GenericEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
    const set = (k: string, v: any) => onChange({ ...data, [k]: v });
    // Pull shape from THIS page's own defaults (via PageDefaultsProvider),
    // so HIS shows HIS fields, LIS shows LIS fields, etc.
    const pageShape = usePageDefaultsFor(sectionName);
    const merged: SectionData = { ...pageShape, ...data };
    const preferred = ["eyebrow", "heading", "headingAccent", "headline", "headlineAccent", "subheading", "subheadline", "body", "body2"];
    const keys = Object.keys(merged).filter((k) => k !== "section_name");
    const ordered = [
      ...preferred.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !preferred.includes(k)),
    ];
    return (
      <div className="space-y-4">
        {ordered.map((k) => (
          <AnyField key={k} k={k} value={data?.[k] ?? merged[k]} onChange={(v) => set(k, v)} />
        ))}
      </div>
    );
  };
}


function GenericRender({ data, kind }: { data: SectionData; kind: string }) {
  const heading = data?.heading ?? data?.headline ?? kind;
  const eyebrow = data?.eyebrow;
  const body = data?.body;
  const itemCount = Array.isArray(data?.items) ? data.items.length
    : Array.isArray(data?.groups) ? data.groups.length
    : Array.isArray(data?.chips) ? data.chips.length : 0;
  return (
    <section className="border-y border-border bg-muted/20 py-8">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{eyebrow}</div>}
        <div className="text-lg font-semibold text-foreground">{heading}</div>
        {body && <p className="mt-2 text-sm text-muted-foreground">{String(body).slice(0, 240)}{String(body).length > 240 ? "…" : ""}</p>}
        {itemCount > 0 && <div className="mt-3 text-xs text-muted-foreground">{itemCount} item{itemCount === 1 ? "" : "s"}</div>}
      </div>
    </section>
  );
}

// ---------- Registry ----------

const DESCRIPTIONS: Record<string, string> = {
  Hero: "Top hero — headline, CTAs, chips, background media.",
  Introduction: "Eyebrow + intro headline and body.",
  "The Problem": "Grid of problem cards with title/description/image.",
  "The Platform": "Feature grid with icon/title/description.",
  "How It Works": "Journey steps with icon/image/title/description.",
  "Patient Journey": "Journey steps with icon/image/title/description.",
  Outcomes: "Stats grid with value + label.",
  Integrations: "Groups of tag chips (standards, capabilities…).",
  FAQ: "Expandable question/answer list.",
  "Final CTA": "Closing banner with headline, CTAs and media.",
};

// Default data source per kind — used when adding a NEW empty section.
// Existing seeded rows use their own data verbatim, so this only affects new inserts.
function pickDefault(kind: string): SectionData {
  const ca: any = (CLINICAL_AI_DEFAULTS as any)[kind];
  if (ca) return { section_name: kind, ...ca };
  const ai: any = (AI_IMAGING_DEFAULTS as any)[kind];
  if (ai) return { section_name: kind, ...ai };
  return { section_name: kind, heading: kind };
}

export const PAGE_CONTENT_KINDS = [
  "Hero",
  "Introduction",
  "The Problem",
  "The Platform",
  "How It Works",
  "Patient Journey",
  "Outcomes",
  "Integrations",
  "FAQ",
  "Final CTA",
  // Dynamics 365 sections
  "What We Deliver",
  "Process",
  "Use Cases",
  "Who We Serve",
  "Standard vs Strategic",
  "Discovery Session",
  // Odoo sections
  "What We Build",
  "Development Process",
  "80/20 Statement",
  "ERP Objective",
  // Zoho sections
  "How We Work",
  "Business Impact",
  "Objective",
  // Manufacturing sections
  "Traditional Fail",
  "Approach",
  "Capabilities",
  "Implementation",
  "Why SBS",
  // Consulting sections
  "Philosophy",
  "Services",
  "Stats",
  // Cybersecurity sections
  "Pillars",
  // Implementation sections
  "Methodology",
  // Staff Aug sections
  "Models",
  // About sections
  "Mission & Vision",
  "Our Journey",
  // Careers sections
  "Promise",
  "Hiring Journey",
] as const;

export const PAGE_CONTENT_SECTION_DEFS: Record<string, SectionDef> = Object.fromEntries(
  PAGE_CONTENT_KINDS.map((k) => [
    k,
    {
      kind: k,
      label: k,
      description: DESCRIPTIONS[k] ?? k,
      defaultData: pickDefault(k),
      Render: ({ data }: { data: SectionData }) => <GenericRender data={data} kind={k} />,
      Edit: makeEdit(k),
    },
  ]),
);
