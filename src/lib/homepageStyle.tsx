import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StyledSection } from "@/components/StyledSection";
import type { SectionStyle } from "@/lib/sectionStyle";
import type { SectionKey } from "@/lib/homepageContent";

export function useHomepageStyles() {
  const { data } = useQuery({
    queryKey: ["homepage-sections-style"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_sections")
        .select("section_key, style");
      if (error) throw error;
      return data as { section_key: SectionKey; style: SectionStyle | null }[];
    },
  });
  const map: Partial<Record<SectionKey, SectionStyle>> = {};
  (data ?? []).forEach((r) => { if (r.style) map[r.section_key] = r.style; });
  return (k: SectionKey) => map[k];
}

export function HomepageSection({
  sectionKey,
  styleFor,
  children,
}: {
  sectionKey: SectionKey;
  styleFor: (k: SectionKey) => SectionStyle | undefined;
  children: React.ReactNode;
}) {
  return <StyledSection style={styleFor(sectionKey)}>{children}</StyledSection>;
}
