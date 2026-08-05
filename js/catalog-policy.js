/*
 * StarQuest catalog access policy.
 *
 * Goals:
 * 1. Do not advertise YouTube rent/buy trailers as playable full programs.
 * 2. Keep nearly all verified catalog content free while the library grows.
 * 3. Retain only a tiny one-StarCoin test tier made from lower-rated,
 *    source-backed archive programs.
 */
(function applyCatalogPolicy() {
  "use strict";

  if (typeof SHOWS === "undefined" || !Array.isArray(SHOWS)) return;

  const NEVER_LOCK = new Set([
    "reading-rainbow",
    "new-alfred-hitchcock-presents",
    "due-south"
  ]);
  const MAX_TEST_TIER = 3;
  const MAX_TEST_SCORE = 6.2;

  function textFor(show) {
    return [show.title, show.description]
      .concat((show.episodes || []).flatMap((ep) => [ep.title, ep.description]))
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  function isCommercialYoutubePlaceholder(show) {
    if (!show || !show.payToWatch || !Array.isArray(show.episodes)) return false;
    const hasYoutube = show.episodes.some((ep) => !!ep.youtubeId);
    const hasArchiveSource = show.episodes.some((ep) => !!ep.archiveId || !!ep.archiveFile);
    const copy = textFor(show);
    const saysRentOrBuy = /rent\s*(?:or|\/)\s*buy|youtube movies|purchase on youtube/.test(copy);
    return hasYoutube && !hasArchiveSource && saysRentOrBuy;
  }

  function hasArchiveSource(show) {
    return !!show && Array.isArray(show.episodes) && show.episodes.some((ep) =>
      !!ep.archiveId || (typeof ep.archiveFile === "string" && ep.archiveFile.length > 0)
    );
  }

  const removed = [];
  for (let index = SHOWS.length - 1; index >= 0; index -= 1) {
    const show = SHOWS[index];
    if (isCommercialYoutubePlaceholder(show)) {
      removed.push({ id: show.id, title: show.title, reason: "commercial YouTube placeholder" });
      SHOWS.splice(index, 1);
    }
  }

  /* Make every remaining title free before selecting the tiny test tier. */
  SHOWS.forEach((show) => {
    show.payToWatch = false;
    show.starCoinCost = 0;
    show.accessPolicy = "free";
  });

  const testTier = SHOWS
    .filter((show) =>
      !NEVER_LOCK.has(show.id) &&
      !show.featured &&
      hasArchiveSource(show) &&
      Number.isFinite(Number(show.score)) &&
      Number(show.score) <= MAX_TEST_SCORE
    )
    .sort((a, b) => Number(a.score) - Number(b.score))
    .slice(0, MAX_TEST_TIER);

  testTier.forEach((show) => {
    show.payToWatch = true;
    show.starCoinCost = 1;
    show.accessPolicy = "one-star-test-tier";
  });

  window.StarQuestCatalogPolicyReport = Object.freeze({
    removed,
    freeTitles: SHOWS.filter((show) => !show.payToWatch).map((show) => show.id),
    oneStarTestTier: testTier.map((show) => ({ id: show.id, title: show.title, score: show.score }))
  });

  document.dispatchEvent(new CustomEvent("starquest:catalog-policy-applied", {
    detail: window.StarQuestCatalogPolicyReport
  }));
})();
