// Re-compresses the videos just uploaded in migrate_code_videos.mjs
// (media table rows with folder = 'code-videos'). Downloads each from
// Supabase, runs it through ffmpeg (H.264 CRF 26, same settings already
// validated earlier in this migration), and only replaces the stored object
// if the compressed version is actually smaller — otherwise the original is
// left untouched. Never sacrifices data: if compression fails or doesn't
// help, nothing changes for that file.

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

async function main() {
  const { data: rows, error } = await supabase.from("media").select("id, file_name, file_url, file_size").eq("folder", "code-videos");
  if (error) throw new Error(error.message);

  console.log(`Found ${rows.length} code-video row(s) to try compressing.\n`);
  const results = [];

  for (const row of rows) {
    try {
      const urlNoQuery = row.file_url.split("?")[0];
      const storagePath = urlNoQuery.split("/object/sign/media/")[1];
      if (!storagePath) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: "could not parse storage path" });
        console.log(`[FAILED] ${row.file_name} — could not parse storage path`);
        continue;
      }
      const decodedPath = decodeURIComponent(storagePath);

      const res = await fetch(row.file_url);
      if (!res.ok) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: `download HTTP ${res.status}` });
        console.log(`[FAILED] ${row.file_name} — download HTTP ${res.status}`);
        continue;
      }
      const original = Buffer.from(await res.arrayBuffer());

      const compressed = compressVideo(original);
      if (!compressed) {
        results.push({ id: row.id, file_name: row.file_name, status: "skipped", reason: "compression did not help or failed", originalBytes: original.length });
        console.log(`[SKIPPED] ${row.file_name} — compression didn't help, kept original (${(original.length / 1024 / 1024).toFixed(1)} MB)`);
        continue;
      }

      const { error: uploadErr } = await supabase.storage.from("media").upload(decodedPath, compressed, {
        contentType: "video/mp4",
        upsert: true,
      });
      if (uploadErr) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: `re-upload: ${uploadErr.message}` });
        console.log(`[FAILED] ${row.file_name} — re-upload failed: ${uploadErr.message}`);
        continue;
      }

      const verifyRes = await fetch(row.file_url);
      if (!verifyRes.ok) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: `verify HTTP ${verifyRes.status} after re-upload` });
        console.log(`[FAILED] ${row.file_name} — verify failed after re-upload (${verifyRes.status})`);
        continue;
      }
      const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
      if (Math.abs(verifyLen - compressed.length) > 5) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: "verify size mismatch after re-upload" });
        console.log(`[FAILED] ${row.file_name} — size mismatch after re-upload`);
        continue;
      }

      const { error: updateErr } = await supabase.from("media").update({ file_size: compressed.length }).eq("id", row.id);
      if (updateErr) {
        results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: `media size update: ${updateErr.message}` });
        console.log(`[FAILED] ${row.file_name} — media row size update failed (file itself is fine)`);
        continue;
      }

      const pct = (100 * (1 - compressed.length / original.length)).toFixed(0);
      results.push({ id: row.id, file_name: row.file_name, status: "success", originalBytes: original.length, compressedBytes: compressed.length, savedPct: pct });
      console.log(`[COMPRESSED] ${row.file_name} — ${(original.length / 1024 / 1024).toFixed(1)} MB -> ${(compressed.length / 1024 / 1024).toFixed(1)} MB (-${pct}%)`);
    } catch (e) {
      results.push({ id: row.id, file_name: row.file_name, status: "failed", reason: e.message });
      console.log(`[FAILED] ${row.file_name} — ${e.message}`);
    }
  }

  const logPath = path.join(repoRoot, "..", "backups", `compress_code_videos_log_${Date.now()}.json`);
  fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
  const compressedCount = results.filter((r) => r.status === "success").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const failed = results.filter((r) => r.status === "failed").length;
  console.log(`\nDone. ${compressedCount} compressed, ${skipped} skipped (no benefit), ${failed} failed. Log: ${logPath}`);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
