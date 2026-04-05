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
    playerBack: document.getElementById("player-back"),
    playerEpTitle: document.getElementById("player-ep-title"),
    playerLoading: document.getElementById("player-loading"),

    rowDueSouth: document.getElementById("row-due-south"),
    rowMovies: document.getElementById("row-movies"),
    rowFamily: document.getElementById("row-family"),
    allEpsBackdrop: document.getElementById("all-eps-backdrop"),
    allEpsTabs: document.getElementById("all-eps-tabs"),
    allEpsList: document.getElementById("all-eps-list"),
    allEpsClose: document.getElementById("all-eps-close"),
    dueSouthBrowseAll: document.getElementById("due-south-browse-all"),

    genrePills: document.querySelectorAll(".genre-pill"),
  };

  /* ── Hero ── */
  function initHero() {
    const featured = getFeaturedShows();
    if (!featured.length) return;
    const show = featured[Math.floor(Math.random() * featured.length)];
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
      if (show.episodes && show.episodes.length > 0) {
        openPlayer(show.episodes[0], show.title);
      }
    };
    DOM.heroInfoBtn.onclick = () => openModal(show);
  }

  /* ── Rows ── */
  function byScore(a, b) { return (b.score || 0) - (a.score || 0); }

  function initRows() {
    renderRow(DOM.rowFeatured, getFeaturedShows().slice().sort(byScore));
    renderEpisodeRow(DOM.rowDueSouth, getShowById("due-south"));
    renderRow(DOM.rowMovies, getMovies().slice().sort(byScore));
    renderRow(DOM.rowDrama, getShowsByGenre("Drama").slice().sort(byScore));
    renderRow(DOM.rowComedy, getShowsByGenre("Comedy").slice().sort(byScore));
    renderRow(DOM.rowScifi, getShowsByGenre("Sci-Fi").slice().sort(byScore));
    renderRow(DOM.rowCrime, getShowsByGenre("Crime").slice().sort(byScore));
    renderRow(DOM.rowFamily, getShowsByGenre("Family").slice().sort(byScore));
    renderRow(DOM.row70s, getShowsByDecade(1970).slice().sort(byScore));
    renderRow(DOM.row80s, getShowsByDecade(1980).slice().sort(byScore));
    renderRow(DOM.row90s, getShowsByDecade(1990).slice().sort(byScore));
  }

  function renderRow(container, shows) {
    if (!container) return;
    container.innerHTML = "";
    shows.forEach((show) => {
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
    const card = document.createElement("div");
    card.className = "show-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label",
      show.type === "movie" ? "Watch " + show.title : "View " + show.title);

    const movieBadge = show.type === "movie"
      ? '<div class="ep-season-badge movie-badge">🎬 MOVIE</div>'
      : "";

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
          <div class="play-icon-circle">▶</div>
        </div>
        ${movieBadge}
      </div>
      <div class="show-card__info">
        <div class="show-card__title" title="${escAttr(show.title)}">${escHTML(show.title)}</div>
        <div class="show-card__meta">
          <span class="show-card__score">★ ${escHTML(String(show.score))}</span>
          <span class="show-card__genre">${escHTML(show.genre[0])}</span>
          <span>${escHTML(show.years)}</span>
        </div>
      </div>
    `;

    if (show.type === "movie" && show.episodes && show.episodes.length > 0) {
      /* Movies play directly — no intermediate modal */
      const play = () => openPlayer(show.episodes[0], show.title);
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

    show.episodes.forEach((ep, i) => {
      const item = document.createElement("div");
      item.className = "episode-item";
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "Play episode " + ep.title);

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
        <div class="episode-play" aria-hidden="true">▶</div>
      `;

      const play = () => {
        closeModal();
        openPlayer(ep, show.title);
      };

      item.addEventListener("click", play);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
      });

      DOM.modalEpisodes.appendChild(item);
    });
  }

  /* ── Player ── */
  function openPlayer(episode, showTitle) {
    state.currentEpisode = episode;

    DOM.playerEpTitle.textContent =
      showTitle + " — " + "S" + episode.season + "E" + episode.episode + ": " + episode.title;

    /* Build the embed URL — uses the archive.org embed endpoint.
       The player wraps this in our own UI so the underlying source
       is not visible to the viewer. */
    const embedUrl = buildEmbedUrl(episode);
    DOM.playerFrame.src = embedUrl;

    DOM.playerPage.classList.add("open");
    DOM.playerLoading.style.display = "flex";
    document.body.style.overflow = "hidden";

    DOM.playerFrame.onload = () => {
      DOM.playerLoading.style.display = "none";
    };
  }

  function closePlayer() {
    DOM.playerPage.classList.remove("open");
    DOM.playerFrame.src = "about:blank";
    document.body.style.overflow = "";
  }

  DOM.playerBack.addEventListener("click", closePlayer);

  /**
   * Build the video embed URL.
   * When an episode has a youtubeId, a YouTube embed URL is returned.
   * When an episode has an archiveIndex, the archive.org playlist index
   * parameter is used to jump directly to that episode.
   * The iframe is sandboxed within our UI so viewers see our branding.
   */
  function buildEmbedUrl(episode) {
    if (episode.youtubeId) {
      const params = new URLSearchParams({ autoplay: "1" });
      return "https://www.youtube.com/embed/" + encodeURIComponent(episode.youtubeId) + "?" + params.toString();
    }
    let base =
      "https://archive.org/embed/" + encodeURIComponent(episode.archiveId);
    if (episode.archiveFile) {
      base += "/" + episode.archiveFile.split("/").map(encodeURIComponent).join("/");
    }
    const params = new URLSearchParams({ autoplay: "1" });
    if (typeof episode.archiveIndex === "number") {
      params.set("index", String(episode.archiveIndex));
    }
    return base + "?" + params.toString();
  }

  /* ── Search ── */
  DOM.searchInput.addEventListener("input", debounce(handleSearch, 280));

  function handleSearch() {
    const q = DOM.searchInput.value.trim().toLowerCase();
    state.searchQuery = q;

    if (!q) {
      DOM.searchOverlay.classList.remove("open");
      return;
    }

    const results = SHOWS.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.genre.some((g) => g.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q)
    ).sort(byScore);

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
    const shows = (genre === "all" ? getFeaturedShows() : getShowsByGenre(genre)).slice().sort(byScore);

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

  /* ── Init ── */
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
  }

  /* Token update event */
  document.addEventListener("starquest:tokens-updated", (e) => {
    updateUIForUser(e.detail.user);
  });
  document.addEventListener("starquest:history-updated", () => {
    renderHistoryList();
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
      const user = StarQuestAuth.currentUser();
      if (!user) return;
      if (!confirm("Clear your entire watch history?")) return;
      user.watchHistory = [];
      StarQuestAuth.saveUser(user);
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

      const time = formatRelativeTime(item.watchedAt);
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
    if (empty) empty.style.display = "none";

    ledger.forEach((tx) => {
      const el = document.createElement("div");
      el.className = "ledger-item";
      el.innerHTML = `
        <span class="ledger-item__amount">+${escHTMLSQ(String(tx.amount))} ⭐</span>
        <span class="ledger-item__reason">${escHTMLSQ(tx.reason)}</span>
        <span class="ledger-item__balance">bal: ${escHTMLSQ(String(tx.balance))}</span>
      `;
      list.appendChild(el);
    });
  }

  /* ─────────────────────────────────────────────────────────────
     PLAYER: TOKEN EARNING & HISTORY TRACKING
     We patch the player open/close via a custom event from the
     first IIFE, and watch via an interval timer.
     ──────────────────────────────────────────────────────────── */
  let _watchStartTime = null;
  let _watchTimer     = null;
  let _secondsWatched = 0;

  /* Listen for play-episode event (from history list items) */
  document.addEventListener("starquest:play-episode", (e) => {
    openPlayerExternal(e.detail.ep, e.detail.showTitle);
  });

  function openPlayerExternal(ep, showTitle) {
    /* Delegate to the existing player logic in the first IIFE */
    const playerPage  = $("player-page");
    const playerFrame = $("player-frame");
    const playerTitle = $("player-ep-title");
    const playerLoad  = $("player-loading");
    if (!playerFrame || !playerPage) return;

    _currentEpisode  = ep;
    _currentShowTitle = showTitle;

    const seasonLabel = ep.season === 0 ? "Pilot" : "S" + ep.season + "E" + ep.episode;
    if (playerTitle) playerTitle.textContent = showTitle + " — " + seasonLabel + ": " + ep.title;

    const url = buildPlayerUrl(ep);
    playerFrame.src = url;
    playerPage.classList.add("open");
    if (playerLoad) playerLoad.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (playerFrame.onload === null) {
      playerFrame.addEventListener("load", () => { if (playerLoad) playerLoad.style.display = "none"; }, { once: true });
    }
    startWatchTimer(ep, showTitle);
    addToHistoryNow(ep, showTitle);
  }

  function buildPlayerUrl(episode) {
    if (episode.youtubeId) {
      return "https://www.youtube.com/embed/" + encodeURIComponent(episode.youtubeId) + "?autoplay=1";
    }
    let base = "https://archive.org/embed/" + encodeURIComponent(episode.archiveId);
    if (episode.archiveFile) base += "/" + episode.archiveFile.split("/").map(encodeURIComponent).join("/");
    const params = new URLSearchParams({ autoplay: "1" });
    if (typeof episode.archiveIndex === "number") params.set("index", String(episode.archiveIndex));
    return base + "?" + params.toString();
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
          const lbl = e.season === 0 ? "Pilot: " : "S" + e.season + "E" + e.episode + ": ";
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
    _watchStartTime = Date.now();
    _secondsWatched = 0;
    /* Every 60 seconds, check if an hour has accumulated */
    _watchTimer = setInterval(() => {
      _secondsWatched += 60;
      /* Award 1 token per hour (3600s) */
      if (_secondsWatched > 0 && _secondsWatched % 3600 === 0) {
        if (typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentUser()) {
          StarQuestAuth.addTokens(1, "1 hour watched");
          showPlayerTokenNotif();
          showTokenToast("⭐ +1 StarCoin for watching!");
        }
      }
    }, 60000);
  }

  function stopWatchTimer() {
    if (_watchTimer) { clearInterval(_watchTimer); _watchTimer = null; }
    _watchStartTime = null;
    _secondsWatched = 0;
  }

  function addToHistoryNow(ep, showTitle) {
    if (typeof StarQuestAuth === "undefined" || !StarQuestAuth.currentUser()) return;
    if (!ep) return;
    const show = findShowForEpisode(ep);
    const showId = (show && show.id) ? show.id : "unknown";
    const episodeId = showId + "|S" + ep.season + "E" + ep.episode;
    StarQuestAuth.addToHistory(episodeId, showTitle, ep.title, ep.thumbnail);
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
    shareBtn.addEventListener("click", () => {
      const url = window.location.href;
      const text = _currentShowTitle
        ? "Watching " + _currentShowTitle + " on StarQuest ⭐ — classic TV galaxy!"
        : "Check out StarQuest ⭐ — free classic TV!";

      if (navigator.share) {
        navigator.share({ title: "StarQuest", text, url }).catch(() => {});
      } else {
        navigator.clipboard.writeText(url + " — " + text).then(() => {
          showTokenToast("Link copied! 🔗");
        }).catch(() => {
          prompt("Copy this link to share:", url);
        });
      }

      /* Award share credits */
      if (typeof StarQuestAuth !== "undefined" && StarQuestAuth.currentUser()) {
        const awarded = StarQuestAuth.recordShare();
        if (awarded) {
          showTokenToast("⭐ +1 StarCoin for 10 shares!");
        } else {
          const user = StarQuestAuth.currentUser();
          const remaining = 10 - (user.pendingShareCredits || 0);
          showTokenToast("🔗 Shared! " + remaining + " more for a StarCoin!");
        }
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

  /* ─────────────────────────────────────────────────────────────
     AI COMPANION — COSMO
     ──────────────────────────────────────────────────────────── */
  const aiFab         = $("ai-fab");
  const aiPanel       = $("ai-panel");
  const aiPanelClose  = $("ai-panel-close");
  const aiMessages    = $("ai-messages");
  const aiInput       = $("ai-input");
  const aiSend        = $("ai-send");

  if (aiFab) aiFab.addEventListener("click", toggleAIPanel);
  if (aiPanelClose) aiPanelClose.addEventListener("click", closeAIPanel);

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
      appendAIMessage("bot", typeof StarQuestAI !== "undefined"
        ? StarQuestAI.chat("hello")
        : "Hi! I'm Cosmo, StarQuest's AI companion. Ask me about any classic show!");
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
  }

  function sendAIMessage() {
    if (!aiInput) return;
    const text = aiInput.value.trim();
    if (!text) return;
    appendAIMessage("user", text);
    aiInput.value = "";
    /* Typing indicator */
    const typingEl = document.createElement("div");
    typingEl.className = "ai-msg ai-msg--bot";
    typingEl.innerHTML = '<div class="ai-msg__avatar">🤖</div><div class="ai-msg__bubble">…</div>';
    if (aiMessages) aiMessages.appendChild(typingEl);
    if (aiMessages) aiMessages.scrollTop = aiMessages.scrollHeight;
    setTimeout(() => {
      typingEl.remove();
      const response = (typeof StarQuestAI !== "undefined")
        ? StarQuestAI.chat(text)
        : "I don't have that information right now. Try asking about a specific classic show!";
      appendAIMessage("bot", response);
    }, 600);
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
