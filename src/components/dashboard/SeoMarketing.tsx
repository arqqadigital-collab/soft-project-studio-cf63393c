import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Row = {
  ga4_id: string | null;
  gtm_id: string | null;
  meta_pixel_id: string | null;
  linkedin_partner_id: string | null;
  custom_head_html: string | null;
  custom_body_html: string | null;
};

const EMPTY: Row = {
  ga4_id: "",
  gtm_id: "",
  meta_pixel_id: "",
  linkedin_partner_id: "",
  custom_head_html: "",
  custom_body_html: "",
};

export function SeoMarketing() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Row>(EMPTY);

  const q = useQuery({
    queryKey: ["seo-marketing"],
    queryFn: async (): Promise<Row | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "ga4_id, gtm_id, meta_pixel_id, linkedin_partner_id, custom_head_html, custom_body_html",
        )
        .maybeSingle();
      if (error) throw error;
      return data as Row | null;
    },
  });

  useEffect(() => {
    if (q.data) setForm({ ...EMPTY, ...q.data });
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ga4_id: form.ga4_id || null,
        gtm_id: form.gtm_id || null,
        meta_pixel_id: form.meta_pixel_id || null,
        linkedin_partner_id: form.linkedin_partner_id || null,
        custom_head_html: form.custom_head_html || null,
        custom_body_html: form.custom_body_html || null,
      };
      const { error } = await supabase.from("site_settings").update(payload).eq("singleton", true);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Marketing tags saved");
      qc.invalidateQueries({ queryKey: ["seo-marketing"] });
      qc.invalidateQueries({ queryKey: ["site-settings-tracking"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const set = (patch: Partial<Row>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Analytics &amp; ad tags</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Google Analytics 4 (Measurement ID)</Label>
            <Input value={form.ga4_id ?? ""} onChange={(e) => set({ ga4_id: e.target.value })} placeholder="G-XXXXXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Google Tag Manager (Container ID)</Label>
            <Input value={form.gtm_id ?? ""} onChange={(e) => set({ gtm_id: e.target.value })} placeholder="GTM-XXXXXXX" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Meta (Facebook) Pixel ID</Label>
            <Input value={form.meta_pixel_id ?? ""} onChange={(e) => set({ meta_pixel_id: e.target.value })} placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">LinkedIn Partner ID</Label>
            <Input value={form.linkedin_partner_id ?? ""} onChange={(e) => set({ linkedin_partner_id: e.target.value })} placeholder="123456" />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Tags load on public pages only — never inside the dashboard. Page views are tracked on
            every route change, including Arabic URLs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Custom code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Head snippet</Label>
            <Textarea
              rows={6}
              spellCheck={false}
              className="font-mono text-xs"
              value={form.custom_head_html ?? ""}
              onChange={(e) => set({ custom_head_html: e.target.value })}
              placeholder="<!-- verification meta tags, other marketing scripts -->"
            />
            <p className="text-xs text-muted-foreground">
              Good place for search-console / Bing verification meta tags.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Body snippet</Label>
            <Textarea
              rows={6}
              spellCheck={false}
              className="font-mono text-xs"
              value={form.custom_body_html ?? ""}
              onChange={(e) => set({ custom_body_html: e.target.value })}
              placeholder="<!-- chat widgets, noscript pixels -->"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Only paste code from providers you trust — it runs on every public page.
          </p>
        </CardContent>
      </Card>

      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        <Save className="mr-1 h-4 w-4" />
        {save.isPending ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
