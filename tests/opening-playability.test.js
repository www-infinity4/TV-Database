"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const dataSource = fs.readFileSync("js/data.js", "utf8");
const appSource = fs.readFileSync("js/app.js", "utf8");
const context = {};
vm.runInNewContext(dataSource + ";globalThis.__shows = SHOWS;", context);

const abyss = context.__shows.find((show) => show.id === "the-abyss-1989");
assert.ok(abyss, "The Abyss remains cataloged for information and future source mapping");
assert.equal(abyss.payToWatch, true);
assert.ok(abyss.episodes[0].youtubeId);
assert.equal(abyss.episodes[0].archiveId, undefined, "The Abyss has no verified full Archive source");

assert.match(appSource, /showUnlockCost\(show\) > 0 && ep\.youtubeId && !ep\.archiveId && !ep\.archiveFile/);
assert.match(appSource, /isShowAvailable\(show\) && showUnlockCost\(show\) === 0/);
assert.doesNotMatch(appSource, /show\.episodes\.find\(isEpisodePlayable\) \|\| show\.episodes\[0\]/);

console.log("opening hero excludes locked rentals and never falls back to an unavailable episode: ok");
