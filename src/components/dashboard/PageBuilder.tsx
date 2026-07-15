import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Plus,
} from "lucide-react";
import { SECTION_REGISTRY, SECTION_KINDS, type SectionKind, type SectionDef } from "@/lib/pageSections";

type Row = { id: string; kind: SectionKind; position: number; is_visible: boolean; data: any };

export function PageBuilder({ pageId }: { pageId: string }) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

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
        <Tabs
          value={activeTab ?? rows[0].id}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">
            {rows.map((row) => {
              const def = SECTION_REGISTRY[row.kind];
              if (!def) return null;
              return (
                <TabsTrigger
                  key={row.id}
                  value={row.id}
                  className={`data-[state=active]:bg-background ${row.is_visible ? "" : "opacity-60"}`}
                >
                  {sectionDisplayName(row, def.label)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {rows.map((row, i) => {
            const def = SECTION_REGISTRY[row.kind];
            if (!def) return null;
            return (
              <TabsContent key={row.id} value={row.id} className="mt-4">
                <Card className={row.is_visible ? "" : "opacity-60"}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                      <div className="text-sm font-semibold">
                        {sectionDisplayName(row, def.label)}
                        <span className="ml-2 text-xs font-normal uppercase tracking-wider text-muted-foreground/70">
                          {def.label}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, -1)} disabled={i === 0} title="Move left">
                          <ArrowUp className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Move right">
                          <ArrowDown className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisible(row.id, row.is_visible)} title={row.is_visible ? "Hide" : "Show"}>
                          {row.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(row.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <SectionEditForm
                      initial={row.data ?? {}}
                      onSave={(next) => updateData(row.id, next)}
                      def={def}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
}

function sectionSummary(row: Row) {
  const d = row.data ?? {};
  return d.headline || d.heading || d.title || "";
}

function sectionDisplayName(row: Row, fallback: string) {
  const d = row.data ?? {};
  return d.section_name || d.eyebrow || d.heading || d.headline || d.title || fallback;
}

function collectImages(data: any): string[] {
  const out = new Set<string>();
  const walk = (v: any) => {
    if (!v) return;
    if (typeof v === "string") {
      if (/^(https?:|\/|data:image)/.test(v) && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(v)) {
        out.add(v);
      }
      return;
    }
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      for (const k of Object.keys(v)) {
        if (/(url|logo|image|src|thumb|cover|media)/i.test(k) && typeof v[k] === "string" && v[k]) {
          out.add(v[k]);
        } else {
          walk(v[k]);
        }
      }
    }
  };
  walk(data);
  return Array.from(out).filter((u) => !/\.(mp4|webm|mov)(\?|$)/i.test(u));
}

function SectionEditForm({
  initial, onSave, def,
}: {
  initial: any;
  onSave: (next: any) => void;
  def: SectionDef;
}) {
  const [draft, setDraft] = useState(initial);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const Edit = def.Edit;
  const Render = def.Render;
  const images = useMemo(() => collectImages(draft), [draft]);
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <label className="text-xs font-medium text-muted-foreground">Section name (dashboard label)</label>
        <input
          type="text"
          value={draft.section_name ?? ""}
          onChange={(e) => setDraft({ ...draft, section_name: e.target.value })}
          placeholder={def.label}
          className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Edit data={draft} onChange={setDraft} />
        </div>
        <div className="space-y-3">
          <div className="rounded-md border border-border">
            <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
              Live preview
            </div>
            <div className="max-h-[520px] overflow-auto bg-background">
              <div className="origin-top-left scale-[0.6]" style={{ width: "166.67%" }}>
                <Render data={draft} />
              </div>
            </div>
          </div>
          <div className="rounded-md border border-border">
            <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
              Images used ({images.length})
            </div>
            {images.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground">No images in this section.</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 p-3">
                {images.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noreferrer" className="block">
                    <img src={u} alt="" className="h-20 w-full rounded border object-cover" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => setDraft(initial)} disabled={!dirty}>Reset</Button>
        <Button size="sm" onClick={() => onSave(draft)} disabled={!dirty}>Save section</Button>
      </div>
    </div>
  );
}
