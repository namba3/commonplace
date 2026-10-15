#!/usr/bin/env python3
"""Mark mdBook article bodies for Pagefind indexing."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

MAIN_RE = re.compile(r"<main(?=[\s>])")
EXCLUDED = {"print.html", "404.html", "toc.html"}


def mark_page(html_path: Path) -> bool:
    source = html_path.read_text(encoding="utf-8")
    matches = list(MAIN_RE.finditer(source))
    if len(matches) != 1:
        return False
    main_tag = matches[0]
    main_end = source.find(">", main_tag.end())
    if "data-pagefind-body" in source[main_tag.start() : main_end]:
        return True
    if "data-pagefind-body" in source:
        raise ValueError(f"Pagefind marker already exists in {html_path}")
    source = source[: main_tag.end()] + " data-pagefind-body" + source[main_tag.end() :]
    html_path.write_text(source, encoding="utf-8")
    return True


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", type=Path, default=Path("book"))
    site_dir = parser.parse_args().site.resolve()
    if not site_dir.is_dir():
        raise SystemExit(f"mdBook output directory does not exist: {site_dir}")

    indexed = []
    skipped = []
    for html_path in sorted(site_dir.rglob("*.html")):
        relative = html_path.relative_to(site_dir).as_posix()
        if relative in EXCLUDED:
            skipped.append(relative)
        elif mark_page(html_path):
            indexed.append(relative)
        else:
            skipped.append(relative)
    if not indexed:
        raise SystemExit("No mdBook pages were prepared for Pagefind")
    print(f"Prepared {len(indexed)} mdBook pages for Pagefind")
    print("Excluded from Pagefind: " + ", ".join(skipped))


if __name__ == "__main__":
    main()
