import { useEffect, useId, useSyncExternalStore } from "react";

export type FaqItem = { q: string; a: string };

const registry = new Map<string, FaqItem[]>();
const listeners = new Set<() => void>();
let snapshot: FaqItem[] = [];

function recompute() {
  const seen = new Set<string>();
  const out: FaqItem[] = [];
  for (const items of registry.values()) {
    for (const item of items) {
      const q = (item?.q ?? "").trim();
      const a = (item?.a ?? "").trim();
      if (!q || !a || seen.has(q)) continue;
      seen.add(q);
      out.push({ q, a });
    }
  }
  snapshot = out;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

/** Sanitize whatever a page/section passes in into `{ q, a }` pairs. */
export function normalizeFaqItems(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((it: any) => ({
      q: String(it?.q ?? it?.question ?? "").trim(),
      a: String(it?.a ?? it?.answer ?? "").trim(),
    }))
    .filter((it) => it.q && it.a);
}

/**
 * Registers FAQ items rendered by the current page so <FaqSchema> can emit
 * FAQPage JSON-LD. Unregisters automatically on unmount / navigation.
 */
export function useRegisterFaqItems(items: FaqItem[] | null | undefined) {
  const id = useId();
  const key = JSON.stringify(items ?? []);
  useEffect(() => {
    const parsed = normalizeFaqItems(items ?? []);
    if (parsed.length) registry.set(id, parsed);
    else registry.delete(id);
    recompute();
    return () => {
      registry.delete(id);
      recompute();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key]);
}

export function useFaqItems(): FaqItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
