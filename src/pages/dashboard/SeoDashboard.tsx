import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

type Redirect = {
  id: string;
  entity_type: "post" | "page";
  old_slug: string;
  new_slug: string;
  created_at: string;
};

export default function SeoDashboard() {
  const qc = useQueryClient();
  const [entityType, setEntityType] = useState<"post" | "page">("post");
  const [oldSlug, setOldSlug] = useState("");
  const [newSlug, setNewSlug] = useState("");

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
      const clean = (s: string) => s.trim().replace(/^\/+/, "").replace(/\/+$/, "");
      const from = clean(oldSlug);
      const to = clean(newSlug);
      if (!from || !to) throw new Error("Both slugs are required");
      if (from === to) throw new Error("Old and new slug must differ");
      const { error } = await supabase.from("slug_redirects").upsert(
        { entity_type: entityType, old_slug: from, new_slug: to },
        { onConflict: "entity_type,old_slug" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      setOldSlug("");
      setNewSlug("");
      qc.invalidateQueries({ queryKey: ["slug_redirects"] });
      toast.success("Redirect saved");
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
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">SEO</h1>
        <p className="text-sm text-muted-foreground">
          Per-page SEO lives inside each post/page editor. This screen manages URL redirects,
          which are also created automatically when you rename a slug.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Add a redirect</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-[130px_1fr_1fr_auto]">
            <div className="space-y-1.5">
              <Label className="text-xs">Type</Label>
              <Select value={entityType} onValueChange={(v) => setEntityType(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="page">Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">From (old slug)</Label>
              <Input
                value={oldSlug}
                onChange={(e) => setOldSlug(e.target.value)}
                placeholder="old-url"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">To (new slug)</Label>
              <Input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="new-url"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => create.mutate()} disabled={create.isPending}>
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Applies to {entityType === "post" ? "/blog/:slug" : "/p/:slug"}. Visitors hitting the
            old URL are sent to the new one automatically.
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
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data!.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="capitalize">{r.entity_type}</TableCell>
                    <TableCell className="font-mono text-xs">
                      /{r.entity_type === "post" ? "blog" : "p"}/{r.old_slug}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      /{r.entity_type === "post" ? "blog" : "p"}/{r.new_slug}
                    </TableCell>
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
    </div>
  );
}
