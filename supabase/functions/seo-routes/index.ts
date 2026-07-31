import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Public, read-only endpoint consumed by seo-sync.php on the Apache/cPanel
// side. Returns everything needed to regenerate the "AUTO SEO" block inside
// .htaccess: (1) every redirect from slug_redirects, resolved to real full
// paths exactly like PathRedirect.tsx/displayUrl() do client-side, and
// (2) every currently-valid public route on the site, so Apache can decide
// 200 (known route) vs a real 404 (unknown route) without needing to touch
// the database itself.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

function isExternal(v: string): boolean {
  return /^https?:\/\//i.test((v ?? '').trim());
}

/** Mirrors src/components/PathRedirect.tsx normalizePath() exactly. */
function normalizePath(input: string): string {
  let value = (input ?? '').trim();
  if (!value) return '/';
  if (/^https?:\/\//i.test(value)) {
    try {
      const u = new URL(value);
      value = u.pathname + u.search;
    } catch {
      /* ignore */
    }
  }
  try {
    value = decodeURI(value);
  } catch {
    /* ignore */
  }
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/+$/, '');
  return (value || '/').toLowerCase();
}

/** Mirrors src/pages/dashboard/SeoDashboard.tsx displayUrl() exactly. */
function resolveEntityPath(entityType: string, value: string): string {
  if (isExternal(value)) return value;
  if (entityType === 'path') return normalizePath(value);
  if (entityType === 'post') return `/blog/${value}`;
  if (entityType === 'case_study') return `/case-studies/${value}`;
  if (entityType === 'event') return `/events/${value}`;
  return `/${value}`;
}

// Mirrors src/lib/routeMap.ts DEFAULT_ROUTE_MAP — used only if the route_map
// table has no row for a given key (keeps behavior identical to the app's
// own useRouteMap() fallback).
const DEFAULT_ROUTE_MAP: { route_key: string; path_en: string; path_ar: string | null }[] = [
  { route_key: 'home', path_en: '/', path_ar: '/' },
  { route_key: 'about', path_en: '/about', path_ar: '/من-نحن' },
  { route_key: 'careers', path_en: '/careers', path_ar: '/الوظائف' },
  { route_key: 'contact', path_en: '/contact', path_ar: '/تواصل-معنا' },
  { route_key: 'blog', path_en: '/blog', path_ar: '/المدونة' },
  { route_key: 'events', path_en: '/events', path_ar: '/الفعاليات' },
  { route_key: 'case-studies', path_en: '/case-studies', path_ar: '/دراسات-الحالة' },
  { route_key: 'healthcare.his', path_en: '/healthcare/his', path_ar: '/الرعاية-الصحية/نظام-معلومات-المستشفى' },
  { route_key: 'healthcare.clinic', path_en: '/healthcare/clinic', path_ar: '/الرعاية-الصحية/إدارة-العيادات' },
  { route_key: 'healthcare.emergency', path_en: '/healthcare/emergency', path_ar: '/الرعاية-الصحية/قسم-الطوارئ' },
  { route_key: 'healthcare.physiotherapy', path_en: '/healthcare/physiotherapy', path_ar: '/الرعاية-الصحية/العلاج-الطبيعي' },
  { route_key: 'healthcare.telemedicine', path_en: '/healthcare/telemedicine', path_ar: '/الرعاية-الصحية/التطبيب-عن-بعد' },
  { route_key: 'healthcare.operations', path_en: '/healthcare/operations', path_ar: '/الرعاية-الصحية/عمليات-المستشفى' },
  { route_key: 'healthcare.dental', path_en: '/healthcare/dental', path_ar: '/الرعاية-الصحية/طب-الأسنان' },
  { route_key: 'healthcare.lis', path_en: '/healthcare/lis', path_ar: '/الرعاية-الصحية/نظام-معلومات-المختبر' },
  { route_key: 'healthcare.ris', path_en: '/healthcare/ris', path_ar: '/الرعاية-الصحية/نظام-معلومات-الأشعة' },
  { route_key: 'healthcare.rcm', path_en: '/healthcare/rcm', path_ar: '/الرعاية-الصحية/دورة-الإيرادات' },
  { route_key: 'healthcare.blood-bank', path_en: '/healthcare/blood-bank', path_ar: '/الرعاية-الصحية/بنك-الدم' },
  { route_key: 'healthcare.medication-dosage', path_en: '/healthcare/medication-dosage', path_ar: '/الرعاية-الصحية/الأدوية-والجرعات' },
  { route_key: 'healthcare.pacs', path_en: '/healthcare/pacs', path_ar: '/الرعاية-الصحية/باكس' },
  { route_key: 'healthcare.ai-imaging', path_en: '/healthcare/ai-imaging', path_ar: '/الرعاية-الصحية/التصوير-بالذكاء-الاصطناعي' },
  { route_key: 'healthcare.uae-compliance', path_en: '/healthcare/uae-compliance', path_ar: '/الرعاية-الصحية/الامتثال-الإماراتي' },
  { route_key: 'healthcare.ksa-compliance', path_en: '/healthcare/ksa-compliance', path_ar: '/الرعاية-الصحية/الامتثال-السعودي' },
  { route_key: 'healthcare.emram', path_en: '/healthcare/emram', path_ar: '/الرعاية-الصحية/إمرام' },
  { route_key: 'healthcare.clinical-ai', path_en: '/healthcare/clinical-ai', path_ar: '/الرعاية-الصحية/الذكاء-الاصطناعي-السريري' },
  { route_key: 'healthcare.patient-engagement', path_en: '/healthcare/patient-engagement', path_ar: '/الرعاية-الصحية/تفاعل-المرضى' },
  { route_key: 'healthcare.revenue-cycle', path_en: '/healthcare/revenue-cycle', path_ar: '/الرعاية-الصحية/الأداء-المالي' },
  { route_key: 'erp.dynamics-365', path_en: '/erp/dynamics-365', path_ar: '/تخطيط-الموارد/دايناميكس-365' },
  { route_key: 'erp.odoo', path_en: '/erp/odoo', path_ar: '/تخطيط-الموارد/أودو' },
  { route_key: 'erp.zoho', path_en: '/erp/zoho', path_ar: '/تخطيط-الموارد/زوهو' },
  { route_key: 'erp.manufacturing', path_en: '/erp/manufacturing', path_ar: '/تخطيط-الموارد/التصنيع' },
  { route_key: 'erp.retail', path_en: '/erp/retail', path_ar: '/تخطيط-الموارد/التجزئة' },
  { route_key: 'erp.education', path_en: '/erp/education', path_ar: '/تخطيط-الموارد/التعليم' },
  { route_key: 'erp.logistics', path_en: '/erp/logistics', path_ar: '/تخطيط-الموارد/الخدمات-اللوجستية' },
  { route_key: 'services.cybersecurity', path_en: '/services/cybersecurity', path_ar: '/الخدمات/الأمن-السيبراني' },
  { route_key: 'services.consulting', path_en: '/services/consulting', path_ar: '/الخدمات/الاستشارات' },
  { route_key: 'services.implementation', path_en: '/services/implementation', path_ar: '/الخدمات/التنفيذ-والتكامل' },
  { route_key: 'services.staff-aug', path_en: '/services/staff-aug', path_ar: '/الخدمات/تعزيز-الفرق-والخدمات-المُدارة' },
  { route_key: 'services.learning', path_en: '/services/learning', path_ar: '/الخدمات/التعلم-والمعرفة' },
];

function arFullPath(pathAr: string | null, pathEn: string): string {
  const ar = pathAr && pathAr.length > 0 ? pathAr : pathEn;
  return ar === '/' ? '/ar' : `/ar${ar.startsWith('/') ? '' : '/'}${ar}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // ---- Redirects (from slug_redirects, resolved to real full paths) ----
    const { data: redirectRows } = await admin
      .from('slug_redirects')
      .select('entity_type, old_slug, new_slug')
      .limit(2000);

    const redirects = (redirectRows ?? [])
      .map((r) => ({
        from: resolveEntityPath(r.entity_type, r.old_slug),
        to: resolveEntityPath(r.entity_type, r.new_slug),
      }))
      .filter((r) => !isExternal(r.from) && r.from && r.to && r.from !== r.to);

    // ---- Valid routes: coded pages (route_map) + dynamic content ----
    const validPaths = new Set<string>();

    const { data: routeMapRows } = await admin
      .from('route_map')
      .select('route_key, path_en, path_ar');
    const overrides = new Map((routeMapRows ?? []).map((r) => [r.route_key, r]));
    for (const def of DEFAULT_ROUTE_MAP) {
      const row = overrides.get(def.route_key) ?? def;
      validPaths.add(row.path_en);
      validPaths.add(arFullPath(row.path_ar, row.path_en));
      validPaths.add(`/ar${row.path_en === '/' ? '' : row.path_en}`); // EN-slug-under-/ar fallback, matches buildArabicRoutes()
    }

    const [{ data: pages }, { data: posts }, { data: events }, { data: caseStudies }] = await Promise.all([
      admin.from('pages').select('slug, slug_ar').eq('status', 'published').limit(2000),
      admin.from('posts').select('slug').eq('status', 'published').limit(2000),
      admin.from('events').select('slug').eq('status', 'published').limit(2000),
      admin.from('case_studies').select('slug').eq('status', 'published').limit(2000),
    ]);

    for (const p of pages ?? []) {
      if (!p.slug) continue;
      validPaths.add(`/${p.slug}`);
      validPaths.add(`/ar/${p.slug_ar || p.slug}`);
    }
    for (const p of posts ?? []) {
      if (!p.slug) continue;
      validPaths.add(`/blog/${p.slug}`);
      validPaths.add(`/ar/blog/${p.slug}`);
      validPaths.add(`/ar/المدونة/${p.slug}`);
    }
    for (const e of events ?? []) {
      if (!e.slug) continue;
      validPaths.add(`/events/${e.slug}`);
      validPaths.add(`/ar/events/${e.slug}`);
      validPaths.add(`/ar/الفعاليات/${e.slug}`);
    }
    for (const c of caseStudies ?? []) {
      if (!c.slug) continue;
      validPaths.add(`/case-studies/${c.slug}`);
      validPaths.add(`/ar/case-studies/${c.slug}`);
      validPaths.add(`/ar/دراسات-الحالة/${c.slug}`);
    }

    return new Response(
      JSON.stringify({
        redirects,
        validPaths: Array.from(validPaths),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
