# StarQuest Backend Migration Plan (Post-Prototype)

This repository currently uses a **local-browser prototype** account model only. The plan below describes a real backend migration (for example, Supabase) without claiming production readiness.

## 1) Auth and profiles
- Move to Supabase Auth (email and username sign-in paths).
- Implement password reset flow via secure email links.
- Add `profiles` table for public username/avatar/preferences.

## 2) Server-authoritative wallet
- Store StarCoin balance server-side (never browser-authoritative).
- Create immutable `wallet_transactions` table (credits/debits only, append-only).
- Use DB functions/transactions for all wallet mutations.
- Enforce non-negative balance at DB layer.

## 3) Entitlements and unlocks
- Add `content_unlocks` table keyed by `user_id + content_id`.
- Unlock writes and wallet debits happen atomically in one DB transaction.

## 4) Watch/share reward records
- Store watch-history and resume events separately from all StarCoin rewards.
- Add `share_reward_events` with verifiable referral/share tokens (not client-claimed only).
- Prevent replay/double-award with unique constraints and idempotency keys.

## 5) History and recommendations
- Move watch history to backend (`watch_history` table with current extended model fields).
- Generate recommendation inputs server-side; return deterministic ranked sets + reason text.

## 6) Security and abuse controls
- Apply row-level security (RLS) on all user-owned tables.
- Rate-limit reward endpoints and share-token redemption.
- Add anomaly checks for watch/share abuse.
- Keep all privileged logic server-side.
- **Never expose Supabase service-role secret in browser JavaScript.**

## 7) Rollout strategy
- Dual-write migration period (local + backend), then backend-only.
- Backfill local data to backend once user authenticates.
- Add telemetry and reconciliation scripts for wallet/unlock integrity.
