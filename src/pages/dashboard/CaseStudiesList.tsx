import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-green-500/15 text-green-700 dark:text-green-400",
  scheduled: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  trashed: "bg-destructive/15 text-destructive",
};

export default function CaseStudiesList() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["case-studies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("id, title, client_name, industry, status, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function del(id: string) {
    if (!confirm("Delete this case study?")) return;
    const { error } = await supabase.from("case_studies").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["case-studies"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Case Studies</h1>
          <p className="text-sm text-muted-foreground">Client success stories.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/case-studies/new")}>
          <Plus className="mr-1 h-4 w-4" /> New Case Study
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {q.isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            ) : (q.data?.length ?? 0) === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No case studies yet. <Link to="/dashboard/case-studies/new" className="text-primary underline">Create one</Link>.</TableCell></TableRow>
            ) : q.data!.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell><Link to={`/dashboard/case-studies/${r.id}`} className="font-medium hover:underline">{r.title}</Link></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.client_name ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.industry ?? "—"}</TableCell>
                <TableCell><span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[r.status] ?? ""}`}>{r.status}</span></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.updated_at), { addSuffix: true })}</TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
