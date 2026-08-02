import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const TOKEN = "a75c35a69695a6a2025188d7cb4b9af1";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  if (!TOKEN || req.headers.get("x-upload-token") !== TOKEN) {
    return new Response("forbidden", { status: 403 });
  }

  const body = await req.json();
  const files: Array<{ name: string; contentType: string; base64: string; folder?: string; alt?: string }> =
    body.files ?? [];

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const TTL = 60 * 60 * 24 * 365 * 10;
  const out: Array<Record<string, unknown>> = [];

  for (const f of files) {
    const bin = Uint8Array.from(atob(f.base64), (c) => c.charCodeAt(0));
    const ext = f.name.split(".").pop() || "png";
    const key = `migrated/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from("media").upload(key, bin, { contentType: f.contentType, upsert: true });
    if (up.error) {
      out.push({ name: f.name, error: up.error.message });
      continue;
    }
    const signed = await supabase.storage.from("media").createSignedUrl(key, TTL);
    if (signed.error) {
      out.push({ name: f.name, error: signed.error.message });
      continue;
    }
    const { error: insErr } = await supabase.from("media").insert({
      file_name: f.name,
      file_url: signed.data.signedUrl,
      file_type: f.contentType,
      file_size: bin.byteLength,
      folder: f.folder ?? "logos",
      alt_text: f.alt ?? null,
    });
    out.push({ name: f.name, url: signed.data.signedUrl, insertError: insErr?.message ?? null });
  }

  return new Response(JSON.stringify({ results: out }), {
    headers: { "Content-Type": "application/json" },
  });
});
