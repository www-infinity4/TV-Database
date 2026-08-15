/**
 * StarQuest catalog rights and analysis ledger.
 *
 * This module inventories every catalog title and episode. Automated review is
 * deliberately separate from paid human viewing: a unique authorized computer
 * analysis creates one provisional scan accrual, not an automatic payout.
 * Actual settlement still requires an active
 * rights contract, a verified viewer event, funded approval, and a transaction
 * reference from the protected server ledger.
 */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest.catalogLedger.v1";
  const DEFAULT_SCAN_RATE = 1;
  const BLOCKED_SOURCE_STATES = new Set(["restricted", "file-missing", "unverified"]);

  function read() {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : { titles: {}, episodes: {}, analysis: {}, scanAccruals: [] };
    } catch (_) {
      return { titles: {}, episodes: {}, analysis: {}, scanAccruals: [] };
    }
  }

  function write(ledger) {
    try { global.localStorage.setItem(STORAGE_KEY, JSON.stringify(ledger)); } catch (_) {}
  }

  function rightsState(show) {
    if (show && show.distributorAccount && show.contractId) return "contract-recorded";
    if (show && show.distributorAccount) return "account-recorded-contract-required";
    if (show && (show.companyId || show.companyName || show.network || show.studio)) return "rights-holder-review";
    return "rights-unresolved";
  }

  function sourceState(episode) {
    if (!episode) return "missing";
    return BLOCKED_SOURCE_STATES.has(episode.sourceStatus) ? episode.sourceStatus : "catalogued";
  }

  function analysisState(show, episode) {
    const source = sourceState(episode);
    if (source !== "catalogued") return "blocked-source";
    const basis = String((episode && (episode.rightsBasis || episode.license)) || (show && (show.rightsBasis || show.license)) || "").toLowerCase();
    if (/public.?domain|licensed|permission|owned/.test(basis)) return "queued-authorized";
    return "held-for-rights-review";
  }

  function inventory(shows) {
    const previous = read();
    const ledger = { schemaVersion: 2, generatedAt: Date.now(), titles: {}, episodes: {}, analysis: previous.analysis || {}, scanAccruals: previous.scanAccruals || [] };
    (Array.isArray(shows) ? shows : []).forEach((show) => {
      if (!show || !show.id) return;
      const episodes = Array.isArray(show.episodes) ? show.episodes : [];
      const rights = rightsState(show);
      ledger.titles[show.id] = {
        showId: show.id,
        title: String(show.title || show.id),
        type: String(show.type || "show"),
        episodeCount: episodes.length,
        companyId: String(show.companyId || show.network || show.studio || ""),
        distributorAccount: String(show.distributorAccount || ""),
        contractId: String(show.contractId || ""),
        rightsState: rights,
        payoutState: rights === "contract-recorded" ? "eligible-events-await-settlement" : "blocked-until-contract",
      };
      episodes.forEach((episode, index) => {
        const episodeId = String(episode.id || (show.id + "-episode-" + (index + 1)));
        ledger.episodes[episodeId] = {
          episodeId,
          showId: show.id,
          title: String(episode.title || "Episode " + (index + 1)),
          archiveId: String(episode.archiveId || ""),
          sourceState: sourceState(episode),
          rightsState: rights,
          analysisState: analysisState(show, episode),
          scanCompensationPolicy: "one-provisional-accrual-per-unique-authorized-fingerprint",
          viewerSettlementState: rights === "contract-recorded" ? "requires-verified-viewer-event" : "blocked-until-contract",
        };
      });
    });
    write(ledger);
    const result = summary(ledger);
    if (global.document && typeof global.document.dispatchEvent === "function") {
      global.document.dispatchEvent(new CustomEvent("starquest:catalog-ledger-ready", { detail: result }));
    }
    return result;
  }

  function recordAuthorizedAnalysis(episodeId, analysis) {
    const ledger = read();
    const episode = ledger.episodes[episodeId];
    if (!episode) return { ok: false, reason: "episode-not-ledgered" };
    const value = analysis && typeof analysis === "object" ? analysis : {};
    const sourceFingerprint = String(value.sourceFingerprint || "").trim();
    if (!sourceFingerprint) return { ok: false, reason: "source-fingerprint-required" };
    ledger.scanAccruals = Array.isArray(ledger.scanAccruals) ? ledger.scanAccruals : [];
    const duplicate = ledger.scanAccruals.find((event) => event.episodeId === episodeId && event.sourceFingerprint === sourceFingerprint);
    if (duplicate) return { ok: true, duplicate: true, episodeId, accrual: duplicate };
    if (episode.analysisState !== "queued-authorized") return { ok: false, reason: episode.analysisState };
    const title = ledger.titles[episode.showId] || {};
    const contracted = title.rightsState === "contract-recorded";
    const accrual = {
      eventId: "scan-accrual-" + episodeId + "-" + Date.now().toString(36),
      assetType: String(title.type || "show"),
      showId: episode.showId,
      episodeId,
      sourceFingerprint,
      amount: DEFAULT_SCAN_RATE,
      unit: "provisional-infinity",
      rightsAccount: title.distributorAccount || "unclaimed:" + episode.showId,
      status: contracted ? "accrued-awaiting-funded-settlement" : "unclaimed-rights-holder",
      createdAt: Date.now(),
      paidAt: null,
      settlementReference: "",
    };
    ledger.analysis[episodeId] = {
      episodeId,
      completedAt: Date.now(),
      summary: String(value.summary || "").slice(0, 1000),
      adBreakMarkers: Array.isArray(value.adBreakMarkers) ? value.adBreakMarkers.slice(0, 24) : [],
      conversationCues: Array.isArray(value.conversationCues) ? value.conversationCues.slice(0, 40) : [],
      sourceFingerprint,
      scanCompensationAccrued: true,
      scanAccrualEventId: accrual.eventId,
    };
    ledger.scanAccruals.push(accrual);
    episode.analysisState = "analyzed";
    write(ledger);
    return { ok: true, duplicate: false, episodeId, accrual };
  }

  function nextAuthorizedBatch(limit) {
    const ledger = read();
    return Object.values(ledger.episodes)
      .filter((episode) => episode.analysisState === "queued-authorized")
      .slice(0, Math.max(1, Math.min(50, Number(limit) || 10)));
  }

  function summary(existing) {
    const ledger = existing || read();
    const titles = Object.values(ledger.titles || {});
    const episodes = Object.values(ledger.episodes || {});
    const scanAccruals = Array.isArray(ledger.scanAccruals) ? ledger.scanAccruals : [];
    return {
      titles: titles.length,
      episodes: episodes.length,
      titlesLedgered: titles.length,
      contractsRecorded: titles.filter((title) => title.rightsState === "contract-recorded").length,
      payoutsCompleted: 0,
      scanAccruals: scanAccruals.length,
      provisionalInfinityAccrued: scanAccruals.reduce((sum, event) => sum + Math.max(0, Number(event.amount) || 0), 0),
      contractedScanAccruals: scanAccruals.filter((event) => event.status === "accrued-awaiting-funded-settlement").length,
      unclaimedScanAccruals: scanAccruals.filter((event) => event.status === "unclaimed-rights-holder").length,
      authorizedAnalysisQueued: episodes.filter((episode) => episode.analysisState === "queued-authorized").length,
      rightsReviewHeld: episodes.filter((episode) => episode.analysisState === "held-for-rights-review").length,
      sourceBlocked: episodes.filter((episode) => episode.analysisState === "blocked-source").length,
      analyzed: episodes.filter((episode) => episode.analysisState === "analyzed").length,
    };
  }

  function bootstrap() {
    if (typeof SHOWS !== "undefined") inventory(SHOWS);
  }

  if (global.document && global.document.readyState === "loading") global.document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  else bootstrap();

  global.StarQuestCatalogLedger = { inventory, read, summary, nextAuthorizedBatch, recordAuthorizedAnalysis, storageKey: STORAGE_KEY, defaultScanRate: DEFAULT_SCAN_RATE };
})(window);
