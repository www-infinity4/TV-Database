const assert = require("node:assert/strict");

const values = new Map();
global.localStorage = {
  getItem: key => values.has(key) ? values.get(key) : null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key)
};
global.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
global.document = { dispatchEvent() {} };
global.window = { crypto: null };

require("../js/auth.js");

(async () => {
  const auth = global.window.StarQuestAuth;
  const user = await auth.register("share-tester", "pass1234");
  assert.equal(user.username, "share-tester");

  const pending = auth.recordShare("show|pending", {
    confirmed: false,
    verified: false,
    method: "copy_link",
    status: "client_handoff_unverified"
  });
  assert.equal(pending.ok, true);
  assert.equal(pending.credited, false);
  assert.equal(pending.progressToNextCoin, 0);
  assert.equal(auth.currentUser().shareEvents.at(-1).verificationState, "pending_verification");
  assert.equal(auth.currentUser().shareEvents.at(-1).payoutEligible, false);

  for (let index = 1; index <= 10; index += 1) {
    const result = auth.recordShare(`show|episode-${index}`, {
      attemptId: `attempt-${index}`,
      confirmed: true,
      verified: true,
      fullyWatched: false,
      method: "web_share_api"
    });
    assert.equal(result.ok, true);
    assert.equal(result.credited, true);
    assert.equal(result.awarded, index === 10 ? 1 : 0);
  }

  assert.equal(auth.getBalance(), 1);
  const shareCommits = auth.getLedger().filter(entry => entry.type === "share_credit");
  assert.equal(shareCommits.length, 10);
  assert.equal(shareCommits[0].progressToNextCoin, 1);
  assert.equal(shareCommits.at(-1).progressToNextCoin, 10);
  assert.match(shareCommits[0].commitHash, /^sq-[0-9a-f]{8}$/);
  const current = auth.currentUser();
  assert.equal(current.shareCount, 10);
  assert.equal(current.pendingShareCredits, 0);
  assert.equal(current.shareEvents.at(-1).verificationState, "client_confirmed");
  assert.equal(current.shareEvents.at(-1).payoutEligible, false);
  assert.equal(auth.getLedger().at(-1).type, "share_reward");

  const duplicate = auth.recordShare("show|episode-10", {
    attemptId: "attempt-10",
    confirmed: true,
    verified: true,
    method: "web_share_api"
  });
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.error, "duplicate_share_attempt");
  assert.equal(auth.getBalance(), 1);
  console.log("unverified copy -> no credit; 10 verified native shares -> StarCoin; duplicate attempt blocked: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
