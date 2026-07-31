<?php
/**
 * seo-sync.php — regenerates robots.txt, sitemap.xml, and the AUTO SEO block
 * inside .htaccess (real 301 redirects + the list of currently-valid app
 * routes used for real 404s) from the live Supabase Edge Functions that
 * already back the Dashboard's Redirect Manager / SEO editor / robots.txt
 * editor. Nothing here changes what those Edge Functions or the Dashboard
 * do — this only bridges their live data down to static Apache-readable
 * files, since Apache itself cannot query the database.
 *
 * Safety:
 *   - .htaccess is only ever modified between the "# BEGIN AUTO SEO" /
 *     "# END AUTO SEO" markers. Anything outside that block (your own
 *     custom rules) is preserved untouched.
 *   - A timestamped backup of .htaccess is written before every change.
 *   - All writes are atomic (write to a temp file, then rename) so a
 *     crash or failed request can never leave a half-written file.
 *   - If any fetch fails or returns something that doesn't look right,
 *     the corresponding file is left completely untouched and the
 *     problem is appended to seo-sync.log — nothing is ever guessed at
 *     or partially applied.
 *
 * Triggered two ways (see the project's SEO setup docs):
 *   1. Instantly — the Dashboard fires a fire-and-forget request here right
 *      after a redirect/page/post/event/case-study/robots.txt save.
 *   2. As a safety net only — a cPanel Cron Job, e.g. every 5 minutes:
 *        php /home/USER/public_html/seo-sync.php
 */

// ---- Configuration --------------------------------------------------------

// Your Supabase project URL (same one the app already uses).
const SUPABASE_URL = 'https://pahfisskacgnxiphyrrh.supabase.co';

// Optional: set this to your real site origin (e.g. "https://example.com")
// if site_settings.site_url is left empty in the dashboard AND this script
// is run from a cron job (which has no request/HTTP_HOST to infer from).
// Leave blank to auto-detect from the current request, or to rely on
// site_settings.site_url being set in Site Settings.
const SITE_URL_FALLBACK = '';

// Minimum seconds between two runs; extra calls in this window are ignored.
// This is just abuse/self-DoS protection — it does not delay a real update
// by more than this many seconds even in the worst case.
const MIN_INTERVAL_SECONDS = 10;

// ---- Paths (this file must live next to index.html) -----------------------

$WEB_ROOT = __DIR__;
$HTACCESS_PATH = $WEB_ROOT . '/.htaccess';
$SITEMAP_PATH = $WEB_ROOT . '/sitemap.xml';
$ROBOTS_PATH = $WEB_ROOT . '/robots.txt';
$LOG_PATH = $WEB_ROOT . '/seo-sync.log';
$LOCK_PATH = $WEB_ROOT . '/.seo-sync.lock';

const BEGIN_MARKER = '# BEGIN AUTO SEO';
const END_MARKER = '# END AUTO SEO';

// ---- Helpers ----------------------------------------------------------

function seo_log(string $msg): void {
    global $LOG_PATH;
    $line = '[' . date('c') . '] ' . $msg . "\n";
    // Best-effort: if the log itself can't be written, don't fail the sync.
    @file_put_contents($LOG_PATH, $line, FILE_APPEND | LOCK_EX);
}

/** GET a URL with a short timeout; returns [body, status] or [null, 0] on failure. */
function http_get(string $url, array $extraHeaders = []): array {
    $headerLines = array_map(fn($k, $v) => "$k: $v", array_keys($extraHeaders), $extraHeaders);
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 15,
            'ignore_errors' => true,
            'header' => implode("\r\n", $headerLines),
        ],
    ]);
    $body = @file_get_contents($url, false, $ctx);
    if ($body === false) return [null, 0];
    $status = 0;
    if (isset($http_response_header)) {
        foreach ($http_response_header as $h) {
            if (preg_match('#^HTTP/\S+\s+(\d+)#', $h, $m)) $status = (int) $m[1];
        }
    }
    return [$body, $status];
}

/** Write $contents to $path atomically (temp file + rename). */
function atomic_write(string $path, string $contents): bool {
    $tmp = $path . '.tmp.' . uniqid('', true);
    if (@file_put_contents($tmp, $contents, LOCK_EX) === false) return false;
    if (!@rename($tmp, $path)) {
        @unlink($tmp);
        return false;
    }
    @chmod($path, 0644);
    return true;
}

/** Escape a path for safe literal use inside an Apache RewriteRule pattern. */
function apache_escape_path(string $p): string {
    return preg_quote($p, '#');
}

function detect_site_origin(): string {
    if (SITE_URL_FALLBACK !== '') return rtrim(SITE_URL_FALLBACK, '/');
    if (!empty($_SERVER['HTTP_HOST'])) {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        return $scheme . '://' . $_SERVER['HTTP_HOST'];
    }
    return ''; // cron run with no fallback configured — sitemap will use site_settings.site_url instead
}

/**
 * Build the regenerated block that goes between the AUTO SEO markers.
 * $redirects: [{from, to}], $validPaths: [string, ...]
 */
function build_auto_seo_block(array $redirects, array $validPaths): string {
    $lines = [];
    $lines[] = '# Generated automatically by seo-sync.php from the Dashboard\'s';
    $lines[] = '# Redirect Manager and published content. Do not edit by hand -';
    $lines[] = '# your changes will be overwritten on the next sync.';
    $lines[] = '';
    $lines[] = '# --- 1. Redirects (from slug_redirects) — checked first, real 301 ---';
    foreach ($redirects as $r) {
        $from = trim($r['from'] ?? '', '/');
        $to = trim($r['to'] ?? '');
        if ($from === '' || $to === '') continue;
        $fromPattern = apache_escape_path($from);
        $toEscaped = str_replace('"', '\\"', $to);
        $lines[] = 'RewriteRule ^' . $fromPattern . '/?$ "' . $toEscaped . '" [R=301,L]';
    }
    $lines[] = '';
    $lines[] = '# --- 2. Known valid app routes -> serve the SPA with a real 200 ---';
    $cleanPaths = [];
    foreach ($validPaths as $p) {
        $p = trim((string) $p, '/');
        if ($p === '') $p = ''; // homepage handled separately below
        $cleanPaths[] = $p;
    }
    $cleanPaths = array_values(array_unique(array_filter($cleanPaths, fn($p) => $p !== '')));
    if (!empty($cleanPaths)) {
        $escaped = array_map('apache_escape_path', $cleanPaths);
        $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-f';
        $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-d';
        $lines[] = 'RewriteRule ^(' . implode('|', $escaped) . ')/?$ index.html [L]';
    }
    $lines[] = '';
    $lines[] = '# --- 3. Homepage + always-allowed app areas (not public content, never 404) ---';
    $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-f';
    $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-d';
    $lines[] = 'RewriteRule ^$ index.html [L]';
    $always = ['dashboard', 'login', 'set-password', 'reset-password', 'accept-invite', 'admin', 'preview', 'p', 'ar/p', 'ar$'];
    $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-f';
    $lines[] = 'RewriteCond %{REQUEST_FILENAME} !-d';
    $lines[] = 'RewriteRule ^(' . implode('|', $always) . ')(/.*)?$ index.html [L]';
    $lines[] = '';
    $lines[] = '# --- Anything else falls through: Apache 404s, ErrorDocument below serves the SPA ---';
    return implode("\n", $lines) . "\n";
}

function base_scaffold(): string {
    return <<<HT
# Managed by this project's SEO sync (see seo-sync.php). Content between the
# AUTO SEO markers is regenerated automatically; everything else here is
# yours and will never be touched by the sync script.

RewriteEngine On

# Serve real files/directories as-is, untouched.
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

HT;
}

function ensure_error_document(string $content): string {
    if (strpos($content, 'ErrorDocument 404') !== false) return $content;
    return rtrim($content) . "\n\n# Real 404 status for anything not matched above, while still\n"
        . "# rendering the SPA (and its own Not Found page) as the response body.\n"
        . "ErrorDocument 404 /index.html\n";
}

/**
 * Safely splice $block between the BEGIN/END markers inside $path.
 * Returns true on success, or an error message string on failure — never
 * throws, never leaves the file half-written.
 */
function splice_htaccess(string $path, string $block) {
    $existing = file_exists($path) ? @file_get_contents($path) : '';
    if ($existing === false) $existing = '';

    $beginQ = preg_quote(BEGIN_MARKER, '#');
    $endQ = preg_quote(END_MARKER, '#');
    $wrapped = BEGIN_MARKER . "\n" . $block . END_MARKER;

    if (preg_match('#' . $beginQ . '.*?' . $endQ . '#s', $existing)) {
        $new = preg_replace('#' . $beginQ . '.*?' . $endQ . '#s', $wrapped, $existing, 1);
    } else {
        // First run on this server: seed the base scaffold once, then add the block.
        $scaffold = $existing !== '' ? $existing : base_scaffold();
        $new = rtrim($scaffold) . "\n\n" . $wrapped . "\n";
    }

    $new = ensure_error_document($new);

    if (trim($new) === '') {
        return 'Refusing to write an empty .htaccess — aborted, previous file untouched.';
    }
    // Sanity check: the file we're about to write must still contain both
    // markers and the RewriteEngine directive, or something went wrong.
    if (strpos($new, BEGIN_MARKER) === false || strpos($new, END_MARKER) === false) {
        return 'Generated .htaccess failed validation (missing markers) — aborted, previous file untouched.';
    }

    if (file_exists($path)) {
        $backup = $path . '.bak.' . date('Ymd-His');
        @copy($path, $backup);
        // Keep only the 20 most recent backups so they don't accumulate forever.
        $backups = glob($path . '.bak.*');
        if ($backups !== false && count($backups) > 20) {
            sort($backups);
            foreach (array_slice($backups, 0, count($backups) - 20) as $old) @unlink($old);
        }
    }

    if (!atomic_write($path, $new)) {
        return 'Failed to write .htaccess (previous version left intact).';
    }
    return true;
}

// ---- Throttle ---------------------------------------------------------

if (file_exists($LOCK_PATH) && (time() - filemtime($LOCK_PATH)) < MIN_INTERVAL_SECONDS) {
    seo_log('Skipped: throttled (last run ' . (time() - filemtime($LOCK_PATH)) . 's ago)');
    header('Content-Type: text/plain');
    echo "throttled\n";
    exit;
}
@touch($LOCK_PATH);

$errors = [];
$origin = detect_site_origin();
// Passed as a query param (not a header) so it reaches the function code
// reliably regardless of any gateway/CDN in front of the Edge Functions.
$siteUrlParam = $origin !== '' ? ('?site_url=' . rawurlencode($origin)) : '';

// ---- 1. robots.txt ------------------------------------------------------
[$robots, $robotsStatus] = http_get(SUPABASE_URL . '/functions/v1/robots' . $siteUrlParam);
if ($robotsStatus === 200 && $robots !== null && strlen(trim($robots)) > 0) {
    if (!atomic_write($ROBOTS_PATH, $robots)) $errors[] = 'Failed to write robots.txt';
} else {
    $errors[] = "robots.txt fetch failed (HTTP $robotsStatus) — kept existing file untouched";
}

// ---- 2. sitemap.xml -----------------------------------------------------
[$sitemap, $sitemapStatus] = http_get(SUPABASE_URL . '/functions/v1/sitemap' . $siteUrlParam);
if ($sitemapStatus === 200 && $sitemap !== null && strpos($sitemap, '<urlset') !== false) {
    if (!atomic_write($SITEMAP_PATH, $sitemap)) $errors[] = 'Failed to write sitemap.xml';
} else {
    $errors[] = "sitemap.xml fetch failed or invalid (HTTP $sitemapStatus) — kept existing file untouched";
}

// ---- 3. .htaccess AUTO SEO block ----------------------------------------
[$routesJson, $routesStatus] = http_get(SUPABASE_URL . '/functions/v1/seo-routes');
if ($routesStatus === 200 && $routesJson !== null) {
    $data = json_decode($routesJson, true);
    if (is_array($data) && isset($data['redirects']) && isset($data['validPaths'])) {
        $block = build_auto_seo_block($data['redirects'], $data['validPaths']);
        $result = splice_htaccess($HTACCESS_PATH, $block);
        if ($result !== true) $errors[] = $result;
    } else {
        $errors[] = 'seo-routes response malformed — .htaccess left untouched';
    }
} else {
    $errors[] = "seo-routes fetch failed (HTTP $routesStatus) — .htaccess left untouched";
}

// ---- Report -------------------------------------------------------------
header('Content-Type: text/plain');
if (empty($errors)) {
    seo_log('Sync OK');
    echo "ok\n";
} else {
    foreach ($errors as $e) seo_log($e);
    echo "completed with issues:\n" . implode("\n", $errors) . "\n";
}
