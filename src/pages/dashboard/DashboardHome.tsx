import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, FileStack, Image, Users, Plus, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getBuiltinMedia } from "@/lib/builtinMedia";
import { useSiteBranding } from "@/hooks/use-site-branding";

function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: any }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  const { data: branding } = useSiteBranding();
  const counts = useQuery({
    queryKey: ["dashboard-counts"],
    queryFn: async () => {
      const [posts, pages, users, media, categories, views] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("pages").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("media").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("page_views").select("id", { count: "exact", head: true }),
      ]);
      const builtinCount = getBuiltinMedia().length;
      return {
        posts: posts.count ?? 0,
        pages: pages.count ?? 0,
        users: users.count ?? 0,
        media: (media.count ?? 0) + builtinCount,
        categories: categories.count ?? 0,
        views: views.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["dashboard-recent-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, status, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {branding?.site_logo_url ? (
            <img
              src={branding.site_logo_url}
              alt={branding.site_title ?? "Site logo"}
              className="h-12 w-12 rounded-xl object-contain shadow-sm"
            />
          ) : (
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-sm">
              {(branding?.site_title ?? "CMS").slice(0, 3).toUpperCase()}
            </span>
          )}
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back — here's what's happening.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/dashboard/posts/new"><Plus className="mr-1 h-4 w-4" /> New Post</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard/pages/new"><Plus className="mr-1 h-4 w-4" /> New Page</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Posts" value={counts.data?.posts ?? "—"} icon={FileText} />
        <StatCard label="Pages" value={counts.data ? (counts.data.pages + 1) : "—"} icon={FileStack} />
        <StatCard label="Users" value={counts.data?.users ?? "—"} icon={Users} />
        <StatCard label="Media" value={counts.data?.media ?? "—"} icon={Image} />
        <StatCard label="Page views" value={counts.data?.views ?? "—"} icon={Eye} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent activity</CardTitle>
          {recent.data?.length ? (
            <span className="text-xs text-muted-foreground">{recent.data.length} posts</span>
          ) : null}
        </CardHeader>
        <CardContent>
          {recent.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !recent.data?.length ? (
            <p className="text-sm text-muted-foreground">No posts yet.</p>
          ) : (
            <ul className="max-h-[480px] divide-y divide-border overflow-y-auto pr-1">
              {recent.data.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <Link to={`/dashboard/posts/${p.id}`} className="truncate font-medium hover:underline">
                    {p.title}
                  </Link>
                  <div className="ml-4 flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{p.status}</span>
                    <span>{formatDistanceToNow(new Date(p.updated_at), { addSuffix: true })}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
