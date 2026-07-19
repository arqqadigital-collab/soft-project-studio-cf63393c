// Translate page sections to Arabic using Lovable AI Gateway.
// Overwrite mode: replaces any existing translations.ar for each section.
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

async function translateJson(input: unknown): Promise<any> {
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
    throw new Error(`AI ${res.status}: ${t.slice(0, 300)}`);
  }
  const j = await res.json();
  const content = j?.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(content);
  } catch {
    // strip fences if any
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    return JSON.parse(cleaned);
  }
}

async function translateSection(row: { id: string; data: any }) {
  const ar = await translateJson(row.data ?? {});
  // Merge into translations to preserve other locales
  const { data: existing } = await admin
    .from("page_sections").select("translations").eq("id", row.id).maybeSingle();
  const nextTranslations = { ...((existing?.translations as any) ?? {}), ar };
  const { error } = await admin
    .from("page_sections").update({ translations: nextTranslations }).eq("id", row.id);
  if (error) throw error;
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
    const mode = body?.mode as "page" | "all_pages";

    let query = admin.from("page_sections").select("id, data, page_id");
    if (mode === "page") {
      if (!body?.pageId) throw new Response(JSON.stringify({ error: "pageId required" }), { status: 400 });
      query = query.eq("page_id", body.pageId);
    } else if (mode !== "all_pages") {
      throw new Response(JSON.stringify({ error: "mode must be 'page' or 'all_pages'" }), { status: 400 });
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    let ok = 0, fail = 0;
    const errors: string[] = [];
    // Sequential to respect rate limits
    for (const row of rows ?? []) {
      try {
        await translateSection(row as any);
        ok++;
      } catch (e) {
        fail++;
        errors.push(`${(row as any).id}: ${(e as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({ ok, fail, total: rows?.length ?? 0, errors: errors.slice(0, 10) }),
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
