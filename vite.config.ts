import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import fs from "node:fs";

// Rewrites relative /__l5e/ asset URLs inside *.asset.json imports to absolute
// Lovable CDN URLs so the built site can be deployed on any host (Vercel,
// Netlify, own server, etc.) and still load the CDN-hosted media.
function absoluteAssetUrls(): Plugin {
  const BASE =
    process.env.VITE_ASSET_BASE_URL ||
    "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app";
  return {
    name: "lovable-absolute-asset-urls",
    enforce: "pre",
    transform(code, id) {
      const clean = id.split("?")[0];
      if (!clean.endsWith(".asset.json")) return null;
      try {
        const json = JSON.parse(fs.readFileSync(clean, "utf8"));
        if (typeof json.url === "string" && json.url.startsWith("/__l5e/")) {
          json.url = BASE.replace(/\/$/, "") + json.url;
        }
        return { code: JSON.stringify(json), map: null };
      } catch {
        return null;
      }
    },
  };
}

export default defineConfig({
  plugins: [absoluteAssetUrls(), react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});
