import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /login
Disallow: /preview/

Sitemap: ${SUPABASE_URL}/functions/v1/sitemap
`;

Deno.serve(async (_req) => {
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data } = await admin
      .from('site_settings')
      .select('robots_txt')
      .eq('singleton', true)
      .maybeSingle();

    const body = (data?.robots_txt && data.robots_txt.trim().length > 0)
      ? data.robots_txt
      : DEFAULT_ROBOTS;

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (_e) {
    return new Response(DEFAULT_ROBOTS, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
});
