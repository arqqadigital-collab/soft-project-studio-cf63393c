import { useState } from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { MediaPickerDialog } from "@/components/dashboard/MediaPickerDialog";
import { sanitizeHtml } from "@/lib/sanitize";
import { PAGE_CONTENT_SECTION_DEFS } from "@/lib/contentSections";

function MediaField({
  label, value, onChange, accept,
}: {
  label: string;
  value: string;
  onChange: (url: string, kind?: string) => void;
  accept?: "image" | "video" | "image|video";
}) {
  const [open, setOpen] = useState(false);
  const isVideo = /\.(mp4|webm|mov)$/i.test(value);
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-3">
        {value ? (
          isVideo ? (
            <video src={value} className="h-14 w-24 rounded border object-cover" muted autoPlay loop playsInline />
          ) : (
            <img src={value} alt="" className="h-14 w-24 rounded border object-cover" />
          )
        ) : (
          <div className="flex h-14 w-24 items-center justify-center rounded border bg-muted text-muted-foreground">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>Choose</Button>
          {value && <Button size="sm" variant="ghost" onClick={() => onChange("")}>Clear</Button>}
        </div>
      </div>
      <MediaPickerDialog
        open={open}
        onOpenChange={setOpen}
        onPick={(m: any) => {
          const kind = m.file_type?.startsWith("video") ? "video" : "image";
          onChange(m.file_url, kind);
        }}
      />
    </div>
  );
}


// ---- Types ----
export type SectionKind =
  | "hero" | "features" | "stats" | "cta" | "media" | "logos" | "faq"
  // Product/service page content kinds (registered from contentSections.tsx)
  | "Hero" | "Introduction" | "The Problem" | "The Platform"
  | "How It Works" | "Patient Journey" | "Outcomes" | "Integrations" | "FAQ" | "Final CTA";

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
  const style = sectionStyle(data);
  const bgClass = data.bgColor ? "" : "bg-[var(--brand-dark)]";
  const txtClass = data.textColor ? "" : "text-white";
  const align = data.align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <section className={`relative overflow-hidden ${bgClass} ${txtClass}`} style={style}>
      {isVideo && (
        <video
          src={data.mediaUrl}
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!isVideo && data.mediaUrl && (
        <img src={data.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
      <Container className="relative py-28 md:py-40">
        <div className={`mx-auto flex max-w-5xl flex-col ${align}`}>
          {data.eyebrow && (
            <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
          )}
          <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
            {data.headline}
            {data.headlineAccent && (
              <>
                {" "}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: data.accentColor ? `linear-gradient(90deg, ${data.accentColor}, ${data.accentColor})` : "var(--gradient-brand)" }}>
                  {data.headlineAccent}
                </span>
              </>
            )}
          </h1>
          {data.subheadline && (
            <p className="mt-6 max-w-2xl text-lg opacity-90">{data.subheadline}</p>
          )}
          {(data.ctaLabel || data.ctaLabel2) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {data.ctaLabel && (
                <Button asChild size="lg" className="rounded-full" style={data.accentColor ? { background: data.accentColor, color: "#fff" } : { backgroundImage: "var(--gradient-brand)" }}>
                  <Link to={data.ctaHref || "#"}>{data.ctaLabel}</Link>
                </Button>
              )}
              {data.ctaLabel2 && (
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/15">
                  <Link to={data.ctaHref2 || "#"}>{data.ctaLabel2}</Link>
                </Button>
              )}
            </div>
          )}
          {Array.isArray(data.chips) && data.chips.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {data.chips.map((c: string, i: number) => (
                <span key={i} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs opacity-80 backdrop-blur">
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}


function HeroEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  const chipsStr = Array.isArray(data.chips) ? data.chips.join(", ") : (data.chips ?? "");
  return (
    <div className="space-y-3">
      <Field label="Eyebrow"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
      <Field label="Headline"><Input value={data.headline ?? ""} onChange={(e) => p({ headline: e.target.value })} /></Field>
      <Field label="Headline accent (gradient part, optional)"><Input value={data.headlineAccent ?? ""} onChange={(e) => p({ headlineAccent: e.target.value })} /></Field>
      <Field label="Sub-headline"><Textarea value={data.subheadline ?? ""} rows={3} onChange={(e) => p({ subheadline: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary CTA label"><Input value={data.ctaLabel ?? ""} onChange={(e) => p({ ctaLabel: e.target.value })} /></Field>
        <Field label="Primary CTA link"><Input value={data.ctaHref ?? ""} onChange={(e) => p({ ctaHref: e.target.value })} /></Field>
        <Field label="Secondary CTA label"><Input value={data.ctaLabel2 ?? ""} onChange={(e) => p({ ctaLabel2: e.target.value })} /></Field>
        <Field label="Secondary CTA link"><Input value={data.ctaHref2 ?? ""} onChange={(e) => p({ ctaHref2: e.target.value })} /></Field>
      </div>
      <Field label="Trust chips (comma-separated)">
        <Input
          value={chipsStr}
          onChange={(e) => p({ chips: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
          placeholder="300+ Hospitals, HL7 FHIR & DICOM Native, Cloud & On-Premise"
        />
      </Field>
      <Field label="Alignment">
        <select
          value={data.align ?? "center"}
          onChange={(e) => p({ align: e.target.value })}
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
        </select>
      </Field>
      <MediaField
        label="Background media"
        value={data.mediaUrl ?? ""}
        onChange={(url, kind) => p({ mediaUrl: url, mediaKind: kind === "video" ? "video" : "image" })}
        accept="image|video"
      />
      <ColorFields data={data} onChange={onChange} showAccent />
    </div>
  );
}



function StatsRender({ data }: { data: SectionData }) {
  return (
    <section className={data.bgColor ? "py-20" : "bg-background py-20"} style={sectionStyle(data)}>
      <Container>
        {data.eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
        )}
        {data.heading && <h2 className="text-3xl font-bold md:text-4xl">{data.heading}</h2>}
        {data.subheading && <p className="mt-3 max-w-3xl text-lg opacity-80">{data.subheading}</p>}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data.items ?? []).map((s: any, i: number) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6" style={data.textColor ? { color: data.textColor } : undefined}>
              <div className="text-3xl font-bold md:text-4xl" style={{ color: data.accentColor || "hsl(var(--primary))" }}>{s.value}</div>
              <div className="mt-2 text-sm opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
        {data.footnote && (
          <p className="mt-6 text-sm italic opacity-70">{data.footnote}</p>
        )}
      </Container>
    </section>
  );
}

function StatsEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow (optional)"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <Field label="Sub-heading (optional)"><Textarea value={data.subheading ?? ""} rows={2} onChange={(e) => p({ subheading: e.target.value })} /></Field>
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
      <Field label="Footnote (optional)"><Textarea value={data.footnote ?? ""} rows={2} onChange={(e) => p({ footnote: e.target.value })} /></Field>
      <ColorFields data={data} onChange={onChange} showAccent />
    </div>
  );
}

function FeaturesRender({ data }: { data: SectionData }) {
  const isDark = data.bgColor && /^#(0|1|2)/i.test(data.bgColor);
  const cardCls = isDark
    ? "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur"
    : "rounded-2xl border border-border bg-background p-6 shadow-sm";
  return (
    <section className={data.bgColor ? "py-20" : "bg-muted/40 py-20"} style={sectionStyle(data)}>
      <Container>
        {data.eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
        )}
        {data.heading && <h2 className="text-3xl font-bold md:text-4xl">{data.heading}</h2>}
        {data.subheading && <p className="mt-3 max-w-3xl text-lg opacity-80">{data.subheading}</p>}
        {data.body && <p className="mt-3 max-w-3xl text-base opacity-80">{data.body}</p>}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(data.items ?? []).map((f: any, i: number) => (
            <div key={i} className={`${cardCls} overflow-hidden`} style={data.textColor ? { color: data.textColor } : undefined}>
              {f.image ? (
                <div className="-mx-6 -mt-6 mb-5 aspect-[16/10] overflow-hidden">
                  <img src={f.image} alt={f.title ?? ""} className="h-full w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: data.accentColor ? `${data.accentColor}20` : "hsl(var(--primary)/0.1)", color: data.accentColor || "hsl(var(--primary))" }}>
                  <IconByName name={f.icon} className="h-5 w-5" />
                </div>
              )}
              <h3 className={`${f.image ? "" : "mt-4"} text-lg font-semibold`}>{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{f.description ?? f.body}</p>
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
      <Field label="Eyebrow (optional)"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
      <Field label="Heading"><Input value={data.heading ?? ""} onChange={(e) => p({ heading: e.target.value })} /></Field>
      <Field label="Heading accent (gradient part, optional)"><Input value={data.headingAccent ?? ""} onChange={(e) => p({ headingAccent: e.target.value })} /></Field>
      <Field label="Sub-heading"><Textarea value={data.subheading ?? ""} rows={2} onChange={(e) => p({ subheading: e.target.value })} /></Field>
      <Field label="Body (optional)"><Textarea value={data.body ?? ""} rows={3} onChange={(e) => p({ body: e.target.value })} /></Field>
      <ListEditor
        label="Cards"
        items={data.items ?? []}
        empty={{ icon: "Sparkles", title: "", description: "", image: "" }}
        onChange={(items) => p({ items })}
        renderItem={(it: any, patch) => (
          <>
            <MediaField label="Image (optional — replaces icon)" value={it.image ?? ""} onChange={(url) => patch({ image: url })} accept="image" />
            <Field label="Icon (lucide name, used if no image)"><Input value={it.icon ?? ""} onChange={(e) => patch({ icon: e.target.value })} /></Field>
            <Field label="Title"><Input value={it.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
            <Field label="Description"><Textarea value={it.description ?? ""} rows={2} onChange={(e) => patch({ description: e.target.value })} /></Field>
          </>
        )}
      />
      <ListEditor
        label="Logo groups (optional — used for partner/integration blocks)"
        items={data.groups ?? []}
        empty={{ title: "", items: [] as Array<{ name: string; logo: string }> }}
        onChange={(groups) => p({ groups })}
        renderItem={(g: any, patch) => (
          <>
            <Field label="Group title"><Input value={g.title ?? ""} onChange={(e) => patch({ title: e.target.value })} /></Field>
            <ListEditor
              label="Logos"
              items={g.items ?? []}
              empty={{ name: "", logo: "" }}
              onChange={(items) => patch({ items })}
              renderItem={(it: any, ipatch) => (
                <>
                  <Field label="Name"><Input value={it.name ?? ""} onChange={(e) => ipatch({ name: e.target.value })} /></Field>
                  <MediaField label="Logo" value={it.logo ?? ""} onChange={(url) => ipatch({ logo: url })} accept="image" />
                </>
              )}
            />
          </>
        )}
      />
      <Field label="Footnote (optional)"><Textarea value={data.footnote ?? ""} rows={2} onChange={(e) => p({ footnote: e.target.value })} /></Field>
      <ColorFields data={data} onChange={onChange} showAccent />
    </div>
  );
}

function CtaRender({ data }: { data: SectionData }) {
  const hasCustomBg = !!data.bgColor;
  const bgClass = hasCustomBg ? "" : "bg-[var(--brand-dark)]";
  const txtClass = data.textColor ? "" : (hasCustomBg ? "" : "text-white");
  const hasMedia = !!data.mediaUrl;
  const isVideo = hasMedia && data.mediaKind === "video";
  return (
    <section className={`relative overflow-hidden py-20 ${bgClass} ${txtClass}`} style={sectionStyle(data)}>
      {isVideo && (
        <video src={data.mediaUrl} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-30" />
      )}
      {hasMedia && !isVideo && (
        <img src={data.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      )}
      {hasMedia && <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />}
      <Container className="relative">
        {data.eyebrow && (
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
        )}
        <h2 className="text-3xl font-bold md:text-4xl">{data.headline}</h2>
        {data.body && <p className="mt-4 max-w-3xl text-base leading-relaxed opacity-90">{data.body}</p>}
        {(data.primaryLabel || data.secondaryLabel) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {data.primaryLabel && (
              <Button asChild size="lg" style={data.accentColor ? { background: data.accentColor, color: "#fff" } : undefined}>
                <Link to={data.primaryHref || "#"}>{data.primaryLabel}</Link>
              </Button>
            )}
            {data.secondaryLabel && (
              <Button asChild size="lg" variant="outline" className={hasCustomBg ? "" : "border-white/40 bg-transparent text-white hover:bg-white/10"}>
                <Link to={data.secondaryHref || "#"}>{data.secondaryLabel}</Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}


function CtaEdit({ data, onChange }: { data: SectionData; onChange: (n: SectionData) => void }) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Eyebrow (optional)"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
      <Field label="Headline"><Input value={data.headline ?? ""} onChange={(e) => p({ headline: e.target.value })} /></Field>
      <Field label="Headline accent (gradient part, optional)"><Input value={data.headlineAccent ?? ""} onChange={(e) => p({ headlineAccent: e.target.value })} /></Field>
      <Field label="Body"><Textarea value={data.body ?? ""} rows={3} onChange={(e) => p({ body: e.target.value })} /></Field>
      <Field label="Body (second paragraph, optional)"><Textarea value={data.body2 ?? ""} rows={3} onChange={(e) => p({ body2: e.target.value })} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary label"><Input value={data.primaryLabel ?? ""} onChange={(e) => p({ primaryLabel: e.target.value })} /></Field>
        <Field label="Primary link"><Input value={data.primaryHref ?? ""} onChange={(e) => p({ primaryHref: e.target.value })} /></Field>
        <Field label="Secondary label"><Input value={data.secondaryLabel ?? ""} onChange={(e) => p({ secondaryLabel: e.target.value })} /></Field>
        <Field label="Secondary link"><Input value={data.secondaryHref ?? ""} onChange={(e) => p({ secondaryHref: e.target.value })} /></Field>
      </div>
      <Field label="Footnote (small italic text below buttons, optional)"><Textarea value={data.footnote ?? ""} rows={2} onChange={(e) => p({ footnote: e.target.value })} /></Field>
      <MediaField label="Background media (image or video)" value={data.mediaUrl ?? ""} onChange={(url, kind) => p({ mediaUrl: url, mediaKind: kind === "video" ? "video" : "image" })} accept="image|video" />
      <ColorFields data={data} onChange={onChange} showAccent />
    </div>
  );
}

function RichTextRender({ data }: { data: SectionData }) {
  return (
    <section className="bg-background py-16">
      <Container>
        <div
          className="prose prose-neutral max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html ?? "") }}
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
    <section className={data.bgColor ? "py-16" : "bg-background py-16"} style={sectionStyle(data)}>
      <Container>
        {data.mediaKind === "video" ? (
          <video src={data.mediaUrl} controls className="w-full rounded-2xl" />
        ) : (
          <img src={data.mediaUrl} alt={data.alt ?? ""} className="w-full rounded-2xl" />
        )}
        {data.caption && <p className="mt-3 text-center text-sm opacity-80">{data.caption}</p>}
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
      <ColorFields data={data} onChange={onChange} />
    </div>
  );
}

function LogosRender({ data }: { data: SectionData }) {
  const list = (data.items ?? data.logos ?? []) as any[];
  return (
    <section className={data.bgColor ? "py-16" : "bg-muted/40 py-16"} style={sectionStyle(data)}>
      <Container>
        {data.eyebrow && (
          <div className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
        )}
        {data.headline && <h2 className="text-center text-3xl font-bold md:text-4xl">{data.headline}</h2>}
        {data.heading && !data.headline && <h2 className="text-center text-xl font-semibold">{data.heading}</h2>}
        {data.body && <p className="mx-auto mt-3 max-w-3xl text-center text-base opacity-80">{data.body}</p>}
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {list.map((l: any, i: number) => {
            const src = l.logo || l.url || l.image;
            return (
              <div key={i} className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-border bg-white p-4 shadow-sm">
                {src ? (
                  <img src={src} alt={l.name ?? ""} className="max-h-12 max-w-full object-contain" loading="lazy" />
                ) : (
                  <div className="text-sm font-semibold text-foreground/60">{l.name}</div>
                )}
                {src && <span className="text-[11px] font-medium text-foreground/60">{l.name}</span>}
              </div>
            );
          })}
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
      <ColorFields data={data} onChange={onChange} />
    </div>
  );
}

function FaqRender({ data }: { data: SectionData }) {
  return (
    <section className={data.bgColor ? "py-20" : "bg-background py-20"} style={sectionStyle(data)}>
      <Container>
        {data.eyebrow && (
          <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] opacity-70">{data.eyebrow}</div>
        )}
        {data.heading && <h2 className="text-3xl font-bold md:text-4xl">{data.heading}</h2>}
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border">
          {(data.items ?? []).map((f: any, i: number) => (
            <details key={i} className="group p-6">
              <summary className="cursor-pointer list-none text-base font-semibold marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed opacity-80">{f.a}</p>
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
      <Field label="Eyebrow (optional)"><Input value={data.eyebrow ?? ""} onChange={(e) => p({ eyebrow: e.target.value })} /></Field>
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
      <ColorFields data={data} onChange={onChange} />
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

// Real brand colors used across the site (approximate hex of the OKLCH
// tokens defined in src/styles.css: --brand-blue, --brand-green, --brand-dark,
// --background). These are the ONLY colors editors should pick from so
// section backgrounds stay on-brand.
const BRAND_SWATCHES: { label: string; value: string }[] = [
  { label: "Brand blue", value: "#2b8fce" },
  { label: "Brand green", value: "#4bc16b" },
  { label: "Brand dark", value: "#101a33" },
  { label: "Page background", value: "#fafcfc" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "" },
];

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const norm = (value ?? "").toLowerCase();
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {BRAND_SWATCHES.map((s) => {
        const isActive = norm === s.value.toLowerCase();
        const isTransparent = s.value === "";
        return (
          <button
            key={s.label}
            type="button"
            title={s.label}
            onClick={() => onChange(s.value)}
            className={`h-8 w-8 rounded-md border transition-transform hover:scale-110 ${
              isActive ? "ring-2 ring-offset-2 ring-foreground" : "border-border"
            } ${isTransparent ? "bg-[conic-gradient(from_45deg,#ddd_25%,#fff_25%_50%,#ddd_50%_75%,#fff_75%)] bg-[length:8px_8px]" : ""}`}
            style={isTransparent ? undefined : { background: s.value }}
            aria-label={s.label}
          />
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground">{value || "transparent"}</span>
    </div>
  );
}

export function ColorFields({
  data, onChange, showAccent = false,
}: {
  data: SectionData;
  onChange: (n: SectionData) => void;
  showAccent?: boolean;
}) {
  const p = (patch: Partial<SectionData>) => onChange({ ...data, ...patch });
  return (
    <div className="mt-3 rounded-md border border-dashed border-border p-3">
      <div className="mb-2 text-xs font-medium text-muted-foreground">Colors</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Background"><ColorInput value={data.bgColor ?? ""} onChange={(v) => p({ bgColor: v })} /></Field>
        <Field label="Text"><ColorInput value={data.textColor ?? ""} onChange={(v) => p({ textColor: v })} /></Field>
        {showAccent && (
          <Field label="Accent"><ColorInput value={data.accentColor ?? ""} onChange={(v) => p({ accentColor: v })} /></Field>
        )}
      </div>
    </div>
  );
}

export function sectionStyle(data: SectionData): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (data.bgColor) s.background = data.bgColor;
  if (data.textColor) s.color = data.textColor;
  return s;
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
  ...(PAGE_CONTENT_SECTION_DEFS as Partial<Record<SectionKind, SectionDef>>),
} as Record<SectionKind, SectionDef>;

export const SECTION_KINDS: SectionKind[] = Object.keys(SECTION_REGISTRY) as SectionKind[];
