import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ListPageHero = {
  page_key: string;
  eyebrow: string | null;
  title_prefix: string | null;
  title_highlight: string | null;
  description: string | null;
  is_visible: boolean;
};

export function useListPageHero(pageKey: string) {
  return useQuery({
    queryKey: ["list_page_hero", pageKey],
    queryFn: async (): Promise<ListPageHero | null> => {
      const { data, error } = await supabase
        .from("list_page_hero")
        .select("page_key,eyebrow,title_prefix,title_highlight,description,is_visible")
        .eq("page_key", pageKey)
        .maybeSingle();
      if (error) throw error;
      return data as ListPageHero | null;
    },
    staleTime: 60_000,
  });
}
