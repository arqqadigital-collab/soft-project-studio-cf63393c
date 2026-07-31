import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type SectionMediaItem = { url: string; kind: "image" | "video" };

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

function MediaMetaDialog({
  item, open, onOpenChange,
}: {
  item: SectionMediaItem | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [altText, setAltText] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);

  const path = item ? extractStoragePath(item.url) : "";

  const match = useQuery({
    queryKey: ["section-media-match", path],
    enabled: !!item && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("id, file_name, alt_text, tags")
        .ilike("file_url", `%${path}%`)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    setAltText(match.data?.alt_text ?? "");
    setTags(match.data?.tags ?? []);
    setNewTag("");
  }, [match.data, item?.url]);

  function addTag() {
    const t = newTag.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setNewTag("");
  }

  async function save() {
    if (!item) return;
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
          file_url: item.url,
          file_type: item.kind === "video" ? "video/mp4" : "image/*",
          alt_text: altText,
          tags,
          folder: "page-content",
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

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="truncate">{match.data?.file_name ?? "Media details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-center rounded-md border bg-muted/40 p-2">
            {item.kind === "video" ? (
              <video src={item.url} muted loop playsInline controls className="max-h-64 rounded" />
            ) : (
              <img src={item.url} alt={altText} className="max-h-64 rounded object-contain" />
            )}
          </div>
          {!match.isLoading && !match.data && (
            <p className="text-xs text-muted-foreground">
              Not yet registered in the Media Library — saving will add it (folder: page-content).
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
            <Input readOnly value={item.url} className="text-xs" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={save} disabled={saving || match.isLoading}>{saving ? "Saving…" : "Save"}</Button>
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
        Media used in this section ({items.length}) — click to edit alt text & tags
      </div>
      <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
        {items.map((item) => (
          <button
            key={item.url}
            type="button"
            onClick={() => setSelected(item)}
            className="block overflow-hidden rounded border transition-shadow hover:shadow"
            title="Click to edit alt text & tags"
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
