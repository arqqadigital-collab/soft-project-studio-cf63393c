import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type SocialLink = { platform: string; url: string };

export default function HeaderFooterEditor() {
  const qc = useQueryClient();
  const [form, setForm] = useState<any>(null);

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

  const columns: FooterColumn[] = Array.isArray(form.footer_columns) ? form.footer_columns : [];
  const social: SocialLink[] = Array.isArray(form.footer_social) ? form.footer_social : [];

  const set = (patch: any) => setForm((f: any) => ({ ...f, ...patch }));

  async function save() {
    const { error } = await supabase
      .from("header_footer_settings")
      .update({
        header_logo_url: form.header_logo_url,
        header_cta_label: form.header_cta_label,
        header_cta_url: form.header_cta_url,
        header_show_menus: form.header_show_menus,
        footer_logo_url: form.footer_logo_url,
        footer_tagline: form.footer_tagline,
        footer_columns: columns,
        footer_social: social,
        footer_copyright: form.footer_copyright,
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
        <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
      </div>

      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Header</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={form.header_logo_url ?? ""} onChange={(e) => set({ header_logo_url: e.target.value })} placeholder="/logo.png" />
          </div>
          <div className="space-y-2">
            <Label>CTA Label</Label>
            <Input value={form.header_cta_label ?? ""} onChange={(e) => set({ header_cta_label: e.target.value })} placeholder="Get Started" />
          </div>
          <div className="space-y-2">
            <Label>CTA URL</Label>
            <Input value={form.header_cta_url ?? ""} onChange={(e) => set({ header_cta_url: e.target.value })} placeholder="/contact" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.header_show_menus} onCheckedChange={(v) => set({ header_show_menus: v })} />
            <Label>Show mega-menus</Label>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Footer</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={form.footer_logo_url ?? ""} onChange={(e) => set({ footer_logo_url: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={form.footer_tagline ?? ""} onChange={(e) => set({ footer_tagline: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Copyright</Label>
            <Input value={form.footer_copyright ?? ""} onChange={(e) => set({ footer_copyright: e.target.value })} placeholder="© 2026 Company" />
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
                  value={col.title}
                  onChange={(e) => {
                    const c = [...columns]; c[ci] = { ...c[ci], title: e.target.value };
                    set({ footer_columns: c });
                  }}
                  className="font-semibold"
                />
                <Button variant="ghost" size="icon" onClick={() => set({ footer_columns: columns.filter((_, i) => i !== ci) })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {col.links.map((link, li) => (
                <div key={li} className="flex items-center gap-2 pl-4">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const c = [...columns];
                      const links = [...c[ci].links];
                      links[li] = { ...links[li], label: e.target.value };
                      c[ci] = { ...c[ci], links };
                      set({ footer_columns: c });
                    }}
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
    </div>
  );
}
