import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Very lightweight in-memory throttle: max 10 posts/minute per IP.
// Sufficient to blunt refresh spam; unique index handles per-day dedupe.
const bucket = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 10;
const WINDOW_MS = 60_000;

function throttled(ip: string) {
  const now = Date.now();
  const b = bucket.get(ip);
  if (!b || b.resetAt < now) {
    bucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > LIMIT;
}

async function sha256Hex(input: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const entity_type = body.entity_type;
    const entity_id = body.entity_id;
    const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null;

    if ((entity_type !== 'post' && entity_type !== 'page') || typeof entity_id !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';
    const ua = req.headers.get('user-agent') ?? '';

    // Cheap bot filter
    if (/bot|crawl|spider|slurp|preview|monitor|curl|wget|python-requests/i.test(ua)) {
      return new Response(JSON.stringify({ ok: true, skipped: 'bot' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (throttled(ip)) {
      return new Response(JSON.stringify({ ok: true, skipped: 'throttled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const viewer_hash = await sha256Hex(`${ip}|${ua}|${entity_type}|${entity_id}`);
    const viewed_day = new Date().toISOString().slice(0, 10);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    // Unique index on (entity_type, entity_id, viewer_hash, viewed_day) makes this idempotent per day.
    const { error } = await admin.from('page_views').insert({
      entity_type,
      entity_id,
      referrer,
      viewer_hash,
      viewed_day,
    });
    // 23505 = unique violation → already counted today
    if (error && (error as any).code !== '23505') throw error;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
