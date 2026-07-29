import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { LegacyPageRedirect } from "@/components/LegacyPageRedirect";

/** Renders the current location so assertions can read the resolved URL. */
function LocationProbe() {
  const { pathname, search, hash } = useLocation();
  return <div data-testid="location">{`${pathname}${search}${hash}`}</div>;
}

function renderAt(initialPath: string) {
  const view = render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/p/:slug" element={<LegacyPageRedirect />} />
        <Route path="/ar/p/:slug" element={<LegacyPageRedirect />} />
        <Route path="/:slug" element={<LocationProbe />} />
        <Route path="/ar/:slug" element={<LocationProbe />} />
        <Route path="*" element={<div data-testid="notfound">404</div>} />
      </Routes>
    </MemoryRouter>,
  );
  const text = view.getByTestId("location").textContent;
  view.unmount();
  return text;
}

describe("legacy /p redirects", () => {
  // Slugs that exist as CMS pages in the database.
  const slugs = ["about-arqqa", "privacy-policy", "terms"];

  it.each(slugs)("redirects /p/%s to /%s", (slug) => {
    expect(renderAt(`/p/${slug}`)).toBe(`/${slug}`);
  });

  it.each(slugs)("redirects /ar/p/%s to /ar/%s", (slug) => {
    expect(renderAt(`/ar/p/${slug}`)).toBe(`/ar/${slug}`);
  });

  it("redirects Arabic (percent-encoded) slugs under /ar/p", () => {
    const slug = encodeURIComponent("سياسة-الخصوصية");
    expect(renderAt(`/ar/p/${slug}`)).toBe(`/ar/${slug}`);
  });

  it("preserves query string and hash", () => {
    expect(renderAt("/p/terms?ref=news#section-2")).toBe("/terms?ref=news#section-2");
    expect(renderAt("/ar/p/terms?ref=news#section-2")).toBe("/ar/terms?ref=news#section-2");
  });

  it("replaces the history entry instead of pushing a new one", () => {
    render(
      <MemoryRouter initialEntries={["/start", "/p/terms"]} initialIndex={1}>
        <Routes>
          <Route path="/p/:slug" element={<LegacyPageRedirect />} />
          <Route path="/:slug" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    // With `replace`, going back lands on /start, not back on /p/terms.
    expect(screen.getByTestId("location").textContent).toBe("/terms");
  });
});
