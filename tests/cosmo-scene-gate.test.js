const assert = require("node:assert/strict");
const fs = require("node:fs");

global.window = {};
require("../js/cosmo-scene-engine.js");
const engine = global.window.StarQuestCosmoSceneEngine;
assert.equal(engine.isReleaseReady(), false);
assert.equal(engine.readiness().missing.length, 7);

const cue = {
  id: "field-scene-1", startSeconds: 120, confidence: 0.94,
  visualTags: ["farm", "land", "baseball"], dialogueTags: ["farm", "baseball"], settingTags: ["rural"]
};
const inventory = [{
  id: "land-ks-1", verified: true, category: "real-estate", title: "Kansas farm",
  summary: "Verified Kansas acreage", tags: ["farm", "land", "baseball"], url: "https://example.test/listing"
}];
const viewerTerms = [
  { term: "farm", probability: 0.4 }, { term: "land", probability: 0.35 }, { term: "baseball", probability: 0.25 }
];
assert.ok(engine.scoreCandidate(cue, inventory[0], viewerTerms) >= 0.58);
assert.deepEqual(engine.buildRenderPlan({ cue, inventory, viewerTerms, consent: { sceneMatching: true } }), {
  mode: "none", reason: "not_ready_or_not_allowed"
});

for (const name of engine.requiredCapabilities) {
  assert.equal(engine.registerCapability(name, { validated: true, version: "test-1" }), true);
}
const plan = engine.buildRenderPlan({ cue, inventory, viewerTerms, consent: { sceneMatching: true } });
assert.equal(plan.mode, "conversation", "high-consideration land must not flash as an impulse card");
assert.equal(plan.label, "Sponsored scene match");
assert.equal(plan.requiresViewerOpen, true);
assert.equal(plan.autoPurchase, false);

const html = fs.readFileSync("index.html", "utf8");
const app = fs.readFileSync("js/app.js", "utf8");
assert.doesNotMatch(html, /<script[^>]+cosmo-scene-engine\.js/, "staged engine must not ship before production validation");
assert.match(app, /sceneEngine\.isReleaseReady\(\)/);
assert.match(html, /cosmo-watchalong-toggle[^>]+disabled/);
assert.match(html, /class="cosmo-alien"/);
console.log("Cosmo full-pipeline gate, evidence score, safe land conversation and alien control: ok");
