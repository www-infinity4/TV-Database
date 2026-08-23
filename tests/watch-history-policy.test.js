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
  await auth.register("history-tester", "pass1234");
  const openResult = auth.addToHistory({
    episodeId: "reading-rainbow|S1E1",
    showId: "reading-rainbow",
    showTitle: "Reading Rainbow",
    epTitle: "Episode 1",
    thumbnail: "episode.jpg",
    watchedSeconds: 0,
    duration: 1800
  });

  assert.equal(openResult.ok, true);
  assert.equal(auth.getHistory().length, 1);
  assert.equal(auth.getHistory()[0].showTitle, "Reading Rainbow");

  const progress = auth.recordWatchProgress("reading-rainbow|S1E1", 3600, {
    episodeId: "reading-rainbow|S1E1",
    watchedSeconds: 1800,
    duration: 1800
  });
  assert.equal(progress.ok, true);
  assert.equal(progress.awarded, 0, "watch time must never mint StarCoins");
  assert.equal(auth.getBalance(), 0);
  assert.equal(auth.getHistory()[0].completed, true);

  const app = fs.readFileSync("js/app.js", "utf8");
  const html = fs.readFileSync("index.html", "utf8");
  assert.match(app, /starquest:episode-opened/);
  assert.match(app, /function recordEpisodeOpenAtSource/);
  assert.ok(
    app.indexOf("recordEpisodeOpenAtSource(episode, showForEpisode, showTitle)") < app.indexOf('new CustomEvent("starquest:episode-opened"'),
    "history must commit directly before the cross-controller event is dispatched"
  );
  assert.doesNotMatch(
    app.slice(app.indexOf('document.addEventListener("starquest:episode-opened"'), app.indexOf('document.addEventListener("starquest:archive-direct-playback"')),
    /addToHistoryNow/,
    "the event listener must not double-count a direct history commit"
  );
  assert.match(app, /const WATCH_PERSIST_INTERVAL_SECONDS = 10;/);
  assert.match(app, /pendingPersistSeconds >= WATCH_PERSIST_INTERVAL_SECONDS/);
  assert.match(app, /twitter\.com\/intent\/tweet\?text=/);
  assert.match(app, /rewardCompletedShare\("twitter_intent", true\)/);
  assert.ok(
    app.indexOf('rewardCompletedShare("web_share_api", true)') < app.indexOf("await navigator.share({"),
    "Android share receipt must commit before the native chooser backgrounds the page"
  );
  assert.doesNotMatch(html, /coin \/ hour watched|Eligible watch-time|Earn StarCoins by watching/);
  console.log("playback logs history; watch time mints nothing; Twitter carries payload and 1\/10 credit: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
