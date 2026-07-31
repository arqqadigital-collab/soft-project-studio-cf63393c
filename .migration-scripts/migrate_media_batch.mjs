import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// Minimal .env parser (no dependency needed) — loads without ever printing values.
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

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env files.");
  process.exit(1);
}

const BATCH_SIZE = Number(process.argv[2] || 5);
const SIGNED_URL_EXPIRY_SECONDS = 60 * 60 * 24 * 365 * 10; // 10 years, matching existing favicon's long-lived pattern

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function extFromContentType(ct, fallbackName) {
  const map = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/quicktime": "mov",
  };
  if (ct && map[ct.split(";")[0].trim()]) return map[ct.split(";")[0].trim()];
  const fromName = (fallbackName || "").split(".").pop();
  return fromName || "bin";
}

async function migrateOne(row) {
  const log = { id: row.id, file_name: row.file_name, old_url: row.file_url };
  try {
    const res = await fetch(row.file_url);
    if (!res.ok) {
      log.status = "failed";
      log.reason = `download failed: HTTP ${res.status}`;
      return log;
    }
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = extFromContentType(contentType, row.file_name);
    const storagePath = `migrated/${row.id}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("media")
      .upload(storagePath, buf, { contentType, upsert: true });
    if (uploadErr) {
      log.status = "failed";
      log.reason = `upload failed: ${uploadErr.message}`;
      return log;
    }

    const { data: signedData, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);
    if (signErr || !signedData?.signedUrl) {
      log.status = "failed";
      log.reason = `sign url failed: ${signErr?.message ?? "no url returned"}`;
      return log;
    }
    const newUrl = signedData.signedUrl;

    const verifyRes = await fetch(newUrl);
    if (!verifyRes.ok) {
      log.status = "failed";
      log.reason = `verification fetch failed: HTTP ${verifyRes.status}`;
      return log;
    }
    const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
    if (verifyLen && Math.abs(verifyLen - buf.length) > 5) {
      log.status = "failed";
      log.reason = `verification size mismatch: expected ${buf.length}, got ${verifyLen}`;
      return log;
    }

    const { error: updateErr } = await supabase
      .from("media")
      .update({ file_url: newUrl })
      .eq("id", row.id);
    if (updateErr) {
      log.status = "failed";
      log.reason = `db update failed (file uploaded but row not repointed): ${updateErr.message}`;
      return log;
    }

    log.status = "success";
    log.new_url = newUrl;
    log.storage_path = storagePath;
    log.bytes = buf.length;
    return log;
  } catch (e) {
    log.status = "failed";
    log.reason = `unexpected error: ${e.message}`;
    return log;
  }
}

async function main() {
  const { data: rows, error } = await supabase
    .from("media")
    .select("id, file_name, file_url, folder")
    .or("file_url.ilike.%lovable.app%,file_url.ilike.%__l5e%")
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (error) {
    console.error("Query failed:", error.message);
    process.exit(1);
  }

  console.log(`Migrating ${rows.length} media row(s)...\n`);
  const results = [];
  for (const row of rows) {
    const r = await migrateOne(row);
    results.push(r);
    console.log(`[${r.status.toUpperCase()}] ${row.file_name} (${row.id})${r.reason ? " — " + r.reason : ""}`);
  }

  const succeeded = results.filter((r) => r.status === "success").length;
  const failed = results.filter((r) => r.status === "failed").length;
  const logPath = path.join(__dirname, "..", "..", "backups", `media_migration_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ batch_size: BATCH_SIZE, succeeded, failed, results }, null, 2));

  console.log(`\nDone. ${succeeded} succeeded, ${failed} failed.`);
  console.log(`Full log: ${logPath}`);
}

main();
