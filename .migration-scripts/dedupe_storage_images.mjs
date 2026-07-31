// Deduplicates images uploaded redundantly to multiple Supabase Storage
// paths (same content, different object), mirroring dedupe_storage_videos.mjs.
// Input: a JSON array of { hash, local, supabase: [{name,size}, ...] } groups
// where supabase.length > 1 (produced by find_code_supabase_duplicates.mjs).
//
// For each group: keep the earliest-created copy as canonical, rewrite every
// DB reference (media.file_url, page_sections.data, case_studies,
// homepage_sections.content) pointing at any other copy to the canonical
// signed URL, verify zero references remain, THEN delete the duplicate
// object. Any failure leaves that duplicate untouched.

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

const groupsFile = process.argv[2];
if (!groupsFile) {
  console.error("Usage: node dedupe_storage_images.mjs <groups.json>");
  process.exit(1);
}
const groups = JSON.parse(fs.readFileSync(groupsFile, "utf8"));

function findPathRefs(obj, needle, found = []) {
  if (typeof obj === "string") {
    if (obj.includes(needle)) found.push(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((v) => findPathRefs(v, needle, found));
  } else if (obj && typeof obj === "object") {
    Object.values(obj).forEach((v) => findPathRefs(v, needle, found));
  }
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
  total += (mediaRows || []).filter((r) => r.file_url && r.file_url.includes(needle)).length;

  const { data: psRows } = await supabase.from("page_sections").select("id, data");
  total += (psRows || []).filter((r) => findPathRefs(r.data, needle).length > 0).length;

  const { data: csRows } = await supabase.from("case_studies").select("id, cover_image_url");
  total += (csRows || []).filter((r) => r.cover_image_url && r.cover_image_url.includes(needle)).length;

  const { data: hsRows } = await supabase.from("homepage_sections").select("section_key, content");
  total += (hsRows || []).filter((r) => findPathRefs(r.content, needle).length > 0).length;

  return total;
}

async function migrateReferences(dupPath, canonicalUrl) {
  const results = { mediaUpdated: 0, pageSectionsUpdated: 0, caseStudiesUpdated: 0, homepageSectionsUpdated: 0 };

  const { data: mediaRows, error: mErr } = await supabase.from("media").select("id, file_url");
  if (mErr) throw new Error(`media select failed: ${mErr.message}`);
  for (const row of mediaRows || []) {
    if (row.file_url && row.file_url.includes(dupPath)) {
      const { error } = await supabase.from("media").update({ file_url: canonicalUrl }).eq("id", row.id);
      if (error) throw new Error(`media update failed for ${row.id}: ${error.message}`);
      results.mediaUpdated++;
    }
  }

  const { data: psRows, error: pErr } = await supabase.from("page_sections").select("id, data");
  if (pErr) throw new Error(`page_sections select failed: ${pErr.message}`);
  for (const row of psRows || []) {
    if (findPathRefs(row.data, dupPath).length > 0) {
      const newData = replacePathRefsDeep(row.data, dupPath, canonicalUrl);
      const { error } = await supabase.from("page_sections").update({ data: newData }).eq("id", row.id);
      if (error) throw new Error(`page_sections update failed for ${row.id}: ${error.message}`);
      results.pageSectionsUpdated++;
    }
  }

  const { data: csRows, error: cErr } = await supabase.from("case_studies").select("id, cover_image_url");
  if (cErr) throw new Error(`case_studies select failed: ${cErr.message}`);
  for (const row of csRows || []) {
    if (row.cover_image_url && row.cover_image_url.includes(dupPath)) {
      const { error } = await supabase.from("case_studies").update({ cover_image_url: canonicalUrl }).eq("id", row.id);
      if (error) throw new Error(`case_studies update failed for ${row.id}: ${error.message}`);
      results.caseStudiesUpdated++;
    }
  }

  const { data: hsRows, error: hErr } = await supabase.from("homepage_sections").select("section_key, content");
  if (hErr) throw new Error(`homepage_sections select failed: ${hErr.message}`);
  for (const row of hsRows || []) {
    if (findPathRefs(row.content, dupPath).length > 0) {
      const newContent = replacePathRefsDeep(row.content, dupPath, canonicalUrl);
      const { error } = await supabase.from("homepage_sections").update({ content: newContent }).eq("section_key", row.section_key);
      if (error) throw new Error(`homepage_sections update failed for ${row.section_key}: ${error.message}`);
      results.homepageSectionsUpdated++;
    }
  }

  return results;
}

async function main() {
  // Build a name -> created_at map for the two known prefixes.
  console.log("Listing storage objects to determine creation order...");
  const createdAt = new Map();
  for (const prefix of ["migrated", "migrated-content"]) {
    let offset = 0;
    for (;;) {
      const { data, error } = await supabase.storage.from("media").list(prefix, { limit: 1000, offset });
      if (error) throw new Error(`list ${prefix} failed: ${error.message}`);
      if (!data || data.length === 0) break;
      for (const item of data) createdAt.set(`${prefix}/${item.name}`, item.created_at);
      if (data.length < 1000) break;
      offset += 1000;
    }
  }
  console.log(`Indexed ${createdAt.size} object(s).\n`);

  const groupResults = [];

  for (const group of groups) {
    const paths = group.supabase.map((s) => s.name).sort((a, b) => {
      const ta = createdAt.get(a) || "9999";
      const tb = createdAt.get(b) || "9999";
      return ta.localeCompare(tb);
    });
    const [canonicalPath, ...dupPaths] = paths;
    console.log(`=== Group ${group.hash.slice(0, 8)}: canonical=${canonicalPath} (${dupPaths.length} dup(s)) ===`);

    const { data: signedData, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(canonicalPath, SIGNED_URL_EXPIRY_SECONDS);
    if (signErr || !signedData?.signedUrl) {
      console.log(`[FAILED] could not sign canonical ${canonicalPath}: ${signErr?.message}`);
      groupResults.push({ canonicalPath, status: "failed", reason: `sign canonical: ${signErr?.message}` });
      continue;
    }
    const canonicalUrl = signedData.signedUrl;

    const verifyRes = await fetch(canonicalUrl);
    if (!verifyRes.ok) {
      console.log(`[FAILED] canonical not accessible: HTTP ${verifyRes.status}`);
      groupResults.push({ canonicalPath, status: "failed", reason: `canonical fetch HTTP ${verifyRes.status}` });
      continue;
    }

    for (const dupPath of dupPaths) {
      try {
        const refsBefore = await countRemainingRefs(dupPath);
        if (refsBefore === 0) {
          console.log(`[SKIP] ${dupPath} — no DB references found (already clean)`);
          groupResults.push({ canonicalPath, dupPath, status: "skipped_no_refs" });
          continue;
        }
        const updateResult = await migrateReferences(dupPath, canonicalUrl);
        const refsAfter = await countRemainingRefs(dupPath);
        if (refsAfter !== 0) {
          console.log(`[FAILED] ${dupPath} — ${refsAfter} reference(s) remain after rewrite. NOT deleting.`);
          groupResults.push({ canonicalPath, dupPath, status: "failed", reason: "refs remain", refsAfter });
          continue;
        }
        const { error: delErr } = await supabase.storage.from("media").remove([dupPath]);
        if (delErr) {
          console.log(`[FAILED] delete failed for ${dupPath}: ${delErr.message}`);
          groupResults.push({ canonicalPath, dupPath, status: "failed", reason: `delete: ${delErr.message}` });
          continue;
        }
        console.log(`[DELETED] ${dupPath} — refs migrated:`, JSON.stringify(updateResult));
        groupResults.push({ canonicalPath, dupPath, status: "success", ...updateResult });
      } catch (e) {
        console.log(`[FAILED] ${dupPath} — ${e.message}`);
        groupResults.push({ canonicalPath, dupPath, status: "failed", reason: e.message });
      }
    }
  }

  const logPath = path.join(repoRoot, "..", "backups", `dedupe_storage_images_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(groupResults, null, 2));
  const succeeded = groupResults.filter((r) => r.status === "success").length;
  const failed = groupResults.filter((r) => r.status === "failed").length;
  const skipped = groupResults.filter((r) => r.status === "skipped_no_refs").length;
  console.log(`\nDone. ${succeeded} deleted, ${failed} failed, ${skipped} already clean.`);
  console.log(`Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
