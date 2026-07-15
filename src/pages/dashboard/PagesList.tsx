import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";

type PageRow = {
  id: string; title: string; slug: string; status: string;
  updated_at: string; parent_id: string | null; template: string;
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-500/15 text-green-700 dark:text-green-400",
  trashed: "bg-destructive/15 text-destructive",
};

// Build indented rows (parents first, then children)
function buildTree(rows: PageRow[]): { row: PageRow; depth: number }[] {
  const byParent = new Map<string | null, PageRow[]>();
  for (const r of rows) {
    const key = r.parent_id;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(r);
  }
  const out: { row: PageRow; depth: number }[] = [];
  function walk(parent: string | null, depth: number) {
    const children = byParent.get(parent) ?? [];
    children.sort((a, b) => a.title.localeCompare(b.title));
    for (const c of children) {
      out.push({ row: c, depth });
      walk(c.id, depth + 1);
    }
  }
  walk(null, 0);
  // Include any orphans whose parent isn't in the set
  const includedIds = new Set(out.map((o) => o.row.id));
  for (const r of rows) if (!includedIds.has(r.id)) out.push({ row: r, depth: 0 });
  return out;
}

export default function PagesList() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const pages = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id, title, slug, status, updated_at, parent_id, template")
        .order("title");
      if (error) throw error;
      return data as PageRow[];
    },
  });

  const tree = useMemo(() => buildTree(pages.data ?? []), [pages.data]);

  async function bulkDelete() {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} page(s)?`)) return;
    const { error } = await supabase.from("pages").delete().in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["pages"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-muted-foreground">Standalone pages, nestable as parent/child.</p>
        </div>
        <div className="flex gap-2">
          {selected.size > 0 && (
            <Button variant="destructive" size="sm" onClick={bulkDelete}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete ({selected.size})
            </Button>
          )}
          <Button onClick={() => navigate("/dashboard/pages/new")}>
            <Plus className="mr-1 h-4 w-4" /> New Page
          </Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={tree.length > 0 && selected.size === tree.length}
                  onCheckedChange={(v) => setSelected(v ? new Set(tree.map((r) => r.row.id)) : new Set())}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-muted/40">
              <TableCell></TableCell>
              <TableCell>
                <Link to="/dashboard/homepage" className="inline-flex items-center gap-2 font-medium hover:underline">
                  <Home className="h-4 w-4 text-primary" />
                  Homepage
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    Front page
                  </span>
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">hero</TableCell>
              <TableCell>
                <span className="inline-flex rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-700 dark:text-green-400">
                  Published
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">Always live at /</TableCell>
            </TableRow>
            {pages.isLoading ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            ) : tree.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                No custom pages yet. <Link to="/dashboard/pages/new" className="text-primary underline">Create one</Link>.
              </TableCell></TableRow>
            ) : tree.map(({ row, depth }) => (
              <TableRow key={row.id}>
                <TableCell><Checkbox checked={selected.has(row.id)} onCheckedChange={(v) => {
                  setSelected((s) => { const n = new Set(s); v ? n.add(row.id) : n.delete(row.id); return n; });
                }} /></TableCell>
                <TableCell style={{ paddingLeft: 16 + depth * 20 }}>
                  <Link to={`/dashboard/pages/${row.id}`} className="font-medium hover:underline">
                    {depth > 0 && <span className="text-muted-foreground">— </span>}
                    {row.title}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground capitalize">{row.template}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[row.status] ?? ""}`}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(row.updated_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
