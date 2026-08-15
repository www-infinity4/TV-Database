const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const events = [];
let fetchCalls = 0;
const storage = new Map();
const document = {
  readyState: "complete",
  dispatchEvent(event) { events.push(event); },
  addEventListener() {}
};
const window = {
  document,
  navigator: {},
  location: { hostname: "www-infinity4.github.io" }
};
const context = vm.createContext({
  window,
  document,
  navigator: window.navigator,
  location: window.location,
  CustomEvent: class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } },
  localStorage: {
    getItem(key) { return storage.has(key) ? storage.get(key) : null; },
    setItem(key, value) { storage.set(key, value); },
    removeItem(key) { storage.delete(key); }
  },
  fetch: async () => { fetchCalls += 1; throw new Error("network should not be called without a gateway"); },
  AbortController,
  setTimeout,
  clearTimeout,
  console
});
window.window = window;
window.localStorage = context.localStorage;
window.fetch = context.fetch;

vm.runInContext(fs.readFileSync("js/ai.js", "utf8"), context);

(async () => {
  const greeting = await window.StarQuestAI.chat("hello");
  assert.match(greeting, /Cosmo/i);

  const reply = await Promise.race([
    window.StarQuestAI.chat("Why is my phone battery draining quickly?"),
    new Promise((_, reject) => setTimeout(() => reject(new Error("Cosmo did not answer")), 1000))
  ]);
  assert.match(reply, /don't have a reliable offline answer/i);
  assert.doesNotMatch(reply, /has a score of/i);
  assert.equal(fetchCalls, 0);
  assert.ok(events.some(event => event.type === "starquest:cosmo-provider" && event.detail.state === "unconfigured"));
  console.log("Cosmo returns promptly without a configured gateway and never substitutes random media: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
