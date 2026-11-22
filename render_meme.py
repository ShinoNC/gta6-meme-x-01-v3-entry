#!/usr/bin/env python3
"""Screenshot meme.html into meme.png at 1024x1024 with headless Chromium.

Run from this directory:  python3 render_meme.py [name.png]
Reads meme.html and assets/mark-1024.png next to this file.
"""
import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
WIDTH = HEIGHT = 1024


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", nargs="?", default="meme.png")
    args = parser.parse_args()

    html = HERE / "meme.html"
    if not html.exists():
        print(f"missing {html}", file=sys.stderr)
        return 1
    out = Path(args.output)
    if not out.is_absolute():
        out = HERE / out

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        page.goto(html.as_uri())
        page.wait_for_timeout(600)  # let the barcode script + images settle
        page.screenshot(path=str(out))
        browser.close()

    print(f"wrote {out} ({out.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
