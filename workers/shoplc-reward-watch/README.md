# ShopLC StarCoin reward watchdog

The `shoplc-reward-watch` Cloudflare Worker is an **audit-only** watcher bound to the existing StarQuest D1 database. It must not mint, restore, debit, credit, or transfer StarCoins. It runs every five minutes. GitHub Actions checks its `/health` endpoint every 15 minutes and creates/updates a repository issue for Robot Brain when anomalies or watcher outages occur. No browser user must navigate GitHub.

The three first-party facts checked are: an authenticated ShopLC buy/bid click signal in `shoplc_click_signals`; its exact-account, exact-click reward receipt in `shoplc_reward_receipts`; and the corresponding five-coin `shoplc_click_reward` record in `ledger_events`.

Status definitions: `delivered` means the receipt is marked credited and its ledger entry is five StarCoins; `missing_receipt` means a modern click signal has no matching reward receipt after a 2-minute grace; `receipt_pending` means a reward receipt is present but uncredited; `receipt_no_ledger` means a credited receipt lacks a matching payout event; `wrong_amount` catches a non-five-unit event; `duplicate_ledger` detects multiple ledger payouts for one receipt, even if each is +5; `ledger_orphan` means a payout event lacks its source receipt; and `too_many_daily` catches more than three credited receipts per account/day. `legacy_unlinked` means older ShopLC source clicks have different IDs from payout calls. **Legacy unlinked is not proof a reward was missing**, and no double payout may be made from it. Such historical clicks are separately counted as `historicalReview`, not as fresh actionable payout failures; the Robot Brain issue remains open for documented historical review without triggering the same new-missing-credit alarm every 15 minutes.

Database tables created idempotently: `shoplc_reward_watch_results` and `shoplc_reward_watch_runs`, which contain internal account IDs. The public `/health` route shows only aggregate counts; it does not reveal any account identifiers, passwords, or wallet device tokens. Individual disputes must be reconciled by an authorized backend reviewing the original account ID, click timestamps, receipt ID, and ledger entry.

The source lives in `workers/shoplc-reward-watch/worker.js` and its Cloudflare settings in `workers/shoplc-reward-watch/wrangler.jsonc`. Deploy with the Cloudflare account's authorized Worker deployment method. Both cron and workers.dev health access must be enabled for the intended monitoring schedule. The GitHub Actions watcher is in `.github/workflows/shoplc-reward-watch.yml`.

The ShopLC application should reuse **the same newly generated click ID** in both `/v1/shoplc/clicks` and `/v1/shoplc/rewards` before the watcher can give an exact verdict on *every* future click. The older client sends separate IDs: those older records require review and are intentionally excluded from automatic compensation.

The user's established policy is five **non-fiat StarCoin data tokens** per eligible Buy/Bid click, no more than three confirmed awards per Central calendar day. A first-party Buy Item click is **not proof of a Shop LC checkout purchase**. The watcher cannot independently verify a completed Shop LC purchase or prevent all malicious, fabricated first-party clicks. Better item-attestation and account protections should be added before considering automated financial reconciliation.

**Required proof before marking resolved:** authenticated account and click evidence, matching reward receipt, matching five-coin ledger event and correct wallet readback. A health check alone does not prove a user's browser wallet has refreshed.


## Audit classification safeguards

The watcher groups payout events by account and receipt before evaluating settlement. A receipt with two matching ledger events is flagged `duplicate_ledger` rather than being incorrectly counted as two successful deliveries. The scan reports `flagged` for actionable current anomalies, with `historicalReview` separately counting old unlinked signals. An older unmatched click should never automatically generate five new StarCoins. The GitHub issue reports the difference and avoids unnecessary edits when its findings have not changed. The public health endpoint remains aggregate-only; internal IDs stay in D1.
