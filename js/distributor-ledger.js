/**
 * AINScans distributor settlement prototype.
 * Verified watch time produces StarCoin settlement events for a registered
 * rights account. Unknown ownership is held as unclaimed; this browser ledger
 * is an auditable prototype, not a real payment processor.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest.distributorLedger.v1";
  const SECONDS_PER_STARCOIN = 3600;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && typeof value === "object" ? value : { accounts: {}, events: [] };
    } catch (_) {
      return { accounts: {}, events: [] };
    }
  }

  function write(ledger) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger)); } catch (_) {}
  }

  function recordEligibleWatch(contentId, seconds, metadata) {
    const step = Math.floor(Number(seconds));
    if (!contentId || !Number.isFinite(step) || step <= 0) return { ok: false, produced: 0 };
    const meta = metadata && typeof metadata === "object" ? metadata : {};
    const verifiedAccount = String(meta.distributorAccount || "").trim();
    const accountId = verifiedAccount || "unclaimed:" + String(meta.archiveId || contentId);
    const ledger = read();
    const account = ledger.accounts[accountId] || {
      accountId,
      verified: Boolean(verifiedAccount),
      eligibleSeconds: 0,
      settledSeconds: 0,
      starCoins: 0,
    };
    account.eligibleSeconds += step;
    const produced = Math.floor((account.eligibleSeconds - account.settledSeconds) / SECONDS_PER_STARCOIN);
    for (let index = 0; index < produced; index++) {
      account.settledSeconds += SECONDS_PER_STARCOIN;
      account.starCoins += 1;
      ledger.events.push({
        id: "ainscans-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9),
        contentId: String(contentId),
        archiveId: String(meta.archiveId || ""),
        distributorAccount: accountId,
        amount: 1,
        status: account.verified ? "claimable" : "unclaimed",
        createdAt: Date.now(),
      });
    }
    ledger.accounts[accountId] = account;
    ledger.events = ledger.events.slice(-1000);
    write(ledger);
    if (produced > 0) global.dispatchEvent(new CustomEvent("starquest:distributor-starcoins", {
      detail: { contentId, accountId, produced, verified: account.verified },
    }));
    return { ok: true, produced, accountId, verified: account.verified };
  }

  /*
   * Share safety net
   * ----------------
   * The main StarQuest app normally owns the share sheet and share accounting.
   * This independent bootstrap exists because a failure earlier in the large
   * player/catalog script must never leave the visible Share button disabled or
   * inert. It stays out of the way when app.js works and activates only when a
   * tap fails to open the normal share sheet.
   */
  function installShareSafetyNet() {
    const shareButton = document.getElementById("player-share-btn");
    const backdrop = document.getElementById("share-backdrop");
    const nativeButton = document.getElementById("share-native-btn");
    const smsLink = document.getElementById("share-sms-link");
    const emailLink = document.getElementById("share-email-link");
    const copyButton = document.getElementById("share-copy-btn");
    const closeButton = document.getElementById("share-sheet-close");
    const program = document.getElementById("share-sheet-program");
    const status = document.getElementById("share-sheet-status");
    if (!shareButton || !backdrop) return;

    shareButton.disabled = false;
    shareButton.removeAttribute("aria-disabled");
    shareButton.style.pointerEvents = "auto";

    function currentPayload() {
      const titleNode = document.querySelector(".player-ep-title");
      const title = String(titleNode && titleNode.textContent || document.title || "StarQuest").trim();
      const url = new URL(location.href);
      url.searchParams.delete("deploy");
      const showId = url.searchParams.get("sqShow") || "starquest";
      const episodeId = url.searchParams.get("sqEpisode") || title || "content";
      return {
        title: title + " on StarQuest",
        text: "Watch " + title + " on StarQuest ⭐",
        url: url.toString(),
        contentId: showId + "|" + episodeId
      };
    }

    function setStatus(message) {
      if (status) status.textContent = message;
    }

    function openFallback() {
      const payload = currentPayload();
      backdrop.dataset.shareFallbackActive = "true";
      backdrop.hidden = false;
      backdrop.classList.add("open");
      if (program) program.textContent = payload.text;
      if (smsLink) smsLink.href = "sms:?body=" + encodeURIComponent(payload.text + "\n" + payload.url);
      if (emailLink) emailLink.href = "mailto:?subject=" + encodeURIComponent(payload.title) + "&body=" + encodeURIComponent(payload.text + "\n\n" + payload.url);
      if (nativeButton) {
        nativeButton.hidden = false;
        nativeButton.disabled = false;
        nativeButton.textContent = typeof navigator.share === "function" ? "📱 Share with phone" : "🔗 Copy share link";
      }
      setStatus("Share is running in safety-net mode so this control still works even if another StarQuest module failed.");
    }

    function closeFallback() {
      if (backdrop.dataset.shareFallbackActive !== "true") return;
      backdrop.hidden = true;
      backdrop.classList.remove("open");
      delete backdrop.dataset.shareFallbackActive;
    }

    async function copyFallback(payload) {
      const value = payload.text + "\n" + payload.url;
      try {
        await navigator.clipboard.writeText(value);
        setStatus("Exact StarQuest link copied.");
        return true;
      } catch (_) {
        const field = document.createElement("textarea");
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        let copied = false;
        try { copied = document.execCommand("copy"); } catch (_) {}
        field.remove();
        if (!copied) window.prompt("Copy this StarQuest link:", value);
        setStatus(copied ? "Exact StarQuest link copied." : "Copy the link shown, then send it.");
        return copied;
      }
    }

    function fallbackFullyWatched(payload) {
      try {
        if (!global.StarQuestAuth || typeof global.StarQuestAuth.getHistory !== "function") return false;
        const history = global.StarQuestAuth.getHistory() || [];
        return history.some((item) => {
          if (!item) return false;
          const same = String(item.episodeId || item.title || "").includes(String(payload.contentId || "")) ||
            String(item.title || "").trim() === String(payload.contentId || "").trim();
          return same && (item.completed === true || Number(item.completionRate) >= 0.98);
        });
      } catch (_) { return false; }
    }

    function recordFallbackShare(payload, method, verified) {
      if (!global.StarQuestAuth || typeof global.StarQuestAuth.recordShare !== "function" || !global.StarQuestAuth.currentUser || !global.StarQuestAuth.currentUser()) {
        setStatus("Share completed. Sign in to build StarCoin progress.");
        return;
      }
      const result = global.StarQuestAuth.recordShare(payload.contentId, {
        verified: verified === true,
        confirmed: verified === true,
        fullyWatched: fallbackFullyWatched(payload),
        status: "share_safety_net",
        method,
        url: payload.url,
        showTitle: payload.title,
        episodeId: payload.contentId
      });
      if (!result || !result.ok) {
        setStatus(result && result.message ? result.message : "Shared, but StarCoin progress could not be recorded.");
        return;
      }
      if (result.awarded > 0) setStatus("⭐ StarCoin created from verified share progress.");
      else if (result.credited) setStatus("Confirmed share action recorded. " + (result.sharesPerCoin - result.progressToNextCoin) + " until the next StarCoin.");
      else setStatus("The share action could not be confirmed, so the wallet counter was not changed.");
    }

    shareButton.addEventListener("click", function () {
      shareButton.disabled = false;
      setTimeout(function () {
        if (backdrop.hidden) openFallback();
      }, 40);
    });

    if (nativeButton) nativeButton.addEventListener("click", async function (event) {
      if (backdrop.dataset.shareFallbackActive !== "true") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const payload = currentPayload();
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: payload.title, text: payload.text, url: payload.url });
          recordFallbackShare(payload, "web_share_api_safety_net", true);
        } catch (error) {
          if (error && error.name === "AbortError") setStatus("Share canceled.");
          else {
            await copyFallback(payload);
          recordFallbackShare(payload, "copy_fallback_safety_net", true);
          }
        }
      } else {
        await copyFallback(payload);
        recordFallbackShare(payload, "copy_fallback_safety_net", true);
      }
    }, true);

    if (copyButton) copyButton.addEventListener("click", async function (event) {
      if (backdrop.dataset.shareFallbackActive !== "true") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const payload = currentPayload();
      await copyFallback(payload);
      recordFallbackShare(payload, "copy_link_safety_net", true);
    }, true);

    if (smsLink) smsLink.addEventListener("click", function () {
      if (backdrop.dataset.shareFallbackActive !== "true") return;
      recordFallbackShare(currentPayload(), "sms_handoff_safety_net", true);
    }, true);

    if (emailLink) emailLink.addEventListener("click", function () {
      if (backdrop.dataset.shareFallbackActive !== "true") return;
      recordFallbackShare(currentPayload(), "email_handoff_safety_net", true);
    }, true);

    if (closeButton) closeButton.addEventListener("click", closeFallback);
    backdrop.addEventListener("click", function (event) { if (event.target === backdrop) closeFallback(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", installShareSafetyNet, { once: true });
  else installShareSafetyNet();

  global.AINScansDistributorLedger = { recordEligibleWatch, read, SECONDS_PER_STARCOIN };
})(window);
