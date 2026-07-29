import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type PathRedirectRow = { old_slug: string; new_slug: string };

/** Normalise a stored/incoming URL to a comparable path: leading slash, no trailing slash, decoded. */
export function normalizePath(input: string): string {
  let value = (input ?? "").trim();
  if (!value) return "/";
  // Strip a full origin if the user pasted one (old site URLs).
  if (/^https?:\/\//i.test(value)) {
    try {
      const u = new URL(value);
      value = u.pathname + u.search;
    } catch {
      /* ignore */
    }
  }
  try {
    value = decodeURI(value);
  } catch {
    /* ignore */
  }
  if (!value.startsWith("/")) value = `/${value}`;
  value = value.replace(/\/+$/, "");
  return value.toLowerCase() || "/";
}

/** True when the target should be treated as an external URL. */
export function isExternalTarget(target: string): boolean {
  return /^https?:\/\//i.test((target ?? "").trim());
}

export function resolveRedirect(
  pathname: string,
  rows: PathRedirectRow[],
): string | null {
  const from = normalizePath(pathname);
  const hit = rows.find((r) => normalizePath(r.old_slug) === from);
  if (!hit) return null;
  const to = (hit.new_slug ?? "").trim();
  if (!to) return null;
  if (isExternalTarget(to)) return to;
  const target = normalizePath(to);
  return target === from ? null : target;
}

/** Applies dashboard-managed full-path redirects for any URL on the site. */
export function PathRedirect() {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const { data: rows = [] } = useQuery({
    queryKey: ["path_redirects"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<PathRedirectRow[]> => {
      const { data, error } = await supabase
        .from("slug_redirects")
        .select("old_slug,new_slug")
        .eq("entity_type", "path")
        .limit(1000);
      if (error) throw error;
      return (data ?? []) as PathRedirectRow[];
    },
  });

  useEffect(() => {
    if (pathname.startsWith("/dashboard")) return;
    const target = resolveRedirect(pathname, rows);
    if (!target) return;
    if (isExternalTarget(target)) {
      window.location.replace(target);
      return;
    }
    navigate(`${target}${search}${hash}`, { replace: true });
  }, [pathname, search, hash, rows, navigate]);

  return null;
}
