import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2, ExternalLink, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { useMenuTree } from "@/lib/menuTree";
import { SectionEditor } from "@/components/dashboard/SectionEditor";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type SocialLink = { platform: string; url: string };

function LogoField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
        <div className="flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded border bg-background">
          {value ? (
            <img src={value} alt={label} className="max-h-full max-w-full object-contain" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            {value ? "Change logo" : "Choose from media"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <Trash2 className="mr-1 h-4 w-4 text-destructive" /> Remove
            </Button>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onPick={(m) => {
          onChange(m.file_url);
          setOpen(false);
        }}
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const isHex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border bg-transparent"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "#000000 or any CSS color"}
        />
        {value && (
          <Button variant="ghost" size="icon" onClick={() => onChange("")}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </div>
    </div>
  );
}

type Loc = "en" | "ar";

export default function HeaderFooterEditor() {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(null);
  const [loc, setLoc] = useState<Loc>("en");
  const { data: navTree = [] } = useMenuTree();

  const q = useQuery({
    queryKey: ["header-footer"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("header_footer_settings")
        .select("*")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data && !form) setForm(q.data);
  }, [q.data, form]);

  if (!form) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const tr: Record<string, any> = (form.translations && typeof form.translations === "object") ? form.translations : {};
  const arObj: Record<string, any> = (tr.ar && typeof tr.ar === "object") ? tr.ar : {};

  // Base (EN) arrays
  const columns: FooterColumn[] = Array.isArray(form.footer_columns) ? form.footer_columns : [];
  const social: SocialLink[] = Array.isArray(form.footer_social) ? form.footer_social : [];
  const locales: { code: string; label: string; url?: string }[] = Array.isArray(form.header_locales) ? form.header_locales : [];
  const mobileItems: { label: string; url: string }[] = Array.isArray(form.mobile_menu_items) ? form.mobile_menu_items : [];

  // AR overlays
  const arColumns: Partial<FooterColumn>[] = Array.isArray(arObj.footer_columns) ? arObj.footer_columns : [];
  const arMobile: Partial<{ label: string }>[] = Array.isArray(arObj.mobile_menu_items) ? arObj.mobile_menu_items : [];

  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));
  const setAr = (patch: Record<string, any>) =>
    setForm((f: any) => ({ ...f, translations: { ...(f.translations ?? {}), ar: { ...((f.translations ?? {}).ar ?? {}), ...patch } } }));

  // Text-field helpers that route to EN base or AR overlay
  const txt = (key: string): string => (loc === "en" ? (form[key] ?? "") : (arObj[key] ?? ""));
  const setTxt = (key: string, v: string) => (loc === "en" ? set({ [key]: v }) : setAr({ [key]: v }));

  // Column title (per locale)
  const colTitle = (i: number) => (loc === "en" ? columns[i]?.title ?? "" : (arColumns[i]?.title as string) ?? "");
  const setColTitle = (i: number, v: string) => {
    if (loc === "en") {
      const c = [...columns]; c[i] = { ...c[i], title: v }; set({ footer_columns: c });
    } else {
      const c = [...arColumns]; c[i] = { ...(c[i] ?? {}), title: v }; setAr({ footer_columns: c });
    }
  };
  const linkLabel = (ci: number, li: number) =>
    loc === "en"
      ? columns[ci]?.links[li]?.label ?? ""
      : ((arColumns[ci] as any)?.links?.[li]?.label as string) ?? "";
  const setLinkLabel = (ci: number, li: number, v: string) => {
    if (loc === "en") {
      const c = [...columns];
      const links = [...c[ci].links]; links[li] = { ...links[li], label: v };
      c[ci] = { ...c[ci], links }; set({ footer_columns: c });
    } else {
      const c = [...arColumns];
      const col: any = { ...(c[ci] ?? {}) };
      const links = Array.isArray(col.links) ? [...col.links] : [];
      links[li] = { ...(links[li] ?? {}), label: v };
      col.links = links; c[ci] = col; setAr({ footer_columns: c });
    }
  };
  const mobLabel = (i: number) => (loc === "en" ? mobileItems[i]?.label ?? "" : (arMobile[i]?.label as string) ?? "");
  const setMobLabel = (i: number, v: string) => {
    if (loc === "en") {
      const arr = [...mobileItems]; arr[i] = { ...arr[i], label: v }; set({ mobile_menu_items: arr });
    } else {
      const arr = [...arMobile]; arr[i] = { ...(arr[i] ?? {}), label: v }; setAr({ mobile_menu_items: arr });
    }
  };

  async function save() {
    const { error } = await supabase
      .from("header_footer_settings")
      .update({
        header_logo_url: form.header_logo_url,
        header_logo_dark_url: form.header_logo_dark_url,
        header_logo_height: Number(form.header_logo_height) || 56,
        header_show_brand_text: !!form.header_show_brand_text,
        header_brand_text: form.header_brand_text,
        header_cta_label: form.header_cta_label,
        header_cta_url: form.header_cta_url,
        header_cta_variant: form.header_cta_variant || "gradient",
        header_show_menus: form.header_show_menus,
        header_sticky: !!form.header_sticky,
        header_transparent_on_hero: !!form.header_transparent_on_hero,
        header_shadow_style: form.header_shadow_style || "soft",
        header_show_locale_switcher: !!form.header_show_locale_switcher,
        header_locales: locales,
        mobile_menu_items: mobileItems,
        mobile_show_social: form.mobile_show_social !== false,
        mobile_drawer_side: form.mobile_drawer_side || "end",
        mobile_drawer_width_pct: Number(form.mobile_drawer_width_pct) || 86,
        mobile_drawer_bg_color: form.mobile_drawer_bg_color || null,
        mobile_drawer_text_color: form.mobile_drawer_text_color || null,
        mobile_show_cta: form.mobile_show_cta !== false,
        mobile_show_lang: form.mobile_show_lang !== false,
        mobile_show_logo: form.mobile_show_logo !== false,
        mobile_more_label: form.mobile_more_label || "More",
        mobile_default_expanded: !!form.mobile_default_expanded,

        header_bg_color: form.header_bg_color,
        header_text_color: form.header_text_color,
        header_cta_bg_color: form.header_cta_bg_color,
        header_cta_text_color: form.header_cta_text_color,
        footer_logo_url: form.footer_logo_url,
        footer_tagline: form.footer_tagline,
        footer_columns: columns,
        footer_social: social,
        footer_copyright: form.footer_copyright,
        translations: form.translations ?? {},
      })
      .eq("id", form.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["header-footer"] });
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Header & Footer</h1>
          <p className="text-sm text-muted-foreground">Site-wide header and footer configuration.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="mr-2 inline-flex rounded-md border p-0.5">
            <button
              type="button"
              onClick={() => setLoc("en")}
              className={`rounded px-3 py-1 text-xs font-medium ${loc === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLoc("ar")}
              className={`rounded px-3 py-1 text-xs font-medium ${loc === "ar" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
            >
              AR
            </button>
          </div>

          <Button
            variant="outline"
            onClick={async () => {
              const t = toast.loading("Translating header & footer to Arabic…");
              const { data, error } = await supabase.functions.invoke("translate-content", {
                body: { mode: "header_footer" },
              });
              toast.dismiss(t);
              if (error) return toast.error(error.message);
              toast.success(`Header/Footer translated (${(data as any)?.ok ?? 0})`);
              qc.invalidateQueries({ queryKey: ["header-footer"] });
            }}
          >
            Translate H/F to Arabic
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const t = toast.loading("Translating menus to Arabic…");
              const { data, error } = await supabase.functions.invoke("translate-content", {
                body: { mode: "menus" },
              });
              toast.dismiss(t);
              if (error) {
                const detail = await (error as any)?.context?.text?.().catch(() => "");
                return toast.error(detail || error.message);
              }
              const r = data as any;
              if (r?.fail) toast.warning(`Menus translated (${r.ok}/${r.total}); ${r.fail} failed`);
              else toast.success(`Menus translated (${r?.ok ?? 0}/${r?.total ?? 0})`);
              qc.invalidateQueries({ queryKey: ["menu-tree"] });
            }}
          >
            Translate Menus to Arabic
          </Button>
          <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
        </div>
      </div>

      <Tabs defaultValue="header" className="space-y-4">
        <TabsList>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="footer_cta">Footer CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-4">
          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Logo & Brand</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <LogoField
                label="Logo (default / on solid header)"
                value={form.header_logo_url ?? ""}
                onChange={(v) => set({ header_logo_url: v })}
                hint="Shown on the solid header background."
              />
              <LogoField
                label="Logo (alternate / on transparent hero)"
                value={form.header_logo_dark_url ?? ""}
                onChange={(v) => set({ header_logo_dark_url: v })}
                hint="Optional light-variant logo used when header is transparent over the hero."
              />
              <div className="space-y-2">
                <Label>Logo height (px)</Label>
                <Input
                  type="number"
                  min={24}
                  max={120}
                  value={form.header_logo_height ?? 56}
                  onChange={(e) => set({ header_logo_height: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Switch checked={!!form.header_show_brand_text} onCheckedChange={(v) => set({ header_show_brand_text: v })} />
                  <Label>Show brand text next to logo</Label>
                </div>
                <Input
                  value={txt("header_brand_text")}
                  onChange={(e) => setTxt("header_brand_text", e.target.value)}
                  placeholder={loc === "ar" ? "مثال: SBS" : "e.g. SBS"}
                  disabled={!form.header_show_brand_text}
                  dir={loc === "ar" ? "rtl" : "ltr"}
                />

              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">CTA Button</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>CTA Label</Label>
                <Input value={txt("header_cta_label")} onChange={(e) => setTxt("header_cta_label", e.target.value)} placeholder={loc === "ar" ? "احجز عرضًا" : "Book Demo"} dir={loc === "ar" ? "rtl" : "ltr"} />
              </div>
              <div className="space-y-2">
                <Label>CTA URL</Label>
                <Input value={form.header_cta_url ?? ""} onChange={(e) => set({ header_cta_url: e.target.value })} placeholder="/contact" />
              </div>
              <div className="space-y-2">
                <Label>Button style</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.header_cta_variant ?? "gradient"}
                  onChange={(e) => set({ header_cta_variant: e.target.value })}
                >
                  <option value="gradient">Gradient (brand)</option>
                  <option value="primary">Solid primary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost / text</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.header_show_menus} onCheckedChange={(v) => set({ header_show_menus: v })} />
                <Label>Show mega-menus</Label>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Behavior</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Switch checked={!!form.header_sticky} onCheckedChange={(v) => set({ header_sticky: v })} />
                <div>
                  <Label>Sticky on scroll</Label>
                  <p className="text-xs text-muted-foreground">Header stays fixed at the top when the user scrolls.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={!!form.header_transparent_on_hero} onCheckedChange={(v) => set({ header_transparent_on_hero: v })} />
                <div>
                  <Label>Transparent over hero</Label>
                  <p className="text-xs text-muted-foreground">Removes background above the fold; solidifies after scroll.</p>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Shadow when scrolled</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.header_shadow_style ?? "soft"}
                  onChange={(e) => set({ header_shadow_style: e.target.value })}
                >
                  <option value="none">None</option>
                  <option value="soft">Soft</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={!!form.header_show_locale_switcher} onCheckedChange={(v) => set({ header_show_locale_switcher: v })} />
              <h2 className="text-lg font-semibold">Language / region switcher</h2>
            </div>
            <p className="text-sm text-muted-foreground">Add the locales you want visible in the switcher.</p>
            <div className="space-y-2">
              {locales.map((l, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="en" value={l.code} maxLength={5} onChange={(e) => {
                    const arr = [...locales]; arr[i] = { ...arr[i], code: e.target.value };
                    set({ header_locales: arr });
                  }} className="max-w-[100px]" />
                  <Input placeholder="English" value={l.label} onChange={(e) => {
                    const arr = [...locales]; arr[i] = { ...arr[i], label: e.target.value };
                    set({ header_locales: arr });
                  }} />
                  <Input placeholder="/en (optional URL)" value={l.url ?? ""} onChange={(e) => {
                    const arr = [...locales]; arr[i] = { ...arr[i], url: e.target.value };
                    set({ header_locales: arr });
                  }} />
                  <Button variant="ghost" size="icon" onClick={() => set({ header_locales: locales.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => set({ header_locales: [...locales, { code: "", label: "", url: "" }] })}>
                <Plus className="mr-1 h-4 w-4" /> Add locale
              </Button>
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Mobile menu</h2>
            <p className="text-sm text-muted-foreground">Control the drawer that opens on mobile / tablet.</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Drawer opens from</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.mobile_drawer_side ?? "end"}
                  onChange={(e) => set({ mobile_drawer_side: e.target.value })}
                >
                  <option value="end">Right (end)</option>
                  <option value="start">Left (start)</option>
                </select>
                <p className="text-xs text-muted-foreground">Auto-mirrors in RTL.</p>
              </div>
              <div className="space-y-2">
                <Label>Drawer width ({form.mobile_drawer_width_pct ?? 86}%)</Label>
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={form.mobile_drawer_width_pct ?? 86}
                  onChange={(e) => set({ mobile_drawer_width_pct: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <ColorField
                label="Drawer background"
                value={form.mobile_drawer_bg_color ?? ""}
                onChange={(v) => set({ mobile_drawer_bg_color: v })}
              />
              <ColorField
                label="Drawer text"
                value={form.mobile_drawer_text_color ?? ""}
                onChange={(v) => set({ mobile_drawer_text_color: v })}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Switch checked={form.mobile_show_logo !== false} onCheckedChange={(v) => set({ mobile_show_logo: v })} />
                <Label>Show logo in drawer</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.mobile_show_lang !== false} onCheckedChange={(v) => set({ mobile_show_lang: v })} />
                <Label>Show language switcher</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.mobile_show_cta !== false} onCheckedChange={(v) => set({ mobile_show_cta: v })} />
                <Label>Show CTA button in drawer</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={form.mobile_show_social !== false} onCheckedChange={(v) => set({ mobile_show_social: v })} />
                <Label>Show social icons</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={!!form.mobile_default_expanded} onCheckedChange={(v) => set({ mobile_default_expanded: v })} />
                <Label>Expand all menu groups by default</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>"More" section heading</Label>
              <Input
                value={txt("mobile_more_label")}
                onChange={(e) => setTxt("mobile_more_label", e.target.value)}
                placeholder={loc === "ar" ? "المزيد" : "More"}
                dir={loc === "ar" ? "rtl" : "ltr"}
              />
              <p className="text-xs text-muted-foreground">Shown above the mobile-only links list.</p>
            </div>

            <div className="space-y-2">
              <Label>Mobile-only links</Label>
              {mobileItems.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder={loc === "ar" ? "التسمية" : "Label"} value={mobLabel(i)} onChange={(e) => setMobLabel(i, e.target.value)} dir={loc === "ar" ? "rtl" : "ltr"} />

                  <Input placeholder="/url" value={m.url} onChange={(e) => {
                    const arr = [...mobileItems]; arr[i] = { ...arr[i], url: e.target.value };
                    set({ mobile_menu_items: arr });
                  }} />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => {
                      const arr = [...mobileItems]; const t = arr[i - 1]; arr[i - 1] = arr[i]; arr[i] = t;
                      set({ mobile_menu_items: arr });
                    }}>↑</Button>
                    <Button variant="ghost" size="icon" disabled={i === mobileItems.length - 1} onClick={() => {
                      const arr = [...mobileItems]; const t = arr[i + 1]; arr[i + 1] = arr[i]; arr[i] = t;
                      set({ mobile_menu_items: arr });
                    }}>↓</Button>
                    <Button variant="ghost" size="icon" onClick={() => set({ mobile_menu_items: mobileItems.filter((_, j) => j !== i) })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => set({ mobile_menu_items: [...mobileItems, { label: "", url: "" }] })}>
                <Plus className="mr-1 h-4 w-4" /> Add mobile link
              </Button>
            </div>
          </Card>


          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Colors</h2>
            <p className="text-sm text-muted-foreground">Leave empty to keep the site's default theme colors.</p>
            <div className="grid gap-4 md:grid-cols-2">
              <ColorField
                label="Header background"
                value={form.header_bg_color ?? ""}
                onChange={(v) => set({ header_bg_color: v })}
              />
              <ColorField
                label="Header text"
                value={form.header_text_color ?? ""}
                onChange={(v) => set({ header_text_color: v })}
              />
              <ColorField
                label="CTA background"
                value={form.header_cta_bg_color ?? ""}
                onChange={(v) => set({ header_cta_bg_color: v })}
                placeholder="#000 or linear-gradient(...)"
              />
              <ColorField
                label="CTA text"
                value={form.header_cta_text_color ?? ""}
                onChange={(v) => set({ header_cta_text_color: v })}
              />
            </div>
          </Card>

          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Menu preview</h2>
                <p className="text-sm text-muted-foreground">Full menu currently shown in the header. Edit items in Pages & Navigation.</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard/pages">
                  <ExternalLink className="mr-1 h-4 w-4" /> Manage pages & navigation
                </Link>
              </Button>
            </div>
            {navTree.length === 0 ? (
              <p className="text-sm text-muted-foreground">No menu items yet.</p>
            ) : (
              <div className="space-y-3">
                {navTree.map((group) => (
                  <div key={group.id} className="rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{group.label}</span>
                      {!group.is_visible && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">hidden</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-2 pl-3">
                      {group.columns.map((column) => (
                        <div key={column.id}>
                          <div className="text-sm font-medium">{column.label}</div>
                          <ul className="ml-4 mt-1 list-disc space-y-0.5 text-sm text-muted-foreground">
                            {column.pages.map((p) => (
                              <li key={`p-${p.id}`}>
                                {p.nav_label || p.title}{" "}
                                <span className="text-xs opacity-60">({p.route_path})</span>
                              </li>
                            ))}
                            {column.pages.length === 0 && (
                              <li className="text-xs opacity-60">No pages assigned</li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Footer</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <LogoField
                label="Footer logo"
                value={form.footer_logo_url ?? ""}
                onChange={(v) => set({ footer_logo_url: v })}
              />
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={txt("footer_tagline")} onChange={(e) => setTxt("footer_tagline", e.target.value)} dir={loc === "ar" ? "rtl" : "ltr"} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Copyright</Label>
                <Input value={txt("footer_copyright")} onChange={(e) => setTxt("footer_copyright", e.target.value)} placeholder={loc === "ar" ? "© 2026 الشركة" : "© 2026 Company"} dir={loc === "ar" ? "rtl" : "ltr"} />
              </div>

            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Footer columns</Label>
                <Button variant="outline" size="sm" onClick={() => set({ footer_columns: [...columns, { title: "New column", links: [] }] })}>
                  <Plus className="mr-1 h-4 w-4" /> Add column
                </Button>
              </div>
              {columns.map((col, ci) => (
                <div key={ci} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={colTitle(ci)}
                      onChange={(e) => setColTitle(ci, e.target.value)}
                      className="font-semibold"
                      dir={loc === "ar" ? "rtl" : "ltr"}
                    />

                    <Button variant="ghost" size="icon" onClick={() => set({ footer_columns: columns.filter((_, i) => i !== ci) })}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-2 pl-4">
                      <Input
                        placeholder={loc === "ar" ? "التسمية" : "Label"}
                        value={linkLabel(ci, li)}
                        onChange={(e) => setLinkLabel(ci, li, e.target.value)}
                        dir={loc === "ar" ? "rtl" : "ltr"}
                      />

                      <Input
                        placeholder="/href"
                        value={link.href}
                        onChange={(e) => {
                          const c = [...columns];
                          const links = [...c[ci].links];
                          links[li] = { ...links[li], href: e.target.value };
                          c[ci] = { ...c[ci], links };
                          set({ footer_columns: c });
                        }}
                      />
                      <Button variant="ghost" size="icon" onClick={() => {
                        const c = [...columns];
                        c[ci] = { ...c[ci], links: c[ci].links.filter((_, i) => i !== li) };
                        set({ footer_columns: c });
                      }}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => {
                    const c = [...columns];
                    c[ci] = { ...c[ci], links: [...c[ci].links, { label: "", href: "" }] };
                    set({ footer_columns: c });
                  }}>
                    <Plus className="mr-1 h-4 w-4" /> Add link
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Social links</Label>
                <Button variant="outline" size="sm" onClick={() => set({ footer_social: [...social, { platform: "", url: "" }] })}>
                  <Plus className="mr-1 h-4 w-4" /> Add
                </Button>
              </div>
              {social.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="linkedin" value={s.platform} onChange={(e) => {
                    const arr = [...social]; arr[i] = { ...arr[i], platform: e.target.value };
                    set({ footer_social: arr });
                  }} className="max-w-[180px]" />
                  <Input placeholder="https://…" value={s.url} onChange={(e) => {
                    const arr = [...social]; arr[i] = { ...arr[i], url: e.target.value };
                    set({ footer_social: arr });
                  }} />
                  <Button variant="ghost" size="icon" onClick={() => set({ footer_social: social.filter((_, j) => j !== i) })}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="footer_cta" className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Footer CTA section</h2>
            <p className="text-sm text-muted-foreground">
              The "Let's Get Started" section shown above the footer on every page (except Contact).
              Edit the copy, testimonials, background video, and Arabic translations here.
            </p>
          </div>
          <SectionEditor sectionKey="cta" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
