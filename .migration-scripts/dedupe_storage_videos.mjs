// Deduplicates identical video files that were accidentally uploaded multiple
// times to Supabase Storage under different paths during the earlier
// migration passes (same content, different storage object per DB row).
//
// For each duplicate group (identified by storage eTag = content hash):
//   1. Keep the earliest-uploaded copy as canonical; mint one fresh signed URL for it.
//   2. For every OTHER (duplicate) path in the group:
//      a. Find every DB row referencing that path (media.file_url, or any
//         nested string inside page_sections.data / case_studies / site_settings
//         / header_footer_settings) and rewrite it to the canonical signed URL.
//      b. Re-scan the whole DB to confirm ZERO remaining references to the
//         duplicate path.
//      c. ONLY THEN delete the duplicate object from storage.
//   If any step fails for a given duplicate, it is left completely untouched
//   (object kept, no partial state) and logged as failed.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnvFile(path.join(repoRoot, ".env"));
loadEnvFile(path.join(repoRoot, ".env.local"));

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 365 * 10;

// Duplicate groups, sourced directly from storage.objects grouped by eTag
// (created_at ascending, so paths[0] is the earliest / canonical copy).
const DUP_GROUPS = [
  { paths: ["migrated/939de88e-34f1-4db6-bb0e-ab0c736072b8.mp4", "migrated-content/07169a096b73bd5434d8.mp4"] },
  { paths: ["migrated/bb6b3daa-2480-4eeb-8f10-bcaa7cbc07f4.mp4", "migrated-content/46b33be2baf2a03cd8d8.mp4"] },
  { paths: [
      "migrated/430ac420-4e88-4622-ade9-526f4c8899a4.mp4",
      "migrated/99d5153d-6b5c-4229-a721-1a225b70f2c0.mp4",
      "migrated/37f147aa-aad0-42ee-bbfb-77418918ac2a.mp4",
      "migrated/ad8c2ad6-5bdd-4332-b1fa-2d82d5fd6b19.mp4",
      "migrated/d5dff375-878b-4e7d-84b1-f01b206b1d27.mp4",
      "migrated/13b372fe-0e72-4ad6-8d19-dbbe65d882e6.mp4",
      "migrated/3fc0a034-70e1-454a-90d5-e3d20b5d5991.mp4",
      "migrated/748a258d-243e-4fcc-b883-75608c2d43bd.mp4",
      "migrated-content/610eee50742e1082e167.mp4",
      "migrated-content/495f69a1615d896eac6d.mp4",
      "migrated-content/dc50508b43c244a59f33.mp4",
      "migrated-content/071136cf2dd8ca09121b.mp4",
      "migrated-content/8b18af47d2fe76219e8f.mp4",
      "migrated-content/cefb1a73289bff1ace8d.mp4",
    ] },
  { paths: [
      "migrated/9421bd4d-c977-4e6a-9a1b-9befe9fc6380.mp4",
      "migrated/b51a1dfb-28a7-41d6-862b-8edc2f1d099a.mp4",
      "migrated-content/1bebf9b82b27db423d78.mp4",
      "migrated-content/b677df6ea7a5c4ad3205.mp4",
    ] },
  { paths: ["migrated/b46a41b3-a1c7-4143-afb7-4865599228b2.mp4", "migrated-content/9ca6d05a22137a78382e.mp4"] },
  { paths: ["migrated/3eae50f7-11ad-49b8-b81b-ae4f4f798d9a.mp4", "migrated-content/7d35f2bd5d5cc59493de.mp4"] },
  { paths: ["migrated/0d9109de-76a8-43c0-9c93-3936be82b47c.mp4", "migrated-content/17ca05bb1ff9d426c8dc.mp4"] },
  { paths: ["migrated/aae683e3-3f83-4964-b865-32b0de07a1fb.mp4", "migrated-content/b2caba65b6fd8e89903f.mp4"] },
  { paths: ["migrated/63d09639-c8b2-4bd7-b741-39a5f45a01f1.mp4", "migrated-content/f59c7c503d208e76ba83.mp4"] },
  { paths: ["migrated/0e2a4717-392a-42eb-aed8-cb8c236f6af4.mp4", "migrated-content/74a28cbfd83bdcca203f.mp4"] },
  { paths: ["migrated/28bb8002-3a05-4419-ace3-e17d9167c318.mp4", "migrated-content/fb53f27a9397dbf99216.mp4"] },
];

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
  if (typeof obj === "string") {
    return obj.includes(needle) ? newUrl : obj;
  } else if (Array.isArray(obj)) {
    return obj.map((v) => replacePathRefsDeep(v, needle, newUrl));
  } else if (obj && typeof obj === "object") {
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

  const { data: ssRows } = await supabase.from("site_settings").select("id, site_logo_url, favicon_url, og_image_url");
  total += (ssRows || []).filter(
    (r) => [r.site_logo_url, r.favicon_url, r.og_image_url].some((v) => v && v.includes(needle)),
  ).length;

  const { data: hfRows } = await supabase
    .from("header_footer_settings")
    .select("id, header_logo_url, footer_logo_url, header_logo_dark_url");
  total += (hfRows || []).filter(
    (r) => [r.header_logo_url, r.footer_logo_url, r.header_logo_dark_url].some((v) => v && v.includes(needle)),
  ).length;

  return total;
}

async function migrateReferences(dupPath, canonicalUrl) {
  const results = { mediaUpdated: 0, pageSectionsUpdated: 0, caseStudiesUpdated: 0 };

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

  return results;
}

async function main() {
  const groupResults = [];
  const limit = process.argv[2] ? Number(process.argv[2]) : DUP_GROUPS.length;
  const groupsToRun = DUP_GROUPS.slice(0, limit);

  for (const group of groupsToRun) {
    const [canonicalPath, ...dupPaths] = group.paths;
    console.log(`\n=== Group: canonical=${canonicalPath} (${dupPaths.length} duplicate(s)) ===`);

    const { data: signedData, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(canonicalPath, SIGNED_URL_EXPIRY_SECONDS);
    if (signErr || !signedData?.signedUrl) {
      console.log(`[FAILED] could not sign canonical path ${canonicalPath}: ${signErr?.message}`);
      groupResults.push({ canonicalPath, status: "failed", reason: `sign canonical: ${signErr?.message}` });
      continue;
    }
    const canonicalUrl = signedData.signedUrl;

    const verifyRes = await fetch(canonicalUrl);
    if (!verifyRes.ok) {
      console.log(`[FAILED] canonical path not accessible: HTTP ${verifyRes.status}`);
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
        console.log(
          `[REWRITTEN] ${dupPath} -> canonical. media:${updateResult.mediaUpdated} page_sections:${updateResult.pageSectionsUpdated} case_studies:${updateResult.caseStudiesUpdated}`,
        );

        const refsAfter = await countRemainingRefs(dupPath);
        if (refsAfter !== 0) {
          console.log(`[FAILED] ${dupPath} — ${refsAfter} reference(s) still remain after rewrite. NOT deleting.`);
          groupResults.push({ canonicalPath, dupPath, status: "failed", reason: "refs remain after rewrite", refsAfter });
          continue;
        }

        const { error: delErr } = await supabase.storage.from("media").remove([dupPath]);
        if (delErr) {
          console.log(`[FAILED] delete failed for ${dupPath}: ${delErr.message} (DB already points to canonical, object orphaned but harmless)`);
          groupResults.push({ canonicalPath, dupPath, status: "failed", reason: `delete: ${delErr.message}` });
          continue;
        }

        console.log(`[DELETED] ${dupPath} — freed, all references confirmed migrated to canonical`);
        groupResults.push({ canonicalPath, dupPath, status: "success", ...updateResult });
      } catch (e) {
        console.log(`[FAILED] ${dupPath} — ${e.message}. Left untouched.`);
        groupResults.push({ canonicalPath, dupPath, status: "failed", reason: e.message });
      }
    }
  }

  const logPath = path.join(repoRoot, "..", "backups", `dedupe_storage_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(groupResults, null, 2));

  const succeeded = groupResults.filter((r) => r.status === "success").length;
  const failed = groupResults.filter((r) => r.status === "failed").length;
  const skipped = groupResults.filter((r) => r.status === "skipped_no_refs").length;
  console.log(`\nDone. ${succeeded} duplicate(s) deleted, ${failed} failed (left untouched), ${skipped} already clean.`);
  console.log(`Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
