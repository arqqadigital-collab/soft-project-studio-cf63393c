import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Image as ImageIcon, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";

type EntityType = "post" | "page" | "homepage" | "case_study" | "event";

interface Props {
  entityType: EntityType;
  entityId: string | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  publicUrl?: string;
}

interface SeoForm {
  meta_title: string;
  meta_description: string;
  og_image_url: string;
  canonical_url: string;
  focus_keyword: string;
  noindex: boolean;
  nofollow: boolean;
  meta_title_ar: string;
  meta_description_ar: string;
}

const EMPTY: SeoForm = {
  meta_title: "",
  meta_description: "",
  og_image_url: "",
  canonical_url: "",
  focus_keyword: "",
  noindex: false,
  nofollow: false,
  meta_title_ar: "",
  meta_description_ar: "",
};

export function SeoEditor({
  entityType,
  entityId,
  fallbackTitle = "",
  fallbackDescription = "",
  publicUrl = "",
}: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<SeoForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  const existing = useQuery({
    queryKey: ["seo_meta", entityType, entityId],
    enabled: !!entityId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_meta")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing.data) {
      const d: any = existing.data;
      const tr = (d.translations || {}) as any;
      const ar = tr.ar || {};
      setRowId(d.id);
      setForm({
        meta_title: d.meta_title ?? "",
        meta_description: d.meta_description ?? "",
        og_image_url: d.og_image_url ?? "",
        canonical_url: d.canonical_url ?? "",
        focus_keyword: d.focus_keyword ?? "",
        noindex: !!d.noindex,
        nofollow: !!d.nofollow,
        meta_title_ar: ar.meta_title ?? "",
        meta_description_ar: ar.meta_description ?? "",
      });
    } else if (existing.isFetched) {
      setRowId(null);
      setForm(EMPTY);
    }
  }, [existing.data, existing.isFetched]);

  function patch<K extends keyof SeoForm>(k: K, v: SeoForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    if (!entityId) {
      toast.error("Save the draft first, then add SEO");
      return;
    }
    setSaving(true);
    try {
      const translations: any = {};
      if (form.meta_title_ar || form.meta_description_ar) {
        translations.ar = {
          ...(form.meta_title_ar ? { meta_title: form.meta_title_ar } : {}),
          ...(form.meta_description_ar ? { meta_description: form.meta_description_ar } : {}),
        };
      }
      const payload = {
        entity_type: entityType,
        entity_id: entityId,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        og_image_url: form.og_image_url || null,
        canonical_url: form.canonical_url || null,
        focus_keyword: form.focus_keyword || null,
        noindex: form.noindex,
        nofollow: form.nofollow,
        translations,
      } as any;
      if (rowId) {
        const { error } = await supabase.from("seo_meta").update(payload).eq("id", rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("seo_meta").insert(payload).select("id").single();
        if (error) throw error;
        setRowId(data.id);
      }
      qc.invalidateQueries({ queryKey: ["seo_meta", entityType, entityId] });
      toast.success("SEO saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const title = form.meta_title || fallbackTitle || "Untitled";
  const desc = form.meta_description || fallbackDescription || "No description yet.";
  const url = form.canonical_url || publicUrl || "example.com/…";
  const titleLen = form.meta_title.length;
  const descLen = form.meta_description.length;

  if (!entityId) {
    return (
      <Card>
        <CardContent className="pt-6 text-sm text-muted-foreground">
          Save the draft first to unlock the SEO editor.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Search engine listing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Meta title (EN)</Label>
                <Input
                  value={form.meta_title}
                  onChange={(e) => patch("meta_title", e.target.value)}
                  placeholder={fallbackTitle || "Overrides the page title"}
                  maxLength={70}
                />
                <p className={`text-xs ${titleLen > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                  {titleLen}/60 recommended
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Meta description (EN)</Label>
                <Textarea
                  rows={3}
                  value={form.meta_description}
                  onChange={(e) => patch("meta_description", e.target.value)}
                  placeholder="Shown in Google search results"
                  maxLength={200}
                />
                <p className={`text-xs ${descLen > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                  {descLen}/160 recommended
                </p>
              </div>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">عنوان الميتا (AR)</Label>
                <Input
                  dir="rtl"
                  value={form.meta_title_ar}
                  onChange={(e) => patch("meta_title_ar", e.target.value)}
                  placeholder="عنوان الصفحة بالعربية"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground">{form.meta_title_ar.length}/60 recommended</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">وصف الميتا (AR)</Label>
                <Textarea
                  dir="rtl"
                  rows={3}
                  value={form.meta_description_ar}
                  onChange={(e) => patch("meta_description_ar", e.target.value)}
                  placeholder="يظهر في نتائج بحث Google"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{form.meta_description_ar.length}/160 recommended</p>
              </div>
            </TabsContent>
          </Tabs>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Focus keyword</Label>
              <Input
                value={form.focus_keyword}
                onChange={(e) => patch("focus_keyword", e.target.value)}
                placeholder="Primary keyword"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Canonical URL</Label>
              <Input
                value={form.canonical_url}
                onChange={(e) => patch("canonical_url", e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Social preview image</Label>
            {form.og_image_url ? (
              <div className="space-y-2">
                <img src={form.og_image_url} alt="" className="w-full max-w-sm rounded-md border object-cover" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>Change</Button>
                  <Button variant="ghost" size="sm" onClick={() => patch("og_image_url", "")}>Remove</Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                <ImageIcon className="mr-1 h-4 w-4" /> Choose from library
              </Button>
            )}
          </div>

          <div className="space-y-2 rounded-md border p-3">
            <p className="text-xs font-medium">Search engine indexing</p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs">Hide from search engines (noindex)</Label>
                <p className="text-[11px] text-muted-foreground">Prevents Google and others from listing this page.</p>
              </div>
              <Switch checked={form.noindex} onCheckedChange={(v) => patch("noindex", v)} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <Label className="text-xs">Don't follow links (nofollow)</Label>
                <p className="text-[11px] text-muted-foreground">Tells crawlers not to follow outbound links from this page.</p>
              </div>
              <Switch checked={form.nofollow} onCheckedChange={(v) => patch("nofollow", v)} />
            </div>
          </div>

          <Button onClick={save} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save SEO
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Google preview</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            <p className="truncate text-xs text-muted-foreground">{url}</p>
            <p className="line-clamp-1 text-base text-primary underline">{title}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{desc}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Social preview</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {form.og_image_url ? (
              <img src={form.og_image_url} alt="" className="aspect-video w-full rounded-md border object-cover" />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                No image set
              </div>
            )}
            <p className="line-clamp-2 text-sm font-medium">{title}</p>
            <p className="line-clamp-2 text-xs text-muted-foreground">{desc}</p>
          </CardContent>
        </Card>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => patch("og_image_url", m.file_url)}
      />
    </div>
  );
}
