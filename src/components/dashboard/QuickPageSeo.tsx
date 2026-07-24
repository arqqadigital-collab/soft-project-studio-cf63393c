import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

/**
 * Compact inline editor for browser-tab title and meta description.
 * Writes to the same `seo_meta` row that the full SEO tab and the
 * central Page Titles screen use, so all three stay in sync.
 */
interface Props {
  entityType: "page" | "homepage";
  entityId: string | null;
  fallbackTitle?: string;
}

interface Form {
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
}

const EMPTY: Form = { title_en: "", title_ar: "", desc_en: "", desc_ar: "" };

export function QuickPageSeo({ entityType, entityId, fallbackTitle = "" }: Props) {
  const qc = useQueryClient();
  const [form, setForm] = useState<Form>(EMPTY);
  const [rowId, setRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

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
      const ar = (d.translations || {}).ar || {};
      setRowId(d.id);
      setForm({
        title_en: d.meta_title ?? "",
        title_ar: ar.meta_title ?? "",
        desc_en: d.meta_description ?? "",
        desc_ar: ar.meta_description ?? "",
      });
      setDirty(false);
    } else if (existing.isFetched) {
      setRowId(null);
      setForm(EMPTY);
      setDirty(false);
    }
  }, [existing.data, existing.isFetched]);

  function patch<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  }

  async function save() {
    if (!entityId) {
      toast.error("Save the page first");
      return;
    }
    setSaving(true);
    try {
      const translations: any = {};
      if (form.title_ar || form.desc_ar) {
        translations.ar = {
          ...(form.title_ar ? { meta_title: form.title_ar } : {}),
          ...(form.desc_ar ? { meta_description: form.desc_ar } : {}),
        };
      }
      // Preserve other SEO fields (og_image, canonical, etc.) if row exists
      const base: any = (existing.data as any) ?? {};
      const payload: any = {
        entity_type: entityType,
        entity_id: entityId,
        meta_title: form.title_en || null,
        meta_description: form.desc_en || null,
        og_image_url: base.og_image_url ?? null,
        canonical_url: base.canonical_url ?? null,
        focus_keyword: base.focus_keyword ?? null,
        noindex: base.noindex ?? false,
        nofollow: base.nofollow ?? false,
        translations: {
          ...(base.translations ?? {}),
          ...translations,
        },
      };
      if (rowId) {
        const { error } = await supabase.from("seo_meta").update(payload).eq("id", rowId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("seo_meta").insert(payload).select("id").single();
        if (error) throw error;
        setRowId(data.id);
      }
      setDirty(false);
      qc.invalidateQueries({ queryKey: ["seo_meta", entityType, entityId] });
      qc.invalidateQueries({ queryKey: ["page-titles:seo"] });
      toast.success("Title & description saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-sm">Browser tab title & description</CardTitle>
          <p className="text-xs text-muted-foreground">
            What shows in browser tabs and Google. Leave empty to use the site default.
          </p>
        </div>
        <Button size="sm" variant={dirty ? "default" : "outline"} disabled={!dirty || saving} onClick={save}>
          <Save className="me-1 h-4 w-4" />
          {saving ? "Saving…" : dirty ? "Save" : "Saved"}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-3 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Title (EN)</Label>
              <Input
                value={form.title_en}
                onChange={(e) => patch("title_en", e.target.value)}
                placeholder={fallbackTitle || "Uses site default when empty"}
                maxLength={70}
              />
              <p className="text-[11px] text-muted-foreground">{form.title_en.length}/60 recommended</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description (EN)</Label>
              <Textarea
                rows={2}
                value={form.desc_en}
                onChange={(e) => patch("desc_en", e.target.value)}
                placeholder="Shown in Google search results"
                maxLength={200}
              />
            </div>
          </TabsContent>
          <TabsContent value="ar" className="space-y-3 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs">العنوان (AR)</Label>
              <Input
                dir="rtl"
                value={form.title_ar}
                onChange={(e) => patch("title_ar", e.target.value)}
                placeholder="عنوان الصفحة بالعربية"
                maxLength={70}
              />
              <p className="text-[11px] text-muted-foreground">{form.title_ar.length}/60 recommended</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">الوصف (AR)</Label>
              <Textarea
                dir="rtl"
                rows={2}
                value={form.desc_ar}
                onChange={(e) => patch("desc_ar", e.target.value)}
                placeholder="يظهر في نتائج بحث Google"
                maxLength={200}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
