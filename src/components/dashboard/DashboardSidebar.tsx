import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileStack,
  Image as ImageIcon,
  Menu as MenuIcon,
  PanelsTopLeft,
  Settings,
  Newspaper,
  BookMarked,
  CalendarDays,
  Shield,
  ChevronDown,
  ChevronRight,
  Folder,
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavTree } from "@/lib/navTree";

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
      { title: "Pages", url: "/dashboard/pages", icon: FileStack, allow: ["admin", "editor"] },
      { title: "Menus", url: "/dashboard/menus", icon: MenuIcon, allow: ["admin", "editor"] },
      { title: "Header & Footer", url: "/dashboard/header-footer", icon: PanelsTopLeft, allow: ["admin", "editor"] },
      
      { title: "Site Settings", url: "/dashboard/settings", icon: Settings, allow: ["admin"] },
      { title: "Media Library", url: "/dashboard/media", icon: ImageIcon },
    ],
  },
  {
    label: "Post Types",
    items: [
      { title: "Blogs", url: "/dashboard/posts", icon: Newspaper },
      { title: "Case Studies", url: "/dashboard/case-studies", icon: BookMarked, allow: ["admin", "editor", "author"] },
      { title: "Events & Webinars", url: "/dashboard/events", icon: CalendarDays, allow: ["admin", "editor", "author"] },
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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { data: navTree = [] } = useNavTree();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

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

  const canManagePages = roles.includes("admin" as any) || roles.includes("editor" as any);
  const visibleNavGroups = navTree.filter((g) => g.is_visible);

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

        {canManagePages && visibleNavGroups.length > 0 && !collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Site Structure</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {visibleNavGroups.map((group) => {
                  const groupOpen = openGroups[group.id] ?? false;
                  const visibleSections = group.sections.filter((s) => s.is_visible);
                  return (
                    <SidebarMenuItem key={group.id}>
                      <SidebarMenuButton
                        onClick={() =>
                          setOpenGroups((s) => ({ ...s, [group.id]: !groupOpen }))
                        }
                        tooltip={group.label}
                      >
                        {groupOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="truncate">{group.label}</span>
                      </SidebarMenuButton>
                      {groupOpen && visibleSections.length > 0 && (
                        <SidebarMenuSub>
                          {visibleSections.map((section) => {
                            const secKey = `${group.id}:${section.id}`;
                            const secOpen = openSections[secKey] ?? false;
                            const publishedPages = section.pages.filter(
                              (p) => p.status === "published",
                            );
                            return (
                              <SidebarMenuSubItem key={section.id}>
                                <SidebarMenuSubButton
                                  onClick={() =>
                                    setOpenSections((s) => ({
                                      ...s,
                                      [secKey]: !secOpen,
                                    }))
                                  }
                                >
                                  {secOpen ? (
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  ) : (
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  )}
                                  <span className="truncate">{section.label}</span>
                                </SidebarMenuSubButton>
                                {secOpen && publishedPages.length > 0 && (
                                  <ul className="ml-4 mt-1 space-y-0.5 border-l border-sidebar-border/60 pl-2">
                                    {publishedPages.map((page) => (
                                      <li key={page.id}>
                                        <NavLink
                                          to={`/dashboard/pages/${page.id}`}
                                          className={({ isActive: a }) =>
                                            `flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
                                              a
                                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                                            }`
                                          }
                                        >
                                          <Folder className="h-3 w-3 shrink-0" />
                                          <span className="truncate">
                                            {page.nav_label || page.title}
                                          </span>
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>

  );
}
