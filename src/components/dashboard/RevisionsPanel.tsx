import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { History, RotateCcw, GitCompare } from "lucide-react";
import { diffWords, diffLines } from "diff";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type EntityType = "post" | "page" | "case_study" | "event";

const TABLE_BY_TYPE: Record<EntityType, "posts" | "pages" | "case_studies" | "events"> = {
  post: "posts",
  page: "pages",
  case_study: "case_studies",
  event: "events",
};

interface Revision {
  id: string;
  created_at: string;
  editor_id: string | null;
  snapshot: Record<string, any>;
}

interface Props {
  entityType: EntityType;
  entityId: string | null;
  /** Fields to restore + diff from a chosen revision snapshot. */
  restorableFields: string[];
  /** Called with the field subset to apply, then user confirms + saves. */
  onRestore: (snapshot: Record<string, any>) => void;
}

const IMAGE_FIELDS = new Set(["featured_image_url", "image_url", "cover_image_url"]);

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function toDisplayString(v: any): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  try { return JSON.stringify(v, null, 2); } catch { return String(v); }
}

function DiffView({ oldText, newText, mode }: { oldText: string; newText: string; mode: "words" | "lines" }) {
  const parts = mode === "words" ? diffWords(oldText, newText) : diffLines(oldText, newText);
  if (!oldText && !newText) {
    return <p className="text-xs text-muted-foreground">Empty on both sides.</p>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Previous version</div>
        <div className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
          {parts.map((p, i) =>
            p.added ? null : (
              <span key={i} className={p.removed ? "bg-red-500/20 text-red-700 dark:text-red-300 line-through" : ""}>
                {p.value}
              </span>
            )
          )}
        </div>
      </div>
      <div>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Current</div>
        <div className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs leading-relaxed">
          {parts.map((p, i) =>
            p.removed ? null : (
              <span key={i} className={p.added ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300" : ""}>
                {p.value}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ImageDiff({ oldUrl, newUrl }: { oldUrl: string; newUrl: string }) {
  if (oldUrl === newUrl) {
    return <p className="text-xs text-muted-foreground">No change.</p>;
  }
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Previous</div>
        {oldUrl ? (
          <img src={oldUrl} alt="" className="w-full rounded-md border object-cover" />
        ) : (
          <div className="rounded-md border p-4 text-center text-xs text-muted-foreground">Empty</div>
        )}
      </div>
      <div>
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Current</div>
        {newUrl ? (
          <img src={newUrl} alt="" className="w-full rounded-md border object-cover" />
        ) : (
          <div className="rounded-md border p-4 text-center text-xs text-muted-foreground">Empty</div>
        )}
      </div>
    </div>
  );
}

export function RevisionsPanel({ entityType, entityId, restorableFields, onRestore }: Props) {
  const qc = useQueryClient();
  const [preview, setPreview] = useState<Revision | null>(null);

  const revisions = useQuery({
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

  // Current row for diff comparison
  const current = useQuery({
    queryKey: ["revisions-current", entityType, entityId],
    enabled: !!entityId && !!preview,
    queryFn: async () => {
      const table = TABLE_BY_TYPE[entityType];
      const { data, error } = await supabase.from(table).select("*").eq("id", entityId!).maybeSingle();
      if (error) throw error;
      return data as Record<string, any> | null;
    },
  });

  const changedFields = useMemo(() => {
    if (!preview || !current.data) return restorableFields;
    return restorableFields.filter(
      (f) => toDisplayString(preview.snapshot[f]) !== toDisplayString(current.data![f])
    );
  }, [preview, current.data, restorableFields]);

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
        {revisions.isLoading ? (
          <p className="text-xs text-muted-foreground">Loading…</p>
        ) : (revisions.data ?? []).length === 0 ? (
          <p className="text-xs text-muted-foreground">No previous versions yet.</p>
        ) : (
          <ScrollArea className="max-h-64 pr-2">
            <ul className="space-y-1">
              {revisions.data!.map((rev) => (
                <li key={rev.id}>
                  <button
                    type="button"
                    onClick={() => setPreview(rev)}
                    className="flex w-full items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 text-left text-xs hover:border-border hover:bg-muted"
                  >
                    <span className="flex items-center gap-1.5">
                      <GitCompare className="h-3 w-3 opacity-60" />
                      {formatDistanceToNow(new Date(rev.created_at), { addSuffix: true })}
                    </span>
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
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Compare with revision from{" "}
              {preview && new Date(preview.created_at).toLocaleString()}
            </DialogTitle>
            <DialogDescription>
              Restoring loads the older version into the editor. Your current edits stay unsaved
              until you press Save or Publish.
            </DialogDescription>
          </DialogHeader>

          {preview && current.isLoading && (
            <p className="text-xs text-muted-foreground">Loading current version…</p>
          )}

          {preview && current.data && (
            <>
              {changedFields.length === 0 ? (
                <p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
                  This revision is identical to the current version across the editable fields.
                </p>
              ) : (
                <Tabs defaultValue={changedFields[0]}>
                  <TabsList className="flex flex-wrap">
                    {changedFields.map((f) => (
                      <TabsTrigger key={f} value={f} className="text-xs">
                        {f.replace(/_/g, " ")}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {changedFields.map((f) => {
                    const oldVal = preview.snapshot[f];
                    const newVal = current.data![f];
                    const isImage = IMAGE_FIELDS.has(f) || /image|logo|photo/i.test(f);
                    return (
                      <TabsContent key={f} value={f} className="mt-3">
                        {isImage ? (
                          <ImageDiff oldUrl={String(oldVal ?? "")} newUrl={String(newVal ?? "")} />
                        ) : (
                          <DiffView
                            oldText={stripHtml(toDisplayString(oldVal))}
                            newText={stripHtml(toDisplayString(newVal))}
                            mode={f === "title" || f === "excerpt" ? "words" : "lines"}
                          />
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              )}
            </>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setPreview(null)}>Cancel</Button>
            <Button onClick={() => preview && restore(preview)}>
              <RotateCcw className="mr-1 h-4 w-4" /> Restore this version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
