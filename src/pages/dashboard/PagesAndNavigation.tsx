import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, ChevronDown, ChevronRight, FileText,
  Eye, EyeOff, FolderPlus, LayoutGrid, ExternalLink,
  Home, Mail, Lock, Link as LinkIcon, GripVertical, Search, Sparkles, Loader2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useMenuTree, fetchMenuTree, type MenuTreeGroup, type MenuItem } from "@/lib/menuTree";

type Col = MenuTreeGroup["columns"][number];

type EditTarget =
  | { kind: "group"; id?: string; label: string }
  | { kind: "column"; id?: string; group_id: string; label: string; description: string }
  | { kind: "link"; id?: string; column_id: string; label: string; url: string; target: string };

type DragKind = "group" | "column" | "item";

export default function PagesAndNavigation() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [navLocale, setNavLocale] = useState<"en" | "ar">("en");
  const treeEn = useMenuTree();
  const treeAr = useQuery({
    queryKey: ["menu-tree", "ar"],
    queryFn: () => fetchMenuTree("ar"),
    enabled: navLocale === "ar",
  });
  const tree = navLocale === "ar" ? treeAr : treeEn;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [edit, setEdit] = useState<EditTarget | null>(null);
  const [activeDrag, setActiveDrag] = useState<{ kind: DragKind; label: string } | null>(null);
  const [tab, setTab] = useState<"pages" | "navigation">("pages");
  const [pageSearch, setPageSearch] = useState("");
  const [translatingAll, setTranslatingAll] = useState(false);

  async function translateAllPages() {
    if (!confirm("Auto-translate ALL sections across ALL pages into Arabic?\n\nThis will OVERWRITE any existing Arabic content site-wide and may take several minutes.")) return;
    setTranslatingAll(true);
    const t = toast.loading("Preparing pages…");
    try {
      // Fetch every page id, then translate one page at a time.
      // Per-page invokes stay well under the edge-function timeout and give live progress.
      const { data: pages, error: pErr } = await supabase
        .from("pages")
        .select("id,title")
        .order("title", { ascending: true });
      if (pErr) throw pErr;
      const list = pages ?? [];
      let ok = 0, fail = 0, totalSections = 0, doneSections = 0;
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        toast.loading(`Translating ${i + 1}/${list.length}: ${p.title}…  (${doneSections} sections done)`, { id: t });
        try {
          const { data, error } = await supabase.functions.invoke("translate-content", {
            body: { mode: "page", pageId: p.id },
          });
          if (error) throw error;
          const res = (data ?? {}) as { ok: number; fail: number; total: number };
          ok += res.ok ?? 0;
          fail += res.fail ?? 0;
          totalSections += res.total ?? 0;
          doneSections += (res.ok ?? 0) + (res.fail ?? 0);
        } catch (e: any) {
          fail += 1;
          console.error(`Translate failed for ${p.title}:`, e);
        }
      }
      // Also translate header/footer + menu labels so nav/mega-menu update too.
      let hfOk = 0, menuOk = 0, menuTotal = 0;
      try {
        toast.loading(`Translating header & footer…`, { id: t });
        const { data: hf } = await supabase.functions.invoke("translate-content", { body: { mode: "header_footer" } });
        hfOk = (hf as any)?.ok ?? 0;
      } catch (e) { console.error("H/F translate failed", e); }
      try {
        toast.loading(`Translating navigation menus…`, { id: t });
        const { data: mn, error: mnError } = await supabase.functions.invoke("translate-content", { body: { mode: "menus" } });
        if (mnError) {
          const detail = await (mnError as any)?.context?.text?.().catch(() => "");
          throw new Error(detail || mnError.message);
        }
        menuOk = (mn as any)?.ok ?? 0;
        menuTotal = (mn as any)?.total ?? 0;
      } catch (e) { console.error("Menus translate failed", e); }

      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "page-sections",
      });
      qc.invalidateQueries({ queryKey: ["header-footer"] });
      qc.invalidateQueries({ queryKey: ["menu-tree"] });
      toast.success(
        `Done. ${ok}/${totalSections} sections across ${list.length} pages, header/footer (${hfOk}), menus (${menuOk}/${menuTotal})${fail ? ` — ${fail} failed` : ""}.`,
        { id: t, duration: 8000 },
      );
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed", { id: t });
    } finally {
      setTranslatingAll(false);
    }
  }

  const groups = tree.data ?? [];

  const allPages = useQuery({
    queryKey: ["all-pages-flat"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id,title,nav_label,route_path,status,page_kind,menu_column_id,translations")
        .order("title", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  function toggle(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["menu-tree"] });
    qc.invalidateQueries({ queryKey: ["pages"] });
    qc.invalidateQueries({ queryKey: ["all-pages-flat"] });
  }

  async function toggleVisible(
    table: "menu_groups" | "menu_columns" | "menu_links",
    id: string,
    current: boolean,
  ) {
    const { error } = await supabase.from(table).update({ is_visible: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(table: "menu_groups" | "menu_columns" | "menu_links", id: string, name: string) {
    const msg =
      table === "menu_links"
        ? `Delete link "${name}"?`
        : `Delete "${name}"? Pages inside will be unassigned from the menu, not deleted.`;
    if (!confirm(msg)) return;
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

  // ---------- Drag & Drop ----------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Encode DnD IDs so we can figure out entity type quickly.
  // group:<uuid>, col:<uuid>, item:<page|link>:<uuid>, colDrop:<uuid> (empty column drop target)
  const parseId = (raw: string) => {
    const [kind, ...rest] = raw.split(":");
    return { kind, rest };
  };

  function onDragStart(e: DragStartEvent) {
    const { kind, rest } = parseId(String(e.active.id));
    if (kind === "group") {
      const g = groups.find((x) => x.id === rest[0]);
      if (g) setActiveDrag({ kind: "group", label: g.label });
    } else if (kind === "col") {
      const c = groups.flatMap((g) => g.columns).find((x) => x.id === rest[0]);
      if (c) setActiveDrag({ kind: "column", label: c.label });
    } else if (kind === "item") {
      const [sub, id] = rest;
      const col = groups.flatMap((g) => g.columns).find((c) => c.items.some((i) => i.kind === sub && i.id === id));
      const it = col?.items.find((i) => i.kind === sub && i.id === id);
      if (it) setActiveDrag({ kind: "item", label: it.kind === "page" ? (it.page.nav_label || it.page.title) : it.link.label });
    }
  }

  async function onDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const a = parseId(String(active.id));
    const o = parseId(String(over.id));

    // --- Reorder groups ---
    if (a.kind === "group" && o.kind === "group") {
      const oldIdx = groups.findIndex((g) => g.id === a.rest[0]);
      const newIdx = groups.findIndex((g) => g.id === o.rest[0]);
      if (oldIdx < 0 || newIdx < 0) return;
      const next = arrayMove(groups, oldIdx, newIdx);
      await persistPositions("menu_groups", next.map((g, i) => ({ id: g.id, position: i })));
      return;
    }

    // --- Move / reorder columns (within a group or across groups) ---
    if (a.kind === "col" && (o.kind === "col" || o.kind === "group")) {
      const colId = a.rest[0];
      const srcGroup = groups.find((g) => g.columns.some((c) => c.id === colId));
      if (!srcGroup) return;
      let dstGroupId: string;
      let dstIndex: number;
      if (o.kind === "group") {
        dstGroupId = o.rest[0];
        dstIndex = (groups.find((g) => g.id === dstGroupId)?.columns.length ?? 0);
      } else {
        const dstCol = groups.flatMap((g) => g.columns.map((c) => ({ ...c, gid: g.id }))).find((c) => c.id === o.rest[0]);
        if (!dstCol) return;
        dstGroupId = dstCol.gid;
        dstIndex = groups.find((g) => g.id === dstGroupId)!.columns.findIndex((c) => c.id === dstCol.id);
      }
      const srcIndex = srcGroup.columns.findIndex((c) => c.id === colId);

      // Compute new ordering per group
      const updates: { id: string; position: number; group_id?: string }[] = [];
      if (srcGroup.id === dstGroupId) {
        const next = arrayMove(srcGroup.columns, srcIndex, dstIndex);
        next.forEach((c, i) => updates.push({ id: c.id, position: i }));
      } else {
        const srcNext = srcGroup.columns.filter((c) => c.id !== colId);
        srcNext.forEach((c, i) => updates.push({ id: c.id, position: i }));
        const dstCols = [...(groups.find((g) => g.id === dstGroupId)?.columns ?? [])];
        const moving = srcGroup.columns[srcIndex];
        dstCols.splice(dstIndex, 0, moving);
        dstCols.forEach((c, i) =>
          updates.push({ id: c.id, position: i, group_id: c.id === colId ? dstGroupId : undefined }),
        );
      }
      await Promise.all(
        updates.map((u) => {
          const patch: any = { position: u.position };
          if (u.group_id) patch.group_id = u.group_id;
          return supabase.from("menu_columns").update(patch).eq("id", u.id);
        }),
      );
      invalidate();
      return;
    }

    // --- Move / reorder items (pages + links) within/across columns ---
    if (a.kind === "item" && (o.kind === "item" || o.kind === "colDrop" || o.kind === "col")) {
      const [subA, itemId] = a.rest;
      const srcCol = groups.flatMap((g) => g.columns).find((c) => c.items.some((i) => i.kind === subA && i.id === itemId));
      if (!srcCol) return;

      let dstColId: string;
      let dstIndex: number;
      if (o.kind === "item") {
        const [, targetId] = o.rest;
        const dstCol = groups.flatMap((g) => g.columns).find((c) => c.items.some((i) => i.id === targetId));
        if (!dstCol) return;
        dstColId = dstCol.id;
        dstIndex = dstCol.items.findIndex((i) => i.id === targetId);
      } else {
        // dropped on a column (colDrop / col) — append at end
        dstColId = o.rest[0];
        dstIndex = groups.flatMap((g) => g.columns).find((c) => c.id === dstColId)?.items.length ?? 0;
      }

      const moving = srcCol.items.find((i) => i.kind === subA && i.id === itemId)!;

      let nextItems: MenuItem[];
      if (srcCol.id === dstColId) {
        const srcIdx = srcCol.items.findIndex((i) => i.id === itemId);
        nextItems = arrayMove(srcCol.items, srcIdx, dstIndex);
        await persistItemOrder(dstColId, nextItems);
      } else {
        const srcNext = srcCol.items.filter((i) => i.id !== itemId);
        const dstCol = groups.flatMap((g) => g.columns).find((c) => c.id === dstColId)!;
        const dstNext = [...dstCol.items];
        dstNext.splice(dstIndex, 0, moving);
        await Promise.all([
          persistItemOrder(srcCol.id, srcNext),
          persistItemOrder(dstColId, dstNext, moving.id, moving.kind),
        ]);
      }
      invalidate();
      return;
    }
  }

  async function persistPositions(table: "menu_groups" | "menu_columns", rows: { id: string; position: number }[]) {
    await Promise.all(rows.map((r) => supabase.from(table).update({ position: r.position }).eq("id", r.id)));
    invalidate();
  }

  async function persistItemOrder(
    columnId: string,
    items: MenuItem[],
    movedId?: string,
    movedKind?: "page" | "link",
  ) {
    const ops = items.map((it, i) => {
      if (it.kind === "page") {
        const patch: any = { menu_position: i };
        if (movedId === it.id && movedKind === "page") patch.menu_column_id = columnId;
        return supabase.from("pages").update(patch).eq("id", it.id);
      }
      const patch: any = { position: i };
      if (movedId === it.id && movedKind === "link") patch.column_id = columnId;
      return supabase.from("menu_links").update(patch).eq("id", it.id);
    });
    await Promise.all(ops);
  }

  const filteredPages = (allPages.data ?? []).filter((p) => {
    const q = pageSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (p.title ?? "").toLowerCase().includes(q) ||
      (p.nav_label ?? "").toLowerCase().includes(q) ||
      (p.route_path ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Pages & Navigation</h1>
          <p className="text-sm text-muted-foreground">
            Manage every page and how they're wired into the site's menus.
          </p>
        </div>
        <div className="flex gap-2">
          {tab === "pages" && (
            <Button variant="outline" onClick={translateAllPages} disabled={translatingAll} title="Auto-translate every page section into Arabic (overwrites existing Arabic content)">
              {translatingAll ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
              Translate all to Arabic
            </Button>
          )}
          {tab === "navigation" && (
            <Button variant="outline" onClick={() => setEdit({ kind: "group", label: "" })}>
              <FolderPlus className="mr-1 h-4 w-4" /> New Group
            </Button>
          )}
          <Button onClick={() => navigate("/dashboard/pages/new")}>
            <Plus className="mr-1 h-4 w-4" /> New Page
          </Button>
        </div>
      </div>

      <Card className="divide-y divide-border">
        <ReferenceRow
          icon={<Home className="h-4 w-4 text-primary" />}
          title="Homepage"
          badge="Front page"
          route="/"
          editHref="/dashboard/homepage"
          description="Managed in Homepage editor. Not part of the menu tree."
        />
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "pages" | "navigation")}>
        <TabsList>
          <TabsTrigger value="pages">
            <FileText className="mr-1 h-4 w-4" /> Pages
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {allPages.data?.length ?? 0}
            </span>
          </TabsTrigger>
          <TabsTrigger value="navigation">
            <LayoutGrid className="mr-1 h-4 w-4" /> Navigation
            <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
              {groups.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-4">
          <Card>
            <div className="flex items-center gap-2 border-b border-border p-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                placeholder="Search pages by title, nav label, or route…"
                className="h-8 border-0 shadow-none focus-visible:ring-0"
              />
              <div className="inline-flex overflow-hidden rounded-md border border-border text-xs">
                <button
                  type="button"
                  onClick={() => setNavLocale("en")}
                  className={`px-3 py-1.5 font-semibold ${navLocale === "en" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setNavLocale("ar")}
                  className={`px-3 py-1.5 font-semibold ${navLocale === "ar" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                >
                  AR
                </button>
              </div>
            </div>
            {allPages.isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">Loading…</div>
            ) : filteredPages.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {pageSearch ? "No pages match your search." : "No pages yet."}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredPages.map((p) => {
                  const inMenu = !!p.menu_column_id;
                  const ar = ((p as any).translations?.ar) || {};
                  const arTitle = ar.title as string | undefined;
                  const arNav = ar.nav_label as string | undefined;
                  const displayName = navLocale === "ar"
                    ? (arNav || arTitle || p.nav_label || p.title)
                    : (p.nav_label || p.title);
                  const missingAr = navLocale === "ar" && !arTitle && !arNav;
                  return (
                    <div key={p.id} className="flex items-center gap-2 px-4 py-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <button
                        onClick={() => navigate(`/dashboard/pages/${p.id}`)}
                        className="font-medium hover:underline"
                        dir={navLocale === "ar" ? "rtl" : "ltr"}
                      >
                        {displayName}
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
                      {!inMenu && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] uppercase text-amber-700 dark:text-amber-400">
                          Not in menu
                        </span>
                      )}
                      {missingAr && (
                        <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] uppercase text-amber-700 dark:text-amber-400">
                          Missing AR
                        </span>
                      )}
                      <div className="ml-auto flex items-center gap-1">
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
                        <IconBtn title="Edit" onClick={() => navigate(`/dashboard/pages/${p.id}`)}>
                          <Pencil className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn title="Delete" onClick={() => deletePage(p.id, p.nav_label || p.title)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </IconBtn>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="navigation" className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Drag to reorder or move between columns. Groups → Columns → Pages / Links.
            </p>
            <div className="inline-flex overflow-hidden rounded-md border border-border text-xs">
              <button
                type="button"
                onClick={() => setNavLocale("en")}
                className={`px-3 py-1.5 font-semibold ${navLocale === "en" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setNavLocale("ar")}
                className={`px-3 py-1.5 font-semibold ${navLocale === "ar" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
              >
                AR
              </button>
            </div>
          </div>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Card className="divide-y divide-border">
              {tree.isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading…</div>
              ) : groups.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  No menu groups yet. Create your first with <b>New Group</b>.
                </div>
              ) : (
                <SortableContext items={groups.map((g) => `group:${g.id}`)} strategy={verticalListSortingStrategy}>
                  {groups.map((g) => (
                    <GroupNode
                      key={g.id}
                      group={g}
                      expanded={!!expanded[g.id]}
                      onToggle={() => toggle(g.id)}
                      subExpanded={expanded}
                      onSubToggle={toggle}
                      onEditGroup={() => setEdit({ kind: "group", id: g.id, label: g.label })}
                      onDeleteGroup={() => remove("menu_groups", g.id, g.label)}
                      onAddColumn={() => setEdit({ kind: "column", group_id: g.id, label: "", description: "" })}
                      onEditColumn={(c) => setEdit({ kind: "column", id: c.id, group_id: g.id, label: c.label, description: c.description ?? "" })}
                      onDeleteColumn={(c) => remove("menu_columns", c.id, c.label)}
                      onToggleGroupVisible={() => toggleVisible("menu_groups", g.id, g.is_visible)}
                      onToggleColumnVisible={(c) => toggleVisible("menu_columns", c.id, c.is_visible)}
                      onToggleLinkVisible={(l) => toggleVisible("menu_links", l.id, l.is_visible)}
                      onAddPage={(columnId) => navigate(`/dashboard/pages/new?column=${columnId}`)}
                      onAddLink={(columnId) =>
                        setEdit({ kind: "link", column_id: columnId, label: "", url: "", target: "_self" })
                      }
                      onEditLink={(l) =>
                        setEdit({ kind: "link", id: l.id, column_id: l.column_id, label: l.label, url: l.url, target: l.target })
                      }
                      onDeleteLink={(l) => remove("menu_links", l.id, l.label)}
                      onEditPage={(p) => navigate(`/dashboard/pages/${p.id}`)}
                      onDeletePage={(p) => deletePage(p.id, p.nav_label || p.title)}
                    />
                  ))}
                </SortableContext>
              )}
            </Card>

            <DragOverlay>
              {activeDrag ? (
                <div className="rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-lg">
                  {activeDrag.kind === "group" ? "📁 " : activeDrag.kind === "column" ? "🗂 " : "↕ "}
                  {activeDrag.label}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </TabsContent>
      </Tabs>

      <EditDialog target={edit} onClose={() => setEdit(null)} onSaved={invalidate} />
    </div>
  );
}

function ReferenceRow({
  icon, title, badge, route, editHref, description,
}: {
  icon: React.ReactNode;
  title: string;
  badge: string;
  route: string;
  editHref: string;
  description: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {icon}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{title}</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-primary">
            {badge}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3 w-3" /> Not in menu tree
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <span className="hidden text-xs text-muted-foreground sm:inline">{route}</span>
        <a href={route} target="_blank" rel="noreferrer" title="View live"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
          <ExternalLink className="h-4 w-4" />
        </a>
        <Button size="sm" variant="outline" onClick={() => navigate(editHref)}>
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Button>
      </div>
    </div>
  );
}

// ------------- Sortable helpers -------------

function DragHandle({ listeners, attributes }: any) {
  return (
    <button
      {...listeners}
      {...attributes}
      className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-accent active:cursor-grabbing"
      title="Drag"
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}

function GroupNode(props: {
  group: MenuTreeGroup;
  expanded: boolean;
  onToggle: () => void;
  subExpanded: Record<string, boolean>;
  onSubToggle: (id: string) => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddColumn: () => void;
  onEditColumn: (c: Col) => void;
  onDeleteColumn: (c: Col) => void;
  onToggleGroupVisible: () => void;
  onToggleColumnVisible: (c: Col) => void;
  onToggleLinkVisible: (l: Col["links"][number]) => void;
  onAddPage: (columnId: string) => void;
  onAddLink: (columnId: string) => void;
  onEditLink: (l: Col["links"][number]) => void;
  onDeleteLink: (l: Col["links"][number]) => void;
  onEditPage: (p: Col["pages"][number]) => void;
  onDeletePage: (p: Col["pages"][number]) => void;
}) {
  const { group, expanded, onToggle } = props;
  const sortable = useSortable({ id: `group:${group.id}` });
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition };

  return (
    <div ref={sortable.setNodeRef} style={style} className={sortable.isDragging ? "opacity-50" : ""}>
      <div className="flex items-center gap-2 px-4 py-3">
        <DragHandle listeners={sortable.listeners} attributes={sortable.attributes} />
        <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <LayoutGrid className="h-4 w-4 text-primary" />
        <span className="font-semibold">{group.label}</span>
        {!group.is_visible && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
        )}
        <div className="ml-auto flex items-center gap-1">
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
            <div className="px-12 py-3 text-sm text-muted-foreground">No columns yet. Drop a column here.</div>
          ) : (
            <SortableContext items={group.columns.map((c) => `col:${c.id}`)} strategy={verticalListSortingStrategy}>
              {group.columns.map((c) => (
                <ColumnNode
                  key={c.id}
                  column={c}
                  isOpen={!!props.subExpanded[c.id]}
                  onToggle={() => props.onSubToggle(c.id)}
                  onToggleVisible={() => props.onToggleColumnVisible(c)}
                  onEdit={() => props.onEditColumn(c)}
                  onDelete={() => props.onDeleteColumn(c)}
                  onAddPage={() => props.onAddPage(c.id)}
                  onAddLink={() => props.onAddLink(c.id)}
                  onEditLink={props.onEditLink}
                  onToggleLinkVisible={props.onToggleLinkVisible}
                  onDeleteLink={props.onDeleteLink}
                  onEditPage={props.onEditPage}
                  onDeletePage={props.onDeletePage}
                />
              ))}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

function ColumnNode(props: {
  column: Col;
  isOpen: boolean;
  onToggle: () => void;
  onToggleVisible: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddPage: () => void;
  onAddLink: () => void;
  onEditLink: (l: Col["links"][number]) => void;
  onToggleLinkVisible: (l: Col["links"][number]) => void;
  onDeleteLink: (l: Col["links"][number]) => void;
  onEditPage: (p: Col["pages"][number]) => void;
  onDeletePage: (p: Col["pages"][number]) => void;
}) {
  const c = props.column;
  const sortable = useSortable({ id: `col:${c.id}` });
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition };

  return (
    <div ref={sortable.setNodeRef} style={style} className={`border-b border-border/60 last:border-b-0 ${sortable.isDragging ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 py-2 pl-6 pr-4">
        <DragHandle listeners={sortable.listeners} attributes={sortable.attributes} />
        <button onClick={props.onToggle} className="text-muted-foreground hover:text-foreground">
          {props.isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        <span className="font-medium">{c.label}</span>
        {!c.is_visible && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
        )}
        <span className="text-xs text-muted-foreground">{c.items.length} item{c.items.length === 1 ? "" : "s"}</span>
        <div className="ml-auto flex items-center gap-1">
          <IconBtn title={c.is_visible ? "Hide" : "Show"} onClick={props.onToggleVisible}>
            {c.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </IconBtn>
          <IconBtn title="Edit" onClick={props.onEdit}><Pencil className="h-4 w-4" /></IconBtn>
          <IconBtn title="Delete" onClick={props.onDelete}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="ml-2">
                <Plus className="mr-1 h-4 w-4" /> Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={props.onAddPage}>
                <FileText className="mr-2 h-4 w-4" /> New Page
              </DropdownMenuItem>
              <DropdownMenuItem onClick={props.onAddLink}>
                <LinkIcon className="mr-2 h-4 w-4" /> External / Custom Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {props.isOpen && (
        <div className="bg-background">
          {c.items.length === 0 ? (
            <EmptyDrop columnId={c.id} />
          ) : (
            <SortableContext
              items={c.items.map((i) => `item:${i.kind}:${i.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {c.items.map((it) =>
                it.kind === "page" ? (
                  <PageRow
                    key={`p-${it.id}`}
                    page={it.page}
                    onEdit={() => props.onEditPage(it.page)}
                    onDelete={() => props.onDeletePage(it.page)}
                  />
                ) : (
                  <LinkRow
                    key={`l-${it.id}`}
                    link={it.link}
                    onEdit={() => props.onEditLink(it.link)}
                    onDelete={() => props.onDeleteLink(it.link)}
                    onToggleVisible={() => props.onToggleLinkVisible(it.link)}
                  />
                ),
              )}
            </SortableContext>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyDrop({ columnId }: { columnId: string }) {
  const sortable = useSortable({ id: `colDrop:${columnId}` });
  return (
    <div
      ref={sortable.setNodeRef}
      className={`mx-8 my-2 rounded-md border border-dashed py-3 text-center text-xs text-muted-foreground ${sortable.isOver ? "border-primary bg-primary/5" : "border-border"}`}
    >
      Drop pages or links here
    </div>
  );
}

function PageRow({
  page: p, onEdit, onDelete,
}: {
  page: Col["pages"][number];
  onEdit: () => void;
  onDelete: () => void;
}) {
  const sortable = useSortable({ id: `item:page:${p.id}` });
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition };
  return (
    <div ref={sortable.setNodeRef} style={style}
      className={`flex items-center gap-2 border-t border-border/40 py-2 pl-10 pr-4 ${sortable.isDragging ? "opacity-50" : ""}`}>
      <DragHandle listeners={sortable.listeners} attributes={sortable.attributes} />
      <FileText className="h-4 w-4 text-muted-foreground" />
      <button onClick={onEdit} className="font-medium hover:underline">
        {p.nav_label || p.title}
      </button>
      <span className="text-xs text-muted-foreground">{p.route_path}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${
        p.page_kind === "coded" ? "bg-blue-500/15 text-blue-700 dark:text-blue-400" : "bg-primary/10 text-primary"
      }`}>{p.page_kind}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${
        p.status === "published" ? "bg-green-500/15 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
      }`}>{p.status}</span>
      <div className="ml-auto flex items-center gap-1">
        {p.route_path && p.status === "published" && (
          <a href={p.route_path} target="_blank" rel="noreferrer" title="View live"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <IconBtn title="Edit" onClick={onEdit}><Pencil className="h-4 w-4" /></IconBtn>
        <IconBtn title="Delete" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
      </div>
    </div>
  );
}

function LinkRow({
  link: l, onEdit, onDelete, onToggleVisible,
}: {
  link: Col["links"][number];
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisible: () => void;
}) {
  const sortable = useSortable({ id: `item:link:${l.id}` });
  const style = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition };
  const isExt = /^https?:\/\//i.test(l.url);
  return (
    <div ref={sortable.setNodeRef} style={style}
      className={`flex items-center gap-2 border-t border-border/40 py-2 pl-10 pr-4 ${sortable.isDragging ? "opacity-50" : ""}`}>
      <DragHandle listeners={sortable.listeners} attributes={sortable.attributes} />
      <LinkIcon className="h-4 w-4 text-muted-foreground" />
      <button onClick={onEdit} className="font-medium hover:underline">{l.label}</button>
      <span className="text-xs text-muted-foreground">{l.url}</span>
      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] uppercase text-amber-700 dark:text-amber-400">
        {isExt ? "external" : "custom"}
      </span>
      {!l.is_visible && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase text-muted-foreground">Hidden</span>
      )}
      <div className="ml-auto flex items-center gap-1">
        <a href={l.url} target={l.target === "_blank" || isExt ? "_blank" : undefined} rel="noreferrer" title="Open"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent">
          <ExternalLink className="h-4 w-4" />
        </a>
        <IconBtn title={l.is_visible ? "Hide" : "Show"} onClick={onToggleVisible}>
          {l.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </IconBtn>
        <IconBtn title="Edit" onClick={onEdit}><Pencil className="h-4 w-4" /></IconBtn>
        <IconBtn title="Delete" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
      </div>
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
}: { target: EditTarget | null; onClose: () => void; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [newTab, setNewTab] = useState(false);
  const [description, setDescription] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [translations, setTranslations] = useState<any>({});

  const key = useMemo(() => {
    if (!target) return "";
    return `${target.kind}:${(target as any).id ?? "new"}:${(target as any).group_id ?? (target as any).column_id ?? ""}`;
  }, [target]);
  const [lastKey, setLastKey] = useState("");

  if (target && key !== lastKey) {
    setLabel(target.label);
    if (target.kind === "link") {
      setUrl(target.url);
      setNewTab(target.target === "_blank");
      setDescription("");
    } else if (target.kind === "column") {
      setUrl("");
      setNewTab(false);
      setDescription(target.description ?? "");
    } else {
      setUrl("");
      setNewTab(false);
      setDescription("");
    }
    setLabelAr("");
    setDescriptionAr("");
    setTranslations({});
    setLocale("en");
    setLastKey(key);

    // Fetch existing translations for AR overlay
    if (target.id) {
      const table =
        target.kind === "group" ? "menu_groups"
        : target.kind === "column" ? "menu_columns"
        : "menu_links";
      supabase.from(table as any).select("translations").eq("id", target.id).maybeSingle().then(({ data }) => {
        const t = (data as any)?.translations ?? {};
        setTranslations(t);
        setLabelAr(t?.ar?.label ?? "");
        if (target.kind === "column") setDescriptionAr(t?.ar?.description ?? "");
      });
    }
  }
  if (!target && lastKey) setLastKey("");
  if (!target) return null;

  async function save() {
    if (!target) return;
    if (!label.trim()) return toast.error("English label is required");
    if (target.kind === "link" && !url.trim()) return toast.error("URL is required");
    setBusy(true);
    try {
      // Build merged translations
      const arObj: any = { ...(translations?.ar ?? {}) };
      if (labelAr.trim()) arObj.label = labelAr.trim(); else delete arObj.label;
      if (target.kind === "column") {
        if (descriptionAr.trim()) arObj.description = descriptionAr.trim(); else delete arObj.description;
      }
      const nextTr = { ...(translations ?? {}) };
      if (Object.keys(arObj).length > 0) nextTr.ar = arObj;
      else delete nextTr.ar;

      if (target.kind === "group") {
        if (target.id) {
          const { error } = await supabase.from("menu_groups").update({ label: label.trim(), translations: nextTr }).eq("id", target.id);
          if (error) throw error;
        } else {
          const { data: max } = await supabase.from("menu_groups").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
          const { error } = await supabase.from("menu_groups").insert({ label: label.trim(), position: ((max?.position ?? -1) + 1), is_visible: true, translations: nextTr });
          if (error) throw error;
        }
      } else if (target.kind === "column") {
        const desc = description.trim() || null;
        if (target.id) {
          const { error } = await supabase.from("menu_columns").update({ label: label.trim(), description: desc, translations: nextTr }).eq("id", target.id);
          if (error) throw error;
        } else {
          const { data: max } = await supabase.from("menu_columns").select("position").eq("group_id", target.group_id).order("position", { ascending: false }).limit(1).maybeSingle();
          const { error } = await supabase.from("menu_columns").insert({ label: label.trim(), description: desc, group_id: target.group_id, position: ((max?.position ?? -1) + 1), is_visible: true, translations: nextTr });
          if (error) throw error;
        }
      } else {
        const patch: any = { label: label.trim(), url: url.trim(), target: newTab ? "_blank" : "_self", translations: nextTr };
        if (target.id) {
          const { error } = await supabase.from("menu_links").update(patch).eq("id", target.id);
          if (error) throw error;
        } else {
          const { data: max } = await supabase.from("menu_links").select("position").eq("column_id", target.column_id).order("position", { ascending: false }).limit(1).maybeSingle();
          const { error } = await supabase.from("menu_links").insert({ ...patch, column_id: target.column_id, position: ((max?.position ?? -1) + 1), is_visible: true });
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

  const title =
    target.kind === "group" ? (target.id ? "Edit Group" : "New Group")
    : target.kind === "column" ? (target.id ? "Edit Column" : "New Column")
    : (target.id ? "Edit Link" : "New Link");

  const isAr = locale === "ar";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle>{title}</DialogTitle>
            <div className="inline-flex overflow-hidden rounded-md border border-border me-6">
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-3 py-1 text-xs font-semibold ${!isAr ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >EN</button>
              <button
                type="button"
                onClick={() => setLocale("ar")}
                className={`border-s border-border px-3 py-1 text-xs font-semibold ${isAr ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
              >AR — العربية</button>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-3">
          {isAr && (
            <div className="rounded-md border border-amber-300/40 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              Editing Arabic overlay. Empty fields fall back to English. URL and other non-text settings stay in the English tab.
            </div>
          )}
          {!isAr ? (
            <>
              <div>
                <Label>Label (English)</Label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Displayed in menu" autoFocus />
              </div>
              {target.kind === "column" && (
                <div>
                  <Label>Description (English)</Label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short subtitle shown under the tab in the mega menu"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Optional. Appears as a small line under the tab title.</p>
                </div>
              )}
              {target.kind === "link" && (
                <>
                  <div>
                    <Label>URL</Label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://... or /internal-path or #anchor"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      External URLs (https://…), internal paths (/pricing), or anchors (#faq) all work.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={newTab} onCheckedChange={setNewTab} id="newtab" />
                    <Label htmlFor="newtab" className="cursor-pointer">Open in new tab</Label>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div>
                <Label>Label (Arabic)</Label>
                <Input
                  dir="rtl"
                  value={labelAr}
                  onChange={(e) => setLabelAr(e.target.value)}
                  placeholder={label ? `مثال: ${label}` : "التسمية بالعربية"}
                  autoFocus
                />
                <p className="mt-1 text-xs text-muted-foreground">Leave empty to fall back to English: <b>{label || "—"}</b></p>
              </div>
              {target.kind === "column" && (
                <div>
                  <Label>Description (Arabic)</Label>
                  <Input
                    dir="rtl"
                    value={descriptionAr}
                    onChange={(e) => setDescriptionAr(e.target.value)}
                    placeholder="وصف قصير يظهر تحت العنوان"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Falls back to English: <b>{description || "—"}</b></p>
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button onClick={save} disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
