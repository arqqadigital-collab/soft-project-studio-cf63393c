import { FormEvent, useEffect, useState } from "react";
import type { EmailOtpType } from "@supabase/supabase-js";
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
    let active = true;
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const getParam = (key: string) => query.get(key) ?? hash.get(key);

    const linkType = getParam("type");
    if (linkType === "invite" || linkType === "recovery" || linkType === "signup") {
      setMode(linkType);
    } else if (window.location.pathname.includes("reset-password")) {
      setMode("recovery");
    } else if (window.location.pathname.includes("invite")) {
      setMode("invite");
    }

    const showLinkError = (message?: string) => {
      if (!active) return;
      setReady(false);
      setErrorMsg(
        message || "This password link is invalid or has expired. Please request a new link."
      );
    };

    const initialize = async () => {
      const linkError = getParam("error_code") || getParam("error");
      if (linkError) {
        showLinkError(getParam("error_description")?.replace(/\+/g, " "));
        return;
      }

      // Handle PKCE links (?code=...), custom token-hash links, and legacy
      // implicit links (#access_token=...&refresh_token=...).
      const code = query.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          showLinkError(error.message);
          return;
        }
      } else {
        const tokenHash = getParam("token_hash");
        if (tokenHash && linkType) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: linkType as EmailOtpType,
          });
          if (error) {
            showLinkError(error.message);
            return;
          }
        } else {
          const accessToken = hash.get("access_token");
          const refreshToken = hash.get("refresh_token");
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) {
              showLinkError(error.message);
              return;
            }
          }
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error || !data.session) {
        showLinkError(error?.message);
        return;
      }
      setErrorMsg(null);
      setReady(true);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (active && session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
        setErrorMsg(null);
        setReady(true);
      }
    });

    void initialize();
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
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
              {mode === "recovery"
                ? "Return to sign in and request a new reset link."
                : "Ask an admin to send you a new invitation link."}
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
