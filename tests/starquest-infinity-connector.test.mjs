import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../workers/starquest-ledger/src/index.ts", import.meta.url), "utf8");
const migration = await readFile(new URL("../workers/starquest-ledger/migrations/0002_infinity_outbox.sql", import.meta.url), "utf8");

test("confirmed StarQuest shares enqueue a typed Infinity ledger receipt", () => {
  assert.match(source, /sourceKey:\s*"STARQUEST"/);
  assert.match(source, /actionKey:\s*"SHARE_CONFIRMED"/);
  assert.match(source, /idempotencyKey:\s*`starquest:\$\{idempotencyKey\}`/);
  assert.match(source, /INSERT OR IGNORE INTO infinity_outbox/);
});

test("the outbox retries server delivery without exposing the connector credential", () => {
  assert.match(source, /INFINITY_CONNECTOR_SECRET/);
  assert.match(source, /\/internal\/v1\/actions\/qualify/);
  assert.match(source, /ctx\.waitUntil\(flushInfinityOutbox\(env\)\)/);
  assert.match(migration, /CHECK \(status IN \('PENDING','SENT'\)\)/);
  assert.doesNotMatch(source, /Bearer\s+[A-Za-z0-9_-]{43,}/);
});
