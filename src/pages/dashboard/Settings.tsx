import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { toast } from "sonner";

type Settings = {
  id?: string;
  site_title: string | null;
  site_title_ar: string | null;
  site_description: string | null;
  site_description_ar: string | null;
  site_url: string | null;
  site_logo_url: string | null;
  favicon_url: string | null;
  default_meta_title: string | null;
  default_meta_title_ar: string | null;
  default_meta_description: string | null;
  default_meta_description_ar: string | null;
};

const EMPTY: Settings = {
  site_title: "",
  site_title_ar: "",
  site_description: "",
  site_description_ar: "",
  site_url: "",
  site_logo_url: "",
  favicon_url: "",
  default_meta_title: "",
  default_meta_title_ar: "",
  default_meta_description: "",
  default_meta_description_ar: "",
};

type PickerTarget = "logo" | "favicon" | null;

export default function SettingsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings>(EMPTY);
  const [picker, setPicker] = useState<PickerTarget>(null);

  const q = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data) setForm({ ...EMPTY, ...q.data });
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, singleton: true };
      if (q.data?.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", q.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_settings").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Settings saved");
      qc.invalidateQueries({ queryKey: ["site-settings"] });
      qc.invalidateQueries({ queryKey: ["site-settings-head"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const update = (patch: Partial<Settings>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Site-wide configuration.</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Site title (EN)</Label>
                <Input value={form.site_title ?? ""} onChange={(e) => update({ site_title: e.target.value })} />
                <p className="text-xs text-muted-foreground">Shown in the browser tab and as the fallback title site-wide.</p>
              </div>
              <div className="space-y-2">
                <Label>Site description (EN)</Label>
                <Textarea rows={3} value={form.site_description ?? ""} onChange={(e) => update({ site_description: e.target.value })} />
              </div>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 pt-4" dir="rtl">
              <div className="space-y-2">
                <Label>عنوان الموقع (AR)</Label>
                <Input value={form.site_title_ar ?? ""} onChange={(e) => update({ site_title_ar: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>وصف الموقع (AR)</Label>
                <Textarea rows={3} value={form.site_description_ar ?? ""} onChange={(e) => update({ site_description_ar: e.target.value })} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2 pt-2">
            <Label>Site URL</Label>
            <Input
              value={form.site_url ?? ""}
              onChange={(e) => update({ site_url: e.target.value })}
              placeholder="https://example.com"
            />
            <p className="text-xs text-muted-foreground">
              Used in sitemap.xml and RSS to emit absolute URLs. No trailing slash.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Logo</Label>
            {form.site_logo_url ? (
              <img src={form.site_logo_url} alt="Logo" className="h-16 rounded border bg-muted p-2 object-contain" />
            ) : null}
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setPicker("logo")}>Choose logo</Button>
              {form.site_logo_url ? (
                <Button variant="ghost" type="button" onClick={() => update({ site_logo_url: null })}>Remove</Button>
              ) : null}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Favicon</Label>
            {form.favicon_url ? (
              <img src={form.favicon_url} alt="Favicon" className="h-12 w-12 rounded border bg-muted p-1 object-contain" />
            ) : null}
            <div className="flex gap-2">
              <Button variant="outline" type="button" onClick={() => setPicker("favicon")}>Choose favicon</Button>
              {form.favicon_url ? (
                <Button variant="ghost" type="button" onClick={() => update({ favicon_url: null })}>Remove</Button>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Default SEO</CardTitle></CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Used as fallback when a page has no SEO title/description of its own.
          </p>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Default meta title (EN)</Label>
                <Input value={form.default_meta_title ?? ""} onChange={(e) => update({ default_meta_title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Default meta description (EN)</Label>
                <Textarea rows={3} value={form.default_meta_description ?? ""} onChange={(e) => update({ default_meta_description: e.target.value })} />
              </div>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 pt-4" dir="rtl">
              <div className="space-y-2">
                <Label>العنوان الافتراضي (AR)</Label>
                <Input value={form.default_meta_title_ar ?? ""} onChange={(e) => update({ default_meta_title_ar: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الوصف الافتراضي (AR)</Label>
                <Textarea rows={3} value={form.default_meta_description_ar ?? ""} onChange={(e) => update({ default_meta_description_ar: e.target.value })} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <MediaPickerDialog
        open={picker !== null}
        onOpenChange={(o) => { if (!o) setPicker(null); }}
        onPick={(m) => {
          if (picker === "logo") update({ site_logo_url: m.file_url });
          if (picker === "favicon") update({ favicon_url: m.file_url });
          setPicker(null);
        }}
      />
    </div>
  );
}
