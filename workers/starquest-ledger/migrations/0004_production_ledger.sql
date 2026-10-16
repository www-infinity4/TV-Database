-- Public credit discovery + viewer-scoped qualified-play receipts.
-- These entries DO NOT mint spendable StarCoins or represent money owed.
-- Transfer requires a future separately funded and audited settlement service.
CREATE TABLE IF NOT EXISTS production_catalog (
  content_id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  year TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  publisher_account_id TEXT REFERENCES accounts(id),
  attribution_state TEXT NOT NULL DEFAULT 'research_pending',
  research_state TEXT NOT NULL DEFAULT 'queued',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS production_catalog_title_idx ON production_catalog(title);
CREATE TABLE IF NOT EXISTS production_credits (
  credit_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES production_catalog(content_id),
  person_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL,
  evidence_url TEXT NOT NULL DEFAULT '',
  evidence_status TEXT NOT NULL DEFAULT 'needs_review',
  claimant_account_id TEXT REFERENCES accounts(id),
  claim_status TEXT NOT NULL DEFAULT 'unclaimed',
  created_at INTEGER NOT NULL,
  UNIQUE(content_id,person_key,role)
);
CREATE INDEX IF NOT EXISTS production_credits_person_idx ON production_credits(display_name COLLATE NOCASE);
CREATE TABLE IF NOT EXISTS production_play_receipts (
  receipt_id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES production_catalog(content_id),
  viewer_account_id TEXT NOT NULL REFERENCES accounts(id),
  day_key TEXT NOT NULL,
  source_kind TEXT NOT NULL DEFAULT 'self_reported_play',
  observed_seconds INTEGER NOT NULL,
  recorded_at INTEGER NOT NULL,
  UNIQUE(content_id,viewer_account_id,day_key)
);
CREATE INDEX IF NOT EXISTS production_plays_content_idx ON production_play_receipts(content_id,recorded_at);
CREATE TABLE IF NOT EXISTS production_attribution_entries (
  receipt_id TEXT NOT NULL REFERENCES production_play_receipts(receipt_id),
  credit_id TEXT NOT NULL REFERENCES production_credits(credit_id),
  proposed_milli_starcoins INTEGER NOT NULL DEFAULT 0 CHECK(proposed_milli_starcoins>=0),
  funded_milli_starcoins INTEGER NOT NULL DEFAULT 0 CHECK(funded_milli_starcoins>=0),
  payout_status TEXT NOT NULL DEFAULT 'unfunded',
  created_at INTEGER NOT NULL,
  PRIMARY KEY(receipt_id,credit_id)
);
CREATE TABLE IF NOT EXISTS production_claim_requests (
  id TEXT PRIMARY KEY,
  credit_id TEXT NOT NULL REFERENCES production_credits(credit_id),
  claimant_account_id TEXT NOT NULL REFERENCES accounts(id),
  evidence_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_identity_and_rights_review',
  created_at INTEGER NOT NULL,
  UNIQUE(credit_id,claimant_account_id)
);
CREATE TABLE IF NOT EXISTS production_research_jobs (
  content_id TEXT PRIMARY KEY REFERENCES production_catalog(content_id),
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  last_checked_at INTEGER,
  evidence_url TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT ''
);

-- Public Fred host listing, not guest verification or rights to claim a payout.
INSERT OR IGNORE INTO production_catalog(content_id,platform,source_id,title,source_url,attribution_state,research_state,created_at,updated_at) VALUES('xspaces:1OyKAjYPeXqGb','xspaces','1OyKAjYPeXqGb','Bitcoin and Coffee','https://x.com/i/spaces/1OyKAjYPeXqGb','host_listed_guest_research_pending','requires_independent_credits',0,0);
INSERT OR IGNORE INTO production_credits(credit_id,content_id,person_key,display_name,role,evidence_url,evidence_status,created_at) VALUES('fred-host-1OyKAjYPeXqGb','xspaces:1OyKAjYPeXqGb','fred-krueger','Fred Krueger','host','https://www.twitterspacegpt.com/hosts/dotkrueger','public_host_listing_only_no_payment_rights',0);
INSERT OR IGNORE INTO production_research_jobs(content_id,status,note) VALUES('xspaces:1OyKAjYPeXqGb','requires_independent_credits','No guest identified until a reliable speaker list or transcript is reviewed');
INSERT OR IGNORE INTO production_catalog(content_id,platform,source_id,title,source_url,attribution_state,research_state,created_at,updated_at) VALUES('xspaces:1MnGnPEEvWYxO','xspaces','1MnGnPEEvWYxO','Silver is a bubble. Bitcoin is the real deal.','https://x.com/i/spaces/1MnGnPEEvWYxO','host_listed_guest_research_pending','requires_independent_credits',0,0);
INSERT OR IGNORE INTO production_credits(credit_id,content_id,person_key,display_name,role,evidence_url,evidence_status,created_at) VALUES('fred-host-1MnGnPEEvWYxO','xspaces:1MnGnPEEvWYxO','fred-krueger','Fred Krueger','host','https://www.twitterspacegpt.com/hosts/dotkrueger','public_host_listing_only_no_payment_rights',0);
INSERT OR IGNORE INTO production_research_jobs(content_id,status,note) VALUES('xspaces:1MnGnPEEvWYxO','requires_independent_credits','No guest identified until a reliable speaker list or transcript is reviewed');
INSERT OR IGNORE INTO production_catalog(content_id,platform,source_id,title,source_url,attribution_state,research_state,created_at,updated_at) VALUES('xspaces:1MYxNlwEqYyGw','xspaces','1MYxNlwEqYyGw','State of the markets. Bitcoin.','https://x.com/i/spaces/1MYxNlwEqYyGw','host_listed_guest_research_pending','requires_independent_credits',0,0);
INSERT OR IGNORE INTO production_credits(credit_id,content_id,person_key,display_name,role,evidence_url,evidence_status,created_at) VALUES('fred-host-1MYxNlwEqYyGw','xspaces:1MYxNlwEqYyGw','fred-krueger','Fred Krueger','host','https://www.twitterspacegpt.com/hosts/dotkrueger','public_host_listing_only_no_payment_rights',0);
INSERT OR IGNORE INTO production_research_jobs(content_id,status,note) VALUES('xspaces:1MYxNlwEqYyGw','requires_independent_credits','No guest identified until a reliable speaker list or transcript is reviewed');
