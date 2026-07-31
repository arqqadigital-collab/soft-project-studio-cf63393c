// Aggregates every image/video referenced by ANY page's code-level content
// defaults (src/lib/*Content.ts + homepageContent.ts), not just the
// homepage. Used by the Media Library to show a single "code-images" folder
// covering every local/code-bundled asset across the whole site, so nothing
// is invisible to admins just because it isn't database-backed.
import { collectSectionMedia } from "@/components/dashboard/SectionMediaUsage";
import type { MediaRow } from "@/components/dashboard/MediaGrid";

function guessType(url: string, kind: "image" | "video"): string {
  const u = url.toLowerCase().split("?")[0];
  if (kind === "video") return "video/mp4";
  if (u.endsWith(".svg")) return "image/svg+xml";
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
  if (u.endsWith(".webp")) return "image/webp";
  if (u.endsWith(".gif")) return "image/gif";
  return "image/png";
}

function pageLabelFromFileName(fileName: string): string {
  return fileName
    .replace(/Content\.ts$/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

let cached: MediaRow[] | null = null;

export function getAllCodeMedia(): MediaRow[] {
  if (cached) return cached;

  const modules = import.meta.glob("/src/lib/*Content.ts", { eager: true }) as Record<string, Record<string, unknown>>;
  const seen = new Map<string, MediaRow>();

  for (const [path, mod] of Object.entries(modules)) {
    const fileName = path.split("/").pop() ?? path;
    const pageLabel = pageLabelFromFileName(fileName);

    for (const [exportName, value] of Object.entries(mod)) {
      if (!/DEFAULTS$/.test(exportName)) continue;
      if (exportName === "SECTION_STYLE_DEFAULTS") continue;
      if (!value || typeof value !== "object") continue;

      const items = collectSectionMedia(value);
      for (const item of items) {
        if (seen.has(item.url)) continue;
        seen.set(item.url, {
          id: `code:${item.url}`,
          file_name: item.url.split("/").pop()?.split("?")[0] ?? item.url,
          file_url: item.url,
          file_type: guessType(item.url, item.kind),
          file_size: null,
          alt_text: null,
          uploaded_by: null,
          created_at: "1970-01-01T00:00:00.000Z",
          folder: "code-images",
          tags: [pageLabel],
        });
      }
    }
  }

  cached = Array.from(seen.values());
  return cached;
}

export function isCodeMedia(m: Pick<MediaRow, "id">): boolean {
  return typeof m.id === "string" && m.id.startsWith("code:");
}
