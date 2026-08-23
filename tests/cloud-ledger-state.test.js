const assert = require("node:assert/strict");

const values = new Map();
global.localStorage = {
  getItem: key => values.has(key) ? values.get(key) : null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key)
};
const dispatched = [];
global.CustomEvent = class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
global.document = { dispatchEvent(event) { dispatched.push(event); } };
global.window = { crypto: null };

require("../js/auth.js");

(async () => {
  const auth = global.window.StarQuestAuth;
  await auth.register("kris", "pass1234");
  auth.recordShare("old-show", { attemptId: "old-share", confirmed: true, verified: true });

  const result = auth.applyCloudState({
    username: "kris",
    starCoins: 2,
    pendingShareCredits: 4,
    shareCount: 24,
    watchHistory: [{
      episodeId: "hitchcock-episode",
      showTitle: "Alfred Hitchcock Presents",
      epTitle: "Cloud-saved episode",
      watchedSeconds: 1500,
      positionSeconds: 1500,
      duration: 1500,
      completed: true,
      lastWatchedAt: Date.now()
    }],
    ledger: [{
      id: "ledger-cloud-share",
      type: "share_credit",
      amount: 0,
      balance: 2,
      progressToNextCoin: 4,
      sharesPerCoin: 10,
      ts: Date.now()
    }]
  });

  assert.equal(result.ok, true);
  assert.equal(auth.getBalance(), 2);
  assert.equal(auth.currentUser().pendingShareCredits, 4);
  assert.equal(auth.currentUser().shareCount, 24);
  assert.equal(auth.getHistory()[0].episodeId, "hitchcock-episode");
  assert.equal(auth.getWatchPosition("hitchcock-episode"), 1500);
  assert.ok(auth.getLedger().some(entry => entry.id === "ledger-cloud-share"));
  assert.ok(dispatched.some(event => event.type === "starquest:cloud-synced"));

  const mismatch = auth.applyCloudState({ username: "someone-else", starCoins: 999 });
  assert.equal(mismatch.ok, false);
  assert.equal(auth.getBalance(), 2);
  console.log("cloud state restores StarCoins, 4/10 progress, and watch history: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
