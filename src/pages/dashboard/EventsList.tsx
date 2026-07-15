import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
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

export default function EventsList() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, event_type, starts_at, location, status, updated_at")
        .order("starts_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  async function del(id: string) {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["events"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events & Webinars</h1>
          <p className="text-sm text-muted-foreground">Upcoming and past events.</p>
        </div>
        <Button onClick={() => navigate("/dashboard/events/new")}>
          <Plus className="mr-1 h-4 w-4" /> New Event
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {q.isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
            ) : (q.data?.length ?? 0) === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No events yet. <Link to="/dashboard/events/new" className="text-primary underline">Create one</Link>.</TableCell></TableRow>
            ) : q.data!.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell><Link to={`/dashboard/events/${r.id}`} className="font-medium hover:underline">{r.title}</Link></TableCell>
                <TableCell className="text-sm capitalize text-muted-foreground">{r.event_type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.starts_at ? format(new Date(r.starts_at), "MMM d, yyyy p") : "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.location ?? "—"}</TableCell>
                <TableCell><span className={`inline-flex rounded-full px-2 py-0.5 text-xs capitalize ${statusColors[r.status] ?? ""}`}>{r.status}</span></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
