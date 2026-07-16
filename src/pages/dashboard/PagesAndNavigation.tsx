import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, ChevronDown, ChevronRight, FileText,
  ArrowUp, ArrowDown, Eye, EyeOff, FolderPlus, LayoutGrid, ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useMenuTree, type MenuTreeGroup } from "@/lib/menuTree";

type EditTarget =
  | { kind: "group"; id?: string; label: string }
  | { kind: "column"; id?: string; group_id: string; label: string };

export default function PagesAndNavigation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const tree = useMenuTree();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [edit, setEdit] = useState<EditTarget | null>(null);

  const groups = tree.data ?? [];

  function toggle(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["menu-tree"] });
    qc.invalidateQueries({ queryKey: ["pages"] });
  }

  async function reorder<T extends { id: string; position?: number; menu_position?: number }>(
    table: "menu_groups" | "menu_columns" | "pages",
    rows: T[],
    idx: number,
    dir: -1 | 1,
    field: "position" | "menu_position",
  ) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    const av = (a as any)[field] as number;
    const bv = (b as any)[field] as number;
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from(table).update({ [field]: bv }).eq("id", a.id),
      supabase.from(table).update({ [field]: av }).eq("id", b.id),
    ]);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    invalidate();
  }

  async function toggleVisible(
    table: "menu_groups" | "menu_columns",
    id: string,
    current: boolean,
  ) {
    const { error } = await supabase.from(table).update({ is_visible: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(table: "menu_groups" | "menu_columns", id: string, name: string) {
    if (!confirm(`Delete "${name}"? Pages inside will be unassigned from the menu, not deleted.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    invalidate();
  }

  async function deletePage(id: string, title: string) {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Page deleted");
    invalidate();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages & Navigation</h1>
          <p className="text-sm text-muted-foreground">
            One source of truth: groups → columns → pages. Every navbar entry is a real page.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEdit({ kind: "group", label: "" })}>
            <FolderPlus className="mr-1 h-4 w-4" /> New Group
          </Button>
          <Button onClick={() => navigate("/dashboard/pages/new")}>
            <Plus className="mr-1 h-4 w-4" /> New Page
          </Button>
        </div>
      </div>

      <Card className="divide-y divide-border">
        {tree.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : groups.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No menu groups yet. Create your first with <b>New Group</b>.
          </div>
        ) : (
          groups.map((g, gi) => (
            <GroupNode
              key={g.id}
              group={g}
              index={gi}
              total={groups.length}
              expanded={!!expanded[g.id]}
              onToggle={() => toggle(g.id)}
              subExpanded={expanded}
              onSubToggle={toggle}
              onEditGroup={() => setEdit({ kind: "group", id: g.id, label: g.label })}
              onDeleteGroup={() => remove("menu_groups", g.id, g.label)}
              onAddColumn={() => setEdit({ kind: "column", group_id: g.id, label: "" })}
              onEditColumn={(c) => setEdit({ kind: "column", id: c.id, group_id: g.id, label: c.label })}
              onDeleteColumn={(c) => remove("menu_columns", c.id, c.label)}
              onMoveGroup={(dir) => reorder("menu_groups", groups, gi, dir, "position")}
              onMoveColumn={(cols, i, dir) => reorder("menu_columns", cols, i, dir, "position")}
              onMovePage={(pgs, i, dir) => reorder("pages", pgs, i, dir, "menu_position")}
              onToggleGroupVisible={() => toggleVisible("menu_groups", g.id, g.is_visible)}
              onToggleColumnVisible={(c) => toggleVisible("menu_columns", c.id, c.is_visible)}
              onAddPage={(columnId) => navigate(`/dashboard/pages/new?column=${columnId}`)}
              onEditPage={(p) => navigate(`/dashboard/pages/${p.id}`)}
              onDeletePage={(p) => deletePage(p.id, p.nav_label || p.title)}
            />
          ))
        )}
      </Card>

      <EditDialog target={edit} onClose={() => setEdit(null)} onSaved={invalidate} />
    </div>
  );
}

type Col = MenuTreeGroup["columns"][number];
type Pg = Col["pages"][number];

function GroupNode(props: {
  group: MenuTreeGroup;
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  subExpanded: Record<string, boolean>;
  onSubToggle: (id: string) => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddColumn: () => void;
  onEditColumn: (c: Col) => void;
  onDeleteColumn: (c: Col) => void;
  onMoveGroup: (dir: -1 | 1) => void;
  onMoveColumn: (cols: Col[], i: number, dir: -1 | 1) => void;
  onMovePage: (pgs: Pg[], i: number, dir: -1 | 1) => void;
  onToggleGroupVisible: () => void;
  onToggleColumnVisible: (c: Col) => void;
  onAddPage: (columnId: string) => void;
  onEditPage: (p: Pg) => void;
  onDeletePage: (p: Pg) => void;
}) {
  const { group, expanded, onToggle } = props;
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3">
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <LayoutGrid className="h-4 w-4 text-primary" />
        <span className="font-semibold">{group.label}</span>
        {!group.is_visible && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
        )}
        <div className="ml-auto flex items-center gap-1">
          <IconBtn title="Move up" onClick={() => props.onMoveGroup(-1)} disabled={props.index === 0}>
            <ArrowUp className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Move down" onClick={() => props.onMoveGroup(1)} disabled={props.index === props.total - 1}>
            <ArrowDown className="h-4 w-4" />
          </IconBtn>
          <IconBtn title={group.is_visible ? "Hide" : "Show"} onClick={props.onToggleGroupVisible}>
            {group.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </IconBtn>
          <IconBtn title="Edit" onClick={props.onEditGroup}><Pencil className="h-4 w-4" /></IconBtn>
          <IconBtn title="Delete" onClick={props.onDeleteGroup}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
          <Button size="sm" variant="outline" onClick={props.onAddColumn} className="ml-2">
            <Plus className="mr-1 h-4 w-4" /> Column
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/20">
          {group.columns.length === 0 ? (
            <div className="px-12 py-3 text-sm text-muted-foreground">No columns yet.</div>
          ) : (
            group.columns.map((c, ci) => {
              const isOpen = !!props.subExpanded[c.id];
              return (
                <div key={c.id} className="border-b border-border/60 last:border-b-0">
                  <div className="flex items-center gap-2 py-2 pl-10 pr-4">
                    <button
                      onClick={() => props.onSubToggle(c.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <span className="font-medium">{c.label}</span>
                    {!c.is_visible && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <IconBtn title="Move up" onClick={() => props.onMoveColumn(group.columns, ci, -1)} disabled={ci === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn title="Move down" onClick={() => props.onMoveColumn(group.columns, ci, 1)} disabled={ci === group.columns.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn title={c.is_visible ? "Hide" : "Show"} onClick={() => props.onToggleColumnVisible(c)}>
                        {c.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </IconBtn>
                      <IconBtn title="Edit" onClick={() => props.onEditColumn(c)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn title="Delete" onClick={() => props.onDeleteColumn(c)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </IconBtn>
                      <Button size="sm" variant="outline" onClick={() => props.onAddPage(c.id)} className="ml-2">
                        <Plus className="mr-1 h-4 w-4" /> Page
                      </Button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="bg-background">
                      {c.pages.length === 0 ? (
                        <div className="px-16 py-2 text-sm text-muted-foreground">No pages in this column.</div>
                      ) : (
                        c.pages.map((p, pi) => (
                          <div key={p.id} className="flex items-center gap-2 border-t border-border/40 py-2 pl-16 pr-4">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <button onClick={() => props.onEditPage(p)} className="font-medium hover:underline">
                              {p.nav_label || p.title}
                            </button>
                            <span className="text-xs text-muted-foreground">{p.route_path}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${
                                p.page_kind === "coded"
                                  ? "bg-blue-500/15 text-blue-700 dark:text-blue-400"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {p.page_kind}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${
                                p.status === "published"
                                  ? "bg-green-500/15 text-green-700 dark:text-green-400"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {p.status}
                            </span>
                            <div className="ml-auto flex items-center gap-1">
                              <IconBtn title="Move up" onClick={() => props.onMovePage(c.pages, pi, -1)} disabled={pi === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn title="Move down" onClick={() => props.onMovePage(c.pages, pi, 1)} disabled={pi === c.pages.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                              </IconBtn>
                              {p.route_path && p.status === "published" && (
                                <a
                                  href={p.route_path}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="View live"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                              <IconBtn title="Edit" onClick={() => props.onEditPage(p)}><Pencil className="h-4 w-4" /></IconBtn>
                              <IconBtn title="Delete" onClick={() => props.onDeletePage(p)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </IconBtn>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children, onClick, title, disabled,
}: { children: React.ReactNode; onClick: () => void; title: string; disabled?: boolean }) {
  return (
    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={onClick} title={title} disabled={disabled}>
      {children}
    </Button>
  );
}

function EditDialog({
  target, onClose, onSaved,
}: {
  target: EditTarget | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("");

  // Sync when target changes
  const key = target ? `${target.kind}:${(target as any).id ?? "new"}:${(target as any).group_id ?? ""}` : "";
  const [lastKey, setLastKey] = useState("");
  if (target && key !== lastKey) {
    setLabel(target.label);
    setLastKey(key);
  }
  if (!target && lastKey) setLastKey("");

  if (!target) return null;

  async function save() {
    if (!target) return;
    if (!label.trim()) return toast.error("Label is required");
    setBusy(true);
    try {
      if (target.kind === "group") {
        if (target.id) {
          const { error } = await supabase.from("menu_groups").update({ label }).eq("id", target.id);
          if (error) throw error;
        } else {
          const { data: existing } = await supabase.from("menu_groups").select("position").order("position", { ascending: false }).limit(1);
          const pos = ((existing?.[0]?.position ?? -1) + 1);
          const { error } = await supabase.from("menu_groups").insert({ label, position: pos, is_visible: true });
          if (error) throw error;
        }
      } else {
        if (target.id) {
          const { error } = await supabase.from("menu_columns").update({ label }).eq("id", target.id);
          if (error) throw error;
        } else {
          const { data: existing } = await supabase.from("menu_columns").select("position").eq("group_id", target.group_id).order("position", { ascending: false }).limit(1);
          const pos = ((existing?.[0]?.position ?? -1) + 1);
          const { error } = await supabase.from("menu_columns").insert({ group_id: target.group_id, label, position: pos, is_visible: true });
          if (error) throw error;
        }
      }
      toast.success("Saved");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const isGroup = target.kind === "group";
  const isNew = !target.id;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? "New" : "Edit"} {isGroup ? "Group" : "Column"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={busy}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
