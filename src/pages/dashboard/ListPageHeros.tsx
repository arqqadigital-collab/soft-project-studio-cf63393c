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
  detail_back: { label: "Detail — back link", hint: 'e.g. "Back to Blog", "All events"' },
  detail_by_prefix: { label: "Detail — author prefix", hint: 'Shown before the author name, e.g. "By"' },
  detail_no_content: { label: "Detail — empty body message" },
  detail_not_found_title: { label: "Detail — not-found title" },
  detail_not_found_desc: { label: "Detail — not-found description" },
  detail_not_found_link: { label: "Detail — not-found back link" },
  detail_ends_prefix: { label: "Detail — end-time prefix", hint: 'e.g. "Ends"' },
  detail_register: { label: "Detail — register button" },
  detail_join_online: { label: "Detail — join-online button" },
  challenge_heading: { label: "Detail — Challenge heading" },
  solution_heading: { label: "Detail — Solution heading" },
  results_heading: { label: "Detail — Results heading" },
};



const PAGES = [
  { key: "blog", label: "Blog", url: "/blog" },
  { key: "case-studies", label: "Case Studies", url: "/case-studies" },
  { key: "events", label: "Events & Webinars", url: "/events" },
] as const;

type ArTextFields = {
  eyebrow?: string;
  title_prefix?: string;
  title_highlight?: string;
  description?: string;
};

type ArFields = ArTextFields & {
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
        card_labels: { ...(DEFAULT_LABELS[pageKey]?.en ?? {}) },
        translations: {},
      });
      setAr({});
    }
  }, [data, isLoading, pageKey]);

  if (!form) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const set = <K extends keyof Row>(k: K, v: Row[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const setArField = <K extends keyof ArTextFields>(k: K, v: string) =>
    setAr((a) => ({ ...a, [k]: v }));

  const setLabel = (k: string, v: string) => {
    if (lang === "ar") {
      setAr((a) => ({ ...a, card_labels: { ...(a.card_labels ?? {}), [k]: v } }));
    } else {
      setForm((f) => (f ? { ...f, card_labels: { ...(f.card_labels ?? {}), [k]: v } } : f));
    }
  };

  const labelValue = (k: string): string => {
    if (lang === "ar") return ar.card_labels?.[k] ?? "";
    return form.card_labels?.[k] ?? "";
  };


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
        card_labels: { ...(DEFAULT_LABELS[pageKey]?.en ?? {}), ...(form.card_labels ?? {}) },
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


  const val = (k: keyof ArTextFields, en: string | null) =>
    lang === "ar" ? (ar[k] ?? "") : (en ?? "");

  const onChange = (k: keyof ArTextFields, v: string) => {
    if (lang === "ar") setArField(k, v);
    else set(k as keyof Row, v as unknown as Row[keyof Row]);
  };

  const defaults = DEFAULT_LABELS[pageKey] ?? { en: {}, ar: {} };
  const labelKeys = Object.keys(defaults.en);


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

      {labelKeys.length > 0 && (
        <div className="space-y-3 rounded-lg border p-4">
          <div>
            <div className="font-medium">Card labels &amp; UI text</div>
            <div className="text-xs text-muted-foreground">
              Edit the small text on cards (buttons, filters, "min read", empty states). Switch to the Arabic tab above to translate them.
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {labelKeys.map((k) => {
              const meta = LABEL_FIELD_META[k] ?? { label: k };
              const enPlaceholder = defaults.en[k] ?? "";
              const arPlaceholder = defaults.ar[k] ?? "";
              return (
                <div key={k} className="space-y-1">
                  <Label className="text-xs">
                    {meta.label} {lang === "ar" && "(Arabic)"}
                  </Label>
                  <Input
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    value={labelValue(k)}
                    onChange={(e) => setLabel(k, e.target.value)}
                    placeholder={lang === "ar" ? arPlaceholder : enPlaceholder}
                  />
                  {meta.hint && <p className="text-[10px] text-muted-foreground">{meta.hint}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
        <h1 className="text-2xl font-semibold">Cards</h1>
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
