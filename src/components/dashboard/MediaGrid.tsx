import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Search as SearchIcon, Copy, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { getBuiltinMedia, isBuiltinMedia } from "@/lib/builtinMedia";
import { Badge } from "@/components/ui/badge";

// 10-year signed URL (Supabase allows very long expiries on signed URLs).
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

async function uploadFile(file: File, userId: string) {
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

  const media = useQuery({
    queryKey: ["media", { search, filterType }],
    queryFn: async () => {
      let q = supabase.from("media").select("*").order("created_at", { ascending: false }).limit(300);
      if (search.trim()) q = q.ilike("file_name", `%${search.trim()}%`);
      if (filterType === "image") q = q.ilike("file_type", "image/%");
      const { data, error } = await q;
      if (error) throw error;
      return data as MediaRow[];
    },
  });

  const combined = useMemo(() => {
    const uploaded = media.data ?? [];
    let builtins = getBuiltinMedia();
    if (filterType === "image") {
      builtins = builtins.filter((m) => m.file_type?.startsWith("image/"));
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      builtins = builtins.filter((m) => m.file_name.toLowerCase().includes(s));
    }
    return [...uploaded, ...builtins];
  }, [media.data, filterType, search]);

  const onDrop = useCallback(async (files: File[]) => {
    if (!user) return;
    setUploading(true);
    try {
      for (const f of files) await uploadFile(f, user.id);
      toast.success(`Uploaded ${files.length} file(s)`);
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  }, [user, qc]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search files…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <label>
          <input type="file" multiple className="sr-only" onChange={(e) => e.target.files && onDrop(Array.from(e.target.files))} />
          <Button asChild disabled={uploading}>
            <span><Upload className="mr-1 h-4 w-4" /> {uploading ? "Uploading…" : "Upload"}</span>
          </Button>
        </label>
      </div>

      <div
        {...getRootProps()}
        className={`rounded-md border-2 border-dashed p-4 transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}
      >
        <input {...getInputProps()} />
        {media.isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : !media.data?.length ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Drop files here or click Upload above.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {media.data.map((m) => {
              const isImg = m.file_type?.startsWith("image/");
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => (onPick ? onPick(m) : setSelected(m))}
                  className="group overflow-hidden rounded-md border bg-card text-left transition-shadow hover:shadow"
                >
                  <div className="flex aspect-square items-center justify-center bg-muted/50">
                    {isImg ? (
                      <img src={m.file_url} alt={m.alt_text ?? ""} className="h-full w-full object-cover" />
                    ) : (
                      <span className="p-4 text-center text-xs uppercase text-muted-foreground">{m.file_type ?? "file"}</span>
                    )}
                  </div>
                  <div className="truncate p-2 text-xs">{m.file_name}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <MediaDetailsDialog media={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}

function MediaDetailsDialog({ media, onOpenChange }: { media: MediaRow | null; onOpenChange: (o: boolean) => void }) {
  const qc = useQueryClient();
  const [alt, setAlt] = useState(media?.alt_text ?? "");
  const [saving, setSaving] = useState(false);

  const usage = useQuery({
    queryKey: ["media-usage", media?.id],
    enabled: !!media,
    queryFn: async () => {
      const [posts, pages] = await Promise.all([
        supabase.from("posts").select("id, title, slug").or(`featured_image_url.eq.${media!.file_url},content.ilike.%${media!.file_url}%`),
        supabase.from("pages").select("id, title, slug").or(`featured_image_url.eq.${media!.file_url},content.ilike.%${media!.file_url}%`),
      ]);
      return {
        posts: posts.data ?? [],
        pages: pages.data ?? [],
      };
    },
  });

  useMemo(() => setAlt(media?.alt_text ?? ""), [media?.id]);

  async function saveAlt() {
    if (!media) return;
    setSaving(true);
    const { error } = await supabase.from("media").update({ alt_text: alt }).eq("id", media.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["media"] });
  }

  async function del() {
    if (!media) return;
    if (!confirm("Delete this file? This can't be undone.")) return;
    // Parse the storage path from the signed URL
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

  return (
    <Dialog open={!!media} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle className="truncate">{media.file_name}</DialogTitle></DialogHeader>
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
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Describe the image for accessibility & SEO" />
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
              ) : (usage.data?.posts.length ?? 0) + (usage.data?.pages.length ?? 0) === 0 ? (
                <p className="text-xs text-muted-foreground">Not referenced yet.</p>
              ) : (
                <ul className="space-y-0.5 text-xs">
                  {usage.data!.posts.map((p) => <li key={"p" + p.id}>Post: {p.title}</li>)}
                  {usage.data!.pages.map((p) => <li key={"pg" + p.id}>Page: {p.title}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="destructive" onClick={del}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}><X className="mr-1 h-4 w-4" /> Close</Button>
            <Button onClick={saveAlt} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
