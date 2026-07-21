import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AreasTab } from "@/pages/dashboard/ContactEditor";
import type { FormLabels, FormField } from "@/hooks/useFormSettings";
import { FormFieldsBuilder } from "@/components/dashboard/FormFieldsBuilder";

const LABEL_FIELDS: { key: keyof FormLabels; label: string; type: "input" | "textarea" }[] = [
  { key: "heading", label: "Heading", type: "input" },
  { key: "subheading", label: "Subheading", type: "textarea" },
  { key: "submit_label", label: "Submit button", type: "input" },
  { key: "submitting_label", label: "Submitting (loading) label", type: "input" },
  { key: "success_title", label: "Success — title", type: "input" },
  { key: "success_message", label: "Success — message", type: "textarea" },
  { key: "send_another", label: "Send another (link)", type: "input" },
];

export default function FormEditor({ formKey, title }: { formKey: string; title: string }) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [tab, setTab] = useState<"fields" | "text">("fields");
  const [en, setEn] = useState<FormLabels>({});
  const [ar, setAr] = useState<FormLabels>({});
  const [fields, setFields] = useState<FormField[]>([]);

  const q = useQuery({
    queryKey: ["form_settings", formKey, "editor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_settings")
        .select("*")
        .eq("key", formKey)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (q.data) {
      const d = q.data as any;
      setEn(d.labels ?? {});
      setAr(d.labels_ar ?? {});
      setFields(Array.isArray(d.fields) ? d.fields : []);
    }
  }, [q.data]);

  async function save() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("form_settings")
        .update({ labels: en, labels_ar: ar, fields: fields as any })
        .eq("key", formKey);
      if (error) throw error;
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["form_settings", formKey] });
      qc.invalidateQueries({ queryKey: ["form_settings", formKey, "editor"] });
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function translate() {
    setTranslating(true);
    try {
      // Translate both label bundle AND field labels/placeholders
      const fieldPayload: Record<string, string> = {};
      fields.forEach((f) => {
        if (f.label_en) fieldPayload[`field__${f.id}__label`] = f.label_en;
        if (f.placeholder_en) fieldPayload[`field__${f.id}__placeholder`] = f.placeholder_en;
        (f.options ?? []).forEach((o, i) => {
          if (o.label_en) fieldPayload[`field__${f.id}__opt__${i}`] = o.label_en;
        });
      });
      const payload = { ...en, ...fieldPayload };
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { source: "en", target: "ar", payload },
      });
      if (error) throw error;
      const translated = (data as any)?.translated ?? (data as any)?.payload ?? data;
      if (translated && typeof translated === "object") {
        // Text labels
        const mergedText: FormLabels = { ...(translated as FormLabels) };
        for (const k of Object.keys(ar) as (keyof FormLabels)[]) {
          const cur = ar[k];
          if (typeof cur === "string" && cur.trim()) mergedText[k] = cur;
        }
        // Filter out field__* from mergedText
        Object.keys(mergedText).forEach((k) => {
          if (k.startsWith("field__")) delete (mergedText as any)[k];
        });
        setAr(mergedText);

        // Fields
        setFields((prev) =>
          prev.map((f) => {
            const next = { ...f };
            const lk = `field__${f.id}__label`;
            const pk = `field__${f.id}__placeholder`;
            if (!next.label_ar?.trim() && translated[lk]) next.label_ar = translated[lk];
            if (!next.placeholder_ar?.trim() && translated[pk]) next.placeholder_ar = translated[pk];
            if (next.options) {
              next.options = next.options.map((o, i) => {
                const key = `field__${f.id}__opt__${i}`;
                if (!o.label_ar?.trim() && translated[key]) return { ...o, label_ar: translated[key] };
                return o;
              });
            }
            return next;
          })
        );
        toast.success("Translated to Arabic — review and save");
      } else {
        toast.error("Translator returned no data");
      }
    } catch (e: any) {
      toast.error(e.message ?? "Translation failed");
    } finally {
      setTranslating(false);
    }
  }

  if (q.isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground p-6"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">Add and reorder form fields, or edit surrounding text (heading, submit button, success message). Leave an Arabic field blank to fall back to English.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={translate} disabled={translating}>
            {translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
            <span className="ml-2">Auto-translate to Arabic</span>
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="ml-2">Save</span>
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="text">Text & messages</TabsTrigger>
        </TabsList>

        <TabsContent value="fields" className="mt-6">
          <FormFieldsBuilder value={fields} onChange={setFields} />
        </TabsContent>

        <TabsContent value="text" className="mt-6">
          <Tabs value={locale} onValueChange={(v) => setLocale(v as "en" | "ar")}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>

            <TabsContent value="en" className="space-y-4 mt-6">
              {LABEL_FIELDS.map((f) => (
                <FieldRow
                  key={f.key}
                  id={`en-${f.key}`}
                  label={f.label}
                  type={f.type}
                  value={(en[f.key] as string) ?? ""}
                  onChange={(v) => setEn((s) => ({ ...s, [f.key]: v }))}
                />
              ))}
            </TabsContent>

            <TabsContent value="ar" className="space-y-4 mt-6" dir="rtl">
              {LABEL_FIELDS.map((f) => (
                <FieldRow
                  key={f.key}
                  id={`ar-${f.key}`}
                  label={f.label}
                  type={f.type}
                  value={(ar[f.key] as string) ?? ""}
                  onChange={(v) => setAr((s) => ({ ...s, [f.key]: v }))}
                  placeholder={(en[f.key] as string) ?? ""}
                />
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-8 border-t pt-6">
            <div className="mb-3">
              <h3 className="text-lg font-semibold">Area of Inquiry — dropdown options</h3>
              <p className="text-sm text-muted-foreground mt-1">
                These options are shared by every form on the site (Contact and Footer CTA). They power the built-in "Area of Inquiry" field.
              </p>
            </div>
            <AreasTab locale={locale} />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

function FieldRow({
  id, label, type, value, onChange, placeholder,
}: {
  id: string; label: string; type: "input" | "textarea";
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {type === "textarea" ? (
        <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
      ) : (
        <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}
