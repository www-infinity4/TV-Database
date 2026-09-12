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

const dailyValues = new Map();
const dailyStorage = {
  getItem(key) { return dailyValues.has(key) ? dailyValues.get(key) : null; },
  setItem(key, value) { dailyValues.set(key, value); },
};
const morning = new Date(2026, 8, 12, 8, 0, 0);
const evening = new Date(2026, 8, 12, 22, 0, 0);
const nextDay = new Date(2026, 8, 13, 0, 1, 0);
const todayPick = window.StarQuestOpening.choose(candidates, { daily: true, date: morning, storage: dailyStorage });
const refreshPick = window.StarQuestOpening.choose(candidates, { daily: true, date: evening, storage: dailyStorage });
const tomorrowPick = window.StarQuestOpening.choose(candidates, { daily: true, date: nextDay, storage: dailyStorage });
assert.equal(refreshPick.id, todayPick.id, "refreshing must keep the scheduled opening for the whole local day");
assert.notEqual(tomorrowPick.id, todayPick.id, "the scheduled opening must change after local midnight");
assert.equal(window.StarQuestOpening.nextChangeAt(morning).getHours(), 0, "the next change is local midnight");
console.log("daily opening remains stable until local midnight: ok");

