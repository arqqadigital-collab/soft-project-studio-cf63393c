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
import { slugify } from "@/lib/slug";

function toLocal(dt: string | null) {
  if (!dt) return "";
  const d = new Date(dt);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

export default function EventEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";
  const [f, setF] = useState<any>({
    title: "", slug: "", description: "", event_type: "webinar",
    starts_at: null, ends_at: null, location: "", virtual_link: "",
    registration_url: "", cover_image_url: "", status: "draft",
  });
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id!).maybeSingle();
      if (error) toast.error(error.message);
      if (data) setF(data);
      setLoading(false);
    })();
  }, [id, isNew]);

  const set = (patch: any) => setF((x: any) => ({ ...x, ...patch }));

  async function save() {
    const payload = { ...f, slug: f.slug || slugify(f.title) };
    if (!payload.title) return toast.error("Title required");
    if (isNew) {
      const { data, error } = await supabase.from("events").insert(payload).select("id").single();
      if (error) return toast.error(error.message);
      toast.success("Created");
      navigate(`/dashboard/events/${data.id}`);
    } else {
      const { error } = await supabase.from("events").update(payload).eq("id", id!);
      if (error) return toast.error(error.message);
      toast.success("Saved");
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard/events")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">{isNew ? "New Event" : "Edit Event"}</h1>
        </div>
        <Button onClick={save}><Save className="mr-1 h-4 w-4" /> Save</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="p-4 space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={f.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Slug</Label><Input value={f.slug} onChange={(e) => set({ slug: e.target.value })} placeholder="auto from title" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea rows={6} value={f.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Starts</Label><Input type="datetime-local" value={toLocal(f.starts_at)} onChange={(e) => set({ starts_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
            <div className="space-y-2"><Label>Ends</Label><Input type="datetime-local" value={toLocal(f.ends_at)} onChange={(e) => set({ ends_at: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={f.location ?? ""} onChange={(e) => set({ location: e.target.value })} placeholder="City, venue" /></div>
            <div className="space-y-2"><Label>Virtual link</Label><Input value={f.virtual_link ?? ""} onChange={(e) => set({ virtual_link: e.target.value })} placeholder="https://…" /></div>
          </div>
          <div className="space-y-2"><Label>Registration URL</Label><Input value={f.registration_url ?? ""} onChange={(e) => set({ registration_url: e.target.value })} /></div>
        </Card>

        <Card className="p-4 space-y-4 h-fit">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={f.event_type} onValueChange={(v) => set({ event_type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="webinar">Webinar</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="meetup">Meetup</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
