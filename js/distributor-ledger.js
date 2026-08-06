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

  global.AINScansDistributorLedger = { recordEligibleWatch, read, SECONDS_PER_STARCOIN };
})(window);
