import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFooterCtaRaw, type FooterCtaSettings } from "@/lib/footerCta";
import { LocaleTabs, LocaleHint, type EditorLocale } from "@/components/dashboard/LocaleTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type FormState = FooterCtaSettings;

export default function FooterCtaEditor() {
  const { data, isLoading } = useFooterCtaRaw();
  const qc = useQueryClient();
  const [locale, setLocale] = useState<EditorLocale>("en");
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (isLoading || !form) {
    return <div className="p-6 text-sm text-muted-foreground">Loading…</div>;
  }

  const isAr = locale === "ar";
  const ar = (form.translations?.ar ?? {}) as Record<string, string>;

  const setEn = (patch: Partial<FormState>) => setForm({ ...form, ...patch });
  const setAr = (patch: Record<string, string>) =>
    setForm({
      ...form,
      translations: { ...(form.translations ?? {}), ar: { ...ar, ...patch } },
    });

  async function handleSave() {
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        enabled: form.enabled,
        eyebrow: form.eyebrow,
        title: form.title,
        description: form.description,
        button_label: form.button_label,
        button_url: form.button_url,
        show_form: form.show_form,
        form_success_message: form.form_success_message,
        bg_color: form.bg_color,
        text_color: form.text_color,
        button_bg_color: form.button_bg_color,
        button_text_color: form.button_text_color,
        layout: form.layout,
        excluded_paths: form.excluded_paths,
        translations: form.translations ?? {},
      };
      const { error } = await supabase
        .from("footer_cta")
        .update(payload)
        .eq("singleton", true);
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["footer-cta"] });
      toast.success("Footer CTA saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Footer CTA — "Let's Get Started"</h1>
          <p className="text-sm text-muted-foreground">
            Shown above the footer on every page except the paths you exclude below.
            Submissions land in your Contact inbox with source "footer_cta".
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LocaleTabs locale={locale} onChange={setLocale} />
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <LocaleHint locale={locale} />

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enabled</Label>
            <p className="text-xs text-muted-foreground">Toggle the whole CTA on/off site-wide.</p>
          </div>
          <Switch
            checked={form.enabled}
            onCheckedChange={(v) => setEn({ enabled: v })}
          />
        </div>

        <Separator />

        {/* Copy — EN or AR */}
        <div className="space-y-3">
          <div>
            <Label>Eyebrow</Label>
            <Input
              value={isAr ? (ar.eyebrow ?? "") : (form.eyebrow ?? "")}
              onChange={(e) =>
                isAr ? setAr({ eyebrow: e.target.value }) : setEn({ eyebrow: e.target.value })
              }
              placeholder={isAr ? "جاهزون عندما تكون مستعدًا" : "Ready when you are"}
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={isAr ? (ar.title ?? "") : form.title}
              onChange={(e) =>
                isAr ? setAr({ title: e.target.value }) : setEn({ title: e.target.value })
              }
              placeholder={isAr ? "لنبدأ الآن" : "Let's Get Started"}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={isAr ? (ar.description ?? "") : (form.description ?? "")}
              onChange={(e) =>
                isAr
                  ? setAr({ description: e.target.value })
                  : setEn({ description: e.target.value })
              }
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Button label</Label>
              <Input
                value={isAr ? (ar.button_label ?? "") : (form.button_label ?? "")}
                onChange={(e) =>
                  isAr
                    ? setAr({ button_label: e.target.value })
                    : setEn({ button_label: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Form success message</Label>
              <Input
                value={
                  isAr
                    ? (ar.form_success_message ?? "")
                    : (form.form_success_message ?? "")
                }
                onChange={(e) =>
                  isAr
                    ? setAr({ form_success_message: e.target.value })
                    : setEn({ form_success_message: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Non-translatable settings */}
      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-lg font-semibold">Layout & behaviour</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label>Layout</Label>
            <select
              value={form.layout}
              onChange={(e) => setEn({ layout: e.target.value as "centered" | "split" })}
              className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="centered">Centered</option>
              <option value="split">Split (text + form)</option>
            </select>
          </div>
          <div>
            <Label>Button URL (used when form is hidden)</Label>
            <Input
              value={form.button_url ?? ""}
              onChange={(e) => setEn({ button_url: e.target.value })}
              placeholder="/contact"
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Show inline form</Label>
            <p className="text-xs text-muted-foreground">
              Off → renders a button linking to the URL above.
            </p>
          </div>
          <Switch
            checked={form.show_form}
            onCheckedChange={(v) => setEn({ show_form: v })}
          />
        </div>

        <div>
          <Label>Hide on these paths (one per line)</Label>
          <Textarea
            rows={3}
            value={(form.excluded_paths ?? []).join("\n")}
            onChange={(e) =>
              setEn({
                excluded_paths: e.target.value
                  .split(/\n+/)
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder={"/contact\n/ar/contact"}
          />
        </div>
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-4">
        <h2 className="text-lg font-semibold">Colors</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              ["bg_color", "Background"],
              ["text_color", "Text"],
              ["button_bg_color", "Button background"],
              ["button_text_color", "Button text"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <Label>{label}</Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="color"
                  value={(form[key] as string) || "#000000"}
                  onChange={(e) => setEn({ [key]: e.target.value } as Partial<FormState>)}
                  className="h-9 w-12 cursor-pointer rounded border"
                />
                <Input
                  value={(form[key] as string) ?? ""}
                  onChange={(e) => setEn({ [key]: e.target.value } as Partial<FormState>)}
                  placeholder="#0b2a4a"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
