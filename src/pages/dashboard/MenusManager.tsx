import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronRight, Eye, EyeOff, ArrowUp, ArrowDown, Link as LinkIcon, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MenusManager() {
  const qc = useQueryClient();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [assignSectionId, setAssignSectionId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState("");

  const groupsQ = useQuery({
    queryKey: ["menus-groups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_groups").select("*").order("position");
      if (error) throw error;
      return data;
    },
  });

  const sectionsQ = useQuery({
    queryKey: ["menus-sections"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_sections").select("*").order("position");
      if (error) throw error;
      return data;
    },
  });

  const itemsQ = useQuery({
    queryKey: ["menus-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("nav_items").select("*").order("position");
      if (error) throw error;
      return data;
    },
  });

  const pagesQ = useQuery({
    queryKey: ["menus-pages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pages")
        .select("id,title,slug,status,section_id,nav_label,position")
        .neq("status", "trashed")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["menus-groups"] });
    qc.invalidateQueries({ queryKey: ["menus-sections"] });
    qc.invalidateQueries({ queryKey: ["menus-items"] });
    qc.invalidateQueries({ queryKey: ["nav-tree"] });
    qc.invalidateQueries({ queryKey: ["menus-pages"] });
  };

  async function addGroup() {
    const label = prompt("Group label (e.g. HealthCare)");
    if (!label) return;
    const slug = label.toLowerCase().replace(/\s+/g, "-");
    const position = (groupsQ.data?.length ?? 0);
    const { error } = await supabase.from("nav_groups").insert({ label, slug, position, is_visible: true });
    if (error) return toast.error(error.message);
    toast.success("Group added");
    refresh();
  }

  async function delGroup(id: string) {
    if (!confirm("Delete this group and its sections?")) return;
    const { error } = await supabase.from("nav_groups").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function toggleGroupVisible(id: string, visible: boolean) {
    const { error } = await supabase.from("nav_groups").update({ is_visible: !visible }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function addSection(groupId: string) {
    const label = prompt("Section label");
    if (!label) return;
    const position = sectionsQ.data?.filter((s) => s.group_id === groupId).length ?? 0;
    const { error } = await supabase.from("nav_sections").insert({
      group_id: groupId, label, position, is_visible: true,
    });
    if (error) return toast.error(error.message);
    refresh();
  }

  async function delSection(id: string) {
    if (!confirm("Delete section?")) return;
    const { error } = await supabase.from("nav_sections").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function updateGroup(id: string, patch: Partial<{ label: string; slug: string; position: number; is_visible: boolean }>) {
    const { error } = await supabase.from("nav_groups").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function updateSection(id: string, patch: Partial<{ label: string; description: string | null; href: string | null; position: number; is_visible: boolean }>) {
    const { error } = await supabase.from("nav_sections").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function addItem(sectionId: string) {
    const label = prompt("Menu label");
    if (!label) return;
    const url = prompt("Internal path (/contact) or external URL (https://example.com)");
    if (!url) return;
    const item_type = /^https?:\/\//i.test(url) ? "external" : "internal";
    if (item_type === "internal" && !url.startsWith("/")) return toast.error("Internal paths must start with /");
    const position = itemsQ.data?.filter((item) => item.section_id === sectionId).length ?? 0;
    const { error } = await supabase.from("nav_items").insert({ section_id: sectionId, label, url, item_type, position, is_visible: true });
    if (error) return toast.error(error.message);
    toast.success("Menu item added");
    refresh();
  }

  async function editItem(item: NonNullable<typeof itemsQ.data>[number]) {
    const label = prompt("Menu label", item.label);
    if (!label) return;
    const url = prompt("Internal path or external URL", item.url);
    if (!url) return;
    const item_type = /^https?:\/\//i.test(url) ? "external" : "internal";
    if (item_type === "internal" && !url.startsWith("/")) return toast.error("Internal paths must start with /");
    const { error } = await supabase.from("nav_items").update({ label, url, item_type }).eq("id", item.id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("nav_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  }

  async function move(
    table: "nav_groups" | "nav_sections" | "nav_items" | "pages",
    rows: { id: string; position: number }[],
    index: number,
    direction: -1 | 1,
  ) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const current = rows[index];
    const next = rows[target];
    const [{ error: first }, { error: second }] = await Promise.all([
      supabase.from(table).update({ position: next.position }).eq("id", current.id),
      supabase.from(table).update({ position: current.position }).eq("id", next.id),
    ]);
    if (first || second) return toast.error((first || second)!.message);
    refresh();
  }

  async function moveMenuItem(
    rows: { id: string; position: number; table: "pages" | "nav_items" }[],
    index: number,
    direction: -1 | 1,
  ) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const current = rows[index];
    const next = rows[target];
    const [{ error: first }, { error: second }] = await Promise.all([
      supabase.from(current.table).update({ position: next.position }).eq("id", current.id),
      supabase.from(next.table).update({ position: current.position }).eq("id", next.id),
    ]);
    if (first || second) return toast.error((first || second)!.message);
    refresh();
  }

  async function assignPage() {
    if (!assignSectionId || !selectedPageId) return;
    const sectionPages = pagesQ.data?.filter((page) => page.section_id === assignSectionId) ?? [];
    const sectionItems = itemsQ.data?.filter((item) => item.section_id === assignSectionId) ?? [];
    const position = Math.max(-1, ...sectionPages.map((page) => page.position), ...sectionItems.map((item) => item.position)) + 1;
    const { error } = await supabase.from("pages").update({ section_id: assignSectionId, position }).eq("id", selectedPageId);
    if (error) return toast.error(error.message);
    toast.success("Page added to menu");
    setAssignSectionId(null);
    setSelectedPageId("");
    refresh();
  }

  async function removePageFromMenu(pageId: string) {
    const { error } = await supabase.from("pages").update({ section_id: null }).eq("id", pageId);
    if (error) return toast.error(error.message);
    refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Menus</h1>
          <p className="text-sm text-muted-foreground">Manage navigation groups and their sections.</p>
        </div>
        <Button onClick={addGroup}><Plus className="mr-1 h-4 w-4" /> New Group</Button>
      </div>

      {groupsQ.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {groupsQ.data?.map((g, groupIndex) => {
            const isOpen = openGroups[g.id] ?? true;
            const sections = sectionsQ.data?.filter((s) => s.group_id === g.id) ?? [];
            return (
              <Card key={g.id} className="p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenGroups((s) => ({ ...s, [g.id]: !isOpen }))}
                  >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  <Input
                    value={g.label}
                    onChange={(e) => updateGroup(g.id, { label: e.target.value })}
                    className="max-w-xs font-semibold"
                  />
                  <Input
                    value={g.slug}
                    onChange={(e) => updateGroup(g.id, { slug: e.target.value })}
                    className="max-w-[160px] text-xs text-muted-foreground"
                  />
                  <Input
                    type="number"
                    value={g.position}
                    onChange={(e) => updateGroup(g.id, { position: parseInt(e.target.value || "0") })}
                    className="w-20"
                    title="Position"
                  />
                  <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Move up" disabled={groupIndex === 0} onClick={() => move("nav_groups", groupsQ.data ?? [], groupIndex, -1)}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" title="Move down" disabled={groupIndex === (groupsQ.data?.length ?? 0) - 1} onClick={() => move("nav_groups", groupsQ.data ?? [], groupIndex, 1)}><ArrowDown className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleGroupVisible(g.id, g.is_visible)}>
                      {g.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => delGroup(g.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 space-y-2 border-l-2 border-muted pl-4">
                    {sections.map((s, sectionIndex) => {
                      const items = itemsQ.data?.filter((item) => item.section_id === s.id) ?? [];
                      const pages = pagesQ.data?.filter((page) => page.section_id === s.id) ?? [];
                      const menuItems = [
                        ...pages.map((page) => ({ ...page, table: "pages" as const, displayLabel: page.nav_label || page.title, url: `/p/${page.slug}`, is_visible: page.status === "published" })),
                        ...items.map((item) => ({ ...item, table: "nav_items" as const, displayLabel: item.label })),
                      ].sort((a, b) => a.position - b.position);
                      return (
                      <div key={s.id} className="space-y-2 border-b border-border/60 pb-2 last:border-0">
                       <div className="flex items-center gap-2">
                        <Input
                          value={s.label}
                          onChange={(e) => updateSection(s.id, { label: e.target.value })}
                          className="max-w-xs"
                        />
                        <Input
                          value={s.description ?? ""}
                          placeholder="Description"
                          onChange={(e) => updateSection(s.id, { description: e.target.value })}
                          className="max-w-xs"
                        />
                        <Input
                          value={s.href ?? ""}
                          placeholder="/href (optional)"
                          onChange={(e) => updateSection(s.id, { href: e.target.value })}
                          className="max-w-[160px]"
                        />
                        <Input
                          type="number"
                          value={s.position}
                          onChange={(e) => updateSection(s.id, { position: parseInt(e.target.value || "0") })}
                          className="w-20"
                        />
                        <Button variant="ghost" size="icon" onClick={() => updateSection(s.id, { is_visible: !s.is_visible })}>
                          {s.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="Move up" disabled={sectionIndex === 0} onClick={() => move("nav_sections", sections, sectionIndex, -1)}><ArrowUp className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" title="Move down" disabled={sectionIndex === sections.length - 1} onClick={() => move("nav_sections", sections, sectionIndex, 1)}><ArrowDown className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => delSection(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setAssignSectionId(s.id)}><Plus className="mr-1 h-4 w-4" /> Page</Button>
                        <Button variant="outline" size="sm" onClick={() => addItem(s.id)}><Plus className="mr-1 h-4 w-4" /> Custom</Button>
                       </div>
                       {menuItems.map((item, itemIndex) => (
                         <div key={`${item.table}-${item.id}`} className="ml-10 flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
                           <LinkIcon className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm font-medium">{item.displayLabel}</span>
                           <span className="max-w-xs truncate text-xs text-muted-foreground">{item.url}</span>
                           {!item.is_visible && <span className="text-xs text-muted-foreground">Hidden</span>}
                           <div className="ml-auto flex items-center gap-1">
                             <Button variant="ghost" size="icon" title="Move up" disabled={itemIndex === 0} onClick={() => moveMenuItem(menuItems, itemIndex, -1)}><ArrowUp className="h-4 w-4" /></Button>
                             <Button variant="ghost" size="icon" title="Move down" disabled={itemIndex === menuItems.length - 1} onClick={() => moveMenuItem(menuItems, itemIndex, 1)}><ArrowDown className="h-4 w-4" /></Button>
                             {item.table === "nav_items" ? (
                               <>
                                 <Button variant="ghost" size="icon" title={item.is_visible ? "Hide" : "Show"} onClick={() => supabase.from("nav_items").update({ is_visible: !item.is_visible }).eq("id", item.id).then(({ error }) => error ? toast.error(error.message) : refresh())}>{item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</Button>
                                 <Button variant="ghost" size="icon" title="Edit" onClick={() => editItem(item)}><Pencil className="h-4 w-4" /></Button>
                                 <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                               </>
                             ) : (
                               <Button variant="ghost" size="icon" title="Remove from menu" onClick={() => removePageFromMenu(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                             )}
                           </div>
                         </div>
                       ))}
                      </div>
                    );})}
                    <Button variant="outline" size="sm" onClick={() => addSection(g.id)}>
                      <Plus className="mr-1 h-4 w-4" /> Add Section
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Card className="p-4 bg-muted/40">
        <Label className="text-xs uppercase text-muted-foreground">Tip</Label>
        <p className="mt-1 text-sm text-muted-foreground">
          Published pages assigned in the Pages editor appear automatically. Use Item for custom internal paths or external URLs.
        </p>
      </Card>

      <Dialog open={!!assignSectionId} onOpenChange={(open) => !open && setAssignSectionId(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add existing page</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Page</Label>
            <Select value={selectedPageId} onValueChange={setSelectedPageId}>
              <SelectTrigger><SelectValue placeholder="Choose a page" /></SelectTrigger>
              <SelectContent>
                {pagesQ.data?.map((page) => <SelectItem key={page.id} value={page.id}>{page.title}{page.section_id ? " (currently assigned)" : ""}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignSectionId(null)}>Cancel</Button>
            <Button onClick={assignPage} disabled={!selectedPageId}>Add page</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
