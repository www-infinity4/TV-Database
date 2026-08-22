/**
 * Cosmo interest memory.
 *
 * Stores only normalized topic terms derived from actions the viewer takes
 * inside StarQuest. It never reads browser history, other tabs, microphones,
 * private messages, or thoughts.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest_cosmo_interest_v1";
  const HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000;
  const MAX_TERMS = 120;
  const SOURCE_WEIGHTS = Object.freeze({
    chat: 8,
    search: 6,
    watch: 5,
    open: 4,
    click: 3,
    skip: -2,
  });
  const STOP_WORDS = new Set((
    "a an and are as at be been but by can could did do does for from had has have he her here him his how i if in into is it its just me my no not of on or our she so than that the their them then there they this to too us was we were what when where which who why will with would you your " +
    "about after again all also any anything ask cosmo episode film find give going good hello hey know like look make movie much need new now one please really say see show something tell think time today want watch watching way"
  ).split(/\s+/));

  function now() { return Date.now(); }

  function load() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "{}");
      return parsed && parsed.terms && typeof parsed.terms === "object" ? parsed : { terms: {} };
    } catch (_) {
      return { terms: {} };
    }
  }

  function save(data) {
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function termsFrom(text) {
    const matches = String(text || "").toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,30}/g) || [];
    return Array.from(new Set(matches.filter((term) => !STOP_WORDS.has(term) && !/^\d+$/.test(term)))).slice(0, 24);
  }

  function decayedWeight(entry, at) {
    const age = Math.max(0, at - Number(entry.updatedAt || at));
    return Number(entry.weight || 0) * Math.pow(0.5, age / HALF_LIFE_MS);
  }

  function record(text, source, explicitWeight) {
    const found = termsFrom(text);
    if (!found.length) return snapshot();
    const data = load();
    const at = now();
    const sourceName = Object.prototype.hasOwnProperty.call(SOURCE_WEIGHTS, source) ? source : "click";
    const amount = Number.isFinite(Number(explicitWeight)) ? Number(explicitWeight) : SOURCE_WEIGHTS[sourceName];
    found.forEach((term) => {
      const old = data.terms[term] || { weight: 0, updatedAt: at, signals: 0 };
      data.terms[term] = {
        weight: Math.max(0, Math.min(80, decayedWeight(old, at) + amount)),
        updatedAt: at,
        signals: Math.min(99, Number(old.signals || 0) + 1),
        source: sourceName,
      };
    });
    data.terms = Object.fromEntries(Object.entries(data.terms)
      .sort((a, b) => decayedWeight(b[1], at) - decayedWeight(a[1], at))
      .slice(0, MAX_TERMS));
    save(data);
    return snapshot();
  }

  function snapshot(limit) {
    const at = now();
    const ranked = Object.entries(load().terms)
      .map(([term, entry]) => ({ term, weight: Math.max(0, decayedWeight(entry, at)), signals: Number(entry.signals || 0) }))
      .filter((item) => item.weight > 0.05)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, Number(limit) || 12);
    const total = ranked.reduce((sum, item) => sum + item.weight, 0) || 1;
    return ranked.map((item) => {
      const probability = item.weight / total;
      return {
        term: item.term,
        weight: Number(item.weight.toFixed(3)),
        amplitude: Number(Math.sqrt(probability).toFixed(4)),
        probability: Number(probability.toFixed(4)),
        signals: item.signals,
      };
    });
  }

  function promptContext() {
    const ranked = snapshot(10);
    if (!ranked.length) return "\nNo viewer interests have been deliberately signaled inside StarQuest yet.";
    return "\nViewer-controlled StarQuest interest signals (topic:relative weight): " +
      ranked.map((item) => item.term + ":" + item.weight).join(", ") +
      ". These are decayed local interaction weights, not thoughts and not data from outside StarQuest.";
  }

  function clear() {
    try { global.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }

  function listen() {
    if (!global.document || !global.document.addEventListener) return;
    global.document.addEventListener("starquest:cosmo-user-message", (event) => record(event.detail && event.detail.text, "chat"));
    global.document.addEventListener("starquest:search", (event) => record(event.detail && event.detail.query, "search"));
    global.document.addEventListener("starquest:episode-opened", (event) => {
      const detail = event.detail || {};
      record([detail.showTitle, detail.ep && detail.ep.title].filter(Boolean).join(" "), "open");
    });
  }

  const api = { record, snapshot, promptContext, clear, termsFrom, sourceWeights: SOURCE_WEIGHTS };
  global.StarQuestCosmoContext = api;
  listen();
})(window);
