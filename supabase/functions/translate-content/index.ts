// Translate page sections + header/footer + menus to Arabic using Lovable AI Gateway.
// Overwrite mode: replaces any existing translations.ar for each row.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const SYS = `You are a professional English→Arabic translator for a modern healthcare/technology website.
You will receive a JSON object representing one page section's content.
Rules:
- Return a JSON object with the SAME structure and SAME keys as the input.
- Translate every human-readable English string value into natural, fluent Modern Standard Arabic.
- Do NOT translate: URLs, file paths, image/asset paths, email addresses, hex colors, CSS class names, icon names (short slugs like "shield-check", "activity"), enum-like values (e.g. "primary", "outline", "left", "right"), booleans, numbers, or any string that starts with "http", "/", "#", or is clearly a code/identifier.
- Keep arrays in the same order and length.
- Preserve punctuation and structure. Do NOT add commentary.
- Output ONLY valid minified JSON, no markdown fences.`;

async function translateJson(input: unknown, attempt = 0): Promise<any> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": LOVABLE_API_KEY,
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [
        { role: "system", content: SYS },
        { role: "user", content: JSON.stringify(input) },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    // Retry on rate-limit / transient upstream
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      return translateJson(input, attempt + 1);
    }
    throw new Error(`AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const j = await res.json();
  const content = j?.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try { return JSON.parse(cleaned); } catch { return {}; }
  }
}

async function mapWithConcurrency<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      try { results[idx] = { status: "fulfilled", value: await fn(items[idx]) }; }
      catch (e) { results[idx] = { status: "rejected", reason: e }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function mergeAr(table: string, id: string, ar: any) {
  const { data: existing } = await admin
    .from(table).select("translations").eq("id", id).maybeSingle();
  const next = { ...(((existing as any)?.translations as any) ?? {}), ar };
  const { error } = await admin.from(table).update({ translations: next }).eq("id", id);
  if (error) throw error;
}

async function translateSection(row: { id: string; data: any }) {
  const ar = await translateJson(row.data ?? {});
  await mergeAr("page_sections", row.id, ar);
}

async function translateHeaderFooter() {
  const { data, error } = await admin
    .from("header_footer_settings").select("*").eq("singleton", true).maybeSingle();
  if (error) throw error;
  if (!data) return { ok: 0, fail: 0, total: 0 };
  const payload = {
    header_brand_text: (data as any).header_brand_text ?? "",
    header_cta_label: (data as any).header_cta_label ?? "",
    footer_tagline: (data as any).footer_tagline ?? "",
    footer_copyright: (data as any).footer_copyright ?? "",
    footer_columns: (data as any).footer_columns ?? [],
    mobile_menu_items: (data as any).mobile_menu_items ?? [],
  };
  const ar = await translateJson(payload);
  await mergeAr("header_footer_settings", (data as any).id, ar);
  return { ok: 1, fail: 0, total: 1 };
}

async function translateMenus() {
  let ok = 0, fail = 0, total = 0;
  const errors: string[] = [];
  for (const table of ["menu_groups", "menu_columns", "menu_links"] as const) {
    const { data, error } = await admin.from(table).select("id, label, description");
    if (error) throw error;
    for (const row of (data ?? []) as any[]) {
      total++;
      try {
        const payload: any = { label: row.label ?? "" };
        if (table === "menu_columns") payload.description = row.description ?? "";
        const ar = await translateJson(payload);
        await mergeAr(table, row.id, ar);
        ok++;
      } catch (e) {
        fail++; errors.push(`${table}/${row.id}: ${(e as Error).message}`);
      }
    }
  }
  // Also translate page nav_label + title for pages in menus
  const { data: pgs } = await admin
    .from("pages").select("id, title, nav_label").not("menu_column_id", "is", null);
  for (const p of (pgs ?? []) as any[]) {
    total++;
    try {
      const ar = await translateJson({ title: p.title ?? "", nav_label: p.nav_label ?? p.title ?? "" });
      await mergeAr("pages", p.id, ar);
      ok++;
    } catch (e) {
      fail++; errors.push(`pages/${p.id}: ${(e as Error).message}`);
    }
  }
  return { ok, fail, total, errors };
}

async function requireAdmin(req: Request): Promise<string> {
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new Response("Unauthorized", { status: 401 });
  const authed = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: u } = await authed.auth.getUser();
  const uid = u?.user?.id;
  if (!uid) throw new Response("Unauthorized", { status: 401 });
  const { data: role } = await admin
    .from("user_roles").select("role").eq("user_id", uid).in("role", ["admin", "editor"]).maybeSingle();
  if (!role) throw new Response("Forbidden", { status: 403 });
  return uid;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    await requireAdmin(req);
    const body = await req.json().catch(() => ({}));
    const mode = body?.mode as "page" | "all_pages" | "header_footer" | "menus";

    if (mode === "header_footer") {
      const r = await translateHeaderFooter();
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (mode === "menus") {
      const r = await translateMenus();
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let query = admin.from("page_sections").select("id, data, page_id");
    if (mode === "page") {
      if (!body?.pageId) throw new Response(JSON.stringify({ error: "pageId required" }), { status: 400 });
      query = query.eq("page_id", body.pageId);
    } else if (mode !== "all_pages") {
      throw new Response(JSON.stringify({ error: "mode must be 'page', 'all_pages', 'header_footer', or 'menus'" }), { status: 400 });
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    const list = (rows ?? []) as any[];
    const settled = await mapWithConcurrency(list, 3, (row) => translateSection(row));
    let ok = 0, fail = 0;
    const errors: string[] = [];
    settled.forEach((r, i) => {
      if (r.status === "fulfilled") ok++;
      else { fail++; errors.push(`${list[i].id}: ${(r.reason as Error)?.message ?? "error"}`); }
    });

    return new Response(
      JSON.stringify({ ok, fail, total: list.length, errors: errors.slice(0, 10) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    if (e instanceof Response) {
      const text = await e.text().catch(() => "");
      return new Response(text || e.statusText, { status: e.status, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
