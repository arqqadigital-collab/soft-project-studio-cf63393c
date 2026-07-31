// Step 4: migrates the 18 unique code-level videos (referenced via
// `.asset.json` pointers in src/lib/*Content.ts) from Lovable's CDN to
// Supabase Storage, and registers each as a `media` table row so it shows up
// in the dashboard's Media Library (same control as everything else already
// migrated).
//
// Unlike the images (Step 3, kept local), videos go to Supabase Storage:
//   - they're much larger (keeping them local would bloat the git repo a lot),
//   - putting them in the `media` table means they appear in the Media
//     Library, are browsable/replaceable there, and their URL is centralized
//     in one place (`src/lib/migratedVideoUrls.ts`) instead of duplicated
//     across every file that uses them.
//
// Safety: every video is downloaded + uploaded + verified BEFORE any source
// file is touched. If even one of the 18 fails, NO source files are
// rewritten at all (all 18 share code across many files, so partial rewrites
// would be unsafe) — the whole run aborts leaving the codebase untouched.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
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

// The 18 unique videos, with the constant name each will be exported as.
const VIDEOS = [
  { assetPath: "ai-imaging/hero-video.mp4", constName: "AI_IMAGING_HERO_VIDEO_URL" },
  { assetPath: "blood-bank/cta-video.mp4", constName: "BLOOD_BANK_CTA_VIDEO_URL" },
  { assetPath: "his-hero.mp4", constName: "HIS_HERO_VIDEO_URL" },
  { assetPath: "his-cta.mp4", constName: "HIS_CTA_VIDEO_URL" },
  { assetPath: "emram/emram-hero.mp4", constName: "EMRAM_HERO_VIDEO_URL" },
  { assetPath: "emram/emram-cta.mp4", constName: "EMRAM_CTA_VIDEO_URL" },
  { assetPath: "dental/dental-hero.mp4", constName: "DENTAL_HERO_VIDEO_URL" },
  { assetPath: "dental/dental-cta.mp4", constName: "DENTAL_CTA_VIDEO_URL" },
  { assetPath: "dynamics/dynamics-hero-bg.mp4", constName: "DYNAMICS_HERO_VIDEO_URL" },
  { assetPath: "uae-compliance/uae-hero.mp4", constName: "UAE_HERO_VIDEO_URL" },
  { assetPath: "uae-compliance/uae-cta.mp4", constName: "UAE_CTA_VIDEO_URL" },
  { assetPath: "lis/lis-hero.mp4", constName: "LIS_HERO_VIDEO_URL" },
  { assetPath: "medication/hero-video.mp4", constName: "MEDICATION_HERO_VIDEO_URL" },
  { assetPath: "medication/cta-video.mp4", constName: "MEDICATION_CTA_VIDEO_URL" },
  { assetPath: "odoo/odoo-hero.mp4", constName: "ODOO_HERO_VIDEO_URL" },
  { assetPath: "rcm/rcm-hero.mp4", constName: "RCM_HERO_VIDEO_URL" },
  { assetPath: "rcm/his-video.mp4", constName: "RCM_HIS_VIDEO_URL" },
  { assetPath: "zoho/zoho-hero.mp4", constName: "ZOHO_HERO_VIDEO_URL" },
];

const BASE = "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app";

async function migrateOne(video) {
  const jsonPath = path.join(repoRoot, "src", "assets", video.assetPath + ".asset.json");
  if (!fs.existsSync(jsonPath)) {
    return { ...video, status: "failed", reason: `pointer not found: ${jsonPath}` };
  }
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  if (!json.url || !json.url.startsWith("/__l5e/")) {
    return { ...video, status: "failed", reason: "unexpected asset.json shape" };
  }

  try {
    const res = await fetch(BASE + json.url);
    if (!res.ok) return { ...video, status: "failed", reason: `download HTTP ${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    if (json.size && Math.abs(buf.length - json.size) > 5) {
      return { ...video, status: "failed", reason: `size mismatch: got ${buf.length}, expected ${json.size}` };
    }

    const fileName = path.basename(video.assetPath);
    const hash = crypto.createHash("sha1").update(video.assetPath).digest("hex").slice(0, 16);
    const storagePath = `migrated-videos/${hash}-${fileName}`;

    const { error: uploadErr } = await supabase.storage.from("media").upload(storagePath, buf, {
      contentType: "video/mp4",
      upsert: true,
    });
    if (uploadErr) return { ...video, status: "failed", reason: `upload: ${uploadErr.message}` };

    const { data: signedData, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(storagePath, SIGNED_URL_EXPIRY_SECONDS);
    if (signErr || !signedData?.signedUrl) return { ...video, status: "failed", reason: `sign: ${signErr?.message}` };
    const newUrl = signedData.signedUrl;

    const verifyRes = await fetch(newUrl);
    if (!verifyRes.ok) return { ...video, status: "failed", reason: `verify HTTP ${verifyRes.status}` };
    const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
    if (verifyLen && Math.abs(verifyLen - buf.length) > 5) {
      return { ...video, status: "failed", reason: "verify size mismatch" };
    }

    const { error: mediaErr } = await supabase.from("media").insert({
      file_name: fileName,
      file_url: newUrl,
      file_type: "video/mp4",
      file_size: buf.length,
      folder: "code-videos",
    });
    if (mediaErr) return { ...video, status: "failed", reason: `media table insert: ${mediaErr.message}` };

    return { ...video, status: "success", bytes: buf.length, storagePath, newUrl };
  } catch (e) {
    return { ...video, status: "failed", reason: `error: ${e.message}` };
  }
}

async function main() {
  console.log(`Migrating ${VIDEOS.length} unique code-level videos...\n`);
  const results = [];
  for (const video of VIDEOS) {
    const r = await migrateOne(video);
    results.push(r);
    console.log(`[${r.status.toUpperCase()}] ${video.assetPath} -> ${video.constName} ${r.reason || `${(r.bytes / 1024 / 1024).toFixed(1)} MB`}`);
  }

  const logPath = path.join(repoRoot, "..", "backups", `code_videos_migration_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));

  const allOk = results.every((r) => r.status === "success");
  if (!allOk) {
    console.log(`\nOne or more videos failed. NO source files were touched. Log: ${logPath}`);
    process.exit(1);
  }

  // Write the shared constants module.
  const moduleLines = [
    "// Auto-generated by .migration-scripts/migrate_code_videos.mjs — Step 4.",
    "// Centralizes the Supabase Storage URLs for videos that used to be",
    "// imported directly from Lovable's CDN via .asset.json pointers.",
    "// Each video is also registered in the `media` table (folder: code-videos)",
    "// so it is visible and replaceable from the dashboard's Media Library.",
    "",
    ...results.map((r) => `export const ${r.constName} = ${JSON.stringify(r.newUrl)};`),
    "",
  ];
  const modulePath = path.join(repoRoot, "src", "lib", "migratedVideoUrls.ts");
  fs.writeFileSync(modulePath, moduleLines.join("\n"), "utf8");
  console.log(`\nWrote ${modulePath}`);

  console.log(`\nAll ${VIDEOS.length} videos migrated successfully. Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
