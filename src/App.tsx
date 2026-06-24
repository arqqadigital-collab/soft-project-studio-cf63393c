import { Routes, Route, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import About from "./pages/About";
import HIS from "./pages/HIS";
import Dental from "./pages/Dental";
import LIS from "./pages/LIS";
import RIS from "./pages/RIS";
import RCM from "./pages/RCM";
import BloodBank from "./pages/BloodBank";
import MedicationDosage from "./pages/MedicationDosage";
import PACS from "./pages/PACS";
import AIImaging from "./pages/AIImaging";
import UAECompliance from "./pages/UAECompliance";
import EMRAM from "./pages/EMRAM";
import Dynamics365 from "./pages/Dynamics365";

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
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/healthcare/his" element={<HIS />} />
        <Route path="/healthcare/dental" element={<Dental />} />
        <Route path="/healthcare/lis" element={<LIS />} />
        <Route path="/healthcare/ris" element={<RIS />} />
        <Route path="/healthcare/rcm" element={<RCM />} />
        <Route path="/healthcare/blood-bank" element={<BloodBank />} />
        <Route path="/healthcare/medication-dosage" element={<MedicationDosage />} />
        <Route path="/healthcare/pacs" element={<PACS />} />
        <Route path="/healthcare/ai-imaging" element={<AIImaging />} />
        <Route path="/healthcare/uae-compliance" element={<UAECompliance />} />
        <Route path="/healthcare/emram" element={<EMRAM />} />
        <Route path="/erp/dynamics-365" element={<Dynamics365 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
