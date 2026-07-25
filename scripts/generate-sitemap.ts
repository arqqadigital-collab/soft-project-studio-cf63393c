// Fetches the dynamic sitemap from the Supabase edge function and writes it
// to public/sitemap.xml so it is served at /sitemap.xml on the deployed site.
// Runs via `predev` and `prebuild` hooks in package.json.

import { writeFileSync } from "fs";
import { resolve } from "path";

const SITEMAP_URL =
  "https://pahfisskacgnxiphyrrh.supabase.co/functions/v1/sitemap";

const SITE_URL = "https://soft-project-studio.lovable.app";

async function main() {
  try {
    const res = await fetch(SITEMAP_URL, { headers: { Origin: SITE_URL } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    writeFileSync(resolve("public/sitemap.xml"), xml);
    console.log(`sitemap.xml written (${xml.length} bytes)`);
  } catch (err) {
    console.warn(`[generate-sitemap] Failed to fetch sitemap: ${err}`);
    // Write a minimal placeholder so /sitemap.xml still returns 200
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
    writeFileSync(resolve("public/sitemap.xml"), fallback);
  }
}

main();
