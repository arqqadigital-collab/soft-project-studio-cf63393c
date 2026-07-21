import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { SiteHead } from "@/components/SiteHead";
import { RouteSeo } from "@/components/RouteSeo";
import { BrandingApplier } from "@/components/BrandingApplier";
import { StyleApplier } from "@/components/StyleApplier";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import AdminRedirect from "./pages/AdminRedirect";
import Index from "./pages/Index";
import About from "./pages/About";
import Careers from "./pages/Careers";
import HIS from "./pages/HIS";
import ClinicManagement from "./pages/ClinicManagement";
import EmergencyDepartment from "./pages/EmergencyDepartment";
import Physiotherapy from "./pages/Physiotherapy";
import Telemedicine from "./pages/Telemedicine";
import HospitalOperations from "./pages/HospitalOperations";
import Dental from "./pages/Dental";
import LIS from "./pages/LIS";
import RIS from "./pages/RIS";
import RCM from "./pages/RCM";
import BloodBank from "./pages/BloodBank";
import MedicationDosage from "./pages/MedicationDosage";
import PACS from "./pages/PACS";
import AIImaging from "./pages/AIImaging";
import UAECompliance from "./pages/UAECompliance";
import KSACompliance from "./pages/KSACompliance";
import EMRAM from "./pages/EMRAM";
import ClinicalAI from "./pages/ClinicalAI";
import PatientEngagement from "./pages/PatientEngagement";
import RevenueCycle from "./pages/RevenueCycle";
import Dynamics365 from "./pages/Dynamics365";
import Odoo from "./pages/Odoo";
import Zoho from "./pages/Zoho";
import Manufacturing from "./pages/Manufacturing";
import Retail from "./pages/Retail";
import Education from "./pages/Education";
import Logistics from "./pages/Logistics";
import Cybersecurity from "./pages/Cybersecurity";
import Consulting from "./pages/Consulting";
import Implementation from "./pages/Implementation";
import StaffAug from "./pages/StaffAug";
import Learning from "./pages/Learning";
import Blog from "./pages/Blog";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Contact from "./pages/Contact";
import ArticleDetail from "./pages/ArticleDetail";
import PublicPage from "./pages/PublicPage";
import PublicPreview from "./pages/PublicPreview";
import { DEFAULT_ROUTE_MAP, useRouteMap, type RouteKey } from "@/lib/routeMap";

function NotFound() {
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
      <RouteSeo />
      <BrandingApplier />
      <StyleApplier />
      {!hideHeader && <Header />}
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
        <Route path="/p/:slug" element={<PublicPage />} />
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
        <Route path="/ar/p/:slug" element={<PublicPage />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}
