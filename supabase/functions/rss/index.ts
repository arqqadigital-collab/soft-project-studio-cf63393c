import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function xml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: settings } = await admin
      .from('site_settings')
      .select('site_url, site_title, site_description')
      .eq('singleton', true)
      .maybeSingle();

    const origin = req.headers.get('origin') ?? new URL(req.url).origin;
    const base = (settings?.site_url ?? '').replace(/\/$/, '') || origin.replace(/\/$/, '');
    const title = settings?.site_title ?? 'Blog';
    const desc = settings?.site_description ?? 'Latest posts';

    // Exclude noindex posts
    const { data: noindex } = await admin
      .from('seo_meta')
      .select('entity_id')
      .eq('entity_type', 'post')
      .eq('noindex', true);
    const noindexIds = new Set((noindex ?? []).map((r) => r.entity_id));

    const { data: posts } = await admin
      .from('posts')
      .select('id, title, slug, excerpt, content, published_at, updated_at, author:profiles!posts_author_id_fkey(full_name)')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    const items = (posts ?? [])
      .filter((p: any) => !noindexIds.has(p.id))
      .map((p: any) => {
        const link = `${base}/blog/${p.slug}`;
        const pub = new Date(p.published_at ?? p.updated_at).toUTCString();
        const description = p.excerpt || stripHtml(p.content ?? '').slice(0, 300);
        return (
          `    <item>\n` +
          `      <title>${xml(p.title)}</title>\n` +
          `      <link>${xml(link)}</link>\n` +
          `      <guid isPermaLink="true">${xml(link)}</guid>\n` +
          `      <pubDate>${pub}</pubDate>\n` +
          (p.author?.full_name ? `      <dc:creator>${xml(p.author.full_name)}</dc:creator>\n` : '') +
          `      <description>${xml(description)}</description>\n` +
          `    </item>`
        );
      })
      .join('\n');

    const body =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">\n` +
      `  <channel>\n` +
      `    <title>${xml(title)}</title>\n` +
      `    <link>${xml(base + '/blog')}</link>\n` +
      `    <description>${xml(desc)}</description>\n` +
      `    <language>en</language>\n` +
      `    <atom:link href="${xml(new URL(req.url).toString())}" rel="self" type="application/rss+xml" />\n` +
      items +
      `\n  </channel>\n</rss>\n`;

    return new Response(body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=600',
      },
    });
  } catch (e: any) {
    return new Response(`<!-- error: ${xml(e.message ?? String(e))} -->`, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/xml' },
    });
  }
});
