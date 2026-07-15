import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type AppRole = "admin" | "editor" | "author" | "subscriber";

export const ROLE_RANK: Record<AppRole, number> = {
  subscriber: 0,
  author: 1,
  editor: 2,
  admin: 3,
};

export function useRoles() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["user_roles", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

  const roles = query.data ?? [];
  const has = (r: AppRole) => roles.includes(r);
  const highest: AppRole | null =
    roles.length === 0
      ? null
      : (roles.reduce((acc, r) => (ROLE_RANK[r] > ROLE_RANK[acc] ? r : acc), roles[0]) as AppRole);
  const atLeast = (r: AppRole) => highest !== null && ROLE_RANK[highest] >= ROLE_RANK[r];

  return { roles, has, atLeast, highest, loading: query.isLoading };
}
