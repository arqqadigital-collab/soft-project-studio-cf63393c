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

const PAGES = [
  { key: "blog", label: "Blog", url: "/blog" },
  { key: "case-studies", label: "Case Studies", url: "/case-studies" },
  { key: "events", label: "Events & Webinars", url: "/events" },
] as const;

type Row = {
  page_key: string;
  eyebrow: string | null;
  title_prefix: string | null;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
    else if (!isLoading)
      setForm({
        page_key: pageKey,
        eyebrow: "",
        title_prefix: "",
        title_highlight: "",
        description: "",
        is_visible: true,
      });
  }, [data, isLoading, pageKey]);

  if (!form) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const set = <K extends keyof Row>(k: K, v: Row[K]) =>
    setForm((f) => (f ? { ...f, [k]: v } : f));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("list_page_hero").upsert(form, {
      onConflict: "page_key",
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["list_page_hero_edit", pageKey] });
    qc.invalidateQueries({ queryKey: ["list_page_hero", pageKey] });
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <div className="font-medium">Show hero section</div>
          <div className="text-xs text-muted-foreground">
            Toggle the entire top hero on this page.
          </div>
        </div>
        <Switch
          checked={form.is_visible}
          onCheckedChange={(v) => set("is_visible", v)}
        />
      </div>

      <div className="space-y-2">
        <Label>Eyebrow (small label above title)</Label>
        <Input
          value={form.eyebrow ?? ""}
          onChange={(e) => set("eyebrow", e.target.value)}
          placeholder="Insights & Updates"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Title — plain part</Label>
          <Input
            value={form.title_prefix ?? ""}
            onChange={(e) => set("title_prefix", e.target.value)}
            placeholder="Our"
          />
        </div>
        <div className="space-y-2">
          <Label>Title — highlighted part</Label>
          <Input
            value={form.title_highlight ?? ""}
            onChange={(e) => set("title_highlight", e.target.value)}
            placeholder="Blog"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Renders as: <strong>{form.title_prefix}</strong>{" "}
        <span style={{ color: "var(--brand-blue)" }}>{form.title_highlight}</span>
      </p>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          rows={4}
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
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
          Edit the headline, eyebrow, and description shown at the top of the Blog,
          Case Studies, and Events pages.
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
