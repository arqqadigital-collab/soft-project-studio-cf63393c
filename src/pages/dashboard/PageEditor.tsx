import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, Image as ImageIcon, Eye, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";
import { RevisionsPanel } from "@/components/dashboard/RevisionsPanel";
import { PageBuilder } from "@/components/dashboard/PageBuilder";

type Status = "draft" | "published" | "trashed";
type Template = "default" | "full-width" | "landing";

interface PageForm {
  title: string;
  slug: string;
  content: string;
  featured_image_url: string;
  status: Status;
  template: Template;
  parent_id: string | null;
  section_id: string | null;
  nav_label: string;
}

const EMPTY: PageForm = {
  title: "",
  slug: "",
  content: "",
  featured_image_url: "",
  status: "draft",
  template: "default",
  parent_id: null,
  section_id: null,
  nav_label: "",
};

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
    const s = searchParams.get("section");
    return s ? { ...EMPTY, section_id: s } : EMPTY;
  });
  const [slugTouched, setSlugTouched] = useState(false);
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

  const navTree = useQuery({
    queryKey: ["nav-sections-flat"],
    queryFn: async () => {
      const [g, s] = await Promise.all([
        supabase.from("nav_groups").select("id,label,position").order("position"),
        supabase.from("nav_sections").select("id,group_id,label,position").order("position"),
      ]);
      if (g.error) throw g.error;
      if (s.error) throw s.error;
      return { groups: g.data ?? [], sections: s.data ?? [] };
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
      setForm({
        title: d.title, slug: d.slug, content: d.content ?? "",
        featured_image_url: d.featured_image_url ?? "",
        status: d.status, template: d.template, parent_id: d.parent_id,
        section_id: d.section_id ?? null,
        nav_label: d.nav_label ?? "",
      });
      setPreviewToken(d.preview_token ?? null);
      setSlugTouched(true);
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

  const canPublish = useMemo(() => form.title.trim().length > 0, [form]);
  const parentChoices = useMemo(
    () => (otherPages.data ?? []).filter((p) => p.id !== pageId),
    [otherPages.data, pageId],
  );

  async function save(opts?: { silent?: boolean; overrideStatus?: Status }) {
    if (!user) return;
    if (!form.title.trim()) { if (!opts?.silent) toast.error("Title is required"); return; }
    setSaving(true);
    const payload: any = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      content: form.content,
      featured_image_url: form.featured_image_url || null,
      status: opts?.overrideStatus ?? form.status,
      template: form.template,
      parent_id: form.parent_id,
      section_id: form.section_id,
      nav_label: form.nav_label || null,
      author_id: user.id,
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
      qc.invalidateQueries({ queryKey: ["nav-tree"] });
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

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/pages")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          {lastSavedAt && <span className="text-xs text-muted-foreground">Saved {lastSavedAt.toLocaleTimeString()}</span>}
          {form.status === "published" && form.slug && (
            <Button asChild variant="outline" size="sm">
              <a href={`/p/${form.slug}`} target="_blank" rel="noreferrer">
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
                placeholder="Page title"
                className="border-none px-0 text-2xl font-semibold shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>/p/</span>
                <Input
                  value={form.slug}
                  onChange={(e) => { setSlugTouched(true); patch("slug", toSlug(e.target.value)); }}
                  className="h-8"
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="builder">
            <TabsList>
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="content">Rich text</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="builder" className="mt-3">
              {pageId ? (
                <PageBuilder pageId={pageId} />
              ) : (
                <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">
                  Save the page first (title + draft) to start adding sections.
                </div>
              )}
            </TabsContent>
            <TabsContent value="content" className="mt-3">
              <RichTextEditor value={form.content} onChange={(html) => patch("content", html)} />
              <p className="mt-2 text-xs text-muted-foreground">
                Only used when this page has no builder sections.
              </p>
            </TabsContent>
            <TabsContent value="seo" className="mt-3">
              <SeoEditor
                entityType="page"
                entityId={pageId}
                fallbackTitle={form.title}
                publicUrl={form.slug ? `/p/${form.slug}` : ""}
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
                <Label className="text-xs">Nav section</Label>
                <Select
                  value={form.section_id ?? "none"}
                  onValueChange={(v) => patch("section_id", v === "none" ? null : v)}
                >
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {(navTree.data?.groups ?? []).map((g) => {
                      const secs = (navTree.data?.sections ?? []).filter((s) => s.group_id === g.id);
                      if (!secs.length) return null;
                      return (
                        <SelectGroup key={g.id}>
                          <SelectLabel>{g.label}</SelectLabel>
                          {secs.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Where this page appears in the mega menu.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Nav label (optional)</Label>
                <Input
                  value={form.nav_label}
                  onChange={(e) => patch("nav_label", e.target.value)}
                  placeholder="Short label shown in the menu"
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
