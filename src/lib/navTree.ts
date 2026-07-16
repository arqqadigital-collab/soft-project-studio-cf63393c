import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type NavGroup = {
  id: string;
  label: string;
  slug: string;
  position: number;
  is_visible: boolean;
};

export type NavSection = {
  id: string;
  group_id: string;
  label: string;
  description: string | null;
  href: string | null;
  position: number;
  is_visible: boolean;
};

export type NavPage = {
  id: string;
  title: string;
  slug: string;
  status: string;
  section_id: string | null;
  nav_label: string | null;
  position: number;
};

export type NavCustomItem = {
  id: string;
  section_id: string;
  label: string;
  url: string;
  item_type: string;
  position: number;
  is_visible: boolean;
};

export type NavTreeGroup = NavGroup & {
  sections: (NavSection & { pages: NavPage[]; customItems: NavCustomItem[] })[];
};

export async function fetchNavTree(): Promise<NavTreeGroup[]> {
  const [groupsRes, sectionsRes, pagesRes, itemsRes] = await Promise.all([
    supabase.from("nav_groups").select("*").order("position"),
    supabase.from("nav_sections").select("*").order("position"),
    supabase
      .from("pages")
      .select("id, title, slug, status, section_id, nav_label, position")
      .order("position"),
    supabase
      .from("nav_items")
      .select("id, section_id, label, url, item_type, position, is_visible")
      .order("position"),
  ]);
  if (groupsRes.error) throw groupsRes.error;
  if (sectionsRes.error) throw sectionsRes.error;
  if (pagesRes.error) throw pagesRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const pages = (pagesRes.data ?? []) as NavPage[];
  const customItems = (itemsRes.data ?? []) as NavCustomItem[];
  const sections = (sectionsRes.data ?? []) as NavSection[];
  const groups = (groupsRes.data ?? []) as NavGroup[];

  return groups.map((g) => ({
    ...g,
    sections: sections
      .filter((s) => s.group_id === g.id)
      .map((s) => ({
        ...s,
        pages: pages.filter((p) => p.section_id === s.id),
        customItems: customItems.filter((item) => item.section_id === s.id),
      })),
  }));
}

export function useNavTree() {
  return useQuery({ queryKey: ["nav-tree"], queryFn: fetchNavTree });
}
