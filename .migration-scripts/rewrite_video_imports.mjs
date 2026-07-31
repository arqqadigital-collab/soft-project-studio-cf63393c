// Rewrites every content file's video import from a local `.asset.json`
// pointer (Lovable CDN) to the shared `src/lib/migratedVideoUrls.ts` module
// (Supabase Storage), produced by migrate_code_videos.mjs /
// migrate_homepage_videos.mjs. Only runs after that module already exists
// with every constant it needs — if any mapping is missing, the file is
// left untouched and the run fails loudly rather than silently skip.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// assetPath (relative to src/assets, WITHOUT ".asset.json") -> exported const name
const ASSET_TO_CONST = {
  "ai-imaging/hero-video.mp4": "AI_IMAGING_HERO_VIDEO_URL",
  "blood-bank/cta-video.mp4": "BLOOD_BANK_CTA_VIDEO_URL",
  "his-hero.mp4": "HIS_HERO_VIDEO_URL",
  "his-cta.mp4": "HIS_CTA_VIDEO_URL",
  "emram/emram-hero.mp4": "EMRAM_HERO_VIDEO_URL",
  "emram/emram-cta.mp4": "EMRAM_CTA_VIDEO_URL",
  "dental/dental-hero.mp4": "DENTAL_HERO_VIDEO_URL",
  "dental/dental-cta.mp4": "DENTAL_CTA_VIDEO_URL",
  "dynamics/dynamics-hero-bg.mp4": "DYNAMICS_HERO_VIDEO_URL",
  "uae-compliance/uae-hero.mp4": "UAE_HERO_VIDEO_URL",
  "uae-compliance/uae-cta.mp4": "UAE_CTA_VIDEO_URL",
  "lis/lis-hero.mp4": "LIS_HERO_VIDEO_URL",
  "medication/hero-video.mp4": "MEDICATION_HERO_VIDEO_URL",
  "medication/cta-video.mp4": "MEDICATION_CTA_VIDEO_URL",
  "odoo/odoo-hero.mp4": "ODOO_HERO_VIDEO_URL",
  "rcm/rcm-hero.mp4": "RCM_HERO_VIDEO_URL",
  "rcm/his-video.mp4": "RCM_HIS_VIDEO_URL",
  "zoho/zoho-hero.mp4": "ZOHO_HERO_VIDEO_URL",
};

const modulePath = path.join(repoRoot, "src", "lib", "migratedVideoUrls.ts");
if (!fs.existsSync(modulePath)) {
  console.error("migratedVideoUrls.ts does not exist yet — run migrate_code_videos.mjs first.");
  process.exit(1);
}
const moduleSource = fs.readFileSync(modulePath, "utf8");
for (const constName of Object.values(ASSET_TO_CONST)) {
  if (!moduleSource.includes(`export const ${constName} `)) {
    console.error(`FATAL: ${constName} not found in migratedVideoUrls.ts. Aborting, nothing changed.`);
    process.exit(1);
  }
}

const importRe = /import\s+(\w+)\s+from\s+"(@\/assets\/([^"]+\.(?:mp4|mov)))\.asset\.json"\s*;?/g;

const targetDir = path.join(repoRoot, "src", "lib");
const files = fs.readdirSync(targetDir).filter((f) => f.endsWith(".ts"));

let totalFilesChanged = 0;
let totalImportsChanged = 0;

for (const file of files) {
  const filePath = path.join(targetDir, file);
  const source = fs.readFileSync(filePath, "utf8");
  const matches = [...source.matchAll(importRe)];
  if (matches.length === 0) continue;

  let newSource = source;
  const changesForFile = [];
  for (const m of matches) {
    const [fullMatch, varName, , assetRelPath] = m;
    const constName = ASSET_TO_CONST[assetRelPath];
    if (!constName) {
      console.error(`FATAL: no mapping for ${assetRelPath} in ${file}. Aborting entire run, nothing further changed.`);
      process.exit(1);
    }
    changesForFile.push({ varName, assetRelPath, constName });
  }

  // Group imports from the shared module by constName, aliasing each back to
  // its original local variable name so no usage sites need touching except
  // dropping the `.url` accessor.
  const importSpecifiers = changesForFile
    .map((c) => `${c.constName} as ${c.varName}`)
    .join(", ");
  const sharedImportLine = `import { ${importSpecifiers} } from "@/lib/migratedVideoUrls";`;

  // Remove each original asset.json import line.
  for (const c of changesForFile) {
    const oldImportRe = new RegExp(
      `import\\s+${c.varName}\\s+from\\s+"@/assets/${c.assetRelPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.asset\\.json"\\s*;?\\n?`,
    );
    if (!oldImportRe.test(newSource)) {
      console.error(`FATAL: could not find import line for ${c.varName} in ${file}. Aborting, no changes written for this file.`);
      process.exit(1);
    }
    newSource = newSource.replace(oldImportRe, "");
  }

  // Insert the shared import once, right after the last existing import line
  // (or at top if none) — placed before the first non-import line found.
  const lines = newSource.split("\n");
  let insertIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith("import ")) insertIdx = i + 1;
  }
  lines.splice(insertIdx, 0, sharedImportLine);
  newSource = lines.join("\n");

  // Replace `.url` usages for each migrated variable.
  for (const c of changesForFile) {
    const usageRe = new RegExp(`\\b${c.varName}\\.url\\b`, "g");
    newSource = newSource.replace(usageRe, c.varName);
  }

  fs.writeFileSync(filePath, newSource, "utf8");
  totalFilesChanged++;
  totalImportsChanged += changesForFile.length;
  console.log(`[REWRITTEN] ${file} — ${changesForFile.length} video import(s)`);
}

console.log(`\nDone. ${totalFilesChanged} file(s) changed, ${totalImportsChanged} import(s) rewritten.`);
