import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { BrandingApplier } from "@/components/BrandingApplier";
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
      <BrandingApplier />
      {!hideHeader && <Header />}
      <Routes>
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
