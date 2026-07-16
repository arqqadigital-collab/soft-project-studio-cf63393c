import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteBranding = {
  site_title: string | null;
  site_logo_url: string | null;
};

export function useSiteBranding() {
  return useQuery({
    queryKey: ["site-branding"],
    staleTime: 60_000,
    queryFn: async (): Promise<SiteBranding> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("site_title, site_logo_url")
        .maybeSingle();
      if (error) throw error;
      return {
        site_title: data?.site_title ?? null,
        site_logo_url: data?.site_logo_url ?? null,
      };
    },
  });
}
