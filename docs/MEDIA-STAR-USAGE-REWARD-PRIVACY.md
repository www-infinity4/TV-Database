# Infinity · content-use and creator-payment accounting contract

Continues QuantaPhi #317, TV-Database PR #130 and QuantaPhi Developer #1790.
**Scope:** a review-only, server-authorized evidence ledger; no real mint, user debit,
creator royalty, curator transfer, cash balance or automated advertisement is enabled.

## Event taxonomy

| Event | What is observed | Coin settlement |
| --- | --- | --- |
| `card_open` | Signed-in visitor opens a particular card | None. Only a nonpayable usage record. |
| `episode_play_request` | Visitor requests the original media | None. Not proof of completed X/YouTube playback. |
| `app_use` | Visitor reports app engagement | None until independent in-app or server proof. |
| `production_play_receipts` | Existing self-reported 30-second evidence, one per viewer/content/day | Only issuer proposal; cannot settle from self-report. |
| `media_star_infinity_view_awards` | Proposed issuer-funded 1 StarCoin for independently qualified use | Original rights-holder's *verified*, opted-in payee account; not the curator by default. No viewer debit. |
| `media_star_curator_unlock_receipts` | Separate opt-in access purchase, price disclosed before confirmation | Exactly one verified customer debit + curator credit, atomic and idempotent. Not issuer mint. Currently disabled. |
| Existing `share_receipts` | Server-confirmed share participation | 1/10 StarCoin progress per credited share, 10 shares = 1 whole coin. Never count as another viewer royalty. |

A creator may publish a curated museum-like collection without owning its source rights.
The original production's credit/rights-holder and the curator/publisher are separate:
a customer-funded curator fee **does not** prove source-content royalty rights, and
an issuer-funded viewing proposal **does not** prove a collector is the rights-holder.

## Identity protection

`POST /v1/production/interaction` uses existing authenticated StarQuest accounts.
It takes a unique `requestId`, `contentId` and an action named above. It ignores
any client-supplied account identity, wallet recipient, suggested payout or price.
Only the server's `account.id` plus the server-only `USAGE_ALIAS_SECRET` derive
a content-scoped HMAC `viewer_mask`. The event table does **not** store the username,
real name, email address or wallet token. The secret is required to record; missing
key fails closed with 503. Duplicates return the original receipt; 100/day/content
is the maximum per signed-in viewer to limit noisy counts.

Unauthenticated visitors can view allowed public content; the route does not create
a durable visitor identity for them. Do not guess who an anonymous viewer is.

## Personalized discovery / communications

Event records are **not** consent to behavioral targeting, cross-card tracking,
advertising, messaging, or discovery of a person's name. A future Quant AI
personalization pathway needs separate visitor opt-in, controls to view/revoke
preferences, proportionate retention, account isolation, and abuse review.
A site administrator may see aggregate counts and anonymized event receipts,
not private identity mappings through this route.

## Preconditions before monetary settlement

1. Independent qualifying-use proof: trusted playback events or server-verified
   app actions; mere link open, ad view, refresh, self-report, iframe load and
   local counter are not payable.
2. Provider permission and rights for original content, plus proof that a named
   rights-holder controls a verified beneficiary wallet.
3. Explicit configured Infinity issuer-funded budget and anti-fraud policy.
   No mint should silently debit the viewer or absorb previously issued coins.
4. Curator price and free-preview terms displayed in advance, opt-in purchase and
   atomic double-entry transaction with unique receipt, sufficient balance and
   creator payout destination. Never assume a public X handle equals a wallet.
5. Separate `pending`, `verified`, `paid`, `failed` and `reconciliation_needed`
   statuses. Dispute/refund and fraud controls before public charging.
6. Independent exact-head checks, D1 migration, wallet readback, approved review,
   deployment, Android use and production receipts. Draft source is not released.

## Narrow API

`POST /v1/production/interaction`, authenticated as a StarQuest account:

```json
{"contentId":"media-star:owner_card:anepisode","action":"app_use","requestId":"meaningful_unique_action_1234"}
```

Result returns `recorded` or `duplicate`, a pseudonym and immutable event
reference; `rewardStatus:not_payable`, `rightsHolderAward:not_issued`,
`curatorFee:not_transferred`, `settledStarCoins:0`. Future verified media-use
royalties remain in the independently funded view-award track.

No cash/redeemability, paid access or guarantees are claimed for proposed tokens.
