import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Image as ImageIcon, Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toSlug, toSlugAr } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel,
} from "@/components/ui/select";

import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";
import { RevisionsPanel } from "@/components/dashboard/RevisionsPanel";
import { PageBuilder } from "@/components/dashboard/PageBuilder";
import ContactEditor from "@/pages/dashboard/ContactEditor";

type Status = "draft" | "published" | "trashed";
type Template = "default" | "full-width" | "landing";
type PageKind = "cms" | "coded";

interface PageForm {
  title: string;
  slug: string;
  content: string;
  featured_image_url: string;
  status: Status;
  template: Template;
  parent_id: string | null;
  menu_column_id: string | null;
  nav_label: string;
  page_kind: PageKind;
  route_path: string;
  title_ar: string;
  nav_label_ar: string;
  slug_ar: string;
}

const EMPTY: PageForm = {
  title: "",
  slug: "",
  content: "",
  featured_image_url: "",
  status: "draft",
  template: "default",
  parent_id: null,
  menu_column_id: null,
  nav_label: "",
  page_kind: "cms",
  route_path: "",
  title_ar: "",
  nav_label_ar: "",
  slug_ar: "",
};

function defaultRouteForSlug(slug: string): string {
  if (!slug) return "";
  return `/p/${slug}`;
}

export default function PageEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [pageId, setPageId] = useState<string | null>(isNew ? null : id!);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [form, setForm] = useState<PageForm>(() => {
    const c = searchParams.get("column");
    return c ? { ...EMPTY, menu_column_id: c } : EMPTY;
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [routeTouched, setRouteTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const dirtyRef = useRef(false);

  const otherPages = useQuery({
    queryKey: ["pages-parents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("id, title").order("title");
      if (error) throw error;
      return data;
    },
  });

  const menuTree = useQuery({
    queryKey: ["menu-columns-flat"],
    queryFn: async () => {
      const [g, c] = await Promise.all([
        supabase.from("menu_groups").select("id,label,position").order("position"),
        supabase.from("menu_columns").select("id,group_id,label,position").order("position"),
      ]);
      if (g.error) throw g.error;
      if (c.error) throw c.error;
      return { groups: g.data ?? [], columns: c.data ?? [] };
    },
  });

  const existing = useQuery({
    queryKey: ["page", pageId],
    enabled: !!pageId,
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").eq("id", pageId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing.data) {
      const d: any = existing.data;
      const ar = (d.translations && d.translations.ar) || {};
      setForm({
        title: d.title, slug: d.slug, content: d.content ?? "",
        featured_image_url: d.featured_image_url ?? "",
        status: d.status, template: d.template, parent_id: d.parent_id,
        menu_column_id: d.menu_column_id ?? null,
        nav_label: d.nav_label ?? "",
        page_kind: (d.page_kind as PageKind) ?? "cms",
        route_path: d.route_path ?? "",
        title_ar: ar.title ?? "",
        nav_label_ar: ar.nav_label ?? "",
        slug_ar: d.slug_ar ?? "",
      });
      setPreviewToken(d.preview_token ?? null);
      setSlugTouched(true);
      setRouteTouched(true);
      dirtyRef.current = false;
    }
  }, [existing.data]);

  function patch<K extends keyof PageForm>(key: K, value: PageForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    dirtyRef.current = true;
  }

  useEffect(() => {
    if (!slugTouched) setForm((f) => ({ ...f, slug: toSlug(f.title) }));
  }, [form.title, slugTouched]);

  useEffect(() => {
    if (!routeTouched && form.page_kind === "cms") {
      setForm((f) => ({ ...f, route_path: defaultRouteForSlug(f.slug) }));
    }
  }, [form.slug, form.page_kind, routeTouched]);

  const canPublish = useMemo(() => form.title.trim().length > 0, [form]);
  const parentChoices = useMemo(
    () => (otherPages.data ?? []).filter((p) => p.id !== pageId),
    [otherPages.data, pageId],
  );

  async function save(opts?: { silent?: boolean; overrideStatus?: Status }) {
    if (!user) return;
    if (!form.title.trim()) { if (!opts?.silent) toast.error("Title is required"); return; }
    setSaving(true);
    const existingTx = (existing.data as any)?.translations ?? {};
    const translations = {
      ...existingTx,
      ar: {
        ...(existingTx.ar ?? {}),
        title: form.title_ar || null,
        nav_label: form.nav_label_ar || null,
      },
    };
    const payload: any = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      content: form.content,
      featured_image_url: form.featured_image_url || null,
      status: opts?.overrideStatus ?? form.status,
      template: form.template,
      parent_id: form.parent_id,
      menu_column_id: form.menu_column_id,
      nav_label: form.nav_label || null,
      page_kind: form.page_kind,
      route_path: form.route_path || defaultRouteForSlug(form.slug || toSlug(form.title)),
      author_id: user.id,
      translations,
      slug_ar: form.slug_ar ? toSlugAr(form.slug_ar) : null,
    };
    try {
      let pid = pageId;
      if (!pid) {
        const { data, error } = await supabase.from("pages").insert(payload).select("id, preview_token").single();
        if (error) throw error;
        pid = data.id;
        setPageId(pid);
        setPreviewToken(data.preview_token ?? null);
        window.history.replaceState(null, "", `/dashboard/pages/${pid}`);
      } else {
        const { error } = await supabase.from("pages").update(payload).eq("id", pid);
        if (error) throw error;
      }
      if (opts?.overrideStatus) patch("status", opts.overrideStatus);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      qc.invalidateQueries({ queryKey: ["pages"] });
      qc.invalidateQueries({ queryKey: ["menu-tree"] });
      qc.invalidateQueries({ queryKey: ["page", pid] });
      if (!opts?.silent) toast.success("Saved");
    } catch (e: any) {
      if (!opts?.silent) toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const t = setInterval(() => {
      if (dirtyRef.current && form.title.trim()) save({ silent: true });
    }, 30_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const liveUrl = form.route_path || defaultRouteForSlug(form.slug);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/pages")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {lastSavedAt && <span className="text-xs text-muted-foreground">Saved {lastSavedAt.toLocaleTimeString()}</span>}
          {form.status === "published" && liveUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" /> View live
              </a>
            </Button>
          )}
          {pageId && previewToken && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `${window.location.origin}/preview/page/${pageId}?token=${previewToken}`;
                navigator.clipboard.writeText(url).catch(() => {});
                window.open(url, "_blank", "noreferrer");
                toast.success("Preview link copied");
              }}
            >
              <Eye className="mr-1 h-4 w-4" /> Preview draft
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => save()} disabled={saving}>
            <Save className="mr-1 h-4 w-4" /> Save Draft
          </Button>
          <Button size="sm" onClick={() => save({ overrideStatus: "published" })} disabled={saving || !canPublish}>
            <Send className="mr-1 h-4 w-4" /> {form.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Input
                value={form.title}
                onChange={(e) => patch("title", e.target.value)}
                placeholder="Page title (English)"
                className="border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center gap-2">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">AR</span>
                <Input
                  value={form.title_ar}
                  onChange={(e) => patch("title_ar", e.target.value)}
                  placeholder="عنوان الصفحة (بالعربية)"
                  dir="rtl"
                  className="border-none px-0 text-xl font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-14 shrink-0">slug</span>
                <Input
                  value={form.slug}
                  onChange={(e) => { setSlugTouched(true); patch("slug", toSlug(e.target.value)); }}
                  className="h-8"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-14 shrink-0">slug (AR)</span>
                <Input
                  value={form.slug_ar}
                  onChange={(e) => patch("slug_ar", e.target.value)}
                  onBlur={(e) => patch("slug_ar", toSlugAr(e.target.value))}
                  placeholder="من-نحن"
                  dir="rtl"
                  className="h-8"
                />
                {form.slug_ar && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground" dir="ltr">
                    /ar/{toSlugAr(form.slug_ar)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-14 shrink-0">URL</span>
                <Input
                  value={form.route_path}
                  onChange={(e) => { setRouteTouched(true); patch("route_path", e.target.value); }}
                  placeholder={defaultRouteForSlug(form.slug)}
                  className="h-8"
                  disabled={form.page_kind === "coded"}
                />
                {form.page_kind === "coded" && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] uppercase">coded</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="builder">
            <TabsList>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="mt-3">
              {form.slug === "contact" ? (
                <ContactEditor embedded />
              ) : pageId ? (
                <>
                  {form.page_kind === "coded" && (
                    <div className="mb-3 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                      This page is rendered by a React component at <code>{form.route_path}</code>. Editing a section here overrides the corresponding text in code; anything left blank falls back to the coded default.
                    </div>
                  )}
                  <PageBuilder pageId={pageId} pageSlug={form.slug} />
                </>
              ) : (
                <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Save the page first (title + draft) to start adding sections.
                </div>
              )}
            </TabsContent>
            <TabsContent value="seo" className="mt-3">
              <SeoEditor
                entityType="page"
                entityId={pageId}
                fallbackTitle={form.title}
                publicUrl={liveUrl}
              />
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Publish</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={(v) => patch("status", v as Status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="trashed">Trashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Structure</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Template</Label>
                <Select value={form.template} onValueChange={(v) => patch("template", v as Template)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="full-width">Full width</SelectItem>
                    <SelectItem value="landing">Landing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Menu location</Label>
                <Select
                  value={form.menu_column_id ?? "none"}
                  onValueChange={(v) => patch("menu_column_id", v === "none" ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned (not in menu)</SelectItem>
                    {(menuTree.data?.groups ?? []).map((g) => {
                      const cols = (menuTree.data?.columns ?? []).filter((c) => c.group_id === g.id);
                      if (!cols.length) return null;
                      return (
                        <SelectGroup key={g.id}>
                          <SelectLabel>{g.label}</SelectLabel>
                          {cols.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Where this page appears in the navbar. Leave unassigned to hide from menu.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nav label — English (optional)</Label>
                <Input
                  value={form.nav_label}
                  onChange={(e) => patch("nav_label", e.target.value)}
                  placeholder="Short label shown in the menu"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nav label — Arabic (optional)</Label>
                <Input
                  value={form.nav_label_ar}
                  onChange={(e) => patch("nav_label_ar", e.target.value)}
                  placeholder="التسمية في القائمة"
                  dir="rtl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Parent page</Label>
                <Select value={form.parent_id ?? "none"} onValueChange={(v) => patch("parent_id", v === "none" ? null : v)}>
                  <SelectTrigger><SelectValue placeholder="No parent" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No parent (top-level)</SelectItem>
                    {parentChoices.map((p) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Featured image</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {form.featured_image_url ? (
                <>
                  <img src={form.featured_image_url} alt="" className="w-full rounded-md border object-cover" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>Change</Button>
                    <Button variant="ghost" size="sm" onClick={() => patch("featured_image_url", "")}>Remove</Button>
                  </div>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)} className="w-full">
                  <ImageIcon className="mr-1 h-4 w-4" /> Choose from library
                </Button>
              )}
            </CardContent>
          </Card>

          <RevisionsPanel
            entityType="page"
            entityId={pageId}
            restorableFields={["title", "content", "featured_image_url"]}
            onRestore={(snap) => {
              setForm((f) => ({ ...f, ...snap }));
              dirtyRef.current = true;
            }}
          />
        </aside>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => patch("featured_image_url", m.file_url)}
      />
    </div>
  );
}
