import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocale } from "@/hooks/useLocale";

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
  description: string | null;
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

export type MenuLink = {
  id: string;
  column_id: string;
  label: string;
  url: string;
  target: string;
  position: number;
  is_visible: boolean;
};

export type MenuItem =
  | { kind: "page"; id: string; position: number; page: MenuPage }
  | { kind: "link"; id: string; position: number; link: MenuLink };

export type MenuTreeGroup = MenuGroup & {
  columns: (MenuColumn & {
    pages: MenuPage[];
    links: MenuLink[];
    items: MenuItem[];
  })[];
};

function trLabel(row: any, locale: string, fallback: string, key = "label"): string {
  if (locale === "en") return fallback;
  const t = row?.translations?.[locale];
  const v = t?.[key];
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

export async function fetchMenuTree(locale: string = "en"): Promise<MenuTreeGroup[]> {
  const [gRes, cRes, pRes, lRes] = await Promise.all([
    supabase.from("menu_groups").select("*, translations").order("position"),
    supabase.from("menu_columns").select("*, translations").order("position"),
    supabase
      .from("pages")
      .select("id,title,slug,status,menu_column_id,menu_position,nav_label,page_kind,route_path,translations")
      .not("menu_column_id", "is", null)
      .order("menu_position"),
    supabase.from("menu_links").select("*, translations").order("position"),
  ]);
  if (gRes.error) throw gRes.error;
  if (cRes.error) throw cRes.error;
  if (pRes.error) throw pRes.error;
  if (lRes.error) throw lRes.error;

  const groups = (gRes.data ?? []).map((g: any) => ({
    ...g,
    label: trLabel(g, locale, g.label),
  })) as MenuGroup[];

  const columns = (cRes.data ?? []).map((c: any) => ({
    ...c,
    label: trLabel(c, locale, c.label),
    description:
      locale !== "en" && c.translations?.[locale]?.description
        ? c.translations[locale].description
        : c.description,
  })) as MenuColumn[];

  const pages = (pRes.data ?? []).map((p: any) => {
    const navFallback = p.nav_label || p.title;
    const nav_label = trLabel(p, locale, navFallback, "nav_label");
    return {
      ...p,
      title: trLabel(p, locale, p.title, "title"),
      nav_label,
    };
  }) as MenuPage[];

  const links = (lRes.data ?? []).map((l: any) => ({
    ...l,
    label: trLabel(l, locale, l.label),
  })) as MenuLink[];

  return groups.map((g) => ({
    ...g,
    columns: columns
      .filter((c) => c.group_id === g.id)
      .map((c) => {
        const colPages = pages.filter((p) => p.menu_column_id === c.id);
        const colLinks = links.filter((l) => l.column_id === c.id);
        const items: MenuItem[] = [
          ...colPages.map<MenuItem>((p) => ({ kind: "page", id: p.id, position: p.menu_position, page: p })),
          ...colLinks.map<MenuItem>((l) => ({ kind: "link", id: l.id, position: l.position, link: l })),
        ].sort((a, b) => a.position - b.position);
        return { ...c, pages: colPages, links: colLinks, items };
      }),
  }));
}

export function useMenuTree() {
  const { locale } = useLocale();
  return useQuery({ queryKey: ["menu-tree", locale], queryFn: () => fetchMenuTree(locale) });
}
