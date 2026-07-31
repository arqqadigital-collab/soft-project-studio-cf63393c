// Migrates code-level image imports that go through a `.asset.json` pointer
// (genuinely Lovable-CDN-dependent at runtime via the `absoluteAssetUrls` vite
// plugin + `.url` property) to a plain local file import.
//
// For a given content file:
//   1. Find every `import X from "@/assets/.../name.ext.asset.json"`.
//   2. Download each from Lovable's CDN, verify byte size against the
//      .asset.json's recorded size, save locally as "name.ext" beside the
//      pointer (pointer file itself is left untouched on disk).
//   3. ONLY IF every image in the file succeeds: rewrite the file's imports
//      (drop ".asset.json") and rewrite every `X.url` usage to plain `X`.
//   4. If anything fails, the file is not touched at all.
//
// Usage: node migrate_code_images.mjs src/lib/zohoContent.ts

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const BASE = "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app";

const relFile = process.argv[2];
if (!relFile) {
  console.error("Usage: node migrate_code_images.mjs <relative-path-to-content-file>");
  process.exit(1);
}
const filePath = path.join(repoRoot, relFile);
const source = fs.readFileSync(filePath, "utf8");

const importRe = /import\s+(\w+)\s+from\s+"(@\/assets\/[^"]+\.(?:png|jpe?g|webp|svg|gif))\.asset\.json"\s*;?/g;
const imports = [];
let m;
while ((m = importRe.exec(source))) {
  imports.push({ varName: m[1], assetImportPath: m[2], fullMatch: m[0] });
}

if (imports.length === 0) {
  console.log("No image .asset.json imports found in this file. Nothing to do.");
  process.exit(0);
}

console.log(`Found ${imports.length} image asset import(s) in ${relFile}:`);
imports.forEach((i) => console.log(`  ${i.varName} -> ${i.assetImportPath}.asset.json`));

function resolveDiskPath(assetImportPath) {
  // assetImportPath looks like "@/assets/ai-imaging/journey/acquire.jpg"
  const rel = assetImportPath.replace(/^@\//, "");
  return path.join(repoRoot, "src", rel);
}

async function migrateOne(item) {
  const rawPath = resolveDiskPath(item.assetImportPath);
  const jsonPath = rawPath + ".asset.json";
  if (!fs.existsSync(jsonPath)) {
    return { ...item, status: "failed", reason: `pointer file not found: ${jsonPath}` };
  }
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (!json.url || !json.url.startsWith("/__l5e/")) {
    return { ...item, status: "failed", reason: "unexpected asset.json shape" };
  }
  const downloadUrl = BASE + json.url;
  try {
    const res = await fetch(downloadUrl);
    if (!res.ok) return { ...item, status: "failed", reason: `download HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (json.size && Math.abs(buf.length - json.size) > 5) {
      return { ...item, status: "failed", reason: `size mismatch: got ${buf.length}, expected ${json.size}` };
    }
    if (fs.existsSync(rawPath)) {
      const existing = fs.readFileSync(rawPath);
      if (existing.length !== buf.length) {
        return { ...item, status: "failed", reason: `local file already exists with different size at ${rawPath}` };
      }
      return { ...item, status: "success", bytes: buf.length, rawPath, note: "already present locally, verified match" };
    }
    fs.writeFileSync(rawPath, buf);
    return { ...item, status: "success", bytes: buf.length, rawPath };
  } catch (e) {
    return { ...item, status: "failed", reason: `error: ${e.message}` };
  }
}

const results = [];
for (const item of imports) {
  const r = await migrateOne(item);
  results.push(r);
  console.log(`[${r.status.toUpperCase()}] ${r.varName} (${r.assetImportPath}) ${r.reason || `${r.bytes} bytes`}`);
}

const allOk = results.every((r) => r.status === "success");

if (!allOk) {
  console.log("\nOne or more images failed to download. File left UNTOUCHED. No code changes made.");
  const logPath = path.join(repoRoot, "..", "backups", `code_images_FAILED_${path.basename(relFile)}_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
  console.log(`Log: ${logPath}`);
  process.exit(1);
}

// All succeeded — rewrite the source file.
let newSource = source;
for (const item of results) {
  // 1. Import line: drop ".asset.json"
  const oldImport = `import ${item.varName} from "${item.assetImportPath}.asset.json"`;
  const newImport = `import ${item.varName} from "${item.assetImportPath}"`;
  if (!newSource.includes(oldImport)) {
    console.error(`FATAL: could not find exact import line to replace for ${item.varName}. Aborting, no changes written.`);
    process.exit(1);
  }
  newSource = newSource.replace(oldImport, newImport);

  // 2. Usage: `varName.url` -> `varName` (word-boundary safe)
  const usageRe = new RegExp(`\\b${item.varName}\\.url\\b`, "g");
  newSource = newSource.replace(usageRe, item.varName);
}

fs.writeFileSync(filePath, newSource, "utf8");
console.log(`\nSUCCESS. ${relFile} updated: ${results.length} import(s) migrated to local files, ${results.length} usage(s) rewritten.`);

const logPath = path.join(repoRoot, "..", "backups", `code_images_migration_log_${path.basename(relFile)}_${Date.now()}.json`);
fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
console.log(`Log: ${logPath}`);
