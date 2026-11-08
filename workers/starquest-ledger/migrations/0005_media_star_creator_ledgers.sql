-- Media Star creator options and two distinct accounting streams.
-- DRAFT CONFIGURATION ONLY. No API in this migration mints, transfers, or settles any StarCoin.
-- 1) Infinity issuer-funded proposals are recorded independently of viewer balances.
-- 2) Optional curated-episode charges are separate and disabled pending a verified curator wallet.
CREATE TABLE IF NOT EXISTS media_star_creator_policies (
  content_id TEXT PRIMARY KEY REFERENCES production_catalog(content_id),
  creator_account_id TEXT NOT NULL REFERENCES accounts(id),
  requested_charge_mode TEXT NOT NULL DEFAULT 'free' CHECK(requested_charge_mode IN ('free','one_starcoin')),
  free_episode_count INTEGER NOT NULL DEFAULT 1 CHECK(free_episode_count BETWEEN 0 AND 30),
  price_star_coins INTEGER NOT NULL DEFAULT 1 CHECK(price_star_coins=1),
  payment_state TEXT NOT NULL DEFAULT 'disabled_pending_verification' CHECK(payment_state IN ('disabled_pending_verification','enabled_after_review')),
  creator_payout_account_id TEXT REFERENCES accounts(id),
  recipient_verified_at INTEGER,
  reviewed_at INTEGER,
  publish_state TEXT NOT NULL DEFAULT 'draft' CHECK(publish_state IN ('draft','review_pending','approved')),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS media_star_creator_episodes (
  episode_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES media_star_creator_policies(content_id),
  position INTEGER NOT NULL CHECK(position BETWEEN 0 AND 29),
  title TEXT NOT NULL,
  source_url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(content_id,position)
);
-- The platform proposes exactly 1 issuer-funded StarCoin for each distinct
-- approved playback receipt. This table is independent of accounts.star_coins,
-- and of curator unlocks, and must not be counted as spendable until reviewed.
CREATE TABLE IF NOT EXISTS media_star_infinity_view_awards (
  receipt_id TEXT PRIMARY KEY REFERENCES production_play_receipts(receipt_id),
  content_id TEXT NOT NULL REFERENCES production_catalog(content_id),
  source TEXT NOT NULL DEFAULT 'infinity_issuance' CHECK(source='infinity_issuance'),
  proposed_star_coins INTEGER NOT NULL DEFAULT 1 CHECK(proposed_star_coins=1),
  beneficiary_credit_id TEXT REFERENCES production_credits(credit_id),
  verification_status TEXT NOT NULL DEFAULT 'pending_playback_and_rights',
  payout_status TEXT NOT NULL DEFAULT 'unfunded_unclaimed',
  settled_star_coins INTEGER NOT NULL DEFAULT 0 CHECK(settled_star_coins BETWEEN 0 AND 1),
  settlement_receipt TEXT UNIQUE,
  created_at INTEGER NOT NULL
);
-- Reservation for a *different*, customer-funded curator entitlement.
-- No charge operation writes to this table until beneficiary, pricing consent,
-- moderation and atomic wallet transfer have passed independent review.
CREATE TABLE IF NOT EXISTS media_star_curator_unlock_receipts (
  request_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES media_star_creator_policies(content_id),
  episode_id TEXT NOT NULL REFERENCES media_star_creator_episodes(episode_id),
  viewer_account_id TEXT NOT NULL REFERENCES accounts(id),
  curator_account_id TEXT NOT NULL REFERENCES accounts(id),
  requested_price_star_coins INTEGER NOT NULL DEFAULT 1 CHECK(requested_price_star_coins=1),
  payment_status TEXT NOT NULL DEFAULT 'not_charged',
  transfer_receipt TEXT UNIQUE,
  created_at INTEGER NOT NULL,
  UNIQUE(viewer_account_id,episode_id)
);

-- Signed user rights claim: a pending application, never a verified royalty,
-- payout routing rule or authorization to mint/transfer a StarCoin.
CREATE TABLE IF NOT EXISTS media_star_creator_claims (
  claim_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES production_catalog(content_id),
  claimant_account_id TEXT NOT NULL REFERENCES accounts(id),
  creator_display_name TEXT NOT NULL CHECK(length(creator_display_name) BETWEEN 2 AND 120),
  public_evidence_url TEXT NOT NULL,
  rights_attestation_at INTEGER NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'pending_identity_and_rights_review'
    CHECK(review_status IN ('pending_identity_and_rights_review','verified','rejected','needs_more_evidence')),
  reviewed_at INTEGER,
  review_reference TEXT,
  submitted_at INTEGER NOT NULL,
  UNIQUE(content_id,claimant_account_id)
);
CREATE INDEX IF NOT EXISTS media_star_creator_claims_by_claimant ON media_star_creator_claims(claimant_account_id,submitted_at DESC);
