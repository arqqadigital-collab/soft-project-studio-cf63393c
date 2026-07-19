import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Real brand colors used across the site — the ONLY colors editors should pick.
const BRAND_SWATCHES: { label: string; value: string }[] = [
  { label: "Brand blue", value: "#2b8fce" },
  { label: "Brand green", value: "#4bc16b" },
  { label: "Brand dark", value: "#101a33" },
  { label: "Page background", value: "#fafcfc" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "" },
];

export function BrandColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const norm = (value ?? "").toLowerCase();
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {BRAND_SWATCHES.map((s) => {
        const isActive = norm === s.value.toLowerCase();
        const isTransparent = s.value === "";
        return (
          <button
            key={s.label}
            type="button"
            title={s.label}
            onClick={() => onChange(s.value)}
            className={`h-8 w-8 rounded-md border transition-transform hover:scale-110 ${
              isActive ? "ring-2 ring-offset-2 ring-foreground" : "border-border"
            } ${isTransparent ? "bg-[conic-gradient(from_45deg,#ddd_25%,#fff_25%_50%,#ddd_50%_75%,#fff_75%)] bg-[length:8px_8px]" : ""}`}
            style={isTransparent ? undefined : { background: s.value }}
            aria-label={s.label}
          />
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground">{value || "transparent"}</span>
    </div>
  );
}

function isUrlKey(k: string) { return /_url$|^src$|^image$/i.test(k); }
function isColorKey(k: string) { return /_color$|_from$|_to$/i.test(k); }

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
          <video src={value} autoPlay muted loop playsInline className="max-h-24 rounded border bg-black" />
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
    return (
      <div className="space-y-1.5">
        <Label className="text-xs capitalize">{label}</Label>
        <BrandColorInput value={value ?? ""} onChange={onChange} />
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

function collectImages(data: any): string[] {
  const out = new Set<string>();
  const walk = (v: any) => {
    if (!v) return;
    if (typeof v === "string") {
      if (/^(https?:|\/|data:image)/.test(v) && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(v)) out.add(v);
      return;
    }
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") for (const k of Object.keys(v)) walk(v[k]);
  };
  walk(data);
  return Array.from(out);
}

export function SectionEditor({ sectionKey }: { sectionKey: SectionKey }) {
  const qc = useQueryClient();
  const [content, setContent] = useState<any>(DEFAULTS[sectionKey]);
  const [arContent, setArContent] = useState<any>(DEFAULTS[sectionKey]);
  const [visible, setVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");

  const { data, isLoading } = useQuery({
    queryKey: ["homepage-section-edit", sectionKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("content, is_visible, translations")
        .eq("section_key", sectionKey)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data !== undefined && data !== null) {
      const base = mergeDeep(structuredClone(DEFAULTS[sectionKey]), (data as any).content ?? {});
      const ar = mergeDeep(structuredClone(base), (data as any).translations?.ar ?? {});
      setContent(base);
      setArContent(ar);
      setVisible((data as any).is_visible !== false);
    }
  }, [data, sectionKey]);

  async function save() {
    setSaving(true);
    try {
      const existingTranslations = ((data as any)?.translations ?? {}) as Record<string, any>;
      const translations = { ...existingTranslations, ar: arContent };
      const { error } = await supabase
        .from("homepage_sections")
        .update({ content, translations, is_visible: visible })
        .eq("section_key", sectionKey);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["homepage-section", sectionKey] });
      qc.invalidateQueries({ queryKey: ["homepage-section-edit", sectionKey] });
      qc.invalidateQueries({ queryKey: ["homepage-sections-visibility"] });
      toast.success(`${LABELS[sectionKey]} saved`);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisible() {
    const next = !visible;
    setVisible(next);
    const { error } = await supabase
      .from("homepage_sections")
      .update({ is_visible: next })
      .eq("section_key", sectionKey);
    if (error) { toast.error(error.message); setVisible(!next); return; }
    qc.invalidateQueries({ queryKey: ["homepage-sections-visibility"] });
    toast.success(next ? "Section shown" : "Section hidden");
  }

  function resetToDefaults() {
    if (lang === "en") {
      setContent(structuredClone(DEFAULTS[sectionKey]));
    } else {
      setArContent(structuredClone(content));
    }
    toast.info("Reset — click Save to apply");
  }

  function copyEnglishToArabic() {
    setArContent(structuredClone(content));
    toast.info("Copied English into Arabic — translate and Save");
  }

  const activeContent = lang === "en" ? content : arContent;
  const setActive = lang === "en" ? setContent : setArContent;
  const images = useMemo(() => collectImages(activeContent), [activeContent]);

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">Edit the {LABELS[sectionKey]} section.</div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={toggleVisible}>
            {visible ? <><Eye className="mr-1 h-4 w-4" /> Visible</> : <><EyeOff className="mr-1 h-4 w-4" /> Hidden</>}
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            {lang === "en" ? "Reset defaults" : "Reset from English"}
          </Button>
          {lang === "ar" && (
            <Button variant="outline" size="sm" onClick={copyEnglishToArabic}>Copy from English</Button>
          )}
          <Button size="sm" onClick={save} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Tabs value={lang} onValueChange={(v) => setLang(v as "en" | "ar")}>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">Arabic (العربية)</TabsTrigger>
        </TabsList>
        <TabsContent value={lang} className="mt-3">
          <Card className={visible ? "" : "opacity-60"} dir={lang === "ar" ? "rtl" : "ltr"}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {LABELS[sectionKey]} — {lang === "en" ? "English" : "Arabic"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ObjectFields obj={activeContent} onChange={setActive} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {images.length > 0 && (
        <div className="rounded-md border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Images used in this section ({images.length})
          </div>
          <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
            {images.map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer" className="block">
                <img src={u} alt="" className="h-16 w-full rounded border object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
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
