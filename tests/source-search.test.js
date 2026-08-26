"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("js/app.js", "utf8");
const source = fs.readFileSync("js/source-search.js", "utf8");

assert.match(html, /id="source-search-open"/);
assert.match(html, /id="source-search-category"/);
assert.match(html, /Search Google for Archive\/YouTube sources/);
assert.match(html, /js\/source-search\.js\?v=20260826-search1/);
assert.match(source, /mediatype:movies/);
assert.match(source, /archive\.org\/advancedsearch\.php/);
assert.match(source, /archive\.org\/metadata\//);
assert.match(source, /archive\.org\/download\//);
assert.match(source, /file\.private === true/);
assert.match(source, /REJECT_FILE/);
assert.match(source, /starquest\.source\.inventory\.v1/);
assert.match(source, /starquest:source-selected/);
assert.match(app, /addDiscoveredShows\("movies", \[show\]\)/);
assert.match(app, /openPlayer\(episode, show\.title\)/);
assert.doesNotMatch(source, /fetch\([^\n]*google\.com/i);

console.log("verified source search, local inventory, and direct playback contract: ok");
