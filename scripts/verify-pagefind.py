#!/usr/bin/env python3
"""Check that mdBook output contains a complete Japanese Pagefind site."""

from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
import tomllib
from urllib.parse import urlsplit

EXCLUDED = {"print.html", "404.html", "toc.html"}
REQUIRED_ASSETS = ("pagefind-component-ui.css", "pagefind-component-ui.js", "pagefind.js", "pagefind-worker.js")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.lang = None
        self.main_count = 0
        self.marked_main_count = 0
        self.assets = []

    def handle_starttag(self, tag, attrs) -> None:
        values = dict(attrs)
        if tag == "html":
            self.lang = values.get("lang")
        if tag == "main":
            self.main_count += 1
            self.marked_main_count += "data-pagefind-body" in values
        if tag == "link" and "pagefind" in values.get("href", ""):
            self.assets.append(values["href"])
        if tag == "script" and "pagefind" in values.get("src", ""):
            self.assets.append(values["src"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", type=Path, default=Path("book"))
    site = parser.parse_args().site.resolve()
    config_path = Path(__file__).resolve().parents[1] / "book.toml"
    with config_path.open("rb") as config_file:
        config = tomllib.load(config_file)
    html_config = config["output"]["html"]
    errors = []
    if html_config.get("search", {}).get("enable", True):
        errors.append("mdBook standard search is enabled")
    pages = []
    for path in sorted(site.rglob("*.html")):
        relative = path.relative_to(site).as_posix()
        document = PageParser()
        page_html = path.read_text(encoding="utf-8")
        document.feed(page_html)
        if relative in EXCLUDED:
            if document.marked_main_count:
                errors.append(f"excluded page is indexed: {relative}")
            continue
        if document.lang != "ja":
            errors.append(f"expected lang=ja: {relative}")
        if document.main_count != 1 or document.marked_main_count != 1:
            errors.append(f"expected one indexed main element: {relative}")
        if not any("pagefind-init-" in asset for asset in document.assets):
            errors.append(f"missing mdBook Pagefind initializer: {relative}")
        for asset in document.assets:
            asset_path = (site / Path(relative).parent / urlsplit(asset).path).resolve()
            if not asset_path.is_file() or not asset_path.is_relative_to(site):
                errors.append(f"missing or unsafe Pagefind asset {asset}: {relative}")
            if "pagefind-init-" in asset and asset_path.is_file():
                initializer = asset_path.read_text(encoding="utf-8")
                if 'config.setAttribute("base-url", siteBase.pathname)' not in initializer:
                    errors.append(f"Pagefind initializer does not derive its base URL from its served path: {relative}")
                if 'config.setAttribute("bundle-path", pagefindBase.pathname)' not in initializer:
                    errors.append(f"Pagefind initializer does not derive its bundle path from its served path: {relative}")
        pages.append(relative)

    entry_path = site / "pagefind" / "pagefind-entry.json"
    if not entry_path.is_file():
        errors.append("missing pagefind/pagefind-entry.json")
    else:
        entry = json.loads(entry_path.read_text(encoding="utf-8"))
        if entry.get("version") != "1.5.2":
            errors.append(f"expected Pagefind 1.5.2, got {entry.get('version')}")
        ja = entry.get("languages", {}).get("ja", {})
        if ja.get("page_count") != len(pages):
            errors.append(f"Japanese index has {ja.get('page_count')} pages; expected {len(pages)}")
    for filename in REQUIRED_ASSETS:
        if not (site / "pagefind" / filename).is_file():
            errors.append(f"missing Pagefind asset: pagefind/{filename}")
    if not list(site.glob("pagefind-init-*.js")):
        errors.append("missing generated pagefind-init.js asset")
    if any(path.name == "searchindex.js" for path in site.rglob("*.js")):
        errors.append("mdBook standard search index is present")
    if errors:
        raise SystemExit("Pagefind verification failed:\n- " + "\n- ".join(errors))
    print(f"Verified Japanese Pagefind output: {len(pages)} pages; excluded print.html and utility pages")


if __name__ == "__main__":
    main()
