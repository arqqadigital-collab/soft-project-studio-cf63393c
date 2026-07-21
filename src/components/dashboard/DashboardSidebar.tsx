import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileStack,
  Image as ImageIcon,
  PanelsTopLeft,
  Inbox,
  Settings,
  Newspaper,
  BookMarked,
  CalendarDays,
  Tags,
  Shield,
  Palette,
  Activity,
  Type,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useRoles } from "@/hooks/use-role";
import { useSiteBranding } from "@/hooks/use-site-branding";

type Item = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  allow?: readonly ("admin" | "editor" | "author" | "subscriber")[] | null;
};

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Content",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true },
      { title: "Pages & Navigation", url: "/dashboard/pages", icon: FileStack, allow: ["admin", "editor"] },
      { title: "Page Titles", url: "/dashboard/page-titles", icon: Type, allow: ["admin", "editor"] },
      { title: "Header & Footer", url: "/dashboard/header-footer", icon: PanelsTopLeft, allow: ["admin", "editor"] },
      
      { title: "Forms", url: "/dashboard/forms", icon: Inbox, allow: ["admin", "editor"] },
      { title: "Site Settings", url: "/dashboard/settings", icon: Settings, allow: ["admin"] },
      { title: "Branding", url: "/dashboard/branding", icon: Palette, allow: ["admin"] },

      { title: "Media Library", url: "/dashboard/media", icon: ImageIcon },

    ],
  },
  {
    label: "Post Types",
    items: [
      { title: "Blogs", url: "/dashboard/posts", icon: Newspaper },
      { title: "Case Studies", url: "/dashboard/case-studies", icon: BookMarked, allow: ["admin", "editor", "author"] },
      { title: "Events & Webinars", url: "/dashboard/events", icon: CalendarDays, allow: ["admin", "editor", "author"] },
      { title: "Categories", url: "/dashboard/taxonomy", icon: Tags, allow: ["admin", "editor", "author"] },
      { title: "Cards", url: "/dashboard/list-heros", icon: PanelsTopLeft, allow: ["admin", "editor"] },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Admin", url: "/dashboard/users", icon: Shield, allow: ["admin"] },

    ],
  },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { roles } = useRoles();
  const { data: branding } = useSiteBranding();

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const visibleGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => !i.allow || i.allow.some((r) => roles.includes(r as any)),
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
          {branding?.site_logo_url ? (
            <img
              src={branding.site_logo_url}
              alt={branding.site_title ?? "Site logo"}
              className="h-7 w-7 rounded-md object-contain"
            />
          ) : (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">
              {(branding?.site_title ?? "CMS").slice(0, 3).toUpperCase()}
            </span>
          )}
          <span className="truncate">{branding?.site_title ?? "Admin"}</span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        {visibleGroups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url, item.exact)}
                      tooltip={item.title}
                    >
                      <NavLink to={item.url} end={item.exact}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
