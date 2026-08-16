import json
import unittest
from pathlib import Path

import scanner


class ForknightTests(unittest.TestCase):
    def test_pinned_permissive_candidate_moves_to_adapter_review(self):
        item = {
            "repository": "owner/project",
            "pin": "a" * 40,
            "license_spdx": "MIT",
            "license_scope": "repository",
        }
        self.assertEqual(scanner.evaluate(item).decision, "ADAPTER_REVIEW")

    def test_mixed_license_never_auto_promotes(self):
        item = {
            "repository": "owner/project",
            "pin": "b" * 40,
            "license_spdx": "mixed",
            "license_scope": "directory-specific",
        }
        self.assertEqual(scanner.evaluate(item).decision, "LICENSE_REVIEW")

    def test_mutable_reference_is_blocked(self):
        item = {
            "repository": "owner/project",
            "pin": "main",
            "license_spdx": "MIT",
            "license_scope": "repository",
        }
        result = scanner.evaluate(item)
        self.assertNotEqual(result.decision, "ADAPTER_REVIEW")
        self.assertIn("mutable_ref_only", result.reasons)

    def test_shards_include_month_topic_and_language(self):
        shards = scanner.build_search_shards(["llm"], ["Python"], 2026, 2026)
        self.assertEqual(len(shards), 12)
        self.assertIn("topic:llm", shards[0])
        self.assertIn("language:Python", shards[0])

    def test_real_registry_is_deterministic(self):
        registry = json.loads(Path("forkables.json").read_text(encoding="utf-8"))
        first = scanner.scan(registry)
        second = scanner.scan(registry)
        self.assertEqual(first, second)
        self.assertEqual(first["summary"]["total"], 32)
        self.assertEqual(first["summary"]["adapter_review"], 28)
        self.assertEqual(first["summary"]["license_review"], 3)
        self.assertEqual(first["summary"]["rejected"], 1)
        self.assertEqual(first["authority"]["created_forks"], False)


if __name__ == "__main__":
    unittest.main()
