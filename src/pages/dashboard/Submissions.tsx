import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Download, RefreshCw, Mail, Archive, CheckCircle2, Inbox, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  consent: boolean;
  source: string;
  status: string;
  page_path: string | null;
  page_title: string | null;
  user_agent: string | null;
  custom_data: Record<string, any> | null;
};

const SOURCES = [
  { value: "all", label: "All sources" },
  { value: "contact_form", label: "Contact form" },
  { value: "footer_cta", label: "Footer CTA" },
];

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

const PAGE_SIZE = 50;

function sourceLabel(s: string) {
  return SOURCES.find((x) => x.value === s)?.label ?? s;
}

function toCsv(rows: Row[]) {
  const cols: (keyof Row)[] = [
    "created_at",
    "name",
    "email",
    "phone",
    "area",
    "source",
    "status",
    "page_path",
    "page_title",
    "message",
  ];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return `"${s.replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  };
  const header = cols.join(",");
  const body = rows.map((r) => cols.map((c) => escape(r[c])).join(",")).join("\n");
  return header + "\n" + body;
}

export default function Submissions() {
  const qc = useQueryClient();
  const [source, setSource] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState("all");
  const [search, setSearch] = useState("");
  const [pageNum, setPageNum] = useState(0);
  const [selected, setSelected] = useState<Row | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["submissions", source, status, page, search, pageNum],
    queryFn: async () => {
      let q = supabase
        .from("contact_submissions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + PAGE_SIZE - 1);
      if (source !== "all") q = q.eq("source", source);
      if (status !== "all") q = q.eq("status", status);
      if (page !== "all") q = q.eq("page_path", page);
      if (search.trim()) {
        const s = `%${search.trim()}%`;
        q = q.or(`name.ilike.${s},email.ilike.${s},message.ilike.${s}`);
      }
      const { data, error, count } = await q;
      if (error) throw error;
      return { rows: (data ?? []) as Row[], count: count ?? 0 };
    },
  });

  const { data: pageOptions } = useQuery({
    queryKey: ["submissions-page-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("page_path")
        .not("page_path", "is", null)
        .order("page_path")
        .limit(500);
      if (error) throw error;
      const set = new Set<string>();
      (data ?? []).forEach((r) => r.page_path && set.add(r.page_path));
      return Array.from(set).sort();
    },
  });

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const stats = useMemo(() => {
    return {
      total,
      shown: rows.length,
    };
  }, [rows.length, total]);

  async function setStatusFor(id: string, next: string) {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: next })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Marked as ${next}`);
    await qc.invalidateQueries({ queryKey: ["submissions"] });
    if (selected?.id === id) setSelected({ ...selected, status: next });
  }

  async function deleteSubmission(id: string) {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Submission deleted");
    setToDelete(null);
    if (selected?.id === id) setSelected(null);
    await qc.invalidateQueries({ queryKey: ["submissions"] });
  }

  function exportCsv() {
    if (!rows.length) {
      toast.info("Nothing to export");
      return;
    }
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Inbox className="h-6 w-6" /> Submissions
          </h1>
          <p className="text-sm text-muted-foreground">
            All form submissions from the Contact page and the Footer CTA. {stats.total} total.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={exportCsv}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Source</label>
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setPageNum(0);
            }}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {SOURCES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Status</label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPageNum(0);
            }}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {STATUSES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Page</label>
          <select
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
              setPageNum(0);
            }}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All pages</option>
            {(pageOptions ?? []).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground">Search</label>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageNum(0);
            }}
            placeholder="name, email, message…"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Page</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No submissions match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t hover:bg-muted/40 cursor-pointer"
                    onClick={() => setSelected(r)}
                  >
                    <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 font-medium">{r.name}</td>
                    <td className="px-3 py-2">
                      <a
                        href={`mailto:${r.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-primary hover:underline"
                      >
                        {r.email}
                      </a>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={r.source === "contact_form" ? "secondary" : "default"}>
                        {sourceLabel(r.source)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 max-w-[240px] truncate text-xs text-muted-foreground">
                      {r.page_title || r.page_path || "—"}
                      {r.page_title && r.page_path && (
                        <div className="truncate text-[10px] opacity-70">{r.page_path}</div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={
                          r.status === "new"
                            ? "default"
                            : r.status === "archived"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(r);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToDelete(r);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div>
            Page {pageNum + 1} of {totalPages} · Showing {rows.length} of {total}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={pageNum === 0}
              onClick={() => setPageNum((n) => Math.max(0, n - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pageNum + 1 >= totalPages}
              onClick={() => setPageNum((n) => n + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>
                  {new Date(selected.created_at).toLocaleString()} ·{" "}
                  {sourceLabel(selected.source)}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 text-sm">
                <Field label="Email">
                  <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
                    {selected.email}
                  </a>
                </Field>
                {selected.phone && <Field label="Phone">{selected.phone}</Field>}
                {selected.area && <Field label="Area / interest">{selected.area}</Field>}
                <Field label="Page">
                  <div className="space-y-0.5">
                    <div>{selected.page_title || "—"}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {selected.page_path || "—"}
                    </div>
                  </div>
                </Field>
                <Field label="Message">
                  <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">
                    {selected.message || "—"}
                  </div>
                </Field>
                {selected.custom_data && Object.keys(selected.custom_data).length > 0 && (
                  <Field label="Additional fields">
                    <div className="space-y-2">
                      {Object.entries(selected.custom_data).map(([k, v]) => (
                        <div key={k} className="rounded-md border bg-muted/30 p-2">
                          <div className="text-xs font-mono text-muted-foreground">{k}</div>
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {typeof v === "boolean" ? (v ? "✓ Yes" : "✗ No") : String(v ?? "—")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Field>
                )}
                <Field label="Status">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={selected.status === "read" ? "default" : "outline"}
                      onClick={() => setStatusFor(selected.id, "read")}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Mark read
                    </Button>
                    <Button
                      size="sm"
                      variant={selected.status === "archived" ? "default" : "outline"}
                      onClick={() => setStatusFor(selected.id, "archived")}
                    >
                      <Archive className="h-4 w-4" /> Archive
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStatusFor(selected.id, "new")}
                    >
                      Reset
                    </Button>
                  </div>
                </Field>
                <div className="pt-2 space-y-2">
                  <a href={`mailto:${selected.email}`}>
                    <Button className="w-full">
                      <Mail className="h-4 w-4" /> Reply via email
                    </Button>
                  </a>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setToDelete(selected)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete submission
                  </Button>
                </div>
                {selected.user_agent && (
                  <Field label="User agent">
                    <div className="break-all font-mono text-[10px] text-muted-foreground">
                      {selected.user_agent}
                    </div>
                  </Field>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the submission from {toDelete?.name || "—"} ({toDelete?.email || "—"}). This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => toDelete && deleteSubmission(toDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
