import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Search as SearchIcon, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type StatusFilter = "all" | "draft" | "published" | "scheduled" | "trashed";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-500/15 text-green-700 dark:text-green-400",
  scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  trashed: "bg-destructive/15 text-destructive",
};

export default function PostsList() {
  const { user } = useAuth();
  const { atLeast } = useRoles();
  const canManageAll = atLeast("editor");
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const categories = useQuery({
    queryKey: ["categories", "blog"],
    queryFn: async () => {
      const { data, error } = await (supabase.from("categories") as any).select("id, name").eq("content_type", "blog").order("name");
      if (error) throw error;
      return data;
    },
  });

  const posts = useQuery({
    queryKey: ["posts", { status, categoryId, search, canManageAll, userId: user?.id }],
    queryFn: async () => {
      let q = supabase
        .from("posts")
        .select("id, title, status, updated_at, published_at, author_id, category_id, profiles:author_id(full_name), categories:category_id(name)")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (status !== "all") q = q.eq("status", status);
      if (categoryId !== "all") q = q.eq("category_id", categoryId);
      if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const rows = useMemo(() => posts.data ?? [], [posts.data]);

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function bulkDelete() {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} post(s)? This can't be undone.`)) return;
    const { error } = await supabase.from("posts").delete().in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["posts"] });
  }

  async function bulkStatus(newStatus: "draft" | "published" | "trashed") {
    if (!selected.size) return;
    const { error } = await supabase.from("posts").update({ status: newStatus }).in("id", Array.from(selected));
    if (error) return toast.error(error.message);
    toast.success(`Marked ${newStatus}`);
    setSelected(new Set());
    qc.invalidateQueries({ queryKey: ["posts"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">
            {canManageAll ? "All posts across the site." : "Your posts."}
          </p>
        </div>
        <Button onClick={() => navigate("/dashboard/posts/new")}>
          <Plus className="mr-1 h-4 w-4" /> New Post
        </Button>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search title…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="trashed">Trashed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.data?.map((c: { id: string; name: string }) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selected.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selected.size} selected</Badge>
              <Select onValueChange={(v) => bulkStatus(v as any)}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Change status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="trashed">Trashed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="destructive" size="sm" onClick={bulkDelete}>
                <Trash2 className="mr-1 h-4 w-4" /> Delete
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={rows.length > 0 && selected.size === rows.length}
                  onCheckedChange={(v) => setSelected(v ? new Set(rows.map((r) => r.id)) : new Set())}
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            ) : rows.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No posts. <Link to="/dashboard/posts/new" className="text-primary underline">Create one</Link>.</TableCell></TableRow>
            ) : rows.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell><Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggle(p.id)} /></TableCell>
                <TableCell>
                  <Link to={`/dashboard/posts/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.profiles?.full_name ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.categories?.name ?? "—"}</TableCell>
                <TableCell>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[p.status] ?? ""}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
