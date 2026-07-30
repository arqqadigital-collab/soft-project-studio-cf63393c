import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { SeoEditor } from "@/components/dashboard/SeoEditor";

type EntityType = "page" | "post" | "case_study" | "event";

type Row = {
  entityType: EntityType;
  id: string;
  title: string;
  slug: string | null;
  status: string | null;
  publicUrl: string;
};

function publicUrlFor(type: EntityType, slug: string | null, routePath?: string | null) {
  if (type === "page") return routePath || "/";
  if (type === "post") return `/blog/${slug ?? ""}`;
  if (type === "case_study") return `/case-studies/${slug ?? ""}`;
  return `/events/${slug ?? ""}`;
}

export function SeoContentList() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const q = useQuery({
    queryKey: ["seo-content-list"],
    queryFn: async (): Promise<Row[]> => {
      const [pages, posts, caseStudies, events] = await Promise.all([
        supabase.from("pages").select("id, title, slug, status, route_path").order("title"),
        supabase.from("posts").select("id, title, slug, status").order("title"),
        supabase.from("case_studies").select("id, title, slug, status").order("title"),
        supabase.from("events").select("id, title, slug, status").order("title"),
      ]);
      if (pages.error) throw pages.error;
      if (posts.error) throw posts.error;
      if (caseStudies.error) throw caseStudies.error;
      if (events.error) throw events.error;

      const rows: Row[] = [
        ...(pages.data ?? []).map((p) => ({
          entityType: "page" as const,
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          publicUrl: publicUrlFor("page", p.slug, p.route_path),
        })),
        ...(posts.data ?? []).map((p) => ({
          entityType: "post" as const,
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          publicUrl: publicUrlFor("post", p.slug),
        })),
        ...(caseStudies.data ?? []).map((c) => ({
          entityType: "case_study" as const,
          id: c.id,
          title: c.title,
          slug: c.slug,
          status: c.status,
          publicUrl: publicUrlFor("case_study", c.slug),
        })),
        ...(events.data ?? []).map((e) => ({
          entityType: "event" as const,
          id: e.id,
          title: e.title,
          slug: e.slug,
          status: e.status,
          publicUrl: publicUrlFor("event", e.slug),
        })),
      ];
      return rows;
    },
  });

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    if (!search.trim()) return rows;
    const s = search.trim().toLowerCase();
    return rows.filter((r) => r.title.toLowerCase().includes(s));
  }, [q.data, search]);

  const typeLabel: Record<EntityType, string> = {
    page: "Page",
    post: "Blog",
    case_study: "Case Study",
    event: "Event",
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium">Pages &amp; posts SEO</h2>
        <p className="text-xs text-muted-foreground">
          Pick any page, blog post, case study, or event to edit its search-engine title,
          description, and social preview image.
        </p>
      </div>

      <Input
        placeholder="Search by title…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {q.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : q.error ? (
        <p className="text-sm text-destructive">{(q.error as any).message ?? "Failed to load"}</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={`${r.entityType}-${r.id}`}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{typeLabel[r.entityType]}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">
                  {r.status ?? "—"}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="outline" onClick={() => setEditing(r)}>
                    Edit SEO
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.title ?? "SEO"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <SeoEditor
              entityType={editing.entityType}
              entityId={editing.id}
              fallbackTitle={editing.title}
              publicUrl={editing.publicUrl}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
