import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import type { StyleTokens, StylePayload } from "@/components/StyleApplier";

const DEFAULT_TOKENS: StyleTokens = {
  card_radius: "0.75rem",
  card_shadow: "sm",
  card_padding: "comfortable",
  card_border: true,
  card_hover: "lift",
  btn_radius: "0.5rem",
  btn_size: "md",
  btn_shadow: "sm",
  btn_style: "solid",
};

const LISTING_PAGES = [
  { label: "Blog", prefix: "/blog" },
  { label: "Case Studies", prefix: "/case-studies" },
  { label: "Events & Webinars", prefix: "/events" },
];

function TokenControls({ value, onChange }: { value: StyleTokens; onChange: (v: StyleTokens) => void }) {
  const set = <K extends keyof StyleTokens>(k: K, v: StyleTokens[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <h4 className="font-semibold">Card style</h4>
        <div>
          <Label>Corner radius</Label>
          <Select value={value.card_radius ?? "0.75rem"} onValueChange={(v) => set("card_radius", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0rem">Sharp (0)</SelectItem>
              <SelectItem value="0.375rem">Small</SelectItem>
              <SelectItem value="0.75rem">Medium</SelectItem>
              <SelectItem value="1rem">Large</SelectItem>
              <SelectItem value="1.5rem">Extra large</SelectItem>
              <SelectItem value="9999px">Pill</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Shadow</Label>
          <Select value={value.card_shadow ?? "sm"} onValueChange={(v) => set("card_shadow", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["none","sm","md","lg","xl"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Padding</Label>
          <Select value={value.card_padding ?? "comfortable"} onValueChange={(v) => set("card_padding", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="comfortable">Comfortable</SelectItem>
              <SelectItem value="spacious">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Hover effect</Label>
          <Select value={value.card_hover ?? "lift"} onValueChange={(v) => set("card_hover", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="lift">Lift</SelectItem>
              <SelectItem value="glow">Glow</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label>Show border</Label>
          <Switch checked={value.card_border !== false} onCheckedChange={(v) => set("card_border", v)} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold">Button style</h4>
        <div>
          <Label>Corner radius</Label>
          <Select value={value.btn_radius ?? "0.5rem"} onValueChange={(v) => set("btn_radius", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0rem">Sharp</SelectItem>
              <SelectItem value="0.375rem">Small</SelectItem>
              <SelectItem value="0.5rem">Medium</SelectItem>
              <SelectItem value="0.75rem">Large</SelectItem>
              <SelectItem value="9999px">Pill</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Size</Label>
          <Select value={value.btn_size ?? "md"} onValueChange={(v) => set("btn_size", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Shadow</Label>
          <Select value={value.btn_shadow ?? "sm"} onValueChange={(v) => set("btn_shadow", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["none","sm","md","lg"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Style</Label>
          <Select value={value.btn_style ?? "solid"} onValueChange={(v) => set("btn_style", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="gradient">Gradient</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function CategoryControls({ value, onChange }: { value: StyleTokens; onChange: (v: StyleTokens) => void }) {
  const set = <K extends keyof StyleTokens>(k: K, v: StyleTokens[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="space-y-4 border-t pt-6">
      <div>
        <h4 className="font-semibold">Category style</h4>
        <p className="text-sm text-muted-foreground">Controls card badges and the category filters above the cards.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Badge appearance</Label>
          <Select value={value.category_style ?? "soft"} onValueChange={(v) => set("category_style", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="soft">Soft background</SelectItem>
              <SelectItem value="solid">Solid</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color</Label>
          <Select value={value.category_color ?? "primary"} onValueChange={(v) => set("category_color", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Brand blue</SelectItem>
              <SelectItem value="green">Brand green</SelectItem>
              <SelectItem value="accent">Accent</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Shape</Label>
          <Select value={value.category_radius ?? "9999px"} onValueChange={(v) => set("category_radius", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0rem">Sharp</SelectItem>
              <SelectItem value="0.375rem">Small</SelectItem>
              <SelectItem value="0.75rem">Rounded</SelectItem>
              <SelectItem value="9999px">Pill</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Letter case</Label>
          <Select value={value.category_text_case ?? "uppercase"} onValueChange={(v) => set("category_text_case", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="original">Original</SelectItem>
              <SelectItem value="uppercase">Uppercase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <Label>Show category badges on cards</Label>
        <Switch checked={value.category_badge_visible !== false} onCheckedChange={(v) => set("category_badge_visible", v)} />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <Label>Show category filter buttons</Label>
        <Switch checked={value.category_filters_visible !== false} onCheckedChange={(v) => set("category_filters_visible", v)} />
      </div>
    </div>
  );
}

function Preview({ tokens }: { tokens: StyleTokens }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-6">
      <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">Live preview</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card border p-6" style={{
          borderRadius: tokens.card_radius,
          boxShadow: tokens.card_shadow === "none" ? "none" : `0 4px 12px -2px rgb(0 0 0 / 0.10)`,
          borderWidth: tokens.card_border === false ? 0 : 1,
        }}>
          {tokens.category_badge_visible !== false && (
            <span
              className="mb-3 inline-flex border px-3 py-1 text-xs font-semibold"
              style={{ borderRadius: tokens.category_radius ?? "9999px", textTransform: tokens.category_text_case === "original" ? "none" : "uppercase" }}
            >Healthcare</span>
          )}
          <h4 className="mb-1 font-semibold">Sample card</h4>
          <p className="text-sm text-muted-foreground">This is how your cards will look across all pages.</p>
        </div>
        <div className="flex flex-col items-start gap-3">
          <button className="bg-primary text-primary-foreground font-medium" style={{
            borderRadius: tokens.btn_radius,
            padding: "0.625rem 1.25rem",
            background: tokens.btn_style === "gradient" ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" : undefined,
            border: tokens.btn_style === "outline" ? "1px solid hsl(var(--primary))" : undefined,
            color: tokens.btn_style === "outline" ? "hsl(var(--primary))" : undefined,
            backgroundColor: tokens.btn_style === "outline" ? "transparent" : undefined,
          }}>Primary Button</button>
        </div>
      </div>
    </div>
  );
}

export default function StyleEditor() {
  const qc = useQueryClient();
  const [tokens, setTokens] = useState<StylePayload>({ default: DEFAULT_TOKENS, overrides: [] });

  const q = useQuery({
    queryKey: ["style-editor"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("id, style_tokens").maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (q.data) {
      const st = (q.data as any).style_tokens ?? {};
      setTokens({
        default: { ...DEFAULT_TOKENS, ...(st.default ?? {}) },
        overrides: st.overrides ?? [],
      });
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const id = (q.data as any)?.id;
      if (!id) throw new Error("Site settings row missing");
      const { error } = await supabase.from("site_settings").update({ style_tokens: tokens as any }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Styles saved");
      qc.invalidateQueries({ queryKey: ["site-style-tokens"] });
      qc.invalidateQueries({ queryKey: ["style-editor"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Save failed"),
  });

  const getOverride = (prefix: string): StyleTokens => {
    const existing = (tokens.overrides ?? []).find((o) => o.prefix === prefix);
    return existing?.tokens ?? { ...(tokens.default ?? DEFAULT_TOKENS) };
  };
  const setOverride = (prefix: string, next: StyleTokens) => {
    setTokens((t) => {
      const list = [...(t.overrides ?? [])];
      const idx = list.findIndex((o) => o.prefix === prefix);
      if (idx >= 0) list[idx] = { prefix, tokens: next };
      else list.push({ prefix, tokens: next });
      return { ...t, overrides: list };
    });
  };
  const clearOverride = (prefix: string) => {
    setTokens((t) => ({ ...t, overrides: (t.overrides ?? []).filter((o) => o.prefix !== prefix) }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Card & Button Style Editor</h1>
          <p className="text-sm text-muted-foreground">Site-wide defaults, plus dedicated card styling for Blog, Case Studies, and Events.</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Site-wide defaults</CardTitle>
          <CardDescription>Applied to every page unless overridden below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TokenControls
            value={tokens.default ?? DEFAULT_TOKENS}
            onChange={(v) => setTokens((t) => ({ ...t, default: v }))}
          />
          <Preview tokens={tokens.default ?? DEFAULT_TOKENS} />
        </CardContent>
      </Card>

      {LISTING_PAGES.map((page) => {
        const active = (tokens.overrides ?? []).some((o) => o.prefix === page.prefix);
        const current = getOverride(page.prefix);
        return (
          <Card key={page.prefix}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{page.label} cards</CardTitle>
                <CardDescription>Override card styling on <code>{page.prefix}</code>.</CardDescription>
              </div>
              {active ? (
                <Button variant="ghost" size="sm" onClick={() => clearOverride(page.prefix)}>
                  <Trash2 className="mr-1 h-4 w-4" />Reset to default
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setOverride(page.prefix, current)}>
                  <Plus className="mr-1 h-4 w-4" />Customize
                </Button>
              )}
            </CardHeader>
            {active && (
              <CardContent className="space-y-6">
                <TokenControls value={current} onChange={(v) => setOverride(page.prefix, v)} />
                <CategoryControls value={current} onChange={(v) => setOverride(page.prefix, v)} />
                <Preview tokens={current} />
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}
