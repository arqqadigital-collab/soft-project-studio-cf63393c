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
import type { FormLabels } from "@/hooks/useFormSettings";

const FIELDS: { key: keyof FormLabels; label: string; type: "input" | "textarea" }[] = [
  { key: "heading", label: "Heading", type: "input" },
  { key: "subheading", label: "Subheading", type: "textarea" },
  { key: "name_label", label: "Name — label", type: "input" },
  { key: "name_placeholder", label: "Name — placeholder", type: "input" },
  { key: "email_label", label: "Email — label", type: "input" },
  { key: "email_placeholder", label: "Email — placeholder", type: "input" },
  { key: "phone_label", label: "Phone — label", type: "input" },
  { key: "phone_placeholder", label: "Phone — placeholder", type: "input" },
  { key: "area_label", label: "Area of Inquiry — label", type: "input" },
  { key: "area_placeholder", label: "Area of Inquiry — placeholder", type: "input" },
  { key: "message_label", label: "Message — label", type: "input" },
  { key: "message_placeholder", label: "Message — placeholder", type: "input" },
  { key: "consent_text", label: "Consent text", type: "textarea" },
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
  const [en, setEn] = useState<FormLabels>({});
  const [ar, setAr] = useState<FormLabels>({});

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
      setEn((q.data as any).labels ?? {});
      setAr((q.data as any).labels_ar ?? {});
    }
  }, [q.data]);

  async function save() {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("form_settings")
        .update({ labels: en, labels_ar: ar })
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
      const { data, error } = await supabase.functions.invoke("translate-content", {
        body: { source: "en", target: "ar", payload: en },
      });
      if (error) throw error;
      const translated = (data as any)?.translated ?? (data as any)?.payload ?? data;
      if (translated && typeof translated === "object") {
        // Merge — keep manual AR edits for non-empty keys
        const merged: FormLabels = { ...translated };
        for (const k of Object.keys(ar) as (keyof FormLabels)[]) {
          const cur = ar[k];
          if (typeof cur === "string" && cur.trim()) merged[k] = cur;
        }
        setAr(merged);
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
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">Edit form labels, placeholders, and messages. Leave a field blank to fall back to the English text.</p>
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

      <Tabs value={locale} onValueChange={(v) => setLocale(v as "en" | "ar")}>
        <TabsList>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ar">العربية</TabsTrigger>
        </TabsList>

        <TabsContent value="en" className="space-y-4 mt-6">
          {FIELDS.map((f) => (
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
          {FIELDS.map((f) => (
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
            These options are shared by every form on the site (Contact and Footer CTA). Edit English labels on the English tab and Arabic on the العربية tab above.
          </p>
        </div>
        <AreasTab locale={locale} />
      </div>
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
