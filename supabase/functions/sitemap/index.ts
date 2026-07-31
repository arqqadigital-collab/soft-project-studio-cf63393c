import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function xmlEscape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Static app routes to include. Dashboard, auth, and internal routes are omitted.
const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/careers', changefreq: 'monthly', priority: '0.6' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/events', changefreq: 'weekly', priority: '0.6' },
  { path: '/case-studies', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'yearly', priority: '0.5' },
  { path: '/healthcare/his', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/clinic', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/emergency', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/physiotherapy', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/telemedicine', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/operations', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/dental', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/lis', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/ris', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/rcm', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/blood-bank', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/medication-dosage', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/pacs', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/ai-imaging', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/uae-compliance', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/ksa-compliance', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/emram', changefreq: 'monthly', priority: '0.7' },
  { path: '/healthcare/clinical-ai', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/dynamics-365', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/odoo', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/zoho', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/manufacturing', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/retail', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/education', changefreq: 'monthly', priority: '0.7' },
  { path: '/erp/logistics', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/cybersecurity', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/consulting', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/implementation', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/staff-aug', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/learning', changefreq: 'monthly', priority: '0.7' },
];

type Row = { loc: string; lastmod?: string; changefreq?: string; priority?: string; alt?: { hreflang: string; href: string }[] };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Base URL: prefer site_settings.site_url, fall back to the request origin.
    const { data: settings } = await admin
      .from('site_settings')
      .select('site_url')
      .eq('singleton', true)
      .maybeSingle();
    const reqUrl = new URL(req.url);
    const originParam = reqUrl.searchParams.get('site_url');
    const origin = req.headers.get('origin') ?? reqUrl.origin;
    let base =
      (settings?.site_url ?? '').replace(/\/$/, '') ||
      (originParam ?? '').replace(/\/$/, '') ||
      origin.replace(/\/$/, '');

    // Look up noindex ids to exclude
    const { data: noindexRows } = await admin
      .from('seo_meta')
      .select('entity_type, entity_id')
      .eq('noindex', true);
    const noindexIds = new Set((noindexRows ?? []).map((r) => `${r.entity_type}:${r.entity_id}`));

    const [{ data: posts }, { data: pages }, { data: events }, { data: caseStudies }] = await Promise.all([
      admin
        .from('posts')
        .select('id, slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(2000),
      admin
        .from('pages')
        .select('id, slug, slug_ar, updated_at')
        .eq('status', 'published')
        .limit(2000),
      admin
        .from('events')
        .select('id, slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(2000),
      admin
        .from('case_studies')
        .select('id, slug, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(2000),
    ]);

    const rows: Row[] = [];

    for (const r of STATIC_ROUTES) {
      const arAlt = r.path === '/' ? '/ar' : `/ar${r.path}`;
      rows.push({
        loc: `${base}${r.path}`,
        changefreq: r.changefreq,
        priority: r.priority,
        alt: [
          { hreflang: 'en', href: `${base}${r.path}` },
          { hreflang: 'ar', href: `${base}${arAlt}` },
          { hreflang: 'x-default', href: `${base}${r.path}` },
        ],
      });
    }

    for (const p of posts ?? []) {
      if (noindexIds.has(`post:${p.id}`)) continue;
      const en = `${base}/blog/${p.slug}`;
      const ar = `${base}/ar/blog/${p.slug}`;
      rows.push({
        loc: en,
        lastmod: (p.updated_at ?? p.published_at ?? undefined) as string | undefined,
        changefreq: 'weekly',
        priority: '0.8',
        alt: [
          { hreflang: 'en', href: en },
          { hreflang: 'ar', href: ar },
          { hreflang: 'x-default', href: en },
        ],
      });
    }

    for (const p of pages ?? []) {
      if (noindexIds.has(`page:${p.id}`)) continue;
      // Real canonical route is the clean /:slug (not the legacy /p/:slug
      // redirect path — that path client-side-redirects and would create a
      // duplicate/incorrect canonical URL in the sitemap).
      const en = `${base}/${p.slug}`;
      const ar = `${base}/ar/${p.slug_ar || p.slug}`;
      rows.push({
        loc: en,
        lastmod: p.updated_at as string,
        changefreq: 'monthly',
        priority: '0.7',
        alt: [
          { hreflang: 'en', href: en },
          { hreflang: 'ar', href: ar },
          { hreflang: 'x-default', href: en },
        ],
      });
    }

    for (const e of events ?? []) {
      if (noindexIds.has(`event:${e.id}`)) continue;
      const en = `${base}/events/${e.slug}`;
      const ar = `${base}/ar/events/${e.slug}`;
      rows.push({
        loc: en,
        lastmod: (e.updated_at ?? e.published_at ?? undefined) as string | undefined,
        changefreq: 'weekly',
        priority: '0.6',
        alt: [
          { hreflang: 'en', href: en },
          { hreflang: 'ar', href: ar },
          { hreflang: 'x-default', href: en },
        ],
      });
    }

    for (const c of caseStudies ?? []) {
      if (noindexIds.has(`case_study:${c.id}`)) continue;
      const en = `${base}/case-studies/${c.slug}`;
      const ar = `${base}/ar/case-studies/${c.slug}`;
      rows.push({
        loc: en,
        lastmod: (c.updated_at ?? c.published_at ?? undefined) as string | undefined,
        changefreq: 'monthly',
        priority: '0.7',
        alt: [
          { hreflang: 'en', href: en },
          { hreflang: 'ar', href: ar },
          { hreflang: 'x-default', href: en },
        ],
      });
    }

    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
      rows
        .map((r) => {
          const altLinks = (r.alt ?? [])
            .map((a) => `    <xhtml:link rel="alternate" hreflang="${xmlEscape(a.hreflang)}" href="${xmlEscape(a.href)}" />\n`)
            .join('');
          return (
            `  <url>\n    <loc>${xmlEscape(r.loc)}</loc>\n` +
            (r.lastmod ? `    <lastmod>${new Date(r.lastmod).toISOString()}</lastmod>\n` : '') +
            (r.changefreq ? `    <changefreq>${r.changefreq}</changefreq>\n` : '') +
            (r.priority ? `    <priority>${r.priority}</priority>\n` : '') +
            altLinks +
            `  </url>`
          );
        })
        .join('\n') +
      `\n</urlset>\n`;

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch (e: any) {
    return new Response(`<!-- error: ${xmlEscape(e.message ?? String(e))} -->`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  }
});
