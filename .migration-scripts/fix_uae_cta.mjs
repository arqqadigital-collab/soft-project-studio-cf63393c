import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
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

const ID = "ad8c2ad6-5bdd-4332-b1fa-2d82d5fd6b19";
const CORRECT_URL = "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/c74c24a1-0e06-4536-859a-ba92bf585627/uae-cta.mp4";

async function main() {
  console.log("Downloading from corrected Lovable URL...");
  const res = await fetch(CORRECT_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const contentType = res.headers.get("content-type") || "video/mp4";
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`Downloaded ${buf.length} bytes`);

  const storagePath = `migrated/${ID}.mp4`;
  const { error: uploadErr } = await supabase.storage.from("media").upload(storagePath, buf, {
    contentType,
    upsert: true,
  });
  if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`);

  const { data: signedData, error: signErr } = await supabase.storage
    .from("media")
    .createSignedUrl(storagePath, 60 * 60 * 24 * 365 * 10);
  if (signErr || !signedData?.signedUrl) throw new Error(`Sign failed: ${signErr?.message}`);
  const newUrl = signedData.signedUrl;

  const verifyRes = await fetch(newUrl);
  if (!verifyRes.ok) throw new Error(`Verify failed: HTTP ${verifyRes.status}`);
  const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
  console.log(`Verified: ${verifyLen} bytes (expected ${buf.length})`);
  if (verifyLen && Math.abs(verifyLen - buf.length) > 5) throw new Error("Size mismatch");

  const { error: updateErr } = await supabase.from("media").update({ file_url: newUrl }).eq("id", ID);
  if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

  console.log("\nSUCCESS. New URL:", newUrl);
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  process.exit(1);
});
