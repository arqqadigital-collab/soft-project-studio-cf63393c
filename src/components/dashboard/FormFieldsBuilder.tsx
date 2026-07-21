import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { FormField, FormFieldType } from "@/hooks/useFormSettings";

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "textarea", label: "Long text" },
  { value: "select", label: "Dropdown" },
  { value: "checkbox", label: "Checkbox" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "area", label: "Area of Inquiry (built-in)" },
];

function uid() {
  return "f_" + Math.random().toString(36).slice(2, 10);
}

function slugKey(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || "field";
}

export function FormFieldsBuilder({
  value,
  onChange,
}: {
  value: FormField[];
  onChange: (next: FormField[]) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  const update = (id: string, patch: Partial<FormField>) => {
    onChange(value.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const remove = (id: string) => {
    onChange(value.filter((f) => f.id !== id));
  };

  const add = () => {
    const usedKeys = new Set(value.map((f) => f.key));
    let base = "custom_field";
    let n = 1;
    while (usedKeys.has(`${base}_${n}`)) n++;
    const id = uid();
    const nf: FormField = {
      id,
      key: `${base}_${n}`,
      type: "text",
      enabled: true,
      required: false,
      label_en: "New field",
      label_ar: "حقل جديد",
      placeholder_en: "",
      placeholder_ar: "",
    };
    onChange([...value, nf]);
    setExpanded(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Fields</h3>
          <p className="text-sm text-muted-foreground">
            Reorder with the arrows. Toggle to show/hide. Built-in fields keep their key (used by submissions).
          </p>
        </div>
        <Button onClick={add} size="sm">
          <Plus className="h-4 w-4" /> <span className="ml-1">Add field</span>
        </Button>
      </div>

      <div className="space-y-2">
        {value.map((f, i) => {
          const isOpen = expanded === f.id;
          return (
            <div key={f.id} className="rounded-lg border bg-card">
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === value.length - 1}
                    className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{f.label_en || f.key}</span>
                    <span className="text-xs rounded bg-muted px-1.5 py-0.5">{f.type}</span>
                    {f.builtin && (
                      <span className="text-xs rounded bg-blue-100 text-blue-800 px-1.5 py-0.5">built-in</span>
                    )}
                    {f.required && (
                      <span className="text-xs rounded bg-amber-100 text-amber-900 px-1.5 py-0.5">required</span>
                    )}
                    {!f.enabled && (
                      <span className="text-xs rounded bg-gray-200 text-gray-700 px-1.5 py-0.5">hidden</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{f.key}</div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => update(f.id, { enabled: !f.enabled })}
                  title={f.enabled ? "Hide field" : "Show field"}
                >
                  {f.enabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setExpanded(isOpen ? null : f.id)}>
                  {isOpen ? "Close" : "Edit"}
                </Button>
                {!f.builtin && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this field? Existing submissions keep their data.")) remove(f.id);
                    }}
                    title="Delete field"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              {isOpen && (
                <div className="border-t p-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label>Field type</Label>
                      <Select
                        value={f.type}
                        onValueChange={(v) => update(f.id, { type: v as FormFieldType })}
                        disabled={f.builtin}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FIELD_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Key (machine name)</Label>
                      <Input
                        value={f.key}
                        onChange={(e) => update(f.id, { key: slugKey(e.target.value) })}
                        disabled={f.builtin}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="grid gap-1.5">
                      <Label>Label (English)</Label>
                      <Input value={f.label_en} onChange={(e) => update(f.id, { label_en: e.target.value })} />
                    </div>
                    <div className="grid gap-1.5" dir="rtl">
                      <Label>Label (العربية)</Label>
                      <Input value={f.label_ar ?? ""} onChange={(e) => update(f.id, { label_ar: e.target.value })} />
                    </div>
                  </div>

                  {f.type !== "checkbox" && f.type !== "area" && (
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="grid gap-1.5">
                        <Label>Placeholder (English)</Label>
                        <Input value={f.placeholder_en ?? ""} onChange={(e) => update(f.id, { placeholder_en: e.target.value })} />
                      </div>
                      <div className="grid gap-1.5" dir="rtl">
                        <Label>Placeholder (العربية)</Label>
                        <Input value={f.placeholder_ar ?? ""} onChange={(e) => update(f.id, { placeholder_ar: e.target.value })} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Switch checked={f.enabled} onCheckedChange={(v) => update(f.id, { enabled: v })} />
                      <Label>Visible on form</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={f.required} onCheckedChange={(v) => update(f.id, { required: v })} />
                      <Label>Required</Label>
                    </div>
                  </div>

                  {f.type === "select" && (
                    <OptionsEditor
                      options={f.options ?? []}
                      onChange={(opts) => update(f.id, { options: opts })}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: { value: string; label_en: string; label_ar?: string }[];
  onChange: (opts: { value: string; label_en: string; label_ar?: string }[]) => void;
}) {
  const add = () => onChange([...options, { value: `option_${options.length + 1}`, label_en: "", label_ar: "" }]);
  const update = (i: number, patch: Partial<(typeof options)[number]>) => {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  };
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= options.length) return;
    const next = options.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Dropdown options</Label>
        <Button size="sm" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" /> <span className="ml-1">Add option</span>
        </Button>
      </div>
      {options.length === 0 && <p className="text-xs text-muted-foreground">No options yet.</p>}
      {options.map((o, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[auto_1fr_1fr_1fr_auto] items-center">
          <div className="flex flex-col gap-0.5">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-0.5 hover:bg-muted disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === options.length - 1} className="rounded p-0.5 hover:bg-muted disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
          </div>
          <Input placeholder="value" value={o.value} onChange={(e) => update(i, { value: e.target.value })} />
          <Input placeholder="Label (EN)" value={o.label_en} onChange={(e) => update(i, { label_en: e.target.value })} />
          <Input placeholder="Label (AR)" dir="rtl" value={o.label_ar ?? ""} onChange={(e) => update(i, { label_ar: e.target.value })} />
          <Button size="sm" variant="ghost" onClick={() => remove(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      ))}
    </div>
  );
}
