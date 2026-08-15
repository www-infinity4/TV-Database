"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const values = new Map();
const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const listeners = {};
const document = {
  readyState: "loading",
  addEventListener(name, listener) { listeners[name] = listener; },
  dispatchEvent() {},
};
const window = { localStorage, document };
const context = vm.createContext({
  window,
  localStorage,
  document,
  CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  Set,
  Map,
  Date,
  JSON,
});

vm.runInContext(fs.readFileSync("js/data.js", "utf8") + "\nwindow.__STARQUEST_SHOWS__ = SHOWS;", context);
vm.runInContext(fs.readFileSync("js/catalog-ledger.js", "utf8"), context);
const shows = window.__STARQUEST_SHOWS__;
const expectedEpisodes = shows.reduce((total, show) => total + (show.episodes || []).length, 0);
const result = window.StarQuestCatalogLedger.inventory(shows);

assert.equal(result.titlesLedgered, shows.length, "every catalog title must receive a ledger record");
assert.equal(result.episodes, expectedEpisodes, "every catalog episode must receive a ledger record");
assert.equal(result.payoutsCompleted, 0, "the browser must not claim a treasury settlement occurred");
console.log("full StarQuest catalog ledger coverage: " + result.titles + " titles, " + result.episodes + " episodes");
