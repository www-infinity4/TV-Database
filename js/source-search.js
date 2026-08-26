/**
 * StarQuest verified source search.
 * Google is used as an optional discovery aid. Automatic catalog imports are
 * accepted only after Internet Archive metadata exposes a direct video file.
 */
(function () {
  "use strict";

  const INVENTORY_KEY = "starquest.source.inventory.v1";
  const SEARCH_ENDPOINT = "https://archive.org/advancedsearch.php";
  const METADATA_ENDPOINT = "https://archive.org/metadata/";
  const VIDEO_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
  const REJECT_FILE = /(thumb|preview|sample|trailer|spectrogram|waveform|subtitle)/i;
  const REJECT_TERMS = /\b(adult|porn|pornographic|erotic|fetish|xxx)\b/i;
  const MAX_RESULTS = 12;
  const CATEGORY_TERMS = {
    all: "",
    suspense: "(subject:suspense OR subject:mystery)",
    thriller: "(subject:thriller OR subject:crime)",
    horror: "(subject:horror OR subject:monster)",
    comedy: "subject:comedy",
    drama: "subject:drama",
    science: "(subject:science OR subject:documentary)",
    family: "(subject:family OR subject:animation OR subject:cartoon)"
  };

  const byId = id => document.getElementById(id);
  const clean = (value, limit) => String(Array.isArray(value) ? value.join(", ") : value || "")
    .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);

  function readInventory() {
    try {
      const saved = JSON.parse(localStorage.getItem(INVENTORY_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(item => item && item.id && item.episodes).slice(-200) : [];
    } catch (_) { return []; }
  }

  function writeInventory(items) {
    try { localStorage.setItem(INVENTORY_KEY, JSON.stringify(items.slice(-200))); } catch (_) {}
  }

  function restoreInventory() {
    if (typeof SHOWS === "undefined") return;
    const known = new Set(SHOWS.map(show => show.id));
    readInventory().forEach(show => {
      if (!known.has(show.id)) {
        SHOWS.push(show);
        known.add(show.id);
      }
    });
  }

  function archiveQuery(words, category) {
    const quoted = clean(words, 120).split(/\s+/).filter(Boolean)
      .map(word => word.replace(/[^a-zA-Z0-9'-]/g, "")).filter(Boolean).join(" AND ");
    const categoryTerm = CATEGORY_TERMS[category] || "";
    return [
      "mediatype:movies",
      "(collection:feature_films OR collection:animationandcartoons OR licenseurl:*creativecommons.org*)",
      quoted ? "(" + quoted + ")" : "",
      categoryTerm
    ].filter(Boolean).join(" AND ");
  }

  function searchUrl(words, category) {
    const params = new URLSearchParams({
      q: archiveQuery(words, category),
      rows: String(MAX_RESULTS * 2),
      page: "1",
      output: "json"
    });
    ["identifier", "title", "year", "subject", "description", "licenseurl", "collection", "downloads"]
      .forEach(field => params.append("fl[]", field));
    params.append("sort[]", "downloads desc");
    return SEARCH_ENDPOINT + "?" + params.toString();
  }

  function googleUrl(words, category) {
    const categoryText = category === "all" ? "" : " " + category;
    const query = clean(words, 120) + categoryText + " full movie (site:archive.org/details OR site:youtube.com/watch)";
    return "https://www.google.com/search?q=" + encodeURIComponent(query.trim());
  }

  function scoreFile(file) {
    const name = String(file && file.name || "");
    if (!VIDEO_EXT.test(name) || REJECT_FILE.test(name) || file.private === true || file.private === "true") return -Infinity;
    const size = Number(file.size || 0);
    if (size && size < 25000000) return -Infinity;
    return (/\.mp4$/i.test(name) ? 50 : 0) +
      (file.source === "original" ? 25 : 0) +
      (/512kb|h\.264|mpeg4/i.test(name) ? 12 : 0) +
      Math.min(30, size / 100000000);
  }

  async function verifyDocument(doc) {
    const identifier = clean(doc.identifier, 180);
    if (!identifier || REJECT_TERMS.test(clean([doc.title, doc.subject, doc.description], 1200))) return null;
    const response = await fetch(METADATA_ENDPOINT + encodeURIComponent(identifier), {
      mode: "cors", credentials: "omit", referrerPolicy: "no-referrer"
    });
    if (!response.ok) return null;
    const metadata = await response.json();
    if (metadata.is_dark || metadata.metadata?.access_restricted_item === "true") return null;
    const ranked = (metadata.files || []).map(file => ({ file, score: scoreFile(file) }))
      .filter(entry => Number.isFinite(entry.score)).sort((a, b) => b.score - a.score);
    if (!ranked.length) return null;
    return { doc, identifier, file: ranked[0].file };
  }

  function resultAsShow(result, category) {
    const doc = result.doc;
    const identifier = result.identifier;
    const title = clean(doc.title, 140) || identifier;
    const year = Number.parseInt(doc.year, 10);
    const subject = clean(doc.subject, 300).toLowerCase();
    const genres = [];
    if (category !== "all") genres.push(category[0].toUpperCase() + category.slice(1));
    if (/animation|cartoon/.test(subject)) genres.push("Animation");
    if (/documentary|science/.test(subject)) genres.push("Documentary");
    if (!genres.length) genres.push("Movies");
    const id = "source-" + identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return {
      id,
      type: "movie",
      title,
      years: Number.isFinite(year) ? String(year) : "Archive",
      genre: [...new Set(genres)],
      rating: "Verified free source",
      score: 7,
      description: clean(doc.description, 450) || "Verified direct-playback movie discovered through StarQuest source search.",
      thumbnail: "https://archive.org/services/img/" + encodeURIComponent(identifier),
      featured: false,
      discoverySource: "StarQuest verified Internet Archive search",
      archiveLicense: clean(doc.licenseurl, 300),
      locallySaved: true,
      episodes: [{
        id: id + "-full",
        title,
        season: 0,
        episode: 0,
        year: Number.isFinite(year) ? year : null,
        duration: "Full archive video",
        description: "Exact playable file verified from Internet Archive metadata.",
        archiveId: identifier,
        archiveFile: String(result.file.name),
        directSource: "https://archive.org/download/" + encodeURIComponent(identifier) + "/" +
          String(result.file.name).split("/").map(encodeURIComponent).join("/"),
        thumbnail: "https://archive.org/services/img/" + encodeURIComponent(identifier)
      }]
    };
  }

  function saveAndPlay(show) {
    const saved = readInventory().filter(item => item.id !== show.id);
    saved.push(show);
    writeInventory(saved);
    if (typeof SHOWS !== "undefined" && !SHOWS.some(item => item.id === show.id)) SHOWS.push(show);
    window.dispatchEvent(new CustomEvent("starquest:source-selected", { detail: { show } }));
    close();
  }

  function renderResult(result, category) {
    const show = resultAsShow(result, category);
    const card = document.createElement("article");
    card.className = "source-search-card";
    const image = document.createElement("img");
    image.src = show.thumbnail;
    image.alt = "";
    image.loading = "lazy";
    const body = document.createElement("div");
    body.className = "source-search-card__body";
    const title = document.createElement("h3");
    title.textContent = show.title;
    const meta = document.createElement("p");
    meta.textContent = show.years + " · Internet Archive · direct file verified";
    const action = document.createElement("button");
    action.type = "button";
    action.className = "btn btn-primary";
    action.textContent = "▶ Add to inventory & play";
    action.addEventListener("click", () => saveAndPlay(show));
    body.append(title, meta, action);
    card.append(image, body);
    return card;
  }

  async function runSearch() {
    const input = byId("source-search-input");
    const category = byId("source-search-category").value;
    const words = clean(input.value, 120);
    const status = byId("source-search-status");
    const resultsNode = byId("source-search-results");
    const google = byId("source-search-google");
    google.href = googleUrl(words, category);
    resultsNode.innerHTML = "";
    status.textContent = "Searching verified free-movie sources…";
    try {
      const response = await fetch(searchUrl(words, category), {
        mode: "cors", credentials: "omit", referrerPolicy: "no-referrer"
      });
      if (!response.ok) throw new Error("Archive search returned " + response.status);
      const docs = (await response.json()).response?.docs || [];
      const verified = [];
      for (const doc of docs) {
        if (verified.length >= MAX_RESULTS) break;
        const result = await verifyDocument(doc).catch(() => null);
        if (result) verified.push(result);
      }
      verified.forEach(result => resultsNode.appendChild(renderResult(result, category)));
      status.textContent = verified.length
        ? verified.length + " direct-playback source" + (verified.length === 1 ? "" : "s") + " verified."
        : "No direct playable files passed verification. Try the Google source search, then search the title here.";
    } catch (error) {
      status.textContent = "Source search is temporarily unavailable. Your saved inventory is unchanged.";
    }
  }

  function open() {
    byId("source-search-backdrop").hidden = false;
    byId("source-search-input").focus();
  }

  function close() {
    byId("source-search-backdrop").hidden = true;
  }

  function bind() {
    const openButton = byId("source-search-open");
    if (!openButton) return;
    openButton.addEventListener("click", open);
    byId("source-search-close").addEventListener("click", close);
    byId("source-search-run").addEventListener("click", runSearch);
    byId("source-search-input").addEventListener("keydown", event => {
      if (event.key === "Enter") { event.preventDefault(); runSearch(); }
    });
    byId("source-search-backdrop").addEventListener("click", event => {
      if (event.target === event.currentTarget) close();
    });
    restoreInventory();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, { once: true });
  else bind();

  window.StarQuestSourceSearch = { runSearch, readInventory, restoreInventory, googleUrl, searchUrl };
})();
