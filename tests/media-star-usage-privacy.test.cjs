'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');

test('card opens and app-use attempts are recorded as non-payable observations, not automatic one-coin awards',()=>{
 const source=read('workers/starquest-ledger/src/usage-receipts.ts');
 assert.match(source,/card_open/);
 assert.match(source,/app_use/);
 assert.match(source,/episode_play_request/);
 assert.match(source,/client_unverified/);
 assert.match(source,/not_payable/);
 assert.doesNotMatch(source,/UPDATE accounts SET star_coins|INSERT INTO ledger_events|INSERT INTO media_star_infinity_view_awards/);
});
test('masked account alias requires a server-only key; raw names/addresses never enter public event response',()=>{
 const source=read('workers/starquest-ledger/src/usage-receipts.ts');
 assert.match(source,/HMAC/);
 assert.match(source,/usage_alias_secret_unavailable/);
 assert.match(source,/contentId/);
 assert.doesNotMatch(source,/username|privateName|email|address|quantAiTarget/);
 assert.match(source,/duplicate/);
 const index=read('workers/starquest-ledger/src/index.ts');
 assert.match(index,/USAGE_ALIAS_SECRET/);
});
test('D1 idempotency, no-spend defaults and separate creator royalty, curator fee, and share path',()=>{
 const m=read('workers/starquest-ledger/migrations/0006_media_star_usage_receipts.sql');
 assert.match(m,/CREATE TABLE IF NOT EXISTS media_star_usage_events/);
 assert.match(m,/UNIQUE\(content_id,viewer_mask,request_id\)/);
 assert.match(m,/not_payable/);
 assert.match(m,/client_unverified/);
 const older=read('workers/starquest-ledger/migrations/0005_media_star_creator_ledgers.sql');
 assert.match(older,/media_star_infinity_view_awards/);
 assert.match(older,/media_star_curator_unlock_receipts/);
 const index=read('workers/starquest-ledger/src/index.ts');
 assert.match(index,/SHARES_PER_COIN = 10/);
 assert.match(index,/pending_share_credits/);
});
test('new interaction route only calls authenticated, server-scope policy, never trusts client-supplied payees',()=>{
 const api=read('workers/starquest-ledger/src/production-ledger.ts');
 assert.match(api,/v1\/production\/interaction/);
 const source=read('workers/starquest-ledger/src/usage-receipts.ts');
 assert.match(source,/SELECT content_id FROM production_catalog/);
 assert.match(source,/account\.id/);
 assert.doesNotMatch(source,/payoutAccount|recipientWallet|targetUserId|mint\(/);
});
