import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Image as ImageIcon, ExternalLink } from "lucide-react";
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

interface HeroForm {
  heading_line1: string;
  heading_line2: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  background_url: string;
  background_type: "video" | "image";
  overlay_opacity: number;
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
};

export default function HomepageEditor() {
  const qc = useQueryClient();
  const [form, setForm] = useState<HeroForm>(EMPTY);
  const [rowId, setRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
      setForm({
        heading_line1: d.heading_line1 ?? "",
        heading_line2: d.heading_line2 ?? "",
        subheadline: d.subheadline ?? "",
        cta_label: d.cta_label ?? "",
        cta_href: d.cta_href ?? "/contact",
        background_url: d.background_url ?? "",
        background_type: (d.background_type ?? "video") as "video" | "image",
        overlay_opacity: Number(d.overlay_opacity ?? 0.6),
      });
    }
  }, [data]);

  function patch<K extends keyof HeroForm>(key: K, value: HeroForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!rowId) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("homepage_hero")
        .update({
          heading_line1: form.heading_line1,
          heading_line2: form.heading_line2,
          subheadline: form.subheadline,
          cta_label: form.cta_label,
          cta_href: form.cta_href,
          background_url: form.background_url || null,
          background_type: form.background_type,
          overlay_opacity: form.overlay_opacity,
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

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Homepage</h1>
          <p className="text-sm text-muted-foreground">Edit the hero section shown at the top of the home page.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 h-4 w-4" /> View live
            </a>
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Headline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Line 1 (white)</Label>
                <Input value={form.heading_line1} onChange={(e) => patch("heading_line1", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Line 2 (gradient)</Label>
                <Input value={form.heading_line2} onChange={(e) => patch("heading_line2", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subheadline</Label>
                <Textarea
                  value={form.subheadline}
                  onChange={(e) => patch("subheadline", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Call to action button</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Button label</Label>
                <Input value={form.cta_label} onChange={(e) => patch("cta_label", e.target.value)} />
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
                <Select
                  value={form.background_type}
                  onValueChange={(v) => patch("background_type", v as "video" | "image")}
                >
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
                    <video src={form.background_url} muted className="w-full rounded-md border" />
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
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use the built-in default video.
                  </p>
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

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => patch("background_url", m.file_url)}
      />
    </div>
  );
}
