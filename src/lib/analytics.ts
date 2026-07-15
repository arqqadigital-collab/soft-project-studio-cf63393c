import { supabase } from "@/integrations/supabase/client";

export async function logPageView(entity_type: "post" | "page", entity_id: string) {
  try {
    await supabase.from("page_views").insert({
      entity_type,
      entity_id,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    });
  } catch {
    // silent
  }
}
