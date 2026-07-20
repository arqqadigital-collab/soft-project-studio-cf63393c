/**
 * Metadata auto-captured on every public form submission so the
 * dashboard Submissions inbox can show which page the lead came from.
 */
export function submissionMeta() {
  if (typeof window === "undefined") {
    return { page_path: null, page_title: null, user_agent: null };
  }
  return {
    page_path: window.location.pathname + window.location.search,
    page_title: document.title || null,
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };
}
