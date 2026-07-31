import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function defaultRobots(base: string) {
  return `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /login
Disallow: /preview/

Sitemap: ${base}/sitemap.xml
`;
}

Deno.serve(async (req) => {
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data } = await admin
      .from('site_settings')
      .select('robots_txt, site_url')
      .eq('singleton', true)
      .maybeSingle();

    const reqUrl = new URL(req.url);
    const originParam = reqUrl.searchParams.get('site_url');
    const origin = req.headers.get('origin') ?? reqUrl.origin;
    const base =
      (data?.site_url ?? '').replace(/\/$/, '') ||
      (originParam ?? '').replace(/\/$/, '') ||
      origin.replace(/\/$/, '');

    const body = (data?.robots_txt && data.robots_txt.trim().length > 0)
      ? data.robots_txt
      : defaultRobots(base);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (_e) {
    return new Response(defaultRobots(''), {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
});
