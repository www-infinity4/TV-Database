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

  const pending = auth.recordShare("show|pending", { confirmed: false, method: "unknown" });
  assert.equal(pending.ok, true);
  assert.equal(pending.credited, false);
  assert.equal(pending.progressToNextCoin, 0);

  for (let index = 1; index <= 10; index += 1) {
    const result = auth.recordShare(`show|episode-${index}`, {
      confirmed: true,
      fullyWatched: false,
      method: "copy_link"
    });
    assert.equal(result.ok, true);
    assert.equal(result.credited, true);
    assert.equal(result.awarded, index === 10 ? 1 : 0);
  }

  assert.equal(auth.getBalance(), 1);
  const current = auth.currentUser();
  assert.equal(current.shareCount, 10);
  assert.equal(current.pendingShareCredits, 0);
  assert.equal(current.shareEvents.at(-1).verificationState, "client_confirmed");
  assert.equal(current.shareEvents.at(-1).payoutEligible, false);
  assert.equal(auth.getLedger().at(-1).type, "share_reward");

  const duplicate = auth.recordShare("show|episode-10", { confirmed: true, method: "copy_link" });
  assert.equal(duplicate.ok, false);
  assert.equal(duplicate.error, "share_cooldown");
  assert.equal(auth.getBalance(), 1);
  console.log("share action -> 1/10 progress -> StarCoin -> cooldown: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
