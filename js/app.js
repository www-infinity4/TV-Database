/**
 * ClassicTV — App Logic
 * Handles browsing, search, modal, and player.
 */

(function () {
  "use strict";

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
    heroDesc: document.getElementById("hero-desc"),
    heroScore: document.getElementById("hero-score"),
    heroRating: document.getElementById("hero-rating"),
    heroYears: document.getElementById("hero-years"),
    heroPlayBtn: document.getElementById("hero-play-btn"),
    heroInfoBtn: document.getElementById("hero-info-btn"),
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
    rowStarCoinMovies: document.getElementById("row-starcoin-movies"),
    forYouSection: document.getElementById("for-you-section"),
    forYouGenreLabel: document.getElementById("for-you-genre-label"),
    allEpsBackdrop: document.getElementById("all-eps-backdrop"),
    allEpsTabs: document.getElementById("all-eps-tabs"),
    allEpsList: document.getElementById("all-eps-list"),
    allEpsClose: document.getElementById("all-eps-close"),
    dueSouthBrowseAll: document.getElementById("due-south-browse-all"),

    genrePills: document.querySelectorAll(".genre-pill"),
  };

  /* ── Personalization helpers ── */
  const EXT_PLAYABLE = /\\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
  const TV_FIRST_TYPES = new Set(["tv", "series", "show", "soap", "vhs"]);
  /* Strong bias so "For You" feels like a TV shelf first and only falls back
     to non-series items when the playable catalogue has nothing better. */
  const TV_SHOW_BOOST = 40;
  const NON_TV_PENALTY = -35;
  const MAX_HISTORY_ITEMS = 200;
  const COSMO_POPIN_SCHEDULE_MS = [12000, 45000, 90000];
  const COSMO_POPIN_DISMISS_MS = 14000;

  function showDecade(show) {
    const year = parseInt(String(show.years || "").split("–")[0], 10);
    if (!Number.isFinite(year)) return "";
    return Math.floor(year / 10) * 10 + "s";
  }

  function buildEpisodeId(ep, show) {
    return (show && show.id ? show.id : "unknown") + "|S" + ep.season + "E" + ep.episode;
  }

  function isEpisodePlayable(ep) {
    if (!ep || typeof ep !== "object") return false;
    if (ep.youtubeId) return true;
    if (typeof ep.archiveFile === "string" && ep.archiveId) return EXT_PLAYABLE.test(ep.archiveFile);
    // Item-only Archive.org records are resolved from metadata at playback time.
    return !!ep.archiveId;
  }

  function isShowAvailable(show) {
    if (!show || !Array.isArray(show.episodes) || !show.episodes.length) return false;
    return show.episodes.some(isEpisodePlayable);
  }

  function getPrimaryEpisode(show) {
    if (!show || !Array.isArray(show.episodes)) return null;
    return show.episodes.find(isEpisodePlayable) || show.episodes[0] || null;
  }

  const DISCOVERY_KEY = "starquest.discovery.v1";

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

  function recordDiscoverySearch(query) {
    const clean = String(query || "").trim().toLowerCase();
    if (clean.length < 2) return;
    const signals = loadDiscoverySignals();
    if (signals.searches[signals.searches.length - 1] !== clean) signals.searches.push(clean);
    signals.searches = signals.searches.slice(-30);
    saveDiscoverySignals(signals);
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
    if (!history.length && !discovery.searches.length && !Object.keys(discovery.shows).length && !unlocked.length) return null;
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
      searches: discovery.searches, explicitShows: discovery.shows
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
    const recentlyWatched = stats.recentShows.has(show.id);
    const discoveryBonus = stats.watchedShows.has(show.id) ? 0 : 22;
    const tvBoost = isTvFirstShow(show) ? 65 : (isMusicFirst(show) ? -90 : -15);
    const score =
      genreAffinity * 20 + genreRecency * 38 +
      decadeAffinity * 10 + decadeRecency * 24 +
      seriesAffinity * 18 + seriesRecency * 45 +
      explicitInterest * 35 + searchAffinity * 55 +
      discoveryBonus - (recentlyWatched ? 45 : 0) +
      tvBoost + Math.min(18, Math.max(0, show.episodes.length - 1)) + (show.score || 0);
    let reason = "Recommended from your mix of favorite genres, decades, and highly rated television.";
    if (searchAffinity > 0) reason = "Matches things you searched for in StarQuest.";
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
    const starterOrder = ["mash", "the-twilight-zone", "due-south", "real-ghostbusters", "thomas-the-tank-engine", "new-alfred-hitchcock-presents"];
    const starterTV = stats ? tv : starterOrder
      .map((id) => available.find((show) => show.id === id))
      .filter(Boolean)
      .concat(tv.filter((show) => !starterOrder.includes(show.id) && show.id !== "reading-rainbow"));
    const candidates = diverseForYou(starterTV, 14);
    for (const movie of movies) {
      if (candidates.length >= 16) break;
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

  function initHero() {
    const featured = getFeaturedShows().filter(isShowAvailable);
    if (!featured.length) return;
    /* If user has watch history, pick the highest-affinity featured show */
    const profile = historyStats();
    let show;
    if (profile) {
      show = featured.slice().sort(byPersonalized(profile, {}))[0];
    } else {
      show = getShowById("mash") || getShowById("due-south") || featured[0];
    }
    renderHero(show);
  }

  function renderHero(show) {
    state.currentShow = show;
    DOM.heroTitle.textContent = show.title;
    DOM.heroDesc.textContent = show.description;
    DOM.heroScore.textContent = "★ " + show.score;
    DOM.heroRating.textContent = show.rating;
    DOM.heroYears.textContent = show.years;
    DOM.heroGenres.textContent = show.genre.join(" · ");

    DOM.heroPlayBtn.onclick = () => {
      const episode = getPrimaryEpisode(show);
      if (episode) {
        openPlayer(episode, show.title);
      }
    };
    DOM.heroInfoBtn.onclick = () => openModal(show);
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
    renderRow(DOM.rowReadingRainbow, [getShowById("reading-rainbow")].filter(Boolean));
    renderRow(DOM.rowStarCoinMovies, getMovies().filter((show) => (show.starCoinCost || 0) > 0).sort(byScore));
    renderRow(DOM.rowFeatured, getFeaturedShows().slice().sort(byScoreFreeFirst));
    renderEpisodeRow(DOM.rowDueSouth, getShowById("due-south"), 0, 1);
    renderRow(DOM.rowMovies, getMovies().slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowDrama, getShowsByGenre("Drama").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowComedy, getShowsByGenre("Comedy").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowScifi, getShowsByGenre("Sci-Fi").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowCrime, getShowsByGenre("Crime").slice().sort(byScoreFreeFirst));
    renderRow(DOM.rowFamily, getShowsByGenre("Family").slice().sort(byScoreFreeFirst));
    renderRow(DOM.row70s, getShowsByDecade(1970).slice().sort(byScoreFreeFirst));
    renderRow(DOM.row80s, getShowsByDecade(1980).slice().sort(byScoreFreeFirst));
    renderRow(DOM.row90s, getShowsByDecade(1990).slice().sort(byScoreFreeFirst));
  }

  function renderRow(container, shows) {
    if (!container) return;
    container.innerHTML = "";
    shows.filter(isShowAvailable).forEach((show) => {
      container.appendChild(createShowCard(show));
    });
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
          <span class="icon">📺</span>
          <span>${escHTML(ep.title)}</span>
        </div>
        <div class="show-card__play-overlay" aria-hidden="true">
          <div class="play-icon-circle">▶</div>
        </div>
        <div class="ep-season-badge">${escHTML(seasonLabel)}</div>
      </div>
      <div class="show-card__info">
        <div class="show-card__title" title="${escAttr(ep.title)}">${escHTML(ep.title)}</div>
        <div class="show-card__meta">
          <span style="color:var(--text-muted)">${escHTML(ep.year + " · " + ep.duration)}</span>
        </div>
      </div>
    `;

    const play = () => openPlayer(ep, show.title);
    card.addEventListener("click", play);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });

    return card;
  }
  function createShowCard(show) {
    const unlockCost = Number.isFinite(Number(show.starCoinCost))
      ? Math.max(0, Math.trunc(Number(show.starCoinCost)))
      : (show.payToWatch ? 3 : 0);
    const contentId = "show:" + show.id;
    const isUnlocked = unlockCost <= 0 || (typeof StarQuestAuth !== "undefined" && StarQuestAuth.isContentUnlocked(contentId));
    const isLocked = unlockCost > 0 && !isUnlocked;
    const showUnavailable = !isShowAvailable(show);
    const card = document.createElement("div");
    card.className = "show-card" + (isLocked ? " show-card--pay" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label",
      isLocked
        ? "Unlock " + show.title + " for " + unlockCost + " StarCoins"
        : showUnavailable
          ? show.title + " is unavailable"
        : show.type === "movie" ? "Watch " + show.title : "View " + show.title);

    const movieBadge = show.type === "movie" && !show.payToWatch
      ? '<div class="ep-season-badge movie-badge">🎬 MOVIE</div>'
      : "";
    const payBadge = isLocked
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
          <span class="icon">📺</span>
          <span>${escHTML(show.title)}</span>
        </div>
        <div class="show-card__play-overlay" aria-hidden="true">
          <div class="play-icon-circle">${show.payToWatch ? "↗" : "▶"}</div>
        </div>
        ${movieBadge}${payBadge}
      </div>
      <div class="show-card__info">
        <div class="show-card__title" title="${escAttr(show.title)}">${escHTML(show.title)}</div>
        <div class="show-card__meta">
          <span class="show-card__score">★ ${escHTML(String(show.score))}</span>
          <span class="show-card__genre">${escHTML(show.genre[0])}</span>
          <span>${escHTML(show.years)}</span>
        </div>
        ${showUnavailable ? '<div class="history-empty" style="display:block;margin-top:4px;">Unavailable</div>' : ""}
        ${isLocked ? '<button class="btn btn-primary unlock-btn" type="button" style="margin-top:6px">Unlock • ' + escHTML(String(unlockCost)) + ' ⭐</button>' : ""}
        ${unlockCost > 0 && !isLocked ? '<div class="history-empty" style="display:block;margin-top:4px;">Unlocked</div>' : ""}
      </div>
    `;

    const unlockBtn = card.querySelector(".unlock-btn");
    if (unlockBtn) {
      unlockBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) {
          document.dispatchEvent(new CustomEvent("starquest:require-auth"));
          return;
        }
        const unlockResult = StarQuestAuth.unlockContent(contentId, unlockCost, show.title);
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

    if (showUnavailable) {
      const noPlay = (e) => {
        e.preventDefault();
        document.dispatchEvent(new CustomEvent("starquest:toast", {
          detail: { message: "This content is currently unavailable." }
        }));
      };
      card.addEventListener("click", noPlay);
      card.addEventListener("keydown", (e) => {
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
        if (e.key === "Enter" || e.key === " ") promptUnlock(e);
      });
    } else if (show.type === "movie" && show.episodes && show.episodes.length > 0) {
      /* Free movies play directly — no intermediate modal */
      const play = () => {
        const episode = getPrimaryEpisode(show);
        if (episode) openPlayer(episode, show.title);
      };
      card.addEventListener("click", play);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });
    } else {
      card.addEventListener("click", () => openModal(show));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(show);
        }
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
      : (show.payToWatch ? 3 : 0);
    const isUnlocked = showCost <= 0 || (typeof StarQuestAuth !== "undefined" && StarQuestAuth.isContentUnlocked("show:" + show.id));

    show.episodes.forEach((ep, i) => {
      const isPlayable = isEpisodePlayable(ep);
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
          <div class="episode-desc">${escHTML(ep.description)}</div>
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

  function attemptInstantPlayback() {
    const playPromise = DOM.playerVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        console.debug("StarQuest autoplay blocked or delayed:", err);
      });
    }
  }

  function openPlayer(episode, showTitle) {
    const showForEpisode = (typeof SHOWS !== "undefined")
      ? SHOWS.find((s) => s.title === showTitle)
      : null;
    const showCost = showForEpisode
      ? (Number.isFinite(Number(showForEpisode.starCoinCost))
        ? Math.max(0, Math.trunc(Number(showForEpisode.starCoinCost)))
        : (showForEpisode.payToWatch ? 3 : 0))
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
    if (!isEpisodePlayable(episode)) {
      document.dispatchEvent(new CustomEvent("starquest:toast", {
        detail: { message: "This content is currently unavailable." }
      }));
      return;
    }
    state.currentEpisode = episode;

    const isSpecial = episode.season === 0;
    const seasonLabel = isSpecial ? "Movie" : "S" + episode.season + "E" + episode.episode;
    DOM.playerEpTitle.textContent = showTitle + " — " + seasonLabel + ": " + episode.title;

    DOM.playerPage.classList.add("open");
    DOM.playerLoading.style.display = "flex";
    DOM.playerError.style.display = "none";
    document.body.classList.add("player-open");
    document.body.style.overflow = "hidden";

    /* Tell Cosmo what we're watching */
    const show = (typeof SHOWS !== "undefined")
      ? SHOWS.find((s) => s.title === showTitle) : null;
    if (typeof StarQuestAI !== "undefined") {
      StarQuestAI.setContext(show ? show.id : null, showTitle, episode.title);
    }

    /* Automatic AI pop-ins are disabled during playback. They were unrelated
       to the program and could be mistaken for part of the episode. */
    clearCosmoPopInTimers();

    if (typeof episode.archiveFile === "string" && episode.archiveId) {
      /* Use a native <video> element with the direct archive.org download URL.
         This plays the file on-site without the embed player's restrictions. */
      const directUrl = buildArchiveDirectUrl(episode.archiveId, episode.archiveFile);

      DOM.playerFrame.style.display = "none";
      DOM.playerFrame.src = "about:blank";
      DOM.playerVideo.style.display = "block";
      DOM.playerVideo.preload = "auto";
      /* Register handlers before assigning src so no stale queued event
         from a prior load can slip through and trigger the wrong handler. */
      DOM.playerVideo.oncanplay = () => {
        DOM.playerLoading.style.display = "none";
        attemptInstantPlayback();
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
      const embedUrl = buildEmbedUrl(episode);
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
      DOM.playerVideo.onloadedmetadata = null;
      DOM.playerVideo.oncanplay = null;
      DOM.playerVideo.onerror = null;
      DOM.playerVideo.style.display = "none";
      DOM.playerVideo.removeAttribute("src");
      DOM.playerVideo.load();
      DOM.playerFrame.style.display = "none";
      DOM.playerFrame.src = "about:blank";
      document.dispatchEvent(new CustomEvent("starquest:resolve-archive-episode", {
        detail: {
          identifier: episode.archiveId,
          showTitle,
          season: episode.season,
          episode: episode.episode,
          episodeTitle: episode.title
        }
      }));
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
      textEl.textContent = text;
      popEl.style.display = "flex";
      popEl.classList.add("cosmo-popin--in");
      /* Auto-dismiss after 14 seconds */
      if (_popInHideTimer) clearTimeout(_popInHideTimer);
      _popInHideTimer = setTimeout(hideCosmoPopIn, COSMO_POPIN_DISMISS_MS);
    };

    if (typeof StarQuestAI !== "undefined") {
      StarQuestAI.generatePopIn(showId, showTitle, epTitle).then(display).catch(() => {
        display("Enjoying the show? I've got all the behind-the-scenes secrets — ask me anything! 🤖");
      });
    } else {
      display("Enjoying the show? Ask Cosmo about behind-the-scenes secrets! 🤖");
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

  if (DOM.readingRainbowBrowseAll) {
    DOM.readingRainbowBrowseAll.addEventListener("click", () => {
      const show = getShowById("reading-rainbow");
      if (show) openModal(show);
    });
  }

  DOM.playerBack.addEventListener("click", closePlayer);


  /**
   * Build a direct archive.org download URL for a specific file within an item.
   * Used to play video via a native <video> element, bypassing embed restrictions.
   */
  function buildArchiveDirectUrl(archiveId, archiveFile) {
    if (!archiveId || !archiveFile) return "";
    return "https://archive.org/download/" +
      encodeURIComponent(archiveId) + "/" +
      archiveFile.split("/").map(encodeURIComponent).join("/");
  }

  /**
   * Build the iframe embed URL for YouTube or archive.org items without a file path.
   * When an episode has a youtubeId, a YouTube embed URL is returned.
   * When an episode has an archiveIndex, the archive.org playlist index
   * parameter is used to jump directly to that episode.
   */
  function buildEmbedUrl(episode) {
    if (episode.youtubeId) {
      const params = new URLSearchParams({ autoplay: "1" });
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
    ).filter(isShowAvailable).sort(byScoreFreeFirst);

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
      .filter(isShowAvailable)
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

  /* ── All-Episodes Modal (Due South) ── */
  const DS_SEASONS = [
    { label: "Pilot", filter: (ep) => ep.season === 0 },
    { label: "Season 1", filter: (ep) => ep.season === 1 },
    { label: "Season 2", filter: (ep) => ep.season === 2 },
    { label: "Season 3", filter: (ep) => ep.season === 3 },
    { label: "Season 4", filter: (ep) => ep.season === 4 },
  ];

  function openAllEps() {
    const show = getShowById("due-south");
    if (!show) return;
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
    DS_SEASONS.forEach((season, i) => {
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
    const season = DS_SEASONS[seasonIdx];
    const eps = show.episodes.filter(season.filter);
    DOM.allEpsList.innerHTML = "";
    eps.forEach((ep, i) => {
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
          <div class="episode-desc">${escHTML(ep.description)}</div>
        </div>
        <span class="episode-duration">${escHTML(ep.duration)}</span>
        <div class="episode-play" aria-hidden="true">▶</div>
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
    DOM.dueSouthBrowseAll.addEventListener("click", openAllEps);
    DOM.dueSouthBrowseAll.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAllEps(); }
    });
  }

  /* ── Scroll buttons ── */
  document.querySelectorAll(".scroll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const direction = btn.classList.contains("right") ? 1 : -1;
      const row = btn.closest(".card-row-wrap").querySelector(".card-row");
      row.scrollBy({ left: direction * 620, behavior: "smooth" });
    });
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
    if (!ep.archiveId && !ep.youtubeId) return "identifier missing";
    if (ep.youtubeId) return "external fallback only";
    if (typeof ep.archiveFile === "string" && ep.archiveFile) {
      return EXT_PLAYABLE.test(ep.archiveFile) ? "working" : "not directly streamable";
    }
    if (ep.archiveId && typeof ep.archiveIndex === "number") return "external fallback only";
    return "file missing";
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
  initHero();
  initRows();
})();

/* ================================================================
   STARQUEST — Splash, Auth, Sidebar, Wallet, AI Companion
   ================================================================ */
(function () {
  "use strict";

  /* ── State ── */
  let _currentEpisode = null;  /* set when player opens */
  let _currentShowTitle = "";

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
     UPDATE UI FOR LOGGED-IN / LOGGED-OUT STATE
     ──────────────────────────────────────────────────────────── */
  function updateUIForUser(user) {
    const sidebarUsername  = $("sidebar-username");
    const sidebarTokens    = $("sidebar-token-count");
    const navWallet        = $("nav-wallet");
    const navTokenCount    = $("nav-token-count");
    const signinBtn        = $("sidebar-signin-btn");
    const signoutBtn       = $("sidebar-signout-btn");

    if (user) {
      if (sidebarUsername) sidebarUsername.textContent = user.username;
      if (sidebarTokens)  sidebarTokens.textContent   = user.tokens || 0;
      if (navWallet)      navWallet.style.display      = "flex";
      if (navTokenCount)  navTokenCount.textContent    = user.tokens || 0;
      if (signinBtn)      signinBtn.style.display      = "none";
      if (signoutBtn)     signoutBtn.style.display     = "";
    } else {
      if (sidebarUsername) sidebarUsername.textContent = "Guest";
      if (sidebarTokens)  sidebarTokens.textContent   = "0";
      if (navWallet)      navWallet.style.display      = "flex";
      if (navTokenCount)  navTokenCount.textContent    = "0";
      if (signinBtn)      signinBtn.style.display      = "";
      if (signoutBtn)     signoutBtn.style.display     = "none";
    }
    renderHistoryList();
    renderLedgerList();
    renderWalletCard(user);
    renderUnlockedContent(user);
  }

  /* Token update event */
  document.addEventListener("starquest:tokens-updated", (e) => {
    updateUIForUser(e.detail && e.detail.user ? e.detail.user : StarQuestAuth.currentUser());
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
    renderWalletCard(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
  });
  document.addEventListener("starquest:share-progress", () => {
    renderWalletCard(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
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
    if (sidebar) sidebar.classList.add("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.add("open");
    if (hamburgerBtn) { hamburgerBtn.classList.add("open"); hamburgerBtn.setAttribute("aria-expanded", "true"); }
    document.body.style.overflow = "hidden";
    renderHistoryList();
    renderLedgerList();
    renderWalletCard(typeof StarQuestAuth !== "undefined" ? StarQuestAuth.currentUser() : null);
    renderConvoHistory();
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("open");
    if (hamburgerBtn) { hamburgerBtn.classList.remove("open"); hamburgerBtn.setAttribute("aria-expanded", "false"); }
    document.body.style.overflow = "";
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener("click", openSidebar);
  if (sidebarClose) sidebarClose.addEventListener("click", closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

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
      if (!StarQuestAuth.currentUser()) return;
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

      el.innerHTML = `
        <img class="history-item__thumb" src="${escAttrSQ(thumb)}" alt="${escAttrSQ(item.epTitle)}" onerror="this.style.display='none'">
        <div class="history-item__info">
          <div class="history-item__show">${escHTMLSQ(item.showTitle)}</div>
          <div class="history-item__ep">${escHTMLSQ(item.epTitle)}</div>
        </div>
        <div class="history-item__time">${escHTMLSQ(time)}</div>
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

  /* ─────────────────────────────────────────────────────────────
     LEDGER RENDER
     ──────────────────────────────────────────────────────────── */
  function renderLedgerList() {
    const list  = $("ledger-list");
    const empty = $("ledger-empty");
    if (!list) return;

    const user = (typeof StarQuestAuth !== "undefined") ? StarQuestAuth.currentUser() : null;
    const ledger = (user && user.ledger) ? user.ledger.slice().reverse().slice(0, 20) : [];

    Array.from(list.querySelectorAll(".ledger-item")).forEach((el) => el.remove());

    if (!ledger.length) {
      if (empty) empty.style.display = "";
      return;
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
    if (empty) empty.style.display = "none";

    ledger.forEach((tx) => {
      const amount = Number(tx.amount) || 0;
      const sign = amount >= 0 ? "+" : "−";
      const labelByType = {
        watch_reward: "watch reward",
        share_reward: "share reward",
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
    const watchEl = $("wallet-watch-count");
    const watchBarEl = $("wallet-watch-bar");
    const watchWrapEl = $("wallet-watch-progress-wrap");
    const lifetimeEl = $("wallet-lifetime-shares");
    const starPowerEl = $("wallet-star-power");

    const tokens  = (user && user.tokens) || 0;
    const pending = (user && user.pendingShareCredits) || 0;
    const lifetimeShares = (user && user.shareCount) || 0;
    const eligible = (user && user.eligibleWatchSeconds) || 0;
    const rewarded = (user && user.rewardedWatchSeconds) || 0;
    const watchRemainder = Math.max(0, eligible - rewarded) % 3600;

    if (balEl)   balEl.textContent  = tokens;
    if (shareEl) shareEl.textContent = pending + " / " + SHARES_PER_COIN;
    if (barEl)   barEl.style.width  = Math.min(100, (pending / SHARES_PER_COIN) * 100) + "%";
    if (wrapEl)  wrapEl.setAttribute("aria-valuenow", pending);
    if (watchEl) watchEl.textContent = watchRemainder + " / 3600s";
    if (watchBarEl) watchBarEl.style.width = Math.min(100, (watchRemainder / 3600) * 100) + "%";
    if (watchWrapEl) watchWrapEl.setAttribute("aria-valuenow", watchRemainder);
    if (lifetimeEl) lifetimeEl.textContent = "🔗 Lifetime shares: " + lifetimeShares;
    if (starPowerEl) starPowerEl.textContent = "✨ Star Power (sharing): " + Math.floor(lifetimeShares / SHARES_PER_COIN);
  }

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
      const url = buildPlayerUrl(ep);
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
      playerFrame.style.display = "none";
      playerFrame.src = "about:blank";
      document.dispatchEvent(new CustomEvent("starquest:resolve-archive-episode", {
        detail: {
          identifier: ep.archiveId,
          showTitle,
          season: ep.season,
          episode: ep.episode,
          episodeTitle: ep.title
        }
      }));
    }

    startWatchTimer(ep, showTitle);
    addToHistoryNow(ep, showTitle);
  }

  function buildPlayerUrl(episode) {
    if (episode.youtubeId) {
      return "https://www.youtube.com/embed/" + encodeURIComponent(episode.youtubeId) + "?autoplay=1";
    }
    const base = "https://archive.org/embed/" + encodeURIComponent(episode.archiveId);
    const params = new URLSearchParams({ autoplay: "1" });
    if (typeof episode.archiveIndex === "number" && !episode.archiveFile) {
      params.set("index", String(episode.archiveIndex));
    }
    if (episode.title) params.set("playtext", episode.title);
    return base + "?" + params.toString();
  }

  function isEpisodePlayableSQ(ep) {
    if (!ep || typeof ep !== "object") return false;
    if (ep.youtubeId) return true;
    if (typeof ep.archiveFile === "string" && ep.archiveId) return /\\.(mp4|m4v|webm|ogv|ogg|mov)$/i.test(ep.archiveFile);
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
    addToHistoryNow(e.detail.ep, e.detail.showTitle);
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
            setTimeout(() => startWatchTimerFromCurrent(), 300);
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
    if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) return;
    if (!ep) return;
    const show = findShowForEpisode(ep);
    const episodeId = show ? (show.id + "|S" + ep.season + "E" + ep.episode) : (showTitle + "|" + ep.id);
    const playerVideo = $("player-video");
    if (!playerVideo) return;

    _watchTracker = {
      episodeId,
      lastTime: Number(playerVideo.currentTime) || 0,
      seeking: false,
      duration: Math.max(0, Math.trunc(Number(playerVideo.duration) || 0)),
      showId: show ? show.id : "",
      showTitle: showTitle || (show && show.title) || "Unknown Show",
      epTitle: ep.title || "Episode",
      genre: show && show.genre ? show.genre[0] : "",
      decade: show ? (Math.floor(parseInt(String(show.years || "").split("–")[0], 10) / 10) * 10 + "s") : "",
      tags: show && show.genre ? show.genre.slice(0, 4) : [],
      thumbnail: ep.thumbnail || (show && show.thumbnail) || "",
      watchedSeconds: Math.max(0, Math.trunc(Number(StarQuestAuth.getWatchPosition(episodeId)) || 0)),
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
      if (playerVideo.paused || playerVideo.ended) return;
      if (_watchTracker.seeking) return;
      const rate = Number(playerVideo.playbackRate) || 1;
      if (rate < 0.75 || rate > 1.25) return;

      const nowTime = Number(playerVideo.currentTime) || 0;
      const delta = nowTime - _watchTracker.lastTime;
      _watchTracker.lastTime = nowTime;
      if (!Number.isFinite(delta) || delta <= 0 || delta > 2) return;

      _watchTracker.watchedSeconds += delta;
      StarQuestAuth.saveWatchPosition(_watchTracker.episodeId, Math.floor(_watchTracker.watchedSeconds));
      StarQuestAuth.updateHistoryProgress(_watchTracker.episodeId, Math.floor(_watchTracker.watchedSeconds), _watchTracker.duration);
      const watchResult = StarQuestAuth.recordWatchProgress(_watchTracker.episodeId, delta, {
        episodeId: _watchTracker.episodeId,
        watchedSeconds: Math.floor(_watchTracker.watchedSeconds),
        duration: _watchTracker.duration,
      });

      if (watchResult && watchResult.ok && watchResult.awarded > 0) {
        showPlayerTokenNotif();
        showTokenToast("⭐ +" + watchResult.awarded + " StarCoin for watch-time!");
      }
    }, 1000);
  }

  function stopWatchTimer() {
    if (_watchTimer) clearInterval(_watchTimer);
    _watchTimer = null;
    _watchTracker = null;
  }

  function addToHistoryNow(ep, showTitle) {
    if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) return;
    if (!ep) return;
    const show = findShowForEpisode(ep);
    const showId = (show && show.id) ? show.id : "unknown";
    const episodeId = showId + "|S" + ep.season + "E" + ep.episode;
    const startYear = parseInt(String((show && show.years) || "").split("–")[0], 10);
    const decade = Number.isFinite(startYear) ? (Math.floor(startYear / 10) * 10 + "s") : "";
    const duration = Math.max(0, Math.trunc((Number(ep.duration) || parseInt(String(ep.duration || "0"), 10)) * 60));
    StarQuestAuth.addToHistory({
      episodeId,
      showId,
      showTitle,
      epTitle: ep.title,
      thumbnail: ep.thumbnail,
      genre: show && show.genre ? show.genre[0] : "",
      decade,
      tags: show && Array.isArray(show.genre) ? show.genre.slice(0, 4) : [],
      watchedSeconds: Math.max(0, StarQuestAuth.getWatchPosition(episodeId)),
      duration,
      completionRate: 0,
      startedAt: Date.now(),
      lastWatchedAt: Date.now(),
      completed: false,
      playCount: 1,
    });
  }

  function findShowForEpisode(ep) {
    if (typeof SHOWS === "undefined") return null;
    return SHOWS.find((s) => s.episodes && s.episodes.includes(ep)) || null;
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
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const url = window.location.href;
      const text = _currentShowTitle
        ? "Watching " + _currentShowTitle + " on StarQuest ⭐ — classic TV galaxy!"
        : "Check out StarQuest ⭐ — free classic TV!";
      const contentId = (_currentEpisode && _currentShowTitle)
        ? (_currentShowTitle + "|" + (_currentEpisode.id || _currentEpisode.title || "episode"))
        : "unknown-content";
      const rewardShare = (verified) => {
        if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) return;
        const shareResult = StarQuestAuth.recordShare(contentId, { verified });
        if (!shareResult.ok) {
          if (shareResult.error === "share_cooldown") {
            showTokenToast("Share progress cooldown active for this content.");
          }
          return;
        }
        if (shareResult.awarded > 0) {
          showTokenToast("⭐ +1 StarCoin from sharing (prototype).");
        } else {
          const remaining = shareResult.sharesPerCoin - shareResult.progressToNextCoin;
          showTokenToast("🔗 Shared (" + (verified ? "verified" : "unverified local") + "). " + remaining + " more for a StarCoin.");
        }
      };

      const copyFallback = () => {
        navigator.clipboard.writeText(url + " — " + text).then(() => {
          showTokenToast("Link copied (unverified local share).");
          rewardShare(false);
        }).catch(() => {
          prompt("Copy this link to share:", url);
          showTokenToast("Unverified local share fallback used.");
          rewardShare(false);
        });
      };

      if (navigator.share) {
        try {
          await navigator.share({ title: "StarQuest", text, url });
          rewardShare(true);
        } catch {
          showTokenToast("Share canceled — no reward granted.");
        }
      } else {
        copyFallback();
      }
    });
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
  const sidebarCosmoBtn = $("sidebar-cosmo-btn");
  const sidebarAIBadge  = $("sidebar-ai-badge");

  document.addEventListener("starquest:ai-ready", () => {
    /* Show AI badge in the panel header */
    const subtitle = $("ai-panel-subtitle") || document.querySelector(".ai-panel__subtitle");
    if (subtitle) subtitle.textContent = "⚡ AI Powered · Ask me anything!";
    if (sidebarAIBadge) sidebarAIBadge.style.display = "";
  });

  if (aiFab) aiFab.addEventListener("click", toggleAIPanel);
  if (aiPanelClose) aiPanelClose.addEventListener("click", closeAIPanel);
  if (sidebarCosmoBtn) sidebarCosmoBtn.addEventListener("click", () => {
    closeSidebar();
    openAIPanel();
  });

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
    /* Greet if no messages yet */
    if (aiMessages && aiMessages.children.length === 0) {
      const greeting = (typeof StarQuestAI !== "undefined")
        ? StarQuestAI.chat("hello")
        : Promise.resolve("Hi! I'm Cosmo, StarQuest's AI companion. Ask me about any classic show!");
      Promise.resolve(greeting).then((text) => appendAIMessage("bot", text));
    }
    if (aiInput) aiInput.focus();
  }

  function closeAIPanel() {
    if (aiPanel) aiPanel.style.display = "none";
  }

  function appendAIMessage(role, text) {
    if (!aiMessages) return;
    const msg = document.createElement("div");
    msg.className = "ai-msg ai-msg--" + role;
    msg.innerHTML = `
      <div class="ai-msg__avatar">${role === "bot" ? "🤖" : "👤"}</div>
      <div class="ai-msg__bubble">${escHTMLSQ(text)}</div>
    `;
    aiMessages.appendChild(msg);
    aiMessages.scrollTop = aiMessages.scrollHeight;
    /* Keep sidebar preview in sync if sidebar is open */
    if (sidebar && sidebar.classList.contains("open")) renderConvoHistory();
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
    /* Minimum visual delay + wait for AI response */
    const [response] = await Promise.all([
      (typeof StarQuestAI !== "undefined")
        ? StarQuestAI.chat(text)
        : Promise.resolve("I don't have that info right now. Try asking about a specific classic show!"),
      new Promise((r) => setTimeout(r, 500)),
    ]);
    typingEl.remove();
    appendAIMessage("bot", response);
  }

  if (aiSend) aiSend.addEventListener("click", sendAIMessage);
  if (aiInput) aiInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); sendAIMessage(); }
  });

  /* Suggestion chips */
  document.querySelectorAll(".ai-suggest").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (!aiInput) return;
      aiInput.value = chip.dataset.q || chip.textContent;
      openAIPanel();
      sendAIMessage();
    });
  });

  /* ─────────────────────────────────────────────────────────────
     ESCAPE KEY — close all overlays
     ──────────────────────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAIPanel();
      closeAuthModal();
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
