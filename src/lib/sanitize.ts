import DOMPurify from "dompurify";

// Strict allow-list for rich-text HTML rendered on public pages.
// Strips <script>, event handlers, javascript: URLs, and unknown tags/attrs.
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["style", "onerror", "onload", "onclick"],
  });
}
