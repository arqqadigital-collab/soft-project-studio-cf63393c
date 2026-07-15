import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { History, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type EntityType = "post" | "page";

interface Revision {
  id: string;
  created_at: string;
  editor_id: string | null;
  snapshot: Record<string, any>;
}

interface Props {
  entityType: EntityType;
  entityId: string | null;
  /** Fields to restore from a chosen revision snapshot. */
  restorableFields: string[];
  /** Called with the field subset to apply, then user confirms + saves. */
  onRestore: (snapshot: Record<string, any>) => void;
}

export function RevisionsPanel({ entityType, entityId, restorableFields, onRestore }: Props) {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<Revision | null>(null);

  const query = useQuery({
    queryKey: ["revisions", entityType, entityId],
    enabled: !!entityId,
    queryFn: async (): Promise<Revision[]> => {
      const { data, error } = await supabase
        .from("content_revisions")
        .select("id, created_at, editor_id, snapshot")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as Revision[];
    },
  });

  function restore(rev: Revision) {
    const subset: Record<string, any> = {};
    for (const key of restorableFields) {
      if (key in rev.snapshot) subset[key] = rev.snapshot[key];
    }
    onRestore(subset);
    setPreview(null);
    toast.success("Revision loaded — review and save to keep the changes");
    qc.invalidateQueries({ queryKey: ["revisions", entityType, entityId] });
  }

  if (!entityId) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <History className="h-4 w-4" /> Revisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (query.data ?? []).length === 0 ? (
          <p className="text-xs text-muted-foreground">No previous versions yet.</p>
        ) : (
          <ScrollArea className="max-h-64 pr-2">
            <ul className="space-y-1">
              {query.data!.map((rev) => (
                <li key={rev.id}>
                  <button
                    type="button"
                    onClick={() => setPreview(rev)}
                    className="flex w-full items-center justify-between rounded-md border border-transparent px-2 py-1.5 text-left text-xs hover:border-border hover:bg-muted"
                  >
                    <span>{formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })}</span>
                    <span className="truncate text-muted-foreground">
                      {String(rev.snapshot.status ?? "")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Restore this revision?</DialogTitle>
            <DialogDescription>
              Loading a revision replaces the editor fields with the older version. Your current
              edits stay unsaved until you press Save or Publish.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="max-h-72 overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
              <div className="mb-2 font-medium">
                {new Date(preview.created_at).toLocaleString()}
              </div>
              <div className="mb-1"><span className="text-muted-foreground">Title:</span> {String(preview.snapshot.title ?? "")}</div>
              <div className="mb-1"><span className="text-muted-foreground">Status:</span> {String(preview.snapshot.status ?? "")}</div>
              <div className="mt-2 line-clamp-6 whitespace-pre-wrap opacity-80">
                {String(preview.snapshot.content ?? "").replace(/<[^>]+>/g, " ").slice(0, 600)}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPreview(null)}>Cancel</Button>
            <Button onClick={() => preview && restore(preview)}>
              <RotateCcw className="mr-1 h-4 w-4" /> Load into editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
