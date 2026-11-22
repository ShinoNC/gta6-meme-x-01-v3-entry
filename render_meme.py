#!/usr/bin/env python3
"""Render the v3 boarding-pass meme: screenshot meme.html at 1024x1024.

Usage, from this directory:

    python3 render_meme.py [output.png]

The default output is meme.png. meme.html and assets/mark-1024.png must sit
next to this script. Output is deterministic: two runs give identical bytes.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE_DIR = Path(__file__).resolve().parent
CANVAS = 1024  # meme is square, 1024 x 1024
SETTLE_MS = 600  # let the barcode script and the ghost image finish


def resolve_output(name: str) -> Path:
    out = Path(name)
    return out if out.is_absolute() else BASE_DIR / out


def render(html_path: Path, out_path: Path) -> int:
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": CANVAS, "height": CANVAS})
        page.goto(html_path.as_uri())
        page.wait_for_timeout(SETTLE_MS)
        page.screenshot(path=str(out_path))
        browser.close()
    print(f"wrote {out_path} ({out_path.stat().st_size} bytes)")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Screenshot meme.html into a 1024x1024 PNG."
    )
    parser.add_argument("output", nargs="?", default="meme.png",
                        help="output PNG file (default: meme.png)")
    args = parser.parse_args()

    html = BASE_DIR / "meme.html"
    if not html.is_file():
        print(f"missing {html}", file=sys.stderr)
        return 1
    return render(html, resolve_output(args.output))


if __name__ == "__main__":
    raise SystemExit(main())
