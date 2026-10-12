#!/usr/bin/env python3
"""Prepare pinned, self-hosted Mermaid assets without Node.js."""

from __future__ import annotations

import base64
import hashlib
import io
import re
import subprocess
import tarfile
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
MERMAID_JS = ROOT / "mermaid.min.js"
MERMAID_INIT_JS = ROOT / "mermaid-init.js"

MDBOOK_VERSION = "mdbook v0.5.4"
PREPROCESSOR_VERSION = "mdbook-mermaid 0.17.1"
MERMAID_VERSION = "11.16.1"
MERMAID_TARBALL_URL = "https://registry.npmjs.org/mermaid/-/mermaid-11.16.1.tgz"
MERMAID_TARBALL_SHA512_SRI = (
    "sha512-TQsq6u22fAn3rek5VOubrhKPo1g5hwC3FXUN9hiyupTckcYiGuuKGkNQrKYwGJkX"
    "UxZdojwRG46gsSCFZMDp4g=="
)
MERMAID_ASSET_SHA256 = "18327bef70d96fb505fe7287d9f6a7362ebf07ff6576ddfaffb1a06f3e1a2954"
EMBEDDED_MERMAID_ASSET_SHA256 = "eefea253bed9655e838eb874ff955c46872f982a8e26290c1dd2982ddc0a4703"
UPSTREAM_INIT_SHA256 = "53b67c5380e8f4dac4cd080370cfbe69ee46aced71c597eeaa5f55a3a9877611"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fail(message: str) -> None:
    raise SystemExit(f"Mermaid asset preparation failed: {message}")


def verify_tool_version(command: str, expected: str) -> None:
    result = subprocess.run(
        [command, "--version"],
        check=True,
        capture_output=True,
        text=True,
        cwd=ROOT,
    )
    actual = result.stdout.strip()
    if actual != expected:
        fail(f"expected {expected!r}, got {actual!r}")


def read_current(path: Path, accepted_hashes: set[str]) -> str | None:
    if not path.exists():
        return None
    digest = sha256(path.read_bytes())
    if digest not in accepted_hashes:
        fail(
            f"{path.name} exists with unrecognized contents; it was left untouched. "
            "Review any local customization before preparing assets."
        )
    return digest


def fetch_pinned_mermaid() -> bytes:
    request = urllib.request.Request(
        MERMAID_TARBALL_URL,
        headers={"User-Agent": "commonplace-mermaid-asset-preparer"},
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        archive = response.read()

    expected_integrity = MERMAID_TARBALL_SHA512_SRI.removeprefix("sha512-")
    actual_integrity = base64.b64encode(hashlib.sha512(archive).digest()).decode("ascii")
    if actual_integrity != expected_integrity:
        fail("Mermaid npm archive SHA-512 integrity check failed")

    try:
        with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as bundle:
            member = bundle.getmember("package/dist/mermaid.min.js")
            if not member.isfile():
                fail("pinned archive does not contain a regular mermaid.min.js")
            extracted = bundle.extractfile(member)
            if extracted is None:
                fail("could not read mermaid.min.js from the pinned archive")
            asset = extracted.read()
    except (KeyError, tarfile.TarError) as error:
        fail(f"invalid pinned Mermaid npm archive: {error}")

    if sha256(asset) != MERMAID_ASSET_SHA256:
        fail("Mermaid.js asset SHA-256 check failed")
    version_match = re.search(rb'version:"([0-9.]+)"', asset)
    if version_match is None or version_match.group(1).decode("ascii") != MERMAID_VERSION:
        fail("downloaded asset does not report the pinned Mermaid.js version")
    return asset


def main() -> None:
    verify_tool_version("mdbook", MDBOOK_VERSION)
    verify_tool_version("mdbook-mermaid", PREPROCESSOR_VERSION)

    # Check before install: mdbook-mermaid install preserves existing files, so
    # a locally customized init script must never be silently replaced.
    read_current(MERMAID_INIT_JS, {UPSTREAM_INIT_SHA256})
    read_current(MERMAID_JS, {EMBEDDED_MERMAID_ASSET_SHA256, MERMAID_ASSET_SHA256})

    subprocess.run(
        ["mdbook-mermaid", "install", "."], check=True, cwd=ROOT
    )

    if read_current(MERMAID_INIT_JS, {UPSTREAM_INIT_SHA256}) is None:
        fail("mdbook-mermaid install did not create mermaid-init.js")

    mermaid_hash = read_current(MERMAID_JS, {EMBEDDED_MERMAID_ASSET_SHA256, MERMAID_ASSET_SHA256})
    if mermaid_hash is None:
        fail("mdbook-mermaid install did not create mermaid.min.js")
    if mermaid_hash == EMBEDDED_MERMAID_ASSET_SHA256:
        MERMAID_JS.write_bytes(fetch_pinned_mermaid())

    print(
        f"Prepared mdbook-mermaid 0.17.1 assets with Mermaid.js {MERMAID_VERSION}; "
        "the generated files remain local and are ignored by Git."
    )


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        fail(f"command {error.cmd!r} exited with status {error.returncode}")
    except OSError as error:
        fail(str(error))
