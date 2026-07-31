import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const FFMPEG =
  "/c/Users/amrme/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin/ffmpeg.exe";

function compress(buf, contentType) {
  const isImage = contentType.startsWith("image/") && contentType !== "image/svg+xml" && contentType !== "image/gif";
  const isVideo = contentType.startsWith("video/");
  if (!isImage && !isVideo) return { buf, contentType, ext: null };

  const tmpDir = os.tmpdir();
  const inExt = isImage ? "jpg" : "mp4";
  const inPath = path.join(tmpDir, `in-${crypto.randomUUID()}.${inExt}`);
  const outExt = isImage ? "webp" : "mp4";
  const outPath = path.join(tmpDir, `out-${crypto.randomUUID()}.${outExt}`);
  try {
    fs.writeFileSync(inPath, buf);
    if (isImage) {
      execFileSync(FFMPEG, ["-y", "-i", inPath, "-quality", "82", outPath], { stdio: "pipe" });
      const outBuf = fs.readFileSync(outPath);
      if (outBuf.length >= buf.length) return { buf, contentType, ext: null }; // keep original if compression didn't help
      return { buf: outBuf, contentType: "image/webp", ext: "webp" };
    } else {
      execFileSync(
        FFMPEG,
        ["-y", "-i", inPath, "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-c:a", "aac", "-b:a", "96k", outPath],
        { stdio: "pipe" },
      );
      const outBuf = fs.readFileSync(outPath);
      if (outBuf.length >= buf.length) return { buf, contentType, ext: null };
      return { buf: outBuf, contentType: "video/mp4", ext: "mp4" };
    }
  } catch (e) {
    return { buf, contentType, ext: null }; // compression failed — fall back to original, never block the migration
  } finally {
    try { fs.unlinkSync(inPath); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
  }
}

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

const BATCH_SIZE = Number(process.argv[2] || 20);
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 365 * 10;
const isLovableUrl = (s) => typeof s === "string" && (s.includes("lovable.app") || s.includes("/__l5e/"));

function extFromContentType(ct) {
  const map = {
    "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp",
    "image/gif": "gif", "image/svg+xml": "svg", "video/mp4": "mp4", "video/quicktime": "mov",
  };
  return map[(ct || "").split(";")[0].trim()] || "bin";
}

function findLovableUrls(obj, found = new Set()) {
  if (typeof obj === "string") {
    if (isLovableUrl(obj)) found.add(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((v) => findLovableUrls(v, found));
  } else if (obj && typeof obj === "object") {
    Object.values(obj).forEach((v) => findLovableUrls(v, found));
  }
  return found;
}

function replaceUrlsDeep(obj, map) {
  if (typeof obj === "string") {
    return map.has(obj) ? map.get(obj) : obj;
  } else if (Array.isArray(obj)) {
    return obj.map((v) => replaceUrlsDeep(v, map));
  } else if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = replaceUrlsDeep(v, map);
    return out;
  }
  return obj;
}

// Known-broken source URLs (missing UUID folder in the Lovable path) with a
// verified-working replacement source found via the matching code-level
// .asset.json pointer. The JSON is still updated using the ORIGINAL (broken)
// string as the search key — only the download source is swapped.
const KNOWN_URL_FIXES = {
  "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/uae-compliance/uae-cta.mp4":
    "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/c74c24a1-0e06-4536-859a-ba92bf585627/uae-cta.mp4",
  "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/uae-compliance/uae-hero.mp4":
    "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/9ca3e528-228b-4879-8edd-5bb488aaa25f/uae-hero.mp4",
};

const urlCache = new Map(); // oldUrl -> newUrl | null (null = failed, leave untouched)
const urlLog = [];

async function migrateUrl(oldUrl) {
  if (urlCache.has(oldUrl)) return urlCache.get(oldUrl);
  const fetchUrl = KNOWN_URL_FIXES[oldUrl] || oldUrl;
  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      urlLog.push({ url: oldUrl, status: "failed", reason: `download HTTP ${res.status}` });
      urlCache.set(oldUrl, null);
      return null;
    }
    const downloadedType = res.headers.get("content-type") || "application/octet-stream";
    const downloadedBuf = Buffer.from(await res.arrayBuffer());

    const { buf, contentType, ext: compressedExt } = compress(downloadedBuf, downloadedType);
    const wasCompressed = compressedExt !== null;
    const ext = compressedExt || extFromContentType(contentType);
    const hash = crypto.createHash("sha1").update(oldUrl).digest("hex").slice(0, 20);
    const storagePath = `migrated-content/${hash}.${ext}`;

    const { error: uploadErr } = await supabase.storage.from("media").upload(storagePath, buf, {
      contentType,
      upsert: true,
    });
    if (uploadErr) {
      urlLog.push({ url: oldUrl, status: "failed", reason: `upload: ${uploadErr.message}` });
      urlCache.set(oldUrl, null);
      return null;
    }

    const { data: signedData, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);
    if (signErr || !signedData?.signedUrl) {
      urlLog.push({ url: oldUrl, status: "failed", reason: `sign: ${signErr?.message}` });
      urlCache.set(oldUrl, null);
      return null;
    }
    const newUrl = signedData.signedUrl;

    const verifyRes = await fetch(newUrl);
    if (!verifyRes.ok) {
      urlLog.push({ url: oldUrl, status: "failed", reason: `verify HTTP ${verifyRes.status}` });
      urlCache.set(oldUrl, null);
      return null;
    }
    const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
    if (verifyLen && Math.abs(verifyLen - buf.length) > 5) {
      urlLog.push({ url: oldUrl, status: "failed", reason: "size mismatch" });
      urlCache.set(oldUrl, null);
      return null;
    }

    urlLog.push({
      url: oldUrl,
      status: "success",
      newUrl,
      bytes: buf.length,
      originalBytes: downloadedBuf.length,
      compressed: wasCompressed,
    });
    urlCache.set(oldUrl, newUrl);
    return newUrl;
  } catch (e) {
    urlLog.push({ url: oldUrl, status: "failed", reason: `error: ${e.message}` });
    urlCache.set(oldUrl, null);
    return null;
  }
}

async function main() {
  const { data: allRows, error } = await supabase
    .from("page_sections")
    .select("id, page_id, data");

  if (error) {
    console.error("Query failed:", error.message);
    process.exit(1);
  }

  const rows = allRows
    .filter((r) => findLovableUrls(r.data).size > 0)
    .slice(0, BATCH_SIZE);

  console.log(`Processing ${rows.length} page_sections row(s) (of ${allRows.length} total, filtered client-side)...\n`);
  const rowResults = [];

  for (const row of rows) {
    const urls = findLovableUrls(row.data);
    const map = new Map();
    for (const url of urls) {
      const newUrl = await migrateUrl(url);
      map.set(url, newUrl);
    }
    const allOk = [...map.values()].every((v) => v !== null);

    if (allOk && urls.size > 0) {
      const newData = replaceUrlsDeep(row.data, map);
      const { error: updateErr } = await supabase.from("page_sections").update({ data: newData }).eq("id", row.id);
      if (updateErr) {
        rowResults.push({ id: row.id, status: "failed", reason: `db update: ${updateErr.message}`, urlCount: urls.size });
        console.log(`[FAILED] row ${row.id} — db update: ${updateErr.message}`);
      } else {
        rowResults.push({ id: row.id, status: "success", urlCount: urls.size });
        console.log(`[SUCCESS] row ${row.id} — ${urls.size} url(s) migrated`);
      }
    } else if (urls.size === 0) {
      rowResults.push({ id: row.id, status: "skipped", reason: "no lovable urls found (false match)" });
      console.log(`[SKIPPED] row ${row.id} — no lovable urls found`);
    } else {
      rowResults.push({ id: row.id, status: "failed", reason: "one or more urls failed, row left untouched", urlCount: urls.size });
      console.log(`[FAILED] row ${row.id} — one or more of ${urls.size} url(s) failed, row untouched`);
    }
  }

  const succeeded = rowResults.filter((r) => r.status === "success").length;
  const failed = rowResults.filter((r) => r.status === "failed").length;
  const skipped = rowResults.filter((r) => r.status === "skipped").length;

  const logPath = path.join(__dirname, "..", "..", "backups", `page_sections_migration_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ rowResults, urlLog }, null, 2));

  console.log(`\nDone. Rows: ${succeeded} succeeded, ${failed} failed, ${skipped} skipped.`);
  console.log(`Unique URLs processed: ${urlLog.length}`);
  console.log(`Full log: ${logPath}`);
}

main();
