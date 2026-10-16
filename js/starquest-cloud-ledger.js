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
      body: options && options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined,
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
      const deviceToken = getDeviceToken(user.key);
      // A previously enrolled bearer token is already a durable device identity.
      // Recover that cloud account first so loss of the browser profile cache can
      // never silently bootstrap a second wallet for the same device.
      try {
        const stateResponse = await global.fetch(endpoint + "/v1/state", {
          method: "GET",
          headers: { "Authorization": "Bearer " + deviceToken },
          cache: "no-store"
        });
        const statePayload = await stateResponse.json().catch(function () { return {}; });
        if (stateResponse.ok && statePayload.ok && statePayload.state) {
          const cloudUsername = String(statePayload.state.username || "").trim().toLowerCase();
          if (cloudUsername && cloudUsername === String(user.key || "").toLowerCase()) {
            connectedUsername = user.key;
            bootstrapIncludedAttempts.clear();
            applyState(statePayload);
            document.dispatchEvent(new CustomEvent("starquest:ledger-connected", { detail: { username: user.key, recovered: true } }));
            return true;
          }
        }
      } catch (_) {
        // Offline/transient state reads fall through to the existing bootstrap.
      }
      const response = await global.fetch(endpoint + "/v1/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.key,
          deviceToken: deviceToken,
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
      // Only a newly-created cloud account imported the browser snapshot. For
      // an existing account, any share that happened while bootstrap was in
      // flight still needs its own durable receipt and ledger event in D1.
      if (payload.importedLocalState !== true) {
        bootstrapIncludedAttempts.clear();
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
  // Use actual account playback progress, not a video-card open/click.
  // A browser report is still untrusted until source & funded settlement.
  const productionSeen=new Map();
  async function productionHistoryProgress() {
    const service=auth();
    const user=currentUser();
    if(!user||!service?.getHistory)return;
    const recent=service.getHistory()?.[0];
    const videoId=String(recent?.youtubeId||recent?.videoId||'').trim();
    const seconds=Math.max(0,Number(recent?.watchedSeconds)||0);
    if(!/^[A-Za-z0-9_-]{11}$/.test(videoId)||seconds<30)return;
    const day=new Date().toISOString().slice(0,10);
    const key=user.key+'|'+videoId+'|'+day;
    if(productionSeen.has(key))return;
    productionSeen.set(key,true);
    try{
      if(!await connect())return;
      await request('/v1/production/plays',{method:'POST',body:{platform:'youtube',sourceId:videoId,
        title:String(recent.showTitle||recent.epTitle||'').slice(0,180),observedSeconds:seconds}});
    }catch(error){
      productionSeen.delete(key);
      // A missing migration/deployment must never interrupt video playback.
      console.warn('Production play ledger pending',error);
    }
  }
  document.addEventListener('starquest:history-progress',()=>void productionHistoryProgress());
  document.addEventListener('starquest:watch-progress',()=>void productionHistoryProgress());


  if (currentUser()) connect();
  global.StarQuestCloudLedger = Object.freeze({
    enabled: true,
    connect: connect,
    // Signed StarQuest D1 receipts: credit discovery does not equal payment.
    recordProductionPlay: async function (play) {
      if (!play || !play.platform || !play.sourceId) throw Error('source_required');
      if (!(await connect())) throw Error('ledger_not_connected');
      return request('/v1/production/plays',{method:'POST',body:{
        platform:play.platform,sourceId:play.sourceId,title:play.title,
        observedSeconds:Math.max(0,Math.min(7200,Number(play.observedSeconds)||0))
      }});
    },
    registerProduction: async function (card) {
      if (!(await connect())) throw Error('ledger_not_connected');
      // Only a verified owner's own card; never automatically grant third-party
      // exports access to the platform account or Fred's work.
      return request('/v1/production/register',{method:'POST',body:card});
    },
    searchProductionCredits: async function (name) {
      const response=await global.fetch(endpoint+'/v1/production/search?name='+encodeURIComponent(String(name||'').trim().slice(0,100)),{cache:'no-store'});
      const payload=await response.json();
      if(!response.ok||!payload.ok)throw Error(payload.message||'Credit search unavailable');
      return payload;
    },
    claimProductionCredit: async function (creditId,evidenceUrl) {
      if (!(await connect())) throw Error('ledger_not_connected');
      return request('/v1/production/claim',{method:'POST',body:{creditId,evidenceUrl}});
    },
    productionClaims: async function () {
      if (!(await connect())) throw Error('ledger_not_connected');
      return request('/v1/production/mine',{method:'POST',body:{}});
    },
    submitShare: async function (share) {
      if (!share || !String(share.attemptId || "").trim() || !String(share.contentId || "").trim()) {
        throw new Error("share_attempt_and_content_required");
      }
      if (!await connect()) throw new Error("ledger_not_connected");
      const payload = await request("/v1/shares", {
        method: "POST",
        body: {
          attemptId: String(share.attemptId).trim(),
          contentId: String(share.contentId).trim(),
          method: share.method || "web_share_api",
          receiptHash: share.receiptHash,
          showTitle: share.showTitle,
          episodeId: share.episodeId,
          companyId: share.companyId,
          actors: share.actors,
          fullyWatched: share.fullyWatched,
          attributionStatus: share.attributionStatus
        },
        keepalive: true
      });
      applyState(payload);
      return payload;
    },
    authenticatedFetch: async function (target, options) {
      const user = currentUser();
      if (!user) throw new Error("ledger_not_connected");
      const url = new URL(String(target || ""));
      const allowedPath = url.pathname.indexOf("/v1/quants/") === 0 || url.pathname.indexOf("/v1/music-quants/") === 0;
      const quantTarget = url.hostname === "quanta-phi-ledger.marvaseater.workers.dev" && allowedPath;
      const infinityTarget = url.hostname === "unified-wallet.marvaseater.workers.dev" && ["/v1/wallet/state", "/v1/tokens/mint"].includes(url.pathname);
      const allowed = url.protocol === "https:" && (quantTarget || infinityTarget);
      if (!allowed) throw new Error("ledger_target_not_allowed");
      const response = await global.fetch(url.toString(), {
        method: options && options.method ? options.method : "GET",
        headers: {
          "Authorization": "Bearer " + getDeviceToken(user.key),
          "Content-Type": "application/json"
        },
        body: options && options.body ? (typeof options.body === "string" ? options.body : JSON.stringify(options.body)) : undefined,
        cache: "no-store"
      });
      return response;
    }
  });
})(window);
