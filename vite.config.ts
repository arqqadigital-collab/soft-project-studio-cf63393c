import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split large, stable third-party libraries into long-cached vendor
        // chunks so page-level code-splitting isn't diluted by dependencies.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";
          if (id.includes("react-router")) return "vendor-router";
          if (id.includes("@tanstack")) return "vendor-query";
          if (id.includes("react-helmet-async")) return "vendor-helmet";
          if (id.includes("@supabase")) return "vendor-supabase";
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils"))
            return "vendor-motion";
          if (id.includes("date-fns")) return "vendor-date";
          if (id.includes("@tiptap") || id.includes("prosemirror") || id.includes("quill"))
            return "vendor-editor";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("@dnd-kit")) return "vendor-dnd";
          if (id.includes("dompurify")) return "vendor-sanitize";
          // NOTE: lucide-react and @radix-ui are intentionally NOT grouped —
          // per-module splitting keeps unused icons/primitives out of the
          // initial public bundle.
          if (id.includes("react-hook-form") || id.includes("zod") || id.includes("@hookform"))
            return "vendor-forms";
          if (id.includes("i18next")) return "vendor-i18n";
          // Everything else stays auto-split so route chunks only pull what
          // they actually use.
          return undefined;
        },
      },
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
});

