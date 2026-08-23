CREATE TABLE IF NOT EXISTS infinity_outbox (
  idempotency_key TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','SENT')),
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL,
  last_error TEXT,
  created_at INTEGER NOT NULL,
  sent_at INTEGER
);

CREATE INDEX IF NOT EXISTS infinity_outbox_pending_idx
ON infinity_outbox(status, next_attempt_at, created_at);

CREATE TABLE IF NOT EXISTS d1_migrations (
  name TEXT PRIMARY KEY,
  applied_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO d1_migrations (name, applied_at)
VALUES ('0002_infinity_outbox.sql', unixepoch() * 1000);
