CREATE TABLE IF NOT EXISTS tokens (
  id TEXT PRIMARY KEY, query TEXT NOT NULL, holder_id TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY, token_id TEXT NOT NULL, holder_id TEXT, type TEXT NOT NULL, title TEXT, description TEXT,
  intent_json TEXT NOT NULL DEFAULT '[]', tags_json TEXT NOT NULL DEFAULT '[]', url TEXT, html TEXT,
  provenance_json TEXT NOT NULL DEFAULT '{}', reuse_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
  FOREIGN KEY(token_id) REFERENCES tokens(id)
);
CREATE INDEX IF NOT EXISTS idx_assets_token ON assets(token_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE TABLE IF NOT EXISTS asset_reuses (
  id TEXT PRIMARY KEY, asset_id TEXT NOT NULL, source_token_id TEXT NOT NULL, destination_token_id TEXT NOT NULL,
  source_holder_id TEXT, star_coin_amount INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL,
  UNIQUE(asset_id,destination_token_id),
  FOREIGN KEY(asset_id) REFERENCES assets(id)
);
