PRAGMA foreign_keys = ON;

CREATE TABLE consensus_runs (
  id TEXT PRIMARY KEY,
  application TEXT NOT NULL,
  repository TEXT NOT NULL,
  input_hash TEXT NOT NULL,
  proposal_hash TEXT NOT NULL,
  independent_hash TEXT NOT NULL,
  final_hash TEXT NOT NULL,
  agreement TEXT NOT NULL,
  model TEXT NOT NULL,
  duration_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX consensus_runs_created_idx ON consensus_runs(created_at DESC);

CREATE TABLE rate_windows (
  window_key TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);

CREATE INDEX rate_windows_expires_idx ON rate_windows(expires_at);
