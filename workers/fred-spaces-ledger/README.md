# Fred Spaces StarCoin unlocks

Production script: `fred-spaces-ledger.marvaseater.workers.dev`. This independent
Cloudflare Worker binds the **existing** `starquest-ledger` D1 database, using
StarQuest device bearer-token authentication. It does not mint coins.

## Listener rules

- The opening Fred Krueger episode `fred-0700` is always free and is never
  accepted by the billing endpoint.
- The featured initial X replay link is free. A **new curated episode discovery link** costs exactly **one full StarCoin** (not $0.25).
- Payment is for the Phi curation/discovery service, **not for the recording**. A qualifying paid candidate must be in the curated episode allowlist and have a direct, verified-format original X Spaces replay URL (not merely a generic archive listing).
- The Phi card presents a player-style **link** that opens the original X Spaces page. It does not suggest that Phi has licensed, copied, embedded, or can guarantee playback of the audio. The browser may need an X sign-in, and X may remove a replay.
- The UI discloses these limitations before the user chooses to pay. If a source has no direct X replay URL, it is not eligible to be offered as a paid curated discovery until a valid source is established.
- The UI must require a user's explicit confirmation before paying.
- A previous curated-link unlock for the same account and episode is free to revisit.
- The `spaces_episode_unlocks` table is created on first authenticated use,
  and StarQuest `accounts.star_coins` is the authoritative debit balance.
- Each *new paid unlock* transfers **one full StarCoin to Fred's verified creator account**.
  The debit (`spaces_episode_unlock`, -1) and credit
  (`spaces_episode_creator_payout`, +1) are written in one StarQuest D1 batch
  with the same attempt reference. Retrying the same unlock never pays twice.
- The destination comes only from the server-controlled
  `media_creator_payout_destinations` registry. The `fred-krueger` entry must
  have a verified StarQuest account, positive verification time, a recorded
  ownership proof reference, and a verification method of `verified_oauth`
  or `verified_admin_proof`. An X handle alone is NOT wallet proof.
- Until Fred's authenticated/verified destination is provisioned, health says
  `paymentsReady:false`; attempted purchases return
  `creator_payout_not_configured` before any debit. Never pay the curator as
  a fallback.
- The platform owner's preview is independently free. A creator buying their
  own paid unlock is credited back in the same atomic transfer.
- This is **not an automatic fee on clicking Play** or proof of audio playback.
  QuantaPhi currently opens X for the actual recording, and cannot know whether
  X played it. A separate per-play license and explicit checkout confirmation
  are needed before claiming recurring play royalties.
- October 9 payout audit discovered five -1 episode unlock entries, but no
  owner-payout entries. These historic debits require reconciliation: the owner reports only
  **one** StarCoin remaining missing, while the ledger shows independent
  share-credit rewards that can increase the same balance. Verify the exact
  shortfall before any idempotent refund or payout correction; never credit
  all five automatically. Do not remove their original receipts,
  modify other customers' balances without evidence, or mint compensation
  twice. Funding corrections require authenticated administrative approval.
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
to download, relay, or sell third-party audio. StarCoins compensate original
Phi selection and indexing only; the X owner controls the separate replay.
Use a native in-page audio player only if licensed or otherwise authorized media
is actually available.

## Production

The Worker has been uploaded using Cloudflare Workers API. This folder is the
version-controlled source and binding configuration for subsequent deployments.
Do not replace or overwrite the existing `starquest-ledger` Worker.

## Artist / AI builder attribution

The verified creator registry is independent of the QuantaPhi curator wallet.
Do not open a creator payout for Fred or any musician/host using only a display
name or X username. First collect consent and proof the destination belongs to
that contributor; record the verified StarQuest account server-side. The bot
that authored a page or plugin should be recorded as a provenance actor
(model/provider, job ID, repository, commit SHA, page/card ID, human owner,
accepted tests). It must not receive spendable tokens without an authenticated
authorized beneficiary and an explicit earning policy. An assistant cannot
self-register an independent wallet account from an untrusted prompt.

## Settlement reconciliation

Read the immutable source receipts first, then join by attempt ID to the
listener debit and creator credit. Investigate historical debit-only records
without automatically restoring or double-paying them. An unmatched charge is
an incident, not evidence of a confirmed Fred royalty. Keep `charged_at` rows
for no-fee owner previews separate from actual negative debit events.
