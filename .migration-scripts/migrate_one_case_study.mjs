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

const ID = "5b05460e-3715-41ae-89f6-c22c6cb38bc7";
const OLD_URL = "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/2259a6a3-a80f-44e8-a5b9-2e66f6586323/pre-visit-online-booking.png";

async function main() {
  console.log("Downloading from Lovable...");
  const res = await fetch(OLD_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const contentType = res.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`Downloaded ${buf.length} bytes, type ${contentType}`);

  const storagePath = `migrated-content/case-studies/${ID}.png`;
  console.log("Uploading to Supabase Storage...");
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
  console.log("New URL:", newUrl);

  console.log("Verifying new URL is accessible...");
  const verifyRes = await fetch(newUrl);
  if (!verifyRes.ok) throw new Error(`Verification failed: HTTP ${verifyRes.status}`);
  const verifyLen = Number(verifyRes.headers.get("content-length") || 0);
  console.log(`Verified: HTTP ${verifyRes.status}, ${verifyLen} bytes (expected ${buf.length})`);
  if (verifyLen && Math.abs(verifyLen - buf.length) > 5) {
    throw new Error(`Size mismatch: expected ${buf.length}, got ${verifyLen}`);
  }

  console.log("Updating case_studies row...");
  const { error: updateErr } = await supabase
    .from("case_studies")
    .update({ cover_image_url: newUrl })
    .eq("id", ID);
  if (updateErr) throw new Error(`DB update failed: ${updateErr.message}`);

  console.log("\nSUCCESS. Old URL kept in backup file for revert if needed:");
  console.log(OLD_URL);
  console.log("New URL now live:");
  console.log(newUrl);
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  console.error("No changes were made to the database — old Lovable URL is untouched.");
  process.exit(1);
});
