// Fetches the dynamic sitemap and robots.txt from the Supabase edge functions
// and writes them to public/ so they are served at /sitemap.xml and
// /robots.txt on the deployed site. Runs via `predev` and `prebuild` hooks in
// package.json. This is just a build-time seed for a fresh deploy — once the
// site is live, seo-sync.php (see public/seo-sync.php) keeps both files in
// sync with the Dashboard without needing a rebuild.

import { writeFileSync } from "fs";
import { resolve } from "path";

const FUNCTIONS_BASE = "https://pahfisskacgnxiphyrrh.supabase.co/functions/v1";
const SITE_URL = "https://soft-project-studio.lovable.app";

async function fetchText(path: string): Promise<string> {
  const url = `${FUNCTIONS_BASE}/${path}?site_url=${encodeURIComponent(SITE_URL)}`;
  const res = await fetch(url, { headers: { Origin: SITE_URL } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function writeSitemap() {
  try {
    let xml = await fetchText("sitemap");
    // Rewrite any non-site origins (Supabase functions URL, etc.) to SITE_URL
    xml = xml.replace(/https?:\/\/[^/<]*supabase\.co/gi, SITE_URL);
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

async function writeRobots() {
  try {
    const txt = await fetchText("robots");
    writeFileSync(resolve("public/robots.txt"), txt);
    console.log(`robots.txt written (${txt.length} bytes)`);
  } catch (err) {
    console.warn(`[generate-sitemap] Failed to fetch robots.txt: ${err}`);
    // Write a minimal placeholder so /robots.txt still returns 200
    const fallback = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /login
Disallow: /preview/

Sitemap: ${SITE_URL}/sitemap.xml
`;
    writeFileSync(resolve("public/robots.txt"), fallback);
  }
}

async function main() {
  await writeSitemap();
  await writeRobots();
}

main();
