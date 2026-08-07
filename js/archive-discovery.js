/**
 * Live Internet Archive discovery for highly rated, openly licensed video.
 * Archive ratings use five stars, so 3.5/5 is the 7/10 catalog threshold.
 */
(function () {
  "use strict";

  const SEARCH_URL = "https://archive.org/advancedsearch.php";
  const METADATA_URL = "https://archive.org/metadata/";
  const CACHE_KEY = "starquest.archiveDiscovery.v1";
  const CACHE_MS = 6 * 60 * 60 * 1000;
  const RESULTS_PER_SHELF = 6;
  const VIDEO_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
  const BAD_FILE = /(thumb|preview|sample|spectrogram|waveform|subtitle|trailer)/i;
  const BLOCKED_DISCOVERY_TERMS = /\b(adult|porn|pornographic|erotic|fetish|xxx)\b/i;

  const shelves = [
    { bucket: "1970s", query: "year:[1970 TO 1979]" },
    { bucket: "1980s", query: "year:[1980 TO 1989]" },
    { bucket: "1990s", query: "year:[1990 TO 1999]" },
    { bucket: "cartoons", query: "year:[1950 TO 1999] AND (collection:animationandcartoons OR subject:animation OR subject:cartoon)" },
  ];

  function cleanText(value, limit) {
    const text = Array.isArray(value) ? value.join(", ") : String(value || "");
    return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, limit);
  }

  function searchUrl(shelf) {
    const query = [
      "mediatype:movies",
      "(collection:feature_films OR collection:animationandcartoons)",
      shelf.query,
      "avg_rating:[3.5 TO 5]",
      "num_reviews:[2 TO *]",
      "licenseurl:*creativecommons.org*",
    ].join(" AND ");
    const params = new URLSearchParams({ q: query, rows: String(RESULTS_PER_SHELF * 2), page: "1", output: "json" });
    ["identifier", "title", "year", "subject", "avg_rating", "num_reviews", "description", "licenseurl", "downloads"].forEach(field => params.append("fl[]", field));
    params.append("sort[]", "downloads desc");
    return SEARCH_URL + "?" + params.toString();
  }

  async function exactPlayableFile(identifier) {
    const response = await fetch(METADATA_URL + encodeURIComponent(identifier), { credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) return null;
    const metadata = await response.json();
    if (metadata.is_dark || metadata.metadata?.access_restricted_item === "true") return null;
    const files = (metadata.files || []).filter(file =>
      VIDEO_EXT.test(String(file.name || "")) &&
      !BAD_FILE.test(String(file.name || "")) &&
      file.private !== true && file.private !== "true"
    );
    files.sort((a, b) => {
      const quality = file =>
        (/\.mp4$/i.test(file.name) ? 40 : 0) +
        (file.source === "original" ? 25 : 0) +
        (!/\.ia\.mp4$/i.test(file.name) ? 10 : 0) +
        Math.min(20, Number(file.size || 0) / 100000000);
      return quality(b) - quality(a);
    });
    return files[0] || null;
  }

  function asShow(doc, shelf, file) {
    const identifier = cleanText(doc.identifier, 180);
    const title = cleanText(doc.title, 140) || identifier;
    const year = Number.parseInt(doc.year, 10);
    const subject = cleanText(doc.subject, 300).toLowerCase();
    const isCartoon = shelf.bucket === "cartoons" || /animation|cartoon/.test(subject);
    return {
      id: "archive-live-" + identifier.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      type: "movie",
      title,
      years: Number.isFinite(year) ? String(year) : "Archive",
      genre: isCartoon ? ["Animation", "Family"] : ["Movies"],
      rating: "Openly licensed",
      score: Math.round(Number(doc.avg_rating || 3.5) * 20) / 10,
      description: cleanText(doc.description, 450) || "Highly rated openly licensed video discovered from Internet Archive.",
      thumbnail: "https://archive.org/services/img/" + encodeURIComponent(identifier),
      featured: false,
      discoverySource: "Internet Archive live catalog",
      archiveLicense: cleanText(doc.licenseurl, 300),
      episodes: [{
        id: "archive-live-" + identifier + "-full",
        title,
        season: 0,
        episode: 0,
        year: Number.isFinite(year) ? year : null,
        duration: "Archive video",
        description: "Exact playable file selected from Internet Archive metadata.",
        archiveId: identifier,
        archiveFile: file.name,
        thumbnail: "https://archive.org/services/img/" + encodeURIComponent(identifier),
      }],
    };
  }

  async function discoverShelf(shelf) {
    const response = await fetch(searchUrl(shelf), { credentials: "omit", referrerPolicy: "no-referrer" });
    if (!response.ok) return [];
    const docs = (await response.json()).response?.docs || [];
    const shows = [];
    for (const doc of docs) {
      if (shows.length >= RESULTS_PER_SHELF) break;
      if (BLOCKED_DISCOVERY_TERMS.test(cleanText([doc.title, doc.subject, doc.description], 1000))) continue;
      const file = await exactPlayableFile(doc.identifier).catch(() => null);
      if (file) shows.push(asShow(doc, shelf, file));
    }
    return shows;
  }

  function emit(results) {
    Object.entries(results).forEach(([bucket, shows]) => {
      window.dispatchEvent(new CustomEvent("starquest:archive-discovered", { detail: { bucket, shows } }));
    });
  }

  async function load() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.savedAt < CACHE_MS && cached.results) emit(cached.results);
    } catch (_) {}

    const results = {};
    for (const shelf of shelves) results[shelf.bucket] = await discoverShelf(shelf).catch(() => []);
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), results })); } catch (_) {}
    emit(results);
  }

  async function inspect(identifier) {
    const id = cleanText(identifier, 180);
    if (!id) return { ok: false, identifier: "", reason: "missing_identifier" };
    try {
      const file = await exactPlayableFile(id);
      return file
        ? { ok: true, identifier: id, file: file.name, size: Number(file.size || 0), source: file.source || "" }
        : { ok: false, identifier: id, reason: "no_playable_file" };
    } catch (error) {
      return { ok: false, identifier: id, reason: "metadata_error", message: String(error && error.message || error) };
    }
  }

  window.StarQuestArchiveDiscovery = { load, inspect };
})();
