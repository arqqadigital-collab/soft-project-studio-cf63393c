import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { DEFAULT_LABELS, type CardLabels } from "@/hooks/use-list-page-hero";

const LABEL_FIELD_META: Record<string, { label: string; hint?: string }> = {
  read_more: { label: "Read-more button", hint: 'e.g. "Read Article"' },
  see_more: { label: "See-more link", hint: 'e.g. "See more"' },
  min_read: { label: "Read-time suffix", hint: 'Shown after the number, e.g. "Min Read"' },
  minutes_suffix: { label: "Minutes suffix", hint: 'e.g. "Min"' },
  hours_suffix: { label: "Hours suffix", hint: 'e.g. "Hours"' },
  full_day: { label: "Full-day label", hint: 'Shown for all-day events' },
  latest_heading: { label: "Latest section heading" },
  loading: { label: "Loading message" },
  empty: { label: "Empty state message" },
  all_filter: { label: 'Filter chip: "All"' },
  tba: { label: 'Date TBA label' },
};


const PAGES = [
  { key: "blog", label: "Blog", url: "/blog" },
  { key: "case-studies", label: "Case Studies", url: "/case-studies" },
  { key: "events", label: "Events & Webinars", url: "/events" },
] as const;

type ArFields = {
  eyebrow?: string;
  title_prefix?: string;
  title_highlight?: string;
  description?: string;
};

type ArFields = {
  eyebrow?: string;
  title_prefix?: string;
  title_highlight?: string;
  description?: string;
  card_labels?: CardLabels;
};

type Row = {
  page_key: string;
  eyebrow: string | null;
  title_prefix: string | null;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
  card_labels: CardLabels;
  translations?: { ar?: ArFields } | null;
};

function Editor({ pageKey }: { pageKey: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["list_page_hero_edit", pageKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("list_page_hero")
        .select("*")
        .eq("page_key", pageKey)
        .maybeSingle();
      if (error) throw error;
      return data as Row | null;
    },
  });


  const [form, setForm] = useState<Row | null>(null);
  const [ar, setAr] = useState<ArFields>({});
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setAr((data.translations?.ar ?? {}) as ArFields);
    } else if (!isLoading) {
      setForm({
        page_key: pageKey,
        eyebrow: "",
        title_prefix: "",
        title_highlight: "",
        description: "",
        is_visible: true,
        translations: {},
      });
      setAr({});
    }
  }, [data, isLoading, pageKey]);

  if (!form) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const set = <K extends keyof Row>(k: K, v: Row[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const setArField = <K extends keyof ArFields>(k: K, v: string) =>
    setAr((a) => ({ ...a, [k]: v }));

  const save = async () => {
    setSaving(true);
    const payload = { ...form, translations: { ...(form.translations ?? {}), ar } };
    const { error } = await supabase
      .from("list_page_hero")
      .upsert(payload, { onConflict: "page_key" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["list_page_hero_edit", pageKey] });
    qc.invalidateQueries({ queryKey: ["list_page_hero", pageKey] });
  };

  const translate = async () => {
    setTranslating(true);
    try {
      const src = {
        eyebrow: form.eyebrow ?? "",
        title_prefix: form.title_prefix ?? "",
        title_highlight: form.title_highlight ?? "",
        description: form.description ?? "",
      };
      const { data: res, error } = await supabase.functions.invoke("translate-content", {
        body: { mode: "raw", payload: src },
      });
      if (error) throw error;
      const out = (res as any)?.ar ?? res;
      setAr(out);
      setLang("ar");
      toast.success("Translated to Arabic. Click Save.");
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  const val = (k: keyof ArFields, en: string | null) =>
    lang === "ar" ? (ar[k] ?? "") : (en ?? "");

  const onChange = (k: keyof ArFields, v: string) => {
    if (lang === "ar") setArField(k, v);
    else set(k as any, v as any);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Tabs value={lang} onValueChange={(v) => setLang(v as "en" | "ar")}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">Arabic (العربية)</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm" onClick={translate} disabled={translating}>
          {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
          Translate to Arabic
        </Button>
      </div>

      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <div className="font-medium">Show hero section</div>
          <div className="text-xs text-muted-foreground">Toggle the entire top hero on this page.</div>
        </div>
        <Switch checked={form.is_visible} onCheckedChange={(v) => set("is_visible", v)} />
      </div>

      <div className="space-y-2">
        <Label>Eyebrow {lang === "ar" && "(Arabic)"}</Label>
        <Input
          dir={lang === "ar" ? "rtl" : "ltr"}
          value={val("eyebrow", form.eyebrow)}
          onChange={(e) => onChange("eyebrow", e.target.value)}
          placeholder={lang === "ar" ? "رؤى وتحديثات" : "Insights & Updates"}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title — plain part</Label>
          <Input
            dir={lang === "ar" ? "rtl" : "ltr"}
            value={val("title_prefix", form.title_prefix)}
            onChange={(e) => onChange("title_prefix", e.target.value)}
            placeholder={lang === "ar" ? "مدونتنا" : "Our"}
          />
        </div>
        <div className="space-y-2">
          <Label>Title — highlighted part</Label>
          <Input
            dir={lang === "ar" ? "rtl" : "ltr"}
            value={val("title_highlight", form.title_highlight)}
            onChange={(e) => onChange("title_highlight", e.target.value)}
            placeholder={lang === "ar" ? "" : "Blog"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          dir={lang === "ar" ? "rtl" : "ltr"}
          rows={4}
          value={val("description", form.description)}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

export default function ListPageHeros() {
  const [params] = useSearchParams();
  const initial = PAGES.find((p) => p.key === params.get("page"))?.key ?? PAGES[0].key;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">List Page Heros</h1>
        <p className="text-sm text-muted-foreground">
          Edit the headline, eyebrow, and description shown at the top of the Blog, Case Studies, and Events pages. Use the English/Arabic tabs to manage both languages.
        </p>
      </div>
      <Tabs key={initial} defaultValue={initial}>
        <TabsList>
          {PAGES.map((p) => (
            <TabsTrigger key={p.key} value={p.key}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {PAGES.map((p) => (
          <TabsContent key={p.key} value={p.key} className="pt-4">
            <Editor pageKey={p.key} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
