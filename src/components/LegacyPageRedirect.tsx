import { Navigate, useLocation, useParams } from "react-router-dom";

/**
 * Redirects legacy CMS page URLs:
 *   /p/:slug     -> /:slug
 *   /ar/p/:slug  -> /ar/:slug
 * Query string and hash are preserved; the history entry is replaced
 * (the client-side equivalent of a permanent redirect).
 */
export function LegacyPageRedirect() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { pathname, search, hash } = useLocation();
  const prefix = pathname.startsWith("/ar/") ? "/ar" : "";
  return <Navigate to={`${prefix}/${slug}${search}${hash}`} replace />;
}

export default LegacyPageRedirect;
