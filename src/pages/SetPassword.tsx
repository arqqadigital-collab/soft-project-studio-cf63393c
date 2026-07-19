import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSiteBranding } from "@/hooks/use-site-branding";

export default function SetPassword() {
  const { data: branding } = useSiteBranding();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"invite" | "recovery" | "signup" | "unknown">("unknown");

  useEffect(() => {
    document.title = "Set your password";

    // Supabase returns tokens in the URL hash (#access_token=...&type=invite|recovery|signup)
    // or as an error (#error=access_denied&error_code=otp_expired).
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const params = new URLSearchParams(hash);

    const errorCode = params.get("error_code") || params.get("error");
    const errorDescription = params.get("error_description");
    if (errorCode) {
      setErrorMsg(
        errorDescription?.replace(/\+/g, " ") ??
          "This link is invalid or has expired. Please request a new invitation."
      );
      return;
    }

    const type = params.get("type");
    if (type === "invite" || type === "recovery" || type === "signup") {
      setMode(type);
    }

    // Detect session created by the recovery/invite link.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    navigate("/dashboard", { replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {branding?.site_logo_url ? (
            <img
              src={branding.site_logo_url}
              alt={branding.site_title ?? "Site logo"}
              className="mb-3 h-14 w-14 rounded-lg object-contain"
            />
          ) : null}
          <h1 className="text-2xl font-semibold text-foreground">
            {mode === "recovery" ? "Reset your password" : "Set your password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "invite"
              ? "Welcome! Choose a password to activate your account."
              : "Choose a new password to continue."}
          </p>
        </div>

        {errorMsg && !ready ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">{errorMsg}</p>
            <p className="text-xs text-muted-foreground">
              Ask an admin to send you a new invitation link.
            </p>
          </div>
        ) : !ready ? (
          <p className="text-sm text-muted-foreground">Verifying your link…</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">New password</label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">Confirm password</label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Save password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
