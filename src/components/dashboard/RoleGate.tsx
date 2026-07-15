import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { AuthSpinner } from "@/components/AuthSpinner";
import { Button } from "@/components/ui/button";
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
  if (ok) return <>{children}</>;

  const currentRole = roles[0] ?? "no role assigned";
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md rounded-lg border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-6 w-6 text-destructive" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">Access restricted</h2>
        <p className="mb-1 text-sm text-muted-foreground">
          You don't have permission to view this section.
        </p>
        <p className="mb-4 text-sm text-muted-foreground">
          Your current role is{" "}
          <span className="font-medium text-foreground capitalize">{currentRole}</span>.
          This section requires:{" "}
          <span className="font-medium text-foreground">{allow.join(", ")}</span>.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Contact an admin if you need access.
        </p>
        <Button asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
