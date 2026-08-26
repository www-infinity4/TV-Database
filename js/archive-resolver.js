// Repairs Archive.org episode playback when playlist indexes are unreliable.
// Loaded after app.js so it can observe the existing player without changing its visual design.
(function () {
  "use strict";

  const VIDEO_EXT = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
  const DERIVATIVE_PENALTY = /(thumb|preview|sample|spectrogram|waveform|subtitle|trailer)/i;
  const metadataCache = new Map();
  let resolutionToken = 0;
  let internalChange = false;

  const frame = document.getElementById("player-frame");
  const video = document.getElementById("player-video");
  const titleNode = document.getElementById("player-ep-title");
  const loading = document.getElementById("player-loading");
  const error = document.getElementById("player-error");
  const errorLink = document.getElementById("player-error-link");

  if (!frame || !video || !titleNode) return;

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function playerContext() {
    const text = titleNode.textContent || "";
    const match = text.match(/^(.*?)\s+—\s+(?:S(\d+)E(\d+)|Movie):\s*(.*)$/i);
    return {
      showTitle: match ? match[1].trim() : "",
      season: match && match[2] ? Number(match[2]) : null,
      episode: match && match[3] ? Number(match[3]) : null,
      episodeTitle: match ? match[4].trim() : text.trim(),
    };
  }

  function archiveIdFromUrl(value) {
    try {
      const url = new URL(value, window.location.href);
      const marker = "/embed/";
      const position = url.pathname.indexOf(marker);
      return position >= 0 ? decodeURIComponent(url.pathname.slice(position + marker.length).split("/")[0]) : "";
    } catch (_) {
      return "";
    }
  }

  async function getMetadata(identifier) {
    if (!metadataCache.has(identifier)) {
      metadataCache.set(identifier, fetch("https://archive.org/metadata/" + encodeURIComponent(identifier), {
        mode: "cors",
        credentials: "omit",
        referrerPolicy: "no-referrer",
      }).then((response) => {
        if (!response.ok) throw new Error("Archive metadata returned " + response.status);
        return response.json();
      }));
    }
    return metadataCache.get(identifier);
  }

  function episodePatterns(context) {
    const patterns = [];
    if (Number.isInteger(context.season) && Number.isInteger(context.episode)) {
      const s = String(context.season).padStart(2, "0");
      const e = String(context.episode).padStart(2, "0");
      patterns.push("s" + s + "e" + e, s + "x" + e, "season " + context.season + " episode " + context.episode);
    }
    const title = normalize(context.episodeTitle);
    if (title.length > 3) patterns.push(title);
    return patterns;
  }

  function scoreFile(file, context, position) {
    const name = String(file.name || "");
    if (!VIDEO_EXT.test(name)) return -Infinity;
    const normalizedName = normalize(name);
    let score = 0;
    if (DERIVATIVE_PENALTY.test(name)) score -= 80;
    if (/\.mp4$/i.test(name)) score += 18;
    if (/512kb|h\.264|mpeg4|derivative/i.test(name)) score += 6;
    if (file.source === "original") score += 8;

    for (const pattern of episodePatterns(context)) {
      const normalizedPattern = normalize(pattern);
      if (normalizedPattern && normalizedName.includes(normalizedPattern)) score += normalizedPattern === normalize(context.episodeTitle) ? 120 : 150;
    }

    // Reading Rainbow stores most episodes as separate archive items. In that
    // case select the strongest playable file instead of applying index=0.
    if (/^ReadingRainbow/i.test(String(file._archiveIdentifier || ""))) score += 10;

    // Stable tie breaker only; never use a guessed playlist position as proof.
    score -= position / 10000;
    return score;
  }

  function selectFile(metadata, identifier, context) {
    const files = Array.isArray(metadata.files) ? metadata.files : [];
    const candidates = files.map((file, index) => ({ ...file, _archiveIdentifier: identifier, _index: index }));
    const ranked = candidates
      .map((file) => ({ file, score: scoreFile(file, context, file._index) }))
      .filter((entry) => Number.isFinite(entry.score))
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) return null;

    // Complete-series items must have an episode-pattern match. This prevents
    // Alfred Hitchcock from silently playing whichever file occupies a guessed index.
    // A few files usually mean one program plus format derivatives. Large
    // collections still require a season/episode/title match.
    const isCollection = ranked.length > 4;
    if (isCollection && ranked[0].score < 100) return null;
    return ranked[0].file;
  }

  function directUrl(identifier, filename) {
    return "https://archive.org/download/" + encodeURIComponent(identifier) + "/" +
      String(filename).split("/").map(encodeURIComponent).join("/");
  }

  function showFallback(identifier, message) {
    if (loading) loading.style.display = "none";
    if (error) {
      error.style.display = "flex";
      const messageNode = error.querySelector("p");
      if (messageNode) messageNode.textContent = message;
    }
    if (errorLink) {
      errorLink.href = "https://archive.org/details/" + encodeURIComponent(identifier);
      errorLink.textContent = "Open the verified Archive.org item";
    }
  }

  async function resolveArchiveEpisode(identifier, context, startSeconds) {
    if (!identifier) return;
    const token = ++resolutionToken;

    try {
      const metadata = await getMetadata(identifier);
      if (token !== resolutionToken) return;
      const file = selectFile(metadata, identifier, context);
      if (!file) {
        showFallback(identifier, "This episode could not be matched safely. Open the verified archive item instead of playing the wrong episode.");
        return;
      }

      internalChange = true;
      frame.style.display = "none";
      frame.src = "about:blank";
      video.style.display = "block";
      const resumeAt = Math.max(0, Math.trunc(Number(startSeconds) || 0));
      video.onloadedmetadata = () => {
        const duration = Number(video.duration) || 0;
        if (resumeAt > 5 && (!duration || resumeAt < duration - 10)) video.currentTime = resumeAt;
      };
      video.oncanplay = () => {
        if (loading) loading.style.display = "none";
        if (error) error.style.display = "none";
      };
      video.onerror = () => {
        video.style.display = "none";
        showFallback(identifier, "The selected archive file is not available for direct playback. Open the verified source page instead.");
      };
      video.src = directUrl(identifier, file.name);
      video.load();
      document.dispatchEvent(new CustomEvent("starquest:archive-direct-playback", {
        detail: { identifier, startSeconds: resumeAt }
      }));
      const promise = video.play();
      if (promise && typeof promise.catch === "function") promise.catch(() => {});
      window.setTimeout(() => { internalChange = false; }, 0);
    } catch (problem) {
      if (token !== resolutionToken) return;
      console.warn("Archive episode resolution failed:", problem);
      showFallback(identifier, "The archive source is temporarily unavailable. You can still open its verified source page.");
    }
  }

  async function resolveCurrentFrame() {
    if (internalChange) return;
    const identifier = archiveIdFromUrl(frame.src);
    if (!identifier) return;
    let startSeconds = 0;
    try { startSeconds = Number(new URL(frame.src).searchParams.get("start")) || 0; } catch (_) {}
    return resolveArchiveEpisode(identifier, playerContext(), startSeconds);
  }

  document.addEventListener("starquest:resolve-archive-episode", (event) => {
    const detail = event && event.detail ? event.detail : {};
    const identifier = String(detail.identifier || "");
    if (!identifier) return;
    internalChange = false;
    frame.style.display = "none";
    frame.src = "about:blank";
    video.style.display = "none";
    if (error) error.style.display = "none";
    if (loading) loading.style.display = "flex";
    resolveArchiveEpisode(identifier, {
      showTitle: String(detail.showTitle || ""),
      season: Number.isInteger(detail.season) ? detail.season : null,
      episode: Number.isInteger(detail.episode) ? detail.episode : null,
      episodeTitle: String(detail.episodeTitle || "")
    }, Number(detail.startSeconds) || 0);
  });

  const observer = new MutationObserver(() => {
    if (archiveIdFromUrl(frame.src)) {
      resolveCurrentFrame();
    } else {
      // A YouTube/direct-video selection supersedes every older Archive fetch.
      // Invalidating here prevents a late metadata response from replacing the
      // newly selected source and leaving an Archive page over YouTube audio.
      resolutionToken += 1;
      internalChange = false;
    }
  });
  observer.observe(frame, { attributes: true, attributeFilter: ["src"] });

  frame.addEventListener("load", () => {
    if (archiveIdFromUrl(frame.src)) resolveCurrentFrame();
  });
})();
