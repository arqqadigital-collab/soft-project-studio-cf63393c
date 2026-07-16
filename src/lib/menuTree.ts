import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type MenuGroup = {
  id: string;
  label: string;
  position: number;
  is_visible: boolean;
};

export type MenuColumn = {
  id: string;
  group_id: string;
  label: string;
  position: number;
  is_visible: boolean;
};

export type MenuPage = {
  id: string;
  title: string;
  slug: string;
  status: string;
  menu_column_id: string | null;
  menu_position: number;
  nav_label: string | null;
  page_kind: "cms" | "coded";
  route_path: string | null;
};

export type MenuTreeGroup = MenuGroup & {
  columns: (MenuColumn & { pages: MenuPage[] })[];
};

export async function fetchMenuTree(): Promise<MenuTreeGroup[]> {
  const [gRes, cRes, pRes] = await Promise.all([
    supabase.from("menu_groups").select("*").order("position"),
    supabase.from("menu_columns").select("*").order("position"),
    supabase
      .from("pages")
      .select("id,title,slug,status,menu_column_id,menu_position,nav_label,page_kind,route_path")
      .not("menu_column_id", "is", null)
      .order("menu_position"),
  ]);
  if (gRes.error) throw gRes.error;
  if (cRes.error) throw cRes.error;
  if (pRes.error) throw pRes.error;

  const groups = (gRes.data ?? []) as MenuGroup[];
  const columns = (cRes.data ?? []) as MenuColumn[];
  const pages = (pRes.data ?? []) as MenuPage[];

  return groups.map((g) => ({
    ...g,
    columns: columns
      .filter((c) => c.group_id === g.id)
      .map((c) => ({
        ...c,
        pages: pages.filter((p) => p.menu_column_id === c.id),
      })),
  }));
}

export function useMenuTree() {
  return useQuery({ queryKey: ["menu-tree"], queryFn: fetchMenuTree });
}
