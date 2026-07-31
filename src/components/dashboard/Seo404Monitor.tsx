import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { EyeOff, Search, Trash2, CornerUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export type NotFoundRow = {
  id: string;
  url: string;
  referrer: string | null;
  hits: number;
  status: "open" | "redirected" | "ignored";
  first_seen: string;
  last_seen: string;
};

const STATUS_LABEL: Record<NotFoundRow["status"], string> = {
  open: "Open",
  redirected: "Redirected",
  ignored: "Ignored",
};

export function Seo404Monitor({ onCreateRedirect }: { onCreateRedirect: (url: string) => void }) {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | NotFoundRow["status"]>("all");

  const query = useQuery({
    queryKey: ["not_found_log"],
    queryFn: async (): Promise<NotFoundRow[]> => {
      const { data, error } = await supabase
        .from("not_found_log")
        .select("id,url,referrer,hits,status,first_seen,last_seen")
        .order("last_seen", { ascending: false })
        .limit(500);
      if (error) throw error;
      return (data ?? []) as NotFoundRow[];
    },
  });

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return (query.data ?? []).filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (!term) return true;
      return r.url.toLowerCase().includes(term) || (r.referrer ?? "").toLowerCase().includes(term);
    });
  }, [query.data, q, status]);

  const setStatusMut = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: NotFoundRow["status"] }) => {
      const { error } = await supabase.from("not_found_log").update({ status: next }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["not_found_log"] });
      toast.success("Status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("not_found_log").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["not_found_log"] });
      toast.success("Entry deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">404 monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute start-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search URL or referrer…"
              className="ps-8"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="redirected">Redirected</SelectItem>
              <SelectItem value="ignored">Ignored</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {query.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No 404s recorded{q || status !== "all" ? " for this filter" : ""}.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead className="w-16">Hits</TableHead>
                <TableHead>First seen</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="max-w-[220px] truncate font-mono text-xs" title={r.url}>
                    {r.url}
                  </TableCell>
                  <TableCell
                    className="max-w-[160px] truncate text-xs text-muted-foreground"
                    title={r.referrer ?? ""}
                  >
                    {r.referrer || "—"}
                  </TableCell>
                  <TableCell className="text-xs">{r.hits}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.first_seen), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.last_seen), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        r.status === "redirected"
                          ? "default"
                          : r.status === "ignored"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {STATUS_LABEL[r.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Create redirect"
                        onClick={() => onCreateRedirect(r.url)}
                      >
                        <CornerUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title={r.status === "ignored" ? "Mark as open" : "Ignore"}
                        onClick={() =>
                          setStatusMut.mutate({
                            id: r.id,
                            next: r.status === "ignored" ? "open" : "ignored",
                          })
                        }
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete"
                        onClick={() => remove.mutate(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <p className="text-xs text-muted-foreground">
          Every missing page visitors hit is grouped here by URL. Create a redirect to send that
          traffic somewhere useful — the entry stays in the history, marked as redirected.
        </p>
      </CardContent>
    </Card>
  );
}
