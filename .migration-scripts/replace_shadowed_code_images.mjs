// For every local code image confirmed "shadowed" (always overridden by a
// live CMS override, so the code default is provably unreachable):
//   1. Look up its current canonical Supabase Storage path (post-dedup) by
//      content hash, mint a fresh 10-year signed URL.
//   2. Find every src/lib/*Content.ts import of that local asset path and
//      rewrite it to import the corresponding constant from a shared
//      migratedImageUrls.ts module instead (same pattern as
//      migratedVideoUrls.ts from Step 4).
//   3. ONLY once every rewrite succeeds does it delete the now-unused local
//      file — never before, and never partially.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
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

const shadowedFile = process.argv[2];
const duplicatesFile = process.argv[3];
if (!shadowedFile || !duplicatesFile) {
  console.error("Usage: node replace_shadowed_code_images.mjs <shadowed.json> <duplicates.json>");
  process.exit(1);
}
const shadowed = JSON.parse(fs.readFileSync(shadowedFile, "utf8"));
const duplicates = JSON.parse(fs.readFileSync(duplicatesFile, "utf8"));
const hashToSupabasePath = new Map(duplicates.map((d) => [d.hash, d.supabase[0]?.name]));

function toConstName(localPath) {
  const base = localPath
    .replace(/^src\/assets\//, "")
    .replace(/\.[a-z]+$/i, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
  return `IMG_${base}_URL`;
}

async function main() {
  // Step 1: resolve a signed URL for every shadowed file.
  const resolved = [];
  for (const item of shadowed) {
    const supaPath = hashToSupabasePath.get(item.hash);
    if (!supaPath) {
      console.log(`[FAILED] ${item.localPath} — no current Supabase path found for hash ${item.hash}`);
      continue;
    }
    const { data: signedData, error } = await supabase.storage.from("media").createSignedUrl(supaPath, SIGNED_URL_EXPIRY_SECONDS);
    if (error || !signedData?.signedUrl) {
      console.log(`[FAILED] ${item.localPath} — sign failed: ${error?.message}`);
      continue;
    }
    resolved.push({ localPath: item.localPath, url: signedData.signedUrl, constName: toConstName(item.localPath) });
  }
  console.log(`Resolved signed URLs for ${resolved.length}/${shadowed.length} shadowed images.\n`);

  // Step 2: find and rewrite every import across src/lib/*Content.ts.
  const libDir = path.join(repoRoot, "src", "lib");
  const contentFiles = fs.readdirSync(libDir).filter((f) => f.endsWith(".ts"));
  const assetImportPathByLocal = new Map(resolved.map((r) => [r.localPath, r]));

  let totalImportsRewritten = 0;
  const rewrittenFiles = [];
  const touchedLocalPaths = new Set();

  for (const file of contentFiles) {
    const filePath = path.join(libDir, file);
    let source = fs.readFileSync(filePath, "utf8");
    const importRe = /import\s+(\w+)\s+from\s+"(@\/assets\/([^"]+\.(?:png|jpe?g|webp|svg|gif)))"\s*;?/g;
    const matches = [...source.matchAll(importRe)];
    const changes = [];
    for (const m of matches) {
      const [fullMatch, varName, , assetRelPath] = m;
      const localPath = `src/assets/${assetRelPath}`;
      const resolvedItem = assetImportPathByLocal.get(localPath);
      if (resolvedItem) changes.push({ fullMatch, varName, localPath, resolvedItem });
    }
    if (changes.length === 0) continue;

    for (const c of changes) {
      const newImport = `import { ${c.resolvedItem.constName} as ${c.varName} } from "@/lib/migratedImageUrls";`;
      if (!source.includes(c.fullMatch.replace(/;?$/, "")) && !source.includes(c.fullMatch)) {
        console.log(`FATAL: could not find exact import for ${c.varName} in ${file}`);
        process.exit(1);
      }
      source = source.replace(c.fullMatch, newImport);
      touchedLocalPaths.add(c.localPath);
    }
    fs.writeFileSync(filePath, source, "utf8");
    totalImportsRewritten += changes.length;
    rewrittenFiles.push({ file, count: changes.length });
    console.log(`[REWRITTEN] ${file} — ${changes.length} import(s)`);
  }

  console.log(`\nTotal imports rewritten: ${totalImportsRewritten} across ${rewrittenFiles.length} file(s).`);
  console.log(`Local files with at least one import rewritten: ${touchedLocalPaths.size}/${resolved.length}`);

  // Step 3: write the shared constants module (only entries actually used).
  const usedConsts = resolved.filter((r) => touchedLocalPaths.has(r.localPath));
  const lines = [
    "// Auto-generated by .migration-scripts/replace_shadowed_code_images.mjs.",
    "// These images are provably always overridden by a live CMS entry (see",
    "// backups/code_defaults_shadow_check_*.json) — the code default is never",
    "// actually rendered, so it now points directly at the same Supabase file",
    "// instead of bundling a redundant local copy.",
    "",
    ...usedConsts.map((r) => `export const ${r.constName} = ${JSON.stringify(r.url)};`),
    "",
  ];
  fs.writeFileSync(path.join(repoRoot, "src", "lib", "migratedImageUrls.ts"), lines.join("\n"), "utf8");
  console.log(`\nWrote src/lib/migratedImageUrls.ts with ${usedConsts.length} constant(s).`);

  // Step 4: delete the now-unused local files (only ones actually rewritten).
  let deleted = 0;
  for (const r of usedConsts) {
    const fullPath = path.join(repoRoot, r.localPath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      deleted++;
    }
  }
  console.log(`Deleted ${deleted} now-unused local file(s).`);

  const logPath = path.join(repoRoot, "..", "backups", `replace_shadowed_code_images_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify({ resolved, rewrittenFiles, deleted }, null, 2));
  console.log(`Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
