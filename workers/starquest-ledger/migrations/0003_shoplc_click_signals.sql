PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS shoplc_click_signals (
  idempotency_key TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  quant_id TEXT,
  item_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  product_title TEXT,
  category TEXT,
  gemstone TEXT,
  ring_size TEXT,
  metal TEXT,
  style TEXT,
  price REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  image_url TEXT,
  action_type TEXT NOT NULL DEFAULT 'view',
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS shoplc_click_signals_account_created_idx
  ON shoplc_click_signals(account_id, created_at DESC);

CREATE INDEX IF NOT EXISTS shoplc_click_signals_account_item_idx
  ON shoplc_click_signals(account_id, item_id);
