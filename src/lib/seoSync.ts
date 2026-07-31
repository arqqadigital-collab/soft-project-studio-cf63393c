/**
 * Fire-and-forget ping to seo-sync.php (see public/seo-sync.php), which
 * regenerates robots.txt, sitemap.xml, and the .htaccess redirect/valid-route
 * block from the current Redirect Manager and published content. Called
 * right after a redirect/page/post/event/case-study/robots.txt save so
 * changes apply on Apache almost instantly, without waiting for the cron
 * safety net.
 *
 * Safe to call from anywhere: never throws, never blocks the caller, and
 * silently does nothing in local dev (there's no PHP runtime there — the
 * request just 404s and is ignored).
 */
export function triggerSeoSync(): void {
  try {
    fetch("/seo-sync.php", { method: "POST", keepalive: true }).catch(() => {
      /* best-effort only — the cron job is the safety net */
    });
  } catch {
    /* never let a sync ping break the caller's save flow */
  }
}
