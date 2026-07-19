import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Upload, Search as SearchIcon, Copy, Trash2, X, Folder as FolderIcon,
  FolderPlus, Tag as TagIcon, CheckSquare, Square, MoveRight, Pencil, RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { getBuiltinMedia, isBuiltinMedia } from "@/lib/builtinMedia";
import { Badge } from "@/components/ui/badge";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

async function uploadFile(file: File, userId: string, folder: string) {
  const ext = file.name.split(".").pop() || "bin";
  const key = `${userId}/${crypto.randomUUID()}.${ext}`;
  const up = await supabase.storage.from("media").upload(key, file, { contentType: file.type });
  if (up.error) throw up.error;
  const signed = await supabase.storage.from("media").createSignedUrl(key, SIGNED_URL_TTL);
  if (signed.error) throw signed.error;
  const { error: insertError } = await supabase.from("media").insert({
    file_name: file.name,
    file_url: signed.data.signedUrl,
    file_type: file.type,
    file_size: file.size,
    uploaded_by: userId,
    folder: folder || "root",
  });
  if (insertError) throw insertError;
}

export interface MediaRow {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
  folder?: string;
  tags?: string[];
}

type TypeFilter = "all" | "image" | "video" | "pdf" | "other";

function matchesType(m: MediaRow, t: TypeFilter) {
  const ft = m.file_type ?? "";
  if (t === "all") return true;
  if (t === "image") return ft.startsWith("image/");
  if (t === "video") return ft.startsWith("video/");
  if (t === "pdf") return ft === "application/pdf";
  return !ft.startsWith("image/") && !ft.startsWith("video/") && ft !== "application/pdf";
}

export function MediaGrid({
  onPick,
  filterType,
}: {
  onPick?: (m: MediaRow) => void;
  filterType?: "image" | "all";
}) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MediaRow | null>(null);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState<string>("root");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>(filterType === "image" ? "image" : "all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState<null | "alt" | "tag" | "move">(null);

  const media = useQuery({
    queryKey: ["media", { search }],
    queryFn: async () => {
      let q = supabase.from("media").select("*").order("created_at", { ascending: false }).limit(500);
      if (search.trim()) q = q.ilike("file_name", `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data as MediaRow[];
    },
  });

  // All folders / tags across the library (for pickers)
  const folders = useMemo(() => {
    const s = new Set<string>(["root"]);
    (media.data ?? []).forEach((m) => s.add(m.folder || "root"));
    return Array.from(s).sort();
  }, [media.data]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    (media.data ?? []).forEach((m) => (m.tags ?? []).forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [media.data]);

  const combined = useMemo(() => {
    const uploaded = media.data ?? [];
    let builtins = getBuiltinMedia() as MediaRow[];
    // Built-ins live in a virtual "built-in" folder
    builtins = builtins.map((b) => ({ ...b, folder: "built-in", tags: b.tags ?? [] }));
    let list = [...uploaded, ...builtins];
    if (filterType === "image") list = list.filter((m) => (m.file_type ?? "").startsWith("image/"));
    if (folder) list = list.filter((m) => (m.folder || "root") === folder);
    list = list.filter((m) => matchesType(m, typeFilter));
    if (tagFilter) list = list.filter((m) => (m.tags ?? []).includes(tagFilter));
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((m) => m.file_name.toLowerCase().includes(s));
    }
    return list;
  }, [media.data, filterType, folder, typeFilter, tagFilter, search]);

  // Clear stale selections when the visible list changes
  useEffect(() => {
    setSelectedIds((prev) => {
      const visible = new Set(combined.map((m) => m.id));
      const next = new Set<string>();
      prev.forEach((id) => visible.has(id) && next.add(id));
      return next;
    });
  }, [combined]);

  const onDrop = useCallback(async (files: File[]) => {
    if (!user) return;
    setUploading(true);
    try {
      for (const f of files) await uploadFile(f, user.id, folder === "built-in" ? "root" : folder);
      toast.success(`Uploaded ${files.length} file(s)`);
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [user, qc, folder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  function toggleSelect(id: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    const ids = combined.filter((m) => !isBuiltinMedia(m)).map((m) => m.id);
    setSelectedIds(new Set(ids));
  }

  function createFolder() {
    const name = prompt("New folder name")?.trim();
    if (!name) return;
    setFolder(name);
    toast.info(`Uploads will now go to "${name}". Create files to save the folder.`);
  }

  async function bulkDelete() {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    if (!confirm(`Delete ${ids.length} file(s)? This can't be undone.`)) return;
    const rows = (media.data ?? []).filter((m) => ids.includes(m.id));
    // Remove from storage first
    const keys: string[] = [];
    rows.forEach((r) => {
      const path = r.file_url.split("/object/sign/media/")[1]?.split("?")[0];
      if (path) keys.push(decodeURIComponent(path));
    });
    if (keys.length) await supabase.storage.from("media").remove(keys);
    const { error } = await supabase.from("media").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${ids.length} file(s)`);
    setSelectedIds(new Set());
    qc.invalidateQueries({ queryKey: ["media"] });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[220px_1fr]">
      {/* Sidebar: folders + tags */}
      <aside className="space-y-4 rounded-md border bg-card p-3 text-sm">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium">Folders</span>
            <Button size="icon" variant="ghost" onClick={createFolder} title="New folder">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
          <ul className="space-y-0.5">
            {folders.concat(["built-in"]).filter((v, i, a) => a.indexOf(v) === i).map((f) => (
              <li key={f}>
                <button
                  type="button"
                  onClick={() => setFolder(f)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted ${folder === f ? "bg-muted font-medium" : ""}`}
                >
                  <FolderIcon className="h-3.5 w-3.5" />
                  <span className="truncate">{f}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {allTags.length > 0 && (
          <div>
            <div className="mb-2 font-medium">Tags</div>
            <div className="flex flex-wrap gap-1">
              <Badge
                variant={tagFilter === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTagFilter(null)}
              >
                All
              </Badge>
              {allTags.map((t) => (
                <Badge
                  key={t}
                  variant={tagFilter === t ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setTagFilter(t === tagFilter ? null : t)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main area */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <label>
            <input type="file" multiple className="sr-only" onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))} />
            <Button asChild disabled={uploading}>
              <span><Upload className="mr-1 h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}</span>
            </Button>
          </label>
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
            <span className="font-medium">{selectedIds.size} selected</span>
            <div className="ml-auto flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setBulkOpen("alt")}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit alt
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBulkOpen("tag")}>
                <TagIcon className="mr-1 h-3.5 w-3.5" /> Add tag
              </Button>
              <Button size="sm" variant="outline" onClick={() => setBulkOpen("move")}>
                <MoveRight className="mr-1 h-3.5 w-3.5" /> Move
              </Button>
              <Button size="sm" variant="destructive" onClick={bulkDelete}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </div>
        )}

        {combined.length > 0 && selectedIds.size === 0 && (
          <button
            type="button"
            onClick={selectAllVisible}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <CheckSquare className="h-3.5 w-3.5" /> Select all in this folder
          </button>
        )}

        <div
          {...getRootProps()}
          className={`rounded-md border-2 border-dashed p-4 transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}
        >
          <input {...getInputProps()} />
          {media.isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : !combined.length ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Drop files here or click Upload above.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {combined.map((m) => {
                const isImg = m.file_type?.startsWith("image/");
                const builtin = isBuiltinMedia(m);
                const isSelected = selectedIds.has(m.id);
                return (
                  <div
                    key={m.id}
                    className={`group relative overflow-hidden rounded-md border bg-card text-left transition-shadow hover:shadow ${isSelected ? "ring-2 ring-primary" : ""}`}
                  >
                    {!builtin && (
                      <button
                        type="button"
                        onClick={(e) => toggleSelect(m.id, e)}
                        className="absolute left-1 top-1 z-10 rounded bg-background/80 p-0.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 aria-pressed:opacity-100"
                        aria-pressed={isSelected}
                        title={isSelected ? "Deselect" : "Select"}
                      >
                        {isSelected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                      </button>
                    )}
                    {builtin && (
                      <Badge variant="secondary" className="absolute right-1 top-1 z-10 text-[10px]">Built-in</Badge>
                    )}
                    <button
                      type="button"
                      onClick={() => (onPick ? onPick(m) : setSelected(m))}
                      className="block w-full"
                    >
                      <div className="flex aspect-square items-center justify-center bg-muted/50">
                        {isImg ? (
                          <img src={m.file_url} alt={m.alt_text ?? ""} className="h-full w-full object-cover" />
                        ) : (
                          <span className="p-4 text-center text-xs uppercase text-muted-foreground">{m.file_type ?? "file"}</span>
                        )}
                      </div>
                      <div className="truncate p-2 text-xs">{m.file_name}</div>
                      {(m.tags?.length ?? 0) > 0 && (
                        <div className="flex flex-wrap gap-0.5 px-2 pb-2">
                          {m.tags!.slice(0, 2).map((t) => (
                            <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                          ))}
                          {(m.tags!.length ?? 0) > 2 && (
                            <span className="text-[9px] text-muted-foreground">+{m.tags!.length - 2}</span>
                          )}
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <MediaDetailsDialog
          media={selected}
          folders={folders}
          allTags={allTags}
          onOpenChange={(o) => !o && setSelected(null)}
        />

        <BulkActionDialog
          mode={bulkOpen}
          onClose={() => setBulkOpen(null)}
          ids={Array.from(selectedIds)}
          folders={folders}
          onDone={() => {
            setSelectedIds(new Set());
            qc.invalidateQueries({ queryKey: ["media"] });
          }}
        />
      </div>
    </div>
  );
}

function BulkActionDialog({
  mode, onClose, ids, folders, onDone,
}: {
  mode: null | "alt" | "tag" | "move";
  onClose: () => void;
  ids: string[];
  folders: string[];
  onDone: () => void;
}) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setValue(""), [mode]);

  if (!mode) return null;

  async function apply() {
    if (!ids.length) return;
    setBusy(true);
    try {
      if (mode === "alt") {
        const { error } = await supabase.from("media").update({ alt_text: value }).in("id", ids);
        if (error) throw error;
      } else if (mode === "move") {
        const target = value.trim() || "root";
        const { error } = await supabase.from("media").update({ folder: target }).in("id", ids);
        if (error) throw error;
      } else if (mode === "tag") {
        const tag = value.trim();
        if (!tag) throw new Error("Enter a tag name");
        // Append tag if not present
        const { data: rows, error: e1 } = await supabase.from("media").select("id, tags").in("id", ids);
        if (e1) throw e1;
        await Promise.all(
          (rows ?? []).map((r: any) => {
            const next = Array.from(new Set([...(r.tags ?? []), tag]));
            return supabase.from("media").update({ tags: next }).eq("id", r.id);
          })
        );
      }
      toast.success("Updated");
      onDone();
      onClose();
    } catch (e: any) {
      toast.error(e.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "alt" ? "Set alt text on all selected" : mode === "tag" ? "Add tag to selected" : "Move selected to folder";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        {mode === "move" ? (
          <div className="space-y-2">
            <Label className="text-xs">Folder</Label>
            <Input list="folder-suggest" value={value} onChange={(e) => setValue(e.target.value)} placeholder="root, logos, hero-images…" />
            <datalist id="folder-suggest">
              {folders.map((f) => <option key={f} value={f} />)}
            </datalist>
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs">{mode === "alt" ? "Alt text" : "Tag"}</Label>
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder={mode === "alt" ? "Describe the images…" : "e.g. logo, hero"} />
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={apply} disabled={busy}>{busy ? "Saving…" : "Apply"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MediaDetailsDialog({
  media, folders, allTags, onOpenChange,
}: {
  media: MediaRow | null;
  folders: string[];
  allTags: string[];
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const [alt, setAlt] = useState(media?.alt_text ?? "");
  const [folder, setFolder] = useState(media?.folder ?? "root");
  const [tags, setTags] = useState<string[]>(media?.tags ?? []);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const { user } = useAuth();

  async function replaceFile(file: File) {
    if (!media || !user) return;
    setReplacing(true);
    try {
      const oldUrl = media.file_url;
      const ext = file.name.split(".").pop() || "bin";
      const key = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("media").upload(key, file, { contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("media").createSignedUrl(key, SIGNED_URL_TTL);
      if (signed.error) throw signed.error;
      const newUrl = signed.data.signedUrl;

      const { error: upErr } = await supabase.from("media").update({
        file_name: file.name,
        file_url: newUrl,
        file_type: file.type,
        file_size: file.size,
      }).eq("id", media.id);
      if (upErr) throw upErr;

      const { data: n, error: rpcErr } = await supabase.rpc("replace_media_url", { _old: oldUrl, _new: newUrl });
      if (rpcErr) throw rpcErr;

      // Best-effort remove the old storage object
      try {
        const oldPath = oldUrl.split("/object/sign/media/")[1]?.split("?")[0];
        if (oldPath) await supabase.storage.from("media").remove([decodeURIComponent(oldPath)]);
      } catch {}

      toast.success(`Replaced. Updated ${n ?? 0} reference(s).`);
      qc.invalidateQueries({ queryKey: ["media"] });
      qc.invalidateQueries({ queryKey: ["media-usage"] });
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Replace failed");
    } finally {
      setReplacing(false);
    }
  }

  const usage = useQuery({
    queryKey: ["media-usage", media?.id, media?.file_url],
    enabled: !!media,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("find_media_usage", { _url: media!.file_url });
      if (error) throw error;
      return (data ?? []) as { entity_type: string; entity_id: string; title: string; slug: string }[];
    },
  });

  useEffect(() => {
    setAlt(media?.alt_text ?? "");
    setFolder(media?.folder ?? "root");
    setTags(media?.tags ?? []);
    setNewTag("");
  }, [media?.id]);

  async function save() {
    if (!media) return;
    setSaving(true);
    const { error } = await supabase.from("media").update({
      alt_text: alt, folder: folder || "root", tags,
    }).eq("id", media.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["media"] });
  }

  async function del() {
    if (!media) return;
    if (!confirm("Delete this file? This can't be undone.")) return;
    try {
      const path = media.file_url.split("/object/sign/media/")[1]?.split("?")[0];
      if (path) await supabase.storage.from("media").remove([decodeURIComponent(path)]);
    } catch {}
    const { error } = await supabase.from("media").delete().eq("id", media.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["media"] });
    onOpenChange(false);
  }

  if (!media) return null;
  const isImg = media.file_type?.startsWith("image/");
  const builtin = isBuiltinMedia(media);

  function addTag() {
    const t = newTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setNewTag("");
  }

  return (
    <Dialog open={!!media} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate">
            {media.file_name}
            {builtin && <Badge variant="secondary" className="ml-2 align-middle text-[10px]">Built-in</Badge>}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className="flex items-center justify-center rounded-md border bg-muted/40 p-2">
            {isImg
              ? <img src={media.file_url} alt={media.alt_text ?? ""} className="max-h-[400px] object-contain" />
              : <div className="p-8 text-center text-sm text-muted-foreground">{media.file_type}</div>}
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div><span className="text-foreground">Type:</span> {media.file_type ?? "—"}</div>
              <div><span className="text-foreground">Size:</span> {media.file_size ? `${Math.round(media.file_size / 1024)} KB` : "—"}</div>
              <div className="col-span-2"><span className="text-foreground">Uploaded:</span> {formatDistanceToNow(new Date(media.created_at), { addSuffix: true })}</div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Alt text</Label>
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for accessibility & SEO" disabled={builtin} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Folder</Label>
              <Input
                list="detail-folder-suggest"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="root"
                disabled={builtin}
              />
              <datalist id="detail-folder-suggest">
                {folders.map((f) => <option key={f} value={f} />)}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tags</Label>
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    {!builtin && (
                      <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {!builtin && (
                <div className="flex gap-2">
                  <Input
                    list="detail-tag-suggest"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Add tag and press Enter"
                  />
                  <datalist id="detail-tag-suggest">
                    {allTags.map((t) => <option key={t} value={t} />)}
                  </datalist>
                  <Button type="button" variant="outline" onClick={addTag}>Add</Button>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">URL</Label>
              <div className="flex gap-2">
                <Input readOnly value={media.file_url} className="text-xs" />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(media.file_url); toast.success("Copied"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs font-medium">Used in</div>
              {usage.isLoading ? (
                <p className="text-xs text-muted-foreground">Checking…</p>
              ) : (usage.data?.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground">Not referenced yet.</p>
              ) : (
                <ul className="max-h-32 space-y-0.5 overflow-y-auto text-xs">
                  {usage.data!.map((u, i) => (
                    <li key={u.entity_type + u.entity_id + i}>
                      <span className="capitalize text-muted-foreground">{u.entity_type.replace("_", " ")}:</span> {u.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-wrap justify-between gap-2 sm:justify-between">
          {builtin ? (
            <span className="text-xs text-muted-foreground">Built-in asset — cannot be modified</span>
          ) : (
            <Button variant="destructive" onClick={del}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
          )}
          <div className="flex flex-wrap gap-2">
            {!builtin && (
              <label>
                <input
                  type="file"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && replaceFile(e.target.files[0])}
                />
                <Button asChild variant="outline" disabled={replacing}>
                  <span><RefreshCw className="mr-1 h-4 w-4" /> {replacing ? "Replacing…" : "Replace file"}</span>
                </Button>
              </label>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}><X className="mr-1 h-4 w-4" /> Close</Button>
            <Button onClick={save} disabled={saving || builtin}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
