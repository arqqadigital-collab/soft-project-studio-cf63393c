import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!;

type Action = 'list' | 'invite' | 'set_role' | 'delete';

async function requireAdmin(req: Request) {
  const auth = req.headers.get('Authorization') ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) return { ok: false as const, status: 401, error: 'Missing token' };
  const userClient = createClient(SUPABASE_URL, ANON, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userRes, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userRes.user) return { ok: false as const, status: 401, error: 'Invalid session' };
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userRes.user.id, _role: 'admin' });
  if (!isAdmin) return { ok: false as const, status: 403, error: 'Forbidden' };
  return { ok: true as const, admin, caller: userRes.user };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) {
      return new Response(JSON.stringify({ error: gate.error }), {
        status: gate.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { admin, caller } = gate;
    const body = await req.json().catch(() => ({}));
    const action: Action = body.action;

    if (action === 'list') {
      const { data: authUsers, error: e1 } = await admin.auth.admin.listUsers({ perPage: 200 });
      if (e1) throw e1;
      const ids = authUsers.users.map((u) => u.id);
      const [{ data: profiles }, { data: roles }] = await Promise.all([
        admin.from('profiles').select('id, full_name, avatar_url').in('id', ids),
        admin.from('user_roles').select('user_id, role').in('user_id', ids),
      ]);
      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      const rolesMap = new Map<string, string[]>();
      (roles ?? []).forEach((r: any) => {
        const arr = rolesMap.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesMap.set(r.user_id, arr);
      });
      const users = authUsers.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        full_name: profileMap.get(u.id)?.full_name ?? null,
        avatar_url: profileMap.get(u.id)?.avatar_url ?? null,
        roles: rolesMap.get(u.id) ?? [],
      }));
      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'invite') {
      const { email, role } = body;
      if (!email) return new Response(JSON.stringify({ error: 'email required' }), { status: 400, headers: corsHeaders });
      const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
      if (error) throw error;
      if (data.user && role) {
        await admin.from('user_roles').upsert({ user_id: data.user.id, role }, { onConflict: 'user_id,role' });
      }
      return new Response(JSON.stringify({ user: data.user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'set_role') {
      const { user_id, role } = body;
      if (!user_id || !role) return new Response(JSON.stringify({ error: 'user_id and role required' }), { status: 400, headers: corsHeaders });
      // Replace all roles with the single new role (simple model)
      await admin.from('user_roles').delete().eq('user_id', user_id);
      const { error } = await admin.from('user_roles').insert({ user_id, role });
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete') {
      const { user_id } = body;
      if (!user_id) return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400, headers: corsHeaders });
      if (user_id === caller.id) {
        return new Response(JSON.stringify({ error: 'Cannot delete yourself' }), { status: 400, headers: corsHeaders });
      }
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
