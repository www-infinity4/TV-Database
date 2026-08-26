/**
 * ClassicTV — App Logic
 * Handles browsing, search, modal, and player.
 */

(function () {
  "use strict";

  const originalElementLabels = window.StarQuestEditableRegistry = window.StarQuestEditableRegistry || {};

  function registerCardEditor(card, key, original) {
    const value = card && card.querySelector(".editable-text");
    const marker = card && card.querySelector(".card-avatar-marker");
    if (!value || !marker) return;
    originalElementLabels[key] = { node: value, kind: "element", original };
    try {
      const saved = JSON.parse(localStorage.getItem("starquest_personal_design")) || {};
      if (saved.overrides && saved.overrides[key]) value.textContent = String(saved.overrides[key]).slice(0, 64);
    } catch (_) {}
    marker.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      document.dispatchEvent(new CustomEvent("starquest:edit-element", { detail: { target: original, scope: "component", key } }));
    });
  }

  /* ── State ── */
  const state = {
    currentShow: null,
    currentEpisode: null,
    activeGenre: "all",
    searchQuery: "",
  };

  /* ── DOM refs ── */
  const DOM = {
    heroTitle: document.getElementById("hero-title"),
    heroBadge: document.getElementById("hero-badge"),
    heroBgArt: document.querySelector(".hero__bg-art"),
    heroDesc: document.getElementById("hero-desc"),
    heroScore: document.getElementById("hero-score"),
    heroRating: document.getElementById("hero-rating"),
    heroYears: document.getElementById("hero-years"),
    heroPlayBtn: document.getElementById("hero-play-btn"),
    heroInfoBtn: document.getElementById("hero-info-btn"),
    heroShuffleBtn: document.getElementById("hero-shuffle-btn"),
    heroGenres: document.getElementById("hero-genres"),

    searchInput: document.getElementById("search-input"),
    searchOverlay: document.getElementById("search-overlay"),
    searchResultsTitle: document.getElementById("search-results-title"),
    searchGrid: document.getElementById("search-grid"),
    clearSearch: document.getElementById("clear-search"),

    rowFeatured: document.getElementById("row-featured"),
    rowDrama: document.getElementById("row-drama"),
    rowComedy: document.getElementById("row-comedy"),
    rowScifi: document.getElementById("row-scifi"),
    rowCrime: document.getElementById("row-crime"),
    rowGameShows: document.getElementById("row-game-shows"),
    row70s: document.getElementById("row-70s"),
    row80s: document.getElementById("row-80s"),
    row90s: document.getElementById("row-90s"),

    modal: document.getElementById("show-modal"),
    modalBackdrop: document.getElementById("modal-backdrop"),
    modalClose: document.getElementById("modal-close"),
    modalTitle: document.getElementById("modal-title"),
    modalScore: document.getElementById("modal-score"),
    modalRating: document.getElementById("modal-rating"),
    modalYears: document.getElementById("modal-years"),
    modalGenres: document.getElementById("modal-genres"),
    modalDesc: document.getElementById("modal-desc"),
    modalEpisodes: document.getElementById("modal-episodes"),
    modalHeroImg: document.getElementById("modal-hero-img"),

    playerPage: document.getElementById("player-page"),
    playerFrame: document.getElementById("player-frame"),
    playerVideo: document.getElementById("player-video"),
    playerError: document.getElementById("player-error"),
    playerErrorLink: document.getElementById("player-error-link"),
    playerBack: document.getElementById("player-back"),
    playerEpTitle: document.getElementById("player-ep-title"),
    playerLoading: document.getElementById("player-loading"),

    rowDueSouth: document.getElementById("row-due-south"),
    rowMovies: document.getElementById("row-movies"),
    rowFamily: document.getElementById("row-family"),
    rowForYou: document.getElementById("row-for-you"),
    rowReadingRainbow: document.getElementById("row-reading-rainbow"),
    readingRainbowBrowseAll: document.getElementById("reading-rainbow-browse-all"),
    smartSpotlightMeta: document.getElementById("smart-spotlight-meta"),
    smartSpotlightReason: document.getElementById("smart-spotlight-reason"),
    smartSpotlightClipboard: document.getElementById("smart-spotlight-clipboard"),
    rowHitchcock: document.getElementById("row-hitchcock"),
    hitchcockBrowseAll: document.getElementById("hitchcock-browse-all"),
    rowStarCoinMovies: document.getElementById("row-starcoin-movies"),
    forYouSection: document.getElementById("for-you-section"),
    forYouGenreLabel: document.getElementById("for-you-genre-label"),
    allEpsBackdrop: document.getElementById("all-eps-backdrop"),
    allEpsTabs: document.getElementById("all-eps-tabs"),
    allEpsList: document.getElementById("all-eps-list"),
    allEpsClose: document.getElementById("all-eps-close"),
    allEpsTitle: document.getElementById("all-eps-title"),
    dueSouthBrowseAll: document.getElementById("due-south-browse-all"),

    genrePills: document.querySelectorAll(".genre-pill"),
  };

  /* ── Personalization helpers ── */
  const EXT_PLAYABLE = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
  const TV_FIRST_TYPES = new Set(["tv", "series", "show", "soap", "vhs"]);
  /* Strong bias so "For You" feels like a TV shelf first and only falls back
     to non-series items when the playable catalogue has nothing better. */
  const TV_SHOW_BOOST = 40;
  const NON_TV_PENALTY = -35;
  const MAX_HISTORY_ITEMS = 200;
  const WATCH_PERSIST_INTERVAL_SECONDS = 10;
  /* Sparse companion rhythm: first check-in after three minutes, then at
     twelve and twenty-five minutes. Sponsored notes have an additional
     twenty-minute cap inside cosmo-live.js. */
  const COSMO_POPIN_SCHEDULE_MS = [180000, 720000, 1500000];
  const COSMO_POPIN_DISMISS_MS = 14000;

  function showDecade(show) {
    const year = parseInt(String(show.years || "").split("–")[0], 10);
    if (!Number.isFinite(year)) return "";
    return Math.floor(year / 10) * 10 + "s";
  }

  function buildEpisodeId(ep, show) {
    return (show && show.id ? show.id : "unknown") + "|S" + ep.season + "E" + ep.episode;
  }

  function showUnlockCost(show) {
    if (!show || typeof show !== "object") return 0;
    return Number.isFinite(Number(show.starCoinCost))
      ? Math.max(0, Math.trunc(Number(show.starCoinCost)))
      : (show.payToWatch ? 1 : 0);
  }

  function isEpisodePlayable(ep, show) {
    if (!ep || typeof ep !== "object") return false;
    if (ep.sourceStatus === "restricted" || ep.sourceStatus === "file-missing" || ep.sourceStatus === "unverified") return false;
    /* A YouTube rent/buy listing is metadata, not a verified full program.
       Never charge a StarCoin or show a working Play control for a trailer or
       storefront link. Paid catalog records become playable only after an
       exact full source is mapped. */
    if (showUnlockCost(show) > 0 && ep.youtubeId && !ep.archiveId && !ep.archiveFile) return false;
    if (ep.youtubeId) return true;
    if (typeof ep.archiveFile === "string" && ep.archiveId) return EXT_PLAYABLE.test(ep.archiveFile);
    // Item-only Archive.org records are resolved from metadata at playback time.
    return !!ep.archiveId;
  }

  function isShowAvailable(show) {
    if (!show || !Array.isArray(show.episodes) || !show.episodes.length) return false;
    return show.episodes.some((ep) => isEpisodePlayable(ep, show));
  }

  function getPrimaryEpisode(show) {
    if (!show || !Array.isArray(show.episodes)) return null;
    return show.episodes.find((ep) => isEpisodePlayable(ep, show)) || null;
  }

  const DISCOVERY_KEY = "starquest.discovery.v1";
  const CLIPBOARD_PREFS_KEY = "starquest.clipboard-preferences.v1";
  const CLIPBOARD_STOP_WORDS = new Set([
    "about", "after", "again", "also", "because", "before", "being", "could", "every", "from",
    "have", "into", "just", "like", "more", "most", "only", "other", "should", "some", "that",
    "their", "them", "then", "there", "these", "they", "this", "those", "through", "very", "what",
    "when", "where", "which", "while", "with", "would", "your"
  ]);

  function preferenceWords(value) {
    return String(value || "").toLowerCase().match(/[a-z][a-z'-]{2,19}/g) || [];
  }

  function loadClipboardPreferences() {
    try {
      const value = JSON.parse(localStorage.getItem(CLIPBOARD_PREFS_KEY) || "[]");
      return Array.isArray(value) ? value.filter((term) => typeof term === "string").slice(0, 30) : [];
    } catch (_) { return []; }
  }

  function catalogPreferenceWords(text) {
    const vocabulary = new Set();
    (typeof SHOWS !== "undefined" ? SHOWS : []).forEach((show) => {
      preferenceWords([show.title, (show.genre || []).join(" "), show.description].join(" ")).forEach((word) => {
        if (!CLIPBOARD_STOP_WORDS.has(word)) vocabulary.add(word);
      });
    });
    const counts = {};
    preferenceWords(String(text || "").slice(0, 12000)).forEach((word) => {
      if (vocabulary.has(word) && !CLIPBOARD_STOP_WORDS.has(word)) counts[word] = (counts[word] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 30)
      .map(([word]) => word);
  }

  function showGenres(show) {
    return (show && Array.isArray(show.genre) ? show.genre : []).map((genre) => String(genre).toLowerCase());
  }

  function isMusicFirst(show) {
    const type = String((show && show.type) || "").toLowerCase();
    const genres = showGenres(show);
    return type === "music-video" || type === "concert" ||
      (genres.some((genre) => /^(music|concert|performance)$/.test(genre)) &&
       !genres.some((genre) => /drama|comedy|family|animation|documentary/.test(genre)));
  }

  function isTvFirstShow(show) {
    if (!show || !Array.isArray(show.episodes) || !show.episodes.length || isMusicFirst(show)) return false;
    const type = String(show.type || "").toLowerCase();
    if (TV_FIRST_TYPES.has(type)) return true;
    if (["movie", "documentary", "music-video", "concert"].includes(type)) return false;
    const genres = showGenres(show);
    const tvGenre = genres.some((genre) =>
      /drama|comedy|crime|mystery|sci-fi|fantasy|family|kids|animation|animated|game show|soap|educational/.test(genre)
    );
    return tvGenre && (show.episodes.length > 1 || !type);
  }

  function loadDiscoverySignals() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DISCOVERY_KEY) || "{}");
      return {
        searches: Array.isArray(parsed.searches) ? parsed.searches.slice(-30) : [],
        shows: parsed.shows && typeof parsed.shows === "object" ? parsed.shows : {}
      };
    } catch (_) {
      return { searches: [], shows: {} };
    }
  }

  function saveDiscoverySignals(signals) {
    try { localStorage.setItem(DISCOVERY_KEY, JSON.stringify(signals)); } catch (_) {}
  }

  let _cosmoSearchSignalTimer = null;
  function recordDiscoverySearch(query) {
    const clean = String(query || "").trim().toLowerCase();
    if (clean.length < 2) return;
    const signals = loadDiscoverySignals();
    if (signals.searches[signals.searches.length - 1] !== clean) signals.searches.push(clean);
    signals.searches = signals.searches.slice(-30);
    saveDiscoverySignals(signals);
    if (_cosmoSearchSignalTimer) clearTimeout(_cosmoSearchSignalTimer);
    _cosmoSearchSignalTimer = setTimeout(() => {
      document.dispatchEvent(new CustomEvent("starquest:search", { detail: { query: clean } }));
      _cosmoSearchSignalTimer = null;
    }, 700);
  }

  function recordDiscoveryShow(show) {
    if (!show || !show.id) return;
    const signals = loadDiscoverySignals();
    signals.shows[show.id] = Math.min(25, Number(signals.shows[show.id] || 0) + 1);
    saveDiscoverySignals(signals);
  }

  function historyStats() {
    const history = typeof StarQuestAuth !== "undefined" ? StarQuestAuth.getHistory().slice(0, MAX_HISTORY_ITEMS) : [];
    const discovery = loadDiscoverySignals();
    const unlocked = typeof StarQuestAuth !== "undefined" && StarQuestAuth.getUnlockedContent
      ? StarQuestAuth.getUnlockedContent() : [];
    const clipboardPreferences = loadClipboardPreferences();
    if (!history.length && !discovery.searches.length && !Object.keys(discovery.shows).length && !unlocked.length && !clipboardPreferences.length) return null;
    const genre = {}, decade = {}, series = {}, completedBySeries = {};
    const recencyByShow = {}, recencyByGenre = {}, recencyByDecade = {};
    const recentShows = new Set(), recent = new Set(), watchedShows = new Set();
    const total = history.length;
    history.forEach((item, idx) => {
      const recencyWeight = Math.max(0.2, 1 - (idx / Math.max(1, total)));
      const g = item.genre || "";
      if (g) {
        genre[g] = (genre[g] || 0) + 1;
        recencyByGenre[g] = (recencyByGenre[g] || 0) + recencyWeight;
      }
      const d = item.decade || "";
      if (d) {
        decade[d] = (decade[d] || 0) + 1;
        recencyByDecade[d] = (recencyByDecade[d] || 0) + recencyWeight;
      }
      const sid = item.showId || "";
      if (sid) {
        series[sid] = (series[sid] || 0) + 1;
        recencyByShow[sid] = (recencyByShow[sid] || 0) + recencyWeight;
        if (item.completed) completedBySeries[sid] = (completedBySeries[sid] || 0) + 1;
        watchedShows.add(sid);
      }
      if (idx < 8 && item.episodeId) recent.add(item.episodeId);
      if (idx < 6 && sid) recentShows.add(sid);
    });
    unlocked.forEach((item) => {
      const id = String(item.contentId || "").replace(/^show:/, "");
      if (id) series[id] = (series[id] || 0) + 2;
    });
    return {
      history, genre, decade, series, completedBySeries, recent, watchedShows,
      recencyByShow, recencyByGenre, recencyByDecade, recentShows,
      searches: discovery.searches, explicitShows: discovery.shows, clipboardPreferences
    };
  }

  function scoreShowForUser(show, stats) {
    if (!stats) return { score: (show.score || 0) + (isTvFirstShow(show) ? 35 : 0), reason: "Highly rated television from across genres and decades." };
    const genreAffinity = (show.genre || []).reduce((sum, g) => sum + (stats.genre[g] || 0), 0);
    const genreRecency = (show.genre || []).reduce((sum, g) => sum + (stats.recencyByGenre[g] || 0), 0);
    const decadeKey = showDecade(show);
    const decadeAffinity = stats.decade[decadeKey] || 0;
    const decadeRecency = stats.recencyByDecade[decadeKey] || 0;
    const seriesAffinity = stats.series[show.id] || 0;
    const seriesRecency = stats.recencyByShow[show.id] || 0;
    const explicitInterest = Number(stats.explicitShows[show.id] || 0);
    const searchable = [show.title, show.description].concat(show.genre || []).join(" ").toLowerCase();
    const searchAffinity = stats.searches.reduce((sum, term, idx) =>
      sum + (searchable.includes(term) ? 1 + idx / Math.max(1, stats.searches.length) : 0), 0);
    const clipboardAffinity = (stats.clipboardPreferences || []).reduce((sum, term) =>
      sum + (searchable.includes(term) ? 1 : 0), 0);
    const recentlyWatched = stats.recentShows.has(show.id);
    const discoveryBonus = stats.watchedShows.has(show.id) ? 0 : 22;
    const tvBoost = isTvFirstShow(show) ? 65 : (isMusicFirst(show) ? -90 : -15);
    const score =
      genreAffinity * 20 + genreRecency * 38 +
      decadeAffinity * 10 + decadeRecency * 24 +
      seriesAffinity * 18 + seriesRecency * 45 +
      explicitInterest * 35 + searchAffinity * 55 + clipboardAffinity * 40 +
      discoveryBonus - (recentlyWatched ? 45 : 0) +
      tvBoost + Math.min(18, Math.max(0, show.episodes.length - 1)) + (show.score || 0);
    let reason = "Recommended from your mix of favorite genres, decades, and highly rated television.";
    if (clipboardAffinity > 0) reason = "Matched to the TV interests you chose to import from your clipboard.";
    else if (searchAffinity > 0) reason = "Matches things you searched for in StarQuest.";
    else if (explicitInterest > 0) reason = "Based on shows you opened and explored.";
    else if (seriesAffinity > 0) reason = "Based on your viewing and unlocked entertainment.";
    return { score, reason };
  }

  function byPersonalized(stats, reasonMap = {}) {
    return function (a, b) {
      const aScore = scoreShowForUser(a, stats), bScore = scoreShowForUser(b, stats);
      reasonMap[a.id] = aScore.reason; reasonMap[b.id] = bScore.reason;
      return bScore.score !== aScore.score ? bScore.score - aScore.score : String(a.title || "").localeCompare(String(b.title || ""));
    };
  }

  function diverseForYou(sorted, limit) {
    const picked = [], genreCounts = {}, decadeCounts = {};
    for (const show of sorted) {
      const genre = (show.genre && show.genre[0]) || "Other";
      const decade = showDecade(show) || "Other";
      if ((genreCounts[genre] || 0) >= 3 || (decadeCounts[decade] || 0) >= 5) continue;
      picked.push(show);
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
      if (picked.length >= limit) break;
    }
    return picked;
  }

  function renderForYouRow() {
    if (!DOM.rowForYou || !DOM.forYouSection) return;
    const reasonEl = document.getElementById("for-you-reason");
    const stats = historyStats(), reasonMap = {};
    const available = (typeof SHOWS !== "undefined" ? SHOWS.slice() : []).filter(isShowAvailable);
    const tv = available.filter(isTvFirstShow).sort(byPersonalized(stats, reasonMap));
    const movies = available.filter((show) => show.type === "movie").sort(byPersonalized(stats, reasonMap));
    const starterOrder = ["mash", "the-price-is-right", "due-south", "the-twilight-zone-1985", "real-ghostbusters", "thomas-the-tank-engine", "new-alfred-hitchcock-presents"];
    const starterTV = stats ? tv : starterOrder
      .map((id) => available.find((show) => show.id === id))
      .filter(Boolean)
      .concat(tv.filter((show) => !starterOrder.includes(show.id) && show.id !== "reading-rainbow"));
    const candidates = diverseForYou(starterTV, 18);
    const priceIsRight = available.find((show) => show.id === "the-price-is-right");
    if (priceIsRight && !candidates.some((show) => show.id === priceIsRight.id)) {
      candidates.splice(Math.min(2, candidates.length), 0, priceIsRight);
    }
    for (const movie of movies) {
      if (candidates.length >= 20) break;
      if (!candidates.some((show) => show.id === movie.id)) candidates.push(movie);
    }
    DOM.forYouSection.style.display = "";
    renderRow(DOM.rowForYou, candidates);
    DOM.rowForYou.scrollLeft = 0;
    const first = candidates[0];
    if (DOM.forYouGenreLabel) DOM.forYouGenreLabel.textContent = stats ? "Built from your StarQuest activity" : "Best starter television";
    if (reasonEl) reasonEl.textContent = first ? (reasonMap[first.id] || scoreShowForUser(first, stats).reason) : "No available recommendations yet.";
    document.dispatchEvent(new CustomEvent("starquest:recommendations-updated", {
      detail: { hasHistory: !!stats, recommendations: candidates.map((show) => show.id) }
    }));
  }

  function renderSmartSpotlight() {
    const stats = historyStats();
    const reasonMap = {};
    const ranked = (typeof SHOWS !== "undefined" ? SHOWS.slice() : [])
      .filter((show) => isShowAvailable(show) && isTvFirstShow(show))
      .sort(byPersonalized(stats, reasonMap));
    if (!ranked.length) return;
    const selected = window.StarQuestRecommendations
      ? StarQuestRecommendations.choose(ranked)
      : ranked[0];

    renderEpisodeRow(DOM.rowReadingRainbow, selected, 0, Math.min(8, selected.episodes.length));
    if (DOM.smartSpotlightMeta) {
      DOM.smartSpotlightMeta.textContent = selected.title + " · " + selected.episodes.length + " episodes";
    }
    if (DOM.smartSpotlightReason) {
      DOM.smartSpotlightReason.textContent = reasonMap[selected.id] || scoreShowForUser(selected, stats).reason;
    }
    if (DOM.readingRainbowBrowseAll) {
      DOM.readingRainbowBrowseAll.textContent = "Browse " + selected.title;
      DOM.readingRainbowBrowseAll.onclick = () => openModal(selected);
    }
  }

  if (DOM.smartSpotlightClipboard) {
    DOM.smartSpotlightClipboard.addEventListener("click", async () => {
      if (!navigator.clipboard || typeof navigator.clipboard.readText !== "function") {
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: "Clipboard access is not available in this browser." }
        }));
        return;
      }
      try {
        const preferences = catalogPreferenceWords(await navigator.clipboard.readText());
        localStorage.setItem(CLIPBOARD_PREFS_KEY, JSON.stringify(preferences));
        renderForYouRow();
        renderSmartSpotlight();
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: preferences.length ? "Your local TV interests updated." : "No matching TV interests were found." }
        }));
      } catch (_) {
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: "Clipboard permission was not granted. Nothing was read or saved." }
        }));
      }
    });
  }

  function initHero() {
    /* The hero promises one-tap playback. Locked and external-rental records
       belong in their labeled shelves, never in the opening rotation. */
    const playableCatalog = (typeof SHOWS !== "undefined" ? SHOWS.slice() : [])
      .filter((show) => isShowAvailable(show) && showUnlockCost(show) === 0);
    if (!playableCatalog.length) return;
    const profile = historyStats();
    const ordered = profile
      ? playableCatalog.slice().sort(byPersonalized(profile, {}))
      : playableCatalog.slice().sort(byScoreFreeFirst);

    function rotateOpening() {
      // Top Spot owns a complete persistent deck. Recommendation signals still
      // learn from clicks and watches, but cannot pin or repeat the opening.
      const show = window.StarQuestOpening
        ? StarQuestOpening.choose(ordered)
        : ordered[Math.floor(Math.random() * ordered.length)];
      if (show) renderHero(show);
    }

    rotateOpening();
    if (DOM.heroShuffleBtn) DOM.heroShuffleBtn.onclick = rotateOpening;
  }

  function renderHero(show) {
    state.currentShow = show;
    if (DOM.heroBadge) {
      const kind = window.StarQuestOpening ? StarQuestOpening.kind(show) : (show.type === "movie" ? "Movie" : "Show");
      DOM.heroBadge.textContent = "✦ Tonight's opening " + kind;
    }
    if (DOM.heroBgArt) {
      const image = String(show.thumbnail || "").trim();
      if (image) {
        const safeImage = encodeURI(image).replace(/"/g, "%22");
        DOM.heroBgArt.style.setProperty("--hero-image", 'url("' + safeImage + '")');
      } else {
        DOM.heroBgArt.style.removeProperty("--hero-image");
      }
    }
    DOM.heroTitle.textContent = show.title;
    DOM.heroDesc.textContent = show.description;
    DOM.heroScore.textContent = "★ " + show.score;
    DOM.heroRating.textContent = show.rating;
    DOM.heroYears.textContent = show.years;
    DOM.heroGenres.textContent = show.genre.join(" · ");

    DOM.heroPlayBtn.onclick = () => {
      const episode = getPrimaryEpisode(show);
      if (episode) {
        if (window.StarQuestRecommendations) StarQuestRecommendations.engage(show.id, "watch");
        openPlayer(episode, show.title);
      }
    };
    DOM.heroInfoBtn.onclick = () => {
      if (window.StarQuestRecommendations) StarQuestRecommendations.engage(show.id, "click");
      openModal(show);
    };
  }

  /* ── Rows ── */
  function byScore(a, b) { return (b.score || 0) - (a.score || 0); }

  /**
   * Sort comparator: free content first (by score), pay-to-watch items pushed
   * to the very back so they never appear before freely watchable content.
   */
  function byScoreFreeFirst(a, b) {
    const aPay = (a.starCoinCost || 0) > 0 ? 1 : 0;
    const bPay = (b.starCoinCost || 0) > 0 ? 1 : 0;
    if (aPay !== bPay) return aPay - bPay;   /* free before pay */
    return byScore(a, b);                    /* within each group: higher score first */
  }

  function initRows() {
    renderForYouRow();
    renderSmartSpotlight();
    renderRow(DOM.rowStarCoinMovies, getMovies().filter((show) => (show.starCoinCost || 0) > 0).sort(byScore));
    renderRow(DOM.rowFeatured, getFeaturedShows().slice().sort(byScoreFreeFirst));
    renderEpisodeRow(DOM.rowDueSouth, getShowById("due-south"), 0, 1);
    renderEpisodeRow(DOM.rowHitchcock, getShowById("new-alfred-hitchcock-presents"), 0, 8);
    renderRow(DOM.rowMovies, getMovies().slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowDrama, getShowsByGenre("Drama").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowComedy, getShowsByGenre("Comedy").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowScifi, getShowsByGenre("Sci-Fi").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowCrime, getShowsByGenre("Crime").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowGameShows, getShowsByGenre("Game Show").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowFamily, getShowsByGenre("Family").slice().sort(byScoreFreeFirst));
    renderRow(DOM.row70s, getShowsByDecade(1970).slice().sort(byScoreFreeFirst));
    renderRow(DOM.row80s, getShowsByDecade(1980).slice().sort(byScoreFreeFirst));
    renderRow(DOM.row90s, getShowsByDecade(1990).slice().sort(byScoreFreeFirst));
  }

  function addDiscoveredShows(bucket, shows) {
    if (!Array.isArray(shows) || !shows.length) return;
    const known = new Set(SHOWS.map(show => show.id));
    shows.filter(isShowAvailable).forEach(show => {
      if (!known.has(show.id) && Number(show.score) >= 7) {
        SHOWS.push(show);
        known.add(show.id);
      }
    });
    if (bucket === "1970s") renderRow(DOM.row70s, getShowsByDecade(1970).slice().sort(byScoreFreeFirst));
    if (bucket === "1980s") renderRow(DOM.row80s, getShowsByDecade(1980).slice().sort(byScoreFreeFirst));
    if (bucket === "1990s") renderRow(DOM.row90s, getShowsByDecade(1990).slice().sort(byScoreFreeFirst));
    if (bucket === "cartoons") renderRow(DOM.rowFamily, getShowsByGenre("Family").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowMovies, getMovies().slice().sort(byScoreFreeFirst));
    renderForYouRow();
  }

  window.addEventListener("starquest:source-selected", event => {
    const show = event.detail && event.detail.show;
    if (!show || !Array.isArray(show.episodes) || !show.episodes.length) return;
    if (!SHOWS.some(item => item.id === show.id)) SHOWS.push(show);
    addDiscoveredShows("movies", [show]);
    renderForYouRow();
    const episode = getPrimaryEpisode(show);
    if (episode) {
      if (window.StarQuestRecommendations) StarQuestRecommendations.engage(show.id, "watch");
      openPlayer(episode, show.title);
    }
  });

  window.addEventListener("starquest:archive-discovered", event => {
    addDiscoveredShows(event.detail?.bucket, event.detail?.shows);
  });

  function renderRow(container, shows) {
    if (!container) return;
    container.innerHTML = "";
    shows.forEach((show) => {
      container.appendChild(createShowCard(show));
    });
    updateCarouselButtons(container);
  }

  /**
   * Render a row of individual episode cards for a show.
   * Each card plays the episode directly when clicked.
   */
  function renderEpisodeRow(container, show, startIndex, maxCount) {
    if (!container || !show || !show.episodes) return;
    container.innerHTML = "";
    const start = startIndex || 0;
    const episodes = show.episodes.slice(start, maxCount ? start + maxCount : undefined);
    episodes.forEach((ep) => {
      container.appendChild(createEpisodeCard(ep, show));
    });
    updateCarouselButtons(container);
  }

  /* ── Episode Card (direct-play) ── */
  function createEpisodeCard(ep, show) {
    const isSpecial = ep.season === 0;
    const seasonLabel = isSpecial ? "Pilot" : "S" + ep.season + " E" + ep.episode;

    const card = document.createElement("div");
    card.className = "show-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", "Play " + show.title + " " + seasonLabel + ": " + ep.title);

    card.innerHTML = `
      <div class="show-card__thumb">
        <img src="${escAttr(ep.thumbnail)}"
             alt="${escAttr(ep.title)}"
             loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="show-card__thumb-fallback" style="display:none">
          <span class="fallback-kicker">STARQUEST ARCHIVE</span>
          <span class="fallback-title">${escHTML(show.title)}</span>
          <span class="fallback-subtitle">${escHTML(ep.title)}</span>
        </div>
        <div class="show-card__play-overlay" aria-hidden="true">
          <div class="play-icon-circle">▶</div>
        </div>
        <div class="ep-season-badge">${escHTML(seasonLabel)}</div>
      </div>
      <div class="show-card__info">
        <div class="show-card__title" title="${escAttr(ep.title)}"><span class="editable-text">${escHTML(ep.title)}</span><button class="card-avatar-marker" type="button" aria-label="Change ${escAttr(ep.title)}">★</button></div>
        <div class="show-card__meta">
          <span style="color:var(--text-muted)">${escHTML(ep.year + " · " + ep.duration)}</span>
        </div>
      </div>
    `;

    registerCardEditor(card, "episode-" + (ep.id || show.id + "-" + ep.season + "-" + ep.episode), ep.title);

    const play = () => {
      if (window.StarQuestRecommendations) StarQuestRecommendations.engage(show.id, "watch");
      openPlayer(ep, show.title);
    };
    card.addEventListener("click", play);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });

    return card;
  }
  function createShowCard(show) {
    const unlockCost = showUnlockCost(show);
    const contentId = "show:" + show.id;
    const isUnlocked = unlockCost <= 0 || (typeof StarQuestAuth !== "undefined" && StarQuestAuth.isContentUnlocked(contentId));
    const showUnavailable = !isShowAvailable(show);
    const isLocked = !showUnavailable && unlockCost > 0 && !isUnlocked;
    const card = document.createElement("div");
    card.className = "show-card" + (isLocked ? " show-card--pay" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label",
      isLocked
        ? "Unlock " + show.title + " for " + unlockCost + " StarCoins"
        : showUnavailable
          ? show.title + " is unavailable"
        : "Watch " + show.title);

    const hasEpisodeBrowser = !showUnavailable && !isLocked &&
      show.type !== "movie" && Array.isArray(show.episodes) && show.episodes.length > 1;

    const movieBadge = show.type === "movie" && !show.payToWatch
      ? '<div class="ep-season-badge movie-badge">🎬 MOVIE</div>'
      : "";
    const payBadge = showUnavailable
      ? ""
      : isLocked
      ? '<div class="ep-season-badge pay-badge">🔒 ' + unlockCost + ' ⭐</div>'
      : (unlockCost > 0
        ? '<div class="ep-season-badge movie-badge">✅ Unlocked</div>'
        : "");

    card.innerHTML = `
      <div class="show-card__thumb">
        <img src="${escAttr(show.thumbnail)}"
             alt="${escAttr(show.title)}"
             loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="show-card__thumb-fallback" style="display:none">
          <span class="fallback-kicker">STARQUEST ARCHIVE</span>
          <span class="fallback-title">${escHTML(show.title)}</span>
          <span class="fallback-subtitle">${escHTML((show.genre || []).slice(0, 2).join(" · ") || show.years)}</span>
        </div>
        <div class="show-card__play-overlay" aria-hidden="true">
          <div class="play-icon-circle">${showUnavailable ? "⛔" : (show.payToWatch ? "↗" : "▶")}</div>
        </div>
        ${movieBadge}${payBadge}
      </div>
      <div class="show-card__info">
        <div class="show-card__title" title="${escAttr(show.title)}"><span class="editable-text">${escHTML(show.title)}</span><button class="card-avatar-marker" type="button" aria-label="Change ${escAttr(show.title)}">★</button></div>
        <div class="show-card__meta">
          <span class="show-card__score">★ ${escHTML(String(show.score))}</span>
          <span class="show-card__genre">${escHTML(show.genre[0])}</span>
          <span>${escHTML(show.years)}</span>
        </div>
        ${showUnavailable ? '<div class="history-empty" style="display:block;margin-top:4px;">Source unavailable after audit</div>' : ""}
        ${isLocked ? '<button class="btn btn-primary unlock-btn" type="button" style="margin-top:6px">Unlock • ' + escHTML(String(unlockCost)) + ' ⭐</button>' : ""}
        ${hasEpisodeBrowser ? '<button class="btn btn-secondary browse-episodes-btn" type="button" style="margin-top:6px;width:100%;font-size:.72rem;">Browse episodes</button>' : ""}
        ${!showUnavailable && unlockCost > 0 && !isLocked ? '<div class="history-empty" style="display:block;margin-top:4px;">Unlocked</div>' : ""}
      </div>
    `;

    registerCardEditor(card, "show-" + show.id, show.title);

    const unlockBtn = card.querySelector(".unlock-btn");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) {
          document.dispatchEvent(new CustomEvent("starquest:require-auth"));
          return;
        }
        if (!window.StarQuestInfinityWallet || !window.StarQuestInfinityWallet.isConnected()) {
          document.dispatchEvent(new CustomEvent("starquest:notice", { detail: { message: "Connect the Unified Infinity Wallet before spending StarCoins." } }));
          return;
        }
        const unlockResult = StarQuestAuth.unlockContent(contentId, unlockCost, show.title, {
          companyId: show.companyId || show.network || show.studio || null,
          companyName: show.companyName || show.network || show.studio || (show.title + " rights company — unresolved"),
          creditedPeople: Array.isArray(show.creditedPeople) ? show.creditedPeople : [],
        });
        if (!unlockResult.ok) {
          const balance = StarQuestAuth.getBalance();
          document.dispatchEvent(new CustomEvent("starquest:toast", {
            detail: { message: "Need " + unlockCost + " StarCoins (balance: " + balance + ")." }
          }));
          return;
        }
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: unlockResult.alreadyUnlocked ? "Already unlocked." : "Unlocked " + show.title + "!" }
        }));
        initRows();
      });
    }

    const browseEpisodesBtn = card.querySelector(".browse-episodes-btn");
    if (browseEpisodesBtn) {
      browseEpisodesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(show);
      });
      browseEpisodesBtn.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        e.stopPropagation();
        openModal(show);
      });
    }

    if (showUnavailable) {
      const noPlay = (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: "This content is currently unavailable." }
        }));
      };
      card.addEventListener("click", noPlay);
      card.addEventListener("keydown", (e) => {
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " ") noPlay(e);
      });
    } else if (isLocked) {
      const promptUnlock = (e) => {
        e.preventDefault();
        if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) {
          document.dispatchEvent(new CustomEvent("starquest:require-auth"));
          return;
        }
        const balance = StarQuestAuth.getBalance();
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: show.title + " costs " + unlockCost + " StarCoins. Balance: " + balance + "." }
        }));
      };
      card.addEventListener("click", promptUnlock);
      card.addEventListener("keydown", (e) => {
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " ") promptUnlock(e);
      });
    } else {
      /* Every playable catalog card starts its primary episode in one action.
         Multi-episode shows keep browsing on their dedicated button above. */
      const play = () => {
        const episode = getPrimaryEpisode(show);
        if (episode) {
          if (window.StarQuestRecommendations) StarQuestRecommendations.engage(show.id, "watch");
          openPlayer(episode, show.title);
        }
      };
      card.addEventListener("click", play);
      card.addEventListener("keydown", (e) => {
        if (e.target !== card) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
    }

    return card;
  }

  /* ── Modal ── */
  function openModal(show) {
    recordDiscoveryShow(show);
    DOM.modalTitle.textContent = show.title;
    DOM.modalScore.textContent = "★ " + show.score;
    DOM.modalRating.textContent = show.rating;
    DOM.modalYears.textContent = show.years;
    DOM.modalGenres.innerHTML = show.genre
      .map((g) => `<span class="genre-tag">${escHTML(g)}</span>`)
      .join("");
    DOM.modalDesc.textContent = show.description;
    DOM.modalHeroImg.src = show.thumbnail;
    DOM.modalHeroImg.alt = show.title;

    renderEpisodes(show);

    DOM.modalBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    DOM.modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  DOM.modalClose.addEventListener("click", closeModal);
  DOM.modalBackdrop.addEventListener("click", (e) => {
    if (e.target === DOM.modalBackdrop) closeModal();
  });

  /* ── Episode List ── */
  function renderEpisodes(show) {
    DOM.modalEpisodes.innerHTML = "";
    if (!show.episodes || show.episodes.length === 0) {
      DOM.modalEpisodes.innerHTML =
        '<p style="color:var(--text-muted);font-size:.85rem;">No episodes available.</p>';
      return;
    }

    const showCost = Number.isFinite(Number(show.starCoinCost))
      ? Math.max(0, Math.trunc(Number(show.starCoinCost)))
      : (show.payToWatch ? 1 : 0);
    const isUnlocked = showCost <= 0 || (typeof StarQuestAuth !== "undefined" && StarQuestAuth.isContentUnlocked("show:" + show.id));

    show.episodes.forEach((ep, i) => {
      const isPlayable = isEpisodePlayable(ep, show);
      const isLockedEp = showCost > 0 && !isUnlocked;
      const item = document.createElement("div");
      item.className = "episode-item" + (isLockedEp ? " episode-item--pay" : "");
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label",
        !isPlayable
          ? "Unavailable episode " + ep.title
          : isLockedEp
            ? "Unlock " + show.title + " to watch " + ep.title
            : "Play episode " + ep.title);

      item.innerHTML = `
        <span class="episode-num">${i + 1}</span>
        <div class="episode-thumb">
          <img src="${escAttr(ep.thumbnail)}"
               alt="${escAttr(ep.title)}"
               loading="lazy"
               onerror="this.style.display='none'">
        </div>
        <div class="episode-info">
          <div class="episode-title">S${ep.season} E${ep.episode} · ${escHTML(ep.title)}</div>
          <div class="episode-desc">${escHTML(!isPlayable && ep.sourceNote ? ep.sourceNote : ep.description)}</div>
        </div>
        <span class="episode-duration">${escHTML(ep.duration)}</span>
        <div class="episode-play" aria-hidden="true">${!isPlayable ? "⛔" : (isLockedEp ? "🔒" : "▶")}</div>
      `;

      if (!isPlayable) {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          document.dispatchEvent(new CustomEvent("starquest:toast", {
            detail: { message: "This episode is unavailable." }
          }));
        });
      } else if (isLockedEp) {
        const promptUnlock = (e) => {
          e.preventDefault();
          if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) {
            document.dispatchEvent(new CustomEvent("starquest:require-auth"));
            return;
          }
          const balance = StarQuestAuth.getBalance();
          document.dispatchEvent(new CustomEvent("starquest:toast", {
            detail: { message: show.title + " costs " + showCost + " StarCoins. Balance: " + balance + "." }
          }));
        };
        item.addEventListener("click", promptUnlock);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") promptUnlock(e);
        });
      } else {
        const play = () => {
          closeModal();
          openPlayer(ep, show.title);
        };
        item.addEventListener("click", play);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
        });
      }

      DOM.modalEpisodes.appendChild(item);
    });
  }

  /* ── Player ── */
  let _popInTimers = [];
  let _popInHideTimer = null;

  function clearCosmoPopInTimers() {
    _popInTimers.forEach((timer) => clearTimeout(timer));
    _popInTimers = [];
    if (_popInHideTimer) {
      clearTimeout(_popInHideTimer);
      _popInHideTimer = null;
    }
  }

  function scheduleCosmoPopIns(show, showTitle, episode) {
    clearCosmoPopInTimers();
    const sceneEngine = window.StarQuestCosmoSceneEngine;
    if (!sceneEngine || !sceneEngine.isReleaseReady()) return;
    const settings = window.StarQuestCosmoLive ? StarQuestCosmoLive.getSettings() : { watchAlong: false };
    if (!settings.watchAlong) return;
    COSMO_POPIN_SCHEDULE_MS.forEach((delay) => {
      _popInTimers.push(setTimeout(() => {
        if (DOM.playerPage.classList.contains("open")) showCosmoPopIn(show, showTitle, episode);
      }, delay));
    });
  }

  function currentCaptionText(video) {
    try {
      return Array.from(video.textTracks || []).flatMap((track) => Array.from(track.activeCues || []))
        .map((cue) => cue.text || "").filter(Boolean).join(" ");
    } catch (_) { return ""; }
  }

  function attemptInstantPlayback() {
    const playPromise = DOM.playerVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        console.debug("StarQuest autoplay blocked or delayed:", err);
      });
    }
  }

  function recordEpisodeOpenAtSource(episode, show, showTitle) {
    if (!episode || !show || typeof StarQuestAuth === "undefined") return null;
    const episodeId = buildEpisodeId(episode, show);
    const startYear = parseInt(String(show.years || "").split("–")[0], 10);
    const decade = Number.isFinite(startYear) ? (Math.floor(startYear / 10) * 10 + "s") : "";
    const duration = Math.max(0, Math.trunc((Number(episode.duration) || parseInt(String(episode.duration || "0"), 10)) * 60));
    const existing = StarQuestAuth.getHistory().find((item) => item.episodeId === episodeId);
    return StarQuestAuth.addToHistory({
      episodeId,
      showId: show.id,
      showTitle: showTitle || show.title,
      epTitle: episode.title,
      thumbnail: episode.thumbnail || show.thumbnail || "",
      genre: Array.isArray(show.genre) ? (show.genre[0] || "") : "",
      decade,
      tags: Array.isArray(show.genre) ? show.genre.slice(0, 4) : [],
      watchedSeconds: Math.max(0, Number(existing && existing.watchedSeconds) || 0),
      positionSeconds: Math.max(0, StarQuestAuth.getWatchPosition(episodeId)),
      duration,
      completionRate: Number(existing && existing.completionRate) || 0,
      completed: !!(existing && existing.completed),
    });
  }

  function openPlayer(episode, showTitle) {
    const showForEpisode = (typeof SHOWS !== "undefined")
      ? SHOWS.find((show) => show.title === showTitle || (Array.isArray(show.episodes) && show.episodes.some((candidate) =>
        candidate === episode ||
        (candidate.id && episode.id && candidate.id === episode.id) ||
        (candidate.src && episode.src && candidate.src === episode.src)
      )))
      : null;
    const showCost = showForEpisode
      ? (Number.isFinite(Number(showForEpisode.starCoinCost))
        ? Math.max(0, Math.trunc(Number(showForEpisode.starCoinCost)))
        : (showForEpisode.payToWatch ? 1 : 0))
      : 0;
    if (showForEpisode && showCost > 0) {
      const contentId = "show:" + showForEpisode.id;
      const unlocked = (typeof StarQuestAuth !== "undefined") && StarQuestAuth.isContentUnlocked(contentId);
      if (!unlocked) {
        if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) {
          document.dispatchEvent(new CustomEvent("starquest:require-auth"));
        } else {
          const balance = StarQuestAuth.getBalance();
          document.dispatchEvent(new CustomEvent("starquest:toast", {
            detail: { message: showForEpisode.title + " costs " + showCost + " StarCoins. Balance: " + balance + "." }
          }));
        }
        return;
      }
    }
    if (!isEpisodePlayable(episode, showForEpisode)) {
      document.dispatchEvent(new CustomEvent("starquest:toast", {
        detail: { message: "This content is currently unavailable." }
      }));
      return;
    }
    state.currentEpisode = episode;

    // Save history at the exact source action that opens playback. This does
    // not depend on a later controller receiving a custom event, so a failure
    // elsewhere cannot leave the account stuck on an older history entry.
    const historyResult = recordEpisodeOpenAtSource(episode, showForEpisode, showTitle);
    if (historyResult && historyResult.ok === false) {
      document.dispatchEvent(new CustomEvent("starquest:toast", {
        detail: { message: historyResult.message || "Watch history could not be saved on this device." }
      }));
    }

    const isSpecial = episode.season === 0;
    const seasonLabel = isSpecial ? "Movie" : "S" + episode.season + "E" + episode.episode;
    DOM.playerEpTitle.textContent = showTitle + " — " + seasonLabel + ": " + episode.title;

    DOM.playerPage.classList.add("open");
    DOM.playerLoading.style.display = "flex";
    DOM.playerError.style.display = "none";
    document.body.classList.add("player-open");
    document.body.style.overflow = "hidden";

    /* One canonical playback event drives history, resume state, sharing,
       and Cosmo context. Do not rely on observing CSS class changes. */
    document.dispatchEvent(new CustomEvent("starquest:episode-opened", {
      detail: { ep: episode, showTitle, show: showForEpisode }
    }));

    /* Tell Cosmo what we're watching */
    const show = (typeof SHOWS !== "undefined")
      ? SHOWS.find((s) => s.title === showTitle) : null;
    if (typeof StarQuestAI !== "undefined") {
      StarQuestAI.setContext(show ? show.id : null, showTitle, episode.title);
    }

    scheduleCosmoPopIns(show, showTitle, episode);

    if (typeof episode.archiveFile === "string" && episode.archiveId) {
      /* Use a native <video> element with the direct archive.org download URL.
         This plays the file on-site without the embed player's restrictions. */
      const directUrl = buildArchiveDirectUrl(
        episode.archiveId,
        episode.archiveFile,
        showForEpisode && showForEpisode.archiveRoot,
        episode.season
      );

      DOM.playerFrame.style.display = "none";
      DOM.playerFrame.src = "about:blank";
      DOM.playerVideo.style.display = "block";
      DOM.playerVideo.preload = "auto";
      /* Sona can only draw an actual playback frame when the source opts into
         cross-origin media access. This must be set before assigning src. */
      DOM.playerVideo.crossOrigin = "anonymous";
      /* Register handlers before assigning src so no stale queued event
         from a prior load can slip through and trigger the wrong handler. */
      DOM.playerVideo.onloadedmetadata = () => {
        const resumeId = showForEpisode ? buildEpisodeId(episode, showForEpisode) : "";
        const savedPosition = resumeId && typeof StarQuestAuth !== "undefined"
          ? StarQuestAuth.getWatchPosition(resumeId)
          : 0;
        const duration = Number(DOM.playerVideo.duration) || 0;
        if (savedPosition > 5 && (!duration || savedPosition < duration - 10)) {
          DOM.playerVideo.currentTime = savedPosition;
        }
      };
      DOM.playerVideo.oncanplay = () => {
        DOM.playerLoading.style.display = "none";
        attemptInstantPlayback();
      };
      DOM.playerVideo.ontimeupdate = () => {
        if (typeof StarQuestAI !== "undefined" && StarQuestAI.updatePlayback) {
          StarQuestAI.updatePlayback({
            currentTime: DOM.playerVideo.currentTime,
            duration: DOM.playerVideo.duration,
            transcript: currentCaptionText(DOM.playerVideo),
          });
        }
      };
      DOM.playerVideo.onerror = () => {
        DOM.playerLoading.style.display = "none";
        DOM.playerVideo.style.display = "none";
        DOM.playerError.style.display = "flex";
        DOM.playerErrorLink.href = "https://archive.org/details/" + encodeURIComponent(episode.archiveId);
      };
      DOM.playerVideo.src = directUrl;
      DOM.playerVideo.load();
      attemptInstantPlayback();
    } else if (episode.youtubeId) {
      /* YouTube remains an iframe source. Archive.org never uses the iframe:
         metadata resolution selects a direct file before anything is shown. */
      const resumeId = showForEpisode ? buildEpisodeId(episode, showForEpisode) : "";
      const savedPosition = resumeId && typeof StarQuestAuth !== "undefined"
        ? StarQuestAuth.getWatchPosition(resumeId)
        : 0;
      const embedUrl = buildEmbedUrl(episode, savedPosition);
      DOM.playerVideo.onloadedmetadata = null;
      DOM.playerVideo.oncanplay = null;
      DOM.playerVideo.onerror = null;
      DOM.playerVideo.style.display = "none";
      DOM.playerVideo.removeAttribute("src");
      DOM.playerVideo.load();
      DOM.playerFrame.style.display = "block";
      DOM.playerFrame.src = embedUrl;

      DOM.playerFrame.addEventListener("load", () => {
        DOM.playerLoading.style.display = "none";
      }, { once: true });
    } else {
      /* Item-only Archive.org records are playable without downloading or
         inspecting the item's full metadata first. The Archive player selects
         its stream-ready derivative and honors archiveIndex for playlists. */
      const resumeId = showForEpisode ? buildEpisodeId(episode, showForEpisode) : "";
      const savedPosition = resumeId && typeof StarQuestAuth !== "undefined"
        ? StarQuestAuth.getWatchPosition(resumeId)
        : 0;
      const embedUrl = buildEmbedUrl(episode, savedPosition);
      DOM.playerVideo.onloadedmetadata = null;
      DOM.playerVideo.oncanplay = null;
      DOM.playerVideo.onerror = null;
      DOM.playerVideo.style.display = "none";
      DOM.playerVideo.removeAttribute("src");
      DOM.playerVideo.load();
      DOM.playerFrame.style.display = "block";
      DOM.playerFrame.src = embedUrl;
      /* The embedded player renders its own buffering state. Do not keep the
         StarQuest overlay waiting on a cross-origin iframe load event. */
      DOM.playerLoading.style.display = "none";
      DOM.playerFrame.addEventListener("load", () => {
        DOM.playerLoading.style.display = "none";
      }, { once: true });
    }
  }

  function closePlayer() {
    clearCosmoPopInTimers();
    hideCosmoPopIn();
    if (typeof StarQuestAI !== "undefined") StarQuestAI.clearContext();
    DOM.playerPage.classList.remove("open");
    DOM.playerFrame.src = "about:blank";
    DOM.playerFrame.style.display = "block";
    document.body.classList.remove("player-open");
    /* Clear handlers before resetting the video element so that the async
       error event triggered by clearing the src doesn't fire the previous
       onerror and falsely show the "can't be displayed" overlay. */
    DOM.playerVideo.onloadedmetadata = null;
    DOM.playerVideo.oncanplay = null;
    DOM.playerVideo.onerror = null;
    DOM.playerVideo.ontimeupdate = null;
    DOM.playerVideo.pause();
    DOM.playerVideo.removeAttribute("src");
    DOM.playerVideo.load();
    DOM.playerVideo.style.display = "none";
    DOM.playerError.style.display = "none";
    document.body.style.overflow = "";
  }

  /* ── Cosmo pop-in during playback ── */
  function showCosmoPopIn(show, showTitle, episode) {
    const popEl = document.getElementById("cosmo-popin");
    const textEl = document.getElementById("cosmo-popin-text");
    if (!popEl || !textEl) return;

    const showId = show ? show.id : null;
    const epTitle = episode ? episode.title : "";

    const display = (text) => {
      if (!String(text || "").trim()) return;
      textEl.textContent = text;
      popEl.style.display = "flex";
      popEl.classList.add("cosmo-popin--in");
      /* Auto-dismiss after 14 seconds */
      if (_popInHideTimer) clearTimeout(_popInHideTimer);
      _popInHideTimer = setTimeout(hideCosmoPopIn, COSMO_POPIN_DISMISS_MS);
    };

    if (typeof StarQuestAI !== "undefined") {
      StarQuestAI.generatePopIn(showId, showTitle, epTitle).then(display).catch(() => {});
    }
  }

  function hideCosmoPopIn() {
    const popEl = document.getElementById("cosmo-popin");
    if (_popInHideTimer) {
      clearTimeout(_popInHideTimer);
      _popInHideTimer = null;
    }
    if (popEl) {
      popEl.classList.remove("cosmo-popin--in");
      setTimeout(() => { popEl.style.display = "none"; }, 300);
    }
  }

  /* Close pop-in button */
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "cosmo-popin-close") hideCosmoPopIn();
  });

  DOM.playerBack.addEventListener("click", closePlayer);


  /**
   * Build a direct archive.org download URL for a specific file within an item.
   * Used to play video via a native <video> element, bypassing embed restrictions.
   */
  function buildArchiveDirectUrl(archiveId, archiveFile, archiveRoot, season) {
    if (!archiveId || !archiveFile) return "";
    const nestedFile = archiveRoot && !archiveFile.includes("/")
      ? [archiveRoot, "Season " + Math.max(1, Number(season) || 1), archiveFile].join("/")
      : archiveFile;
    return "https://archive.org/download/" +
      encodeURIComponent(archiveId) + "/" +
      nestedFile.split("/").map(encodeURIComponent).join("/");
  }

  /**
   * Build the iframe embed URL for YouTube or archive.org items without a file path.
   * When an episode has a youtubeId, a YouTube embed URL is returned.
   * When an episode has an archiveIndex, the archive.org playlist index
   * parameter is used to jump directly to that episode.
   */
  function buildEmbedUrl(episode, startSeconds) {
    const resumeAt = Math.max(0, Math.trunc(Number(startSeconds) || 0));
    if (episode.youtubeId) {
      const params = new URLSearchParams({ autoplay: "1" });
      if (resumeAt > 5) params.set("start", String(resumeAt));
      return "https://www.youtube.com/embed/" + encodeURIComponent(episode.youtubeId) + "?" + params.toString();
    }
    if (!episode.archiveId) return "about:blank";
    const base = "https://archive.org/embed/" + encodeURIComponent(episode.archiveId);
    const params = new URLSearchParams({ autoplay: "1" });
    if (typeof episode.archiveIndex === "number" && !episode.archiveFile) {
      params.set("index", String(episode.archiveIndex));
    }
    if (episode.title) {
      params.set("playtext", episode.title);
    }
    if (resumeAt > 5) params.set("start", String(resumeAt));
    return base + "?" + params.toString();
  }

  /* ── Search ── */
  DOM.searchInput.addEventListener("input", debounce(handleSearch, 280));

  function handleSearch() {
    const q = DOM.searchInput.value.trim().toLowerCase();
    state.searchQuery = q;
    if (q.length >= 2) recordDiscoverySearch(q);

    if (!q) {
      DOM.searchOverlay.classList.remove("open");
      return;
    }

    const results = SHOWS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genre.some((g) => g.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
    ).sort(byScoreFreeFirst);

    DOM.searchResultsTitle.innerHTML =
      'Results for <strong>"' + escHTML(q) + '"</strong> — ' + results.length + " show" + (results.length !== 1 ? "s" : "");

    DOM.searchGrid.innerHTML = "";
    results.forEach((show) => DOM.searchGrid.appendChild(createShowCard(show)));

    DOM.searchOverlay.classList.add("open");
  }

  if (DOM.clearSearch) {
    DOM.clearSearch.addEventListener("click", () => {
      DOM.searchInput.value = "";
      DOM.searchOverlay.classList.remove("open");
    });
  }

  /* ── Genre Pills ── */
  DOM.genrePills.forEach((pill) => {
    pill.addEventListener("click", () => {
      DOM.genrePills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const genre = pill.dataset.genre;
      filterByGenre(genre);
    });
  });

  function filterByGenre(genre) {
    state.activeGenre = genre;
    const shows = (genre === "all" ? getFeaturedShows() : getShowsByGenre(genre))
      .slice()
      .sort(byScoreFreeFirst);

    /* Re-render the featured row with filtered results */
    if (DOM.rowFeatured) {
      renderRow(DOM.rowFeatured, shows);
    }
  }

  /* ── Keyboard ── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (DOM.playerPage.classList.contains("open")) {
        closePlayer();
      } else if (DOM.allEpsBackdrop.classList.contains("open")) {
        closeAllEps();
      } else if (DOM.modalBackdrop.classList.contains("open")) {
        closeModal();
      } else if (DOM.searchOverlay.classList.contains("open")) {
        DOM.searchInput.value = "";
        DOM.searchOverlay.classList.remove("open");
      }
    }
  });

  /* ── All-Episodes Modal ── */
  const EPISODE_SEASONS = [
    { label: "Pilot", filter: (ep) => ep.season === 0 },
    { label: "Season 1", filter: (ep) => ep.season === 1 },
    { label: "Season 2", filter: (ep) => ep.season === 2 },
    { label: "Season 3", filter: (ep) => ep.season === 3 },
    { label: "Season 4", filter: (ep) => ep.season === 4 },
  ];

  function openAllEps(showId) {
    const show = getShowById(showId);
    if (!show) return;
    DOM.allEpsTitle.textContent = show.title + " — All " + show.episodes.length + " Episodes";
    renderAllEpsTabs(show);
    selectAllEpsTab(show, 0);
    DOM.allEpsBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeAllEps() {
    DOM.allEpsBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  function renderAllEpsTabs(show) {
    DOM.allEpsTabs.innerHTML = "";
    EPISODE_SEASONS.forEach((season, i) => {
      const eps = show.episodes.filter(season.filter);
      if (!eps.length) return;
      const btn = document.createElement("button");
      btn.className = "season-tab" + (i === 0 ? " active" : "");
      btn.textContent = season.label + " (" + eps.length + ")";
      btn.setAttribute("role", "tab");
      btn.addEventListener("click", () => {
        DOM.allEpsTabs.querySelectorAll(".season-tab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        selectAllEpsTab(show, i);
      });
      DOM.allEpsTabs.appendChild(btn);
    });
  }

  function selectAllEpsTab(show, seasonIdx) {
    const season = EPISODE_SEASONS[seasonIdx];
    const eps = show.episodes.filter(season.filter);
    DOM.allEpsList.innerHTML = "";
    eps.forEach((ep, i) => {
      const isPlayable = isEpisodePlayable(ep, show);
      const isSpecial = ep.season === 0;
      const seasonLabel = isSpecial ? "Pilot" : "S" + ep.season + " E" + ep.episode;
      const item = document.createElement("div");
      item.className = "episode-item";
      item.setAttribute("role", "listitem button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "Play " + seasonLabel + ": " + ep.title);
      item.innerHTML = `
        <span class="episode-num">${i + 1}</span>
        <div class="episode-thumb">
          <img src="${escAttr(ep.thumbnail)}"
               alt="${escAttr(ep.title)}"
               loading="lazy"
               onerror="this.style.display='none'">
        </div>
        <div class="episode-info">
          <div class="episode-title">${escHTML(seasonLabel)} · ${escHTML(ep.title)}</div>
          <div class="episode-desc">${escHTML(!isPlayable && ep.sourceNote ? ep.sourceNote : ep.description)}</div>
        </div>
        <span class="episode-duration">${escHTML(ep.duration)}</span>
        <div class="episode-play" aria-hidden="true">${!isPlayable ? "⛔" : "▶"}</div>
      `;
      const play = () => {
        closeAllEps();
        openPlayer(ep, show.title);
      };
      item.addEventListener("click", play);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
      DOM.allEpsList.appendChild(item);
    });
  }

  if (DOM.allEpsClose) {
    DOM.allEpsClose.addEventListener("click", closeAllEps);
  }
  DOM.allEpsBackdrop.addEventListener("click", (e) => {
    if (e.target === DOM.allEpsBackdrop) closeAllEps();
  });
  if (DOM.dueSouthBrowseAll) {
    DOM.dueSouthBrowseAll.addEventListener("click", () => openAllEps("due-south"));
    DOM.dueSouthBrowseAll.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAllEps("due-south"); }
    });
  }
  if (DOM.hitchcockBrowseAll) {
    DOM.hitchcockBrowseAll.addEventListener("click", () => openAllEps("new-alfred-hitchcock-presents"));
  }

  /* ── Scroll buttons ── */
  function updateCarouselButtons(row) {
    const wrap = row && row.closest(".card-row-wrap");
    if (!wrap) return;
    const left = wrap.querySelector(".scroll-btn.left");
    const right = wrap.querySelector(".scroll-btn.right");
    const max = Math.max(0, row.scrollWidth - row.clientWidth);
    if (left) left.disabled = row.scrollLeft <= 6;
    if (right) right.disabled = row.scrollLeft >= max - 6;
  }

  document.querySelectorAll(".scroll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.classList.contains("right") ? 1 : -1;
      const row = btn.closest(".card-row-wrap").querySelector(".card-row");
      const cards = Array.from(row.querySelectorAll(".show-card"));
      if (!cards.length) return;
      const viewportCenter = row.scrollLeft + row.clientWidth / 2;
      let current = 0;
      let distance = Infinity;
      cards.forEach((card, index) => {
        const center = card.offsetLeft + card.offsetWidth / 2;
        const delta = Math.abs(center - viewportCenter);
        if (delta < distance) { distance = delta; current = index; }
      });
      const target = cards[Math.max(0, Math.min(cards.length - 1, current + direction))];
      row.scrollTo({ left: target.offsetLeft - (row.clientWidth - target.offsetWidth) / 2, behavior: "smooth" });
    });
  });
  document.querySelectorAll(".card-row").forEach((row) => {
    row.addEventListener("scroll", () => requestAnimationFrame(() => updateCarouselButtons(row)), { passive: true });
    updateCarouselButtons(row);
  });

  /* ── "See All" buttons ── */
  function activateOnEnterOrSpace(btn) {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); }
    });
  }

  document.querySelectorAll(".section-more[data-see-genre]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = btn.dataset.seeGenre;
      const pill = document.querySelector('.genre-pill[data-genre="' + CSS.escape(genre) + '"]');
      if (pill) {
        pill.click();
        const main = document.getElementById("main-content");
        if (main) main.scrollIntoView({ behavior: "smooth" });
      }
    });
    activateOnEnterOrSpace(btn);
  });

  document.querySelectorAll(".section-more[data-see-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = document.getElementById(btn.dataset.seeSection);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    });
    activateOnEnterOrSpace(btn);
  });

  /* ── Helpers ── */
  function escHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escAttr(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function debounce(fn, ms) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function archiveValidationStatus(ep) {
    if (ep.sourceStatus === "restricted") return "restricted by source";
    if (ep.sourceStatus === "file-missing") return "file missing";
    if (ep.sourceStatus === "unverified") return "unverified after source audit";
    if (!ep.archiveId && !ep.youtubeId) return "identifier missing";
    if (ep.youtubeId) return "embedded player";
    if (typeof ep.archiveFile === "string" && ep.archiveFile) {
      return EXT_PLAYABLE.test(ep.archiveFile) ? "direct stream" : "not browser streamable";
    }
    if (ep.archiveId) return "archive embedded player";
    return "identifier missing";
  }

  window.StarQuestArchiveValidationReport = function () {
    const rows = [];
    (SHOWS || []).forEach((show) => {
      (show.episodes || []).forEach((ep) => {
        rows.push({
          showId: show.id,
          episodeId: buildEpisodeId(ep, show),
          title: ep.title,
          status: archiveValidationStatus(ep),
          archiveId: ep.archiveId || "",
          archiveFile: ep.archiveFile || "",
        });
      });
    });
    return rows;
  };

  /* ── Init ── */
  window.renderForYouRow = renderForYouRow;
  window.initHero = initHero;
  if (window.StarQuestRecommendations) StarQuestRecommendations.beginVisit();
  initHero();
  initRows();

  /* Shared links open the exact program instead of dropping recipients at the
     generic home screen. Invalid or removed IDs safely fall back to browse. */
  (function openSharedPlayerRoute() {
    const params = new URLSearchParams(window.location.search);
    const showId = params.get("sqShow");
    const episodeId = params.get("sqEpisode");
    if (!showId || !episodeId) return;
    const show = SHOWS.find((item) => item.id === showId);
    const episode = show && show.episodes && show.episodes.find((item) => item.id === episodeId);
    if (!show || !episode || !isEpisodePlayable(episode, show)) return;
    const splash = document.getElementById("splash-screen");
    if (splash) splash.style.display = "none";
    setTimeout(() => openPlayer(episode, show.title), 0);
  })();

  if (window.StarQuestArchiveDiscovery) window.StarQuestArchiveDiscovery.load();
})();

/* ================================================================
   STARQUEST — Splash, Auth, Sidebar, Wallet, AI Companion
   ================================================================ */
(function () {
  "use strict";

  const originalElementLabels = window.StarQuestEditableRegistry = window.StarQuestEditableRegistry || {};

  /* ── State ── */
  let _currentEpisode = null;  /* set when player opens */
  let _currentShowTitle = "";
  // This player/account controller is a separate IIFE from the catalogue
  // controller above, so it needs its own commit interval. Referencing the
  // other IIFE's constant caused a ReferenceError every second during video.
  const WATCH_PERSIST_INTERVAL_SECONDS = 10;

  /* ── DOM shortcuts ── */
  function $(id) { return document.getElementById(id); }

  /* ─────────────────────────────────────────────────────────────
     SPLASH SCREEN
     ──────────────────────────────────────────────────────────── */
  const splash = $("splash-screen");

  function hideSplash() {
    if (!splash) return;
    splash.style.pointerEvents = "none";
    splash.style.transition = "opacity .5s";
    splash.style.opacity = "0";
    setTimeout(() => { splash.style.display = "none"; }, 500);
  }

  function showSplash() {
    if (!splash) return;
    splash.style.display = "";
    splash.style.opacity = "1";
  }

  /* On load: if user already has a session, skip splash */
  if (typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentUser()) {
    hideSplash();
    updateUIForUser(StarQuestAuth.currentUser());
  }

  /* Splash buttons */
  const splashSignin = $("splash-signin");
  const splashSignup = $("splash-signup");
  const splashGuest  = $("splash-guest");

  if (splashSignin) splashSignin.addEventListener("click", () => { hideSplash(); openAuthModal("signin"); });
  if (splashSignup) splashSignup.addEventListener("click", () => { hideSplash(); openAuthModal("signup"); });
  if (splashGuest)  splashGuest.addEventListener("click", hideSplash);

  /* ─────────────────────────────────────────────────────────────
     AUTH MODAL
     ──────────────────────────────────────────────────────────── */
  const authBackdrop        = $("auth-backdrop");
  const authClose           = $("auth-close");
  const authSigninPanel     = $("auth-signin-panel");
  const authSignupPanel     = $("auth-signup-panel");
  const switchToSignup      = $("switch-to-signup");
  const switchToSignin      = $("switch-to-signin");
  const authSubmitSignin    = $("auth-submit-signin");
  const authSubmitSignup    = $("auth-submit-signup");
  const authUsername        = $("auth-username");
  const authPassword        = $("auth-password");
  const authNewUsername     = $("auth-new-username");
  const authNewPassword     = $("auth-new-password");
  const authError           = $("auth-error");
  const authErrorSignup     = $("auth-error-signup");

  function openAuthModal(panel) {
    if (!authBackdrop) return;
    authBackdrop.classList.add("open");
    showAuthPanel(panel || "signin");
  }

  function closeAuthModal() {
    if (!authBackdrop) return;
    authBackdrop.classList.remove("open");
    clearAuthErrors();
  }

  document.addEventListener("starquest:require-auth", () => {
    openAuthModal("signin");
  });

  function showAuthPanel(panel) {
    if (panel === "signin") {
      if (authSigninPanel) authSigninPanel.style.display = "";
      if (authSignupPanel) authSignupPanel.style.display = "none";
    } else {
      if (authSigninPanel) authSigninPanel.style.display = "none";
      if (authSignupPanel) authSignupPanel.style.display = "";
    }
    clearAuthErrors();
  }

  function showAuthError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = "";
  }

  function clearAuthErrors() {
    if (authError) { authError.textContent = ""; authError.style.display = "none"; }
    if (authErrorSignup) { authErrorSignup.textContent = ""; authErrorSignup.style.display = "none"; }
  }

  if (authClose) authClose.addEventListener("click", closeAuthModal);
  if (authBackdrop) authBackdrop.addEventListener("click", (e) => {
    if (e.target === authBackdrop) closeAuthModal();
  });
  if (switchToSignup) switchToSignup.addEventListener("click", () => showAuthPanel("signup"));
  if (switchToSignin) switchToSignin.addEventListener("click", () => showAuthPanel("signin"));

  if (authSubmitSignin) {
    authSubmitSignin.addEventListener("click", async () => {
      clearAuthErrors();
      const u = (authUsername && authUsername.value) || "";
      const p = (authPassword && authPassword.value) || "";
      if (typeof StarQuestAuth === "undefined") return;
      authSubmitSignin.disabled = true;
      authSubmitSignin.textContent = "Signing in…";
      const result = await StarQuestAuth.signIn(u, p);
      authSubmitSignin.disabled = false;
      authSubmitSignin.textContent = "⭐ Sign In";
      if (typeof result === "string") {
        showAuthError(authError, result);
      } else {
        closeAuthModal();
        updateUIForUser(result);
        showTokenToast("Welcome back, " + result.username + "! ⭐");
      }
    });
  }

  if (authSubmitSignup) {
    authSubmitSignup.addEventListener("click", async () => {
      clearAuthErrors();
      const u = (authNewUsername && authNewUsername.value) || "";
      const p = (authNewPassword && authNewPassword.value) || "";
      if (typeof StarQuestAuth === "undefined") return;
      authSubmitSignup.disabled = true;
      authSubmitSignup.textContent = "Creating account…";
      const result = await StarQuestAuth.register(u, p);
      authSubmitSignup.disabled = false;
      authSubmitSignup.textContent = "🌟 Create Account";
      if (typeof result === "string") {
        showAuthError(authErrorSignup, result);
      } else {
        closeAuthModal();
        updateUIForUser(result);
        showTokenToast("Welcome to StarQuest, " + result.username + "! ⭐");
      }
    });
  }

  /* Allow Enter key in auth inputs */
  [authUsername, authPassword].forEach((el) => {
    if (el) el.addEventListener("keydown", (e) => { if (e.key === "Enter") authSubmitSignin && authSubmitSignin.click(); });
  });
  [authNewUsername, authNewPassword].forEach((el) => {
    if (el) el.addEventListener("keydown", (e) => { if (e.key === "Enter") authSubmitSignup && authSubmitSignup.click(); });
  });

  /* ─────────────────────────────────────────────────────────────
     AVATAR COIN DESIGN & VALUE PORTAL
     ──────────────────────────────────────────────────────────── */
  const profileBackdrop = $("profile-portal-backdrop");
  const profileClose = $("profile-portal-close");
  const profileSave = $("profile-save-avatar");
  const profileMessage = $("profile-save-message");
  const navProfileAvatar = $("nav-profile-avatar");
  const sidebarProfileAvatar = $("sidebar-profile-avatar");
  const sidebarProfileBtn = $("sidebar-profile-btn");
  const profileEditTarget = $("profile-edit-target");
  const profileCardSize = $("profile-card-size");
  const profileCardSizeLabel = $("profile-card-size-label");
  const designNameInput = $("avatar-design-name");
  const designScopeInput = $("avatar-design-scope");
  const designModeInput = $("avatar-design-mode");
  const designAutoAdapt = $("avatar-auto-adapt");
  const designAdaptReason = $("avatar-adapt-reason");
  const designCopy = $("avatar-copy-design");
  const designReset = $("avatar-reset-design");
  const elementValueInput = $("avatar-element-value");
  const designAISuggest = $("avatar-ai-suggest");
  const designAIStatus = $("avatar-ai-status");
  const avatarCrownId = $("avatar-crown-id");
  const avatarChainList = $("avatar-chain-list");
  const avatarChangeRequest = $("avatar-change-request");
  const avatarApplyRequest = $("avatar-apply-request");
  const avatarForkCurrent = $("avatar-fork-current");
  const avatarCopyChain = $("avatar-copy-chain");
  const avatarImportDesign = $("avatar-import-design");
  const vhsAvatarLabel = $("vhs-avatar-label");
  const DESIGN_KEY = "starquest_personal_design";
  const designSizes = ["Compact", "Comfortable", "Showcase"];
  const VHS_STYLES = ["cosmic", "blue", "gold", "red"];
  let activeDesignTarget = "Your whole StarQuest page";
  let activeDesignKey = "brand-name";
  let pendingChainParentId = null;
  let pendingChainDesignId = null;
  let pendingDesign = { name: "My StarQuest", scope: "site", mode: "human", theme: "cosmic", cardSize: 1, autoAdapt: false, avatarStyle: "cosmic", avatarLabel: "SQ", overrides: {} };
  const AVATAR_COIN_MARK = "★";
  function cleanVhsLabel(value) {
    return String(value || "SQ").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "SQ";
  }

  function applyVhsAvatar(design) {
    const style = VHS_STYLES.includes(design.avatarStyle) ? design.avatarStyle : "cosmic";
    const label = cleanVhsLabel(design.avatarLabel);
    document.querySelectorAll("[data-vhs-avatar]").forEach((avatar) => {
      VHS_STYLES.forEach((name) => avatar.classList.remove("vhs-avatar--" + name));
      avatar.classList.add("vhs-avatar--" + style);
      const labelNode = avatar.querySelector("[data-vhs-label]");
      if (labelNode) labelNode.textContent = label;
    });
  }

  function distributorSummary() {
    if (!window.AINScansDistributorLedger) return { coins: 0, verified: 0, unclaimed: 0 };
    const ledger = window.AINScansDistributorLedger.read();
    return Object.values(ledger.accounts || {}).reduce((sum, account) => {
      const coins = Math.max(0, Number(account.starCoins) || 0);
      sum.coins += coins;
      if (account.verified) sum.verified += coins;
      else sum.unclaimed += coins;
      return sum;
    }, { coins: 0, verified: 0, unclaimed: 0 });
  }

  function readPersonalDesign() {
    try {
      const stored = JSON.parse(localStorage.getItem(DESIGN_KEY)) || {};
      const theme = ["cosmic", "midnight", "golden"].includes(stored.theme) ? stored.theme : "cosmic";
      const storedSize = Number(stored.cardSize);
      const cardSize = Number.isInteger(storedSize) ? Math.max(0, Math.min(2, storedSize)) : 1;
      const scope = ["network", "site", "channel", "component"].includes(stored.scope) ? stored.scope : "site";
      const mode = ["human", "assisted", "adaptive"].includes(stored.mode) ? stored.mode : "human";
      const avatarStyle = VHS_STYLES.includes(stored.avatarStyle) ? stored.avatarStyle : "cosmic";
      const avatarLabel = cleanVhsLabel(stored.avatarLabel);
      const overrides = stored.overrides && typeof stored.overrides === "object" ? stored.overrides : {};
      return { name: String(stored.name || "My StarQuest").slice(0, 48), scope, mode, theme, cardSize, autoAdapt: !!stored.autoAdapt, avatarStyle, avatarLabel, overrides };
    } catch (_) { return { name: "My StarQuest", scope: "site", mode: "human", theme: "cosmic", cardSize: 1, autoAdapt: false, avatarStyle: "cosmic", avatarLabel: "SQ", overrides: {} }; }
  }

  function adaptiveDesign(design) {
    if (!design.autoAdapt || typeof StarQuestAuth === "undefined") return { design, reason: "Automatic adaptation is off." };
    const history = StarQuestAuth.getHistory ? StarQuestAuth.getHistory() : [];
    if (!history.length) return { design, reason: "Watch a few titles first; your current design stays in place." };
    const words = history.slice(0, 30).flatMap((item) => [item.genre, ...(item.tags || [])]).join(" ").toLowerCase();
    const theme = /family|comedy|music|game/.test(words) ? "golden" : /crime|mystery|drama|horror/.test(words) ? "midnight" : "cosmic";
    const cardSize = history.length >= 12 ? 0 : 2;
    return { design: { ...design, theme, cardSize, mode: "adaptive" }, reason: "Adapted from " + Math.min(history.length, 30) + " recent viewing-history items; you can still override it." };
  }

  function applyPersonalDesign(design) {
    document.documentElement.dataset.userTheme = design.theme;
    document.documentElement.dataset.cardSize = String(design.cardSize);
    applyVhsAvatar(design);
    Object.keys(originalElementLabels).forEach((key) => {
      const entry = originalElementLabels[key];
      const value = design.overrides && design.overrides[key] ? String(design.overrides[key]).slice(0, 64) : entry.original;
      if (entry.kind === "text-node") entry.node.nodeValue = value + " ";
      else entry.node.textContent = value;
    });
  }

  function renderDesignControls() {
    if (profileEditTarget) profileEditTarget.textContent = activeDesignTarget;
    document.querySelectorAll("[data-design-theme]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.designTheme === pendingDesign.theme);
    });
    if (profileCardSize) profileCardSize.value = String(pendingDesign.cardSize);
    if (profileCardSizeLabel) profileCardSizeLabel.textContent = designSizes[pendingDesign.cardSize];
    if (designNameInput) designNameInput.value = pendingDesign.name;
    if (designScopeInput) designScopeInput.value = pendingDesign.scope;
    if (designModeInput) designModeInput.value = pendingDesign.mode;
    if (designAutoAdapt) designAutoAdapt.checked = pendingDesign.autoAdapt;
    document.querySelectorAll("[data-vhs-style]").forEach((button) => {
      button.classList.toggle("selected", button.dataset.vhsStyle === pendingDesign.avatarStyle);
    });
    if (vhsAvatarLabel) vhsAvatarLabel.value = cleanVhsLabel(pendingDesign.avatarLabel);
    const entry = originalElementLabels[activeDesignKey];
    if (elementValueInput) elementValueInput.value = (pendingDesign.overrides && pendingDesign.overrides[activeDesignKey]) || (entry ? entry.original : "");
  }

  function designFromChainRecord(record) {
    if (!record || !record.settings) return null;
    return {
      name: record.name || "My StarQuest",
      scope: record.scope || "site",
      mode: record.creationMode || "human",
      theme: record.settings.theme || "cosmic",
      cardSize: Number.isInteger(Number(record.settings.cardSize)) ? Number(record.settings.cardSize) : 1,
      autoAdapt: !!record.settings.autoAdapt,
      avatarStyle: VHS_STYLES.includes(record.settings.avatarStyle) ? record.settings.avatarStyle : "cosmic",
      avatarLabel: cleanVhsLabel(record.settings.avatarLabel),
      overrides: { ...(record.settings.overrides || {}) }
    };
  }

  function renderAvatarChain() {
    if (!window.AvatarCoinChain) return;
    const identity = AvatarCoinChain.identity();
    if (avatarCrownId) avatarCrownId.textContent = identity.crownId;
    if (!avatarChainList) return;
    const records = AvatarCoinChain.readChain().records
      .filter((record) => record.siteId === AvatarCoinChain.siteId)
      .slice(-8)
      .reverse();
    avatarChainList.innerHTML = "";
    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "avatar-chain__empty";
      empty.textContent = "Save this design to create version 1 of its Crown chain.";
      avatarChainList.appendChild(empty);
      return;
    }
    records.forEach((record) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "avatar-chain-version";
      button.dataset.avatarVersionId = record.id;
      const parent = record.forkedFromId ? " · remix" : (record.parentVersionId ? " · continued" : " · origin");
      button.innerHTML = "<strong></strong><span></span><small></small>";
      button.querySelector("strong").textContent = record.name + " · v" + record.version;
      button.querySelector("span").textContent = record.targetLabel + parent;
      button.querySelector("small").textContent = String(record.versionHash || "").slice(0, 16);
      avatarChainList.appendChild(button);
    });
  }

  function previewNaturalDesignRequest() {
    if (!avatarChangeRequest) return;
    const request = avatarChangeRequest.value.trim();
    if (!request) {
      if (profileMessage) profileMessage.textContent = "Describe the page change you want first.";
      return;
    }
    const lower = request.toLowerCase();
    ["cosmic", "midnight", "golden"].forEach((theme) => {
      if (lower.includes(theme)) pendingDesign.theme = theme;
    });
    const sizeMap = { compact: 0, comfortable: 1, showcase: 2 };
    Object.keys(sizeMap).forEach((size) => {
      if (lower.includes(size)) pendingDesign.cardSize = sizeMap[size];
    });
    const quoted = request.match(/["“]([^"”]{1,64})["”]/);
    const called = request.match(/(?:call|name|rename)\s+(?:it|this|the page)?\s*(?:to\s+)?([^,.]{1,64})/i);
    const label = (quoted && quoted[1]) || (called && called[1]);
    if (label) {
      if (!pendingDesign.overrides) pendingDesign.overrides = {};
      pendingDesign.overrides[activeDesignKey] = label.trim().slice(0, 64);
    }
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
    if (profileMessage) profileMessage.textContent = "Request previewed. Save to add it to the Crown chain.";
  }

  function renderProfilePortal() {
    const user = typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null;
    if ($("profile-access-balance")) $("profile-access-balance").textContent = user ? (user.tokens || 0) : "0";
    const watchedTitles = user && Array.isArray(user.watchHistory) ? user.watchHistory.length : 0;
    if ($("profile-watch-progress")) $("profile-watch-progress").textContent = watchedTitles;
    if ($("profile-unlocked-count")) $("profile-unlocked-count").textContent = user ? Object.keys(user.unlockedContent || {}).length : "0";
    const distributor = distributorSummary();
    if ($("profile-distributor-coins")) $("profile-distributor-coins").textContent = distributor.coins;
    if ($("profile-distributor-status")) {
      $("profile-distributor-status").textContent = distributor.verified
        ? distributor.verified + " claimable · " + distributor.unclaimed + " unclaimed"
        : distributor.unclaimed + " unclaimed until rights are verified";
    }
    if (profileSave) profileSave.disabled = false;
    if (profileMessage) profileMessage.textContent = "";
    const adapted = adaptiveDesign(readPersonalDesign());
    pendingDesign = adapted.design;
    if (designAdaptReason) designAdaptReason.textContent = adapted.reason;
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
    renderAvatarChain();
  }

  function openProfilePortal(target, scope, key) {
    activeDesignTarget = target || "Your whole StarQuest page";
    activeDesignKey = key || "brand-name";
    renderProfilePortal();
    if (scope) pendingDesign.scope = scope;
    renderDesignControls();
    if (profileBackdrop) profileBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeProfilePortal() {
    if (profileBackdrop) profileBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.addEventListener("starquest:edit-element", (event) => {
    const detail = event.detail || {};
    openProfilePortal(detail.target, detail.scope, detail.key);
  });
  document.addEventListener("avatarcoin:edit-request", (event) => {
    const detail = event.detail || {};
    if (!detail.key || !detail.node) return;
    originalElementLabels[detail.key] = {
      node: detail.node,
      kind: detail.kind || "text-node",
      original: detail.original || detail.target || ""
    };
    closeSidebar();
    openProfilePortal(detail.target || "Page element", "component", detail.key);
  });

  document.addEventListener("starquest:portal-open-request", (event) => {
    const detail = event.detail || {};
    openProfilePortal(detail.target || "StarQuest name", detail.scope || "site", detail.key || "brand-name");
  });

  if (!window.StarQuestControls && sidebarProfileBtn) {
    sidebarProfileBtn.addEventListener("click", () => { closeSidebar(); openProfilePortal("StarQuest name", "site", "brand-name"); });
  }
  const brandName = $("nav-brand-name");
  if (brandName) originalElementLabels["brand-name"] = { node: brandName, kind: "element", original: "StarQuest" };
  document.querySelectorAll(".section-title").forEach((title) => {
    if (title.querySelector(".design-star")) return;
    const star = document.createElement("button");
    star.type = "button";
    star.className = "design-star";
    const labelNode = Array.from(title.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
    if (!labelNode) return;
    const key = "heading-" + (title.id || Math.random().toString(36).slice(2));
    const original = labelNode.nodeValue.trim();
    originalElementLabels[key] = { node: labelNode, kind: "text-node", original };
    star.textContent = AVATAR_COIN_MARK;
    star.dataset.designTarget = original;
    star.dataset.designKey = key;
    star.dataset.designScope = "component";
    star.setAttribute("aria-label", "Customize " + title.textContent.trim());
    title.appendChild(star);
  });
  /* Portal markers can live inside links and can be re-mounted by the editable-page
     observer. Capture their click at the document boundary so the marker always wins
     over parent navigation and still works after dynamic page updates. */
  if (!window.StarQuestControls) {
    document.addEventListener("click", (event) => {
      const target = event.target;
      const marker = target && target.closest ? target.closest("[data-avatar-portal]") : null;
      if (!marker) return;
      event.preventDefault();
      event.stopPropagation();
      closeSidebar();
      openProfilePortal(
        marker.dataset.designTarget || marker.dataset.avatarTarget || "StarQuest name",
        marker.dataset.designScope || marker.dataset.avatarScope || "site",
        marker.dataset.designKey || marker.dataset.avatarKey || "brand-name"
      );
    }, true);
  }

  document.querySelectorAll(".design-star:not([data-avatar-portal])").forEach((star) => {
    star.textContent = AVATAR_COIN_MARK;
    star.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      closeSidebar();
      openProfilePortal(star.dataset.designTarget || "StarQuest name", star.dataset.designScope || "site", star.dataset.designKey || "brand-name");
    });
  });
  document.querySelectorAll("[data-design-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingDesign.theme = button.dataset.designTheme;
      applyPersonalDesign(pendingDesign);
      renderDesignControls();
    });
  });
  document.querySelectorAll("[data-vhs-style]").forEach((button) => {
    button.addEventListener("click", () => {
      pendingDesign.avatarStyle = button.dataset.vhsStyle;
      applyVhsAvatar(pendingDesign);
      renderDesignControls();
    });
  });
  if (vhsAvatarLabel) vhsAvatarLabel.addEventListener("input", () => {
    pendingDesign.avatarLabel = cleanVhsLabel(vhsAvatarLabel.value);
    applyVhsAvatar(pendingDesign);
  });
  if (profileCardSize) profileCardSize.addEventListener("input", () => {
    pendingDesign.cardSize = Number(profileCardSize.value);
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
  });
  if (designNameInput) designNameInput.addEventListener("input", () => { pendingDesign.name = designNameInput.value.slice(0, 48); });
  if (designScopeInput) designScopeInput.addEventListener("change", () => { pendingDesign.scope = designScopeInput.value; });
  if (designModeInput) designModeInput.addEventListener("change", () => { pendingDesign.mode = designModeInput.value; });
  if (designAutoAdapt) designAutoAdapt.addEventListener("change", () => {
    pendingDesign.autoAdapt = designAutoAdapt.checked;
    const adapted = adaptiveDesign(pendingDesign);
    pendingDesign = adapted.design;
    applyPersonalDesign(pendingDesign);
    if (designAdaptReason) designAdaptReason.textContent = adapted.reason;
    renderDesignControls();
  });
  if (elementValueInput) elementValueInput.addEventListener("input", () => {
    if (!pendingDesign.overrides) pendingDesign.overrides = {};
    const value = elementValueInput.value.trim().slice(0, 64);
    if (value) pendingDesign.overrides[activeDesignKey] = value;
    else delete pendingDesign.overrides[activeDesignKey];
    applyPersonalDesign(pendingDesign);
  });
  if (designAISuggest) designAISuggest.addEventListener("click", async () => {
    if (!window.StarQuestAI || typeof StarQuestAI.suggestDesignName !== "function") return;
    designAISuggest.disabled = true;
    if (designAIStatus) designAIStatus.textContent = "Designing…";
    const suggestion = await StarQuestAI.suggestDesignName(activeDesignTarget, elementValueInput ? elementValueInput.value : "");
    designAISuggest.disabled = false;
    if (!suggestion) { if (designAIStatus) designAIStatus.textContent = "AI is unavailable right now."; return; }
    if (elementValueInput) {
      elementValueInput.value = suggestion;
      elementValueInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    pendingDesign.mode = "assisted";
    if (designAIStatus) designAIStatus.textContent = "Previewing an AI suggestion.";
    renderDesignControls();
  });
  if (profileClose) profileClose.addEventListener("click", closeProfilePortal);
  if (profileBackdrop) profileBackdrop.addEventListener("click", (event) => { if (event.target === profileBackdrop) closeProfilePortal(); });
  if (profileSave) profileSave.addEventListener("click", async () => {
    profileSave.disabled = true;
    localStorage.setItem(DESIGN_KEY, JSON.stringify(pendingDesign));
    applyPersonalDesign(pendingDesign);
    try {
      const record = window.AvatarCoinChain
        ? await AvatarCoinChain.saveVersion(pendingDesign, {
            targetKey: activeDesignKey,
            targetLabel: activeDesignTarget,
            siteSymbol: AVATAR_COIN_MARK,
            designId: pendingChainDesignId || undefined,
            parentVersionId: pendingChainParentId === null ? undefined : pendingChainParentId
          })
        : null;
      if (record) {
        pendingChainParentId = record.id;
        pendingChainDesignId = record.designId;
      }
      renderAvatarChain();
      if (profileMessage) {
        profileMessage.textContent = record
          ? "Saved as Crown chain version " + record.version + "."
          : "Your Avatar Coin design is saved on this device.";
      }
    } catch (_) {
      if (profileMessage) profileMessage.textContent = "The page design saved, but its chain record could not be created.";
    } finally {
      profileSave.disabled = false;
    }
  });
  if (designCopy) designCopy.addEventListener("click", async () => {
    const current = window.AvatarCoinChain ? AvatarCoinChain.current() : null;
    const record = current || {
      schema: "avatar-coin-design/v2",
      name: pendingDesign.name || "My StarQuest",
      scope: pendingDesign.scope,
      targetLabel: activeDesignTarget,
      creationMode: pendingDesign.mode,
      settings: { theme: pendingDesign.theme, cardSize: pendingDesign.cardSize, autoAdapt: pendingDesign.autoAdapt, avatarStyle: pendingDesign.avatarStyle, avatarLabel: pendingDesign.avatarLabel, overrides: pendingDesign.overrides },
      status: "unsaved-preview"
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      if (profileMessage) profileMessage.textContent = "Current Avatar Coin version copied with its attribution.";
    } catch (_) {
      if (profileMessage) profileMessage.textContent = "Copy was blocked by this browser. Your saved design is unchanged.";
    }
  });
  if (avatarApplyRequest) avatarApplyRequest.addEventListener("click", previewNaturalDesignRequest);
  if (avatarChainList) avatarChainList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-avatar-version-id]");
    if (!button || !window.AvatarCoinChain) return;
    const record = AvatarCoinChain.readChain().records.find((item) => item.id === button.dataset.avatarVersionId);
    const design = designFromChainRecord(record);
    if (!design) return;
    pendingDesign = design;
    pendingChainParentId = record.id;
    pendingChainDesignId = record.designId;
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
    if (profileMessage) profileMessage.textContent = "Version " + record.version + " is previewing. Save to continue from it.";
  });
  if (avatarForkCurrent) avatarForkCurrent.addEventListener("click", async () => {
    if (!window.AvatarCoinChain) return;
    const current = AvatarCoinChain.current();
    if (!current) {
      if (profileMessage) profileMessage.textContent = "Save the first version before starting a new branch.";
      return;
    }
    const record = await AvatarCoinChain.fork(current.id, (pendingDesign.name || current.name) + " remix");
    const design = designFromChainRecord(record);
    if (design) pendingDesign = design;
    pendingChainParentId = record.id;
    pendingChainDesignId = record.designId;
    localStorage.setItem(DESIGN_KEY, JSON.stringify(pendingDesign));
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
    renderAvatarChain();
    if (profileMessage) profileMessage.textContent = "New attributed branch created from " + current.name + ".";
  });
  if (avatarCopyChain) avatarCopyChain.addEventListener("click", async () => {
    if (!window.AvatarCoinChain) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(AvatarCoinChain.exportChain(), null, 2));
      if (profileMessage) profileMessage.textContent = "The full Crown design chain was copied.";
    } catch (_) {
      if (profileMessage) profileMessage.textContent = "The browser blocked copying the chain.";
    }
  });
  if (avatarImportDesign) avatarImportDesign.addEventListener("click", async () => {
    if (!window.AvatarCoinChain) return;
    const source = window.prompt("Paste an Avatar Coin design record:");
    if (!source) return;
    try {
      const record = await AvatarCoinChain.importRecord(source);
      const design = designFromChainRecord(record);
      if (design) {
        pendingDesign = design;
        applyPersonalDesign(pendingDesign);
        renderDesignControls();
      }
      renderAvatarChain();
      if (profileMessage) profileMessage.textContent = "Imported design previewed with its original attribution.";
    } catch (error) {
      if (profileMessage) profileMessage.textContent = error.message || "That design record could not be imported.";
    }
  });
  if (designReset) designReset.addEventListener("click", () => {
    localStorage.removeItem(DESIGN_KEY);
    pendingDesign = readPersonalDesign();
    applyPersonalDesign(pendingDesign);
    renderDesignControls();
    if (designAdaptReason) designAdaptReason.textContent = "Automatic adaptation is off.";
    renderAvatarChain();
    if (profileMessage) profileMessage.textContent = "Avatar Coin design reset to the StarQuest default. Crown history remains available.";
  });

  applyPersonalDesign(readPersonalDesign());
  if (window.AvatarCoinChain && typeof AvatarCoinChain.observeEditablePage === "function") {
    AvatarCoinChain.observeEditablePage();
  }

  /* ─────────────────────────────────────────────────────────────
     UPDATE UI FOR LOGGED-IN / LOGGED-OUT STATE
     ──────────────────────────────────────────────────────────── */
  function updateUIForUser(user) {
    const sidebarUsername  = $("sidebar-username");
    const sidebarTokens    = $("sidebar-token-count");
    const navWallet        = $("nav-wallet");
    const navTokenCount    = $("nav-token-count");
    const signinBtn        = $("sidebar-signin-btn");
    const signoutBtn       = $("sidebar-signout-btn");

    const wallet = typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet
      ? StarQuestAuth.currentWallet()
      : user;
    if (user) {
      if (sidebarUsername) sidebarUsername.textContent = user.username;
      if (sidebarTokens)  sidebarTokens.textContent   = user.tokens || 0;
      if (navWallet)      navWallet.style.display      = "flex";
      if (navTokenCount)  navTokenCount.textContent    = user.tokens || 0;
      if (signinBtn)      signinBtn.style.display      = "none";
      if (signoutBtn)     signoutBtn.style.display     = "";
    } else {
      if (sidebarUsername) sidebarUsername.textContent = "Guest";
      if (sidebarTokens)  sidebarTokens.textContent   = (wallet && wallet.tokens) || 0;
      if (navWallet)      navWallet.style.display      = "flex";
      if (navTokenCount)  navTokenCount.textContent    = (wallet && wallet.tokens) || 0;
      if (signinBtn)      signinBtn.style.display      = "";
      if (signoutBtn)     signoutBtn.style.display     = "none";
    }
    renderHistoryList();
    renderLedgerList();
    renderWalletCard(wallet);
    renderUnlockedContent(user);
  }

  /* Token update event */
  document.addEventListener("starquest:tokens-updated", (e) => {
    updateUIForUser(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
  });
  document.addEventListener("starquest:history-updated", () => {
    renderHistoryList();
    /* Re-render For You row and hero with updated affinity */
    if (typeof renderForYouRow === "function") renderForYouRow();
    if (typeof initHero === "function") initHero();
  });
  document.addEventListener("starquest:auth-changed", () => {
    updateUIForUser(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
    if (typeof renderForYouRow === "function") renderForYouRow();
    if (typeof initHero === "function") initHero();
  });
  document.addEventListener("starquest:content-unlocked", () => {
    renderUnlockedContent(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
    if (typeof renderForYouRow === "function") renderForYouRow();
  });
  document.addEventListener("starquest:watch-progress", () => {
    renderWalletCard(typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet ? StarQuestAuth.currentWallet() : null);
  });
  document.addEventListener("starquest:history-progress", () => {
    renderHistoryList();
  });
  document.addEventListener("starquest:share-progress", (event) => {
    renderWalletCard(typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet ? StarQuestAuth.currentWallet() : null);
    renderLedgerList();
    if (event.detail && event.detail.awarded > 0) {
      const button = $("player-share-btn");
      if (button) {
        button.classList.add("player-share-btn--minted");
        button.textContent = "⭐ Star Coin created";
        setTimeout(() => {
          button.classList.remove("player-share-btn--minted");
          renderWalletCard(typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet ? StarQuestAuth.currentWallet() : null);
        }, 1800);
      }
    }
  });

  /* ─────────────────────────────────────────────────────────────
     HAMBURGER SIDEBAR
     ──────────────────────────────────────────────────────────── */
  const hamburgerBtn     = $("hamburger-btn");
  const sidebar          = $("sidebar");
  const sidebarBackdrop  = $("sidebar-backdrop");
  const sidebarClose     = $("sidebar-close");
  const sidebarSigninBtn = $("sidebar-signin-btn");
  const sidebarSignoutBtn= $("sidebar-signout-btn");

  function openSidebar() {
    if (window.StarQuestControls) {
      window.StarQuestControls.openSidebar();
      return;
    }
    if (sidebar) sidebar.classList.add("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("open");
    if (hamburgerBtn) { hamburgerBtn.classList.add("open"); hamburgerBtn.setAttribute("aria-expanded", "true"); }
    document.body.style.overflow = "hidden";
    renderHistoryList();
    renderLedgerList();
    renderWalletCard(typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet ? StarQuestAuth.currentWallet() : null);
    renderConvoHistory();
  }

  function closeSidebar() {
    if (window.StarQuestControls) window.StarQuestControls.closeSidebar();
    else {
      if (sidebar) sidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("open");
      if (hamburgerBtn) { hamburgerBtn.classList.remove("open"); hamburgerBtn.setAttribute("aria-expanded", "false"); }
      document.body.style.overflow = "";
    }
  }

  if (!window.StarQuestControls) {
    if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);
    if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);
  }
  document.addEventListener("starquest:sidebar-opened", () => {
    renderHistoryList();
    renderLedgerList();
    renderWalletCard(typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet ? StarQuestAuth.currentWallet() : null);
    renderConvoHistory();
  });

  if (sidebarSigninBtn) sidebarSigninBtn.addEventListener("click", () => { closeSidebar(); openAuthModal("signin"); });
  if (sidebarSignoutBtn) sidebarSignoutBtn.addEventListener("click", () => {
    if (typeof StarQuestAuth !== "undefined") StarQuestAuth.signOut();
    updateUIForUser(null);
    closeSidebar();
    showSplash();
  });

  /* Clear history */
  const clearHistoryBtn = $("clear-history-btn");
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (typeof StarQuestAuth === "undefined") return;
      if (!confirm("Clear your entire watch history?")) return;
      StarQuestAuth.clearHistory();
      renderHistoryList();
    });
  }

  /* ─────────────────────────────────────────────────────────────
     WATCH HISTORY RENDER
     ──────────────────────────────────────────────────────────── */
  function renderHistoryList() {
    const list  = $("history-list");
    const empty = $("history-empty");
    if (!list) return;

    const history = (typeof StarQuestAuth !== "undefined") ? StarQuestAuth.getHistory() : [];

    /* Clear non-empty-placeholder items */
    Array.from(list.querySelectorAll(".history-item")).forEach((el) => el.remove());

    if (!history.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    history.forEach((item) => {
      const el = document.createElement("div");
      el.className = "history-item";
      el.setAttribute("role", "listitem");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", "Resume " + item.epTitle);

      const time = formatRelativeTime(item.lastWatchedAt || item.startedAt || Date.now());
      const thumb = item.thumbnail || "";
      const position = Math.max(0, Number(item.positionSeconds) || 0);
      const duration = Math.max(0, Number(item.duration) || 0);
      const percent = duration > 0 ? Math.min(100, Math.round((position / duration) * 100)) : 0;
      const progressText = item.completed
        ? "Watched"
        : position > 0
          ? formatWatchTime(position) + (duration > 0 ? " of " + formatWatchTime(duration) : "")
          : time;

      el.innerHTML = `
        <img class="history-item__thumb" src="${escAttrSQ(thumb)}" alt="${escAttrSQ(item.epTitle)}" onerror="this.style.display='none'">
        <div class="history-item__info">
          <div class="history-item__show">${escHTMLSQ(item.showTitle)}</div>
          <div class="history-item__ep">${escHTMLSQ(item.epTitle)}</div>
          <div class="history-item__progress" aria-label="${escAttrSQ(String(percent))}% watched"><i style="width:${percent}%"></i></div>
        </div>
        <div class="history-item__time">${escHTMLSQ(progressText)}</div>
      `;

      el.addEventListener("click", () => {
        closeSidebar();
        /* Re-open the player for this episode */
        const show = (typeof getShowById !== "undefined")
          ? getShowById(item.episodeId.split("|")[0])
          : null;
        if (!show) return;
        const ep = show.episodes && show.episodes.find(
          (e) => buildEpisodeId(e, show) === item.episodeId
        );
        if (!ep) return;
        /* Use global openPlayer from the first IIFE — not directly accessible,
           but we dispatch a custom event the player can listen to. */
        document.dispatchEvent(new CustomEvent("starquest:play-episode", {
          detail: { ep, showTitle: show.title }
        }));
      });

      list.appendChild(el);
    });
  }

  function buildEpisodeId(ep, show) {
    return show.id + "|S" + ep.season + "E" + ep.episode;
  }

  function formatRelativeTime(ts) {
    const diff = Date.now() - ts;
    const min  = Math.floor(diff / 60000);
    if (min < 1)   return "just now";
    if (min < 60)  return min + "m ago";
    const hr = Math.floor(min / 60);
    if (hr < 24)   return hr + "h ago";
    const d = Math.floor(hr / 24);
    return d + "d ago";
  }

  function formatWatchTime(seconds) {
    const total = Math.max(0, Math.trunc(Number(seconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const remaining = total % 60;
    return (hours ? hours + ":" + String(minutes).padStart(2, "0") : String(minutes)) + ":" + String(remaining).padStart(2, "0");
  }

  /* ─────────────────────────────────────────────────────────────
     LEDGER RENDER
     ──────────────────────────────────────────────────────────── */
  function renderLedgerList() {
    const list  = $("ledger-list");
    const empty = $("ledger-empty");
    if (!list) return;

    const user = (typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentWallet)
      ? StarQuestAuth.currentWallet()
      : null;
    const ledger = (user && user.ledger) ? user.ledger.slice().reverse().slice(0, 20) : [];

    Array.from(list.querySelectorAll(".ledger-item")).forEach((el) => el.remove());

    if (!ledger.length) {
      if (empty) empty.style.display = "";
      return;
    }

    if (empty) empty.style.display = "none";

    ledger.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const sign = amount >= 0 ? "+" : "−";
      const labelByType = {
        watch_reward: "watch reward",
        share_reward: "share reward",
        share_credit: "share ledger commit",
        content_unlock: "content unlock",
      };
      const label = tx.label || labelByType[tx.type] || "administrator/migration adjustment";
      const el = document.createElement("div");
      el.className = "ledger-item";
      el.innerHTML = `
        <span class="ledger-item__amount">${sign}${escHTMLSQ(String(Math.abs(amount)))} ⭐</span>
        <span class="ledger-item__reason">${escHTMLSQ(label)} · ${escHTMLSQ(tx.reason || "")}</span>
        <span class="ledger-item__balance">bal: ${escHTMLSQ(String(tx.balance))}</span>
      `;
      list.appendChild(el);
    });
  }

  function renderUnlockedContent(user) {
    const list = $("unlocked-content-list");
    const empty = $("unlocked-content-empty");
    if (!list) return;
    Array.from(list.querySelectorAll(".ledger-item")).forEach((el) => el.remove());
    const items = (user && typeof StarQuestAuth !== "undefined") ? StarQuestAuth.getUnlockedContent() : [];
    if (!items.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";
    items.slice(0, 20).forEach((item) => {
      const el = document.createElement("div");
      el.className = "ledger-item";
      el.innerHTML = `
        <span class="ledger-item__reason">${escHTMLSQ(item.title || item.contentId)}</span>
        <span class="ledger-item__amount">${escHTMLSQ(String(item.cost || 0))} ⭐</span>
      `;
      list.appendChild(el);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     WALLET CARD RENDER
     Shows big balance and share-progress bar in the sidebar.
     ──────────────────────────────────────────────────────────── */
  const SHARES_PER_COIN = 10;  /* shares required to earn 1 StarCoin */

  function renderWalletCard(user) {
    const balEl   = $("wallet-balance-big");
    const shareEl = $("wallet-share-count");
    const barEl   = $("wallet-share-bar");
    const wrapEl  = $("wallet-progress-bar-wrap");
    const lifetimeEl = $("wallet-lifetime-shares");
    const starPowerEl = $("wallet-star-power");
    const navShareEl = $("nav-share-progress");
    const navSharesLeftEl = $("nav-shares-left");
    const buildingEl = $("wallet-building-balance");
    const homeStatusEl = $("home-starcoin-status");
    const homeProgressEl = $("home-share-progress");
    const homeDetailEl = $("home-share-detail");

    const tokens  = (user && user.tokens) || 0;
    const pending = (user && user.pendingShareCredits) || 0;
    const lifetimeShares = (user && user.shareCount) || 0;

    if (balEl)   balEl.textContent  = tokens;
    if (buildingEl) {
      buildingEl.textContent = pending > 0
        ? (pending / SHARES_PER_COIN).toFixed(1) + " ⭐ being built from " + pending + "/" + SHARES_PER_COIN
        : "0.0 ⭐ being built — the next share starts a new StarCoin";
    }
    const sharesLeft = pending === 0 ? SHARES_PER_COIN : SHARES_PER_COIN - pending;
    if (shareEl) shareEl.textContent = pending + " / " + SHARES_PER_COIN;
    if (navShareEl) navShareEl.textContent = pending + "/" + SHARES_PER_COIN;
    if (navSharesLeftEl) navSharesLeftEl.textContent = sharesLeft + (sharesLeft === 1 ? " share left" : " shares left");
    if (homeProgressEl) homeProgressEl.textContent = pending + "/" + SHARES_PER_COIN;
    if (homeDetailEl) {
      homeDetailEl.textContent = tokens > 0
        ? tokens + (tokens === 1 ? " whole StarCoin · " : " whole StarCoins · ") + sharesLeft + (sharesLeft === 1 ? " share left" : " shares left")
        : sharesLeft + (sharesLeft === 1 ? " share until your first StarCoin" : " shares until your first StarCoin");
    }
    if (homeStatusEl) {
      homeStatusEl.setAttribute("aria-label", "Open StarCoin wallet. " + pending + " of " + SHARES_PER_COIN + " shares toward the next StarCoin.");
    }
    const playerShareEl = $("player-share-btn");
    if (playerShareEl && !playerShareEl.classList.contains("player-share-btn--minted")) {
      playerShareEl.textContent = "🛡️ Share " + pending + "/" + SHARES_PER_COIN;
      playerShareEl.setAttribute("aria-label", "Share this program. " + pending + " of " + SHARES_PER_COIN + " toward a Star Coin.");
    }
    if (barEl)   barEl.style.width  = Math.min(100, (pending / SHARES_PER_COIN) * 100) + "%";
    if (wrapEl)  wrapEl.setAttribute("aria-valuenow", pending);
    if (lifetimeEl) lifetimeEl.textContent = "🔗 Lifetime shares: " + lifetimeShares;
    if (starPowerEl) starPowerEl.textContent = "✨ Star Power (sharing): " + Math.floor(lifetimeShares / SHARES_PER_COIN);
  }

  const homeStarCoinStatus = $("home-starcoin-status");
  if (homeStarCoinStatus) homeStarCoinStatus.addEventListener("click", () => {
    const hamburger = $("hamburger-btn");
    if (hamburger) hamburger.click();
  });

  /* ─────────────────────────────────────────────────────────────
     COSMO CONVERSATION HISTORY (sidebar preview)
     ──────────────────────────────────────────────────────────── */
  function renderConvoHistory() {
    const preview = $("sidebar-convo-preview");
    const empty   = $("convo-empty");
    if (!preview) return;

    /* Remove previous rendered messages (not the empty placeholder) */
    Array.from(preview.querySelectorAll(".convo-preview__msg")).forEach((el) => el.remove());

    const history = (typeof StarQuestAI !== "undefined") ? StarQuestAI.getHistory() : [];
    /* Show last 6 entries (3 exchanges) */
    const recent = history.slice(-6);

    if (!recent.length) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";

    recent.forEach((entry) => {
      const el = document.createElement("div");
      el.className = "convo-preview__msg convo-preview__msg--" + (entry.role === "user" ? "user" : "bot");
      el.innerHTML =
        '<span class="convo-preview__avatar" aria-hidden="true">' +
          (entry.role === "user" ? "👤" : "🤖") +
        '</span>' +
        '<span class="convo-preview__text">' + escHTMLSQ(entry.text) + '</span>';
      preview.appendChild(el);
    });
  }

  /* Wire up sidebar Cosmo clear button */
  const sidebarCosmoClear = $("sidebar-cosmo-clear");
  if (sidebarCosmoClear) {
    sidebarCosmoClear.addEventListener("click", () => {
      if (typeof StarQuestAI !== "undefined") StarQuestAI.clearHistory();
      /* Also clear the AI panel messages so it restarts cleanly */
      const aiMessages = $("ai-messages");
      if (aiMessages) aiMessages.innerHTML = "";
      renderConvoHistory();
    });
  }

  /* Wire up "Continue Chat" button */
  const sidebarContinueChat = $("sidebar-continue-chat");
  if (sidebarContinueChat) {
    sidebarContinueChat.addEventListener("click", () => {
      closeSidebar();
      openAIPanel();
    });
  }

  /* ─────────────────────────────────────────────────────────────
     PLAYER: TOKEN EARNING & HISTORY TRACKING
     We patch the player open/close via a custom event from the
     first IIFE, and watch via an interval timer.
     ──────────────────────────────────────────────────────────── */
  let _watchTimer = null;
  let _watchTracker = null;

  /* Listen for play-episode event (from history list items) */
  document.addEventListener("starquest:play-episode", (e) => {
    openPlayerExternal(e.detail.ep, e.detail.showTitle);
  });

  function openPlayerExternal(ep, showTitle) {
    /* Delegate to the existing player logic in the first IIFE */
    const playerPage  = $("player-page");
    const playerFrame = $("player-frame");
    const playerVideo = $("player-video");
    const playerError = $("player-error");
    const playerErrorLink = $("player-error-link");
    const playerTitle = $("player-ep-title");
    const playerLoad  = $("player-loading");
    if (!playerFrame || !playerPage) return;
    if (!isEpisodePlayableSQ(ep)) {
      showTokenToast("This content is currently unavailable.");
      return;
    }

    _currentEpisode  = ep;
    _currentShowTitle = showTitle;

    const isSpecial = ep.season === 0;
    const seasonLabel = isSpecial ? "Movie" : "S" + ep.season + "E" + ep.episode;
    if (playerTitle) playerTitle.textContent = showTitle + " — " + seasonLabel + ": " + ep.title;

    playerPage.classList.add("open");
    if (playerLoad) playerLoad.style.display = "flex";
    if (playerError) playerError.style.display = "none";
    document.body.style.overflow = "hidden";

    if (typeof ep.archiveFile === "string" && ep.archiveId) {
      /* Use direct <video> element with archive.org download URL */
      const directUrl = "https://archive.org/download/" +
        encodeURIComponent(ep.archiveId) + "/" +
        ep.archiveFile.split("/").map(encodeURIComponent).join("/");

      playerFrame.style.display = "none";
      playerFrame.src = "about:blank";
      if (playerVideo) {
        playerVideo.style.display = "block";
        /* Register handlers before assigning src — same reason as openPlayer above */
        playerVideo.oncanplay = () => { if (playerLoad) playerLoad.style.display = "none"; };
        playerVideo.onerror = () => {
          if (playerLoad) playerLoad.style.display = "none";
          playerVideo.style.display = "none";
          if (playerError) playerError.style.display = "flex";
          if (playerErrorLink) playerErrorLink.href = "https://archive.org/details/" + encodeURIComponent(ep.archiveId);
        };
        playerVideo.src = directUrl;
      }
    } else if (ep.youtubeId) {
      const show = findShowForEpisode(ep);
      const resumeId = show ? buildEpisodeId(ep, show) : "";
      const savedPosition = resumeId && typeof StarQuestAuth !== "undefined"
        ? StarQuestAuth.getWatchPosition(resumeId)
        : 0;
      const url = buildPlayerUrl(ep, savedPosition);
      if (playerVideo) {
        playerVideo.oncanplay = null;
        playerVideo.onerror = null;
        playerVideo.style.display = "none";
        playerVideo.removeAttribute("src");
        playerVideo.load();
      }
      playerFrame.style.display = "block";
      playerFrame.src = url;
      playerFrame.addEventListener("load", () => { if (playerLoad) playerLoad.style.display = "none"; }, { once: true });
    } else {
      if (playerVideo) {
        playerVideo.oncanplay = null;
        playerVideo.onerror = null;
        playerVideo.style.display = "none";
        playerVideo.removeAttribute("src");
        playerVideo.load();
      }
      playerFrame.style.display = "block";
      const show = findShowForEpisode(ep);
      const resumeId = show ? buildEpisodeId(ep, show) : "";
      const savedPosition = resumeId && typeof StarQuestAuth !== "undefined"
        ? StarQuestAuth.getWatchPosition(resumeId)
        : 0;
      playerFrame.src = buildPlayerUrl(ep, savedPosition);
      if (playerLoad) playerLoad.style.display = "none";
      playerFrame.addEventListener("load", () => {
        if (playerLoad) playerLoad.style.display = "none";
      }, { once: true });
    }

    startWatchTimer(ep, showTitle);
    addToHistoryNow(ep, showTitle);
  }

  function buildPlayerUrl(episode, startSeconds) {
    const resumeAt = Math.max(0, Math.trunc(Number(startSeconds) || 0));
    if (episode.youtubeId) {
      const params = new URLSearchParams({ autoplay: "1" });
      if (resumeAt > 5) params.set("start", String(resumeAt));
      return "https://www.youtube.com/embed/" + encodeURIComponent(episode.youtubeId) + "?" + params.toString();
    }
    const base = "https://archive.org/embed/" + encodeURIComponent(episode.archiveId);
    const params = new URLSearchParams({ autoplay: "1" });
    if (typeof episode.archiveIndex === "number" && !episode.archiveFile) {
      params.set("index", String(episode.archiveIndex));
    }
    if (episode.title) params.set("playtext", episode.title);
    if (resumeAt > 5) params.set("start", String(resumeAt));
    return base + "?" + params.toString();
  }

  function isEpisodePlayableSQ(ep) {
    if (!ep || typeof ep !== "object") return false;
    if (ep.sourceStatus === "restricted" || ep.sourceStatus === "file-missing" || ep.sourceStatus === "unverified") return false;
    if (ep.youtubeId) return true;
    if (typeof ep.archiveFile === "string" && ep.archiveId) return /\.(mp4|m4v|webm|ogv|ogg|mov)$/i.test(ep.archiveFile);
    // Item-only Archive.org records are resolved from metadata at playback time.
    return !!ep.archiveId;
  }

  /* Intercept player back button to stop timer */
  const playerBackBtn = $("player-back");
  if (playerBackBtn) {
    playerBackBtn.addEventListener("click", () => {
      stopWatchTimer();
    }, { capture: true });
  }

  /* Intercept every card click to start tracking */
  document.addEventListener("starquest:episode-opened", (e) => {
    _currentEpisode   = e.detail.ep;
    _currentShowTitle = e.detail.showTitle;
    startWatchTimer(e.detail.ep, e.detail.showTitle);
  });

  document.addEventListener("starquest:archive-direct-playback", (event) => {
    if (!_watchTracker) return;
    const playerVideo = $("player-video");
    _watchTracker.usesEmbeddedPlayer = false;
    _watchTracker.lastTime = Math.max(
      0,
      Number(event.detail && event.detail.startSeconds) ||
        Number(playerVideo && playerVideo.currentTime) ||
        _watchTracker.positionSeconds || 0
    );
    _watchTracker.lastTickAt = Date.now();
  });

  /* Patch existing openPlayer from first IIFE by decorating the player open logic */
  (function patchPlayer() {
    const playerPage = $("player-page");
    if (!playerPage) return;

    /* Use a MutationObserver to detect when the player opens/closes */
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === "attributes" && m.attributeName === "class") {
          const isOpen = playerPage.classList.contains("open");
          if (isOpen) {
            /* Grab current episode from the first IIFE's state via the player title */
            const titleEl = $("player-ep-title");
            /* Start timer — episode will be set shortly */
            setTimeout(() => { if (!_watchTracker) startWatchTimerFromCurrent(); }, 300);
          } else {
            stopWatchTimer();
          }
        }
      });
    });
    observer.observe(playerPage, { attributes: true });
  })();

  function startWatchTimerFromCurrent() {
    /* Try to infer current episode from title text and SHOWS data */
    if (typeof SHOWS === "undefined") return;
    const titleEl = $("player-ep-title");
    if (!titleEl) return;
    const titleText = titleEl.textContent;
    /* Find show by matching title prefix */
    for (const show of SHOWS) {
      if (titleText.startsWith(show.title + " — ")) {
        /* Find episode */
        const epPart = titleText.slice((show.title + " — ").length);
        const ep = show.episodes && show.episodes.find((e) => {
          const lbl = e.season === 0 ? "Movie: " : "S" + e.season + "E" + e.episode + ": ";
          return epPart.startsWith(lbl) || epPart.includes(e.title);
        });
        if (ep) {
          _currentEpisode   = ep;
          _currentShowTitle = show.title;
          startWatchTimer(ep, show.title);
          addToHistoryNow(ep, show.title);
          return;
        }
        /* If no specific ep found, still track */
        break;
      }
    }
  }

  function startWatchTimer(ep, showTitle) {
    stopWatchTimer();
    if (typeof StarQuestAuth === "undefined") return;
    if (!ep) return;
    const show = findShowForEpisode(ep);
    const episodeId = show ? (show.id + "|S" + ep.season + "E" + ep.episode) : (showTitle + "|" + ep.id);
    const playerVideo = $("player-video");
    if (!playerVideo) return;
    const existingHistory = StarQuestAuth.getHistory().find((item) => item.episodeId === episodeId);
    const savedPosition = Math.max(0, Number(StarQuestAuth.getWatchPosition(episodeId)) || 0);
    const usesEmbeddedPlayer = !!ep.youtubeId || !(typeof ep.archiveFile === "string" && ep.archiveId);
    const declaredDuration = Math.max(0, Math.trunc((Number(ep.duration) || parseInt(String(ep.duration || "0"), 10)) * 60));

    _watchTracker = {
      episodeId,
      usesEmbeddedPlayer,
      lastTickAt: Date.now(),
      lastTime: Number(playerVideo.currentTime) || savedPosition,
      positionSeconds: savedPosition,
      seeking: false,
      duration: Math.max(declaredDuration, Math.trunc(Number(playerVideo.duration) || 0)),
      showId: show ? show.id : "",
      showTitle: showTitle || (show && show.title) || "Unknown Show",
      epTitle: ep.title || "Episode",
      genre: show && show.genre ? show.genre[0] : "",
      decade: show ? (Math.floor(parseInt(String(show.years || "").split("–")[0], 10) / 10) * 10 + "s") : "",
      tags: show && show.genre ? show.genre.slice(0, 4) : [],
      thumbnail: ep.thumbnail || (show && show.thumbnail) || "",
      archiveId: ep.archiveId || "",
      distributorAccount: show && show.distributorAccount ? show.distributorAccount : "",
      watchedSeconds: Math.max(0, Number(existingHistory && existingHistory.watchedSeconds) || 0),
      pendingPersistSeconds: 0,
    };

    playerVideo.onseeking = () => { if (_watchTracker) _watchTracker.seeking = true; };
    playerVideo.onseeked = () => {
      if (_watchTracker) {
        _watchTracker.seeking = false;
        _watchTracker.lastTime = Number(playerVideo.currentTime) || _watchTracker.lastTime;
      }
    };

    _watchTimer = setInterval(() => {
      if (!_watchTracker) return;
      if (document.visibilityState !== "visible") return;
      if (_watchTracker.seeking) return;
      const tickAt = Date.now();
      let nowTime;
      let delta;
      if (_watchTracker.usesEmbeddedPlayer) {
        delta = Math.min(2, Math.max(0, (tickAt - _watchTracker.lastTickAt) / 1000));
        nowTime = _watchTracker.positionSeconds + delta;
        if (_watchTracker.duration > 0) nowTime = Math.min(nowTime, _watchTracker.duration);
      } else {
        if (playerVideo.paused || playerVideo.ended) return;
        const rate = Number(playerVideo.playbackRate) || 1;
        if (rate < 0.75 || rate > 1.25) return;
        nowTime = Number(playerVideo.currentTime) || 0;
        delta = nowTime - _watchTracker.lastTime;
        _watchTracker.lastTime = nowTime;
      }
      _watchTracker.lastTickAt = tickAt;
      if (!Number.isFinite(delta) || delta <= 0 || delta > 2) return;

      _watchTracker.watchedSeconds += delta;
      _watchTracker.positionSeconds = nowTime;
      _watchTracker.duration = Math.max(_watchTracker.duration, Math.trunc(Number(playerVideo.duration) || 0));
      _watchTracker.pendingPersistSeconds += delta;

      // Keep the one-second counter in memory, but commit history/resume data
      // in a single transaction every ten seconds. The old four localStorage
      // writes per second caused visible playback stalls on Android.
      if (_watchTracker.pendingPersistSeconds >= WATCH_PERSIST_INTERVAL_SECONDS) {
        persistWatchTracker(playerVideo);
      }
    }, 1000);
  }

  function persistWatchTracker(playerVideo) {
    if (!_watchTracker || typeof StarQuestAuth === "undefined") return;
    const pendingSeconds = Math.max(0, Number(_watchTracker.pendingPersistSeconds) || 0);
    if (pendingSeconds <= 0) return;
    const position = Math.max(0, Number(playerVideo && playerVideo.currentTime) || _watchTracker.positionSeconds || 0);
    const duration = Math.max(_watchTracker.duration || 0, Math.trunc(Number(playerVideo && playerVideo.duration) || 0));
    _watchTracker.pendingPersistSeconds = 0;

    const watchResult = StarQuestAuth.recordWatchProgress(_watchTracker.episodeId, pendingSeconds, {
      episodeId: _watchTracker.episodeId,
      positionSeconds: Math.floor(position),
      watchedSeconds: Math.floor(_watchTracker.watchedSeconds),
      duration,
    });
    if (!watchResult || !watchResult.ok) {
      _watchTracker.pendingPersistSeconds += pendingSeconds;
      return;
    }

    const distributorResult = window.AINScansDistributorLedger
      ? window.AINScansDistributorLedger.recordEligibleWatch(_watchTracker.episodeId, pendingSeconds, {
        archiveId: _watchTracker.archiveId,
        distributorAccount: _watchTracker.distributorAccount,
      })
      : null;
    if (distributorResult && distributorResult.produced > 0) {
      showTokenToast("⭐ " + distributorResult.produced + " distributor StarCoin produced by verified watch-time.");
    }
  }

  function stopWatchTimer() {
    if (_watchTimer) clearInterval(_watchTimer);
    _watchTimer = null;
    const playerVideo = $("player-video");
    if (_watchTracker && playerVideo && typeof StarQuestAuth !== "undefined") {
      persistWatchTracker(playerVideo);
    }
    _watchTracker = null;
  }

  function addToHistoryNow(ep, showTitle) {
    if (typeof StarQuestAuth === "undefined") return;
    if (!ep) return;
    const show = findShowForEpisode(ep);
    const showId = (show && show.id) ? show.id : "unknown";
    const episodeId = showId + "|S" + ep.season + "E" + ep.episode;
    const startYear = parseInt(String((show && show.years) || "").split("–")[0], 10);
    const decade = Number.isFinite(startYear) ? (Math.floor(startYear / 10) * 10 + "s") : "";
    const duration = Math.max(0, Math.trunc((Number(ep.duration) || parseInt(String(ep.duration || "0"), 10)) * 60));
    const existingHistory = StarQuestAuth.getHistory().find((item) => item.episodeId === episodeId);
    StarQuestAuth.addToHistory({
      episodeId,
      showId,
      showTitle,
      epTitle: ep.title,
      thumbnail: ep.thumbnail,
      genre: show && show.genre ? show.genre[0] : "",
      decade,
      tags: show && Array.isArray(show.genre) ? show.genre.slice(0, 4) : [],
      watchedSeconds: Math.max(0, Number(existingHistory && existingHistory.watchedSeconds) || 0),
      positionSeconds: Math.max(0, StarQuestAuth.getWatchPosition(episodeId)),
      duration,
      completionRate: 0,
      startedAt: Date.now(),
      lastWatchedAt: Date.now(),
      completed: false,
      playCount: 1,
    });
  }

  function findShowForEpisode(ep) {
    if (typeof SHOWS === "undefined" || !ep) return null;
    return SHOWS.find((show) => Array.isArray(show.episodes) && show.episodes.some((candidate) => {
      if (candidate === ep) return true;
      if (candidate.id && ep.id) return candidate.id === ep.id;
      if (candidate.src && ep.src) return candidate.src === ep.src;
      return candidate.title === ep.title
        && Number(candidate.season) === Number(ep.season)
        && Number(candidate.episode) === Number(ep.episode);
    })) || null;
  }

  function showPlayerTokenNotif() {
    const notif = $("player-token-notif");
    if (!notif) return;
    notif.style.display = "";
    setTimeout(() => { notif.style.display = "none"; }, 3000);
  }

  /* ─────────────────────────────────────────────────────────────
     SHARE BUTTON
     ──────────────────────────────────────────────────────────── */
  const shareBtn = $("player-share-btn");
  const shareBackdrop = $("share-backdrop");
  const shareSheetClose = $("share-sheet-close");
  const shareSheetProgram = $("share-sheet-program");
  const shareSheetStatus = $("share-sheet-status");
  const shareNativeBtn = $("share-native-btn");
  const shareTwitterLink = $("share-twitter-link");
  const shareSmsLink = $("share-sms-link");
  const shareEmailLink = $("share-email-link");
  const shareCopyBtn = $("share-copy-btn");
  let activeShare = null;
  let shareInFlight = false;

  function currentSharePayload() {
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.delete("deploy");
    const shareShow = _currentEpisode ? findShowForEpisode(_currentEpisode) : null;
    if (shareShow && _currentEpisode) {
      shareUrl.searchParams.set("sqShow", shareShow.id);
      shareUrl.searchParams.set("sqEpisode", _currentEpisode.id || "");
      shareUrl.hash = "watch";
    }
    const showTitle = _currentShowTitle || "StarQuest";
    const episodeTitle = (_currentEpisode && _currentEpisode.title) || "";
    const text = episodeTitle
      ? "Watch " + showTitle + " — " + episodeTitle + " on StarQuest ⭐"
      : "Watch " + showTitle + " on StarQuest ⭐";
    return {
      attemptId: "share-attempt-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9),
      title: showTitle + " on StarQuest",
      text,
      url: shareUrl.toString(),
      contentId: (_currentEpisode && shareShow)
        ? (shareShow.id + "|" + (_currentEpisode.id || _currentEpisode.title || "episode"))
        : "unknown-content",
      show: shareShow,
      episode: _currentEpisode
    };
  }

  function setShareStatus(message) {
    if (shareSheetStatus) shareSheetStatus.textContent = message;
  }

  function closeShareSheet() {
    if (!shareBackdrop) return;
    shareBackdrop.hidden = true;
    shareBackdrop.classList.remove("open");
    document.body.classList.remove("share-open");
  }

  function openShareSheet() {
    activeShare = currentSharePayload();
    if (shareSheetProgram) shareSheetProgram.textContent = activeShare.text;
    if (shareSmsLink) shareSmsLink.href = "sms:?body=" + encodeURIComponent(activeShare.text + "\n" + activeShare.url);
    if (shareEmailLink) {
      shareEmailLink.href = "mailto:?subject=" + encodeURIComponent(activeShare.title) +
        "&body=" + encodeURIComponent(activeShare.text + "\n\n" + activeShare.url);
    }
    if (shareTwitterLink) {
      shareTwitterLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(activeShare.text) +
        "&url=" + encodeURIComponent(activeShare.url);
    }
    if (shareNativeBtn) {
      shareNativeBtn.hidden = false;
      shareNativeBtn.disabled = false;
      shareNativeBtn.textContent = typeof navigator.share === "function"
        ? "📱 Share with phone"
        : "🔗 Copy share link";
    }
    setShareStatus("Choose how you want to share it.");
    if (shareBackdrop) {
      shareBackdrop.hidden = false;
      shareBackdrop.classList.add("open");
      document.body.classList.add("share-open");
      setTimeout(() => {
        const firstAction = shareNativeBtn && !shareNativeBtn.hidden ? shareNativeBtn : shareCopyBtn;
        if (firstAction) firstAction.focus();
      }, 0);
    }
  }

  function activeShareWasFullyWatched() {
    if (!activeShare || !activeShare.episode || !activeShare.show) return false;
    if (typeof StarQuestAuth === "undefined") return false;
    const episode = activeShare.episode;
    const show = activeShare.show;
    const episodeId = show.id + "|S" + episode.season + "E" + episode.episode;
    const watched = StarQuestAuth.getHistory().find((item) => item.episodeId === episodeId);
    return !!(watched && (watched.completed || Number(watched.completionRate) >= 0.98));
  }

  function shareAttribution(show, episode) {
    const actors = [];
    const rawActors = episode && (episode.actors || episode.cast);
    if (Array.isArray(rawActors)) {
      rawActors.forEach((actor) => {
        const name = typeof actor === "string" ? actor : actor && actor.name;
        if (name && !actors.includes(name)) actors.push(name);
      });
    }
    return {
      companyId: (show && (show.companyId || show.distributorAccount || show.network || show.studio))
        || (show && show.id ? "unclaimed:" + show.id : "unclaimed:unknown-content"),
      actors,
      attributionStatus: actors.length ? "recorded_client_side" : "actor_credits_pending",
    };
  }

  function rewardCompletedShare(method, confirmedAction) {
    if (!activeShare) return;
    if (typeof StarQuestAuth === "undefined") return;
    const show = activeShare.show;
    const episode = activeShare.episode;
    const attribution = shareAttribution(show, episode);
    const fullyWatched = activeShareWasFullyWatched();
    const confirmed = confirmedAction === true;
    const shareResult = StarQuestAuth.recordShare(activeShare.contentId, {
      verified: confirmed,
      confirmed,
      attemptId: activeShare.attemptId,
      fullyWatched,
      status: confirmed ? "client_confirmed" : "pending_verification",
      method,
      url: activeShare.url,
      showTitle: _currentShowTitle || "",
      episodeId: (episode && (episode.id || episode.title)) || "",
      companyId: attribution.companyId,
      actors: attribution.actors,
      attributionStatus: attribution.attributionStatus,
    });
    if (!shareResult.ok) {
      setShareStatus(
        shareResult.error === "duplicate_share_attempt"
          ? "This share action was already counted. Open Share again for another completed share."
          : (shareResult.message || "Shared, but progress could not be saved.")
      );
      return;
    }
    if (!shareResult.credited) {
      setShareStatus("The share action could not be confirmed, so the wallet counter was not changed.");
      return;
    }
    if (shareResult.awarded > 0) {
      setShareStatus("⭐ StarCoin created: the 10th confirmed share action was reached.");
    } else {
      const remaining = shareResult.sharesPerCoin - shareResult.progressToNextCoin;
      setShareStatus("Share completed. " + remaining + (remaining === 1 ? " share" : " shares") + " until the next StarCoin.");
    }
  }


  function recordUnverifiedShare(method) {
    if (!activeShare) activeShare = currentSharePayload();
    if (typeof StarQuestAuth === "undefined") return null;
    const show = activeShare.show;
    const episode = activeShare.episode;
    const attribution = shareAttribution(show, episode);
    return StarQuestAuth.recordShare(activeShare.contentId, {
      verified: false,
      confirmed: false,
      attemptId: activeShare.attemptId,
      fullyWatched: activeShareWasFullyWatched(),
      status: "client_handoff_unverified",
      method,
      url: activeShare.url,
      showTitle: _currentShowTitle || "",
      episodeId: (episode && (episode.id || episode.title)) || "",
      companyId: attribution.companyId,
      actors: attribution.actors,
      attributionStatus: attribution.attributionStatus,
    });
  }

  async function copyActiveShare() {
    if (!activeShare) activeShare = currentSharePayload();
    const copyText = activeShare.text + "\n" + activeShare.url;
    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard_unavailable");
      await navigator.clipboard.writeText(copyText);
      rewardCompletedShare("copy_link", true);
      setShareStatus("Episode link copied. This share is committed to your 1/10 StarCoin ledger.");
      return true;
    } catch (_) {
      const field = document.createElement("textarea");
      field.value = copyText;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      field.setSelectionRange(0, field.value.length);
      let copied = false;
      try {
        copied = typeof document.execCommand === "function" && document.execCommand("copy");
      } catch (_) {
        copied = false;
      }
      field.remove();
      if (copied) {
        rewardCompletedShare("copy_link", true);
        setShareStatus("Episode link copied. This share is committed to your 1/10 StarCoin ledger.");
        return true;
      }
      window.prompt("Copy this StarQuest link:", copyText);
      setShareStatus("Select and copy the link, then paste it into a message.");
      return false;
    }
  }

  if (shareBtn) shareBtn.addEventListener("click", openShareSheet);
  if (shareSheetClose) shareSheetClose.addEventListener("click", closeShareSheet);
  if (shareBackdrop) shareBackdrop.addEventListener("click", (event) => {
    if (event.target === shareBackdrop) closeShareSheet();
  });
  if (shareCopyBtn) shareCopyBtn.addEventListener("click", copyActiveShare);
  if (shareTwitterLink) shareTwitterLink.addEventListener("click", () => {
    rewardCompletedShare("twitter_intent", true);
  });
  if (shareSmsLink) shareSmsLink.addEventListener("click", () => {
    rewardCompletedShare("sms_handoff", true);
    setShareStatus("Text composer opened. This share is committed to your 1/10 StarCoin ledger.");
  });
  if (shareEmailLink) shareEmailLink.addEventListener("click", () => {
    rewardCompletedShare("email_handoff", true);
    setShareStatus("Email composer opened. This share is committed to your 1/10 StarCoin ledger.");
  });
  if (shareNativeBtn) shareNativeBtn.addEventListener("click", async () => {
    if (shareInFlight) return;
    if (!activeShare) activeShare = currentSharePayload();
    shareInFlight = true;
    shareNativeBtn.disabled = true;
    shareNativeBtn.textContent = "Opening phone share…";
    setShareStatus("Opening your phone's share choices…");
    try {
      if (typeof navigator.share !== "function") {
        await copyActiveShare();
        return;
      }
      // Android may suspend or navigate away from this page while its native
      // chooser is open, so code after await navigator.share() is not a
      // reliable place to commit the receipt. Opening the chooser is the
      // confirmed client handoff; the attempt ID prevents double credit.
      rewardCompletedShare("web_share_api", true);
      await navigator.share({ title: activeShare.title, text: activeShare.text, url: activeShare.url });
    } catch (error) {
      if (error && error.name === "AbortError") {
        setShareStatus("Phone share opened and the 1/10 receipt was committed. Choose another option when ready.");
      } else {
        setShareStatus("Phone sharing was unavailable. Use Text, Email, or Copy Link below.");
      }
    } finally {
      shareInFlight = false;
      shareNativeBtn.disabled = false;
      shareNativeBtn.textContent = typeof navigator.share === "function"
        ? "📱 Share with phone"
        : "🔗 Copy share link";
    }
  });

  if (window.StarQuestShareSafetyNet && typeof window.StarQuestShareSafetyNet.markAppReady === "function") {
    window.StarQuestShareSafetyNet.markAppReady();
  } else {
    window.StarQuestShareAppReady = true;
  }

  /* ─────────────────────────────────────────────────────────────
     TOKEN TOAST
     ──────────────────────────────────────────────────────────── */
  function showTokenToast(msg) {
    const existing = document.querySelector(".token-toast");
    if (existing) existing.remove();
    const toast = document.createElement("div");
    toast.className = "token-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 3000);
  }
  document.addEventListener("starquest:toast", (e) => {
    if (!e.detail || !e.detail.message) return;
    showTokenToast(e.detail.message);
  });

  /* ─────────────────────────────────────────────────────────────
     AI COMPANION — COSMO
     ──────────────────────────────────────────────────────────── */
  const aiFab         = $("ai-fab");
  const aiPanel       = $("ai-panel");
  const aiPanelClose  = $("ai-panel-close");
  const aiMessages    = $("ai-messages");
  const aiInput       = $("ai-input");
  const aiSend        = $("ai-send");
  const aiVoice       = $("ai-voice");
  const cosmoControlsBtn = $("cosmo-controls-btn");
  const cosmoControls = $("cosmo-controls");
  const cosmoStartGemma = $("cosmo-start-gemma");
  const cosmoEngineStatus = $("cosmo-engine-status");
  const cosmoCatalogStatus = $("cosmo-catalog-status");
  const cosmoWatchalongToggle = $("cosmo-watchalong-toggle");
  const cosmoSponsorsToggle = $("cosmo-sponsors-toggle");
  const cosmoSpeakToggle = $("cosmo-speak-toggle");
  const cosmoHandsFreeToggle = $("cosmo-handsfree-toggle");
  const cosmoShoppingList = $("cosmo-shopping-list");
  const cosmoClearList = $("cosmo-clear-list");
  const cosmoClearInterests = $("cosmo-clear-interests");
  const sidebarCosmoBtn = $("sidebar-cosmo-btn");
  const sidebarAIBadge  = $("sidebar-ai-badge");

  function handsFreeVoiceEnabled() {
    return !!(window.StarQuestCosmoLive && StarQuestCosmoLive.getSettings().handsFreeVoice);
  }

  document.addEventListener("starquest:ai-ready", () => {
    /* Show AI badge in the panel header */
    const subtitle = $("ai-panel-subtitle") || document.querySelector(".ai-panel__subtitle");
    if (subtitle) subtitle.textContent = "Movie-aware · voice ready · viewer controlled";
    if (sidebarAIBadge) sidebarAIBadge.style.display = "";
  });
  document.addEventListener("starquest:cosmo-provider", (event) => {
    if (!cosmoEngineStatus) return;
    const detail = event.detail || {};
    if (detail.message) cosmoEngineStatus.textContent = detail.message;
  });

  function renderCatalogLedgerStatus(summary) {
    if (!cosmoCatalogStatus || !summary) return;
    cosmoCatalogStatus.textContent = summary.titlesLedgered + "/" + summary.titles +
      " titles ledgered · " + summary.analyzed + " analyzed · " +
      summary.provisionalInfinityAccrued + " provisional scan accruals · " +
      summary.contractsRecorded + " contracts recorded · " + summary.payoutsCompleted + " settled";
  }
  document.addEventListener("starquest:catalog-ledger-ready", (event) => renderCatalogLedgerStatus(event.detail));
  if (window.StarQuestCatalogLedger) renderCatalogLedgerStatus(StarQuestCatalogLedger.summary());

  const cosmoControlRouter = window.StarQuestControls && window.StarQuestControls.cosmoRouted;
  if (aiFab && !cosmoControlRouter) aiFab.addEventListener("click", toggleAIPanel);
  if (aiPanelClose && !cosmoControlRouter) aiPanelClose.addEventListener("click", closeAIPanel);
  if (sidebarCosmoBtn && !cosmoControlRouter) sidebarCosmoBtn.addEventListener("click", () => {
      closeSidebar();
      openAIPanel();
    });
  if (cosmoControlRouter) {
    document.addEventListener("starquest:cosmo-opened", openAIPanel);
    document.addEventListener("starquest:cosmo-closed", closeAIPanel);
  }

  function toggleAIPanel() {
    if (!aiPanel) return;
    const isOpen = aiPanel.style.display !== "none";
    if (isOpen) {
      closeAIPanel();
    } else {
      openAIPanel();
    }
  }

  function openAIPanel() {
    if (!aiPanel) return;
    aiPanel.style.display = "flex";
    aiPanel.style.flexDirection = "column";
    aiPanel.setAttribute("aria-hidden", "false");
    if (aiFab) aiFab.setAttribute("aria-expanded", "true");
    document.body.classList.add("cosmo-open");
    if (cosmoEngineStatus && window.StarQuestAI && StarQuestAI.providerStatus) {
      const provider = StarQuestAI.providerStatus();
      if (provider.message) cosmoEngineStatus.textContent = provider.message;
    }
    /* Opening Cosmo must never wait on a model or network request. */
    if (aiMessages && aiMessages.children.length === 0) {
      appendAIMessage("bot", "Hi! I'm Cosmo, StarQuest's living companion. Ask me about a show, what to watch, your StarCoins, or anything playing now.");
    }
    if (aiInput) aiInput.focus();
  }

  function closeAIPanel() {
    if (aiPanel) {
      aiPanel.style.display = "none";
      aiPanel.setAttribute("aria-hidden", "true");
    }
    if (aiFab) aiFab.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cosmo-open");
  }

  function appendAIMessage(role, text) {
    if (!aiMessages) return;
    const msg = document.createElement("div");
    msg.className = "ai-msg ai-msg--" + role;
    const escaped = escHTMLSQ(text);
    const linked = escaped.replace(/(https:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">Open link ↗</a>');
    msg.innerHTML = `
      <div class="ai-msg__avatar">${role === "bot" ? "🤖" : "👤"}</div>
      <div class="ai-msg__bubble">${linked}</div>
    `;
    if (/^Sponsored suggestion:/i.test(String(text))) msg.classList.add("ai-msg--sponsored");
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    /* Keep sidebar preview in sync if sidebar is open */
    if (sidebar && sidebar.classList.contains("open")) renderConvoHistory();
    if (role === "bot" && window.StarQuestCosmoLive) StarQuestCosmoLive.speak(text);
  }

  async function sendAIMessage() {
    if (!aiInput) return;
    const text = aiInput.value.trim();
    if (!text) return;
    appendAIMessage("user", text);
    aiInput.value = "";
    /* Typing indicator stays until AI responds */
    const typingEl = document.createElement("div");
    typingEl.className = "ai-msg ai-msg--bot";
    typingEl.innerHTML = '<div class="ai-msg__avatar">🤖</div><div class="ai-msg__bubble ai-typing">…</div>';
    if (aiMessages) { aiMessages.appendChild(typingEl); aiMessages.scrollTop = aiMessages.scrollHeight; }
    if (aiSend) aiSend.disabled = true;
    try {
      /* Minimum visual delay + wait for AI response. */
      const [response] = await Promise.all([
        (typeof StarQuestAI !== "undefined")
          ? StarQuestAI.chat(text)
          : Promise.resolve("Cosmo's chat engine did not load. Refresh StarQuest and try once more."),
        new Promise((r) => setTimeout(r, 500)),
      ]);
      appendAIMessage("bot", String(response || "I couldn't form a reply, but the chat is still active. Please try that once more."));
    } catch (error) {
      appendAIMessage("bot", "I hit a temporary AI connection problem, but I didn't freeze. Please send that again while I switch to my backup.");
      console.warn("Cosmo chat recovered from a provider failure", error);
    } finally {
      typingEl.remove();
      if (aiSend) aiSend.disabled = false;
      if (aiInput) aiInput.focus();
    }
  }

  if (aiSend) aiSend.addEventListener("click", sendAIMessage);
  if (aiInput) aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); sendAIMessage(); }
  });
  if (window.StarQuestControls) window.StarQuestControls.cosmoChatRouted = true;

  /* Suggestion chips */
  document.querySelectorAll(".ai-suggest").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (!aiInput) return;
      aiInput.value = chip.dataset.q || chip.textContent;
      openAIPanel();
      sendAIMessage();
    });
  });

  function renderCosmoShopping() {
    if (!cosmoShoppingList || !window.StarQuestCosmoLive) return;
    const items = StarQuestCosmoLive.getShoppingList();
    cosmoShoppingList.innerHTML = items.length
      ? items.map((item) => "<li>" + escHTMLSQ(item.name) + "</li>").join("")
      : "<li>Nothing added yet.</li>";
  }

  function syncCosmoControls() {
    if (!window.StarQuestCosmoLive) return;
    const settings = StarQuestCosmoLive.getSettings();
    if (cosmoWatchalongToggle) cosmoWatchalongToggle.checked = !!settings.watchAlong;
    if (cosmoSponsorsToggle) cosmoSponsorsToggle.checked = !!settings.sponsoredSuggestions;
    if (cosmoSpeakToggle) cosmoSpeakToggle.checked = !!settings.speakReplies;
    if (cosmoHandsFreeToggle) cosmoHandsFreeToggle.checked = !!settings.handsFreeVoice;
    renderCosmoShopping();
  }

  if (cosmoControlsBtn && cosmoControls && !cosmoControlRouter) cosmoControlsBtn.addEventListener("click", () => {
    const opening = cosmoControls.hidden;
    cosmoControls.hidden = !opening;
    cosmoControlsBtn.setAttribute("aria-expanded", String(opening));
    if (opening) syncCosmoControls();
  });
  if (cosmoWatchalongToggle) cosmoWatchalongToggle.addEventListener("change", () => StarQuestCosmoLive.updateSettings({ watchAlong: cosmoWatchalongToggle.checked }));
  if (cosmoSponsorsToggle) cosmoSponsorsToggle.addEventListener("change", () => StarQuestCosmoLive.updateSettings({ sponsoredSuggestions: cosmoSponsorsToggle.checked }));
  if (cosmoSpeakToggle) cosmoSpeakToggle.addEventListener("change", () => StarQuestCosmoLive.updateSettings({ speakReplies: cosmoSpeakToggle.checked }));
  if (cosmoClearList) cosmoClearList.addEventListener("click", () => StarQuestCosmoLive.clearShoppingList());
  if (cosmoClearInterests) cosmoClearInterests.addEventListener("click", () => {
    if (window.StarQuestCosmoContext) StarQuestCosmoContext.clear();
    document.dispatchEvent(new CustomEvent("starquest:toast", { detail: { message: "Cosmo's learned interests were cleared." } }));
  });
  document.addEventListener("starquest:shopping-updated", renderCosmoShopping);

  let voiceRecognition = null;

  function setVoiceStatus(state, detail) {
    if (aiVoice) {
      const listening = ["listening", "awake", "command", "restarting"].includes(state);
      aiVoice.classList.toggle("is-listening", listening);
      aiVoice.setAttribute("aria-label", listening ? "Cosmo hands-free listening is active" : "Start hands-free Cosmo");
    }
    if (!cosmoEngineStatus) return;
    if (state === "listening") cosmoEngineStatus.textContent = "Hands-free ready · say “Cosmo” and your question";
    if (state === "awake") cosmoEngineStatus.textContent = "Cosmo is listening · say what you need";
    if (state === "command") cosmoEngineStatus.textContent = "Cosmo heard: " + detail;
    if (state === "restarting") cosmoEngineStatus.textContent = "Cosmo is reopening his microphone…";
  }

  async function submitVoiceCommand(command) {
    const text = String(command || "").trim();
    if (!text || !aiInput) return;
    openAIPanel();
    aiInput.value = text;
    await sendAIMessage();
  }

  function startHandsFreeVoice() {
    if (!voiceRecognition) return false;
    StarQuestCosmoLive.updateSettings({ handsFreeVoice: true, speakReplies: true });
    syncCosmoControls();
    voiceRecognition.start();
    return true;
  }

  function stopHandsFreeVoice() {
    if (voiceRecognition) voiceRecognition.stop();
    if (window.StarQuestCosmoLive) StarQuestCosmoLive.updateSettings({ handsFreeVoice: false });
    syncCosmoControls();
  }

  if (aiVoice && window.StarQuestCosmoLive) {
    voiceRecognition = StarQuestCosmoLive.createHandsFreeRecognition(submitVoiceCommand, (voiceState, detail) => {
      setVoiceStatus(voiceState, detail);
      if (voiceState === "error" && ["not-allowed", "service-not-allowed"].includes(detail)) {
        StarQuestCosmoLive.updateSettings({ handsFreeVoice: false });
        syncCosmoControls();
        appendAIMessage("bot", "Microphone permission is off, but text chat is ready. Type below and tap Send, or tap the microphone after allowing it in your browser settings.");
      } else if (voiceState === "error" && detail === "audio-capture") {
        appendAIMessage("bot", "I can't reach a microphone on this device right now.");
      }
    });
    if (!voiceRecognition) {
      aiVoice.disabled = true;
      aiVoice.title = "Hands-free voice recognition is not available in this browser";
      if (cosmoHandsFreeToggle) cosmoHandsFreeToggle.disabled = true;
    } else {
      aiVoice.title = "Cosmo listens for his name after microphone permission is approved";
      aiVoice.addEventListener("click", () => {
        if (voiceRecognition.isActive()) stopHandsFreeVoice();
        else startHandsFreeVoice();
      });
      const primeHandsFree = () => {
        if (handsFreeVoiceEnabled() && !voiceRecognition.isActive()) startHandsFreeVoice();
      };
      document.addEventListener("starquest:cosmo-opened", primeHandsFree);
    }
  }

  if (cosmoHandsFreeToggle) cosmoHandsFreeToggle.addEventListener("change", () => {
    if (cosmoHandsFreeToggle.checked) startHandsFreeVoice();
    else stopHandsFreeVoice();
  });

  function renderGemmaState(info) {
    if (!cosmoEngineStatus || !info) return;
    cosmoEngineStatus.textContent = info.detail;
    if (cosmoStartGemma) {
      cosmoStartGemma.disabled = info.state === "loading" || info.state === "ready" || info.state === "unsupported";
      cosmoStartGemma.textContent = info.state === "ready" ? "Gemma running" : info.state === "loading" ? "Loading Gemma…" : "Start Gemma";
    }
  }
  if (cosmoStartGemma) cosmoStartGemma.addEventListener("click", async () => {
    renderGemmaState({ state: "loading", detail: "Preparing Gemma…" });
    const info = window.StarQuestAI && StarQuestAI.startGemma ? await StarQuestAI.startGemma() : { state: "error", detail: "Gemma is unavailable." };
    renderGemmaState(info);
  });
  document.addEventListener("starquest:gemma-state", (event) => renderGemmaState(event.detail));
  if (window.StarQuestGemma) renderGemmaState(StarQuestGemma.status());
  syncCosmoControls();

  /* ─────────────────────────────────────────────────────────────
     ESCAPE KEY — close all overlays
     ──────────────────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAIPanel();
      closeAuthModal();
      closeProfilePortal();
    }
  });

  /* ─────────────────────────────────────────────────────────────
     HELPER FUNCTIONS (self-contained for this IIFE)
     ──────────────────────────────────────────────────────────── */
  function escHTMLSQ(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function escAttrSQ(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ─────────────────────────────────────────────────────────────
     INIT
     ──────────────────────────────────────────────────────────── */
  /* Restore UI state on load */
  (function init() {
    if (typeof StarQuestAuth !== "undefined") {
      const user = StarQuestAuth.currentUser();
      updateUIForUser(user);
    }
  })();

})();
