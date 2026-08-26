const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function makeHarness(importedLocalState) {
  const listeners = new Map();
  const requests = [];
  const user = {
    key: "kris",
    passwordHash: "a".repeat(64),
    tokens: 0,
    pendingShareCredits: 5,
    shareCount: 5,
    watchHistory: [],
    shareEvents: [{ attemptId: "share-during-connect" }],
  };
  const document = {
    addEventListener(name, handler) { listeners.set(name, handler); },
    dispatchEvent() {},
  };
  const window = {
    document,
    STARQUEST_LEDGER_CONFIG: { endpoint: "https://ledger.example" },
    StarQuestAuth: {
      currentUser: () => user,
      applyCloudState() {},
      getHistory: () => [],
    },
    localStorage: {
      getItem: () => "sq_" + "x".repeat(43),
      setItem() {},
    },
    crypto: { getRandomValues(bytes) { bytes.fill(1); } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (url.endsWith("/v1/bootstrap")) {
        return {
          ok: true,
          json: async () => ({
            ok: true,
            importedLocalState,
            state: { username: "kris" },
          }),
        };
      }
      return {
        ok: true,
        json: async () => ({ ok: true, state: { username: "kris" } }),
      };
    },
    setTimeout,
    clearTimeout,
  };
  window.window = window;
  const context = vm.createContext({ window, document, CustomEvent: class CustomEvent {} });
  vm.runInContext(fs.readFileSync("js/starquest-cloud-ledger.js", "utf8"), context);
  return { listeners, requests };
}

async function dispatchShare(harness) {
  await harness.listeners.get("starquest:share-progress")({
    detail: {
      event: {
        attemptId: "share-during-connect",
        contentId: "show|episode",
        verificationState: "client_confirmed",
      },
    },
  });
  await new Promise(resolve => setImmediate(resolve));
}

(async () => {
  const existing = makeHarness(false);
  await dispatchShare(existing);
  assert.equal(existing.requests.filter(request => request.url.endsWith("/v1/shares")).length, 1);

  const newlyImported = makeHarness(true);
  await dispatchShare(newlyImported);
  assert.equal(newlyImported.requests.filter(request => request.url.endsWith("/v1/shares")).length, 0);

  console.log("share during bootstrap is retained for existing D1 accounts: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
