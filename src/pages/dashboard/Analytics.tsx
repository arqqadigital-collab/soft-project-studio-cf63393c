import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

type Range = 7 | 30 | 90;

export default function Analytics() {
  const [range, setRange] = useState<Range>(30);
  const since = useMemo(() => subDays(startOfDay(new Date()), range).toISOString(), [range]);

  const viewsQ = useQuery({
    queryKey: ["analytics-views", range],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("viewed_at, entity_type, entity_id")
        .gte("viewed_at", since)
        .limit(10000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const titlesQ = useQuery({
    queryKey: ["analytics-titles"],
    queryFn: async () => {
      const [posts, pages] = await Promise.all([
        supabase.from("posts").select("id, title"),
        supabase.from("pages").select("id, title"),
      ]);
      const map = new Map<string, string>();
      posts.data?.forEach((p) => map.set(`post:${p.id}`, p.title));
      pages.data?.forEach((p) => map.set(`page:${p.id}`, p.title));
      return map;
    },
  });

  const total = viewsQ.data?.length ?? 0;

  const daily = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = range - 1; i >= 0; i--) {
      buckets.set(format(subDays(new Date(), i), "MMM d"), 0);
    }
    viewsQ.data?.forEach((v) => {
      const key = format(new Date(v.viewed_at), "MMM d");
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    return Array.from(buckets.entries()).map(([date, views]) => ({ date, views }));
  }, [viewsQ.data, range]);

  const top = (type: "post" | "page") => {
    const counts = new Map<string, number>();
    viewsQ.data?.forEach((v) => {
      if (v.entity_type !== type) return;
      counts.set(v.entity_id, (counts.get(v.entity_id) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id, views]) => ({
        name: titlesQ.data?.get(`${type}:${id}`) ?? id.slice(0, 6),
        views,
      }));
  };

  const topPosts = useMemo(() => top("post"), [viewsQ.data, titlesQ.data]);
  const topPages = useMemo(() => top("page"), [viewsQ.data, titlesQ.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-muted-foreground">Page views across the site.</p>
        </div>
        <Tabs value={String(range)} onValueChange={(v) => setRange(Number(v) as Range)}>
          <TabsList>
            <TabsTrigger value="7">7d</TabsTrigger>
            <TabsTrigger value="30">30d</TabsTrigger>
            <TabsTrigger value="90">90d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total views</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Avg / day</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{Math.round(total / range)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Range</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-semibold">{range} days</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Views over time</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 6,
                }}
              />
              <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Top posts</CardTitle></CardHeader>
          <CardContent className="h-64">
            {topPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPosts} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={140} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top pages</CardTitle></CardHeader>
          <CardContent className="h-64">
            {topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPages} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={140} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6 }} />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
