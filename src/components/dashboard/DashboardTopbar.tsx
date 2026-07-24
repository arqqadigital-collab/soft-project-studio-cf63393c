import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  LogOut,
  Search,
  User as UserIcon,
  ExternalLink,
  LayoutDashboard,
  FileStack,
  PanelsTopLeft,
  Inbox,
  Settings,
  Palette,
  Image as ImageIcon,
  Newspaper,
  BookMarked,
  CalendarDays,
  Tags,
  Shield,
  FileText,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-role";
import { supabase } from "@/integrations/supabase/client";

type SearchItem = {
  title: string;
  url: string;
  group: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string;
};

const searchIndex: SearchItem[] = [
  { title: "Dashboard", url: "/dashboard", group: "Content", icon: LayoutDashboard, keywords: "home overview" },
  { title: "Pages & Navigation", url: "/dashboard/pages", group: "Content", icon: FileStack, keywords: "menu routes seo" },
  { title: "Header & Footer", url: "/dashboard/header-footer", group: "Content", icon: PanelsTopLeft, keywords: "cta topbar" },
  { title: "Forms", url: "/dashboard/forms", group: "Content", icon: Inbox, keywords: "submissions contact fields" },
  { title: "Site Settings", url: "/dashboard/settings", group: "Content", icon: Settings },
  { title: "Branding", url: "/dashboard/branding", group: "Content", icon: Palette, keywords: "logo colors" },
  { title: "Media Library", url: "/dashboard/media", group: "Content", icon: ImageIcon, keywords: "images files upload" },
  { title: "Blogs", url: "/dashboard/posts", group: "Post Types", icon: Newspaper, keywords: "posts articles" },
  { title: "Case Studies", url: "/dashboard/case-studies", group: "Post Types", icon: BookMarked },
  { title: "Events & Webinars", url: "/dashboard/events", group: "Post Types", icon: CalendarDays },
  { title: "Categories", url: "/dashboard/taxonomy", group: "Post Types", icon: Tags, keywords: "taxonomy" },
  { title: "Cards", url: "/dashboard/list-heros", group: "Post Types", icon: PanelsTopLeft, keywords: "list page heros" },
  { title: "Admin", url: "/dashboard/users", group: "Administration", icon: Shield, keywords: "users roles" },
  { title: "Profile", url: "/dashboard/profile", group: "Account", icon: UserIcon },
];

export function DashboardTopbar() {
  const { user } = useAuth();
  const { highest } = useRoles();
  const navigate = useNavigate();
  const initials = (user?.email?.[0] ?? "U").toUpperCase();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, SearchItem[]>();
    for (const item of searchIndex) {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    }
    return Array.from(map.entries());
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  function go(url: string) {
    setOpen(false);
    navigate(url);
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
      <SidebarTrigger />
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative hidden max-w-md flex-1 md:block"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          readOnly
          placeholder="Search dashboard..."
          className="cursor-pointer pl-9 pr-16"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.open("/", "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">View site</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left text-xs leading-tight md:block">
                <div className="font-medium">{user?.email}</div>
                <div className="text-muted-foreground capitalize">{highest ?? "—"}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard/profile")}>
              <UserIcon className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, forms, media, posts…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {grouped.map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((item) => (
                <CommandItem
                  key={item.url}
                  value={`${item.title} ${item.keywords ?? ""} ${item.group}`}
                  onSelect={() => go(item.url)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
