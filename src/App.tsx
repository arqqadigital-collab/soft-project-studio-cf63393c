import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { logNotFound } from "@/lib/notFoundLog";
import { LegacyPageRedirect } from "@/components/LegacyPageRedirect";
import { PathRedirect } from "@/components/PathRedirect";

import { Header } from "@/components/Header";
import { SiteHead } from "@/components/SiteHead";
import { RouteSeo } from "@/components/RouteSeo";
import { SiteSchema } from "@/components/SiteSchema";
import { FaqSchema } from "@/components/FaqSchema";
import { TrackingScripts } from "@/components/TrackingScripts";
import { BrandingApplier } from "@/components/BrandingApplier";
import { StyleApplier } from "@/components/StyleApplier";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Every page-level route is code-split; only shell/chrome ships in the
// initial bundle. Behaviour is unchanged — these are the same components.
const Login = lazy(() => import("./pages/Login"));
const SetPassword = lazy(() => import("./pages/SetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminRedirect = lazy(() => import("./pages/AdminRedirect"));
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Careers = lazy(() => import("./pages/Careers"));
const HIS = lazy(() => import("./pages/HIS"));
const ClinicManagement = lazy(() => import("./pages/ClinicManagement"));
const EmergencyDepartment = lazy(() => import("./pages/EmergencyDepartment"));
const Physiotherapy = lazy(() => import("./pages/Physiotherapy"));
const Telemedicine = lazy(() => import("./pages/Telemedicine"));
const HospitalOperations = lazy(() => import("./pages/HospitalOperations"));
const Dental = lazy(() => import("./pages/Dental"));
const LIS = lazy(() => import("./pages/LIS"));
const RIS = lazy(() => import("./pages/RIS"));
const RCM = lazy(() => import("./pages/RCM"));
const BloodBank = lazy(() => import("./pages/BloodBank"));
const MedicationDosage = lazy(() => import("./pages/MedicationDosage"));
const PACS = lazy(() => import("./pages/PACS"));
const AIImaging = lazy(() => import("./pages/AIImaging"));
const UAECompliance = lazy(() => import("./pages/UAECompliance"));
const KSACompliance = lazy(() => import("./pages/KSACompliance"));
const EMRAM = lazy(() => import("./pages/EMRAM"));
const ClinicalAI = lazy(() => import("./pages/ClinicalAI"));
const PatientEngagement = lazy(() => import("./pages/PatientEngagement"));
const RevenueCycle = lazy(() => import("./pages/RevenueCycle"));
const Dynamics365 = lazy(() => import("./pages/Dynamics365"));
const Odoo = lazy(() => import("./pages/Odoo"));
const Zoho = lazy(() => import("./pages/Zoho"));
const Manufacturing = lazy(() => import("./pages/Manufacturing"));
const Retail = lazy(() => import("./pages/Retail"));
const Education = lazy(() => import("./pages/Education"));
const Logistics = lazy(() => import("./pages/Logistics"));
const Cybersecurity = lazy(() => import("./pages/Cybersecurity"));
const Consulting = lazy(() => import("./pages/Consulting"));
const Implementation = lazy(() => import("./pages/Implementation"));
const StaffAug = lazy(() => import("./pages/StaffAug"));
const Learning = lazy(() => import("./pages/Learning"));
const Blog = lazy(() => import("./pages/Blog"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const PublicPage = lazy(() => import("./pages/PublicPage"));
const PublicPreview = lazy(() => import("./pages/PublicPreview"));

import { DEFAULT_ROUTE_MAP, useRouteMap, type RouteKey } from "@/lib/routeMap";

function NotFound() {
  const { pathname } = useLocation();
  useEffect(() => {
    logNotFound(pathname);
  }, [pathname]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Component registry keyed by route_map.route_key.
const ROUTE_COMPONENTS: Record<RouteKey, React.ComponentType> = {
  "home": Index,
  "about": About,
  "careers": Careers,
  "contact": Contact,
  "blog": Blog,
  "events": Events,
  "case-studies": CaseStudies,
  "healthcare.his": HIS,
  "healthcare.clinic": ClinicManagement,
  "healthcare.emergency": EmergencyDepartment,
  "healthcare.physiotherapy": Physiotherapy,
  "healthcare.telemedicine": Telemedicine,
  "healthcare.operations": HospitalOperations,
  "healthcare.dental": Dental,
  "healthcare.lis": LIS,
  "healthcare.ris": RIS,
  "healthcare.rcm": RCM,
  "healthcare.blood-bank": BloodBank,
  "healthcare.medication-dosage": MedicationDosage,
  "healthcare.pacs": PACS,
  "healthcare.ai-imaging": AIImaging,
  "healthcare.uae-compliance": UAECompliance,
  "healthcare.ksa-compliance": KSACompliance,
  "healthcare.emram": EMRAM,
  "healthcare.clinical-ai": ClinicalAI,
  "healthcare.patient-engagement": PatientEngagement,
  "healthcare.revenue-cycle": RevenueCycle,
  "erp.dynamics-365": Dynamics365,
  "erp.odoo": Odoo,
  "erp.zoho": Zoho,
  "erp.manufacturing": Manufacturing,
  "erp.retail": Retail,
  "erp.education": Education,
  "erp.logistics": Logistics,
  "services.cybersecurity": Cybersecurity,
  "services.consulting": Consulting,
  "services.implementation": Implementation,
  "services.staff-aug": StaffAug,
  "services.learning": Learning,
};

// Build Arabic routes: each entry registers both the translated slug and the
// EN slug under /ar as a fallback (so untranslated deep links still resolve).
function buildArabicRoutes() {
  const out: { path: string; C: React.ComponentType }[] = [];
  const seen = new Set<string>();
  for (const row of DEFAULT_ROUTE_MAP) {
    const C = ROUTE_COMPONENTS[row.route_key];
    if (!C) continue;
    const arPath = `/ar${row.path_ar && row.path_ar !== "/" ? row.path_ar : ""}` || "/ar";
    const enFallback = `/ar${row.path_en && row.path_en !== "/" ? row.path_en : ""}` || "/ar";
    for (const p of [arPath, enFallback]) {
      const path = p === "" ? "/ar" : p;
      if (!seen.has(path)) {
        seen.add(path);
        out.push({ path, C });
      }
    }
  }
  return out;
}

const AR_ROUTES = buildArabicRoutes();

/** Resolves Arabic paths edited in the CMS after the app was built. */


function CmsArabicRoute() {
  const { pathname } = useLocation();
  const { data: routeMap = DEFAULT_ROUTE_MAP } = useRouteMap();
  const arPath = pathname === "/ar" ? "/" : pathname.slice(3) || "/";
  const row = routeMap.find((item) => (item.path_ar ?? item.path_en) === arPath || item.path_en === arPath);
  const Component = row ? ROUTE_COMPONENTS[row.route_key] : undefined;
  return Component ? <Component /> : <NotFound />;
}

/** /ar/:slug — a coded page if the route map knows it, otherwise a CMS page. */
function ArabicSlugRoute() {
  const { pathname } = useLocation();
  const { data: routeMap = DEFAULT_ROUTE_MAP } = useRouteMap();
  const arPath = pathname.slice(3) || "/";
  const row = routeMap.find((item) => (item.path_ar ?? item.path_en) === arPath || item.path_en === arPath);
  const Component = row ? ROUTE_COMPONENTS[row.route_key] : undefined;
  return Component ? <Component /> : <PublicPage />;
}

export default function App() {
  const location = useLocation();
  const hideHeader =
    location.pathname === "/login" ||
    location.pathname === "/set-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/accept-invite" ||
    location.pathname === "/admin" ||
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/dashboard/");

  return (
    <AuthProvider>
      <SiteHead />
      <PathRedirect />

      <RouteSeo />
      <SiteSchema />
      <FaqSchema />
      <TrackingScripts />
      <BrandingApplier />
      <StyleApplier />
      {!hideHeader && <Header />}
      <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Routes>
        {/* English (default) routes */}
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/healthcare/his" element={<HIS />} />
        <Route path="/healthcare/clinic" element={<ClinicManagement />} />
        <Route path="/healthcare/emergency" element={<EmergencyDepartment />} />
        <Route path="/healthcare/physiotherapy" element={<Physiotherapy />} />
        <Route path="/healthcare/telemedicine" element={<Telemedicine />} />
        <Route path="/healthcare/operations" element={<HospitalOperations />} />
        <Route path="/healthcare/dental" element={<Dental />} />
        <Route path="/healthcare/lis" element={<LIS />} />
        <Route path="/healthcare/ris" element={<RIS />} />
        <Route path="/healthcare/rcm" element={<RCM />} />
        <Route path="/healthcare/blood-bank" element={<BloodBank />} />
        <Route path="/healthcare/medication-dosage" element={<MedicationDosage />} />
        <Route path="/healthcare/pacs" element={<PACS />} />
        <Route path="/healthcare/ai-imaging" element={<AIImaging />} />
        <Route path="/healthcare/uae-compliance" element={<UAECompliance />} />
        <Route path="/healthcare/ksa-compliance" element={<KSACompliance />} />
        <Route path="/healthcare/emram" element={<EMRAM />} />
        <Route path="/healthcare/clinical-ai" element={<ClinicalAI />} />
        <Route path="/healthcare/patient-engagement" element={<PatientEngagement />} />
        <Route path="/healthcare/revenue-cycle" element={<RevenueCycle />} />
        <Route path="/erp/dynamics-365" element={<Dynamics365 />} />
        <Route path="/erp/odoo" element={<Odoo />} />
        <Route path="/erp/zoho" element={<Zoho />} />
        <Route path="/erp/manufacturing" element={<Manufacturing />} />
        <Route path="/erp/retail" element={<Retail />} />
        <Route path="/erp/education" element={<Education />} />
        <Route path="/erp/logistics" element={<Logistics />} />
        <Route path="/services/cybersecurity" element={<Cybersecurity />} />
        <Route path="/services/consulting" element={<Consulting />} />
        <Route path="/services/implementation" element={<Implementation />} />
        <Route path="/services/staff-aug" element={<StaffAug />} />
        <Route path="/services/learning" element={<Learning />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<ArticleDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        {/* Legacy /p/:slug → clean /:slug */}
        <Route path="/p/:slug" element={<LegacyPageRedirect />} />
        <Route path="/preview/:kind/:id" element={<PublicPreview />} />
        <Route path="/contact" element={<Contact />} />

        {/* Arabic routes — translated slugs + EN-slug fallbacks under /ar */}
        {AR_ROUTES.map(({ path, C }) => (
          <Route key={path} path={path} element={<C />} />
        ))}
        <Route path="/ar/blog/:slug" element={<ArticleDetail />} />
        <Route path="/ar/events/:slug" element={<EventDetail />} />
        <Route path="/ar/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="/ar/الفعاليات/:slug" element={<EventDetail />} />
        <Route path="/ar/المدونة/:slug" element={<ArticleDetail />} />
        <Route path="/ar/دراسات-الحالة/:slug" element={<CaseStudyDetail />} />
        {/* Legacy /ar/p/:slug → clean /ar/:slug */}
        <Route path="/ar/p/:slug" element={<LegacyPageRedirect />} />
        <Route path="/ar/:slug" element={<ArabicSlugRoute />} />
        <Route path="/ar/*" element={<CmsArabicRoute />} />

        <Route path="/login" element={<Login />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/reset-password" element={<SetPassword />} />
        <Route path="/accept-invite" element={<SetPassword />} />
        <Route path="/admin" element={<AdminRedirect />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Clean CMS page URLs — must stay last, before the 404 */}
        <Route path="/:slug" element={<PublicPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </AuthProvider>
  );
}
