import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FormLabels = {
  heading?: string;
  subheading?: string;
  name_label?: string;
  name_placeholder?: string;
  email_label?: string;
  email_placeholder?: string;
  phone_label?: string;
  phone_placeholder?: string;
  area_label?: string;
  area_placeholder?: string;
  message_label?: string;
  message_placeholder?: string;
  consent_text?: string;
  submit_label?: string;
  submitting_label?: string;
  success_title?: string;
  success_message?: string;
  send_another?: string;
};

export type FormSettings = {
  id: string;
  key: string;
  labels: FormLabels;
  labels_ar: FormLabels;
  required_fields: string[];
};

export function useFormSettings(key: string) {
  return useQuery({
    queryKey: ["form_settings", key],
    queryFn: async (): Promise<FormSettings | null> => {
      const { data, error } = await supabase
        .from("form_settings")
        .select("*")
        .eq("key", key)
        .maybeSingle();
      if (error) throw error;
      return (data as any) ?? null;
    },
    staleTime: 60_000,
  });
}

/** Pick an AR value with EN fallback. */
export function pickLabel(en?: string, ar?: string, isAr = false): string {
  if (!isAr) return en ?? "";
  if (ar && ar.trim()) return ar;
  return en ?? "";
}
