import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import {
  Activity,
  UserPlus,
  ShieldCheck,
  Trash2,
  Filter as FilterIcon,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

type AuditRow = {
  id: string;
  actor_id: string | null;
  action: string;
  target_user_id: string | null;
  metadata: Record<string, any> | null;
  ip: string | null;
  created_at: string;
};

type Profile = { id: string; full_name: string | null; avatar_url: string | null };

const ACTION_META: Record<string, { label: string; icon: any; tone: string }> = {
  invite:   { label: "Invited user",   icon: UserPlus,    tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  set_role: { label: "Changed role",   icon: ShieldCheck, tone: "bg-blue-500/15 text-blue-700 dark:text-blue-300" },
  delete:   { label: "Deleted user",   icon: Trash2,      tone: "bg-red-500/15 text-red-700 dark:text-red-300" },
};

function actionDetail(row: AuditRow): string {
  const m = row.metadata ?? {};
  switch (row.action) {
    case "invite":   return m.email ? `${m.email}${m.role ? ` · ${m.role}` : ""}` : "";
    case "set_role": return [m.previous_role, m.new_role].filter(Boolean).join(" → ");
    case "delete":   return m.email ?? "";
    default:         return Object.keys(m).length ? JSON.stringify(m) : "";
  }
}

export default function ActivityLog() {
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<AuditRow | null>(null);

  const logs = useQuery({
    queryKey: ["admin-audit-log", actionFilter],
    queryFn: async (): Promise<AuditRow[]> => {
      let q = supabase
        .from("admin_audit_log")
        .select("id, actor_id, action, target_user_id, metadata, ip, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (actionFilter !== "all") q = q.eq("action", actionFilter);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as AuditRow[];
    },
  });

  const userIds = useMemo(() => {
    const s = new Set<string>();
    for (const r of logs.data ?? []) {
      if (r.actor_id) s.add(r.actor_id);
      if (r.target_user_id) s.add(r.target_user_id);
    }
    return Array.from(s);
  }, [logs.data]);

  const profiles = useQuery({
    queryKey: ["audit-profiles", userIds],
    enabled: userIds.length > 0,
    queryFn: async (): Promise<Record<string, Profile>> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", userIds);
      if (error) throw error;
      const map: Record<string, Profile> = {};
      for (const p of data ?? []) map[p.id] = p as Profile;
      return map;
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs.data ?? [];
    return (logs.data ?? []).filter((r) => {
      const actor = r.actor_id ? profiles.data?.[r.actor_id]?.full_name ?? "" : "";
      const target = r.target_user_id ? profiles.data?.[r.target_user_id]?.full_name ?? "" : "";
      const detail = JSON.stringify(r.metadata ?? {}).toLowerCase();
      return (
        r.action.includes(q) ||
        actor.toLowerCase().includes(q) ||
        target.toLowerCase().includes(q) ||
        detail.includes(q) ||
        (r.ip ?? "").includes(q)
      );
    });
  }, [logs.data, profiles.data, search]);

  const renderUser = (id: string | null) => {
    if (!id) return <span className="text-muted-foreground">System</span>;
    const p = profiles.data?.[id];
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={p?.avatar_url ?? undefined} />
          <AvatarFallback className="text-[10px]">
            {(p?.full_name ?? id).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm">{p?.full_name ?? id.slice(0, 8)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold">
            <Activity className="h-6 w-6" /> Activity Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Every admin action on users and roles, most recent first.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => logs.refetch()}>
          <RefreshCw className="mr-1 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <FilterIcon className="h-4 w-4" /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="invite">Invitations</SelectItem>
                <SelectItem value="set_role">Role changes</SelectItem>
                <SelectItem value="delete">User deletions</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by user, email, IP, details…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {logs.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : logs.error ? (
            <p className="text-sm text-destructive">{(logs.error as any).message}</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity matches these filters.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const meta = ACTION_META[r.action] ?? {
                    label: r.action, icon: Activity, tone: "bg-muted text-foreground",
                  };
                  const Icon = meta.icon;
                  return (
                    <TableRow
                      key={r.id}
                      onClick={() => setDetail(r)}
                      className="cursor-pointer"
                    >
                      <TableCell className="whitespace-nowrap">
                        <div className="text-sm">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {format(new Date(r.created_at), "PPp")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 border-0 ${meta.tone}`}>
                          <Icon className="h-3 w-3" /> {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{renderUser(r.actor_id)}</TableCell>
                      <TableCell>{renderUser(r.target_user_id)}</TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {actionDetail(r)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.ip ?? "—"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Event details</DialogTitle>
          </DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Time:</span> {format(new Date(detail.created_at), "PPpp")}</div>
              <div><span className="text-muted-foreground">Action:</span> {detail.action}</div>
              <div><span className="text-muted-foreground">Actor:</span> {detail.actor_id ?? "system"}</div>
              <div><span className="text-muted-foreground">Target:</span> {detail.target_user_id ?? "—"}</div>
              <div><span className="text-muted-foreground">IP:</span> {detail.ip ?? "—"}</div>
              <div>
                <div className="mb-1 text-muted-foreground">Metadata</div>
                <pre className="max-h-64 overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
{JSON.stringify(detail.metadata ?? {}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
