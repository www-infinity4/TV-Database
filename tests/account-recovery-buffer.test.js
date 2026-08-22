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

values.set("starquest_users", JSON.stringify({
  kris: {
    username: "Kris", key: "kris", passwordHash: "sync-test", tokens: 0,
    watchHistory: [{ episodeId: "queen|S0E1", showId: "queen", showTitle: "Queen", epTitle: "Video" }],
    watchPositions: {}, shareCount: 0, pendingShareCredits: 0, shareEvents: [], ledger: []
  }
}));
values.set("starquest_session", JSON.stringify({ key: "kris", username: "Kris", signedInAt: 1 }));
values.set("starquest_guest_profile_v1", JSON.stringify({
  username: "Guest", key: "__guest__", tokens: 0,
  watchHistory: [{ episodeId: "mash|S1E1", showId: "mash", showTitle: "M*A*S*H", epTitle: "Pilot", positionSeconds: 93 }],
  watchPositions: { "mash|S1E1": 93 }, shareCount: 4, pendingShareCredits: 4,
  shareEvents: [{ id: "share-1", attemptId: "a1" }], ledger: []
}));

require("../js/auth.js");
const auth = global.window.StarQuestAuth;
const kris = auth.currentUser();
assert.equal(kris.username, "Kris");
assert.equal(kris.watchHistory.length, 2, "signed-in account reclaims stranded guest history");
assert.equal(auth.getWatchPosition("mash|S1E1"), 93);
assert.equal(kris.pendingShareCredits, 4, "signed-in account reclaims stranded StarCoin progress");
assert.equal(values.has("starquest_guest_profile_v1"), false, "recovered guest profile is removed after merge");
assert.ok(values.has("starquest_users_backup_v1"), "account updates keep a last-valid local backup");

const html = fs.readFileSync("index.html", "utf8");
const resolver = fs.readFileSync("js/archive-resolver.js", "utf8");
const watchdog = fs.readFileSync("js/playback-watchdog.js", "utf8");
assert.ok(html.indexOf("js/app.js") < html.indexOf("js/archive-resolver.js"));
assert.ok(html.indexOf("js/archive-resolver.js") < html.indexOf("js/playback-watchdog.js"));
assert.match(resolver, /archive\.org\/metadata\//);
assert.match(resolver, /video\.currentTime = resumeAt/);
assert.match(watchdog, /STALL_LIMIT_MS = 8000/);
assert.match(watchdog, /video\.pause\(\)/);
assert.doesNotMatch(html, /<video[^>]+\sloop(?:\s|=|>)/i);
console.log("Kris profile recovery, direct Archive resolver, resume and frozen-stream stop: ok");
