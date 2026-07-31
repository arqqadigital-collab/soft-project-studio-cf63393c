import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
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

const FFMPEG = "C:\\Users\\amrme\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe";
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: row } = await supabase.from("media").select("id, file_url").eq("folder", "code-videos").eq("file_name", "odoo-hero.mp4").single();
const res = await fetch(row.file_url);
const original = Buffer.from(await res.arrayBuffer());
console.log("original", original.length);

const inPath = path.join(os.tmpdir(), "odoo-in.mp4");
const outPath = path.join(os.tmpdir(), "odoo-out.mp4");
fs.writeFileSync(inPath, original);
execFileSync(FFMPEG, ["-y", "-i", inPath, "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-c:a", "aac", "-b:a", "96k", outPath], { stdio: "pipe" });
const compressed = fs.readFileSync(outPath);
console.log("compressed", compressed.length);

if (compressed.length < original.length) {
  const urlNoQuery = row.file_url.split("?")[0];
  const storagePath = decodeURIComponent(urlNoQuery.split("/object/sign/media/")[1]);
  const { error: upErr } = await supabase.storage.from("media").upload(storagePath, compressed, { contentType: "video/mp4", upsert: true });
  if (upErr) throw new Error("upload: " + upErr.message);
  const { error: updErr } = await supabase.from("media").update({ file_size: compressed.length }).eq("id", row.id);
  if (updErr) throw new Error("db: " + updErr.message);
  console.log("SUCCESS, saved", (100 * (1 - compressed.length / original.length)).toFixed(0) + "%");
} else {
  console.log("no benefit, keeping original");
}
fs.unlinkSync(inPath);
fs.unlinkSync(outPath);
