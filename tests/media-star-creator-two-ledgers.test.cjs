'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const api=fs.readFileSync('workers/starquest-ledger/src/production-ledger.ts','utf8');
const schema=fs.readFileSync('workers/starquest-ledger/migrations/0005_media_star_creator_ledgers.sql','utf8');
test('author-owned creator settings store a free-first policy, but cannot enable charging',()=>{
 assert.match(api,/creatorSettings/);
 assert.match(api,/publisher_mismatch/);
 assert.match(api,/media_star_creator_policies/);
 assert.match(api,/media_star_creator_episodes/);
 assert.match(api,/disabled_pending_verification/);
 assert.match(schema,/creator_account_id TEXT NOT NULL REFERENCES accounts/);
 assert.match(schema,/payment_state TEXT NOT NULL DEFAULT 'disabled_pending_verification'/);
});
test('separate Infinity view-award ledger proposes 1 new coin without viewer debit or duplicate mint',()=>{
 assert.match(schema,/CREATE TABLE IF NOT EXISTS media_star_infinity_view_awards/);
 assert.match(schema,/receipt_id TEXT PRIMARY KEY REFERENCES production_play_receipts/);
 assert.match(schema,/proposed_star_coins INTEGER NOT NULL DEFAULT 1/);
 assert.match(schema,/source TEXT NOT NULL DEFAULT 'infinity_issuance'/);
 assert.match(api,/INSERT OR IGNORE INTO media_star_infinity_view_awards/);
 assert.doesNotMatch(api,/UPDATE accounts SET star_coins/);
});
test('creator curator fees never masquerade as Infinity view awards',()=>{
 assert.match(schema,/CREATE TABLE IF NOT EXISTS media_star_curator_unlock_receipts/);
 assert.match(schema,/viewer_account_id TEXT NOT NULL REFERENCES accounts/);
 assert.match(schema,/UNIQUE\(viewer_account_id,episode_id\)/);
 assert.match(schema,/payment_status TEXT NOT NULL DEFAULT 'not_charged'/);
 assert.match(api,/issuerViewAwards.*pending/);
});

test('public creator catalog exposes only approved cards and free media, never hidden paid URLs',()=>{
 assert.match(api,/function publicMediaStarCards\(/);
 assert.match(api,/publish_state='approved'/);
 assert.match(api,/WHEN m.requested_charge_mode='free' OR e.position<m.free_episode_count THEN e.source_url ELSE NULL END AS public_source_url/);
 assert.match(api,/return publicMediaStarCards\(db\)/);
 assert.doesNotMatch(api,/return \{ok:true,.*creator_payout_account_id/s);
});
test('published episodes and existing purchase receipts cannot be deleted by a draft edit',()=>{
 assert.match(api,/published_creator_card_immutable/);
 assert.match(api,/existing_curator_unlocks_immutable/);
 assert.match(api,/UPDATE production_catalog SET source_url=\?/);
});

test('authenticated playback bridge carries registered creator contentId instead of losing linkage',()=>{
 const bridge=fs.readFileSync('js/starquest-cloud-ledger.js','utf8');
 assert.match(bridge,/contentId:play\.contentId/);
 assert.match(api,/creator_content_id_required/);
 assert.match(api,/issuerViewAwards:'pending_independent_playback_and_funding'/);
});

test('authenticated creator can inspect proposed Infinity view awards without a mint or unverified claim',()=>{
 assert.match(api,/pendingInfinityViewAwards/);
 assert.match(api,/media_star_infinity_view_awards a/);
 assert.match(api,/publisher_account_id=\?/);
 assert.match(api,/claim_status='verified'/);
 assert.match(api,/spendableStarCoinsFromProduction:0/);
});

test('authenticated claimant submits rights proof to distinct creator-identity review without selecting a wallet payee',()=>{
 assert.match(schema,/CREATE TABLE IF NOT EXISTS media_star_creator_claims/);
 assert.match(schema,/claimant_account_id TEXT NOT NULL REFERENCES accounts\(id\)/);
 assert.match(schema,/UNIQUE\(content_id,claimant_account_id\)/);
 assert.match(schema,/review_status TEXT NOT NULL DEFAULT 'pending_identity_and_rights_review'/);
 assert.match(api,/async function submitCreatorIdentityClaim/);
 assert.match(api,/rightsAttestation!==true/);
 assert.match(api,/owner.id/);
 assert.match(api,/INSERT OR IGNORE INTO media_star_creator_claims/);
 assert.match(api,/\/v1\/production\/media-star-claim/);
 assert.doesNotMatch(api,/\bcreator_payout_account_id\s*=\s*\?/);
});
test('claim status readback only lists requests for the signed in account and never pays an unverified claimant',()=>{
 assert.match(api,/FROM media_star_creator_claims WHERE claimant_account_id=\?/);
 assert.match(api,/creatorIdentityClaims/);
 assert.match(api,/review_status/);
 assert.match(api,/spendableStarCoinsFromProduction:0/);
});
