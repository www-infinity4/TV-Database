PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shoplc_reward_receipts (
  idempotency_key TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL UNIQUE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('buy', 'bid')),
  quant_id TEXT,
  href TEXT NOT NULL,
  reward_amount INTEGER NOT NULL DEFAULT 5 CHECK (reward_amount = 5),
  day_key TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  credited_at INTEGER,
  UNIQUE (account_id, item_key)
);

CREATE INDEX IF NOT EXISTS shoplc_reward_account_day_idx
  ON shoplc_reward_receipts(account_id, day_key, credited_at);

CREATE INDEX IF NOT EXISTS shoplc_reward_account_created_idx
  ON shoplc_reward_receipts(account_id, created_at DESC);
