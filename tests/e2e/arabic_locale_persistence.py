"""Arabic locale persistence smoke test.

Runs against the local dev server (http://localhost:8080). For each main
section and a sampled detail page, asserts the URL stays under /ar/ and the
document direction is RTL. Also verifies the language switcher on a detail
page produces a non-home English URL.

Usage:
    python3 tests/e2e/arabic_locale_persistence.py
"""

import asyncio
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
SHOTS = Path("/tmp/browser/ar-locale"); SHOTS.mkdir(parents=True, exist_ok=True)

# Main section entry points that must remain in AR when navigated to directly.
AR_SECTIONS = [
    "/ar",
    "/ar/about",
    "/ar/healthcare/his",
    "/ar/healthcare/clinical-ai",
    "/ar/erp/dynamics-365",
    "/ar/services/cybersecurity",
    "/ar/blog",
    "/ar/events",
    "/ar/case-studies",
    "/ar/contact",
]

failures: list[str] = []

def fail(msg: str) -> None:
    print(f"FAIL: {msg}")
    failures.append(msg)

async def assert_ar(page, label: str) -> None:
    url = page.url
    dir_attr = await page.evaluate("document.documentElement.dir")
    if "/ar" not in url.split(BASE, 1)[-1].split("?")[0].split("#")[0]:
        fail(f"{label}: URL left /ar → {url}")
    if dir_attr != "rtl":
        fail(f"{label}: dir={dir_attr!r} (expected rtl) at {url}")

async def first_detail_link(page, list_path: str) -> str | None:
    await page.goto(BASE + list_path, wait_until="networkidle")
    await assert_ar(page, f"list {list_path}")
    # Grab first anchor whose href contains the list segment plus one more path part.
    seg = list_path.split("/ar/", 1)[1]
    href = await page.evaluate(
        """seg => {
            const a = Array.from(document.querySelectorAll('a[href]'))
              .find(el => {
                const h = el.getAttribute('href') || '';
                return h.includes('/ar/') && h.includes(seg + '/');
              });
            return a ? a.getAttribute('href') : null;
        }""",
        seg,
    )
    return href

async def main() -> int:
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        # 1) Direct navigation to each AR section must render RTL and stay under /ar.
        for path in AR_SECTIONS:
            await page.goto(BASE + path, wait_until="domcontentloaded")
            await page.wait_for_timeout(400)
            await assert_ar(page, f"section {path}")

        await page.screenshot(path=str(SHOTS / "sections_last.png"))

        # 2) Detail pages for blog / events / case-studies.
        for list_path in ["/ar/blog", "/ar/events", "/ar/case-studies"]:
            href = await first_detail_link(page, list_path)
            if not href:
                print(f"skip: no detail link found on {list_path}")
                continue
            target = href if href.startswith("http") else BASE + href
            await page.goto(target, wait_until="domcontentloaded")
            await page.wait_for_timeout(500)
            await assert_ar(page, f"detail from {list_path}")

        # 3) Language switcher on a detail page must land on non-'/' EN URL.
        href = await first_detail_link(page, "/ar/blog")
        if href:
            await page.goto((href if href.startswith("http") else BASE + href),
                            wait_until="domcontentloaded")
            await page.wait_for_timeout(500)
            # Find the language switcher (button/link with 'EN' text) and click.
            clicked = await page.evaluate(
                """() => {
                    const nodes = Array.from(document.querySelectorAll('a,button'));
                    const el = nodes.find(n => (n.textContent || '').trim().toUpperCase() === 'EN');
                    if (!el) return false;
                    el.click(); return true;
                }"""
            )
            if not clicked:
                fail("language switcher EN control not found on AR detail page")
            else:
                await page.wait_for_load_state("domcontentloaded")
                await page.wait_for_timeout(600)
                path_only = page.url.split(BASE, 1)[-1].split("?")[0]
                if path_only in ("/", ""):
                    fail(f"switcher redirected to home instead of EN counterpart: {page.url}")
                if "/ar/" in path_only:
                    fail(f"switcher stayed on AR: {page.url}")
            await page.screenshot(path=str(SHOTS / "switcher_result.png"))

        await browser.close()

    if failures:
        print(f"\n{len(failures)} check(s) failed.")
        return 1
    print("\nAll Arabic locale persistence checks passed.")
    return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
