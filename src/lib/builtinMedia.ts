// Built-in default images/videos shipped with the site.
// These appear alongside uploaded media inside the Media Library so
// admins can preview and pick them from the same place.
import { DEFAULTS } from "@/lib/homepageContent";
import type { MediaRow } from "@/components/dashboard/MediaGrid";

function guessType(url: string): string {
  const u = url.toLowerCase().split("?")[0];
  if (u.endsWith(".mov") || u.endsWith(".mp4") || u.endsWith(".webm")) return "video/mp4";
  if (u.endsWith(".svg")) return "image/svg+xml";
  if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
  if (u.endsWith(".webp")) return "image/webp";
  return "image/png";
}

function b(name: string, url: string): MediaRow {
  return {
    id: `builtin:${name}`,
    file_name: name,
    file_url: url,
    file_type: guessType(url),
    file_size: null,
    alt_text: null,
    uploaded_by: null,
    created_at: "1970-01-01T00:00:00.000Z",
  };
}

export function getBuiltinMedia(): MediaRow[] {
  const list: MediaRow[] = [];

  list.push(b("expertise.png", DEFAULTS.expertise.image_url));

  DEFAULTS.process.cards.forEach((c, i) =>
    list.push(b(`process-${i + 1}.mov`, c.video_url))
  );

  DEFAULTS.services.items.forEach((s, i) =>
    list.push(b(`service-${i + 1}-${s.title.replace(/\s+/g, "-").toLowerCase()}.png`, s.image_url))
  );

  DEFAULTS.clients.logos.forEach((l, i) =>
    list.push(b(`client-${String(i + 1).padStart(2, "0")}.png`, l.src))
  );

  DEFAULTS.partners.logos.forEach((l, i) =>
    list.push(b(`partner-${String(i + 1).padStart(2, "0")}.png`, l.src))
  );

  DEFAULTS.success_stories.items.forEach((s, i) =>
    list.push(b(`case-${i + 1}-${s.company.replace(/\s+/g, "-").toLowerCase()}.jpg`, s.image_url))
  );

  list.push(b("cta-testimonial.mov", DEFAULTS.cta.video_url));

  return list;
}

export function isBuiltinMedia(m: Pick<MediaRow, "id">): boolean {
  return typeof m.id === "string" && m.id.startsWith("builtin:");
}
