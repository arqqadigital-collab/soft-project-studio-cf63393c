import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Copy, RotateCcw } from "lucide-react";
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
  google_site_verification: string | null;
  clarity_project_id: string | null;
};

const EMPTY: Row = {
  ga4_id: "",
  gtm_id: "",
  meta_pixel_id: "",
  linkedin_partner_id: "",
  custom_head_html: "",
  custom_body_html: "",
  google_site_verification: "",
  clarity_project_id: "",
};

const UTM_EMPTY = {
  url: "",
  source: "",
  medium: "",
  campaign: "",
  content: "",
  term: "",
};

/** Dashboard-only UTM link builder — nothing here ships to the public site. */
function CampaignUrlBuilder() {
  const [f, setF] = useState({ ...UTM_EMPTY });
  const set = (patch: Partial<typeof UTM_EMPTY>) => setF((p) => ({ ...p, ...patch }));

  const result = useMemo(() => {
    const base = f.url.trim();
    if (!base) return "";
    const withProtocol = /^https?:\/\//i.test(base) ? base : `https://${base}`;
    let url: URL;
    try {
      url = new URL(withProtocol);
    } catch {
      return "";
    }
    const params: [string, string][] = [
      ["utm_source", f.source],
      ["utm_medium", f.medium],
      ["utm_campaign", f.campaign],
      ["utm_content", f.content],
      ["utm_term", f.term],
    ];
    for (const [key, value] of params) {
      const v = value.trim();
      if (v) url.searchParams.set(key, v);
      else url.searchParams.delete(key);
    }
    return url.toString();
  }, [f]);

  const invalidUrl = f.url.trim().length > 0 && !result;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Campaign URL builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">Landing URL</Label>
            <Input
              value={f.url}
              onChange={(e) => set({ url: e.target.value })}
              placeholder="https://example.com/contact"
            />
            {invalidUrl ? (
              <p className="text-xs text-destructive">That doesn’t look like a valid URL.</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Campaign source</Label>
            <Input value={f.source} onChange={(e) => set({ source: e.target.value })} placeholder="google" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Campaign medium</Label>
            <Input value={f.medium} onChange={(e) => set({ medium: e.target.value })} placeholder="cpc" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Campaign name</Label>
            <Input value={f.campaign} onChange={(e) => set({ campaign: e.target.value })} placeholder="spring_launch" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Campaign content</Label>
            <Input value={f.content} onChange={(e) => set({ content: e.target.value })} placeholder="banner_a" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Campaign term</Label>
            <Input value={f.term} onChange={(e) => set({ term: e.target.value })} placeholder="hospital software" />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Generated URL</Label>
          <div className="break-all rounded-md border bg-muted/40 p-3 font-mono text-xs">
            {result || "Enter a landing URL to generate a tracked link."}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={!result}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result);
                toast.success("Campaign URL copied");
              } catch {
                toast.error("Could not copy — select the URL manually.");
              }
            }}
          >
            <Copy className="mr-1 h-4 w-4" /> Copy
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setF({ ...UTM_EMPTY })}>
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          This tool runs only inside the dashboard — it adds nothing to the public website.
        </p>
      </CardContent>
    </Card>
  );
}

export function SeoMarketing() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Row>(EMPTY);

  const q = useQuery({
    queryKey: ["seo-marketing"],
    queryFn: async (): Promise<Row | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "ga4_id, gtm_id, meta_pixel_id, linkedin_partner_id, custom_head_html, custom_body_html, google_site_verification, clarity_project_id",
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
        google_site_verification: form.google_site_verification || null,
        clarity_project_id: form.clarity_project_id || null,
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
          <CardTitle className="text-sm">Analytics</CardTitle>
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
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Tags load on public pages only — never inside the dashboard. Page views are tracked on
            every route change, including Arabic URLs.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Advertising</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Meta (Facebook) Pixel ID</Label>
            <Input value={form.meta_pixel_id ?? ""} onChange={(e) => set({ meta_pixel_id: e.target.value })} placeholder="1234567890" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">LinkedIn Partner ID</Label>
            <Input value={form.linkedin_partner_id ?? ""} onChange={(e) => set({ linkedin_partner_id: e.target.value })} placeholder="123456" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Verification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Google Search Console verification</Label>
            <Input
              value={form.google_site_verification ?? ""}
              onChange={(e) => set({ google_site_verification: e.target.value })}
              placeholder='token or <meta name="google-site-verification" content="..." />'
            />
            <p className="text-xs text-muted-foreground">
              Paste the token or the whole meta tag — the tag is added to the public site’s
              &lt;head&gt; automatically.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Microsoft Clarity Project ID</Label>
            <Input
              value={form.clarity_project_id ?? ""}
              onChange={(e) => set({ clarity_project_id: e.target.value })}
              placeholder="abcd1234ef"
            />
            <p className="text-xs text-muted-foreground">
              Loads the official Clarity script on public pages only.
            </p>
          </div>
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
              Good place for other verification meta tags (Bing, Pinterest…).
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

      <CampaignUrlBuilder />
    </div>
  );
}
