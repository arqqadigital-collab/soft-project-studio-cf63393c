import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { CLINICAL_AI_DEFAULTS, type ClinicalAiSectionKey } from "@/lib/clinicalAiContent";

// Registry-compatible types (kept loose to avoid coupling to pageSections.tsx internals).
type SectionData = Record<string, any>;
type SectionDef = {
  kind: string;
  label: string;
  description: string;
  defaultData: SectionData;
  Render: React.ComponentType<{ data: SectionData }>;
  Edit: React.ComponentType<{ data: SectionData; onChange: (next: SectionData) => void }>;
};

// ---------- Small field primitives ----------

function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function LongTextField({
  label, value, onChange, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

function MediaField({
  label, value, onChange,
}: { label: string; value: string; onChange: (url: string) => void }) {
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
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onPick={(m: any) => onChange(m.file_url)}
      />
    </div>
  );
}

// Chip-style string[] editor.
function StringListField({
  label, value, onChange,
}: { label: string; value: string[]; onChange: (v: string[]) => void }) {
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
            <Input
              value={v}
              onChange={(e) => onChange(list.map((x, j) => (j === i ? e.target.value : x)))}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onChange(list.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Detects which sub-fields exist on the item template and renders inputs for each.
function ItemsField({
  label,
  value,
  template,
  onChange,
}: {
  label: string;
  value: any[];
  template: Record<string, any>;
  onChange: (v: any[]) => void;
}) {
  const list = Array.isArray(value) ? value : [];
  const keys = Object.keys(template);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label} ({list.length})</Label>
        <Button size="sm" variant="ghost" onClick={() => onChange([...list, { ...template }])}>
          <Plus className="mr-1 h-3 w-3" /> Add item
        </Button>
      </div>
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Item {i + 1}</span>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === 0}
                  onClick={() => {
                    const next = [...list];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}>↑</Button>
                <Button size="icon" variant="ghost" className="h-7 w-7" disabled={i === list.length - 1}
                  onClick={() => {
                    const next = [...list];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}>↓</Button>
                <Button size="icon" variant="ghost" className="h-7 w-7"
                  onClick={() => onChange(list.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
            {keys.map((k) => {
              const cur = item?.[k] ?? "";
              const set = (v: any) => onChange(list.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
              if (k === "image" || k === "mediaUrl" || k === "logo" || k === "icon" && /url|\/|https?:/.test(cur)) {
                return <MediaField key={k} label={k} value={cur} onChange={set} />;
              }
              if (k === "description" || k === "a" || k === "body") {
                return <LongTextField key={k} label={k} value={cur} onChange={set} rows={3} />;
              }
              return <TextField key={k} label={k} value={cur} onChange={set} />;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Groups editor: array of { title, items: string[] }
function GroupsField({
  label, value, onChange,
}: { label: string; value: any[]; onChange: (v: any[]) => void }) {
  const list = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label} ({list.length})</Label>
        <Button size="sm" variant="ghost" onClick={() => onChange([...list, { title: "", items: [] }])}>
          <Plus className="mr-1 h-3 w-3" /> Add group
        </Button>
      </div>
      {list.map((g, i) => (
        <div key={i} className="space-y-2 rounded-md border border-border bg-muted/30 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Group {i + 1}</span>
            <Button size="icon" variant="ghost" className="h-7 w-7"
              onClick={() => onChange(list.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <TextField label="title" value={g?.title ?? ""} onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
          <StringListField label="items" value={g?.items ?? []} onChange={(v) => onChange(list.map((x, j) => (j === i ? { ...x, items: v } : x)))} />
        </div>
      ))}
    </div>
  );
}

// ---------- Generic edit form driven by CLINICAL_AI_DEFAULTS shape ----------

function makeEdit(sectionKey: ClinicalAiSectionKey) {
  const defaults = CLINICAL_AI_DEFAULTS[sectionKey] as Record<string, any>;
  return function Edit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
    const set = (k: string, v: any) => onChange({ ...data, [k]: v });
    return (
      <div className="space-y-4">
        {Object.entries(defaults).map(([k, defVal]) => {
          const cur = data?.[k];
          const use = cur ?? defVal;

          if (k === "items" && Array.isArray(defVal) && defVal.length > 0 && typeof defVal[0] === "object") {
            return <ItemsField key={k} label="Items" value={use} template={defVal[0]} onChange={(v) => set(k, v)} />;
          }
          if (k === "groups" && Array.isArray(defVal)) {
            return <GroupsField key={k} label="Groups" value={use} onChange={(v) => set(k, v)} />;
          }
          if (k === "chips" && Array.isArray(defVal)) {
            return <StringListField key={k} label="Chips" value={use} onChange={(v) => set(k, v)} />;
          }
          if (k === "mediaUrl") {
            return <MediaField key={k} label="Media (image or video URL)" value={use ?? ""} onChange={(v) => set(k, v)} />;
          }
          if (typeof defVal === "string") {
            const long = k === "body" || k === "footnote" || defVal.length > 100;
            return long
              ? <LongTextField key={k} label={k} value={use ?? ""} onChange={(v) => set(k, v)} rows={long ? 4 : 2} />
              : <TextField key={k} label={k} value={use ?? ""} onChange={(v) => set(k, v)} placeholder={defVal} />;
          }
          if (Array.isArray(defVal) && defVal.every((x) => typeof x === "string")) {
            return <StringListField key={k} label={k} value={use ?? []} onChange={(v) => set(k, v)} />;
          }
          return null;
        })}
      </div>
    );
  };
}

function makeRender(sectionKey: ClinicalAiSectionKey) {
  return function Render({ data }: { data: SectionData }) {
    const defaults = CLINICAL_AI_DEFAULTS[sectionKey] as Record<string, any>;
    const heading = data?.heading ?? data?.headline ?? defaults.heading ?? defaults.headline ?? sectionKey;
    const eyebrow = data?.eyebrow ?? defaults.eyebrow;
    const body = data?.body ?? defaults.body;
    const itemCount = Array.isArray(data?.items) ? data.items.length
      : Array.isArray(defaults.items) ? defaults.items.length : 0;
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
  };
}

const DESCRIPTIONS: Record<ClinicalAiSectionKey, string> = {
  Hero: "Top hero — headline, CTAs, chips, background media.",
  Introduction: "Eyebrow + intro headline and body.",
  "The Problem": "Grid of problem cards with title/description/image.",
  "The Platform": "Feature grid with icon/title/description.",
  "How It Works": "Journey steps with icon/image/title/description.",
  Outcomes: "Stats grid with value + label.",
  Integrations: "Groups of tag chips (standards, capabilities…).",
  FAQ: "Expandable question/answer list.",
  "Final CTA": "Closing banner with headline, CTAs and media.",
};

export const CLINICAL_AI_KINDS = Object.keys(CLINICAL_AI_DEFAULTS) as ClinicalAiSectionKey[];

export const CLINICAL_AI_SECTION_DEFS: Record<string, SectionDef> = Object.fromEntries(
  CLINICAL_AI_KINDS.map((k) => [
    k,
    {
      kind: k,
      label: k,
      description: DESCRIPTIONS[k],
      defaultData: { section_name: k, ...(CLINICAL_AI_DEFAULTS[k] as any) },
      Render: makeRender(k),
      Edit: makeEdit(k),
    },
  ]),
);
