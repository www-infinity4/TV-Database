'use strict';const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const api=fs.readFileSync('workers/starquest-ledger/src/production-ledger.ts','utf8');
const route=fs.readFileSync('workers/starquest-ledger/src/index.ts','utf8');
const bridge=fs.readFileSync('js/starquest-cloud-ledger.js','utf8');
const schema=fs.readFileSync('workers/starquest-ledger/migrations/0004_production_ledger.sql','utf8');
test('authenticated immutable per-day playback receipt without minting',()=>{
 assert.match(api,/observed<30/);
 assert.match(schema,/UNIQUE\(content_id,viewer_account_id,day_key\)/);
 assert.match(api,/INSERT OR IGNORE INTO production_play_receipts/);
 assert.match(api,/creditedStarCoins:0/);assert.match(api,/spendableStarCoins:0/);
 assert.doesNotMatch(api,/UPDATE accounts SET star_coins/);
 assert.match(api,/playbackProof:'client_reported_not_independently_verified'/);
});
test('public name credits are NOT publicly claimable payments',()=>{
 assert.match(api,/findByName\(/);assert.match(api,/production_claim_requests/);
 assert.match(api,/pending_identity_and_rights_review/);
 assert.match(api,/source_submitted_needs_review/);
 assert.match(api,/wikidata_candidate_needs_review/);
 assert.match(schema,/funded_milli_starcoins INTEGER NOT NULL DEFAULT 0/);
 assert.match(api,/fundingState:'unfunded'/);
});
test('broadcaster does not register someone else as publisher',()=>{
 assert.match(api,/Only your own Media Star content/);
 assert.match(api,/publisher_mismatch/);
 assert.match(api,/creator_content_not_registered/);
 assert.match(api,/sourceURL\(c.evidenceUrl\)/);
 assert.match(api,/new Intl.DateTimeFormat\('en-US',\{timeZone:'America\/Chicago'/);
});
test('existing StarQuest wallet boundaries and payment paths stay untouched',()=>{
 assert.match(route,/await accountFromRequest\(request, env\)/);
 assert.match(route,/productionPost\(url.pathname,env.DB,account,body\)/);
 assert.match(route,/researchProductionCredits\(env.DB\)/);
 assert.match(route,/saveShare\(request, env, account, ctx\)/);
 assert.match(bridge,/recordProductionPlay/);
 assert.match(bridge,/productionHistoryProgress/);
 assert.match(bridge,/global\.SHOWS\.find/);
 assert.match(bridge,/claimProductionCredit/);
});
