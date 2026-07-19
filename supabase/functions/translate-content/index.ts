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
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      return translateJson(input, attempt + 1);
    }
    throw new Error(`AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const j = await res.json();
  const content = j?.choices?.[0]?.message?.content ?? "";
  const tryParse = (s: string) => { try { return JSON.parse(s); } catch { return null; } };
  let parsed = tryParse(content);
  if (!parsed) {
    const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    parsed = tryParse(cleaned);
  }
  if (!parsed) {
    // Extract first {...} block
    const m = content.match(/\{[\s\S]*\}/);
    if (m) parsed = tryParse(m[0]);
  }
  if (!parsed && attempt < 4) {
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    return translateJson(input, attempt + 1);
  }
  return parsed ?? {};
}

// Recursively count translatable string leaves (skips code-like values)
function countStrings(v: unknown): number {
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return 0;
    if (/^(https?:|\/|#|mailto:)/i.test(s)) return 0;
    if (/^[a-z0-9_-]{1,32}$/i.test(s) && !/\s/.test(s)) return 0; // slugs/enums
    return 1;
  }
  if (Array.isArray(v)) return v.reduce((n, x) => n + countStrings(x), 0);
  if (v && typeof v === "object") return Object.values(v as any).reduce((n: number, x) => n + countStrings(x), 0);
  return 0;
}

// Check translation looks structurally complete: covers >=70% of source strings
function isTranslationAdequate(source: unknown, ar: unknown): boolean {
  const srcCount = countStrings(source);
  if (srcCount === 0) return true;
  const arCount = countStrings(ar);
  return arCount >= Math.ceil(srcCount * 0.7);
}

async function translateJsonValidated(input: unknown): Promise<any> {
  let last: any = {};
  for (let i = 0; i < 3; i++) {
    const ar = await translateJson(input, 0);
    last = ar;
    if (isTranslationAdequate(input, ar)) return ar;
  }
  return last;
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

async function mergeAr(table: string, id: string, ar: any, keyColumn = "id") {
  const { data: existing } = await admin
    .from(table).select("translations").eq(keyColumn, id).maybeSingle();
  const next = { ...(((existing as any)?.translations as any) ?? {}), ar };
  const { error } = await admin.from(table).update({ translations: next }).eq(keyColumn, id);
  if (error) throw error;
}

async function mergeArFields(table: string, id: string, fields: Record<string, unknown>) {
  const { data: existing, error: readError } = await admin
    .from(table).select("translations").eq("id", id).maybeSingle();
  if (readError) throw readError;
  const translations = (((existing as any)?.translations as Record<string, any>) ?? {});
  const next = { ...translations, ar: { ...(translations.ar ?? {}), ...fields } };
  const { error } = await admin.from(table).update({ translations: next }).eq("id", id);
  if (error) throw error;
}

async function translateSection(row: { id: string; data: any }) {
  const src = row.data ?? {};
  if (countStrings(src) === 0) return; // nothing translatable
  const ar = await translateJsonValidated(src);
  if (!ar || Object.keys(ar).length === 0) throw new Error("empty translation");
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
  const ar = await translateJsonValidated(payload);
  await mergeAr("header_footer_settings", (data as any).id, ar);
  return { ok: 1, fail: 0, total: 1 };
}

async function translateMenus() {
  let ok = 0, fail = 0;
  const errors: string[] = [];
  const [groupsResult, columnsResult, linksResult, pagesResult] = await Promise.all([
    admin.from("menu_groups").select("id, label").order("position"),
    admin.from("menu_columns").select("id, label, description").order("position"),
    admin.from("menu_links").select("id, label").order("position"),
    admin.from("pages").select("id, title, nav_label").not("menu_column_id", "is", null).order("menu_position"),
  ]);
  for (const result of [groupsResult, columnsResult, linksResult, pagesResult]) {
    if (result.error) throw result.error;
  }

  const groups = (groupsResult.data ?? []) as any[];
  const columns = (columnsResult.data ?? []) as any[];
  const links = (linksResult.data ?? []) as any[];
  const pages = (pagesResult.data ?? []) as any[];
  const total = groups.length + columns.length + links.length + pages.length;

  // Translate the small menu tree in one request instead of making one AI call per row.
  // This keeps the function well below its wall-clock timeout.
  const translated = await translateJsonValidated({
    groups: groups.map((row) => ({ label: row.label ?? "" })),
    columns: columns.map((row) => ({ label: row.label ?? "", description: row.description ?? "" })),
    links: links.map((row) => ({ label: row.label ?? "" })),
    pages: pages.map((row) => ({ title: row.title ?? "", nav_label: row.nav_label ?? row.title ?? "" })),
  });

  const jobs = [
    ...groups.map((row, index) => ({ table: "menu_groups", row, ar: translated?.groups?.[index] })),
    ...columns.map((row, index) => ({ table: "menu_columns", row, ar: translated?.columns?.[index] })),
    ...links.map((row, index) => ({ table: "menu_links", row, ar: translated?.links?.[index] })),
    ...pages.map((row, index) => ({ table: "pages", row, ar: translated?.pages?.[index] })),
  ];
  const settled = await mapWithConcurrency(jobs, 8, async (job) => {
    if (!job.ar || typeof job.ar !== "object") throw new Error("Missing translated row");
    await mergeArFields(job.table, job.row.id, job.ar);
  });
  settled.forEach((result, index) => {
    if (result.status === "fulfilled") ok++;
    else {
      fail++;
      errors.push(`${jobs[index].table}/${jobs[index].row.id}: ${(result.reason as Error)?.message ?? "error"}`);
    }
  });
  return { ok, fail, total, errors };
}

async function translateHomepage(missingOnly: boolean) {
  let ok = 0, fail = 0, total = 0;
  const errors: string[] = [];

  // 1) Hero row (text fields)
  const { data: hero, error: heroErr } = await admin
    .from("homepage_hero").select("id, heading_line1, heading_line2, subheadline, cta_label, translations")
    .eq("singleton", true).maybeSingle();
  if (heroErr) throw heroErr;
  if (hero) {
    total++;
    const payload = {
      heading_line1: (hero as any).heading_line1 ?? "",
      heading_line2: (hero as any).heading_line2 ?? "",
      subheadline: (hero as any).subheadline ?? "",
      cta_label: (hero as any).cta_label ?? "",
    };
    const existingAr = ((hero as any).translations?.ar ?? {}) as any;
    const skip = missingOnly && isTranslationAdequate(payload, existingAr);
    if (!skip) {
      try {
        const ar = await translateJsonValidated(payload);
        await mergeAr("homepage_hero", (hero as any).id, ar);
        ok++;
      } catch (e: any) { fail++; errors.push(`hero: ${e?.message ?? "error"}`); }
    } else { ok++; }
  }

  // 2) Homepage sections
  const { data: sections, error: secErr } = await admin
    .from("homepage_sections").select("section_key, content, translations");
  if (secErr) throw secErr;
  let list = (sections ?? []) as any[];
  if (missingOnly) {
    list = list.filter((r) => !isTranslationAdequate(r.content ?? {}, (r.translations as any)?.ar ?? {}));
  }
  total += list.length;
  const settled = await mapWithConcurrency(list, 3, async (row: any) => {
    const src = row.content ?? {};
    if (countStrings(src) === 0) return;
    const ar = await translateJsonValidated(src);
    if (!ar || Object.keys(ar).length === 0) throw new Error("empty translation");
    await mergeAr("homepage_sections", row.section_key, ar, "section_key");
  });
  settled.forEach((r, i) => {
    if (r.status === "fulfilled") ok++;
    else { fail++; errors.push(`${list[i].section_key}: ${(r.reason as Error)?.message ?? "error"}`); }
  });

  return { ok, fail, total, errors: errors.slice(0, 10) };
}

async function translateContact(missingOnly: boolean) {
  let ok = 0, fail = 0, total = 0;
  const errors: string[] = [];

  // 1) contact_page singleton
  const { data: page, error: pErr } = await admin
    .from("contact_page").select("*").eq("singleton", true).maybeSingle();
  if (pErr) throw pErr;
  if (page) {
    total++;
    const p: any = page;
    const payload = {
      hero_eyebrow: p.hero_eyebrow ?? "",
      hero_headline: p.hero_headline ?? "",
      hero_subheadline: p.hero_subheadline ?? "",
      hero_cta_label: p.hero_cta_label ?? "",
      form_heading: p.form_heading ?? "",
      form_subheading: p.form_subheading ?? "",
      form_submit_label: p.form_submit_label ?? "",
      offices_heading: p.offices_heading ?? "",
      offices_subheading: p.offices_subheading ?? "",
      quick_info: Array.isArray(p.quick_info) ? p.quick_info : [],
    };
    const existingAr = (p.translations?.ar ?? {}) as any;
    const skip = missingOnly && isTranslationAdequate(payload, existingAr);
    if (!skip) {
      try {
        const ar = await translateJsonValidated(payload);
        await mergeAr("contact_page", p.id, ar);
        ok++;
      } catch (e: any) { fail++; errors.push(`page: ${e?.message ?? "error"}`); }
    } else { ok++; }
  }

  // 2) contact_offices
  const { data: offices, error: oErr } = await admin
    .from("contact_offices").select("id, city, address, translations");
  if (oErr) throw oErr;
  let officeList = (offices ?? []) as any[];
  if (missingOnly) {
    officeList = officeList.filter((r) =>
      !isTranslationAdequate({ city: r.city, address: r.address }, (r.translations as any)?.ar ?? {}),
    );
  }
  total += officeList.length;
  const oSettled = await mapWithConcurrency(officeList, 3, async (row: any) => {
    const src = { city: row.city ?? "", address: row.address ?? "" };
    if (countStrings(src) === 0) return;
    const ar = await translateJsonValidated(src);
    await mergeAr("contact_offices", row.id, ar);
  });
  oSettled.forEach((r, i) => {
    if (r.status === "fulfilled") ok++;
    else { fail++; errors.push(`office/${officeList[i].id}: ${(r.reason as Error)?.message ?? "error"}`); }
  });

  // 3) contact_inquiry_areas (translate as one batch to save calls)
  const { data: areas, error: aErr } = await admin
    .from("contact_inquiry_areas").select("id, label, translations");
  if (aErr) throw aErr;
  let areaList = (areas ?? []) as any[];
  if (missingOnly) {
    areaList = areaList.filter((r) =>
      !isTranslationAdequate({ label: r.label }, (r.translations as any)?.ar ?? {}),
    );
  }
  if (areaList.length) {
    total += areaList.length;
    try {
      const batch = await translateJsonValidated({ labels: areaList.map((r) => r.label ?? "") });
      const arr = Array.isArray(batch?.labels) ? batch.labels : [];
      await Promise.all(areaList.map(async (row, idx) => {
        try {
          const label = typeof arr[idx] === "string" ? arr[idx] : "";
          if (!label) { fail++; return; }
          await mergeAr("contact_inquiry_areas", row.id, { label });
          ok++;
        } catch (e: any) { fail++; errors.push(`area/${row.id}: ${e?.message ?? "error"}`); }
      }));
    } catch (e: any) { fail += areaList.length; errors.push(`areas: ${e?.message ?? "error"}`); }
  }

  return { ok, fail, total, errors: errors.slice(0, 10) };
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
    const mode = body?.mode as "page" | "all_pages" | "header_footer" | "menus" | "homepage" | "raw" | "contact";

    if (mode === "raw") {
      const src = body?.payload ?? {};
      const ar = await translateJsonValidated(src);
      return new Response(JSON.stringify({ ar }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (mode === "header_footer") {
      const r = await translateHeaderFooter();
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (mode === "menus") {
      const r = await translateMenus();
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (mode === "homepage") {
      const r = await translateHomepage(!!body?.missingOnly);
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (mode === "contact") {
      const r = await translateContact(!!body?.missingOnly);
      return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let query = admin.from("page_sections").select("id, data, page_id, translations");
    if (mode === "page") {
      if (!body?.pageId) throw new Response(JSON.stringify({ error: "pageId required" }), { status: 400 });
      query = query.eq("page_id", body.pageId);
    } else if (mode !== "all_pages") {
      throw new Response(JSON.stringify({ error: "mode must be 'page', 'all_pages', 'header_footer', 'menus', or 'homepage'" }), { status: 400 });
    }

    const { data: rows, error } = await query;
    if (error) throw error;

    let list = (rows ?? []) as any[];
    // When missingOnly=true, skip sections whose Arabic already looks complete
    if (body?.missingOnly) {
      list = list.filter((r) => !isTranslationAdequate(r.data ?? {}, (r.translations as any)?.ar ?? {}));
    }
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
