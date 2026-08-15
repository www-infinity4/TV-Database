"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const values = new Map();
const events = [];
const localStorage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, value); },
};
const window = { localStorage, document: { readyState: "loading", addEventListener() {}, dispatchEvent(event) { events.push(event); } } };
const context = vm.createContext({
  window,
  localStorage,
  document: window.document,
  CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options.detail; } },
  Set,
  Map,
  Date,
  JSON,
});
vm.runInContext(fs.readFileSync("js/catalog-ledger.js", "utf8"), context);

const summary = window.StarQuestCatalogLedger.inventory([
  { id: "licensed-show", title: "Licensed Show", distributorAccount: "rights:1", contractId: "contract:1", license: "licensed", episodes: [{ id: "ep-1", title: "Pilot", archiveId: "archive-1" }] },
  { id: "unknown-movie", title: "Unknown Movie", type: "movie", episodes: [{ id: "ep-2", title: "Movie", archiveId: "archive-2" }] },
  { id: "blocked-show", title: "Blocked Show", episodes: [{ id: "ep-3", sourceStatus: "restricted" }] },
]);

assert.equal(summary.titles, 3);
assert.equal(summary.episodes, 3);
assert.equal(summary.contractsRecorded, 1);
assert.equal(summary.authorizedAnalysisQueued, 1);
assert.equal(summary.rightsReviewHeld, 1);
assert.equal(summary.sourceBlocked, 1);
assert.equal(summary.payoutsCompleted, 0);
assert.equal(window.StarQuestCatalogLedger.nextAuthorizedBatch(10)[0].episodeId, "ep-1");
const blocked = window.StarQuestCatalogLedger.recordAuthorizedAnalysis("ep-2", { summary: "Not allowed", sourceFingerprint: "sha256:not-authorized" });
assert.equal(blocked.ok, false);
assert.equal(blocked.reason, "held-for-rights-review");
const recorded = window.StarQuestCatalogLedger.recordAuthorizedAnalysis("ep-1", { summary: "Authorized summary", adBreakMarkers: [600], sourceFingerprint: "sha256:episode-one" });
assert.equal(recorded.ok, true);
assert.equal(recorded.duplicate, false);
assert.equal(recorded.accrual.amount, 1);
assert.equal(recorded.accrual.status, "accrued-awaiting-funded-settlement");
const duplicate = window.StarQuestCatalogLedger.recordAuthorizedAnalysis("ep-1", { summary: "Repeat", sourceFingerprint: "sha256:episode-one" });
assert.equal(duplicate.duplicate, true);
assert.equal(window.StarQuestCatalogLedger.summary().provisionalInfinityAccrued, 1);
assert.ok(events.some((event) => event.type === "starquest:catalog-ledger-ready"));
console.log("catalog ledger separates rights, analysis and payment: ok");
