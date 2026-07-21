import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Search } from "lucide-react";

/**
 * Central "Page Titles" screen.
 * Lists every editable page (Homepage + all CMS pages) with EN/AR
 * meta title + description in one place. Writes to seo_meta.
 */

type Row = {
  key: string;                                // unique row key
  entity_type: "homepage" | "page";
  entity_id: string;
  label: string;                              // page name shown in the table
  path: string;                               // public path
  fallback_title: string;                     // page.title used as placeholder
  seo_id: string | null;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  dirty: boolean;
};

export default function PageTitles() {
  const qc = useQueryClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const pagesQ = useQuery({
    queryKey: ["page-titles:pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id,title,slug,translations")
        .order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const homepageQ = useQuery({
    queryKey: ["page-titles:homepage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_hero")
        .select("id")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const seoQ = useQuery({
    queryKey: ["page-titles:seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_meta")
        .select("id,entity_type,entity_id,meta_title,meta_description,translations")
        .in("entity_type", ["page", "homepage"]);
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (!pagesQ.data || !seoQ.data) return;
    const byKey = new Map(seoQ.data.map((s: any) => [`${s.entity_type}:${s.entity_id}`, s]));
    const list: Row[] = [];

    if (homepageQ.data?.id) {
      const s: any = byKey.get(`homepage:${homepageQ.data.id}`);
      const ar = (s?.translations as any)?.ar ?? {};
      list.push({
        key: `homepage:${homepageQ.data.id}`,
        entity_type: "homepage",
        entity_id: homepageQ.data.id,
        label: "Homepage",
        path: "/",
        fallback_title: "Homepage",
        seo_id: s?.id ?? null,
        title_en: s?.meta_title ?? "",
        title_ar: ar.meta_title ?? "",
        desc_en: s?.meta_description ?? "",
        desc_ar: ar.meta_description ?? "",
        dirty: false,
      });
    }

    for (const p of pagesQ.data) {
      const s: any = byKey.get(`page:${p.id}`);
      const ar = (s?.translations as any)?.ar ?? {};
      list.push({
        key: `page:${p.id}`,
        entity_type: "page",
        entity_id: p.id,
        label: p.title || p.slug || "Untitled",
        path: `/${p.slug}`,
        fallback_title: p.title ?? "",
        seo_id: s?.id ?? null,
        title_en: s?.meta_title ?? "",
        title_ar: ar.meta_title ?? "",
        desc_en: s?.meta_description ?? "",
        desc_ar: ar.meta_description ?? "",
        dirty: false,
      });
    }
    setRows(list);
  }, [pagesQ.data, seoQ.data, homepageQ.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q) ||
        r.title_en.toLowerCase().includes(q) ||
        r.title_ar.toLowerCase().includes(q),
    );
  }, [rows, query]);

  function patch(key: string, p: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...p, dirty: true } : r)));
  }

  async function saveRow(row: Row) {
    setSavingKey(row.key);
    try {
      const translations: any = {};
      if (row.title_ar || row.desc_ar) {
        translations.ar = {
          ...(row.title_ar ? { meta_title: row.title_ar } : {}),
          ...(row.desc_ar ? { meta_description: row.desc_ar } : {}),
        };
      }
      const payload: any = {
        entity_type: row.entity_type,
        entity_id: row.entity_id,
        meta_title: row.title_en || null,
        meta_description: row.desc_en || null,
        translations,
      };
      if (row.seo_id) {
        const { error } = await supabase.from("seo_meta").update(payload).eq("id", row.seo_id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("seo_meta")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, seo_id: data.id, dirty: false } : r)));
      }
      setRows((rs) => rs.map((r) => (r.key === row.key ? { ...r, dirty: false } : r)));
      qc.invalidateQueries({ queryKey: ["page-titles:seo"] });
      toast.success(`Saved “${row.label}”`);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSavingKey(null);
    }
  }

  async function saveAll() {
    const dirty = rows.filter((r) => r.dirty);
    if (dirty.length === 0) {
      toast.info("No unsaved changes");
      return;
    }
    for (const r of dirty) {
      // sequential to keep UI feedback simple
      // eslint-disable-next-line no-await-in-loop
      await saveRow(r);
    }
  }

  const dirtyCount = rows.filter((r) => r.dirty).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Page Titles</h1>
          <p className="text-sm text-muted-foreground">
            Edit the browser tab title and search description for every page in one place.
            Leave a field empty to fall back to the site default in Settings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute start-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages…"
              className="w-56 ps-8"
            />
          </div>
          <Button onClick={saveAll} disabled={dirtyCount === 0}>
            <Save className="me-1 h-4 w-4" />
            Save all{dirtyCount ? ` (${dirtyCount})` : ""}
          </Button>
        </div>
      </div>

      {(pagesQ.isLoading || seoQ.isLoading) && (
        <p className="text-sm text-muted-foreground">Loading pages…</p>
      )}

      <div className="grid gap-4">
        {filtered.map((row) => (
          <Card key={row.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{row.label}</CardTitle>
                  <p className="truncate text-xs text-muted-foreground">{row.path}</p>
                </div>
                <Button
                  size="sm"
                  variant={row.dirty ? "default" : "outline"}
                  disabled={!row.dirty || savingKey === row.key}
                  onClick={() => saveRow(row)}
                >
                  {savingKey === row.key ? "Saving…" : row.dirty ? "Save" : "Saved"}
                </Button>
              </div>
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
                      value={row.title_en}
                      onChange={(e) => patch(row.key, { title_en: e.target.value })}
                      placeholder={row.fallback_title || "Uses site default when empty"}
                      maxLength={70}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {row.title_en.length}/60 recommended
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description (EN)</Label>
                    <Textarea
                      rows={2}
                      value={row.desc_en}
                      onChange={(e) => patch(row.key, { desc_en: e.target.value })}
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
                      value={row.title_ar}
                      onChange={(e) => patch(row.key, { title_ar: e.target.value })}
                      placeholder="عنوان الصفحة بالعربية"
                      maxLength={70}
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {row.title_ar.length}/60 recommended
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">الوصف (AR)</Label>
                    <Textarea
                      dir="rtl"
                      rows={2}
                      value={row.desc_ar}
                      onChange={(e) => patch(row.key, { desc_ar: e.target.value })}
                      placeholder="يظهر في نتائج بحث Google"
                      maxLength={200}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}

        {!pagesQ.isLoading && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No pages match your search.</p>
        )}
      </div>
    </div>
  );
}
