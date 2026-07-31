// Compares every local code-bundled image (src/assets/**) against every
// image already uploaded to Supabase Storage, by content hash (MD5), to
// find genuine duplicates — the same image existing in both places.
// Read-only: only reports, never deletes or modifies anything.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
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

function md5(buf) {
  return crypto.createHash("md5").update(buf).digest("hex");
}

function findLocalImages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findLocalImages(full, out);
    } else if (/\.(jpe?g|png|webp|gif|svg)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  console.log("Hashing local code images...");
  const localFiles = findLocalImages(path.join(repoRoot, "src", "assets"));
  const localByHash = new Map(); // md5 -> [{relPath, size}]
  for (const f of localFiles) {
    const buf = fs.readFileSync(f);
    const hash = md5(buf);
    const rel = path.relative(repoRoot, f).replace(/\\/g, "/");
    if (!localByHash.has(hash)) localByHash.set(hash, []);
    localByHash.get(hash).push({ path: rel, size: buf.length });
  }
  console.log(`Hashed ${localFiles.length} local image file(s), ${localByHash.size} unique hash(es).`);

  console.log("\nListing Supabase Storage image objects...");
  const prefixes = ["migrated", "migrated-content", "migrated-videos", "code-images", ""];
  const allObjects = [];
  const seenNames = new Set();

  // Recursively list every object in the bucket via storage.list (paginated per folder).
  async function listAll(prefix) {
    const { data, error } = await supabase.storage.from("media").list(prefix, { limit: 1000 });
    if (error) throw error;
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        // it's a folder
        await listAll(full);
      } else {
        if (!seenNames.has(full)) {
          seenNames.add(full);
          allObjects.push({ name: full, metadata: item.metadata });
        }
      }
    }
  }
  await listAll("");

  const supaImages = allObjects.filter((o) => (o.metadata?.mimetype || "").startsWith("image/"));
  console.log(`Found ${supaImages.length} image object(s) in Supabase Storage.`);

  const supaByHash = new Map();
  for (const obj of supaImages) {
    const etag = (obj.metadata?.eTag || "").replace(/"/g, "");
    // Only trust eTag as MD5 if it looks like a plain 32-hex-char MD5 (no "-N" multipart suffix)
    if (!/^[a-f0-9]{32}$/i.test(etag)) continue;
    if (!supaByHash.has(etag)) supaByHash.set(etag, []);
    supaByHash.get(etag).push({ name: obj.name, size: obj.metadata?.size });
  }

  console.log("\nComparing hashes...");
  const duplicates = [];
  for (const [hash, localEntries] of localByHash) {
    if (supaByHash.has(hash)) {
      duplicates.push({ hash, local: localEntries, supabase: supaByHash.get(hash) });
    }
  }

  console.log(`\n=== RESULT: ${duplicates.length} duplicate content hash(es) found between code and Supabase ===\n`);
  let totalDupBytes = 0;
  for (const d of duplicates) {
    console.log(`Hash ${d.hash}:`);
    d.local.forEach((l) => console.log(`  LOCAL:    ${l.path} (${l.size} bytes)`));
    d.supabase.forEach((s) => { console.log(`  SUPABASE: ${s.name} (${s.size} bytes)`); totalDupBytes += s.size || 0; });
    console.log("");
  }
  console.log(`Total Supabase-side bytes duplicated with local code: ${(totalDupBytes / 1024 / 1024).toFixed(2)} MB`);

  const logPath = path.join(repoRoot, "..", "backups", `code_supabase_duplicates_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(duplicates, null, 2));
  console.log(`\nFull report: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
