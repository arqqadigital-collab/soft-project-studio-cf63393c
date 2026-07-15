import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { DEFAULTS, type SectionKey } from "@/lib/homepageContent";

const LABELS: Record<SectionKey, string> = {
  expertise: "Expertise",
  process: "Process",
  services: "Services",
  promise: "Promise",
  stats: "Stats",
  clients: "Clients",
  success_stories: "Success Stories",
  partners: "Partners",
  cta: "Call to action",
};

function isUrlKey(k: string) { return /_url$|^src$|^image$/i.test(k); }
function isColorKey(k: string) { return /_color$/i.test(k); }

function MediaField({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(value);
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2">
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-9" placeholder="https://…" />
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
      {value ? (
        isVideo ? (
          <video src={value} muted className="max-h-24 rounded border" />
        ) : (
          <img src={value} alt="" className="max-h-24 rounded border object-cover" />
        )
      ) : null}
      <MediaPickerDialog open={open} onOpenChange={setOpen} onPick={(m) => onChange(m.file_url)} />
    </div>
  );
}

function ScalarField({ k, value, onChange }: { k: string; value: any; onChange: (v: any) => void }) {
  const label = k.replace(/_/g, " ");
  if (isUrlKey(k)) return <MediaField label={label} value={value ?? ""} onChange={onChange} />;
  if (isColorKey(k)) {
    const hex6 = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
    return (
      <div className="space-y-1.5">
        <Label className="text-xs capitalize">{label}</Label>
        <div className="flex gap-2">
          <input type="color" value={hex6} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
          <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
        </div>
      </div>
    );
  }
  if (typeof value === "number") {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs capitalize">{label}</Label>
        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-9" />
      </div>
    );
  }
  const long = typeof value === "string" && value.length > 60;
  return (
    <div className="space-y-1.5">
      <Label className="text-xs capitalize">{label}</Label>
      {long ? (
        <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="h-9" />
      )}
    </div>
  );
}

function StringArrayField({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-xs capitalize">{label}</Label>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Input value={v} onChange={(e) => { const nv = [...values]; nv[i] = e.target.value; onChange(nv); }} className="h-9" />
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(values.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...values, ""])}>
        <Plus className="mr-1 h-4 w-4" /> Add
      </Button>
    </div>
  );
}

function ObjectFields({ obj, onChange }: { obj: any; onChange: (v: any) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {Object.entries(obj).map(([k, v]) => {
        if (Array.isArray(v)) {
          if (v.every((x) => typeof x === "string")) {
            return (
              <div key={k} className="sm:col-span-2">
                <StringArrayField label={k.replace(/_/g, " ")} values={v as string[]} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
              </div>
            );
          }
          return (
            <div key={k} className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs capitalize">{k.replace(/_/g, " ")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const template = v[0] ? Object.fromEntries(Object.keys(v[0]).map((kk) => [kk, ""])) : {};
                  onChange({ ...obj, [k]: [...v, template] });
                }}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              {(v as any[]).map((item, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ ...obj, [k]: v.filter((_, j) => j !== i) })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <ObjectFields
                    obj={item}
                    onChange={(nv) => { const arr = [...v]; arr[i] = nv; onChange({ ...obj, [k]: arr }); }}
                  />
                </div>
              ))}
            </div>
          );
        }
        if (v !== null && typeof v === "object") {
          return (
            <div key={k} className="sm:col-span-2 space-y-2 rounded-lg border bg-muted/30 p-3">
              <Label className="text-xs capitalize">{k.replace(/_/g, " ")}</Label>
              <ObjectFields obj={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
            </div>
          );
        }
        const isLong = typeof v === "string" && v.length > 60;
        return (
          <div key={k} className={isLong || isUrlKey(k) ? "sm:col-span-2" : ""}>
            <ScalarField k={k} value={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} />
          </div>
        );
      })}
    </div>
  );
}

export function SectionEditor({ sectionKey }: { sectionKey: SectionKey }) {
  const qc = useQueryClient();
  const [content, setContent] = useState<any>(DEFAULTS[sectionKey]);
  const [saving, setSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["homepage-section-edit", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("content")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return (data?.content ?? {}) as any;
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      // Merge stored content over defaults so new fields appear
      const merged = mergeDeep(structuredClone(DEFAULTS[sectionKey]), data);
      setContent(merged);
    }
  }, [data, sectionKey]);

  async function save() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("homepage_sections")
        .update({ content })
        .eq("section_key", sectionKey);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["homepage-section", sectionKey] });
      qc.invalidateQueries({ queryKey: ["homepage-section-edit", sectionKey] });
      toast.success(`${LABELS[sectionKey]} saved`);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function resetToDefaults() {
    setContent(structuredClone(DEFAULTS[sectionKey]));
    toast.info("Reset to defaults — click Save to apply");
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Edit the {LABELS[sectionKey]} section.</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults}>Reset defaults</Button>
          <Button size="sm" onClick={save} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">{LABELS[sectionKey]}</CardTitle></CardHeader>
        <CardContent>
          <ObjectFields obj={content} onChange={setContent} />
        </CardContent>
      </Card>
    </div>
  );
}

function mergeDeep(base: any, over: any): any {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return over ?? base;
  if (typeof base === "object" && typeof over === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(over)) out[k] = mergeDeep(base?.[k], over[k]);
    return out;
  }
  return over ?? base;
}
