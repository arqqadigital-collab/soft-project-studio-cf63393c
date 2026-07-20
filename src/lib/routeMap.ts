import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type RouteKey =
  | "home" | "about" | "careers" | "contact" | "blog" | "events" | "case-studies"
  | "healthcare.his" | "healthcare.clinic" | "healthcare.emergency"
  | "healthcare.physiotherapy" | "healthcare.telemedicine" | "healthcare.operations"
  | "healthcare.dental" | "healthcare.lis" | "healthcare.ris" | "healthcare.rcm"
  | "healthcare.blood-bank" | "healthcare.medication-dosage" | "healthcare.pacs"
  | "healthcare.ai-imaging" | "healthcare.uae-compliance" | "healthcare.ksa-compliance"
  | "healthcare.emram" | "healthcare.clinical-ai" | "healthcare.patient-engagement"
  | "healthcare.revenue-cycle"
  | "erp.dynamics-365" | "erp.odoo" | "erp.zoho" | "erp.manufacturing"
  | "erp.retail" | "erp.education" | "erp.logistics"
  | "services.cybersecurity" | "services.consulting" | "services.implementation"
  | "services.staff-aug" | "services.learning";

export type RouteMapRow = {
  route_key: RouteKey;
  path_en: string;
  path_ar: string | null;
  title_en: string | null;
  title_ar: string | null;
};

/** Fallback used before the DB query resolves. Mirrors the seeded route_map. */
export const DEFAULT_ROUTE_MAP: RouteMapRow[] = [
  { route_key: "home", path_en: "/", path_ar: "/", title_en: "Home", title_ar: "الرئيسية" },
  { route_key: "about", path_en: "/about", path_ar: "/من-نحن", title_en: "About", title_ar: "من نحن" },
  { route_key: "careers", path_en: "/careers", path_ar: "/الوظائف", title_en: "Careers", title_ar: "الوظائف" },
  { route_key: "contact", path_en: "/contact", path_ar: "/تواصل-معنا", title_en: "Contact", title_ar: "تواصل معنا" },
  { route_key: "blog", path_en: "/blog", path_ar: "/المدونة", title_en: "Blog", title_ar: "المدونة" },
  { route_key: "events", path_en: "/events", path_ar: "/الفعاليات", title_en: "Events", title_ar: "الفعاليات" },
  { route_key: "case-studies", path_en: "/case-studies", path_ar: "/دراسات-الحالة", title_en: "Case Studies", title_ar: "دراسات الحالة" },
  { route_key: "healthcare.his", path_en: "/healthcare/his", path_ar: "/الرعاية-الصحية/نظام-معلومات-المستشفى", title_en: "HIS", title_ar: "نظام معلومات المستشفى" },
  { route_key: "healthcare.clinic", path_en: "/healthcare/clinic", path_ar: "/الرعاية-الصحية/إدارة-العيادات", title_en: "Clinic Management", title_ar: "إدارة العيادات" },
  { route_key: "healthcare.emergency", path_en: "/healthcare/emergency", path_ar: "/الرعاية-الصحية/قسم-الطوارئ", title_en: "Emergency Department", title_ar: "قسم الطوارئ" },
  { route_key: "healthcare.physiotherapy", path_en: "/healthcare/physiotherapy", path_ar: "/الرعاية-الصحية/العلاج-الطبيعي", title_en: "Physiotherapy", title_ar: "العلاج الطبيعي" },
  { route_key: "healthcare.telemedicine", path_en: "/healthcare/telemedicine", path_ar: "/الرعاية-الصحية/التطبيب-عن-بعد", title_en: "Telemedicine", title_ar: "التطبيب عن بعد" },
  { route_key: "healthcare.operations", path_en: "/healthcare/operations", path_ar: "/الرعاية-الصحية/عمليات-المستشفى", title_en: "Hospital Operations", title_ar: "عمليات المستشفى" },
  { route_key: "healthcare.dental", path_en: "/healthcare/dental", path_ar: "/الرعاية-الصحية/طب-الأسنان", title_en: "Dental", title_ar: "طب الأسنان" },
  { route_key: "healthcare.lis", path_en: "/healthcare/lis", path_ar: "/الرعاية-الصحية/نظام-معلومات-المختبر", title_en: "LIS", title_ar: "نظام معلومات المختبر" },
  { route_key: "healthcare.ris", path_en: "/healthcare/ris", path_ar: "/الرعاية-الصحية/نظام-معلومات-الأشعة", title_en: "RIS", title_ar: "نظام معلومات الأشعة" },
  { route_key: "healthcare.rcm", path_en: "/healthcare/rcm", path_ar: "/الرعاية-الصحية/دورة-الإيرادات", title_en: "RCM", title_ar: "دورة الإيرادات" },
  { route_key: "healthcare.blood-bank", path_en: "/healthcare/blood-bank", path_ar: "/الرعاية-الصحية/بنك-الدم", title_en: "Blood Bank", title_ar: "بنك الدم" },
  { route_key: "healthcare.medication-dosage", path_en: "/healthcare/medication-dosage", path_ar: "/الرعاية-الصحية/الأدوية-والجرعات", title_en: "Medication & Dosage", title_ar: "الأدوية والجرعات" },
  { route_key: "healthcare.pacs", path_en: "/healthcare/pacs", path_ar: "/الرعاية-الصحية/باكس", title_en: "PACS", title_ar: "باكس" },
  { route_key: "healthcare.ai-imaging", path_en: "/healthcare/ai-imaging", path_ar: "/الرعاية-الصحية/التصوير-بالذكاء-الاصطناعي", title_en: "AI Imaging", title_ar: "التصوير بالذكاء الاصطناعي" },
  { route_key: "healthcare.uae-compliance", path_en: "/healthcare/uae-compliance", path_ar: "/الرعاية-الصحية/الامتثال-الإماراتي", title_en: "UAE Compliance", title_ar: "الامتثال الإماراتي" },
  { route_key: "healthcare.ksa-compliance", path_en: "/healthcare/ksa-compliance", path_ar: "/الرعاية-الصحية/الامتثال-السعودي", title_en: "KSA Compliance", title_ar: "الامتثال السعودي" },
  { route_key: "healthcare.emram", path_en: "/healthcare/emram", path_ar: "/الرعاية-الصحية/إمرام", title_en: "EMRAM", title_ar: "إمرام" },
  { route_key: "healthcare.clinical-ai", path_en: "/healthcare/clinical-ai", path_ar: "/الرعاية-الصحية/الذكاء-الاصطناعي-السريري", title_en: "Clinical AI", title_ar: "الذكاء الاصطناعي السريري" },
  { route_key: "healthcare.patient-engagement", path_en: "/healthcare/patient-engagement", path_ar: "/الرعاية-الصحية/تفاعل-المرضى", title_en: "Patient Engagement", title_ar: "تفاعل المرضى" },
  { route_key: "healthcare.revenue-cycle", path_en: "/healthcare/revenue-cycle", path_ar: "/الرعاية-الصحية/الأداء-المالي", title_en: "Revenue Cycle", title_ar: "الأداء المالي" },
  { route_key: "erp.dynamics-365", path_en: "/erp/dynamics-365", path_ar: "/تخطيط-الموارد/دايناميكس-365", title_en: "Dynamics 365", title_ar: "دايناميكس 365" },
  { route_key: "erp.odoo", path_en: "/erp/odoo", path_ar: "/تخطيط-الموارد/أودو", title_en: "Odoo", title_ar: "أودو" },
  { route_key: "erp.zoho", path_en: "/erp/zoho", path_ar: "/تخطيط-الموارد/زوهو", title_en: "Zoho", title_ar: "زوهو" },
  { route_key: "erp.manufacturing", path_en: "/erp/manufacturing", path_ar: "/تخطيط-الموارد/التصنيع", title_en: "Manufacturing", title_ar: "التصنيع" },
  { route_key: "erp.retail", path_en: "/erp/retail", path_ar: "/تخطيط-الموارد/التجزئة", title_en: "Retail", title_ar: "التجزئة" },
  { route_key: "erp.education", path_en: "/erp/education", path_ar: "/تخطيط-الموارد/التعليم", title_en: "Education", title_ar: "التعليم" },
  { route_key: "erp.logistics", path_en: "/erp/logistics", path_ar: "/تخطيط-الموارد/الخدمات-اللوجستية", title_en: "Logistics", title_ar: "الخدمات اللوجستية" },
  { route_key: "services.cybersecurity", path_en: "/services/cybersecurity", path_ar: "/الخدمات/الأمن-السيبراني", title_en: "Cybersecurity", title_ar: "الأمن السيبراني" },
  { route_key: "services.consulting", path_en: "/services/consulting", path_ar: "/الخدمات/الاستشارات", title_en: "Consulting", title_ar: "الاستشارات" },
  { route_key: "services.implementation", path_en: "/services/implementation", path_ar: "/الخدمات/التنفيذ-والتكامل", title_en: "Implementation", title_ar: "التنفيذ والتكامل" },
  { route_key: "services.staff-aug", path_en: "/services/staff-aug", path_ar: "/الخدمات/تعزيز-الفرق-والخدمات-المُدارة", title_en: "Staff Augmentation", title_ar: "تعزيز الفرق والخدمات المُدارة" },
  { route_key: "services.learning", path_en: "/services/learning", path_ar: "/الخدمات/التعلم-والمعرفة", title_en: "Learning", title_ar: "التعلم والمعرفة" },
];

/** Build an /ar/... URL from a route_map row (or fall back to /ar + English path). */
export function arFullPath(row: Pick<RouteMapRow, "path_ar" | "path_en">): string {
  const ar = row.path_ar && row.path_ar.length > 0 ? row.path_ar : row.path_en;
  return ar === "/" ? "/ar" : `/ar${ar.startsWith("/") ? "" : "/"}${ar}`;
}

let cache: RouteMapRow[] | null = null;

/** Merged route map: DB overrides on top of DEFAULT_ROUTE_MAP. */
export function useRouteMap() {
  return useQuery({
    queryKey: ["route-map"],
    staleTime: 60_000,
    queryFn: async (): Promise<RouteMapRow[]> => {
      const { data } = await supabase
        .from("route_map" as any)
        .select("route_key, path_en, path_ar, title_en, title_ar");
      const overrides = new Map<string, RouteMapRow>();
      for (const r of (data ?? []) as RouteMapRow[]) overrides.set(r.route_key, r);
      const merged = DEFAULT_ROUTE_MAP.map((d) => overrides.get(d.route_key) ?? d);
      cache = merged;
      return merged;
    },
    initialData: DEFAULT_ROUTE_MAP,
  });
}

/** Sync accessor (uses last known cache or defaults). */
export function getRouteMap(): RouteMapRow[] {
  return cache ?? DEFAULT_ROUTE_MAP;
}

/** Find the counterpart URL for the current pathname (EN <-> AR). */
export function findCounterpart(pathname: string, targetLocale: "en" | "ar"): string | null {
  const map = getRouteMap();
  const isAr = pathname === "/ar" || pathname.startsWith("/ar/");

  if (isAr) {
    // Strip /ar prefix
    const arPath = pathname === "/ar" ? "/" : pathname.slice(3) || "/";
    if (targetLocale === "ar") return pathname;
    const row = map.find((r) => (r.path_ar ?? r.path_en) === arPath);
    return row ? row.path_en : null;
  } else {
    if (targetLocale === "en") return pathname;
    const row = map.find((r) => r.path_en === pathname);
    if (row) return arFullPath(row);
    // Dynamic routes (blog/:slug, events/:slug, etc.) — best effort prefix
    if (pathname.startsWith("/blog/")) return `/ar/blog/${pathname.slice(6)}`;
    if (pathname.startsWith("/events/")) return `/ar/events/${pathname.slice(8)}`;
    if (pathname.startsWith("/case-studies/")) return `/ar/case-studies/${pathname.slice(14)}`;
    if (pathname.startsWith("/p/")) return `/ar/p/${pathname.slice(3)}`;
    return `/ar${pathname === "/" ? "" : pathname}`;
  }
}

export function isArabicPath(pathname: string): boolean {
  return pathname === "/ar" || pathname.startsWith("/ar/");
}
