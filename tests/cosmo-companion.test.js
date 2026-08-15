const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const storage = new Map();
const events = [];
let recognitionInstance = null;
class FakeRecognition {
  constructor() {
    recognitionInstance = this;
    this.continuous = false;
    this.interimResults = true;
  }
  start() { if (this.onstart) this.onstart(); }
  stop() { if (this.onend) this.onend(); }
  abort() { if (this.onend) this.onend(); }
}
const window = {
  navigator: {},
  location: { href: "https://example.test" },
  speechSynthesis: null,
  SpeechRecognition: FakeRecognition,
  setTimeout,
  clearTimeout,
  fetch: async () => ({
    ok: true,
    json: async () => ({ query: { pages: { 1: { pageid: 1, title: "Back to the Future", extract: "A 1985 science-fiction comedy film.", fullurl: "https://en.wikipedia.org/wiki/Back_to_the_Future" } } } }),
  }),
};
const context = vm.createContext({
  window,
  navigator: window.navigator,
  fetch: window.fetch,
  URL,
  Date,
  console,
  setTimeout,
  clearTimeout,
  CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options && options.detail; } },
  document: {
    dispatchEvent(event) { events.push(event); },
    addEventListener() {},
    visibilityState: "visible",
  },
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, value); },
  },
});
window.window = window;
window.document = context.document;
window.localStorage = context.localStorage;

vm.runInContext(fs.readFileSync("js/gemma-engine.js", "utf8"), context);
vm.runInContext(fs.readFileSync("js/cosmo-live.js", "utf8"), context);

assert.equal(window.StarQuestGemma.supported(), false);
assert.equal(window.StarQuestGemma.status().state, "idle");
assert.equal(window.StarQuestCosmoLive.getSettings().handsFreeVoice, true);
assert.equal(window.StarQuestCosmoLive.getSettings().speakReplies, true);

let heardCommand = "";
const handsFree = window.StarQuestCosmoLive.createHandsFreeRecognition((command) => { heardCommand = command; });
assert.ok(handsFree);
handsFree.start();
assert.equal(recognitionInstance.continuous, true);
recognitionInstance.onresult({
  resultIndex: 0,
  results: Object.assign([[{ transcript: "Cosmo tell me about this show" }]], { 0: Object.assign([{ transcript: "Cosmo tell me about this show" }], { isFinal: true }) }),
});
assert.equal(heardCommand, "tell me about this show");
handsFree.stop();

const added = window.StarQuestCosmoLive.handleListIntent("Add popcorn to my grocery list");
assert.match(added, /added popcorn/i);
assert.equal(window.StarQuestCosmoLive.getShoppingList().map((item) => item.name).join(","), "popcorn");
assert.equal(window.StarQuestCosmoLive.sponsoredSuggestion(), null, "sponsored suggestions default off");

(async () => {
  const info = await window.StarQuestCosmoLive.setContext({ showId: "bttf", show: "Back to the Future", episode: "Movie" });
  assert.equal(info.title, "Back to the Future");
  assert.match(window.StarQuestCosmoLive.contextBlurb(), /Verified lookup/);
  assert.match(window.StarQuestCosmoLive.answerFromLiveContext("What movie are we watching?"), /Verified source/);
  window.StarQuestCosmoLive.updateSettings({ sponsoredSuggestions: true });
  const offer = window.StarQuestCosmoLive.sponsoredSuggestion();
  assert.equal(offer.label, "Sponsored suggestion");
  assert.match(offer.url, /^https:\/\/www\.ebay\.com\/sch\/i\.html/);

  const unsupported = await window.StarQuestGemma.start("test");
  assert.equal(unsupported.state, "unsupported");
  assert.ok(events.some((event) => event.type === "starquest:gemma-state"));

  const appSource = fs.readFileSync("js/app.js", "utf8");
  const aiSource = fs.readFileSync("js/ai.js", "utf8");
  const cosmoSource = fs.readFileSync("js/cosmo-live.js", "utf8");
  assert.match(appSource, /180000, 720000, 1500000/);
  assert.match(appSource, /scheduleCosmoPopIns/);
  assert.match(appSource, /Opening Cosmo must never wait on a model or network request/);
  assert.doesNotMatch(appSource, /StarQuestAI\.chat\("hello"\)/);
  assert.match(aiSource, /controller\.abort\(\), 10000/);
  assert.match(aiSource, /result\.confidence >= 0\.55/);
  assert.match(aiSource, /InfinityLanguageEngine/);
  assert.match(aiSource, /PLAYBACK_CONTEXT_SET/);
  assert.match(cosmoSource, /createHandsFreeRecognition/);
  assert.match(cosmoSource, /recognition\.continuous = true/);
  assert.match(appSource, /primeHandsFree/);
  assert.match(appSource, /handsFreeVoiceEnabled/);
  const indexSource = fs.readFileSync("index.html", "utf8");
  assert.match(indexSource, /cosmo-handsfree-toggle/);
  assert.match(indexSource, /say “Cosmo” followed by your question/);
  assert.match(indexSource, /infinity-ai-kernel\.js\?v=20260814-kernel2/);
  console.log("Cosmo hands-free wake word, Gemma consent, live context, shopping list and sponsor controls: ok");
})().catch((error) => { console.error(error); process.exitCode = 1; });
