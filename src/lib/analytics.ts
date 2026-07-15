import { supabase } from "@/integrations/supabase/client";

// Fire-and-forget page view logging.
// Server-side deduplicates per (viewer, entity, day) and rate-limits per IP.
// A sessionStorage guard prevents redundant requests within a single tab session.
export async function logPageView(entity_type: "post" | "page", entity_id: string) {
  try {
    if (typeof window !== "undefined") {
      const key = `pv:${entity_type}:${entity_id}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    }
    await supabase.functions.invoke("log-view", {
      body: {
        entity_type,
        entity_id,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
      },
    });
  } catch {
    // silent — analytics must never break rendering
  }
}
