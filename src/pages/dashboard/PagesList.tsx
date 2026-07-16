import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, ChevronDown, ChevronRight, Home, FileText,
  ArrowUp, ArrowDown, Eye, EyeOff, FolderPlus, LayoutGrid, MessageSquare,
  Newspaper, BookMarked, CalendarDays,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useNavTree, type NavTreeGroup } from "@/lib/navTree";
import { toSlug } from "@/lib/slug";

type EditTarget =
  | { kind: "group"; id?: string; label: string; slug: string }
  | { kind: "section"; id?: string; group_id: string; label: string; description: string; href: string }
  | { kind: "page"; group_id: string; section_id: string };

export default function PagesList() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const tree = useNavTree();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [edit, setEdit] = useState<EditTarget | null>(null);

  function toggle(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  const groups = tree.data ?? [];

  async function reorder(
    table: "nav_groups" | "nav_sections" | "pages",
    rows: { id: string; position: number }[],
    idx: number,
    dir: -1 | 1,
  ) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from(table).update({ position: b.position }).eq("id", a.id),
      supabase.from(table).update({ position: a.position }).eq("id", b.id),
    ]);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    invalidate();
  }

  async function toggleVisible(table: "nav_groups" | "nav_sections", id: string, current: boolean) {
    const { error } = await supabase.from(table).update({ is_visible: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(table: "nav_groups" | "nav_sections", id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    invalidate();
  }

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["nav-tree"] });
    qc.invalidateQueries({ queryKey: ["pages"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-muted-foreground">
            Organize pages by nav group and sub-tab. This tree drives the site's mega menu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEdit({ kind: "group", label: "", slug: "" })}>
            <FolderPlus className="mr-1 h-4 w-4" /> New Group
          </Button>
        </div>
      </div>

      <Card className="divide-y divide-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Home className="h-4 w-4 text-primary" />
          <Link to="/dashboard/homepage" className="font-medium hover:underline">
            Homepage
          </Link>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Front page
          </span>
          <span className="ml-auto text-xs text-muted-foreground">Always live at /</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <MessageSquare className="h-4 w-4 text-primary" />
          <Link to="/dashboard/contact" className="font-medium hover:underline">
            Contact
          </Link>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            Standalone page
          </span>
          <span className="ml-auto text-xs text-muted-foreground">Live at /contact</span>
        </div>
        <SystemPageRow
          icon={<Newspaper className="h-4 w-4 text-primary" />}
          label="Blog"
          to="/dashboard/list-heros?page=blog"
          badge="List page"
          liveAt="/blog"
        />
        <SystemPageRow
          icon={<BookMarked className="h-4 w-4 text-primary" />}
          label="Case Studies"
          to="/dashboard/list-heros?page=case-studies"
          badge="List page"
          liveAt="/case-studies"
        />
        <SystemPageRow
          icon={<CalendarDays className="h-4 w-4 text-primary" />}
          label="Events & Webinars"
          to="/dashboard/list-heros?page=events"
          badge="List page"
          liveAt="/events"
        />

        {tree.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : groups.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">
            No nav groups yet. Create your first with <b>New Group</b>.
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
              onEditGroup={() => setEdit({ kind: "group", id: g.id, label: g.label, slug: g.slug })}
              onDeleteGroup={() => remove("nav_groups", g.id, g.label)}
              onAddSection={() =>
                setEdit({
                  kind: "section",
                  group_id: g.id,
                  label: "",
                  description: "",
                  href: "",
                })
              }
              onEditSection={(s) =>
                setEdit({
                  kind: "section",
                  id: s.id,
                  group_id: g.id,
                  label: s.label,
                  description: s.description ?? "",
                  href: s.href ?? "",
                })
              }
              onDeleteSection={(s) => remove("nav_sections", s.id, s.label)}
              onMoveGroup={(dir) =>
                reorder("nav_groups", groups.map((x) => ({ id: x.id, position: x.position })), gi, dir)
              }
              onMoveSection={(sections, i, dir) =>
                reorder("nav_sections", sections.map((x) => ({ id: x.id, position: x.position })), i, dir)
              }
              onMovePage={(pages, i, dir) =>
                reorder("pages", pages.map((x) => ({ id: x.id, position: x.position })), i, dir)
              }
              onToggleGroupVisible={() => toggleVisible("nav_groups", g.id, g.is_visible)}
              onToggleSectionVisible={(s) => toggleVisible("nav_sections", s.id, s.is_visible)}
              onAddPage={(sectionId) => navigate(`/dashboard/pages/new?section=${sectionId}`)}
              onEditPage={(p) => navigate(`/dashboard/pages/${p.id}`)}
            />
          ))
        )}
      </Card>

      <EditDialog target={edit} onClose={() => setEdit(null)} onSaved={invalidate} groups={groups} />
    </div>
  );
}

function GroupNode(props: {
  group: NavTreeGroup;
  index: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
  subExpanded: Record<string, boolean>;
  onSubToggle: (id: string) => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddSection: () => void;
  onEditSection: (s: NavTreeGroup["sections"][number]) => void;
  onDeleteSection: (s: NavTreeGroup["sections"][number]) => void;
  onMoveGroup: (dir: -1 | 1) => void;
  onMoveSection: (sections: NavTreeGroup["sections"], i: number, dir: -1 | 1) => void;
  onMovePage: (pages: NavTreeGroup["sections"][number]["pages"], i: number, dir: -1 | 1) => void;
  onToggleGroupVisible: () => void;
  onToggleSectionVisible: (s: NavTreeGroup["sections"][number]) => void;
  onAddPage: (sectionId: string) => void;
  onEditPage: (p: NavTreeGroup["sections"][number]["pages"][number]) => void;
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
        <span className="text-xs text-muted-foreground">/{group.slug}</span>
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
          <Button size="sm" variant="outline" onClick={props.onAddSection} className="ml-2">
            <Plus className="mr-1 h-4 w-4" /> Sub-tab
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t border-border bg-muted/20">
          {group.sections.length === 0 ? (
            <div className="px-12 py-3 text-sm text-muted-foreground">No sub-tabs yet.</div>
          ) : (
            group.sections.map((s, si) => {
              const isOpen = !!props.subExpanded[s.id];
              return (
                <div key={s.id} className="border-b border-border/60 last:border-b-0">
                  <div className="flex items-center gap-2 py-2 pl-10 pr-4">
                    <button
                      onClick={() => props.onSubToggle(s.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <span className="font-medium">{s.label}</span>
                    {s.description && (
                      <span className="text-xs text-muted-foreground">— {s.description}</span>
                    )}
                    {s.href && (
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-secondary-foreground">
                        link: {s.href}
                      </span>
                    )}
                    {!s.is_visible && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <IconBtn title="Move up" onClick={() => props.onMoveSection(group.sections, si, -1)} disabled={si === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn title="Move down" onClick={() => props.onMoveSection(group.sections, si, 1)} disabled={si === group.sections.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                      </IconBtn>
                      <IconBtn title={s.is_visible ? "Hide" : "Show"} onClick={() => props.onToggleSectionVisible(s)}>
                        {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </IconBtn>
                      <IconBtn title="Edit" onClick={() => props.onEditSection(s)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn title="Delete" onClick={() => props.onDeleteSection(s)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </IconBtn>
                      <Button size="sm" variant="outline" onClick={() => props.onAddPage(s.id)} className="ml-2">
                        <Plus className="mr-1 h-4 w-4" /> Page
                      </Button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="bg-background">
                      {s.pages.length === 0 ? (
                        <div className="px-16 py-2 text-sm text-muted-foreground">No pages under this sub-tab.</div>
                      ) : (
                        s.pages.map((p, pi) => (
                          <div key={p.id} className="flex items-center gap-2 border-t border-border/40 py-2 pl-16 pr-4">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <button
                              onClick={() => props.onEditPage(p)}
                              className="font-medium hover:underline"
                            >
                              {p.nav_label || p.title}
                            </button>
                            <span className="text-xs text-muted-foreground">/p/{p.slug}</span>
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
                              <IconBtn title="Move up" onClick={() => props.onMovePage(s.pages, pi, -1)} disabled={pi === 0}>
                                <ArrowUp className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn title="Move down" onClick={() => props.onMovePage(s.pages, pi, 1)} disabled={pi === s.pages.length - 1}>
                                <ArrowDown className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn title="Edit" onClick={() => props.onEditPage(p)}>
                                <Pencil className="h-4 w-4" />
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
  target, onClose, onSaved, groups,
}: {
  target: EditTarget | null;
  onClose: () => void;
  onSaved: () => void;
  groups: NavTreeGroup[];
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<any>({});
  useMemo(() => setForm(target ?? {}), [target]);

  if (!target) return null;
  const isGroup = target.kind === "group";
  const isSection = target.kind === "section";
  const isNew = !("id" in target) || !target.id;

  async function save() {
    if (!target) return;
    const t = target;
    const existingId = "id" in t ? t.id : undefined;
    setBusy(true);
    try {
      if (t.kind === "group") {
        const label: string = form.label?.trim();
        if (!label) return toast.error("Label required");
        const slug: string = (form.slug || toSlug(label)) as string;
        if (existingId) {
          const { error } = await supabase.from("nav_groups").update({ label, slug }).eq("id", existingId);
          if (error) throw error;
        } else {
          const nextPos = groups.length;
          const { error } = await supabase.from("nav_groups").insert({ label, slug, position: nextPos });
          if (error) throw error;
        }
      } else if (t.kind === "section") {
        const label: string = form.label?.trim();
        if (!label) return toast.error("Label required");
        const payload = {
          label,
          description: form.description || null,
          href: form.href || null,
          group_id: t.group_id,
        };
        if (existingId) {
          const { error } = await supabase.from("nav_sections").update(payload).eq("id", existingId);
          if (error) throw error;
        } else {
          const g = groups.find((x) => x.id === t.group_id);
          const nextPos = g?.sections.length ?? 0;
          const { error } = await supabase.from("nav_sections").insert({ ...payload, position: nextPos });
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

  return (
    <Dialog open={!!target} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isNew ? "New" : "Edit"} {isGroup ? "group" : "sub-tab"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={form.label ?? ""}
              onChange={(e) => setForm((f: any) => ({ ...f, label: e.target.value }))}
              placeholder={isGroup ? "HealthCare" : "Hospital & Clinical Systems"}
            />
          </div>
          {isGroup && (
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input
                value={form.slug ?? ""}
                onChange={(e) => setForm((f: any) => ({ ...f, slug: toSlug(e.target.value) }))}
                placeholder="healthcare"
              />
            </div>
          )}
          {isSection && (
            <>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  rows={2}
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Direct link (optional)</Label>
                <Input
                  value={form.href ?? ""}
                  onChange={(e) => setForm((f: any) => ({ ...f, href: e.target.value }))}
                  placeholder="/services/cybersecurity"
                />
                <p className="text-xs text-muted-foreground">
                  Use when this sub-tab links to a single URL instead of expanding into child pages.
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={busy}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
