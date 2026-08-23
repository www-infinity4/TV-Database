/**
 * Durable StarQuest ledger bridge.
 *
 * Local storage remains an offline cache. When an endpoint is configured, D1
 * becomes authoritative for StarCoins, share receipts, and watch history.
 */
(function (global) {
  "use strict";

  const document = global.document;
  const config = global.STARQUEST_LEDGER_CONFIG || {};
  const endpoint = String(config.endpoint || "").replace(/\/+$/, "");
  const TOKEN_PREFIX = "starquest_ledger_device_v1:";
  let connectedUsername = "";
  let connecting = null;
  let bootstrapIncludedAttempts = new Set();
  let historyTimer = null;

  function auth() {
    return global.StarQuestAuth || null;
  }

  function currentUser() {
    const service = auth();
    return service && typeof service.currentUser === "function" ? service.currentUser() : null;
  }

  function tokenKey(username) {
    return TOKEN_PREFIX + String(username || "").toLowerCase();
  }

  function createDeviceToken() {
    const bytes = new Uint8Array(32);
    global.crypto.getRandomValues(bytes);
    const encoded = btoa(String.fromCharCode.apply(null, Array.from(bytes)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return "sq_" + encoded;
  }

  function getDeviceToken(username) {
    const key = tokenKey(username);
    let token = global.localStorage.getItem(key);
    if (!token) {
      token = createDeviceToken();
      global.localStorage.setItem(key, token);
    }
    return token;
  }

  async function request(path, options) {
    const user = currentUser();
    if (!endpoint || !user) throw new Error("ledger_not_connected");
    const response = await global.fetch(endpoint + path, {
      method: options && options.method ? options.method : "GET",
      headers: {
        "Authorization": "Bearer " + getDeviceToken(user.key),
        "Content-Type": "application/json"
      },
      body: options && options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
      keepalive: !!(options && options.keepalive)
    });
    const payload = await response.json().catch(function () { return {}; });
    if (!response.ok || !payload.ok) {
      const error = new Error(payload.message || "Ledger request failed.");
      error.code = payload.error || "ledger_request_failed";
      throw error;
    }
    return payload;
  }

  function localSnapshot(user) {
    return {
      starCoins: Number(user.tokens || 0),
      pendingShareCredits: Number(user.pendingShareCredits || 0),
      shareCount: Number(user.shareCount || 0),
      watchHistory: Array.isArray(user.watchHistory) ? user.watchHistory.slice(0, 200) : []
    };
  }

  function applyState(payload) {
    const service = auth();
    if (payload && payload.state && service && typeof service.applyCloudState === "function") {
      service.applyCloudState(payload.state);
    }
  }

  async function connect() {
    const user = currentUser();
    if (!endpoint || !user) return false;
    if (connectedUsername === user.key) return true;
    if (connecting) return connecting;
    connecting = (async function () {
      bootstrapIncludedAttempts = new Set(
        (Array.isArray(user.shareEvents) ? user.shareEvents : [])
          .map(function (event) { return event && event.attemptId; })
          .filter(Boolean)
      );
      const response = await global.fetch(endpoint + "/v1/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.key,
          deviceToken: getDeviceToken(user.key),
          credentialProof: user.passwordHash,
          localState: localSnapshot(user)
        }),
        cache: "no-store"
      });
      const payload = await response.json().catch(function () { return {}; });
      if (!response.ok || !payload.ok) {
        const error = new Error(payload.message || "Cloud ledger connection failed.");
        error.code = payload.error || "ledger_bootstrap_failed";
        throw error;
      }
      connectedUsername = user.key;
      applyState(payload);
      document.dispatchEvent(new CustomEvent("starquest:ledger-connected", { detail: { username: user.key } }));
      return true;
    })().catch(function (error) {
      console.error("StarQuest ledger connection:", error);
      document.dispatchEvent(new CustomEvent("starquest:ledger-error", { detail: { error: error.code || error.message } }));
      return false;
    }).finally(function () {
      connecting = null;
    });
    return connecting;
  }

  async function syncShare(detail) {
    if (!await connect()) return;
    const event = detail && detail.event ? detail.event : null;
    if (!event || !event.attemptId || event.verificationState !== "client_confirmed") return;
    if (bootstrapIncludedAttempts.has(event.attemptId)) {
      bootstrapIncludedAttempts.delete(event.attemptId);
      return;
    }
    const payload = await request("/v1/shares", {
      method: "POST",
      body: {
        attemptId: event.attemptId,
        contentId: event.contentId,
        method: event.method,
        receiptHash: event.receiptHash,
        showTitle: event.showTitle,
        episodeId: event.episodeId,
        companyId: event.companyId,
        actors: event.actors,
        fullyWatched: event.fullyWatched,
        attributionStatus: event.attributionStatus
      },
      keepalive: true
    });
    applyState(payload);
  }

  async function syncRecentHistory() {
    if (!await connect()) return;
    const service = auth();
    const history = service && typeof service.getHistory === "function" ? service.getHistory() : [];
    const recent = history && history[0];
    if (!recent || !recent.episodeId) return;
    const payload = await request("/v1/history", { method: "POST", body: recent, keepalive: true });
    applyState(payload);
  }

  function scheduleHistorySync() {
    global.clearTimeout(historyTimer);
    historyTimer = global.setTimeout(function () {
      syncRecentHistory().catch(function (error) {
        console.error("StarQuest history sync:", error);
      });
    }, 1500);
  }

  if (!endpoint || !document) {
    global.StarQuestCloudLedger = Object.freeze({ enabled: false, connect: function () { return Promise.resolve(false); } });
    return;
  }

  document.addEventListener("starquest:auth-changed", function (event) {
    connectedUsername = "";
    if (event.detail && event.detail.user) connect();
  });
  document.addEventListener("starquest:share-progress", function (event) {
    syncShare(event.detail).catch(function (error) {
      console.error("StarQuest share sync:", error);
    });
  });
  document.addEventListener("starquest:history-updated", function (event) {
    if (event.detail && event.detail.source === "cloud") return;
    scheduleHistorySync();
  });
  document.addEventListener("starquest:history-progress", scheduleHistorySync);
  document.addEventListener("starquest:watch-progress", scheduleHistorySync);

  if (currentUser()) connect();
  global.StarQuestCloudLedger = Object.freeze({ enabled: true, connect: connect });
})(window);
