import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Image as ImageIcon, ExternalLink, Eye, EyeOff, Sparkles, Loader2, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeoEditor } from "@/components/dashboard/SeoEditor";
import { SectionEditor, BrandColorInput } from "@/components/dashboard/SectionEditor";
import type { SectionKey } from "@/lib/homepageContent";

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "expertise", label: "Expertise" },
  { key: "process", label: "Process" },
  { key: "services", label: "Services" },
  { key: "promise", label: "Promise" },
  { key: "stats", label: "Stats" },
  { key: "clients", label: "Clients" },
  { key: "success_stories", label: "Success Stories" },
  { key: "partners", label: "Partners" },
  { key: "cta", label: "Call to action" },
];

type Size = "sm" | "md" | "lg" | "xl";
type Align = "left" | "center" | "right";
type VPos = "top" | "center" | "bottom";

interface HeroForm {
  heading_line1: string;
  heading_line2: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  background_url: string;
  background_type: "video" | "image";
  overlay_opacity: number;
  heading_line1_color: string;
  heading_line2_from: string;
  heading_line2_to: string;
  subheadline_color: string;
  cta_bg_from: string;
  cta_bg_to: string;
  cta_text_color: string;
  heading_size: Size;
  text_align: Align;
  vertical_position: VPos;
}

const EMPTY: HeroForm = {
  heading_line1: "",
  heading_line2: "",
  subheadline: "",
  cta_label: "",
  cta_href: "/contact",
  background_url: "",
  background_type: "video",
  overlay_opacity: 0.6,
  heading_line1_color: "#ffffff",
  heading_line2_from: "#3b82f6",
  heading_line2_to: "#22d3ee",
  subheadline_color: "#e5e7ebcc",
  cta_bg_from: "#3b82f6",
  cta_bg_to: "#22d3ee",
  cta_text_color: "#ffffff",
  heading_size: "lg",
  text_align: "center",
  vertical_position: "center",
};

function ColorField({
  label, value, onChange,
}: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <BrandColorInput value={value ?? ""} onChange={onChange} />
    </div>
  );
}

export default function HomepageEditor() {
  const qc = useQueryClient();
  const [form, setForm] = useState<HeroForm>(EMPTY);
  const [arForm, setArForm] = useState<Pick<HeroForm, "heading_line1" | "heading_line2" | "subheadline" | "cta_label">>({
    heading_line1: "", heading_line2: "", subheadline: "", cta_label: "",
  });
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [rowId, setRowId] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["homepage-hero"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_hero")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      const d: any = data;
      setRowId(d.id);
      setHeroVisible(d.is_visible !== false);
      setForm({
        heading_line1: d.heading_line1 ?? "",
        heading_line2: d.heading_line2 ?? "",
        subheadline: d.subheadline ?? "",
        cta_label: d.cta_label ?? "",
        cta_href: d.cta_href ?? "/contact",
        background_url: d.background_url ?? "",
        background_type: (d.background_type ?? "video") as "video" | "image",
        overlay_opacity: Number(d.overlay_opacity ?? 0.6),
        heading_line1_color: d.heading_line1_color ?? "#ffffff",
        heading_line2_from: d.heading_line2_from ?? "#3b82f6",
        heading_line2_to: d.heading_line2_to ?? "#22d3ee",
        subheadline_color: d.subheadline_color ?? "#e5e7ebcc",
        cta_bg_from: d.cta_bg_from ?? "#3b82f6",
        cta_bg_to: d.cta_bg_to ?? "#22d3ee",
        cta_text_color: d.cta_text_color ?? "#ffffff",
        heading_size: (d.heading_size ?? "lg") as Size,
        text_align: (d.text_align ?? "center") as Align,
        vertical_position: (d.vertical_position ?? "center") as VPos,
      });
      const ar = (d.translations?.ar ?? {}) as any;
      setArForm({
        heading_line1: ar.heading_line1 ?? "",
        heading_line2: ar.heading_line2 ?? "",
        subheadline: ar.subheadline ?? "",
        cta_label: ar.cta_label ?? "",
      });
    }
  }, [data]);

  function patch<K extends keyof HeroForm>(key: K, value: HeroForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function patchAr<K extends keyof typeof arForm>(key: K, value: string) {
    setArForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!rowId) return;
    setSaving(true);
    try {
      const existingTranslations = ((data as any)?.translations ?? {}) as Record<string, any>;
      const arClean = Object.fromEntries(Object.entries(arForm).filter(([, v]) => (v ?? "").toString().trim() !== ""));
      const translations = { ...existingTranslations, ar: { ...(existingTranslations.ar ?? {}), ...arClean } };
      const { error } = await supabase
        .from("homepage_hero")
        .update({
          ...form,
          is_visible: heroVisible,
          background_url: form.background_url || null,
          translations,
        })
        .eq("id", rowId);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["homepage-hero"] });
      qc.invalidateQueries({ queryKey: ["homepage-hero-public"] });
      toast.success("Homepage hero updated");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function translateHomepage(missingOnly: boolean) {
    const msg = missingOnly
      ? "Translate homepage hero + sections that are missing Arabic?"
      : "Auto-translate the entire homepage (hero + all sections) to Arabic? This OVERWRITES existing Arabic content.";
    if (!confirm(msg)) return;
    setTranslating(true);
    const t = toast.loading("Translating homepage to Arabic…");
    try {
      const { data: res, error } = await supabase.functions.invoke("translate-content", {
        body: { mode: "homepage", missingOnly },
      });
      if (error) {
        const detail = await (error as any)?.context?.text?.().catch(() => "");
        throw new Error(detail || (error as Error).message || "Edge function error");
      }
      const r = res as { ok: number; fail: number; total: number };
      toast.success(`Translated ${r.ok}/${r.total}${r.fail ? ` (${r.fail} failed)` : ""}`, { id: t });
      qc.invalidateQueries({ queryKey: ["homepage-hero"] });
      qc.invalidateQueries({ queryKey: ["homepage-hero-public"] });
      qc.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && String(q.queryKey[0]).startsWith("homepage-section") });
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed", { id: t });
    } finally {
      setTranslating(false);
    }
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Homepage</h1>
          <p className="text-sm text-muted-foreground">Edit the hero section shown at the top of the home page.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" /> View live
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={() => translateHomepage(true)} disabled={translating}>
            {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
            Fill missing AR
          </Button>
          <Button variant="outline" size="sm" onClick={() => translateHomepage(false)} disabled={translating}>
            {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
            Translate to Arabic
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="seo" className="mt-3">
          <SeoEditor
            entityType="homepage"
            entityId={rowId}
            fallbackTitle={form.heading_line1 || "Home"}
            fallbackDescription={form.subheadline}
            publicUrl="/"
          />
        </TabsContent>
        <TabsContent value="sections" className="mt-3">
        <Tabs defaultValue="hero">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            {SECTIONS.map((s) => (
              <TabsTrigger key={s.key} value={s.key}>{s.label}</TabsTrigger>
            ))}
          </TabsList>
          {SECTIONS.map((s) => (
            <TabsContent key={s.key} value={s.key} className="mt-3">
              <SectionEditor sectionKey={s.key} />
            </TabsContent>
          ))}
          <TabsContent value="hero" className="mt-3">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="inline-flex overflow-hidden rounded-md border">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold ${lang === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            <Languages className="h-3.5 w-3.5" /> EN
          </button>
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={`inline-flex items-center gap-1 border-s border-border px-3 py-1.5 text-xs font-semibold ${lang === "ar" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            AR — العربية
          </button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setHeroVisible((v) => !v)}>
          {heroVisible ? <><Eye className="mr-1 h-4 w-4" /> Hero visible</> : <><EyeOff className="mr-1 h-4 w-4" /> Hero hidden</>}
        </Button>
      </div>
      <div className={`grid gap-4 lg:grid-cols-[1fr_340px] ${heroVisible ? "" : "opacity-60"}`}>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">
              Text content {lang === "ar" ? "— العربية" : ""}
            </CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {lang === "ar" && (
                <p className="rounded-md border border-dashed p-2 text-xs text-muted-foreground">
                  Leave a field empty to fall back to the English value on the live site.
                </p>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Line 1</Label>
                {lang === "en"
                  ? <Input value={form.heading_line1} onChange={(e) => patch("heading_line1", e.target.value)} />
                  : <Input dir="rtl" value={arForm.heading_line1} onChange={(e) => patchAr("heading_line1", e.target.value)} placeholder={form.heading_line1} />}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Line 2 (gradient)</Label>
                {lang === "en"
                  ? <Input value={form.heading_line2} onChange={(e) => patch("heading_line2", e.target.value)} />
                  : <Input dir="rtl" value={arForm.heading_line2} onChange={(e) => patchAr("heading_line2", e.target.value)} placeholder={form.heading_line2} />}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subheadline</Label>
                {lang === "en"
                  ? <Textarea value={form.subheadline} onChange={(e) => patch("subheadline", e.target.value)} rows={3} />
                  : <Textarea dir="rtl" value={arForm.subheadline} onChange={(e) => patchAr("subheadline", e.target.value)} rows={3} placeholder={form.subheadline} />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Colors</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <ColorField label="Line 1 color" value={form.heading_line1_color} onChange={(v) => patch("heading_line1_color", v)} />
              <ColorField label="Subheadline color" value={form.subheadline_color} onChange={(v) => patch("subheadline_color", v)} />
              <ColorField label="Line 2 gradient start" value={form.heading_line2_from} onChange={(v) => patch("heading_line2_from", v)} />
              <ColorField label="Line 2 gradient end" value={form.heading_line2_to} onChange={(v) => patch("heading_line2_to", v)} />
              <ColorField label="Button gradient start" value={form.cta_bg_from} onChange={(v) => patch("cta_bg_from", v)} />
              <ColorField label="Button gradient end" value={form.cta_bg_to} onChange={(v) => patch("cta_bg_to", v)} />
              <ColorField label="Button text color" value={form.cta_text_color} onChange={(v) => patch("cta_text_color", v)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Size & position</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Heading size</Label>
                <Select value={form.heading_size} onValueChange={(v) => patch("heading_size", v as Size)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Text alignment</Label>
                <Select value={form.text_align} onValueChange={(v) => patch("text_align", v as Align)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Vertical position</Label>
                <Select value={form.vertical_position} onValueChange={(v) => patch("vertical_position", v as VPos)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Call to action button</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Button label</Label>
                {lang === "en"
                  ? <Input value={form.cta_label} onChange={(e) => patch("cta_label", e.target.value)} />
                  : <Input dir="rtl" value={arForm.cta_label} onChange={(e) => patchAr("cta_label", e.target.value)} placeholder={form.cta_label} />}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Button link (URL or path like /contact)</Label>
                <Input value={form.cta_href} onChange={(e) => patch("cta_href", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Background media</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select value={form.background_type} onValueChange={(v) => patch("background_type", v as "video" | "image")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.background_url ? (
                <>
                  {form.background_type === "video" ? (
                    <video
                      src={form.background_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                      className="w-full rounded-md border bg-black"
                    />
                  ) : (
                    <img src={form.background_url} alt="" className="w-full rounded-md border" />
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>Change</Button>
                    <Button variant="ghost" size="sm" onClick={() => patch("background_url", "")}>Remove</Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">Leave empty to use the built-in default video.</p>
                  <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)} className="w-full">
                    <ImageIcon className="mr-1 h-4 w-4" /> Choose from library
                  </Button>
                </>
              )}
              <div className="space-y-1.5 pt-2">
                <Label className="text-xs">
                  Overlay darkness ({Math.round(form.overlay_opacity * 100)}%)
                </Label>
                <Slider
                  value={[form.overlay_opacity * 100]}
                  onValueChange={(v) => patch("overlay_opacity", (v[0] ?? 0) / 100)}
                  max={100}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
        </TabsContent>
        </Tabs>
        </TabsContent>
      </Tabs>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => patch("background_url", m.file_url)}
      />
    </div>
  );
}
