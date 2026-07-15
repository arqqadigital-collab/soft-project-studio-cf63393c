import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FileStack,
  Home,
  Image,
  Tags,
  Users,
  Search,
  BarChart3,
  Settings,
  User as UserIcon,
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

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, exact: true, allow: null },
  { title: "Homepage", url: "/dashboard/homepage", icon: Home, allow: ["admin", "editor"] as const },
  { title: "Posts", url: "/dashboard/posts", icon: FileText, allow: null },
  { title: "Pages", url: "/dashboard/pages", icon: FileStack, allow: ["admin", "editor"] as const },
  { title: "Media", url: "/dashboard/media", icon: Image, allow: null },
  { title: "Categories & Tags", url: "/dashboard/taxonomy", icon: Tags, allow: ["admin", "editor", "author"] as const },
  { title: "Users", url: "/dashboard/users", icon: Users, allow: ["admin"] as const },
  { title: "SEO", url: "/dashboard/seo", icon: Search, allow: ["admin", "editor"] as const },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3, allow: ["admin", "editor"] as const },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, allow: ["admin"] as const },
  { title: "Profile", url: "/dashboard/profile", icon: UserIcon, allow: null },
];

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const { roles } = useRoles();

  const visible = items.filter(
    (i) => !i.allow || i.allow.some((r) => roles.includes(r as any)),
  );

  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-3">
        <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">
            CMS
          </span>
          <span className="truncate">Admin</span>
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}
