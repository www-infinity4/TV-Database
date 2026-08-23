# Rogers Consensus Worker

Rogers is a server-side consensus pipeline rather than a single model response.

1. AI 1 proposes a direct answer.
2. AI 2 reasons independently to expose assumptions or a different solution.
3. The monitoring arbiter compares both and creates the final answer. Its
   decision overrides either original response when a correction is needed.

The live page and API share the same Worker. StarQuest Cosmo can call
`/v1/reason` and read `output_text`. The D1 audit ledger records hashes,
agreement status, model, timing, and application metadata without storing the
private question or draft answers.

The existing `ANTHROPIC_API_KEY` remains a Cloudflare secret and is never
written into this repository. The legacy 2026-02-16 Worker source is preserved
under `legacy/` before the production upgrade; personal contact/payment fields
in its old system prompt are redacted from the published archive.
