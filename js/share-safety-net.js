/**
 * StarQuest share safety net.
 *
 * Loaded before app.js so the visible Share control still works when the main
 * catalog/player bundle fails. app.js owns normal share rewards; this fallback
 * still preserves Twitter payloads and 1/10 progress if the main bundle fails.
 */
(function (global) {
  "use strict";

  const document = global.document;
  if (!document || global.StarQuestShareSafetyNet) return;

  const AUDIT_KEY = "starquest_share_fallback_audit";
  let activeShare = null;
  let appReady = false;
  let shareInFlight = false;

  function byId(id) {
    return document.getElementById(id);
  }

  function status(message) {
    const node = byId("share-sheet-status");
    if (node) node.textContent = message;
  }

  function payload() {
    const titleNode = byId("player-ep-title");
    const program = titleNode && titleNode.textContent
      ? titleNode.textContent.trim()
      : "StarQuest program";
    return {
      attemptId: "fallback-attempt-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9),
      title: program + " on StarQuest",
      text: "Watch " + program + " on StarQuest ⭐",
      url: global.location.href
    };
  }

  function audit(method, state) {
    let events = [];
    try {
      events = JSON.parse(global.localStorage.getItem(AUDIT_KEY) || "[]");
      if (!Array.isArray(events)) events = [];
    } catch (_) {
      events = [];
    }
    events.push({
      id: "fallback-share-" + Date.now().toString(36),
      createdAt: Date.now(),
      method,
      deliveryState: state || "client_handoff_unverified",
      url: activeShare ? activeShare.url : global.location.href,
      verified: false,
      credited: false,
      payoutEligible: false
    });
    try {
      global.localStorage.setItem(AUDIT_KEY, JSON.stringify(events.slice(-100)));
    } catch (_) {
      // Sharing remains available when storage is unavailable.
    }
  }

  function close() {
    const backdrop = byId("share-backdrop");
    if (!backdrop) return;
    backdrop.hidden = true;
    backdrop.classList.remove("open");
    if (document.body) document.body.classList.remove("share-open");
  }

  function open() {
    activeShare = payload();
    const shareButton = byId("player-share-btn");
    const backdrop = byId("share-backdrop");
    const program = byId("share-sheet-program");
    const nativeButton = byId("share-native-btn");
    const twitter = byId("share-twitter-link");
    const sms = byId("share-sms-link");
    const email = byId("share-email-link");

    if (shareButton) shareButton.disabled = false;
    if (program) program.textContent = activeShare.text;
    if (sms) sms.href = "sms:?body=" + encodeURIComponent(activeShare.text + "\n" + activeShare.url);
    if (email) {
      email.href = "mailto:?subject=" + encodeURIComponent(activeShare.title)
        + "&body=" + encodeURIComponent(activeShare.text + "\n\n" + activeShare.url);
    }
    if (twitter) {
      twitter.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(activeShare.text)
        + "&url=" + encodeURIComponent(activeShare.url);
    }
    if (nativeButton) {
      nativeButton.hidden = false;
      nativeButton.disabled = false;
      nativeButton.textContent = typeof global.navigator.share === "function"
        ? "📱 Share with phone"
        : "🔗 Copy share link";
    }
    status(appReady
      ? "Choose how you want to share it."
      : "Share safety mode is active. Choose a phone, text, email, or copy option.");
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.classList.add("open");
      if (document.body) document.body.classList.add("share-open");
    }
  }

  async function copyFallback() {
    if (!activeShare) activeShare = payload();
    const copyText = activeShare.text + "\n" + activeShare.url;
    let copied = false;
    try {
      if (!global.navigator.clipboard || !global.navigator.clipboard.writeText) {
        throw new Error("clipboard_unavailable");
      }
      await global.navigator.clipboard.writeText(copyText);
      copied = true;
    } catch (_) {
      const field = document.createElement("textarea");
      field.value = copyText;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      if (field.setSelectionRange) field.setSelectionRange(0, field.value.length);
      try {
        copied = typeof document.execCommand === "function" && document.execCommand("copy");
      } catch (_) {
        copied = false;
      }
      field.remove();
    }
    if (copied) {
      audit("copy_link");
      status("Exact link copied and audited. It did not add StarCoin progress.");
      return true;
    }
    global.prompt("Copy this StarQuest link:", copyText);
    status("Select and copy the link. Manual copies do not add StarCoin progress.");
    return false;
  }

  async function nativeFallback() {
    if (shareInFlight) return;
    if (!activeShare) activeShare = payload();
    shareInFlight = true;
    const button = byId("share-native-btn");
    if (button) button.disabled = true;
    try {
      if (typeof global.navigator.share !== "function") {
        await copyFallback();
        return;
      }
      await global.navigator.share({
        title: activeShare.title,
        text: activeShare.text,
        url: activeShare.url
      });
      creditFallback("web_share_api_safety_net");
    } catch (error) {
      status(error && error.name === "AbortError"
        ? "Share canceled. No StarCoin progress was added."
        : "Phone sharing was unavailable. Use Text, Email, or Copy Link.");
    } finally {
      shareInFlight = false;
      if (button) {
        button.disabled = false;
        button.textContent = typeof global.navigator.share === "function"
          ? "📱 Share with phone"
          : "🔗 Copy share link";
      }
    }
  }

  function creditFallback(method) {
    if (!activeShare) activeShare = payload();
    if (!global.StarQuestAuth || typeof global.StarQuestAuth.recordShare !== "function") {
      audit(method, "confirmed_but_wallet_unavailable");
      status("Share completed, but the wallet was unavailable. Reopen StarQuest before sharing again.");
      return;
    }
    const result = global.StarQuestAuth.recordShare(activeShare.url, {
      attemptId: activeShare.attemptId,
      confirmed: true,
      verified: true,
      method,
      url: activeShare.url,
      showTitle: activeShare.title
    });
    if (result && result.ok && result.credited) {
      status(result.awarded > 0
        ? "⭐ Share completed. StarCoin created at 10/10."
        : "Share completed. StarCoin progress: " + result.progressToNextCoin + "/10.");
    } else {
      status(result && result.error === "duplicate_share_attempt"
        ? "This share was already counted. Open Share again for a new attempt."
        : "Share completed, but StarCoin progress could not be saved.");
    }
  }

  document.addEventListener("click", function (event) {
    const source = event.target && event.target.closest ? event.target : null;
    if (!source) return;

    if (source.closest("#player-share-btn")) {
      open();
      if (!appReady) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    if (appReady) return;

    if (source.closest("#share-sheet-close") || source === byId("share-backdrop")) {
      event.preventDefault();
      close();
      return;
    }
    if (source.closest("#share-copy-btn")) {
      event.preventDefault();
      event.stopPropagation();
      copyFallback();
      return;
    }
    if (source.closest("#share-native-btn")) {
      event.preventDefault();
      event.stopPropagation();
      nativeFallback();
      return;
    }
    if (source.closest("#share-twitter-link")) {
      creditFallback("twitter_intent_safety_net");
      return;
    }
    if (source.closest("#share-sms-link")) {
      audit("sms_handoff");
      status("Text composer opened and audited without StarCoin credit.");
      return;
    }
    if (source.closest("#share-email-link")) {
      audit("email_handoff");
      status("Email composer opened and audited without StarCoin credit.");
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (!appReady && event.key === "Escape") close();
  });

  global.StarQuestShareSafetyNet = {
    open,
    close,
    isAppReady: function () { return appReady; },
    markAppReady: function () {
      appReady = true;
      global.StarQuestShareAppReady = true;
    }
  };
})(window);
