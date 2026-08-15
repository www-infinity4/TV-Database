# Guarded Actuator Contract

The Actuator converts an approved intent into a reviewable proposal. It is not
an autonomous administrator.

## Required proposal fields

- request ID, author/profile, UTC timestamp, and objective
- target repository and non-default branch
- allowlisted paths and explicit operations
- base commit and proposed patch hash
- evidence references and declared upstream licenses
- required unit, integration, security, and format-preservation checks
- rollback description and expiration time

## Hard gates

1. Reject default-branch writes, force pushes, deletions outside the allowlist,
   mutable upstream references, or unknown licenses.
2. Reject reads of credentials, signing material, wallet data, private prompts,
   or unrelated user files.
3. Preserve `/k`, `/z`, Base, Octave2, and custom symbolic formats; a migration
   requires an explicit reversible mapping and owner review.
4. Run proposed code only in an isolated test environment with no production
   credentials or device-control channel.
5. Record the diff, checks, hashes, and tool versions in append-only evidence.
6. Open a PR; do not self-approve or self-merge. Promotion is a separate owner
   decision guarded by branch protection.

Profiles named `resilience` or `adversarial_test` may generate test fixtures
and threat scenarios only. They cannot attack external systems, evade platform
controls, rotate proxies, siphon traffic, or deploy malware.
