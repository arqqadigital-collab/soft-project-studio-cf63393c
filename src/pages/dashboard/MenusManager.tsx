import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function MenusManager() {
  const qc = useQueryClient();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

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

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["menus-groups"] });
    qc.invalidateQueries({ queryKey: ["menus-sections"] });
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
          {groupsQ.data?.map((g) => {
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
                    {sections.map((s) => (
                      <div key={s.id} className="flex items-center gap-2">
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
                        <Button variant="ghost" size="icon" onClick={() => delSection(s.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
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
          Pages are assigned to sections from the Pages editor. Adjust the numeric position to reorder items.
        </p>
      </Card>
    </div>
  );
}
