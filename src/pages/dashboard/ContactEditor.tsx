import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Image as ImageIcon,
  Download,
  Mail,
  Phone,
  MapPin,
  Eye,
  Languages,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";

type QuickInfo = { icon: string; title: string; value: string; subtitle: string };
type Office = {
  id: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  image_url: string | null;
  position: number;
  translations?: any;
};
type Area = { id: string; label: string; position: number; is_active: boolean; translations?: any };
type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  consent: boolean;
  status: string;
  created_at: string;
};
type Loc = "en" | "ar";

function LocaleToggle({ locale, onChange }: { locale: Loc; onChange: (l: Loc) => void }) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-border">
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        <Languages className="h-3.5 w-3.5" /> EN
      </button>
      <button
        type="button"
        onClick={() => onChange("ar")}
        className={`inline-flex items-center gap-1 border-s border-border px-3 py-1.5 text-xs font-semibold ${locale === "ar" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
      >
        AR — العربية
      </button>
    </div>
  );
}

export default function ContactEditor({ embedded = false }: { embedded?: boolean } = {}) {
  const [locale, setLocale] = useState<Loc>("en");
  const [translating, setTranslating] = useState(false);
  const qc = useQueryClient();

  async function autoTranslate(missingOnly = false) {
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { mode: "contact", missingOnly },
      });
      if (error) throw error;
      const d: any = data ?? {};
      toast.success(`Translated ${d.ok ?? 0}/${d.total ?? 0}${d.fail ? ` — ${d.fail} failed` : ""}`);
      qc.invalidateQueries({ queryKey: ["contact_page_admin"] });
      qc.invalidateQueries({ queryKey: ["contact_offices_admin"] });
      qc.invalidateQueries({ queryKey: ["contact_areas_admin"] });
      qc.invalidateQueries({ queryKey: ["contact_page_public"] });
      qc.invalidateQueries({ queryKey: ["contact_offices_public"] });
      qc.invalidateQueries({ queryKey: ["contact_areas_public"] });
      setLocale("ar");
    } catch (e: any) {
      toast.error(e.message || "Translate failed");
    } finally {
      setTranslating(false);
    }
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <LocaleToggle locale={locale} onChange={setLocale} />
      <Button size="sm" variant="outline" onClick={() => autoTranslate(false)} disabled={translating}>
        {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Languages className="mr-1 h-4 w-4" />}
        Translate to Arabic
      </Button>
      <Button size="sm" variant="ghost" onClick={() => autoTranslate(true)} disabled={translating}>
        Fill missing AR
      </Button>
      {!embedded && (
        <Button asChild variant="outline" size="sm">
          <a href="/contact" target="_blank" rel="noreferrer">
            <ExternalLink className="mr-1 h-4 w-4" /> View live
          </a>
        </Button>
      )}
    </div>
  );

  const body = (
    <Tabs defaultValue="content">
      <TabsList className="flex-wrap">
        <TabsTrigger value="content">Page content</TabsTrigger>
        <TabsTrigger value="offices">Offices</TabsTrigger>
        <TabsTrigger value="areas">Inquiry areas</TabsTrigger>
        <TabsTrigger value="submissions">Submissions</TabsTrigger>
        {!embedded && <TabsTrigger value="seo">SEO</TabsTrigger>}
      </TabsList>

      <TabsContent value="content" className="mt-4">
        <PageContentTab locale={locale} />
      </TabsContent>
      <TabsContent value="offices" className="mt-4">
        <OfficesTab locale={locale} />
      </TabsContent>
      <TabsContent value="areas" className="mt-4">
        <AreasTab locale={locale} />
      </TabsContent>
      <TabsContent value="submissions" className="mt-4">
        <SubmissionsTab />
      </TabsContent>
      {!embedded && (
        <TabsContent value="seo" className="mt-4">
          <SeoTab />
        </TabsContent>
      )}
    </Tabs>
  );

  if (embedded) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
          <div className="font-medium text-foreground">Contact page sections</div>
          {toolbar}
        </div>
        {body}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Contact page</h1>
          <p className="text-sm text-muted-foreground">
            Manage the /contact page content, offices, form options, submissions and SEO.
          </p>
        </div>
        {toolbar}
      </div>
      {body}
    </div>
  );
}

/* ---------------- Page content ---------------- */

type PageFields = {
  hero_eyebrow: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_cta_label: string;
  hero_cta_href: string;
  hero_background_url: string;
  form_heading: string;
  form_subheading: string;
  form_submit_label: string;
  offices_heading: string;
  offices_subheading: string;
  notification_email: string;
  quick_info: QuickInfo[];
};

const EMPTY_PAGE: PageFields = {
  hero_eyebrow: "",
  hero_headline: "",
  hero_subheadline: "",
  hero_cta_label: "",
  hero_cta_href: "",
  hero_background_url: "",
  form_heading: "",
  form_subheading: "",
  form_submit_label: "",
  offices_heading: "",
  offices_subheading: "",
  notification_email: "",
  quick_info: [],
};

function PageContentTab({ locale }: { locale: Loc }) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [en, setEn] = useState<PageFields>(EMPTY_PAGE);
  const [ar, setAr] = useState<Partial<PageFields>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["contact_page_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_page")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    const d: any = data;
    setId(d.id);
    setEn({
      hero_eyebrow: d.hero_eyebrow ?? "",
      hero_headline: d.hero_headline ?? "",
      hero_subheadline: d.hero_subheadline ?? "",
      hero_cta_label: d.hero_cta_label ?? "",
      hero_cta_href: d.hero_cta_href ?? "",
      hero_background_url: d.hero_background_url ?? "",
      form_heading: d.form_heading ?? "",
      form_subheading: d.form_subheading ?? "",
      form_submit_label: d.form_submit_label ?? "",
      offices_heading: d.offices_heading ?? "",
      offices_subheading: d.offices_subheading ?? "",
      notification_email: d.notification_email ?? "",
      quick_info: Array.isArray(d.quick_info) ? (d.quick_info as QuickInfo[]) : [],
    });
    const arObj = (d.translations?.ar ?? {}) as Partial<PageFields>;
    setAr(arObj);
  }, [data]);

  // Text field binding helpers — non-translatable fields always use EN.
  const NON_TRANSLATABLE = new Set(["hero_cta_href", "hero_background_url", "notification_email"]);
  function V(k: keyof PageFields): string {
    if (locale === "ar" && !NON_TRANSLATABLE.has(k as string)) {
      const v = (ar as any)[k];
      return typeof v === "string" ? v : "";
    }
    return (en as any)[k] ?? "";
  }
  function setV(k: keyof PageFields, v: string) {
    if (locale === "ar" && !NON_TRANSLATABLE.has(k as string)) {
      setAr((prev) => ({ ...prev, [k]: v }));
    } else {
      setEn((prev) => ({ ...prev, [k]: v }));
    }
  }

  // Quick info card binding
  const arCards: QuickInfo[] = Array.isArray((ar as any).quick_info) ? (ar as any).quick_info : [];
  function cardVal(i: number, field: keyof QuickInfo): string {
    if (locale === "ar" && field !== "icon") {
      const v = arCards[i]?.[field];
      return typeof v === "string" ? v : "";
    }
    return (en.quick_info[i]?.[field] as string) ?? "";
  }
  function updateCard(i: number, patch: Partial<QuickInfo>) {
    if (locale === "ar") {
      // AR overlay: icon stays in EN; only text fields overlay
      setAr((prev) => {
        const list = Array.isArray((prev as any).quick_info) ? [...(prev as any).quick_info] : [];
        while (list.length <= i) list.push({ icon: "", title: "", value: "", subtitle: "" });
        list[i] = { ...list[i], ...patch };
        return { ...prev, quick_info: list } as any;
      });
      // If icon changed while in AR view, still update EN icon.
      if (patch.icon !== undefined) {
        setEn((prev) => ({
          ...prev,
          quick_info: prev.quick_info.map((c, idx) => (idx === i ? { ...c, icon: patch.icon! } : c)),
        }));
      }
    } else {
      setEn((prev) => ({
        ...prev,
        quick_info: prev.quick_info.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
      }));
    }
  }
  function addCard() {
    setEn((prev) => ({
      ...prev,
      quick_info: [...prev.quick_info, { icon: "mail", title: "", value: "", subtitle: "" }],
    }));
  }
  function removeCard(i: number) {
    setEn((prev) => ({ ...prev, quick_info: prev.quick_info.filter((_, idx) => idx !== i) }));
    setAr((prev) => {
      const list = Array.isArray((prev as any).quick_info) ? [...(prev as any).quick_info] : [];
      list.splice(i, 1);
      return { ...prev, quick_info: list } as any;
    });
  }
  function moveCard(i: number, dir: -1 | 1) {
    const t = i + dir;
    if (t < 0 || t >= en.quick_info.length) return;
    setEn((prev) => {
      const next = [...prev.quick_info];
      [next[i], next[t]] = [next[t], next[i]];
      return { ...prev, quick_info: next };
    });
    setAr((prev) => {
      const list = Array.isArray((prev as any).quick_info) ? [...(prev as any).quick_info] : [];
      if (list[i] || list[t]) {
        while (list.length <= Math.max(i, t)) list.push({ icon: "", title: "", value: "", subtitle: "" });
        [list[i], list[t]] = [list[t], list[i]];
      }
      return { ...prev, quick_info: list } as any;
    });
  }

  async function save() {
    if (!id) return;
    setSaving(true);
    try {
      // Fetch current translations, merge our ar overlay in
      const { data: existing } = await supabase
        .from("contact_page").select("translations").eq("id", id).maybeSingle();
      const prevTr = ((existing as any)?.translations ?? {}) as Record<string, any>;
      const nextTranslations = { ...prevTr, ar: { ...(prevTr.ar ?? {}), ...ar } };

      const { error } = await supabase
        .from("contact_page")
        .update({
          hero_eyebrow: en.hero_eyebrow,
          hero_headline: en.hero_headline,
          hero_subheadline: en.hero_subheadline,
          hero_background_url: en.hero_background_url || null,
          hero_cta_label: en.hero_cta_label,
          hero_cta_href: en.hero_cta_href,
          form_heading: en.form_heading,
          form_subheading: en.form_subheading,
          form_submit_label: en.form_submit_label,
          offices_heading: en.offices_heading,
          offices_subheading: en.offices_subheading,
          notification_email: en.notification_email.trim() || null,
          quick_info: en.quick_info as any,
          translations: nextTranslations as any,
        } as any)
        .eq("id", id);
      if (error) throw error;
      toast.success("Contact page saved");
      qc.invalidateQueries({ queryKey: ["contact_page_admin"] });
      qc.invalidateQueries({ queryKey: ["contact_page_public"] });
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {locale === "ar" && (
          <p className="text-xs text-muted-foreground">
            Editing Arabic overlay. Empty fields fall back to English.
          </p>
        )}
        <div className="ms-auto">
          <Button onClick={save} disabled={saving} size="sm">
            <Save className="mr-1 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Labeled label="Eyebrow"><Input dir={dir} value={V("hero_eyebrow")} onChange={(e) => setV("hero_eyebrow", e.target.value)} /></Labeled>
            <Labeled label="CTA label"><Input dir={dir} value={V("hero_cta_label")} onChange={(e) => setV("hero_cta_label", e.target.value)} /></Labeled>
          </div>
          <Labeled label="Headline"><Input dir={dir} value={V("hero_headline")} onChange={(e) => setV("hero_headline", e.target.value)} /></Labeled>
          <Labeled label="Subheadline"><Textarea dir={dir} rows={2} value={V("hero_subheadline")} onChange={(e) => setV("hero_subheadline", e.target.value)} /></Labeled>
          <Labeled label="CTA link"><Input value={V("hero_cta_href")} onChange={(e) => setV("hero_cta_href", e.target.value)} placeholder="#contact-form" /></Labeled>
          <Labeled label="Background image">
            <div className="flex items-center gap-2">
              <Input value={V("hero_background_url")} onChange={(e) => setV("hero_background_url", e.target.value)} placeholder="https://…" />
              <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                <ImageIcon className="mr-1 h-4 w-4" /> Pick
              </Button>
            </div>
            {V("hero_background_url") && (
              <img src={V("hero_background_url")} alt="" className="mt-2 h-24 rounded-md object-cover" />
            )}
          </Labeled>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Form section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Labeled label="Heading"><Input dir={dir} value={V("form_heading")} onChange={(e) => setV("form_heading", e.target.value)} /></Labeled>
          <Labeled label="Subheading"><Input dir={dir} value={V("form_subheading")} onChange={(e) => setV("form_subheading", e.target.value)} /></Labeled>
          <Labeled label="Submit button label"><Input dir={dir} value={V("form_submit_label")} onChange={(e) => setV("form_submit_label", e.target.value)} /></Labeled>
          <Labeled label="Notification email (where new submissions are sent)">
            <Input
              type="email"
              value={V("notification_email")}
              onChange={(e) => setV("notification_email", e.target.value)}
              placeholder="sbs@sbs-me.com"
            />
          </Labeled>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Quick info cards</span>
            {locale === "en" && (
              <Button size="sm" variant="outline" onClick={addCard}>
                <Plus className="mr-1 h-4 w-4" /> Add card
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {en.quick_info.length === 0 && (
            <p className="text-sm text-muted-foreground">No cards yet.</p>
          )}
          {en.quick_info.map((_c, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="secondary">Card {i + 1}</Badge>
                {locale === "en" && (
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => moveCard(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => moveCard(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => removeCard(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <Labeled label="Icon">
                  <Select value={en.quick_info[i].icon} onValueChange={(v) => updateCard(i, { icon: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mail">Mail</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="map-pin">Map pin</SelectItem>
                    </SelectContent>
                  </Select>
                </Labeled>
                <Labeled label="Title (small)"><Input dir={dir} value={cardVal(i, "title")} onChange={(e) => updateCard(i, { title: e.target.value })} /></Labeled>
                <Labeled label="Value (big)"><Input dir={dir} value={cardVal(i, "value")} onChange={(e) => updateCard(i, { value: e.target.value })} /></Labeled>
                <Labeled label="Subtitle"><Input dir={dir} value={cardVal(i, "subtitle")} onChange={(e) => updateCard(i, { subtitle: e.target.value })} /></Labeled>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Offices section header</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Labeled label="Heading"><Input dir={dir} value={V("offices_heading")} onChange={(e) => setV("offices_heading", e.target.value)} /></Labeled>
          <Labeled label="Subheading"><Textarea dir={dir} rows={2} value={V("offices_subheading")} onChange={(e) => setV("offices_subheading", e.target.value)} /></Labeled>
        </CardContent>
      </Card>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => setV("hero_background_url", m.file_url)}
      />
    </div>
  );
}

/* ---------------- Offices ---------------- */

function OfficesTab({ locale }: { locale: Loc }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Office | null>(null);
  const [editingAr, setEditingAr] = useState<{ city?: string; address?: string }>({});
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["contact_offices_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_offices")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Office[];
    },
  });

  const offices = data ?? [];
  const dir = locale === "ar" ? "rtl" : "ltr";

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["contact_offices_admin"] });
    qc.invalidateQueries({ queryKey: ["contact_offices_public"] });
  }

  async function move(i: number, dir: -1 | 1) {
    const t = i + dir;
    if (t < 0 || t >= offices.length) return;
    const a = offices[i], b = offices[t];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("contact_offices").update({ position: b.position }).eq("id", a.id),
      supabase.from("contact_offices").update({ position: a.position }).eq("id", b.id),
    ]);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    invalidate();
  }

  async function remove(id: string, city: string) {
    if (!confirm(`Delete "${city}"?`)) return;
    const { error } = await supabase.from("contact_offices").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    invalidate();
  }

  function newOffice() {
    const nextPos = offices.length ? Math.max(...offices.map((o) => o.position)) + 1 : 1;
    setEditing({ id: "", city: "", address: "", phone: "", email: "", image_url: "", position: nextPos });
    setEditingAr({});
  }
  function openEdit(o: Office) {
    setEditing(o);
    setEditingAr((o.translations?.ar ?? {}) as any);
  }

  async function saveOffice() {
    if (!editing) return;
    const prevTr = (editing.translations ?? {}) as Record<string, any>;
    const nextTr = { ...prevTr, ar: { ...(prevTr.ar ?? {}), ...editingAr } };
    const payload = {
      city: editing.city,
      address: editing.address,
      phone: editing.phone,
      email: editing.email,
      image_url: editing.image_url || null,
      position: editing.position,
      translations: nextTr as any,
    };
    const { error } = editing.id
      ? await supabase.from("contact_offices").update(payload).eq("id", editing.id)
      : await supabase.from("contact_offices").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    setEditingAr({});
    invalidate();
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={newOffice}><Plus className="mr-1 h-4 w-4" /> Add office</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {offices.map((o, i) => {
              const arCity = o.translations?.ar?.city;
              const arAddr = o.translations?.ar?.address;
              const displayCity = locale === "ar" && arCity ? arCity : o.city;
              const displayAddr = locale === "ar" && arAddr ? arAddr : o.address;
              return (
                <div key={o.id} className="flex items-center gap-4 p-4">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {o.image_url && <img src={o.image_url} alt={displayCity} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1" dir={dir}>
                    <div className="truncate font-medium">{displayCity}</div>
                    <div className="truncate text-xs text-muted-foreground">{displayAddr}</div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => openEdit(o)}>Edit</Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(o.id, o.city)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
            {offices.length === 0 && <div className="p-6 text-sm text-muted-foreground">No offices yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(o) => { if (!o) { setEditing(null); setEditingAr({}); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit office" : "Add office"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Labeled label="City (English)"><Input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} /></Labeled>
              <Labeled label="City (العربية)"><Input dir="rtl" value={editingAr.city ?? ""} onChange={(e) => setEditingAr({ ...editingAr, city: e.target.value })} placeholder="اتركه فارغًا للاحتفاظ بالإنجليزية" /></Labeled>
              <Labeled label="Address (English)"><Textarea rows={2} value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></Labeled>
              <Labeled label="Address (العربية)"><Textarea dir="rtl" rows={2} value={editingAr.address ?? ""} onChange={(e) => setEditingAr({ ...editingAr, address: e.target.value })} /></Labeled>
              <div className="grid gap-3 md:grid-cols-2">
                <Labeled label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Labeled>
                <Labeled label="Email"><Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Labeled>
              </div>
              <Labeled label="Image URL">
                <div className="flex gap-2">
                  <Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} />
                  <Button type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
                    <ImageIcon className="mr-1 h-4 w-4" /> Pick
                  </Button>
                </div>
                {editing.image_url && <img src={editing.image_url} alt="" className="mt-2 h-24 rounded-md object-cover" />}
              </Labeled>
              <Labeled label="Position (order)">
                <Input type="number" value={editing.position} onChange={(e) => setEditing({ ...editing, position: Number(e.target.value) })} />
              </Labeled>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditing(null); setEditingAr({}); }}>Cancel</Button>
            <Button onClick={saveOffice}><Save className="mr-1 h-4 w-4" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onPick={(m) => editing && setEditing({ ...editing, image_url: m.file_url })}
      />
    </div>
  );
}

/* ---------------- Inquiry Areas ---------------- */

export function AreasTab({ locale }: { locale: Loc }) {
  const qc = useQueryClient();
  const [newLabel, setNewLabel] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["contact_areas_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_inquiry_areas")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Area[];
    },
  });

  const areas = data ?? [];

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["contact_areas_admin"] });
    qc.invalidateQueries({ queryKey: ["contact_areas_public"] });
  }

  async function add() {
    const label = newLabel.trim();
    if (!label) return;
    const nextPos = areas.length ? Math.max(...areas.map((a) => a.position)) + 1 : 1;
    const { error } = await supabase.from("contact_inquiry_areas").insert({ label, position: nextPos });
    if (error) return toast.error(error.message);
    setNewLabel("");
    invalidate();
  }

  async function updateLabel(a: Area, value: string) {
    if (locale === "ar") {
      const prevTr = (a.translations ?? {}) as Record<string, any>;
      const nextTr = { ...prevTr, ar: { ...(prevTr.ar ?? {}), label: value } };
      const { error } = await supabase.from("contact_inquiry_areas").update({ translations: nextTr as any }).eq("id", a.id);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("contact_inquiry_areas").update({ label: value }).eq("id", a.id);
      if (error) return toast.error(error.message);
    }
    invalidate();
  }

  async function updateActive(a: Area, is_active: boolean) {
    const { error } = await supabase.from("contact_inquiry_areas").update({ is_active }).eq("id", a.id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return;
    const { error } = await supabase.from("contact_inquiry_areas").delete().eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function move(i: number, dir: -1 | 1) {
    const t = i + dir;
    if (t < 0 || t >= areas.length) return;
    const a = areas[i], b = areas[t];
    await Promise.all([
      supabase.from("contact_inquiry_areas").update({ position: b.position }).eq("id", a.id),
      supabase.from("contact_inquiry_areas").update({ position: a.position }).eq("id", b.id),
    ]);
    invalidate();
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Dropdown options {locale === "ar" && <span className="ms-2 text-xs font-normal text-muted-foreground">(editing Arabic labels)</span>}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {locale === "en" && (
            <div className="flex gap-2">
              <Input placeholder="New inquiry area…" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
              <Button onClick={add}><Plus className="mr-1 h-4 w-4" /> Add</Button>
            </div>
          )}
          <div className="divide-y rounded-md border">
            {areas.map((a, i) => {
              const value = locale === "ar" ? (a.translations?.ar?.label ?? "") : a.label;
              return (
                <div key={a.id} className="flex items-center gap-3 p-3">
                  <Input
                    dir={dir}
                    value={value}
                    placeholder={locale === "ar" ? a.label : ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      // optimistic UI: mutate local cache
                      if (locale === "ar") {
                        a.translations = { ...(a.translations ?? {}), ar: { ...(a.translations?.ar ?? {}), label: v } };
                      } else {
                        a.label = v;
                      }
                      qc.setQueryData(["contact_areas_admin"], [...areas]);
                    }}
                    onBlur={(e) => updateLabel(a, e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Switch checked={a.is_active} onCheckedChange={(v) => updateActive(a, v)} />
                    <span className="text-xs text-muted-foreground">{a.is_active ? "Active" : "Hidden"}</span>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(a.id, a.label)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              );
            })}
            {areas.length === 0 && <div className="p-4 text-sm text-muted-foreground">No options yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Submissions ---------------- */

function SubmissionsTab() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "archived">("all");
  const [viewing, setViewing] = useState<Submission | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["contact_submissions", statusFilter],
    queryFn: async () => {
      let q = supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(500);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Submission[];
    },
  });

  const submissions = data ?? [];
  const newCount = useMemo(
    () => submissions.filter((s) => s.status === "new").length,
    [submissions],
  );

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["contact_submissions"] });
  }

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    if (viewing?.id === id) setViewing(null);
    invalidate();
  }

  function exportCsv() {
    const header = ["Date", "Name", "Email", "Phone", "Area", "Message", "Status"];
    const rows = submissions.map((s) => [
      new Date(s.created_at).toISOString(),
      s.name,
      s.email,
      s.phone,
      s.area,
      s.message.replace(/\n/g, " "),
      s.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contact-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {newCount > 0 && <Badge>{newCount} new</Badge>}
        </div>
        <Button size="sm" variant="outline" onClick={exportCsv}>
          <Download className="mr-1 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Loading…</div>
          ) : submissions.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No submissions.</div>
          ) : (
            <div className="divide-y">
              {submissions.map((s) => (
                <div key={s.id} className="flex flex-wrap items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{s.name}</span>
                      {s.status === "new" && <Badge variant="default">new</Badge>}
                      {s.status === "read" && <Badge variant="secondary">read</Badge>}
                      {s.status === "archived" && <Badge variant="outline">archived</Badge>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</span>
                      {s.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{s.phone}</span>}
                      {s.area && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{s.area}</span>}
                      <span>{new Date(s.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setViewing(s); if (s.status === "new") setStatus(s.id, "read"); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {s.status !== "archived" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(s.id, "archived")}>Archive</Button>
                    )}
                    {s.status === "archived" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(s.id, "new")}>Restore</Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Submission</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <Row k="Name" v={viewing.name} />
              <Row k="Email" v={<a className="underline" href={`mailto:${viewing.email}`}>{viewing.email}</a>} />
              <Row k="Phone" v={viewing.phone} />
              <Row k="Area" v={viewing.area} />
              <Row k="Consent" v={viewing.consent ? "Yes" : "No"} />
              <Row k="Received" v={new Date(viewing.created_at).toLocaleString()} />
              <div>
                <div className="mb-1 text-xs font-medium text-muted-foreground">Message</div>
                <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3">{viewing.message || "(empty)"}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3">
      <div className="text-xs text-muted-foreground">{k}</div>
      <div>{v}</div>
    </div>
  );
}

/* ---------------- SEO ---------------- */

function SeoTab() {
  const { data } = useQuery({
    queryKey: ["contact_page_seo_id"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_page")
        .select("id")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <SeoEditor
      entityType="page"
      entityId={data?.id ?? null}
      fallbackTitle="Contact Us"
      fallbackDescription="Get in touch with our team."
      publicUrl="/contact"
    />
  );
}

/* ---------------- Small helpers ---------------- */

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
