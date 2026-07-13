import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { AuthSpinner } from "@/components/AuthSpinner";

export default function AdminRedirect() {
  const { session, loading } = useAuth();
  if (loading) return <AuthSpinner />;
  return <Navigate to={session ? "/dashboard" : "/login"} replace />;
}
