// One-off: dedupes the 7-way duplicate CTA video group discovered by a
// fresh eTag scan (same content, uploaded once per content file during
// Step 4, all landing byte-identical after ffmpeg compression). Updates
// both the DB references AND the src/lib/migratedVideoUrls.ts constants
// that point directly at the duplicate paths (a code reference, not just
// a DB one), then deletes the duplicate storage objects.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!(k in process.env)) process.env[k] = v;
  }
}
loadEnvFile(path.join(repoRoot, ".env"));
loadEnvFile(path.join(repoRoot, ".env.local"));

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 365 * 10;

const canonicalPath = "migrated-videos/91684df911abb6aa-cta-video.mp4";
const dupPaths = [
  "migrated-videos/e2b29b3f851dc6c6-his-cta.mp4",
  "migrated-videos/97995750224585d3-emram-cta.mp4",
  "migrated-videos/044a502d73f02fe3-dental-cta.mp4",
  "migrated-videos/b0aad9c3a8389413-uae-cta.mp4",
  "migrated-videos/a93106a7a7b7287b-cta-video.mp4",
  "migrated-videos/078cabcad14de7fe-his-video.mp4",
];

function findPathRefs(obj, needle, found = []) {
  if (typeof obj === "string") { if (obj.includes(needle)) found.push(obj); }
  else if (Array.isArray(obj)) obj.forEach((v) => findPathRefs(v, needle, found));
  else if (obj && typeof obj === "object") Object.values(obj).forEach((v) => findPathRefs(v, needle, found));
  return found;
}
function replacePathRefsDeep(obj, needle, newUrl) {
  if (typeof obj === "string") return obj.includes(needle) ? newUrl : obj;
  if (Array.isArray(obj)) return obj.map((v) => replacePathRefsDeep(v, needle, newUrl));
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = replacePathRefsDeep(v, needle, newUrl);
    return out;
  }
  return obj;
}

async function countRemainingRefs(needle) {
  let total = 0;
  const { data: mediaRows } = await supabase.from("media").select("id, file_url");
  total += (mediaRows || []).filter((r) => r.file_url?.includes(needle)).length;
  const { data: psRows } = await supabase.from("page_sections").select("id, data");
  total += (psRows || []).filter((r) => findPathRefs(r.data, needle).length > 0).length;
  const { data: hsRows } = await supabase.from("homepage_sections").select("section_key, content");
  total += (hsRows || []).filter((r) => findPathRefs(r.content, needle).length > 0).length;
  return total;
}

async function migrateReferences(dupPath, canonicalUrl) {
  const results = { mediaUpdated: 0, pageSectionsUpdated: 0, homepageSectionsUpdated: 0 };
  const { data: mediaRows } = await supabase.from("media").select("id, file_url");
  for (const row of mediaRows || []) {
    if (row.file_url?.includes(dupPath)) {
      const { error } = await supabase.from("media").update({ file_url: canonicalUrl }).eq("id", row.id);
      if (error) throw new Error(`media update failed: ${error.message}`);
      results.mediaUpdated++;
    }
  }
  const { data: psRows } = await supabase.from("page_sections").select("id, data");
  for (const row of psRows || []) {
    if (findPathRefs(row.data, dupPath).length > 0) {
      const newData = replacePathRefsDeep(row.data, dupPath, canonicalUrl);
      const { error } = await supabase.from("page_sections").update({ data: newData }).eq("id", row.id);
      if (error) throw new Error(`page_sections update failed: ${error.message}`);
      results.pageSectionsUpdated++;
    }
  }
  const { data: hsRows } = await supabase.from("homepage_sections").select("section_key, content");
  for (const row of hsRows || []) {
    if (findPathRefs(row.content, dupPath).length > 0) {
      const newContent = replacePathRefsDeep(row.content, dupPath, canonicalUrl);
      const { error } = await supabase.from("homepage_sections").update({ content: newContent }).eq("section_key", row.section_key);
      if (error) throw new Error(`homepage_sections update failed: ${error.message}`);
      results.homepageSectionsUpdated++;
    }
  }
  return results;
}

async function main() {
  const { data: signedData, error: signErr } = await supabase.storage.from("media").createSignedUrl(canonicalPath, SIGNED_URL_EXPIRY_SECONDS);
  if (signErr || !signedData?.signedUrl) throw new Error(`sign canonical failed: ${signErr?.message}`);
  const canonicalUrl = signedData.signedUrl;
  const verify = await fetch(canonicalUrl);
  if (!verify.ok) throw new Error(`canonical not accessible: HTTP ${verify.status}`);
  console.log("Canonical URL verified OK.\n");

  for (const dupPath of dupPaths) {
    const refsBefore = await countRemainingRefs(dupPath);
    console.log(`--- ${dupPath} (${refsBefore} DB ref(s)) ---`);
    if (refsBefore > 0) {
      const result = await migrateReferences(dupPath, canonicalUrl);
      console.log(`  DB refs migrated:`, JSON.stringify(result));
      const refsAfter = await countRemainingRefs(dupPath);
      if (refsAfter !== 0) {
        console.log(`  [FAILED] ${refsAfter} ref(s) remain. NOT deleting.`);
        continue;
      }
    }
    const { error: delErr } = await supabase.storage.from("media").remove([dupPath]);
    if (delErr) {
      console.log(`  [FAILED] delete: ${delErr.message}`);
      continue;
    }
    console.log(`  [DELETED]`);
  }

  // Update the code constants file: any constant currently pointing at a
  // duplicate path now points at the canonical URL instead.
  const constsPath = path.join(repoRoot, "src", "lib", "migratedVideoUrls.ts");
  let source = fs.readFileSync(constsPath, "utf8");
  let replaced = 0;
  for (const dupPath of dupPaths) {
    const re = new RegExp(`(export const \\w+_URL = )"[^"]*${dupPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^"]*"`, "g");
    const before = source;
    source = source.replace(re, `$1${JSON.stringify(canonicalUrl)}`);
    if (source !== before) replaced++;
  }
  fs.writeFileSync(constsPath, source, "utf8");
  console.log(`\nUpdated ${replaced} constant(s) in migratedVideoUrls.ts to point at the canonical URL.`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
