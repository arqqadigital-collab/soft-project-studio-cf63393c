## Goal

Right now many files under `src/assets/` are `.asset.json` pointers to Lovable's CDN (e.g. `dental-hero.mp4.asset.json`, `hero.jpg.asset.json`). When you clone from GitHub, you only get these JSON pointer files instead of real images/videos, which is why your local checkout looks broken.

You want the actual binary files (`.png`, `.jpg`, `.mp4`, etc.) committed to the repo so GitHub contains a complete, self-contained project.

## Plan

1. **Inventory every `.asset.json` file** under `src/` (there are ~300+ across `dental/`, `emram/`, `ris/`, `uae-compliance/`, `staffaug/`, `dynamics/`, `zoho/`, `bloodbank/`, `medication/`, `rcm/`, `logos/`, `contact/`, `his-journey/`, `lis/`, `ai-imaging/`, `odoo/`, plus top-level ones).

2. **For each pointer**:
   - Read the `url` field from the `.asset.json`.
   - Download the binary from the Lovable CDN (`https://<project>.lovable.app/__l5e/assets-v1/...`) into the same folder with the original filename (e.g. `dental-hero.mp4.asset.json` → `dental-hero.mp4`).
   - Delete the `.asset.json` pointer.

3. **Rewrite all code references** across `src/`:
   - Change `import xAsset from "./x.png.asset.json"; <img src={xAsset.url} />` → `import x from "./x.png"; <img src={x} />`.
   - Update `.mp4`, `.jpg`, `.png`, `.webp`, `.svg` imports the same way.
   - Vite handles binary imports natively, so no config change is needed.

4. **Verify** with `bun run build` that every asset resolves and the bundle compiles.

## Trade-offs you should know

- **Repo size will grow a lot.** The current CDN pointers cover ~648 MB of assets (videos alone: `emram-hero.mp4` 13 MB, `emram-cta.mp4` 30 MB, `uae-hero.mp4` 28 MB, `uae-cta.mp4` 30 MB, `dental-hero.mp4`, etc.). GitHub warns above 50 MB per file and blocks pushes over 100 MB. The large `.mp4` files (>50 MB total video) will make `git clone` slow and may hit GitHub limits.
- **Lovable's asset system is designed to keep binaries out of git** for exactly this reason. Undoing it is fine but it's a one-way trade.

## Options

- **A. Migrate everything** (all images + all videos) — full self-contained repo, largest size, possible GitHub push warnings on the biggest mp4s.
- **B. Migrate images only, leave videos on CDN** — much smaller repo (~50-80 MB), keeps `.mp4.asset.json` pointers for the heavy videos. Recommended.
- **C. Migrate only a specific folder** you name (e.g. only `src/assets/dental/`).

Tell me which option (A, B, or C) and I'll execute it in build mode.
