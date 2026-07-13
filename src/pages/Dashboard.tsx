import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          Log out
        </button>
      </header>
      <section className="px-6 py-10">
        <p className="text-foreground">
          Dashboard - Logged in as <span className="font-medium">{user?.email}</span>
        </p>
      </section>
    </main>
  );
}
