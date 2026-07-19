import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const BLOG_DEFAULTS = {
  Hero: {
    _visible: true,
    eyebrow: "Insights & Updates",
    title_prefix: "Our",
    title_highlight: "Blog",
    description:
      "Thought leadership, industry trends, and practical guidance for healthcare, ERP, and technology leaders.",
  },
};

export type BlogContent = typeof BLOG_DEFAULTS;

function merge<T>(defaults: T, override: any): T {
  if (!override || typeof override !== "object") return defaults;
  const out: any = Array.isArray(defaults) ? [...(defaults as any)] : { ...(defaults as any) };
  for (const k of Object.keys(override)) {
    const dv = (defaults as any)?.[k];
    const ov = override[k];
    if (dv && typeof dv === "object" && !Array.isArray(dv) && ov && typeof ov === "object" && !Array.isArray(ov)) {
      out[k] = merge(dv, ov);
    } else if (ov !== undefined && ov !== null && ov !== "") {
      out[k] = ov;
    }
  }
  return out;
}

export function useBlogContent() {
  const [content, setContent] = useState<BlogContent>(BLOG_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: page } = await supabase.from("pages").select("id").eq("slug", "blog").maybeSingle();
      if (!page?.id) return;
      const { data: sections } = await supabase
        .from("page_sections")
        .select("section_name, content, is_visible")
        .eq("page_id", page.id);
      if (cancelled || !sections) return;
      const next: any = JSON.parse(JSON.stringify(BLOG_DEFAULTS));
      for (const s of sections) {
        const key = s.section_name as keyof BlogContent;
        if (!(key in next)) continue;
        next[key] = merge(next[key], s.content ?? {});
        next[key]._visible = s.is_visible !== false;
      }
      setContent(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return content;
}
