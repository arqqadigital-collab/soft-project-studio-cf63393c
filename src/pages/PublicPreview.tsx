import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { SeoHead } from "@/components/SeoHead";
import { sanitizeHtml } from "@/lib/sanitize";

type Kind = "post" | "page";

export default function PublicPreview() {
  const { kind, id } = useParams<{ kind: Kind; id: string }>();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!kind || !id || !token) {
        setError("Invalid preview link");
        setLoading(false);
        return;
      }
      try {
        const base = import.meta.env.VITE_SUPABASE_URL as string;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const url = `${base}/functions/v1/preview-content?type=${kind}&id=${id}&token=${encodeURIComponent(token)}`;
        const resp = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
        const json = await resp.json();
        if (!resp.ok) throw new Error(json.error || "Preview unavailable");
        if (!cancelled) setData(json.data);
      } catch (e: any) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [kind, id, token]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-sm text-muted-foreground">Loading preview…</div>;
  }
  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Preview unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error ?? "The preview link is invalid or has expired."}</p>
        <Link to="/" className="mt-6 inline-block text-sm text-primary underline">Go home</Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead title={`Preview — ${data.title}`} noindex ogType={kind === "post" ? "article" : "website"} />
      <div className="sticky top-0 z-50 border-b bg-amber-100 px-4 py-2 text-center text-xs font-medium text-amber-900">
        Draft preview — not visible to the public. Status: {data.status}
      </div>
      <article className="mx-auto max-w-3xl px-6 py-10">
        {data.featured_image_url && (
          <img src={data.featured_image_url} alt="" className="mb-6 w-full rounded-lg border object-cover" />
        )}
        <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
        {data.excerpt && <p className="mt-3 text-lg text-muted-foreground">{data.excerpt}</p>}
        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.content ?? "") }}
        />
      </article>
    </>
  );
}
