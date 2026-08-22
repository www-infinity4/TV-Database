/**
 * Staged Cosmo scene-matching engine. Deliberately NOT loaded by index.html
 * until every release capability has versioned validation evidence.
 */
(function (global) {
  "use strict";

  const REQUIRED_CAPABILITIES = Object.freeze([
    "visual_manifest", "dialogue_timeline", "viewer_terms", "verified_inventory",
    "consent", "renderer", "audit"
  ]);
  const capabilities = Object.create(null);
  const MIN_CUE_CONFIDENCE = 0.72;
  const MIN_MATCH_SCORE = 0.58;

  function words(values) {
    return Array.from(new Set([].concat(values || [])
      .map((value) => String(value || "").trim().toLowerCase()).filter(Boolean)));
  }

  function viewerMap(terms) {
    const map = new Map();
    (terms || []).forEach((entry) => {
      const term = String(entry && entry.term || "").toLowerCase();
      const probability = Math.max(0, Number(entry && entry.probability) || 0);
      if (term) map.set(term, probability);
    });
    return map;
  }

  function overlapScore(tags, viewerTerms) {
    const map = viewerMap(viewerTerms);
    return words(tags).reduce((sum, tag) => sum + (map.get(tag) || 0), 0);
  }

  function validateCue(cue) {
    if (!cue || !Number.isFinite(Number(cue.startSeconds))) return false;
    if (Number(cue.confidence) < MIN_CUE_CONFIDENCE) return false;
    return words(cue.visualTags).length > 0 && words(cue.dialogueTags).length > 0;
  }

  function scoreCandidate(cue, item, viewerTerms) {
    if (!validateCue(cue) || !item || item.verified !== true) return 0;
    const cueTags = words([].concat(cue.visualTags || [], cue.dialogueTags || [], cue.settingTags || []));
    const itemTags = new Set(words(item.tags));
    const sceneMatch = cueTags.filter((tag) => itemTags.has(tag)).length / Math.max(1, cueTags.length);
    const viewerMatch = overlapScore(item.tags, viewerTerms);
    const confidence = Math.min(1, Math.max(0, Number(cue.confidence) || 0));
    return Number(Math.min(1, sceneMatch * 0.52 + viewerMatch * 0.33 + confidence * 0.15).toFixed(4));
  }

  function chooseCandidate(cue, inventory, viewerTerms) {
    return (inventory || []).map((item) => ({ item, score: scoreCandidate(cue, item, viewerTerms) }))
      .filter((entry) => entry.score >= MIN_MATCH_SCORE)
      .sort((a, b) => b.score - a.score)[0] || null;
  }

  function buildRenderPlan(input) {
    const cue = input && input.cue;
    const consent = input && input.consent;
    if (!isReleaseReady() || !consent || consent.sceneMatching !== true) {
      return { mode: "none", reason: "not_ready_or_not_allowed" };
    }
    const match = chooseCandidate(cue, input.inventory, input.viewerTerms);
    if (!match) return { mode: "none", reason: "insufficient_evidence" };
    const item = match.item;
    const highConsideration = item.category === "real-estate" || item.category === "vehicle" || Number(item.price) >= 500;
    return {
      mode: highConsideration ? "conversation" : "card",
      label: "Sponsored scene match",
      disclosure: "Matched from this scene and your StarQuest interests",
      text: String(item.summary || item.title || "Relevant verified listing"),
      url: item.url || null,
      score: match.score,
      cueId: cue.id || null,
      inventoryId: item.id || null,
      requiresViewerOpen: true,
      dismissible: true,
      autoPurchase: false,
    };
  }

  function registerCapability(name, evidence) {
    if (!REQUIRED_CAPABILITIES.includes(name)) return false;
    capabilities[name] = !!(evidence && evidence.validated === true && evidence.version);
    return capabilities[name];
  }

  function readiness() {
    const missing = REQUIRED_CAPABILITIES.filter((name) => capabilities[name] !== true);
    return { ready: missing.length === 0, missing };
  }
  function isReleaseReady() { return readiness().ready; }
  function nextRenderPlan() { return { mode: "none", reason: "runtime_not_activated" }; }

  global.StarQuestCosmoSceneEngine = {
    requiredCapabilities: REQUIRED_CAPABILITIES.slice(), registerCapability, readiness,
    isReleaseReady, validateCue, scoreCandidate, chooseCandidate, buildRenderPlan, nextRenderPlan,
  };
})(window);
