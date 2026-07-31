import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type SectionMediaItem = { url: string; kind: "image" | "video" };

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

// Walks an arbitrary section-data object and collects every image/video URL
// referenced anywhere inside it (nested objects and arrays included).
export function collectSectionMedia(data: any): SectionMediaItem[] {
  const out = new Map<string, SectionMediaItem>();
  const isImageUrl = (v: string) => /^(https?:|\/|data:image)/.test(v) && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(v);
  const isVideoUrl = (v: string) => /^(https?:|\/)/.test(v) && /\.(mp4|webm|mov)(\?|$)/i.test(v);
  const walk = (v: any, keyHint?: string) => {
    if (!v) return;
    if (typeof v === "string") {
      if (isImageUrl(v)) out.set(v, { url: v, kind: "image" });
      else if (isVideoUrl(v)) out.set(v, { url: v, kind: "video" });
      else if (keyHint && /(url|logo|image|src|thumb|cover|media)/i.test(keyHint) && /^https?:\/\//.test(v)) {
        // Referenced via a media-ish key but didn't match a known extension
        // (e.g. a signed URL) — still worth surfacing, best-effort as image.
        out.set(v, { url: v, kind: "image" });
      }
      return;
    }
    if (Array.isArray(v)) return v.forEach((x) => walk(x));
    if (typeof v === "object") for (const k of Object.keys(v)) walk(v[k], k);
  };
  walk(data);
  return Array.from(out.values());
}

function extractStoragePath(url: string): string {
  const noQuery = url.split("?")[0];
  const marker = "/object/sign/media/";
  const idx = noQuery.indexOf(marker);
  return idx === -1 ? noQuery : decodeURIComponent(noQuery.slice(idx + marker.length));
}

function isSupabaseStorageUrl(url: string): boolean {
  return url.includes("/object/sign/media/");
}

export function MediaMetaDialog({
  item, open, onOpenChange, defaultFolder = "page-content",
}: {
  item: SectionMediaItem | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultFolder?: string;
}) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [altText, setAltText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [replacing, setReplacing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setCurrentUrl(item?.url ?? null), [item?.url]);

  const path = currentUrl ? extractStoragePath(currentUrl) : "";

  const match = useQuery({
    queryKey: ["section-media-match", path],
    enabled: !!currentUrl && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("id, file_name, file_type, alt_text, tags")
        .ilike("file_url", `%${path}%`)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const usage = useQuery({
    queryKey: ["section-media-usage", currentUrl],
    enabled: !!currentUrl && open,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("find_media_usage", { _url: currentUrl! });
      if (error) throw error;
      return (data ?? []) as unknown[];
    },
  });

  useEffect(() => {
    setAltText(match.data?.alt_text ?? "");
    setTags(match.data?.tags ?? []);
    setNewTag("");
  }, [match.data, currentUrl]);

  function addTag() {
    const t = newTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setNewTag("");
  }

  async function save() {
    if (!currentUrl) return;
    setSaving(true);
    try {
      if (match.data?.id) {
        const { error } = await supabase
          .from("media")
          .update({ alt_text: altText, tags })
          .eq("id", match.data.id);
        if (error) throw error;
      } else {
        // Not in the Media Library yet (e.g. a code-level default) — register
        // it now so alt text / tags have somewhere to live and it becomes
        // visible/manageable from the Media Library too.
        if (!user) throw new Error("You must be signed in to register new media.");
        const fileName = path.split("/").pop() || "media";
        const { error } = await supabase.from("media").insert({
          file_name: fileName,
          file_url: currentUrl,
          file_type: item?.kind === "video" ? "video/mp4" : "image/*",
          alt_text: altText,
          tags,
          folder: defaultFolder,
          uploaded_by: user.id,
        });
        if (error) throw error;
      }
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["section-media-match", path] });
      qc.invalidateQueries({ queryKey: ["media"] });
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function replaceFile(file: File) {
    if (!currentUrl || !user) return;
    setReplacing(true);
    try {
      const oldUrl = currentUrl;
      const ext = file.name.split(".").pop() || "bin";
      const key = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("media").upload(key, file, { contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("media").createSignedUrl(key, SIGNED_URL_TTL);
      if (signed.error) throw signed.error;
      const newUrl = signed.data.signedUrl;

      if (match.data?.id) {
        const { error } = await supabase.from("media").update({
          file_name: file.name,
          file_url: newUrl,
          file_type: file.type,
          file_size: file.size,
        }).eq("id", match.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("media").insert({
          file_name: file.name,
          file_url: newUrl,
          file_type: file.type,
          file_size: file.size,
          alt_text: altText,
          tags,
          folder: defaultFolder,
          uploaded_by: user.id,
        });
        if (error) throw error;
      }

      // Propagate to any database content that referenced the old URL
      // (matches by storage path, so it also catches copies signed at a
      // different time). If this asset was only a code-level default with
      // no database usage, this simply affects 0 rows — the live site
      // won't change until a developer updates the code import.
      const { data: replacedCount, error: rpcErr } = await supabase.rpc("replace_media_url", {
        _old: oldUrl,
        _new: newUrl,
      });
      if (rpcErr) throw rpcErr;

      if (isSupabaseStorageUrl(oldUrl)) {
        try {
          const oldPath = extractStoragePath(oldUrl);
          await supabase.storage.from("media").remove([oldPath]);
        } catch {
          // best-effort cleanup of the old object; not fatal
        }
      }

      const n = (replacedCount as number) ?? 0;
      if (n > 0) {
        toast.success(`Replaced. Updated ${n} live reference(s).`);
      } else {
        toast.success("Replaced in the Media Library. This file isn't used by any saved page content yet, so the live site won't change until it's set as a page's media or a developer updates the code.");
      }
      setCurrentUrl(newUrl);
      qc.invalidateQueries({ queryKey: ["section-media-match"] });
      qc.invalidateQueries({ queryKey: ["section-media-usage"] });
      qc.invalidateQueries({ queryKey: ["media"] });
    } catch (e: any) {
      toast.error(e.message ?? "Replace failed");
    } finally {
      setReplacing(false);
    }
  }

  if (!item || !currentUrl) return null;
  const kind: "image" | "video" = /\.(mp4|webm|mov)(\?|$)/i.test(currentUrl) ? "video" : item.kind;
  const usageCount = usage.data?.length ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="truncate">{match.data?.file_name ?? "Media details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-md border bg-muted/40 p-2">
            {kind === "video" ? (
              <video key={currentUrl} src={currentUrl} muted loop playsInline controls className="max-h-64 rounded" />
            ) : (
              <img key={currentUrl} src={currentUrl} alt={altText} className="max-h-64 rounded object-contain" />
            )}
          </div>
          {!match.isLoading && !match.data && (
            <p className="text-xs text-muted-foreground">
              Not yet registered in the Media Library — saving will add it (folder: {defaultFolder}).
            </p>
          )}
          {!usage.isLoading && (
            <p className="text-xs text-muted-foreground">
              {usageCount > 0
                ? `Used live on ${usageCount} page section(s) — replacing here updates all of them.`
                : "Not currently used by any saved page content — this may be a code-only default. Replacing it updates the Media Library but won't change the live site unless a page is set to use it, or a developer updates the code."}
            </p>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Alt text</Label>
            <Input
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the media for accessibility & SEO"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Tags</Label>
            <div className="flex flex-wrap gap-1">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="gap-1">
                  {t}
                  <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add tag and press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input readOnly value={currentUrl} className="text-xs" />
          </div>
        </div>
        <DialogFooter className="flex flex-wrap justify-between gap-2 sm:justify-between">
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept={kind === "video" ? "video/*" : "image/*"}
            onChange={(e) => e.target.files?.[0] && replaceFile(e.target.files[0])}
          />
          <Button
            type="button"
            variant="outline"
            disabled={replacing}
            onClick={() => fileInputRef.current?.click()}
          >
            <RefreshCw className="mr-1 h-4 w-4" /> {replacing ? "Replacing…" : "Replace file"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
            <Button onClick={save} disabled={saving || match.isLoading}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SectionMediaUsagePanel({ data }: { data: any }) {
  const items = collectSectionMedia(data);
  const [selected, setSelected] = useState<SectionMediaItem | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="rounded-md border border-border">
      <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
        Media used in this section ({items.length}) — click to edit alt text, tags, or replace
      </div>
      <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((item) => (
          <button
            key={item.url}
            type="button"
            onClick={() => setSelected(item)}
            className="block overflow-hidden rounded border transition-shadow hover:shadow"
            title="Click to edit alt text, tags, or replace"
          >
            {item.kind === "video" ? (
              <video src={item.url} muted playsInline className="h-16 w-full object-cover" />
            ) : (
              <img src={item.url} alt="" className="h-16 w-full object-cover" />
            )}
          </button>
        ))}
      </div>
      <MediaMetaDialog item={selected} open={!!selected} onOpenChange={(o) => !o && setSelected(null)} />
    </div>
  );
}
