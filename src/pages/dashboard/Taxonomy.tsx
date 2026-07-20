import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toSlug } from "@/lib/slug";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Kind = "categories" | "tags";
type CategoryContentType = "blog" | "case_study" | "event";

interface Row {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  translations?: { ar?: { name?: string; description?: string } } | null;
}

export default function Taxonomy() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
        <p className="text-sm text-muted-foreground">Organize posts into topics.</p>
      </div>
      <Tabs defaultValue="blog">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="case_study">Case Studies</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="blog" className="mt-4">
          <TermsPanel kind="categories" hasExtras contentType="blog" />
        </TabsContent>
        <TabsContent value="case_study" className="mt-4">
          <TermsPanel kind="categories" hasExtras contentType="case_study" />
        </TabsContent>
        <TabsContent value="event" className="mt-4">
          <TermsPanel kind="categories" hasExtras contentType="event" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TermsPanel({
  kind,
  hasExtras,
  contentType,
}: {
  kind: Kind;
  hasExtras: boolean;
  contentType?: CategoryContentType;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const list = useQuery({
    queryKey: [kind, contentType ?? "all"],
    queryFn: async () => {
      const cols = hasExtras ? "id, name, slug, description, parent_id, translations" : "id, name, slug, translations";
      let query = (supabase.from(kind) as any).select(cols);
      if (kind === "categories" && contentType) query = query.eq("content_type", contentType);
      const { data, error } = await query.order("name");
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const countsQ = useQuery({
    queryKey: [`${kind}-counts`, contentType ?? "all"],
    queryFn: async () => {
      if (kind === "categories") {
        const table = contentType === "case_study" ? "case_studies" : contentType === "event" ? "events" : "posts";
        const { data, error } = await supabase.from(table).select("category_id");
        if (error) throw error;
        const m: Record<string, number> = {};
        for (const r of data ?? []) if (r.category_id) m[r.category_id] = (m[r.category_id] ?? 0) + 1;
        return m;
      }
      const { data, error } = await supabase.from("post_tags").select("tag_id");
      if (error) throw error;
      const m: Record<string, number> = {};
      for (const r of data ?? []) m[r.tag_id] = (m[r.tag_id] ?? 0) + 1;
      return m;
    },
  });

  function resetForm() {
    setName(""); setNameAr(""); setSlug(""); setDescription(""); setParentId(null);
    setEditing(null); setSlugTouched(false);
  }

  function startEdit(r: Row) {
    setEditing(r);
    setName(r.name);
    setNameAr(r.translations?.ar?.name ?? "");
    setSlug(r.slug);
    setDescription(r.description ?? "");
    setParentId(r.parent_id ?? null);
    setSlugTouched(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const finalSlug = (slug || toSlug(name)).trim();
      if (!name.trim() || !finalSlug) throw new Error("Name and slug required");
      const payload: any = { name: name.trim(), slug: finalSlug };
      if (kind === "categories" && contentType) payload.content_type = contentType;
      const ar = nameAr.trim();
      payload.translations = ar ? { ar: { name: ar } } : {};
      if (hasExtras) {
        payload.description = description.trim() || null;
        payload.parent_id = parentId;
      }
      if (editing) {
        const { error } = await supabase.from(kind).update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(kind).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      resetForm();
      qc.invalidateQueries({ queryKey: [kind, contentType ?? "all"] });
    },
    onError: (e: any) => toast.error(e.message || "Failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(kind).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: [kind, contentType ?? "all"] });
      qc.invalidateQueries({ queryKey: [`${kind}-counts`, contentType ?? "all"] });
    },
    onError: (e: any) => toast.error(e.message || "Delete failed"),
  });

  const parentOptions = (list.data ?? []).filter((r) => !editing || r.id !== editing.id);
  const counts = countsQ.data ?? {};

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{editing ? "Edit" : "Add new"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Name (English)</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(toSlug(e.target.value));
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">الاسم (Arabic)</Label>
            <Input
              dir="rtl"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: الرعاية الصحية"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => { setSlugTouched(true); setSlug(toSlug(e.target.value)); }}
            />
          </div>
          {hasExtras && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Parent</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  value={parentId ?? ""}
                  onChange={(e) => setParentId(e.target.value || null)}
                >
                  <option value="">— None —</option>
                  {parentOptions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
              {editing ? <Check className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
              {editing ? "Update" : "Add"}
            </Button>
            {editing && (
              <Button size="sm" variant="ghost" onClick={resetForm}>
                <X className="mr-1 h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                {hasExtras && <TableHead>Parent</TableHead>}
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.isLoading && (
                <TableRow><TableCell colSpan={hasExtras ? 5 : 4} className="text-center text-sm text-muted-foreground">Loading…</TableCell></TableRow>
              )}
              {list.data?.length === 0 && (
                <TableRow><TableCell colSpan={hasExtras ? 5 : 4} className="text-center text-sm text-muted-foreground">Nothing yet.</TableCell></TableRow>
              )}
              {list.data?.map((r) => {
                const parent = hasExtras ? list.data?.find((x) => x.id === r.parent_id) : null;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.slug}</TableCell>
                    {hasExtras && <TableCell className="text-muted-foreground">{parent?.name ?? "—"}</TableCell>}
                    <TableCell className="text-right text-muted-foreground">{counts[r.id] ?? 0}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(r)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{r.name}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This can't be undone. Posts will lose this {kind === "categories" ? "category" : "tag"}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove.mutate(r.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
