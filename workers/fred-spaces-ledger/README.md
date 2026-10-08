# Fred Spaces StarCoin unlocks

Production script: `fred-spaces-ledger.marvaseater.workers.dev`. This independent
Cloudflare Worker binds the **existing** `starquest-ledger` D1 database, using
StarQuest device bearer-token authentication. It does not mint coins.

## Listener rules

- The opening Fred Krueger episode `fred-0700` is always free and is never
  accepted by the billing endpoint.
- A future playable episode costs exactly **one full StarCoin** (not $0.25).
- The UI must never submit a charge until it has a verified, authorized,
  playable audio URL. Direct X replay links can be shown without charge.
- The UI must require a user's explicit confirmation before paying.
- A previous unlock for the same account and episode is free to revisit.
- The `spaces_episode_unlocks` table is created on first authenticated use,
  and StarQuest `accounts.star_coins` is the authoritative debit balance.
- Each successful debit creates a `ledger_events` receipt
  (event type `spaces_episode_unlock`, amount -1).
- An unavailable wallet, failure, or insufficient balance must never
  be treated as a successful charge.

## Endpoints

`GET /health` reports service status without accessing a wallet.
`GET /v1/spaces/unlocks` returns the authenticated listener's unlocked
IDs and whole StarCoin balance.
`POST /v1/spaces/unlock` accepts JSON `{"episodeId":"fred-0147"}`
with an existing StarQuest `sq_` device Bearer credential.

The user-facing card lives in `www-infinity4/QuantaPhi` under
`fred-spaces-radio.js` and is deliberately separated from Image Builder
and Button Person styling.

**Rights**: Metadata, excerpts, and original replay links are not licenses
to download, relay, or monetize third-party audio. Play through a native
player only after an authorized source has been verified.

## Production

The Worker has been uploaded using Cloudflare Workers API. This folder is the
version-controlled source and binding configuration for subsequent deployments.
Do not replace or overwrite the existing `starquest-ledger` Worker.
