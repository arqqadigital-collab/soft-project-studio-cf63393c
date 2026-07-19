import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { toast } from "sonner";

type Tokens = {
  id?: string;
  primary_color: string | null;
  accent_color: string | null;
  brand_dark_color: string | null;
  border_radius: string | null;
  heading_font: string | null;
  body_font: string | null;
  site_logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  og_image_url: string | null;
};

const EMPTY: Tokens = {
  primary_color: "#2563eb",
  accent_color: "#10b981",
  brand_dark_color: "#0f172a",
  border_radius: "0.625rem",
  heading_font: "Inter",
  body_font: "Inter",
  site_logo_url: "",
  logo_dark_url: "",
  favicon_url: "",
  og_image_url: "",
};

const FONT_PRESETS = ["Inter", "Poppins", "DM Sans", "Space Grotesk", "Outfit", "Sora", "Manrope", "Work Sans", "Playfair Display", "Instrument Serif", "Cormorant", "Lora", "IBM Plex Sans", "JetBrains Mono"];
const RADIUS_PRESETS = [
  { label: "Sharp", value: "0rem" },
  { label: "Small", value: "0.375rem" },
  { label: "Medium", value: "0.625rem" },
  { label: "Large", value: "1rem" },
  { label: "Pill", value: "1.5rem" },
];

type PickerTarget = "logo" | "logo_dark" | "favicon" | "og" | null;

export default function BrandingPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Tokens>(EMPTY);
  const [picker, setPicker] = useState<PickerTarget>(null);

  const q = useQuery({
    queryKey: ["site-settings-branding"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data) setForm({ ...EMPTY, ...(q.data as any) });
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload: any = {
        primary_color: form.primary_color,
        accent_color: form.accent_color,
        brand_dark_color: form.brand_dark_color,
        border_radius: form.border_radius,
        heading_font: form.heading_font,
        body_font: form.body_font,
        site_logo_url: form.site_logo_url,
        logo_dark_url: form.logo_dark_url,
        favicon_url: form.favicon_url,
        og_image_url: form.og_image_url,
        singleton: true,
      };
      if (q.data?.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", q.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Branding saved — refresh to see changes across the site");
      qc.invalidateQueries({ queryKey: ["site-settings-branding"] });
      qc.invalidateQueries({ queryKey: ["site-branding-tokens"] });
      qc.invalidateQueries({ queryKey: ["site-branding"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const update = (patch: Partial<Tokens>) => setForm((f) => ({ ...f, ...patch }));

  const ColorField = ({ label, value, onChange, hint }: { label: string; value: string | null; onChange: (v: string) => void; hint?: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded border bg-transparent"
        />
        <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );

  const ImageField = ({ label, value, target, hint }: { label: string; value: string | null; target: PickerTarget; hint?: string }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {value ? (
        <img src={value} alt={label} className="h-16 max-w-full rounded border bg-muted p-2 object-contain" />
      ) : (
        <div className="flex h-16 items-center justify-center rounded border border-dashed text-xs text-muted-foreground">No image</div>
      )}
      <div className="flex gap-2">
        <Button variant="outline" type="button" size="sm" onClick={() => setPicker(target)}>Choose</Button>
        {value ? (
          <Button variant="ghost" type="button" size="sm" onClick={() => {
            if (target === "logo") update({ site_logo_url: null });
            if (target === "logo_dark") update({ logo_dark_url: null });
            if (target === "favicon") update({ favicon_url: null });
            if (target === "og") update({ og_image_url: null });
          }}>Remove</Button>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Branding & Design Tokens</h1>
          <p className="text-sm text-muted-foreground">Colors, fonts, radius, logos and social preview — applied site-wide.</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Override brand colors. Accepts hex, rgb() or oklch().</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <ColorField label="Primary" value={form.primary_color} onChange={(v) => update({ primary_color: v })} hint="Buttons, links, primary accents" />
          <ColorField label="Accent" value={form.accent_color} onChange={(v) => update({ accent_color: v })} hint="Secondary highlights" />
          <ColorField label="Brand dark" value={form.brand_dark_color} onChange={(v) => update({ brand_dark_color: v })} hint="Dark surfaces / headers" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Google Font names — loaded automatically.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Heading font</Label>
            <Input list="font-presets" value={form.heading_font ?? ""} onChange={(e) => update({ heading_font: e.target.value })} />
            <p className="text-xs" style={{ fontFamily: form.heading_font || "inherit" }}>The quick brown fox</p>
          </div>
          <div className="space-y-2">
            <Label>Body font</Label>
            <Input list="font-presets" value={form.body_font ?? ""} onChange={(e) => update({ body_font: e.target.value })} />
            <p className="text-xs" style={{ fontFamily: form.body_font || "inherit" }}>The quick brown fox jumps over the lazy dog</p>
          </div>
          <datalist id="font-presets">
            {FONT_PRESETS.map((f) => <option key={f} value={f} />)}
          </datalist>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Border radius</CardTitle>
          <CardDescription>Global roundness for cards, buttons and inputs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {RADIUS_PRESETS.map((r) => (
              <Button
                key={r.value}
                type="button"
                variant={form.border_radius === r.value ? "default" : "outline"}
                size="sm"
                onClick={() => update({ border_radius: r.value })}
              >
                {r.label}
              </Button>
            ))}
          </div>
          <Input value={form.border_radius ?? ""} onChange={(e) => update({ border_radius: e.target.value })} placeholder="0.625rem" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand kit</CardTitle>
          <CardDescription>Logos, favicon and default social sharing image.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ImageField label="Logo (light)" value={form.site_logo_url} target="logo" />
          <ImageField label="Logo (dark)" value={form.logo_dark_url} target="logo_dark" hint="Used on dark backgrounds" />
          <ImageField label="Favicon" value={form.favicon_url} target="favicon" hint="32x32 or SVG recommended" />
          <ImageField label="Social share (OG)" value={form.og_image_url} target="og" hint="1200x630 recommended" />
        </CardContent>
      </Card>

      <MediaPickerDialog
        open={picker !== null}
        onOpenChange={(o) => { if (!o) setPicker(null); }}
        onPick={(m) => {
          if (picker === "logo") update({ site_logo_url: m.file_url });
          if (picker === "logo_dark") update({ logo_dark_url: m.file_url });
          if (picker === "favicon") update({ favicon_url: m.file_url });
          if (picker === "og") update({ og_image_url: m.file_url });
          setPicker(null);
        }}
      />
    </div>
  );
}
