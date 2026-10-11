-- ShopLC observer-only tables. Does not alter accounts, reward receipts, or ledger entries.
CREATE TABLE IF NOT EXISTS shoplc_watch_findings (
  issue_key TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  day_key TEXT NOT NULL,
  category TEXT NOT NULL,
  expected INTEGER NOT NULL,
  actual INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('OPEN','RESOLVED')),
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  details TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS shoplc_watch_findings_status_idx ON shoplc_watch_findings(status,last_seen_at);
CREATE TABLE IF NOT EXISTS shoplc_watch_runs (
  run_id TEXT PRIMARY KEY,
  started_at INTEGER NOT NULL,
  completed_at INTEGER NOT NULL,
  scanned_clicks INTEGER NOT NULL,
  scanned_receipts INTEGER NOT NULL,
  open_findings INTEGER NOT NULL,
  shortfall_coins INTEGER NOT NULL,
  truncated INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS shoplc_watch_runs_recent_idx ON shoplc_watch_runs(started_at DESC);
