/** StarQuest Cosmo — live context, consent, voice and shopping-list services. */
(function (global) {
  "use strict";

  const SETTINGS_KEY = "starquest_cosmo_settings_v2";
  const LIST_KEY = "starquest_cosmo_shopping_v1";
  const PREF_KEY = "starquest_cosmo_preferences_v1";
  const defaults = { watchAlong: true, sponsoredSuggestions: false, speakReplies: false };
  let settings = load(SETTINGS_KEY, defaults);
  let shopping = load(LIST_KEY, []);
  let preferences = load(PREF_KEY, { likes: [], needs: [] });
  let context = null;
  let movieInfo = null;
  let lastSponsoredAt = 0;
  const infoCache = new Map();

  function load(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === "object" ? value : fallback;
    } catch (_) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }
  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }
  function cleanTitle(title) {
    return String(title || "").replace(/\s+[—-]\s+(?:S\d+E\d+|Movie):?.*$/i, "").trim();
  }
  function wikiUrl(title) {
    return "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=0&gsrlimit=1&prop=extracts%7Cinfo&exintro=1&explaintext=1&inprop=url&gsrsearch=" + encodeURIComponent(title + " film television");
  }
  async function lookupMovie(title) {
    const query = cleanTitle(title);
    if (!query) return null;
    if (infoCache.has(query)) return infoCache.get(query);
    try {
      const response = await fetch(wikiUrl(query), { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      const page = data.query && data.query.pages ? Object.values(data.query.pages)[0] : null;
      const result = page ? {
        title: page.title,
        summary: String(page.extract || "").slice(0, 1800),
        source: page.fullurl || ("https://en.wikipedia.org/?curid=" + page.pageid),
      } : null;
      infoCache.set(query, result);
      return result;
    } catch (_) {
      return null;
    }
  }
  async function setContext(next) {
    context = next ? { showId: next.showId || null, show: next.show || "", episode: next.episode || "", currentTime: 0, duration: 0, transcript: "" } : null;
    movieInfo = context ? await lookupMovie(context.show) : null;
    emit("starquest:cosmo-context", { context, movieInfo });
    return movieInfo;
  }
  function updatePlayback(snapshot) {
    if (!context || !snapshot) return;
    context.currentTime = Number(snapshot.currentTime) || 0;
    context.duration = Number(snapshot.duration) || 0;
    context.transcript = String(snapshot.transcript || "").slice(-900);
  }
  function contextBlurb() {
    if (!context) return "";
    const minutes = Math.floor((context.currentTime || 0) / 60);
    const source = movieInfo ? `\nVerified lookup: ${movieInfo.summary}\nSource: ${movieInfo.source}` : "";
    const transcript = context.transcript ? `\nCurrent caption/transcript context: ${context.transcript}` : "";
    return `\nPlayback context: ${context.show} — ${context.episode}; approximately ${minutes} minutes into playback.${source}${transcript}`;
  }
  function answerFromLiveContext(text) {
    if (!context || !movieInfo) return null;
    const q = String(text || "").toLowerCase();
    if (!/(what.*watch|about.*(?:movie|show|episode)|look.*up|movie info|show info|source|verified)/.test(q)) return null;
    return `${movieInfo.title}: ${movieInfo.summary}\nVerified source: ${movieInfo.source}`;
  }
  function preferenceBlurb() {
    const likes = preferences.likes.slice(-8).join(", ");
    const needs = preferences.needs.slice(-8).join(", ");
    const list = shopping.map((item) => item.name).join(", ");
    return `\nViewer-provided preferences only: likes [${likes || "none recorded"}]; needs [${needs || "none recorded"}]; reviewable shopping list [${list || "empty"}].`;
  }
  function remember(text) {
    const value = String(text || "").trim();
    const like = value.match(/\b(?:i like|i love|i collect)\s+(.{2,80})/i);
    const need = value.match(/\b(?:i need|i want|i'm looking for)\s+(.{2,80})/i);
    if (like) preferences.likes.push(like[1].replace(/[.!?].*$/, "").trim());
    if (need) preferences.needs.push(need[1].replace(/[.!?].*$/, "").trim());
    preferences.likes = [...new Set(preferences.likes)].slice(-20);
    preferences.needs = [...new Set(preferences.needs)].slice(-20);
    save(PREF_KEY, preferences);
  }
  function addItem(name, source) {
    const clean = String(name || "").replace(/[.!?].*$/, "").trim().slice(0, 90);
    if (!clean) return null;
    if (!shopping.some((item) => item.name.toLowerCase() === clean.toLowerCase())) shopping.push({ name: clean, source: source || "viewer", addedAt: new Date().toISOString() });
    save(LIST_KEY, shopping);
    emit("starquest:shopping-updated", { items: getShoppingList() });
    return clean;
  }
  function handleListIntent(text) {
    const value = String(text || "");
    const add = value.match(/\b(?:add|put)\s+(.{2,90}?)\s+(?:to|on)\s+(?:my\s+)?(?:grocery|shopping)\s+list/i);
    if (add) {
      const name = addItem(add[1], "voice/chat");
      return name ? `I added ${name} to your reviewable shopping list. I won't order anything until you review and confirm it.` : null;
    }
    if (/\b(?:show|what(?:'s| is))\b.*\b(?:grocery|shopping)\s+list/i.test(value)) {
      return shopping.length ? "Your list has: " + shopping.map((item) => item.name).join(", ") + "." : "Your shopping list is empty.";
    }
    if (/\bclear\b.*\b(?:grocery|shopping)\s+list/i.test(value)) {
      shopping = []; save(LIST_KEY, shopping); emit("starquest:shopping-updated", { items: [] });
      return "Your shopping list is cleared.";
    }
    return null;
  }
  function getSettings() { return { ...settings }; }
  function updateSettings(patch) {
    settings = { ...settings, ...patch };
    save(SETTINGS_KEY, settings);
    emit("starquest:cosmo-settings", { settings: getSettings() });
    return getSettings();
  }
  function getShoppingList() { return shopping.map((item) => ({ ...item })); }
  function clearShoppingList() { shopping = []; save(LIST_KEY, shopping); emit("starquest:shopping-updated", { items: [] }); }
  function sponsoredSuggestion() {
    if (!settings.sponsoredSuggestions || !context || Date.now() - lastSponsoredAt < 20 * 60 * 1000) return null;
    const subject = preferences.needs.slice(-1)[0] || context.show;
    if (!subject) return null;
    lastSponsoredAt = Date.now();
    return {
      label: "Sponsored suggestion",
      text: `That ${subject} connection is worth exploring. I found a live marketplace search rather than inventing a price—review the seller, condition and total cost before buying.`,
      url: "https://www.ebay.com/sch/i.html?_nkw=" + encodeURIComponent(subject),
    };
  }
  function speak(text) {
    if (!settings.speakReplies || !global.speechSynthesis) return;
    global.speechSynthesis.cancel();
    global.speechSynthesis.speak(new SpeechSynthesisUtterance(String(text || "").replace(/https?:\/\/\S+/g, "")));
  }
  function createRecognition(onText, onState) {
    const Recognition = global.SpeechRecognition || global.webkitSpeechRecognition;
    if (!Recognition) return null;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => onState && onState("listening");
    recognition.onend = () => onState && onState("idle");
    recognition.onerror = (event) => onState && onState("error", event.error);
    recognition.onresult = (event) => onText && onText(event.results[0][0].transcript);
    return recognition;
  }

  global.StarQuestCosmoLive = {
    lookupMovie, setContext, updatePlayback, contextBlurb, answerFromLiveContext, preferenceBlurb, remember,
    handleListIntent, addItem, getShoppingList, clearShoppingList, getSettings,
    updateSettings, sponsoredSuggestion, speak, createRecognition,
  };
})(window);
