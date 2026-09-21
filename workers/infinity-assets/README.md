# Infinity Assets Worker

Cloudflare D1-backed global asset registry for Infinity/Omni tokens.

Endpoints:
- GET /health
- POST /v1/assets — register/update a token asset
- GET /v1/assets/search?q=...&token=... — scan assets from other tokens
- POST /v1/assets/reuse — idempotently record reuse; returns a 1 Star Coin credit event for the source token holder

Apply `migrations/0001_assets.sql` to a D1 database named `infinity-assets`, then replace the placeholder database ID in wrangler.jsonc and deploy.

The browser remains a cache. D1 is the cross-token authority. A later ledger connector should consume successful reuse events and mint the actual Star Coin server-side.
