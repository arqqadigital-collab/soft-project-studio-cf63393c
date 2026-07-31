import { supabase } from "@/integrations/supabase/client";

/**
 * Fire-and-forget 404 logging. Duplicate URLs are grouped server-side and the
 * hit counter is incremented. A sessionStorage guard avoids hammering the RPC
 * when the same missing URL is re-rendered inside one tab session.
 */
export async function logNotFound(pathname?: string) {
  try {
    if (typeof window === "undefined") return;
    const url = pathname ?? window.location.pathname + window.location.search;
    if (!url || url.startsWith("/dashboard")) return;
    const key = `404:${url}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    await supabase.rpc("log_not_found", {
      _url: url,
      _referrer: document.referrer || undefined,
    });
  } catch {
    // silent — monitoring must never break rendering
  }
}
