# FORKNIGHT Repository Discovery Cart

FORKNIGHT is Mongoose.OS cart 120. It discovers useful public repositories at
large scale, records provenance, and promotes only reviewed components into the
Infinity tool layer.

Discovery is not installation. A discovered repository cannot execute, receive
secrets, modify another repository, or merge a pull request.

## Pipeline

1. DISCOVER — shard GitHub searches by topic, language, and month.
2. FINGERPRINT — record the canonical repository, default branch, immutable
   commit SHA, license, archive state, and retrieval time.
3. SCORE — evaluate maintenance, license clarity, documentation, security
   policy, tests, and compatibility.
4. QUARANTINE — inspect source and dependency lockfiles without credentials or
   network access.
5. ADAPT — write a small Mongoose adapter against a documented interface.
6. VERIFY — run unit, contract, security, and browser tests.
7. PROMOTE — owner-reviewed PR may merge an adapter and its lock record.
8. RE-INDEX — Crown Index records files, hashes, licenses, and test results.

The system may index millions of candidates, but it should fork only the small
number that must be maintained independently. Prefer upstream packages,
containers, APIs, or pinned source references over permanent forks.

## Files

- cart.json — Mongoose cart declaration.
- forkables.json — verified first-batch upstream registry.
- policy.json — machine-readable promotion gates.
- scanner.py — dependency-free evaluator and GitHub search shard generator.
- starquest-needs.json — a repeatable StarQuest scan profile for Cosmo, voice,
  recommendations, playback resilience, policy, and browser verification.
- test_scanner.py — deterministic safety and scoring tests.
- rounds/ — verified ingestion decisions, including unresolved names.
- zones/ — stable adapter boundaries and the Infinity / Omni direction model.
- rounds/ROUND-5.md — live-verified visualization, workflow, policy, state, code-intelligence, and telemetry foundations.

## Run

    python3 scanner.py --registry forkables.json --output discovery-report.json
    python3 scanner.py --registry forkables.json --profile starquest-needs.json --output starquest-scan-report.json
    python3 -m unittest -v test_scanner.py

scanner.py does not fork, clone, install, execute, push, or merge repositories.
Those are separate, review-gated carts.
