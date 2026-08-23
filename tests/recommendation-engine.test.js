const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function memoryStorage(initial) {
  const values = new Map(Object.entries(initial || {}));
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
  };
}

const storage = memoryStorage();
const window = { localStorage: storage };
vm.runInNewContext(fs.readFileSync("js/recommendation-engine.js", "utf8"), { window, JSON, Map, Set });
const engine = window.StarQuestRecommendations;
const catalog = Array.from({ length: 60 }, (_, index) => ({ id: "title-" + index }));
const appSource = fs.readFileSync("js/app.js", "utf8");
const htmlSource = fs.readFileSync("index.html", "utf8");

assert.match(htmlSource, /js\/recommendation-engine\.js\?v=20260821-gap50/);
assert.match(appSource, /\.filter\(\(show\) => isShowAvailable\(show\) && showUnlockCost\(show\) === 0\)/);
assert.match(appSource, /StarQuestRecommendations\.beginVisit\(\)/);

engine.beginVisit({ storage });
const firstCycle = Array.from({ length: 51 }, () => engine.choose(catalog, { storage }));
assert.equal(new Set(firstCycle.map((show) => show.id)).size, 51, "51 picks must be unique when the catalog permits it");
assert.equal(firstCycle[0].id, "title-0", "the most relevant unseen title should be first");
assert.equal(firstCycle[50].id, "title-50", "a title cannot repeat until 50 different titles have appeared");

const ignoredStorage = memoryStorage();
const ignoredWindow = { localStorage: ignoredStorage };
vm.runInNewContext(fs.readFileSync("js/recommendation-engine.js", "utf8"), { window: ignoredWindow, JSON, Map, Set });
const ignoredEngine = ignoredWindow.StarQuestRecommendations;
ignoredEngine.beginVisit({ storage: ignoredStorage });
assert.equal(ignoredEngine.choose([{ id: "best" }, { id: "next" }], { storage: ignoredStorage, repeatGap: 1 }).id, "best");
ignoredEngine.beginVisit({ storage: ignoredStorage });
ignoredEngine.choose([{ id: "best" }, { id: "next" }], { storage: ignoredStorage, repeatGap: 1 });
ignoredEngine.beginVisit({ storage: ignoredStorage });
assert.equal(
  ignoredEngine.choose([{ id: "best" }, { id: "next" }, { id: "third" }], { storage: ignoredStorage, repeatGap: 1 }).id,
  "third",
  "ignored impressions must lose priority after their no-repeat exclusion expires"
);

ignoredStorage.setItem(ignoredEngine.storageKey, "not-json");
assert.equal(ignoredEngine.choose(catalog, { storage: ignoredStorage }).id, "title-0", "malformed local state must recover safely");

console.log("recommendation engine enforces relevance, ignored-item deboosting and a 50-title repeat gap: ok");
