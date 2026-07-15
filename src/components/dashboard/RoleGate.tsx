import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthSpinner } from "@/components/AuthSpinner";
import { useRoles, type AppRole } from "@/hooks/use-role";

export function RoleGate({
  allow,
  children,
}: {
  allow: AppRole[];
  children: ReactNode;
}) {
  const { roles, loading } = useRoles();
  if (loading) return <AuthSpinner />;
  const ok = roles.some((r) => allow.includes(r));
  if (!ok) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
