import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, RotateCcw, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";
import { normalizePath, isExternalTarget } from "@/components/PathRedirect";
import { SeoContentList } from "@/components/dashboard/SeoContentList";
import { SeoSocialSchema } from "@/components/dashboard/SeoSocialSchema";
import { SeoMarketing } from "@/components/dashboard/SeoMarketing";
import { triggerSeoSync } from "@/lib/seoSync";


const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /login
Disallow: /preview/

Sitemap: ${typeof window !== "undefined" ? window.location.origin : ""}/sitemap.xml
`;


type Redirect = {
  id: string;
  entity_type: string;
  old_slug: string;
  new_slug: string;
  created_at: string;
};

/** Legacy rows stored bare slugs per type; new rows store full paths. */
function displayUrl(r: Redirect, value: string) {
  if (isExternalTarget(value)) return value;
  if (r.entity_type === "path") return normalizePath(value);
  if (r.entity_type === "post") return `/blog/${value}`;
  if (r.entity_type === "case_study") return `/case-studies/${value}`;
  if (r.entity_type === "event") return `/events/${value}`;
  return `/${value}`;
}

export default function SeoDashboard() {
  const qc = useQueryClient();

  const [oldSlug, setOldSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [robots, setRobots] = useState("");

  const robotsQuery = useQuery({
    queryKey: ["site_settings_robots"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("robots_txt")
        .eq("singleton", true)
        .maybeSingle();
      if (error) throw error;
      if (data?.robots_txt && data.robots_txt.length > 0) return data.robots_txt;
      // Fall back to the live /robots.txt so the editor pre-fills with what's served today.
      try {
        const res = await fetch("/robots.txt", { cache: "no-store" });
        if (res.ok) return await res.text();
      } catch {}
      return DEFAULT_ROBOTS;
    },
  });

  useEffect(() => {
    if (typeof robotsQuery.data === "string") setRobots(robotsQuery.data);
  }, [robotsQuery.data]);

  const saveRobots = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ robots_txt: content })
        .eq("singleton", true);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site_settings_robots"] });
      toast.success("robots.txt updated");
      triggerSeoSync();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSaveRobots = () => {
    if (robots.trim().length === 0) {
      const ok = window.confirm(
        "robots.txt is empty. Saving this will remove all crawler rules. Continue?",
      );
      if (!ok) return;
    }
    saveRobots.mutate(robots);
  };


  const query = useQuery({
    queryKey: ["slug_redirects"],
    queryFn: async (): Promise<Redirect[]> => {
      const { data, error } = await supabase
        .from("slug_redirects")
        .select("id, entity_type, old_slug, new_slug, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as Redirect[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const from = normalizePath(oldSlug);
      const to = isExternalTarget(newSlug) ? newSlug.trim() : normalizePath(newSlug);
      if (!oldSlug.trim() || !newSlug.trim()) throw new Error("Both URLs are required");
      if (from === to) throw new Error("Old and new URL must differ");
      const { error } = await supabase.from("slug_redirects").upsert(
        { entity_type: "path", old_slug: from, new_slug: to },
        { onConflict: "entity_type,old_slug" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      setOldSlug("");
      setNewSlug("");
      qc.invalidateQueries({ queryKey: ["slug_redirects"] });
      qc.invalidateQueries({ queryKey: ["path_redirects"] });
      toast.success("Redirect saved");
      triggerSeoSync();
    },
    onError: (e: any) => toast.error(e.message),
  });


  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("slug_redirects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["slug_redirects"] });
      toast.success("Redirect removed");
      triggerSeoSync();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">SEO</h1>
        <p className="text-sm text-muted-foreground">
          Edit per-page search listings, manage URL redirects, and control crawling.
        </p>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Pages &amp; Posts</TabsTrigger>
          <TabsTrigger value="social">Social &amp; Schema</TabsTrigger>
          <TabsTrigger value="redirects">Redirects</TabsTrigger>
          <TabsTrigger value="feeds">Feeds &amp; Robots</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-4 pt-4">
          <SeoSocialSchema />
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4 pt-4">
          <SeoMarketing />
        </TabsContent>


        <TabsContent value="content" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <SeoContentList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redirects" className="space-y-6 pt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add a redirect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <div className="space-y-1.5">
              <Label className="text-xs">From (old URL)</Label>
              <Input
                value={oldSlug}
                onChange={(e) => setOldSlug(e.target.value)}
                placeholder="/old-site-page or https://old-site.com/page"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To (new URL)</Label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="/new-page"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => create.mutate()} disabled={create.isPending}>
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Paste any full path from your old website (e.g. <code>/services/old-page</code> or a
            full <code>https://old-site.com/...</code> URL — only the path is used). Visitors
            hitting that URL are sent to the new one automatically. The target can be an internal
            path or an external URL.
          </p>

        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Existing redirects</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (query.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No redirects yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data!.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{displayUrl(r, r.old_slug)}</TableCell>
                    <TableCell className="font-mono text-xs">{displayUrl(r, r.new_slug)}</TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(r.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="feeds" className="space-y-6 pt-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Feeds &amp; discovery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Sitemap:</span>{" "}
            <a
              className="text-primary underline"
              href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sitemap`}
              target="_blank"
              rel="noreferrer"
            >
              /functions/v1/sitemap
            </a>
          </p>
          <p>
            <span className="text-muted-foreground">RSS:</span>{" "}
            <a
              className="text-primary underline"
              href={`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rss`}
              target="_blank"
              rel="noreferrer"
            >
              /functions/v1/rss
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            The sitemap URL is already listed in <code>robots.txt</code>. Set your site URL in
            Settings so both feeds emit absolute links.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Robots.txt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={robots}
            onChange={(e) => setRobots(e.target.value)}
            rows={12}
            spellCheck={false}
            className="font-mono text-xs"
            placeholder={robotsQuery.isLoading ? "Loading…" : DEFAULT_ROBOTS}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleSaveRobots} disabled={saveRobots.isPending}>
              <Save className="mr-1 h-4 w-4" />
              Save changes
            </Button>
            <Button
              variant="outline"
              onClick={() => setRobots(DEFAULT_ROBOTS)}
              disabled={saveRobots.isPending}
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              Reset to default
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Changes apply immediately. This controls which pages search engines are allowed to
            crawl.
          </p>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
