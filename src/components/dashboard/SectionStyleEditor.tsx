import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BRAND_SWATCHES, GRADIENT_SWATCHES, DEFAULT_SECTION_STYLE, type SectionStyle } from "@/lib/sectionStyle";
import { RotateCcw } from "lucide-react";

type Props = {
  value: SectionStyle | null | undefined;
  onChange: (next: SectionStyle) => void;
};

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1 text-xs transition ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function ColorRow({
  label, value, onChange,
}: { label: string; value: string | undefined; onChange: (v: string) => void }) {
  const isTransparent = !value;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">{label}</Label>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Current</span>
          <span
            className={`h-5 w-5 rounded border border-border ${isTransparent ? "bg-[conic-gradient(from_45deg,#ddd_25%,#fff_25%_50%,#ddd_50%_75%,#fff_75%)] bg-[length:8px_8px]" : ""}`}
            style={isTransparent ? undefined : { background: value }}
            title={value || "transparent"}
          />
          <span className="w-16 text-right font-mono text-[10px] text-muted-foreground">{value || "—"}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {BRAND_SWATCHES.map((s) => {
          const active = (value ?? "").toLowerCase() === s.value.toLowerCase();
          const transparent = s.value === "";
          return (
            <button
              key={s.label}
              type="button"
              title={s.label}
              onClick={() => onChange(s.value)}
              className={`h-7 w-7 rounded-md border transition-transform hover:scale-110 ${
                active ? "ring-2 ring-offset-2 ring-foreground" : "border-border"
              } ${transparent ? "bg-[conic-gradient(from_45deg,#ddd_25%,#fff_25%_50%,#ddd_50%_75%,#fff_75%)] bg-[length:8px_8px]" : ""}`}
              style={transparent ? undefined : { background: s.value }}
              aria-label={s.label}
            />
          );
        })}
        <input
          type="color"
          value={value || "#ffffff"}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border border-border bg-transparent"
          title="Custom color"
        />
      </div>
    </div>
  );
}

function Group({
  label, options, value, onChange,
}: {
  label: string;
  options: { v: string; l: string }[];
  value: string | undefined;
  onChange: (v: any) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Chip key={o.v} active={value === o.v} onClick={() => onChange(o.v)}>{o.l}</Chip>
        ))}
      </div>
    </div>
  );
}

export function SectionStyleEditor({ value, onChange }: Props) {
  // Merge saved overrides on top of the sensible per-section defaults so the
  // controls always reflect what the section currently looks like, even when
  // the user hasn't tweaked anything yet.
  const s: SectionStyle = { ...DEFAULT_SECTION_STYLE, ...(value ?? {}) };
  const set = (patch: Partial<SectionStyle>) => onChange({ ...s, ...patch });

  return (
    <div className="space-y-4 rounded-md border border-border bg-muted/20 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Design & layout</div>
        <Button size="sm" variant="ghost" onClick={() => onChange({})} className="h-7 gap-1 text-xs">
          <RotateCcw className="h-3 w-3" /> Reset to default
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Group
          label="Vertical padding"
          options={[
            { v: "none", l: "None" }, { v: "sm", l: "S" },
            { v: "md", l: "M" }, { v: "lg", l: "L" }, { v: "xl", l: "XL" },
          ]}
          value={s.padding_y}
          onChange={(v) => set({ padding_y: v })}
        />
        <Group
          label="Max width"
          options={[
            { v: "narrow", l: "Narrow" }, { v: "default", l: "Default" },
            { v: "wide", l: "Wide" }, { v: "full", l: "Full" },
          ]}
          value={s.container}
          onChange={(v) => set({ container: v })}
        />
        <Group
          label="Text alignment"
          options={[{ v: "left", l: "Left" }, { v: "center", l: "Center" }, { v: "right", l: "Right" }]}
          value={s.align}
          onChange={(v) => set({ align: v })}
        />
        <Group
          label="Margin top"
          options={[{ v: "none", l: "None" }, { v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" }]}
          value={s.margin_top}
          onChange={(v) => set({ margin_top: v })}
        />
        <Group
          label="Margin bottom"
          options={[{ v: "none", l: "None" }, { v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" }]}
          value={s.margin_bottom}
          onChange={(v) => set({ margin_bottom: v })}
        />
      </div>

      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <ColorRow label="Background color" value={s.bg_color} onChange={(v) => set({ bg_color: v })} />
        <ColorRow label="Text color" value={s.text_color} onChange={(v) => set({ text_color: v })} />
        <ColorRow label="Headline color" value={s.heading_color} onChange={(v) => set({ heading_color: v })} />
        <ColorRow label="Accent color" value={s.accent_color} onChange={(v) => set({ accent_color: v })} />
      </div>

      <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <Group
          label="Headline size"
          options={[
            { v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" },
            { v: "xl", l: "XL" }, { v: "2xl", l: "2XL" }, { v: "3xl", l: "3XL" },
          ]}
          value={s.heading_size}
          onChange={(v) => set({ heading_size: v })}
        />
        <Group
          label="Body text size"
          options={[{ v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" }]}
          value={s.body_size}
          onChange={(v) => set({ body_size: v })}
        />
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Buttons</div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Group
            label="Size"
            options={[{ v: "sm", l: "S" }, { v: "md", l: "M" }, { v: "lg", l: "L" }]}
            value={s.button_size}
            onChange={(v) => set({ button_size: v })}
          />
          <Group
            label="Corner radius"
            options={[{ v: "sharp", l: "Sharp" }, { v: "rounded", l: "Rounded" }, { v: "pill", l: "Pill" }]}
            value={s.button_radius}
            onChange={(v) => set({ button_radius: v })}
          />
          <ColorRow label="Button background" value={s.button_bg} onChange={(v) => set({ button_bg: v })} />
          <ColorRow label="Button text color" value={s.button_fg} onChange={(v) => set({ button_fg: v })} />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Tip: leave a control unset to inherit the site's default styling for this section.
      </p>
    </div>
  );
}
