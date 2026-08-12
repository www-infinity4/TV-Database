const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const dataPath = require.resolve("../js/data.js");
const appPath = require.resolve("../js/app.js");
const dataSource = fs.readFileSync(dataPath, "utf8");
const appSource = fs.readFileSync(appPath, "utf8");
const context = {};

vm.runInNewContext(dataSource + ";globalThis.__shows = SHOWS;", context);
const shows = context.__shows;
const show = id => shows.find(item => item.id === id);

assert.ok(Array.isArray(shows) && shows.length > 0, "catalog should load");

const readingRainbow = show("reading-rainbow");
assert.equal(readingRainbow.episodes[0].archiveId, "ReadingRainbowTVSeries");
assert.equal(
  readingRainbow.episodes[0].archiveFile,
  "Reading.Rainbow.S01E01.Tight.Times.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4"
);

const hitchcock = show("new-alfred-hitchcock-presents");
assert.equal(hitchcock.episodes.length, 80);
assert.ok(hitchcock.episodes.every(episode => !episode.archiveFile.includes("/")));
assert.equal(hitchcock.episodes[0].archiveFile, "S01E00A Incident In A Small Jail.mp4");

const twilight1985 = show("the-twilight-zone-1985");
assert.equal(
  twilight1985.episodes[0].archiveFile,
  "The Twilight Zone 1985 S01E01 - Shatterday.mp4"
);
assert.ok(show("the-twilight-zone").episodes.every(episode => episode.sourceStatus === "file-missing"));

const price = show("the-price-is-right");
assert.equal(price.episodes[0].archiveFile, "September 4 1972.ia.mp4");

const mash = show("mash");
assert.equal(mash.episodes[0].archiveFile, "MASH/1/01x01 Pilot.mp4");

const seinfeld = show("seinfeld");
assert.equal(seinfeld.episodes[0].sourceStatus, "restricted");

assert.match(appSource, /Every playable catalog card starts its primary episode in one action/);
assert.match(appSource, /const episode = getPrimaryEpisode\(show\);/);
assert.match(appSource, /class="btn btn-secondary browse-episodes-btn"/);
assert.match(appSource, /browseEpisodesBtn\.addEventListener\("click"/);

const archiveUrl = (episode) =>
  "https://archive.org/download/" + encodeURIComponent(episode.archiveId) + "/" +
  episode.archiveFile.split("/").map(encodeURIComponent).join("/");
assert.equal(
  archiveUrl(hitchcock.episodes[0]),
  "https://archive.org/download/the-new-alfred-hitchcock-presents-complete/S01E00A%20Incident%20In%20A%20Small%20Jail.mp4"
);

console.log("playback catalog paths and one-tap routing: ok");
