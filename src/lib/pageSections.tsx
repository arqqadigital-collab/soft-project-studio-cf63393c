import { lazy, Suspense } from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus } from "lucide-react";
import { MediaField } from "@/components/dashboard/SectionEditor";

// ---- Types ----
export type SectionKind =
  | "hero" | "features" | "stats" | "cta" | "richtext" | "media" | "logos" | "faq";

export type SectionData = Record<string, any>;

export type SectionDef = {
  kind: SectionKind;
  label: string;
  description: string;
  defaultData: SectionData;
  Render: React.ComponentType<{ data: SectionData }>;
  Edit: React.ComponentType<{ data: SectionData; onChange: (next: SectionData) => void }>;
};

// ---- Helpers ----
function IconByName({ name, className }: { name?: string; className?: string }) {
  const C = (name && (Icons as any)[name]) || Icons.Sparkles;
  return <C className={className} />;
}

function ListEditor<T extends Record<string, any>>({
  label, items, onChange, empty, renderItem,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  empty: T;
  renderItem: (item: T, patch: (p: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs">{label}</Label>
        <Button size="sm" variant="outline" onClick={() => onChange([...(items ?? []), empty])}>
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      <div className="space-y-3">
        {(items ?? []).map((it, i) => (
          <div key={i} className="space-y-2 rounded-md border border-border p-3">
            {renderItem(it, (p) => {
              const next = items.slice();
              next[i] = { ...next[i], ...p };
              onChange(next);
            })}
            <div className="flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Renderers ----
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-6 ${className}`}>{children}</div>;
}

function HeroRender({ data }: { data: SectionData }) {
  const isVideo = data.mediaKind === "video" && data.mediaUrl;
  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] text-white">
      {isVideo && (
        <video
          src={data.mediaUrl}
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      {!isVideo && data.mediaUrl && (
        <img src={data.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
      <Container className="relative py-28 md:py-40">
        {data.eyebrow && (
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{data.eyebrow}</div>
        )}
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">{data.headline}</h1>
        {data.subheadline && (
          <p className="mt-6 max-w-2xl text-lg text-white/85">{data.subheadline}</p>
        )}
        {data.ctaLabel && (
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to={data.ctaHref || "#"}>{data.ctaLabel}</Link>
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

function HeroEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
      <Field label="Headline"><Input value={data.headline ?? ""} onChange={(e) => p({ headline: e.target.value })} /></Field>
      <Field label="Sub-headline"><Textarea value={data.subheadline ?? ""} rows={3} onChange={(e) => p({ subheadline: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="CTA label"><Input value={data.ctaLabel ?? ""} onChange={(e) => p({ ctaLabel: e.target.value })} /></Field>
        <Field label="CTA link"><Input value={data.ctaHref ?? ""} onChange={(e) => p({ ctaHref: e.target.value })} /></Field>
      </div>
      <MediaField
        label="Background media"
        value={data.mediaUrl ?? ""}
        onChange={(url, kind) => p({ mediaUrl: url, mediaKind: kind === "video" ? "video" : "image" })}
        accept="image|video"
      />
    </div>
  );
}

function StatsRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-background py-20">
      <Container>
        {data.heading && <h2 className="text-3xl font-bold text-foreground md:text-4xl">{data.heading}</h2>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data.items ?? []).map((s: any, i: number) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-3xl font-bold text-primary md:text-4xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatsEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <ListEditor
        label="Stats"
        items={data.items ?? []}
        empty={{ value: "", label: "" }}
        onChange={(items) => p({ items })}
        renderItem={(it: any, patch) => (
          <>
            <Field label="Value"><Input value={it.value ?? ""} onChange={(e) => patch({ value: e.target.value })} /></Field>
            <Field label="Label"><Input value={it.label ?? ""} onChange={(e) => patch({ label: e.target.value })} /></Field>
          </>
        )}
      />
    </div>
  );
}

function FeaturesRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-muted/40 py-20">
      <Container>
        {data.heading && <h2 className="text-3xl font-bold text-foreground md:text-4xl">{data.heading}</h2>}
        {data.subheading && <p className="mt-3 max-w-3xl text-lg text-muted-foreground">{data.subheading}</p>}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data.items ?? []).map((f: any, i: number) => (
            <div key={i} className="rounded-2xl border border-border bg-background p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <IconByName name={f.icon} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturesEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <Field label="Sub-heading"><Textarea value={data.subheading ?? ""} rows={2} onChange={(e) => p({ subheading: e.target.value })} /></Field>
      <ListEditor
        label="Cards"
        items={data.items ?? []}
        empty={{ icon: "Sparkles", title: "", description: "" }}
        onChange={(items) => p({ items })}
        renderItem={(it: any, patch) => (
          <>
            <Field label="Icon (lucide name)"><Input value={it.icon ?? ""} onChange={(e) => patch({ icon: e.target.value })} /></Field>
            <Field label="Title"><Input value={it.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
            <Field label="Description"><Textarea value={it.description ?? ""} rows={2} onChange={(e) => patch({ description: e.target.value })} /></Field>
          </>
        )}
      />
    </div>
  );
}

function CtaRender({ data }: { data: SectionData }) {
  return (
    <section className="relative overflow-hidden bg-[var(--brand-dark)] py-20 text-white">
      {data.mediaUrl && (
        <video src={data.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-30" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      <Container className="relative">
        <h2 className="text-3xl font-bold md:text-4xl">{data.headline}</h2>
        {data.body && <p className="mt-3 max-w-2xl text-white/85">{data.body}</p>}
        <div className="mt-8 flex flex-wrap gap-3">
          {data.primaryLabel && (
            <Button asChild size="lg"><Link to={data.primaryHref || "#"}>{data.primaryLabel}</Link></Button>
          )}
          {data.secondaryLabel && (
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link to={data.secondaryHref || "#"}>{data.secondaryLabel}</Link>
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}

function CtaEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Headline"><Input value={data.headline ?? ""} onChange={(e) => p({ headline: e.target.value })} /></Field>
      <Field label="Body"><Textarea value={data.body ?? ""} rows={2} onChange={(e) => p({ body: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary label"><Input value={data.primaryLabel ?? ""} onChange={(e) => p({ primaryLabel: e.target.value })} /></Field>
        <Field label="Primary link"><Input value={data.primaryHref ?? ""} onChange={(e) => p({ primaryHref: e.target.value })} /></Field>
        <Field label="Secondary label"><Input value={data.secondaryLabel ?? ""} onChange={(e) => p({ secondaryLabel: e.target.value })} /></Field>
        <Field label="Secondary link"><Input value={data.secondaryHref ?? ""} onChange={(e) => p({ secondaryHref: e.target.value })} /></Field>
      </div>
      <MediaField label="Background media" value={data.mediaUrl ?? ""} onChange={(url) => p({ mediaUrl: url })} accept="image|video" />
    </div>
  );
}

function RichTextRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-background py-16">
      <Container>
        <div
          className="prose prose-neutral max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: data.html ?? "" }}
        />
      </Container>
    </section>
  );
}

function RichTextEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  return (
    <Field label="HTML content">
      <Textarea rows={8} value={data.html ?? ""} onChange={(e) => onChange({ ...data, html: e.target.value })} />
    </Field>
  );
}

function MediaRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-background py-16">
      <Container>
        {data.mediaKind === "video" ? (
          <video src={data.mediaUrl} controls className="w-full rounded-2xl" />
        ) : (
          <img src={data.mediaUrl} alt={data.alt ?? ""} className="w-full rounded-2xl" />
        )}
        {data.caption && <p className="mt-3 text-center text-sm text-muted-foreground">{data.caption}</p>}
      </Container>
    </section>
  );
}

function MediaEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <MediaField
        label="Media"
        value={data.mediaUrl ?? ""}
        onChange={(url, kind) => p({ mediaUrl: url, mediaKind: kind === "video" ? "video" : "image" })}
        accept="image|video"
      />
      <Field label="Caption"><Input value={data.caption ?? ""} onChange={(e) => p({ caption: e.target.value })} /></Field>
    </div>
  );
}

function LogosRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-muted/40 py-16">
      <Container>
        {data.heading && <h2 className="text-center text-xl font-semibold text-foreground">{data.heading}</h2>}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {(data.items ?? []).map((l: any, i: number) => (
            <div key={i} className="flex h-20 items-center justify-center rounded-xl bg-background p-4">
              <img src={l.logo} alt={l.name} className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function LogosEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <ListEditor
        label="Logos"
        items={data.items ?? []}
        empty={{ name: "", logo: "" }}
        onChange={(items) => p({ items })}
        renderItem={(it: any, patch) => (
          <>
            <Field label="Name"><Input value={it.name ?? ""} onChange={(e) => patch({ name: e.target.value })} /></Field>
            <MediaField label="Logo" value={it.logo ?? ""} onChange={(url) => patch({ logo: url })} accept="image" />
          </>
        )}
      />
    </div>
  );
}

function FaqRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-background py-20">
      <Container>
        {data.heading && <h2 className="text-3xl font-bold text-foreground md:text-4xl">{data.heading}</h2>}
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
          {(data.items ?? []).map((f: any, i: number) => (
            <details key={i} className="group p-6">
              <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FaqEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <ListEditor
        label="Questions"
        items={data.items ?? []}
        empty={{ q: "", a: "" }}
        onChange={(items) => p({ items })}
        renderItem={(it: any, patch) => (
          <>
            <Field label="Question"><Input value={it.q ?? ""} onChange={(e) => patch({ q: e.target.value })} /></Field>
            <Field label="Answer"><Textarea rows={3} value={it.a ?? ""} onChange={(e) => patch({ a: e.target.value })} /></Field>
          </>
        )}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}

// ---- Registry ----
export const SECTION_REGISTRY: Record<SectionKind, SectionDef> = {
  hero: {
    kind: "hero", label: "Hero", description: "Full-width headline with background media and CTA.",
    defaultData: { eyebrow: "", headline: "New hero", subheadline: "", ctaLabel: "", ctaHref: "", mediaUrl: "", mediaKind: "image" },
    Render: HeroRender, Edit: HeroEdit,
  },
  stats: {
    kind: "stats", label: "Stats", description: "Grid of numbers with labels.",
    defaultData: { heading: "By the numbers", items: [{ value: "99%", label: "Uptime" }] },
    Render: StatsRender, Edit: StatsEdit,
  },
  features: {
    kind: "features", label: "Features", description: "Card grid of features with icons.",
    defaultData: { heading: "Features", subheading: "", items: [{ icon: "Sparkles", title: "Feature", description: "" }] },
    Render: FeaturesRender, Edit: FeaturesEdit,
  },
  cta: {
    kind: "cta", label: "Call to action", description: "Bold banner with primary/secondary buttons.",
    defaultData: { headline: "Ready to start?", body: "", primaryLabel: "Contact us", primaryHref: "/contact", secondaryLabel: "", secondaryHref: "" },
    Render: CtaRender, Edit: CtaEdit,
  },
  richtext: {
    kind: "richtext", label: "Rich text", description: "Free HTML content block.",
    defaultData: { html: "<p>Write here...</p>" },
    Render: RichTextRender, Edit: RichTextEdit,
  },
  media: {
    kind: "media", label: "Media", description: "Standalone image or video with caption.",
    defaultData: { mediaUrl: "", mediaKind: "image", caption: "" },
    Render: MediaRender, Edit: MediaEdit,
  },
  logos: {
    kind: "logos", label: "Logo grid", description: "Row of partner or platform logos.",
    defaultData: { heading: "Trusted by", items: [] },
    Render: LogosRender, Edit: LogosEdit,
  },
  faq: {
    kind: "faq", label: "FAQ", description: "Expandable question/answer list.",
    defaultData: { heading: "FAQ", items: [{ q: "", a: "" }] },
    Render: FaqRender, Edit: FaqEdit,
  },
};

export const SECTION_KINDS: SectionKind[] = Object.keys(SECTION_REGISTRY) as SectionKind[];
