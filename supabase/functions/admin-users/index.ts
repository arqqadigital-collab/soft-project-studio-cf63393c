import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ANON = Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY')!;

type Action = 'list' | 'invite' | 'create' | 'send_reset' | 'set_password' | 'set_role' | 'delete';

const VALID_ROLES = ['admin', 'editor', 'author', 'subscriber'] as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validRole(role: unknown): role is typeof VALID_ROLES[number] {
  return typeof role === 'string' && VALID_ROLES.includes(role as typeof VALID_ROLES[number]);
}

function passwordError(password: unknown) {
  if (typeof password !== 'string' || password.length < 8) return 'Password must be at least 8 characters';
  if (password.length > 128) return 'Password must be 128 characters or fewer';
  return null;
}

// Per-admin rate limit for sensitive actions.
// In-memory (per edge instance) — good enough to blunt bursts and misuse.
const buckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

function rateLimited(key: string) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > RATE_LIMIT;
}

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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return jsonResponse({ error: gate.error }, gate.status);

    const { admin, caller } = gate;
    const body = await req.json().catch(() => ({}));
    const action: Action = body.action;
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      null;

    // Rate limit mutating actions per caller
    if (action !== 'list') {
      if (rateLimited(caller.id)) {
        return jsonResponse({ error: 'Too many requests. Please slow down.' }, 429);
      }
    }

    async function logAudit(actionName: string, target_user_id: string | null, metadata: Record<string, unknown>) {
      await admin.from('admin_audit_log').insert({
        actor_id: caller.id,
        action: actionName,
        target_user_id,
        metadata,
        ip,
      });
    }

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
      return jsonResponse({ users });
    }

    if (action === 'invite') {
      const { email, role, redirect_to } = body;
      if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) return jsonResponse({ error: 'A valid email is required' }, 400);
      if (!validRole(role)) return jsonResponse({ error: 'A valid role is required' }, 400);
      const origin = req.headers.get('origin') || req.headers.get('referer') || '';
      const base = (redirect_to || origin || '').replace(/\/$/, '');
      const redirectTo = base ? `${base}/set-password` : undefined;
      const { data, error } = await admin.auth.admin.inviteUserByEmail(
        email,
        redirectTo ? { redirectTo } : undefined,
      );
      if (error) throw error;
      if (data.user && role) {
        await admin.from('user_roles').upsert({ user_id: data.user.id, role }, { onConflict: 'user_id,role' });
      }
      await logAudit('invite', data.user?.id ?? null, { email, role: role ?? null });
      return jsonResponse({ user: data.user });
    }

    if (action === 'create') {
      const { email, password, role } = body;
      if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) return jsonResponse({ error: 'A valid email is required' }, 400);
      const invalidPassword = passwordError(password);
      if (invalidPassword) return jsonResponse({ error: invalidPassword }, 400);
      if (!validRole(role)) return jsonResponse({ error: 'A valid role is required' }, 400);

      const { data, error } = await admin.auth.admin.createUser({
        email: email.trim().toLowerCase(),
        password,
        email_confirm: true,
      });
      if (error) throw error;
      await admin.from('user_roles').upsert(
        { user_id: data.user.id, role },
        { onConflict: 'user_id,role' },
      );
      await logAudit('create_user', data.user.id, { email, role });
      return jsonResponse({ user: data.user });
    }

    if (action === 'send_reset') {
      const { email, redirect_to } = body;
      if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) return jsonResponse({ error: 'A valid email is required' }, 400);
      const origin = req.headers.get('origin') || req.headers.get('referer') || '';
      const base = (redirect_to || origin || '').replace(/\/$/, '');
      const { error } = await admin.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        base ? { redirectTo: `${base}/reset-password` } : undefined,
      );
      if (error) {
        const isRateLimit = error.status === 429 || error.message.toLowerCase().includes('rate limit');
        return jsonResponse(
          { error: isRateLimit ? 'Email limit reached. Wait before retrying, or set the password directly.' : error.message },
          isRateLimit ? 429 : 400,
        );
      }
      await logAudit('send_password_reset', null, { email });
      return jsonResponse({ ok: true });
    }

    if (action === 'set_password') {
      const { user_id, password } = body;
      if (typeof user_id !== 'string' || !user_id) return jsonResponse({ error: 'user_id required' }, 400);
      const invalidPassword = passwordError(password);
      if (invalidPassword) return jsonResponse({ error: invalidPassword }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password });
      if (error) throw error;
      await logAudit('set_password', user_id, {});
      return jsonResponse({ ok: true });
    }

    if (action === 'set_role') {
      const { user_id, role } = body;
      if (!user_id || !role) return jsonResponse({ error: 'user_id and role required' }, 400);
      if (!validRole(role)) return jsonResponse({ error: 'invalid role' }, 400);

      // Capture previous roles for audit trail
      const { data: prevRoles } = await admin.from('user_roles').select('role').eq('user_id', user_id);
      await admin.from('user_roles').delete().eq('user_id', user_id);
      const { error } = await admin.from('user_roles').insert({ user_id, role });
      if (error) throw error;
      await logAudit('set_role', user_id, {
        new_role: role,
        previous_roles: (prevRoles ?? []).map((r: any) => r.role),
      });
      return jsonResponse({ ok: true });
    }

    if (action === 'delete') {
      const { user_id } = body;
      if (!user_id) return jsonResponse({ error: 'user_id required' }, 400);
      if (user_id === caller.id) return jsonResponse({ error: 'Cannot delete yourself' }, 400);
      const { data: targetUser } = await admin.auth.admin.getUserById(user_id);
      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) throw error;
      await logAudit('delete', user_id, { email: targetUser?.user?.email ?? null });
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: 'Unknown action' }, 400);
  } catch (e: any) {
    return jsonResponse({ error: e.message ?? String(e) }, 500);
  }
});
