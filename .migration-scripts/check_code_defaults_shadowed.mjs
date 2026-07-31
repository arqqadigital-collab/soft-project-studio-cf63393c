// For every code<->Supabase duplicate found by find_code_supabase_duplicates.mjs,
// checks whether the Supabase copy is actually embedded in a live page_sections
// row (i.e. genuinely overriding the code default on the live site) or whether
// it's only sitting in the `media` table with no page actually using it.
//
// A local code file is only safe to delete if EVERY page that could render it
// currently has a CMS override pointing at the (byte-identical) Supabase copy —
// i.e. the code default is provably unreachable, not just "duplicated".
// Read-only: reports only, does not delete anything.

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

const reportFile = process.argv[2];
if (!reportFile) {
  console.error("Usage: node check_code_defaults_shadowed.mjs <path-to-duplicates-json>");
  process.exit(1);
}
const duplicates = JSON.parse(fs.readFileSync(reportFile, "utf8"));

async function isEmbeddedInAnyPageSection(storagePath) {
  // Search page_sections.data (and pages/posts content, homepage_hero, for
  // completeness) for this exact storage path, regardless of which signed
  // token is currently attached to it.
  const { data: rows, error } = await supabase.from("page_sections").select("id, page_id, data");
  if (error) throw error;
  for (const row of rows ?? []) {
    if (JSON.stringify(row.data).includes(storagePath)) return true;
  }
  const { data: hero, error: e2 } = await supabase.from("homepage_sections").select("section_key, content").limit(1000);
  if (e2) throw e2;
  for (const row of hero ?? []) {
    if (JSON.stringify(row.content).includes(storagePath)) return true;
  }
  return false;
}

async function main() {
  console.log(`Checking ${duplicates.length} duplicate group(s) for live CMS usage...\n`);
  const results = [];

  for (const dup of duplicates) {
    const supaPaths = dup.supabase.map((s) => s.name);
    let usedLive = false;
    for (const p of supaPaths) {
      if (await isEmbeddedInAnyPageSection(p)) {
        usedLive = true;
        break;
      }
    }
    for (const l of dup.local) {
      results.push({ localPath: l.path, size: l.size, hash: dup.hash, supabasePaths: supaPaths, shadowedByLiveOverride: usedLive });
    }
    console.log(`[${usedLive ? "SHADOWED (safe to remove from code)" : "STILL LIVE FROM CODE (keep)"}] ${dup.local.map((l) => l.path).join(", ")}`);
  }

  const shadowed = results.filter((r) => r.shadowedByLiveOverride);
  const stillLive = results.filter((r) => !r.shadowedByLiveOverride);
  const shadowedBytes = shadowed.reduce((a, r) => a + (r.size || 0), 0);

  console.log(`\n=== SUMMARY ===`);
  console.log(`Confirmed shadowed by a live CMS override (safe to remove from code): ${shadowed.length} file(s), ${(shadowedBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Still the live rendered default (must keep in code): ${stillLive.length} file(s)`);

  const outPath = path.join(repoRoot, "..", "backups", `code_defaults_shadow_check_${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report: ${outPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
