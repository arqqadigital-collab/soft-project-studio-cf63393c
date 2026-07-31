// Migrates the remaining local videos (homepage process cards, CTA
// testimonial, header background, about/careers hero) from bundled repo
// files to Supabase Storage, compressed. These were never Lovable-dependent
// (already local imports) but the user wants repo size reduced further and
// these to be dashboard-manageable like everything else.
//
// Safety: reads the local file, compresses (fallback to original if it
// doesn't help), uploads to Supabase, verifies, registers in `media` table.
// The local source files are NOT deleted by this script — only after the
// caller verifies the app still builds/runs correctly with the new imports
// should the local files be removed in a separate, explicit step.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const FFMPEG =
  "C:\\Users\\amrme\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe";

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

const VIDEOS = [
  { assetPath: "process-1.mov", constName: "HOMEPAGE_PROCESS_1_VIDEO_URL" },
  { assetPath: "process-2.mov", constName: "HOMEPAGE_PROCESS_2_VIDEO_URL" },
  { assetPath: "process-3.mov", constName: "HOMEPAGE_PROCESS_3_VIDEO_URL" },
  { assetPath: "cta-testimonial.mov", constName: "HOMEPAGE_CTA_TESTIMONIAL_VIDEO_URL" },
  { assetPath: "header-bg.mp4", constName: "HEADER_BG_VIDEO_URL" },
  { assetPath: "about-hero.mp4", constName: "ABOUT_HERO_VIDEO_URL" },
];

function compressVideo(buf) {
  const tmpDir = os.tmpdir();
  const inPath = path.join(tmpDir, `in-${crypto.randomUUID()}.mp4`);
  const outPath = path.join(tmpDir, `out-${crypto.randomUUID()}.mp4`);
  try {
    fs.writeFileSync(inPath, buf);
    execFileSync(
      FFMPEG,
      ["-y", "-i", inPath, "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-c:a", "aac", "-b:a", "96k", outPath],
      { stdio: "pipe" },
    );
    const outBuf = fs.readFileSync(outPath);
    if (outBuf.length >= buf.length) return null;
    return outBuf;
  } catch {
    return null;
  } finally {
    try { fs.unlinkSync(inPath); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
  }
}

async function migrateOne(video) {
  const localPath = path.join(repoRoot, "src", "assets", video.assetPath);
  if (!fs.existsSync(localPath)) {
    return { ...video, status: "failed", reason: `local file not found: ${localPath}` };
  }
  const original = fs.readFileSync(localPath);

  try {
    const compressed = compressVideo(original);
    const finalBuf = compressed || original;
    const wasCompressed = !!compressed;

    const hash = crypto.createHash("sha1").update(video.assetPath).digest("hex").slice(0, 16);
    const storagePath = `migrated-videos/${hash}-${path.basename(video.assetPath, path.extname(video.assetPath))}.mp4`;

    const { error: uploadErr } = await supabase.storage.from("media").upload(storagePath, finalBuf, {
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
    if (verifyLen && Math.abs(verifyLen - finalBuf.length) > 5) {
      return { ...video, status: "failed", reason: "verify size mismatch" };
    }

    const { error: mediaErr } = await supabase.from("media").insert({
      file_name: path.basename(video.assetPath),
      file_url: newUrl,
      file_type: "video/mp4",
      file_size: finalBuf.length,
      folder: "code-videos",
    });
    if (mediaErr) return { ...video, status: "failed", reason: `media table insert: ${mediaErr.message}` };

    return {
      ...video,
      status: "success",
      originalBytes: original.length,
      finalBytes: finalBuf.length,
      wasCompressed,
      storagePath,
      newUrl,
    };
  } catch (e) {
    return { ...video, status: "failed", reason: `error: ${e.message}` };
  }
}

async function main() {
  console.log(`Migrating ${VIDEOS.length} homepage-level local videos...\n`);
  const results = [];
  for (const video of VIDEOS) {
    const r = await migrateOne(video);
    results.push(r);
    if (r.status === "success") {
      const pct = r.wasCompressed ? `-${(100 * (1 - r.finalBytes / r.originalBytes)).toFixed(0)}%` : "no compression benefit";
      console.log(
        `[SUCCESS] ${video.assetPath} -> ${video.constName} ${(r.originalBytes / 1024 / 1024).toFixed(1)}MB -> ${(r.finalBytes / 1024 / 1024).toFixed(1)}MB (${pct})`,
      );
    } else {
      console.log(`[FAILED] ${video.assetPath} -> ${video.constName} ${r.reason}`);
    }
  }

  const logPath = path.join(repoRoot, "..", "backups", `homepage_videos_migration_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));

  const allOk = results.every((r) => r.status === "success");
  if (!allOk) {
    console.log(`\nOne or more videos failed. Local files and imports left untouched. Log: ${logPath}`);
    process.exit(1);
  }

  // Append to the shared constants module (created by migrate_code_videos.mjs).
  const modulePath = path.join(repoRoot, "src", "lib", "migratedVideoUrls.ts");
  const existing = fs.existsSync(modulePath) ? fs.readFileSync(modulePath, "utf8") : "";
  const appendLines = results.map((r) => `export const ${r.constName} = ${JSON.stringify(r.newUrl)};`);
  fs.writeFileSync(modulePath, existing.trimEnd() + "\n" + appendLines.join("\n") + "\n", "utf8");
  console.log(`\nAppended to ${modulePath}`);

  console.log(`\nAll ${VIDEOS.length} videos migrated successfully. Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
