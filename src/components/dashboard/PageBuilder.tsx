import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Copy, Languages, Sparkles, Loader2,
} from "lucide-react";
import { SECTION_REGISTRY, SECTION_KINDS, type SectionKind, type SectionDef } from "@/lib/pageSections";
import { PageDefaultsProvider } from "@/lib/contentSections";

type LocaleCode = "en" | "ar";
type Row = { id: string; kind: SectionKind; position: number; is_visible: boolean; data: any; translations: any };

function mergeDeep(base: any, over: any): any {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) {
    if (Array.isArray(base) && Array.isArray(over)) {
      return base.map((item, i) => (over[i] !== undefined ? mergeDeep(item, over[i]) : item));
    }
    return over ?? base;
  }
  if (typeof base === "object" && base !== null && typeof over === "object") {
    const out: any = { ...base };
    for (const k of Object.keys(over)) out[k] = mergeDeep(base?.[k], over[k]);
    return out;
  }
  return over ?? base;
}

export function PageBuilder({ pageId, pageSlug }: { pageId: string; pageSlug?: string }) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [translating, setTranslating] = useState(false);

  async function translateAll(missingOnly = false) {
    const msg = missingOnly
      ? "Translate only sections that are missing or incomplete in Arabic?"
      : "Auto-translate ALL sections on this page to Arabic? This will OVERWRITE any existing Arabic content for this page.";
    if (!confirm(msg)) return;
    setTranslating(true);
    const t = toast.loading(missingOnly ? "Filling missing Arabic…" : "Translating sections to Arabic…");
    try {
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { mode: "page", pageId, missingOnly },
      });
      if (error) {
        const detail = await (error as any)?.context?.text?.().catch(() => "");
        throw new Error(detail || (error as Error).message || "Edge function error");
      }
      const res = data as { ok: number; fail: number; total: number };
      toast.success(`Translated ${res.ok}/${res.total} sections${res.fail ? ` (${res.fail} failed)` : ""}`, { id: t });
      invalidate();
      setLocale("ar");
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed", { id: t });
    } finally {
      setTranslating(false);
    }
  }

  const q = useQuery({
    queryKey: ["page-sections-admin", pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_sections")
        .select("id, kind, position, is_visible, data, translations")
        .eq("page_id", pageId)
        .order("position");
      if (error) throw error;
      return data as Row[];
    },
  });

  const rows = q.data ?? [];

  function invalidate() {
    qc.invalidateQueries({ queryKey: ["page-sections-admin", pageId] });
    // Reader cache key is ["page-sections", slug, locale] — match any locale.
    qc.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "page-sections" &&
        (query.queryKey[1] === pageSlug || query.queryKey[1] === pageId),
    });
  }

  async function addSection(kind: SectionKind) {
    const def = SECTION_REGISTRY[kind];
    const { error } = await supabase.from("page_sections").insert({
      page_id: pageId,
      kind,
      position: rows.length,
      data: def.defaultData,
    });
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function updateEnglish(id: string, data: any) {
    const { error } = await supabase.from("page_sections").update({ data }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    invalidate();
  }

  async function updateTranslation(id: string, current: any, loc: LocaleCode, overlay: any) {
    const nextTranslations = { ...(current ?? {}), [loc]: overlay };
    const { error } = await supabase.from("page_sections").update({ translations: nextTranslations }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`${loc.toUpperCase()} translation saved`);
    invalidate();
  }

  async function toggleVisible(id: string, current: boolean) {
    const { error } = await supabase.from("page_sections").update({ is_visible: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function remove(id: string) {
    if (!confirm("Delete this section?")) return;
    const { error } = await supabase.from("page_sections").delete().eq("id", id);
    if (error) return toast.error(error.message);
    invalidate();
  }

  async function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= rows.length) return;
    const a = rows[idx], b = rows[target];
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("page_sections").update({ position: b.position }).eq("id", a.id),
      supabase.from("page_sections").update({ position: a.position }).eq("id", b.id),
    ]);
    if (e1 || e2) return toast.error((e1 || e2)!.message);
    invalidate();
  }

  return (
    <PageDefaultsProvider slug={pageSlug}><div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Sections</h3>
          <p className="text-xs text-muted-foreground">Add, reorder and edit the blocks that make up this page.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-md border border-border">
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold ${locale === "en" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
            >
              <Languages className="h-3.5 w-3.5" /> EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("ar")}
              className={`inline-flex items-center gap-1 border-s border-border px-3 py-1.5 text-xs font-semibold ${locale === "ar" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
            >
              AR — العربية
            </button>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => translateAll(true)}
            disabled={translating || rows.length === 0}
            title="Translate only sections whose Arabic is missing or incomplete"
          >
            {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
            Fill missing AR
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => translateAll(false)}
            disabled={translating || rows.length === 0}
            title="Auto-translate all sections on this page to Arabic (overwrites existing Arabic)"
          >
            {translating ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1 h-4 w-4" />}
            Translate to Arabic
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm"><Plus className="mr-1 h-4 w-4" /> Add section</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {SECTION_KINDS.map((k) => {
                const def = SECTION_REGISTRY[k];
                return (
                  <DropdownMenuItem key={k} onClick={() => addSection(k)}>
                    <div>
                      <div className="font-medium">{def.label}</div>
                      <div className="text-xs text-muted-foreground">{def.description}</div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {locale === "ar" && (
        <div className="rounded-md border border-amber-300/40 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Editing Arabic overlay. Fields you save here will show when a visitor picks العربية. Empty fields fall back to English. Use <b>Copy from English</b> to prefill this section, then translate.
        </div>
      )}

      {q.isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Loading sections…</div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No sections yet. Click <b>Add section</b> to build this page.
          </CardContent>
        </Card>
      ) : (
        <Tabs
          value={activeTab ?? rows[0].id}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-muted p-1">
            {rows.map((row) => {
              const def = SECTION_REGISTRY[row.kind];
              if (!def) return null;
              return (
                <TabsTrigger
                  key={row.id}
                  value={row.id}
                  className={`data-[state=active]:bg-background ${row.is_visible ? "" : "opacity-60"}`}
                >
                  {sectionDisplayName(row, def.label)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {rows.map((row, i) => {
            const def = SECTION_REGISTRY[row.kind];
            if (!def) return null;
            const arOverlay = (row.translations ?? {})[locale] ?? null;
            const initial = locale === "en" ? (row.data ?? {}) : mergeDeep(row.data ?? {}, arOverlay ?? {});
            return (
              <TabsContent key={row.id} value={row.id} className="mt-4">
                <Card className={row.is_visible ? "" : "opacity-60"}>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
                      <div className="text-sm font-semibold">
                        {sectionDisplayName(row, def.label)}
                        <span className="ml-2 text-xs font-normal uppercase tracking-wider text-muted-foreground/70">
                          {def.label} · {locale.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        {locale !== "en" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-xs"
                            onClick={async () => {
                              if (arOverlay && !confirm("Overwrite the existing Arabic overlay with the English content?")) return;
                              await updateTranslation(row.id, row.translations, locale, structuredClone(row.data ?? {}));
                            }}
                            title="Copy English content into this Arabic overlay so you can translate it"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copy from English
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, -1)} disabled={i === 0} title="Move left">
                          <ArrowUp className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => move(i, 1)} disabled={i === rows.length - 1} title="Move right">
                          <ArrowDown className="h-4 w-4 -rotate-90" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisible(row.id, row.is_visible)} title={row.is_visible ? "Hide" : "Show"}>
                          {row.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => remove(row.id)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <SectionEditForm
                      key={`${row.id}-${locale}`}
                      initial={initial}
                      onSave={(next) =>
                        locale === "en"
                          ? updateEnglish(row.id, next)
                          : updateTranslation(row.id, row.translations, locale, next)
                      }
                      def={def}
                      locale={locale}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div></PageDefaultsProvider>
  );
}

function sectionDisplayName(row: Row, fallback: string) {
  const d = row.data ?? {};
  return d.section_name || d.eyebrow || d.heading || d.headline || d.title || fallback;
}

function collectImages(data: any): string[] {
  const out = new Set<string>();
  const walk = (v: any) => {
    if (!v) return;
    if (typeof v === "string") {
      if (/^(https?:|\/|data:image)/.test(v) && /\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(v)) {
        out.add(v);
      }
      return;
    }
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      for (const k of Object.keys(v)) {
        if (/(url|logo|image|src|thumb|cover|media)/i.test(k) && typeof v[k] === "string" && v[k]) {
          out.add(v[k]);
        } else {
          walk(v[k]);
        }
      }
    }
  };
  walk(data);
  return Array.from(out).filter((u) => !/\.(mp4|webm|mov)(\?|$)/i.test(u));
}

function SectionEditForm({
  initial, onSave, def, locale,
}: {
  initial: any;
  onSave: (next: any) => void;
  def: SectionDef;
  locale: LocaleCode;
}) {
  const [draft, setDraft] = useState(initial);
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const Edit = def.Edit;
  const images = useMemo(() => collectImages(draft), [draft]);
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <label className="text-xs font-medium text-muted-foreground">
          Section name (dashboard label){locale !== "en" ? ` — ${locale.toUpperCase()}` : ""}
        </label>
        <input
          type="text"
          value={draft.section_name ?? ""}
          onChange={(e) => setDraft({ ...draft, section_name: e.target.value })}
          placeholder={def.label}
          className="mt-1 w-full rounded border border-border bg-background px-2 py-1 text-sm"
        />
      </div>
      <Edit data={draft} onChange={setDraft} />
      {images.length > 0 && (
        <div className="rounded-md border border-border">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            Images used in this section ({images.length})
          </div>
          <div className="grid grid-cols-4 gap-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
            {images.map((u) => (
              <a key={u} href={u} target="_blank" rel="noreferrer" className="block">
                <img src={u} alt="" className="h-16 w-full rounded border object-cover" />
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={() => setDraft(initial)} disabled={!dirty}>Reset</Button>
        <Button size="sm" onClick={() => onSave(draft)} disabled={!dirty}>
          Save {locale !== "en" ? `(${locale.toUpperCase()})` : ""}
        </Button>
      </div>
    </div>
  );
}
