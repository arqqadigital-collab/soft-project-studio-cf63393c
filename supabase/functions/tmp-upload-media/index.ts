import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { filename, contentType, base64, folder } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const id = crypto.randomUUID();
    const path = `migrated/${id}.png`;
    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, bytes, { contentType: contentType || "image/png", upsert: true });
    if (upErr) throw upErr;
    const { data: signed, error: signErr } = await supabase.storage
      .from("media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signErr) throw signErr;
    const url = signed.signedUrl;
    await supabase.from("media").insert({
      filename,
      url,
      storage_path: path,
      mime_type: contentType || "image/png",
      size_bytes: bytes.length,
      folder: folder || "logos",
    });
    return new Response(JSON.stringify({ url, path }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
