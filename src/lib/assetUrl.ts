const DEFAULT_ASSET_BASE_URL =
  "https://id-preview--a99ff590-db4e-4b0a-82d4-1f1ff73a8b78.lovable.app";

export const ASSET_BASE_URL = (
  import.meta.env.VITE_ASSET_BASE_URL || DEFAULT_ASSET_BASE_URL
).replace(/\/$/, "");

export function normalizeAssetUrl(value: string): string {
  return value.startsWith("/__l5e/") ? `${ASSET_BASE_URL}${value}` : value;
}

/** Converts asset paths nested anywhere in a Supabase JSON response. */
export function normalizeAssetUrls<T>(value: T): T {
  if (typeof value === "string") return normalizeAssetUrl(value) as T;
  if (Array.isArray(value)) return value.map(normalizeAssetUrls) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, normalizeAssetUrls(item)]),
    ) as T;
  }
  return value;
}