/** StarQuest recommendation exposure ledger — relevant picks without repeats. */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest.recommendations.exposure.v1";
  const DEFAULT_REPEAT_GAP = 50;
  const MAX_SIGNALS = 500;

  function safeStorage(candidate) {
    if (candidate) return candidate;
    try { return global.localStorage; } catch (_) { return null; }
  }

  function emptyState() {
    return { recent: [], pending: [], signals: {} };
  }

  function readState(storage) {
    if (!storage) return emptyState();
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
      return {
        recent: Array.isArray(saved.recent) ? saved.recent.filter((id) => typeof id === "string").slice(-DEFAULT_REPEAT_GAP) : [],
        pending: Array.isArray(saved.pending) ? saved.pending.filter((id) => typeof id === "string") : [],
        signals: saved.signals && typeof saved.signals === "object" ? saved.signals : {},
      };
    } catch (_) {
      return emptyState();
    }
  }

  function writeState(storage, state) {
    if (!storage) return;
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function signalFor(state, id) {
    const value = state.signals[id];
    if (!value || typeof value !== "object") {
      state.signals[id] = { impressions: 0, ignored: 0, clicks: 0, watches: 0 };
    }
    return state.signals[id];
  }

  function trimSignals(state) {
    const ids = Object.keys(state.signals);
    if (ids.length <= MAX_SIGNALS) return;
    const protectedIds = new Set(state.recent.concat(state.pending));
    ids.filter((id) => !protectedIds.has(id))
      .sort((a, b) => Number(state.signals[b].ignored || 0) - Number(state.signals[a].ignored || 0))
      .slice(MAX_SIGNALS)
      .forEach((id) => delete state.signals[id]);
  }

  /** Call once on page load. Unused picks from the previous visit become weak negative signals. */
  function beginVisit(options) {
    const storage = safeStorage(options && options.storage);
    const state = readState(storage);
    [...new Set(state.pending)].forEach((id) => {
      const signal = signalFor(state, id);
      signal.ignored = Math.min(100, Number(signal.ignored || 0) + 1);
    });
    state.pending = [];
    trimSignals(state);
    writeState(storage, state);
    return state;
  }

  function relevancePenalty(state, id) {
    const signal = signalFor(state, id);
    return Number(signal.ignored || 0) * 100 - Number(signal.clicks || 0) * 25 - Number(signal.watches || 0) * 50;
  }

  function choose(orderedCandidates, options) {
    const config = options || {};
    const storage = safeStorage(config.storage);
    const gap = Math.max(1, Number.isFinite(config.repeatGap) ? Math.trunc(config.repeatGap) : DEFAULT_REPEAT_GAP);
    const candidates = (Array.isArray(orderedCandidates) ? orderedCandidates : [])
      .filter((show, index, values) => show && typeof show.id === "string" && values.findIndex((item) => item && item.id === show.id) === index);
    if (!candidates.length) return null;

    const state = readState(storage);
    const effectiveGap = Math.min(gap, Math.max(0, candidates.length - 1));
    const excluded = new Set(state.recent.slice(-effectiveGap));
    const eligible = candidates.filter((show) => !excluded.has(show.id));
    const pool = eligible.length ? eligible : candidates;
    const rank = new Map(candidates.map((show, index) => [show.id, index]));
    pool.sort((a, b) => {
      const aScore = Number(rank.get(a.id) || 0) + relevancePenalty(state, a.id);
      const bScore = Number(rank.get(b.id) || 0) + relevancePenalty(state, b.id);
      return aScore - bScore || String(a.id).localeCompare(String(b.id));
    });

    const selected = pool[0];
    const signal = signalFor(state, selected.id);
    signal.impressions = Math.min(10000, Number(signal.impressions || 0) + 1);
    state.recent = state.recent.filter((id) => id !== selected.id).concat(selected.id).slice(-gap);
    if (!state.pending.includes(selected.id)) state.pending.push(selected.id);
    trimSignals(state);
    writeState(storage, state);
    return selected;
  }

  function engage(id, kind, options) {
    if (!id) return;
    const storage = safeStorage(options && options.storage);
    const state = readState(storage);
    const signal = signalFor(state, String(id));
    const field = kind === "watch" ? "watches" : "clicks";
    signal[field] = Math.min(10000, Number(signal[field] || 0) + 1);
    signal.ignored = Math.max(0, Number(signal.ignored || 0) - 1);
    state.pending = state.pending.filter((pendingId) => pendingId !== id);
    writeState(storage, state);
  }

  function snapshot(options) {
    return readState(safeStorage(options && options.storage));
  }

  global.StarQuestRecommendations = {
    beginVisit,
    choose,
    engage,
    snapshot,
    storageKey: STORAGE_KEY,
    repeatGap: DEFAULT_REPEAT_GAP,
  };
})(window);
