"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const dataSource = fs.readFileSync("js/data.js", "utf8");
const gateSource = fs.readFileSync("js/youtube-only-catalog.js", "utf8");
const appSource = fs.readFileSync("js/app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const context = { window: {} };

vm.runInNewContext(dataSource + "\n" + gateSource + "\n;globalThis.__shows = SHOWS;", context);
const shows = context.__shows;
const episodes = shows.flatMap((show) => show.episodes || []);
const videoIds = episodes.map((episode) => episode.youtubeId);

assert.ok(shows.length >= 140, "Existing playable YouTube catalog must remain intact");
assert.ok(shows.filter((show) => show.type === "movie").length >= 35, "Existing YouTube movie shelf must remain intact");
assert.ok(episodes.length > 0, "catalog should contain playable episodes");
assert.ok(episodes.every((episode) => /^[A-Za-z0-9_-]{11}$/.test(String(episode.youtubeId || ""))), "every episode must use a valid YouTube ID");
assert.ok(episodes.every((episode) => !episode.archiveId && !episode.archiveFile), "Archive records must not reach the live catalog");
assert.equal(new Set(videoIds).size, videoIds.length, "YouTube video IDs should not be duplicated");
assert.equal(JSON.stringify(shows).includes("archive.org"), false, "live catalog copy must not mention Archive");
assert.match(appSource, /return \/\^\[A-Za-z0-9_-\]\{11\}\$\/\.test\(String\(ep\.youtubeId \|\| ""\)\)/);
assert.ok(html.indexOf("js/data.js") < html.indexOf("js/youtube-only-catalog.js"), "YouTube gate must load immediately after source data");
assert.ok(html.indexOf("js/youtube-only-catalog.js") < html.indexOf("js/catalog-ledger.js"), "ledger must only see the filtered YouTube catalog");
assert.doesNotMatch(html, /archive-resolver|source-search|archive\.org/i);

// The historical Copilot Archive files are recoverable in a separate opt-in
// shelf, not passed through the existing live YouTube/StarCoin gate.
const heritage=fs.readFileSync("js/archive-heritage.js","utf8");
const snapshotContext={window:{},document:{readyState:"loading",addEventListener(){}}};
vm.runInNewContext(dataSource+"\n"+heritage,snapshotContext);
assert.ok(snapshotContext.window.StarQuestArchiveHeritage.count>=400,"Preserve hundreds of historical exact-file Archive records separately");
assert.equal(shows.some(show=>show.episodes.some(ep=>ep.archiveId)),false);
assert.match(heritage,/rights\(meta\)/);
console.log("StarQuest exposes only the deduplicated YouTube catalog: ok");
