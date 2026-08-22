const assert = require("node:assert/strict");
const fs = require("node:fs");

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
  const episodeId = "reading-rainbow|S1E1";

  auth.addToHistory({
    episodeId,
    showId: "reading-rainbow",
    showTitle: "Reading Rainbow",
    epTitle: "Episode 1",
    duration: 1800
  });
  auth.saveWatchPosition(episodeId, 412);
  auth.updateHistoryProgress(episodeId, 412, 1800, 120);

  assert.equal(auth.currentUser(), null, "guest activity must not fake a signed-in account");
  assert.equal(auth.getWatchPosition(episodeId), 412);
  assert.equal(auth.getHistory()[0].positionSeconds, 412);
  assert.equal(auth.getHistory()[0].watchedSeconds, 120, "eligible watch time stays separate from the playhead");
  assert.equal(auth.getHistory()[0].completed, false, "seeking ahead cannot mark an episode watched");

  for (let index = 0; index < 10; index += 1) {
    const share = auth.recordShare("same-program", {
      attemptId: "guest-attempt-" + index,
      confirmed: true,
      method: "web_share_api"
    });
    assert.equal(share.ok, true);
  }
  assert.equal(auth.getBalance(), 1, "guest share progress must mint at 10 completed attempts");

  const claimed = await auth.register("guest-claim", "pass1234");
  assert.equal(claimed.tokens, 1, "guest StarCoins move into the new signed-in profile");
  assert.equal(auth.getWatchPosition(episodeId), 412, "guest resume position moves into the signed-in profile");
  assert.equal(auth.getHistory().length, 1, "guest viewing history moves into the signed-in profile");

  auth.clearHistory();
  assert.equal(auth.getHistory().length, 0);
  assert.equal(auth.getWatchPosition(episodeId), 0, "clearing history also clears Continue Watching position");

  const app = fs.readFileSync("js/app.js", "utf8");
  assert.match(app, /DOM\.playerVideo\.currentTime = savedPosition/);
  assert.match(app, /positionSeconds: Math\.floor\(position\)/);
  assert.match(app, /usesEmbeddedPlayer/);
  assert.match(app, /params\.set\("start", String\(resumeAt\)\)/);
  console.log("guest history, real playhead resume, share coins and sign-in claim: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
