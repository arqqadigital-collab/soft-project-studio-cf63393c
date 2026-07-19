import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toSlug as slugify } from "@/lib/slug";
import { LocaleTabs, LocaleHint, type EditorLocale } from "@/components/dashboard/LocaleTabs";

const TRANSLATABLE = ["title", "summary", "challenge", "solution", "results"] as const;

export default function CaseStudyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";
  const [f, setF] = useState<any>({
    title: "", slug: "", client_name: "", industry: "", summary: "",
    challenge: "", solution: "", results: "", cover_image_url: "", status: "draft",
    translations: {} as Record<string, any>,
  });
  const [loading, setLoading] = useState(!isNew);
  const [locale, setLocale] = useState<EditorLocale>("en");
  const [ar, setAr] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("case_studies").select("*").eq("id", id!).maybeSingle();
      if (error) toast.error(error.message);
      if (data) {
        setF(data);
        setAr(((data as any).translations?.ar ?? {}) as Record<string, string>);
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = (patch: any) => setF((x: any) => ({ ...x, ...patch }));
  const setArField = (k: string, v: string) => setAr((x) => ({ ...x, [k]: v }));

  // Read/write a field respecting current locale
  const getV = (k: string) => (locale === "ar" ? (ar[k] ?? "") : (f[k] ?? ""));
  const setV = (k: string, v: string) => (locale === "ar" ? setArField(k, v) : set({ [k]: v }));

  async function save() {
    const translations = { ...(f.translations ?? {}), ar };
    const payload = { ...f, translations, slug: f.slug || slugify(f.title) };
    if (!payload.title) return toast.error("Title required");
    if (isNew) {
      const { data, error } = await supabase.from("case_studies").insert(payload).select("id").single();
      if (error) return toast.error(error.message);
      toast.success("Created");
      navigate(`/dashboard/case-studies/${data.id}`);
    } else {
      const { error } = await supabase.from("case_studies").update(payload).eq("id", id!);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/case-studies")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{isNew ? "New Case Study" : "Edit Case Study"}</h1>
        </div>
        <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-4 space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={f.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Slug</Label><Input value={f.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="auto from title" /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Client</Label><Input value={f.client_name ?? ""} onChange={(e) => set({ client_name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Industry</Label><Input value={f.industry ?? ""} onChange={(e) => set({ industry: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Summary</Label><Textarea rows={3} value={f.summary ?? ""} onChange={(e) => set({ summary: e.target.value })} /></div>
          <div className="space-y-2"><Label>Challenge</Label><Textarea rows={5} value={f.challenge ?? ""} onChange={(e) => set({ challenge: e.target.value })} /></div>
          <div className="space-y-2"><Label>Solution</Label><Textarea rows={5} value={f.solution ?? ""} onChange={(e) => set({ solution: e.target.value })} /></div>
          <div className="space-y-2"><Label>Results</Label><Textarea rows={5} value={f.results ?? ""} onChange={(e) => set({ results: e.target.value })} /></div>
        </Card>

        <Card className="p-4 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={f.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="trashed">Trashed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cover image URL</Label>
            <Input value={f.cover_image_url ?? ""} onChange={(e) => set({ cover_image_url: e.target.value })} />
            {f.cover_image_url && <img src={f.cover_image_url} alt="" className="rounded-md border" />}
          </div>
        </Card>
      </div>
    </div>
  );
}
