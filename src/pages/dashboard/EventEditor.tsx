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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";
import { RevisionsPanel } from "@/components/dashboard/RevisionsPanel";
import { LocaleTabs, LocaleHint, type EditorLocale } from "@/components/dashboard/LocaleTabs";

type Status = "draft" | "published" | "scheduled" | "trashed";

interface EvForm {
  title: string;
  slug: string;
  slug_ar: string;
  description: string;
  excerpt: string;
  event_type: string;
  starts_at: string | null;
  ends_at: string | null;
  location: string;
  virtual_link: string;
  registration_url: string;
  cover_image_url: string;
  status: Status;
  category_id: string | null;
  published_at: string | null;
  tags: string[];
}

const EMPTY: EvForm = {
  title: "", slug: "", slug_ar: "", description: "", excerpt: "", event_type: "webinar",
  starts_at: null, ends_at: null, location: "", virtual_link: "",
  registration_url: "", cover_image_url: "",
  status: "draft", category_id: null, published_at: null, tags: [],
};

const AR_FIELDS = ["title", "description", "excerpt", "location"] as const;

function toLocal(dt: string | null) {
  if (!dt) return "";
  const d = new Date(dt);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default function EventEditor() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [evId, setEvId] = useState<string | null>(isNew ? null : id!);
  const [previewToken, setPreviewToken] = useState<string | null>(null);
  const [form, setForm] = useState<EvForm>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugArTouched, setSlugArTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const dirtyRef = useRef(false);
  const [locale, setLocale] = useState<EditorLocale>("en");
  const [ar, setAr] = useState<Record<string, string>>({});
  const [translations, setTranslations] = useState<Record<string, any>>({});

  const categories = useQuery({
    queryKey: ["categories", "event"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("categories") as any).select("id, name").eq("content_type", "event").order("name");
      if (error) throw error;
      return data;
    },
  });

  const existing = useQuery({
    queryKey: ["event", evId],
    enabled: !!evId,
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", evId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (existing.data) {
      const d: any = existing.data;
      setForm({
        title: d.title ?? "", slug: d.slug ?? "", slug_ar: d.slug_ar ?? "",
        description: d.description ?? "", excerpt: d.excerpt ?? "",
        event_type: d.event_type ?? "webinar",
        starts_at: d.starts_at, ends_at: d.ends_at,
        location: d.location ?? "", virtual_link: d.virtual_link ?? "",
        registration_url: d.registration_url ?? "",
        cover_image_url: d.cover_image_url ?? "",
        status: d.status, category_id: d.category_id ?? null,
        published_at: d.published_at, tags: d.tags ?? [],
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

  function patch<K extends keyof EvForm>(key: K, value: EvForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    dirtyRef.current = true;
  }

  useEffect(() => {
    if (!slugTouched) setForm((f) => ({ ...f, slug: toSlug(f.title) }));
  }, [form.title, slugTouched]);

  useEffect(() => {
    if (!slugArTouched && ar.title) {
      setForm((f) => ({ ...f, slug_ar: toSlugAr(ar.title as string) }));
    }
  }, [ar.title, slugArTouched]);

  const canPublish = useMemo(
    () => form.title.trim().length > 0 && form.slug.trim().length > 0,
    [form]
  );

  const getV = (k: (typeof AR_FIELDS)[number]) =>
    locale === "ar" ? (ar[k] ?? "") : ((form as any)[k] ?? "");
  const setV = (k: (typeof AR_FIELDS)[number], v: string) => {
    if (locale === "ar") { setAr((x) => ({ ...x, [k]: v })); dirtyRef.current = true; }
    else patch(k as any, v as any);
  };

  async function save(opts?: { silent?: boolean; overrideStatus?: Status }) {
    if (!user) return;
    if (!form.title.trim()) { if (!opts?.silent) toast.error("Title is required"); return; }
    setSaving(true);
    const payload: any = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      slug_ar: form.slug_ar ? toSlugAr(form.slug_ar) : null,
      description: form.description || null,
      excerpt: form.excerpt || null,
      event_type: form.event_type,
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      location: form.location || null,
      virtual_link: form.virtual_link || null,
      registration_url: form.registration_url || null,
      cover_image_url: form.cover_image_url || null,
      status: opts?.overrideStatus ?? form.status,
      category_id: form.category_id || null,
      published_at: form.published_at,
      tags: form.tags,
      author_id: user.id,
      translations: { ...translations, ar },
    };
    try {
      let pid = evId;
      if (!pid) {
        const { data, error } = await supabase.from("events").insert(payload).select("id, preview_token").single();
        if (error) throw error;
        pid = data.id; setEvId(pid); setPreviewToken(data.preview_token ?? null);
        window.history.replaceState(null, "", `/dashboard/events/${pid}`);
      } else {
        const { error } = await supabase.from("events").update(payload).eq("id", pid);
        if (error) throw error;
      }
      if (opts?.overrideStatus) patch("status", opts.overrideStatus);
      dirtyRef.current = false;
      setLastSavedAt(new Date());
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["event", pid] });
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
  }, [form, ar]);

  function addTag(name: string) {
    const n = name.trim();
    if (!n || form.tags.includes(n)) return;
    patch("tags", [...form.tags, n]);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/events")}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <LocaleTabs locale={locale} onChange={setLocale} />
          {lastSavedAt && (
            <span className="text-xs text-muted-foreground">Saved {lastSavedAt.toLocaleTimeString()}</span>
          )}
          {form.status === "published" && form.slug && (
            <Button asChild variant="outline" size="sm">
              <a href={`/events/${form.slug}`} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-1 h-4 w-4" /> View live
              </a>
            </Button>
          )}
          {evId && previewToken && (
            <Button
              variant="outline" size="sm"
              onClick={() => {
                const url = `${window.location.origin}/preview/event/${evId}?token=${previewToken}`;
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
                <Label className="text-xs">{locale === "ar" ? "عنوان الفعالية" : "Event title"}</Label>
                <Input
                  value={getV("title")}
                  onChange={(e) => setV("title", e.target.value)}
                  placeholder={locale === "ar" ? "عنوان الفعالية" : "Event title"}
                  className="text-2xl font-semibold h-auto py-3"
                />
              </div>
              {locale === "en" ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>/events/</span>
                  <Input
                    value={form.slug}
                    onChange={(e) => { setSlugTouched(true); patch("slug", toSlug(e.target.value)); }}
                    className="h-8"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="ltr">
                  <span>/ar/events/</span>
                  <Input
                    value={form.slug_ar}
                    onChange={(e) => { setSlugArTouched(true); patch("slug_ar", e.target.value); }}
                    onBlur={(e) => patch("slug_ar", toSlugAr(e.target.value))}
                    placeholder="اسم-الفعالية-بالعربية"
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
            <TabsContent value="content" className="mt-3 space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
              <div className="space-y-2"><Label>Description</Label>
                <Textarea rows={6} value={getV("description")} onChange={(e) => setV("description", e.target.value)} />
              </div>
              {locale === "en" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2"><Label>Starts</Label>
                    <Input type="datetime-local" value={toLocal(form.starts_at)} onChange={(e) => patch("starts_at", e.target.value ? new Date(e.target.value).toISOString() : null)} />
                  </div>
                  <div className="space-y-2"><Label>Ends</Label>
                    <Input type="datetime-local" value={toLocal(form.ends_at)} onChange={(e) => patch("ends_at", e.target.value ? new Date(e.target.value).toISOString() : null)} />
                  </div>
                </div>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2"><Label>Location{locale === "ar" ? " (AR)" : ""}</Label>
                  <Input value={getV("location")} onChange={(e) => setV("location", e.target.value)} placeholder={locale === "ar" ? form.location : "City, venue"} />
                </div>
                {locale === "en" && (
                  <div className="space-y-2"><Label>Virtual link</Label>
                    <Input value={form.virtual_link} onChange={(e) => patch("virtual_link", e.target.value)} placeholder="https://…" />
                  </div>
                )}
              </div>
              {locale === "en" && (
                <div className="space-y-2"><Label>Registration URL</Label>
                  <Input value={form.registration_url} onChange={(e) => patch("registration_url", e.target.value)} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="excerpt" className="mt-3" dir={locale === "ar" ? "rtl" : "ltr"}>
              <Textarea
                rows={5}
                value={getV("excerpt")}
                onChange={(e) => setV("excerpt", e.target.value)}
                placeholder={locale === "ar" ? form.excerpt || "ملخص قصير…" : "Optional summary shown in listings…"}
              />
            </TabsContent>
            <TabsContent value="seo" className="mt-3">
              <SeoEditor
                entityType="event"
                entityId={evId}
                fallbackTitle={form.title}
                fallbackDescription={form.excerpt || form.description}
                publicUrl={form.slug ? `/events/${form.slug}` : ""}
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
                  value={toLocal(form.published_at)}
                  onChange={(e) => patch("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select value={form.event_type} onValueChange={(v) => patch("event_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
              {form.cover_image_url ? (
                <>
                  <img src={form.cover_image_url} alt="" className="w-full rounded-md border object-cover" />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>Change</Button>
                    <Button variant="ghost" size="sm" onClick={() => patch("cover_image_url", "")}>Remove</Button>
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
            entityType="event"
            entityId={evId}
            restorableFields={["title", "description", "excerpt", "cover_image_url"]}
            onRestore={(snap) => { setForm((f) => ({ ...f, ...snap })); dirtyRef.current = true; }}
          />
        </aside>
      </div>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => patch("cover_image_url", m.file_url)}
      />
    </div>
  );
}
