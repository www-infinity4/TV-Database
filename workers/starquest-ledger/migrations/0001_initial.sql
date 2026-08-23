PRAGMA foreign_keys = ON;

CREATE TABLE accounts (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL COLLATE NOCASE UNIQUE,
  credential_hash TEXT NOT NULL,
  star_coins INTEGER NOT NULL DEFAULT 0 CHECK (star_coins >= 0),
  pending_share_credits INTEGER NOT NULL DEFAULT 0 CHECK (pending_share_credits BETWEEN 0 AND 9),
  share_count INTEGER NOT NULL DEFAULT 0 CHECK (share_count >= 0),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE account_devices (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);

CREATE INDEX account_devices_account_idx ON account_devices(account_id);

CREATE TABLE share_receipts (
  idempotency_key TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  method TEXT NOT NULL,
  receipt_hash TEXT,
  show_title TEXT,
  episode_id TEXT,
  company_id TEXT,
  actors_json TEXT NOT NULL DEFAULT '[]',
  fully_watched INTEGER NOT NULL DEFAULT 0 CHECK (fully_watched IN (0, 1)),
  attribution_status TEXT NOT NULL DEFAULT 'actor_credits_pending',
  payout_status TEXT NOT NULL DEFAULT 'pending_server_review',
  created_at INTEGER NOT NULL,
  credited_at INTEGER
);

CREATE INDEX share_receipts_account_created_idx
  ON share_receipts(account_id, created_at DESC);

CREATE TABLE ledger_events (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  balance INTEGER NOT NULL,
  progress_to_next_coin INTEGER NOT NULL,
  shares_per_coin INTEGER NOT NULL DEFAULT 10,
  reference_id TEXT,
  content_id TEXT,
  company_id TEXT,
  actors_json TEXT NOT NULL DEFAULT '[]',
  attribution_status TEXT,
  payout_status TEXT,
  created_at INTEGER NOT NULL
);

CREATE INDEX ledger_events_account_created_idx
  ON ledger_events(account_id, created_at DESC);

CREATE TABLE watch_history (
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  episode_id TEXT NOT NULL,
  show_id TEXT,
  show_title TEXT NOT NULL,
  episode_title TEXT NOT NULL,
  thumbnail TEXT,
  genre TEXT,
  decade TEXT,
  tags_json TEXT NOT NULL DEFAULT '[]',
  watched_seconds INTEGER NOT NULL DEFAULT 0,
  position_seconds INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  completion_rate REAL NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
  play_count INTEGER NOT NULL DEFAULT 1,
  started_at INTEGER NOT NULL,
  last_watched_at INTEGER NOT NULL,
  PRIMARY KEY (account_id, episode_id)
);

CREATE INDEX watch_history_account_recent_idx
  ON watch_history(account_id, last_watched_at DESC);
