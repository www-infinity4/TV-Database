-- Ledger #317: authenticated but pseudonymized card engagement observations.
-- Requires 0004 + 0005. This is NOT a StarCoin, payout, ad targeting or minting table.
-- Actual creator view award proposals remain in 0005; paid curator entitlements
-- remain in their distinct table; share rewards stay in StarQuest share_receipts.
CREATE TABLE IF NOT EXISTS media_star_usage_events (
 receipt_id TEXT PRIMARY KEY,
 content_id TEXT NOT NULL REFERENCES production_catalog(content_id),
 viewer_mask TEXT NOT NULL CHECK(length(viewer_mask)>=12),
 request_id TEXT NOT NULL,
 event_type TEXT NOT NULL CHECK(event_type IN ('card_open','app_use','episode_play_request')),
 observed_day TEXT NOT NULL,
 observation_state TEXT NOT NULL DEFAULT 'client_unverified'
  CHECK(observation_state IN ('client_unverified','provider_verified','rejected')),
 reward_state TEXT NOT NULL DEFAULT 'not_payable'
  CHECK(reward_state IN ('not_payable','eligible_after_review','rejected')),
 settled_milli_starcoins INTEGER NOT NULL DEFAULT 0 CHECK(settled_milli_starcoins=0),
 recorded_at INTEGER NOT NULL,
 UNIQUE(content_id,viewer_mask,request_id)
);
CREATE INDEX IF NOT EXISTS idx_media_star_usage_day
 ON media_star_usage_events(observed_day,event_type);
-- No index on personal identifiers: only a secret-keyed, per-card viewer mask.
-- Optional interest matching / customized ads are OUT OF SCOPE until specific
-- visitor opt-in, transparency, revocation and data retention rules are built.
