import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Save, Send, ExternalLink, Image as ImageIcon, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toSlug, toSlugAr } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";
import { RevisionsPanel } from "@/components/dashboard/RevisionsPanel";
import { LocaleTabs, LocaleHint, type EditorLocale } from "@/components/dashboard/LocaleTabs";

type Status = "draft" | "published" | "scheduled" | "trashed";

interface PostForm {
  title: string;
  slug: string;
  slug_ar: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  status: Status;
  category_id: string | null;
  published_at: string | null; // ISO
  tags: string[]; // tag names (creatable)
}

const EMPTY: PostForm = {
  title: "",
  slug: "",
  slug_ar: "",
  content: "",
  excerpt: "",
  featured_image_url: "",
  status: "draft",
  category_id: null,
  published_at: null,
  tags: [],
};

export default function PostEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [postId, setPostId] = useState<string | null>(isNew ? null : id!);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [form, setForm] = useState<PostForm>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugArTouched, setSlugArTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const dirtyRef = useRef(false);
  const [locale, setLocale] = useState<EditorLocale>("en");
  const [ar, setAr] = useState<{ title?: string; excerpt?: string; content?: string }>({});
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load categories
  const categories = useQuery({
    queryKey: ["categories", "blog"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("categories") as any).select("id, name").eq("content_type", "blog").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Load existing post
  const existing = useQuery({
    queryKey: ["post", postId],
    enabled: !!postId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_tags(tag_id, tags(name))")
        .eq("id", postId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing.data) {
      const d: any = existing.data;
      setForm({
        title: d.title ?? "",
        slug: d.slug ?? "",
        slug_ar: d.slug_ar ?? "",
        content: d.content ?? "",
        excerpt: d.excerpt ?? "",
        featured_image_url: d.featured_image_url ?? "",
        status: d.status,
        category_id: d.category_id,
        published_at: d.published_at,
        tags: (d.post_tags ?? []).map((pt: any) => pt.tags?.name).filter(Boolean),
      });
      setPreviewToken(d.preview_token ?? null);
      setSlugTouched(true);
      if (d.slug_ar) setSlugArTouched(true);
      dirtyRef.current = false;
      const t = (d.translations ?? {}) as Record<string, any>;
      setTranslations(t);
      setAr((t.ar ?? {}) as any);
    }
  }, [existing.data]);

  function patch<K extends keyof PostForm>(key: K, value: PostForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    dirtyRef.current = true;
  }

  // Auto-slug from title until user edits slug manually
  useEffect(() => {
    if (!slugTouched) {
      setForm((f) => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, slugTouched]);

  // Auto-generate Arabic slug from Arabic title until user edits it manually
  useEffect(() => {
    if (!slugArTouched && ar.title) {
      setForm((f) => ({ ...f, slug_ar: toSlugAr(ar.title as string) }));
    }
  }, [ar.title, slugArTouched]);

  const canPublish = useMemo(() => form.title.trim().length > 0 && form.slug.trim().length > 0, [form]);

  async function upsertTagsAndLink(pid: string, names: string[]) {
    // Remove all links then re-create to keep logic simple
    await supabase.from("post_tags").delete().eq("post_id", pid);
    if (!names.length) return;
    const clean = Array.from(new Set(names.map((n) => n.trim()).filter(Boolean)));
    // upsert tags one at a time to avoid slug collisions
    const tagRows: { id: string }[] = [];
    for (const name of clean) {
      const slug = toSlug(name);
      const { data: existingTag } = await supabase.from("tags").select("id").eq("slug", slug).maybeSingle();
      if (existingTag) { tagRows.push({ id: existingTag.id }); continue; }
      const { data: created, error } = await supabase.from("tags").insert({ name, slug }).select("id").single();
      if (error) throw error;
      tagRows.push({ id: created.id });
    }
    await supabase.from("post_tags").insert(tagRows.map((t) => ({ post_id: pid, tag_id: t.id })));
  }

  async function save(opts?: { silent?: boolean; overrideStatus?: Status }) {
    if (!user) return;
    if (!form.title.trim()) {
      if (!opts?.silent) toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload: any = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      slug_ar: form.slug_ar ? toSlugAr(form.slug_ar) : null,
      content: form.content,
      excerpt: form.excerpt || null,
      featured_image_url: form.featured_image_url || null,
      status: opts?.overrideStatus ?? form.status,
      category_id: form.category_id || null,
      published_at: form.published_at,
      author_id: user.id,
      translations: { ...translations, ar },
    };
    try {
      let pid = postId;
      if (!pid) {
        const { data, error } = await supabase.from("posts").insert(payload).select("id, preview_token").single();
        if (error) throw error;
        pid = data.id;
        setPostId(pid);
        setPreviewToken(data.preview_token ?? null);
        window.history.replaceState(null, "", `/dashboard/posts/${pid}`);
      } else {
        const { error } = await supabase.from("posts").update(payload).eq("id", pid);
        if (error) throw error;
      }
      await upsertTagsAndLink(pid!, form.tags);
      if (opts?.overrideStatus) patch("status", opts.overrideStatus);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      qc.invalidateQueries({ queryKey: ["posts"] });
      qc.invalidateQueries({ queryKey: ["post", pid] });
      if (!opts?.silent) toast.success("Saved");
    } catch (e: any) {
      if (!opts?.silent) toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  // Autosave every 30s if dirty and we have a title
  useEffect(() => {
    const t = setInterval(() => {
      if (dirtyRef.current && form.title.trim()) save({ silent: true });
    }, 30_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  function addTag(name: string) {
    const n = name.trim();
    if (!n || form.tags.includes(n)) return;
    patch("tags", [...form.tags, n]);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/posts")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <LocaleTabs locale={locale} onChange={setLocale} />
          {lastSavedAt && (
            <span className="text-xs text-muted-foreground">
              Saved {lastSavedAt.toLocaleTimeString()}
            </span>
          )}
          {form.status === "published" && form.slug && (
            <Button asChild variant="outline" size="sm">
              <a href={`/blog/${form.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" /> View live
              </a>
            </Button>
          )}
          {postId && previewToken && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = `${window.location.origin}/preview/post/${postId}?token=${previewToken}`;
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

      <LocaleHint locale={locale} />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6" dir={locale === "ar" ? "rtl" : "ltr"}>
              <div className="space-y-1.5">
                <Label className="text-xs">{locale === "ar" ? "عنوان المقال" : "Post title"}</Label>
                <Input
                  value={locale === "ar" ? (ar.title ?? "") : form.title}
                  onChange={(e) => {
                    if (locale === "ar") { setAr((x) => ({ ...x, title: e.target.value })); dirtyRef.current = true; }
                    else patch("title", e.target.value);
                  }}
                  placeholder={locale === "ar" ? "عنوان المقال" : "Post title"}
                  className="text-2xl font-semibold h-auto py-3"
                />
              </div>
              {locale === "en" ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/blog/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => { setSlugTouched(true); patch("slug", toSlug(e.target.value)); }}
                    className="h-8"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="ltr">
                  <span>/ar/blog/</span>
                  <Input
                    value={form.slug_ar}
                    onChange={(e) => { setSlugArTouched(true); patch("slug_ar", e.target.value); }}
                    onBlur={(e) => patch("slug_ar", toSlugAr(e.target.value))}
                    placeholder="اسم-المقال-بالعربية"
                    className="h-8"
                    dir="rtl"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="excerpt">Excerpt</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="mt-3" dir={locale === "ar" ? "rtl" : "ltr"}>
              <RichTextEditor
                key={locale}
                value={locale === "ar" ? (ar.content ?? "") : form.content}
                onChange={(html) => {
                  if (locale === "ar") { setAr((x) => ({ ...x, content: html })); dirtyRef.current = true; }
                  else patch("content", html);
                }}
              />
            </TabsContent>
            <TabsContent value="excerpt" className="mt-3" dir={locale === "ar" ? "rtl" : "ltr"}>
              <Textarea
                rows={5}
                value={locale === "ar" ? (ar.excerpt ?? "") : form.excerpt}
                onChange={(e) => {
                  if (locale === "ar") { setAr((x) => ({ ...x, excerpt: e.target.value })); dirtyRef.current = true; }
                  else patch("excerpt", e.target.value);
                }}
                placeholder={locale === "ar" ? form.excerpt || "ملخص المقال…" : "Optional summary shown in post lists…"}
              />
            </TabsContent>
            <TabsContent value="seo" className="mt-3">
              <SeoEditor
                entityType="post"
                entityId={postId}
                fallbackTitle={form.title}
                fallbackDescription={form.excerpt}
                publicUrl={form.slug ? `/blog/${form.slug}` : ""}
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
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="trashed">Trashed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Publish date</Label>
                <Input
                  type="datetime-local"
                  value={(() => {
                    if (!form.published_at) return "";
                    const d = new Date(form.published_at);
                    const tzOffset = d.getTimezoneOffset() * 60000;
                    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
                  })()}
                  onChange={(e) => patch("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Category</CardTitle></CardHeader>
            <CardContent>
              <Select value={form.category_id ?? "none"} onValueChange={(v) => patch("category_id", v === "none" ? null : v)}>
                <SelectTrigger><SelectValue placeholder="Uncategorized" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.data?.map((c: { id: string; name: string }) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            entityType="post"
            entityId={postId}
            restorableFields={["title", "content", "excerpt", "featured_image_url"]}
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
