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

const CATEGORY_PREFIXES = [
  { label: "Healthcare", value: "/healthcare" },
  { label: "Solutions", value: "/solutions" },
  { label: "Industries", value: "/industries" },
  { label: "Services", value: "/services" },
  { label: "Company", value: "/company" },
  { label: "Blog", value: "/blog" },
  { label: "Case Studies", value: "/case-studies" },
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

  const addOverride = () => {
    setTokens((t) => ({
      ...t,
      overrides: [...(t.overrides ?? []), { prefix: "/healthcare", tokens: { ...(t.default ?? DEFAULT_TOKENS) } }],
    }));
  };
  const updateOverride = (i: number, patch: Partial<{ prefix: string; tokens: StyleTokens }>) => {
    setTokens((t) => {
      const list = [...(t.overrides ?? [])];
      list[i] = { ...list[i], ...patch } as any;
      return { ...t, overrides: list };
    });
  };
  const removeOverride = (i: number) => {
    setTokens((t) => ({ ...t, overrides: (t.overrides ?? []).filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Card & Button Style Editor</h1>
          <p className="text-sm text-muted-foreground">Control the look of cards and buttons across the entire site, with optional per-category overrides.</p>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Category overrides</CardTitle>
            <CardDescription>Match by URL prefix (e.g. /healthcare). First match wins.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addOverride}><Plus className="mr-1 h-4 w-4" />Add override</Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {(tokens.overrides ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No overrides yet. Site-wide defaults apply everywhere.</p>
          )}
          {(tokens.overrides ?? []).map((o, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label>URL prefix</Label>
                  <div className="flex gap-2">
                    <Select value={CATEGORY_PREFIXES.find(c => c.value === o.prefix)?.value ?? "custom"} onValueChange={(v) => v !== "custom" && updateOverride(i, { prefix: v })}>
                      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORY_PREFIXES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                        <SelectItem value="custom">Custom…</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input value={o.prefix} onChange={(e) => updateOverride(i, { prefix: e.target.value })} placeholder="/healthcare" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeOverride(i)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <TokenControls value={o.tokens} onChange={(v) => updateOverride(i, { tokens: v })} />
              <Preview tokens={o.tokens} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
