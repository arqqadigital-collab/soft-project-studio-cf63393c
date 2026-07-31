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
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import type { OrganizationSettings } from "@/components/SiteSchema";

type Row = {
  id?: string;
  site_title: string | null;
  site_url: string | null;
  site_alternate_name: string | null;
  default_og_image_url: string | null;
  twitter_handle: string | null;
  organization: OrganizationSettings | null;
};

export function SeoSocialSchema() {
  const qc = useQueryClient();
  const [ogImage, setOgImage] = useState("");
  const [twitter, setTwitter] = useState("");
  const [org, setOrg] = useState<OrganizationSettings>({});
  const [sameAs, setSameAs] = useState("");
  const [picker, setPicker] = useState(false);
  const [altName, setAltName] = useState("");

  const q = useQuery({
    queryKey: ["seo-social-schema"],
    queryFn: async (): Promise<Row | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("id, site_title, site_url, site_alternate_name, default_og_image_url, twitter_handle, organization")
        .maybeSingle();
      if (error) throw error;
      return data as Row | null;
    },
  });

  useEffect(() => {
    if (!q.data) return;
    setOgImage(q.data.default_og_image_url ?? "");
    setTwitter(q.data.twitter_handle ?? "");
    setAltName(q.data.site_alternate_name ?? "");
    const o = (q.data.organization ?? {}) as OrganizationSettings;
    setOrg(o);
    setSameAs((o.same_as ?? []).join("\n"));
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        site_alternate_name: altName || null,
        default_og_image_url: ogImage || null,
        twitter_handle: twitter || null,
        organization: {
          ...org,
          same_as: sameAs
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      };
      const { error } = await supabase
        .from("site_settings")
        .update(payload)
        .eq("singleton", true);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Social & structured data saved");
      qc.invalidateQueries({ queryKey: ["seo-social-schema"] });
      qc.invalidateQueries({ queryKey: ["site-settings-head"] });
      qc.invalidateQueries({ queryKey: ["site-settings-schema"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const set = (patch: Partial<OrganizationSettings>) => setOrg((o) => ({ ...o, ...patch }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Social sharing defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">Default share image (Open Graph / Twitter)</Label>
            {ogImage ? (
              <img
                src={ogImage}
                alt="Default social share preview"
                className="h-32 rounded border bg-muted object-contain p-2"
              />
            ) : null}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setPicker(true)}>
                Choose image
              </Button>
              {ogImage ? (
                <Button type="button" variant="ghost" onClick={() => setOgImage("")}>
                  Remove
                </Button>
              ) : null}
            </div>
            <p className="text-xs text-muted-foreground">
              Used whenever a page or post has no image of its own. Recommended 1200×630.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Twitter / X handle</Label>
            <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@company" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Website (structured data)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Site name</Label>
            <Input value={q.data?.site_title ?? ""} readOnly disabled />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Site URL</Label>
            <Input value={q.data?.site_url ?? ""} readOnly disabled />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">Alternate name (optional)</Label>
            <Input
              value={altName}
              onChange={(e) => setAltName(e.target.value)}
              placeholder="Short name or acronym, e.g. SBS"
            />
            <p className="text-xs text-muted-foreground">
              WebSite JSON-LD is generated automatically from the site name and URL in Settings —
              only the alternate name is set here.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Organization (structured data)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Name (EN)</Label>
            <Input value={org.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">الاسم (AR)</Label>
            <Input dir="rtl" value={org.name_ar ?? ""} onChange={(e) => set({ name_ar: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Legal name</Label>
            <Input value={org.legal_name ?? ""} onChange={(e) => set({ legal_name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Logo URL</Label>
            <Input value={org.logo_url ?? ""} onChange={(e) => set({ logo_url: e.target.value })} placeholder="Falls back to site logo" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Phone</Label>
            <Input value={org.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Email</Label>
            <Input value={org.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Street</Label>
            <Input value={org.street ?? ""} onChange={(e) => set({ street: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">City</Label>
            <Input value={org.city ?? ""} onChange={(e) => set({ city: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Region / State</Label>
            <Input value={org.region ?? ""} onChange={(e) => set({ region: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Postal code</Label>
            <Input value={org.postal_code ?? ""} onChange={(e) => set({ postal_code: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Country</Label>
            <Input value={org.country ?? ""} onChange={(e) => set({ country: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs">Social profiles (one URL per line)</Label>
            <Textarea
              rows={4}
              value={sameAs}
              onChange={(e) => setSameAs(e.target.value)}
              placeholder={"https://linkedin.com/company/...\nhttps://x.com/..."}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Helps Google connect your website with your official profiles (knowledge panel).
            </p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => save.mutate()} disabled={save.isPending}>
        <Save className="mr-1 h-4 w-4" />
        {save.isPending ? "Saving…" : "Save changes"}
      </Button>

      <MediaPickerDialog
        open={picker}
        onOpenChange={setPicker}
        onPick={(m) => {
          setOgImage(m.file_url);
          setPicker(false);
        }}
      />
    </div>
  );
}
