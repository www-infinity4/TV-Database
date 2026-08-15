#!/usr/bin/env python3
"""FORKNIGHT metadata evaluator. It never clones, installs, executes, or forks."""

from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass, asdict
from datetime import date
from pathlib import Path
from typing import Iterable

ALLOWED_LICENSES = {"MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause", "ISC"}
REVIEW_LICENSES = {"MPL-2.0", "LGPL-2.1", "LGPL-3.0", "GPL-2.0", "GPL-3.0", "AGPL-3.0", "custom", "mixed"}
SHA_LENGTH = 40


@dataclass(frozen=True)
class Decision:
    repository: str
    decision: str
    reasons: tuple[str, ...]
    provenance_hash: str


def valid_pin(value: object) -> bool:
    text = str(value or "")
    return len(text) == SHA_LENGTH and all(char in "0123456789abcdef" for char in text)


def evaluate(entry: dict) -> Decision:
    reasons: list[str] = []
    license_id = str(entry.get("license_spdx") or "")
    if not entry.get("repository") or "/" not in str(entry.get("repository")):
        reasons.append("invalid_repository")
    if not valid_pin(entry.get("pin")):
        reasons.append("mutable_ref_only")
    if not entry.get("license_scope"):
        reasons.append("license_scope_missing")
    if entry.get("archived"):
        reasons.append("archived")

    if license_id in ALLOWED_LICENSES and not reasons:
        decision = "ADAPTER_REVIEW"
    elif license_id in REVIEW_LICENSES:
        decision = "LICENSE_REVIEW"
    elif not license_id:
        decision = "REJECT"
        reasons.append("no_license")
    else:
        decision = "LICENSE_REVIEW"
        reasons.append("unknown_license")

    canonical = json.dumps(entry, sort_keys=True, separators=(",", ":")).encode()
    return Decision(
        repository=str(entry.get("repository") or ""),
        decision=decision,
        reasons=tuple(sorted(set(reasons))),
        provenance_hash=hashlib.sha256(canonical).hexdigest(),
    )


def build_search_shards(
    topics: Iterable[str],
    languages: Iterable[str],
    start_year: int,
    end_year: int,
) -> list[str]:
    """Create GitHub queries small enough to avoid the 1,000-result search cap."""
    shards: list[str] = []
    for year in range(start_year, end_year + 1):
        for month in range(1, 13):
            next_year, next_month = (year + 1, 1) if month == 12 else (year, month + 1)
            start = date(year, month, 1).isoformat()
            end = date(next_year, next_month, 1).isoformat()
            for topic in topics:
                for language in languages:
                    shards.append(
                        f"topic:{topic} language:{language} created:{start}..{end}"
                    )
    return shards


def scan(registry: dict) -> dict:
    entries = registry.get("entries")
    if not isinstance(entries, list):
        raise ValueError("registry entries must be a list")
    decisions = [evaluate(item) for item in entries if isinstance(item, dict)]
    return {
        "schema_version": 1,
        "source_generated_at": registry.get("generated_at"),
        "summary": {
            "total": len(decisions),
            "adapter_review": sum(item.decision == "ADAPTER_REVIEW" for item in decisions),
            "license_review": sum(item.decision == "LICENSE_REVIEW" for item in decisions),
            "rejected": sum(item.decision == "REJECT" for item in decisions),
        },
        "decisions": [asdict(item) for item in decisions],
        "authority": {
            "executed_code": False,
            "created_forks": False,
            "pushed_changes": False,
            "merged_changes": False,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--registry", default="forkables.json")
    parser.add_argument("--output", default="discovery-report.json")
    args = parser.parse_args()
    registry = json.loads(Path(args.registry).read_text(encoding="utf-8"))
    report = scan(registry)
    Path(args.output).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report["summary"], sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
