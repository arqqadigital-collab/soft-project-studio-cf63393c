import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown, ChevronRight, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Plus,
} from "lucide-react";
import { SECTION_REGISTRY, SECTION_KINDS, type SectionKind } from "@/lib/pageSections";

type Row = { id: string; kind: SectionKind; position: number; is_visible: boolean; data: any };

export function PageBuilder({ pageId }: { pageId: string }) {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const q = useQuery({
    queryKey: ["page-sections", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("id, kind, position, is_visible, data")
        .eq("page_id", pageId)
        .order("position");
      if (error) throw error;
      return data as Row[];
    },
  });

  const rows = q.data ?? [];

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["page-sections", pageId] });
  }

  async function addSection(kind: SectionKind) {
    const def = SECTION_REGISTRY[kind];
    const { error } = await supabase.from("page_sections").insert({
      page_id: pageId,
      kind,
      position: rows.length,
      data: def.defaultData,
    });
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function updateData(id: string, data: any) {
    const { error } = await supabase.from("page_sections").update({ data }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function toggleVisible(id: string, current: boolean) {
    const { error } = await supabase.from("page_sections").update({ is_visible: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this section?")) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("page_sections").update({ position: b.position }).eq("id", a.id),
      supabase.from("page_sections").update({ position: a.position }).eq("id", b.id),
    ]);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    invalidate();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sections</h3>
          <p className="text-xs text-muted-foreground">Add, reorder and edit the blocks that make up this page.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add section</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {SECTION_KINDS.map((k) => {
              const def = SECTION_REGISTRY[k];
              return (
                <DropdownMenuItem key={k} onClick={() => addSection(k)}>
                  <div>
                    <div className="font-medium">{def.label}</div>
                    <div className="text-xs text-muted-foreground">{def.description}</div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {q.isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Loading sections…</div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No sections yet. Click <b>Add section</b> to build this page.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row, i) => {
            const def = SECTION_REGISTRY[row.kind];
            if (!def) return null;
            const isOpen = !!expanded[row.id];
            const Edit = def.Edit;
            return (
              <Card key={row.id} className={row.is_visible ? "" : "opacity-60"}>
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 py-3">
                  <button
                    onClick={() => setExpanded((s) => ({ ...s, [row.id]: !s[row.id] }))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <CardTitle className="text-sm">
                    {def.label}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {sectionSummary(row)}
                    </span>
                  </CardTitle>
                  <div className="ml-auto flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisible(row.id, row.is_visible)} title={row.is_visible ? "Hide" : "Show"}>
                      {row.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(row.id)} title="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                {isOpen && (
                  <CardContent>
                    <SectionEditForm
                      initial={row.data ?? {}}
                      onSave={(next) => updateData(row.id, next)}
                      Edit={Edit}
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function sectionSummary(row: Row) {
  const d = row.data ?? {};
  return d.headline || d.heading || d.title || "";
}

function SectionEditForm({
  initial, onSave, Edit,
}: {
  initial: any;
  onSave: (next: any) => void;
  Edit: React.ComponentType<{ data: any; onChange: (n: any) => void }>;
}) {
  const [draft, setDraft] = useState(initial);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  return (
    <div className="space-y-4">
      <Edit data={draft} onChange={setDraft} />
      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => setDraft(initial)} disabled={!dirty}>Reset</Button>
        <Button size="sm" onClick={() => onSave(draft)} disabled={!dirty}>Save section</Button>
      </div>
    </div>
  );
}
