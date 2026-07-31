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

const LOGO_URL = "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app/__l5e/assets-v1/797d6c11-e7eb-45bf-af08-15f8c393ef79/logo.png";

async function migrateLogo() {
  console.log("Downloading logo from Lovable...");
  const res = await fetch(LOGO_URL);
  if (!res.ok) throw new Error(`Download failed: HTTP ${res.status}`);
  const contentType = res.headers.get("content-type") || "image/png";
  const buf = Buffer.from(await res.arrayBuffer());
  console.log(`Downloaded ${buf.length} bytes`);

  const hash = crypto.createHash("sha1").update(LOGO_URL).digest("hex").slice(0, 20);
  const storagePath = `migrated-content/${hash}.png`;

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

  return newUrl;
}

async function main() {
  const newUrl = await migrateLogo();

  console.log("\nUpdating site_settings.site_logo_url...");
  const { error: e1 } = await supabase.from("site_settings").update({ site_logo_url: newUrl }).eq("singleton", true);
  if (e1) throw new Error(`site_settings update failed: ${e1.message}`);

  console.log("Updating header_footer_settings (header_logo_url, footer_logo_url, header_logo_dark_url)...");
  const { error: e2 } = await supabase
    .from("header_footer_settings")
    .update({ header_logo_url: newUrl, footer_logo_url: newUrl, header_logo_dark_url: newUrl })
    .eq("singleton", true);
  if (e2) throw new Error(`header_footer_settings update failed: ${e2.message}`);

  console.log("\nSUCCESS. All 4 logo fields now point to:", newUrl);
}

main().catch((e) => {
  console.error("\nFAILED:", e.message);
  console.error("No database changes were made — old Lovable URLs are untouched.");
  process.exit(1);
});
