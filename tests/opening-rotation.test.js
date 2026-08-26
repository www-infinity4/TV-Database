"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const values = new Map();
const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const window = { localStorage };
vm.runInNewContext(fs.readFileSync("js/opening-rotation.js", "utf8"), { window, Math, JSON, Map });

const candidates = [
  { id: "show-a", type: "series" },
  { id: "movie-b", type: "movie" },
  { id: "show-c", type: "tv" },
];
const random = () => 0.4;
const picked = [
  window.StarQuestOpening.choose(candidates, { random, storage: localStorage }),
  window.StarQuestOpening.choose(candidates, { random, storage: localStorage }),
  window.StarQuestOpening.choose(candidates, { random, storage: localStorage }),
];

assert.equal(new Set(picked.map((show) => show.id)).size, 3, "each opening candidate should appear before the deck repeats");
const fourth = window.StarQuestOpening.choose(candidates, { random, storage: localStorage });
assert.notEqual(fourth.id, picked[2].id, "a new page opening must not repeat the previous pick");
assert.equal(window.StarQuestOpening.kind(candidates[1]), "Movie");
assert.equal(window.StarQuestOpening.kind(candidates[0]), "Show");

const fullCatalog = Array.from({ length: 356 }, (_, index) => ({
  id: "catalog-" + index,
  type: index % 2 ? "movie" : "tv",
}));
const fullValues = new Map();
const fullStorage = {
  getItem(key) { return fullValues.has(key) ? fullValues.get(key) : null; },
  setItem(key, value) { fullValues.set(key, value); },
};
const fullCycle = Array.from({ length: fullCatalog.length }, () =>
  window.StarQuestOpening.choose(fullCatalog, { random, storage: fullStorage })
);
assert.equal(
  new Set(fullCycle.map((show) => show.id)).size,
  356,
  "Top Spot must expose the complete 356-title deck before any repeat"
);
const nextCyclePick = window.StarQuestOpening.choose(fullCatalog, { random, storage: fullStorage });
assert.notEqual(nextCyclePick.id, fullCycle[fullCycle.length - 1].id, "cycle boundary must not repeat the last title");
console.log("opening rotation uses a persistent no-repeat deck: ok");
