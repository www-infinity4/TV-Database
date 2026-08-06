import fs from "node:fs";
import vm from "node:vm";

const file = new URL("../js/data.js", import.meta.url);
const source = fs.readFileSync(file, "utf8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source + "\nthis.__SHOWS__ = SHOWS;", sandbox);

// Catalog policy: discovery may nominate highly rated titles, but an item is
// only wired into playback after Archive metadata identifies one exact file.
const AUTO_IMPORT_MIN_SCORE = 7;
const BLOCKED_SEQUENCE_IDS = new Set([
  // The catalog describes paired book stories, while this Archive item uses
  // a different individual-episode order. A numeric index would be wrong.
  "the-berenstain-bears-1985",
]);

const episodes = sandbox.__SHOWS__.flatMap(show =>
  Number(show.score) >= AUTO_IMPORT_MIN_SCORE
    ? (show.episodes || []).filter(ep => ep.archiveId && Number.isInteger(ep.archiveIndex))
      .map(ep => ({ ...ep, showTitle: show.title, showScore: Number(show.score) }))
    : []
);
const ids = [...new Set(episodes.map(ep => ep.archiveId))];
const metadata = new Map();

for (const id of ids) {
  const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(id)}`);
  if (!response.ok) continue;
  metadata.set(id, await response.json());
}

const video = /\.(mp4|m4v|webm|ogv|ogg|mov|mpg|mpeg)$/i;
const bad = /(thumb|preview|sample|spectrogram|waveform|subtitle|trailer)/i;
const norm = value => String(value || "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();

function rank(ep, entry) {
  const name = String(entry.name || "");
  if (!video.test(name)) return -Infinity;
  const normalized = norm(name);
  const title = norm(ep.title);
  const s = String(ep.season).padStart(2, "0");
  const e = String(ep.episode).padStart(2, "0");
  let score = 0;
  if (bad.test(name)) score -= 100;
  if (/\.mp4$/i.test(name)) score += 18;
  if (entry.source === "original") score += 8;
  if (normalized.includes(`s${s}e${e}`)) score += 180;
  if (normalized.includes(`${s}x${e}`)) score += 170;
  if (normalized.includes(`season ${Number(ep.season)} episode ${Number(ep.episode)}`)) score += 160;
  if (title.length > 3 && normalized.includes(title)) score += 140;
  return score;
}

function deterministicFile(ep, files) {
  if (BLOCKED_SEQUENCE_IDS.has(ep.archiveId)) return null;
  const candidates = files.filter(entry => video.test(String(entry.name || "")) && !bad.test(String(entry.name || "")));
  const displayedNumber = String(Number(ep.episode)).padStart(2, "0");
  // This collection stores 21 files in continuous order even though the UI
  // restarts episode numbering for Season 2.
  const number = ep.archiveId === "incredible-hulk-1994-complete-series"
    ? String(Number(ep.archiveIndex) + 1).padStart(2, "0")
    : displayedNumber;
  const rules = {
    "the-incredble-hulk-1966-complete-series-english": new RegExp(`\\b1${number}\\s+-`, "i"),
    "incredible-hulk-1994-complete-series": new RegExp(`\\bEpisode\\s+${number}[- .]`, "i"),
    "heathcliff-and-the-catillac-cats-1984-complete-series": new RegExp(`\\bHeathcliff\\s+E${number}\\s+-`, "i"),
  };
  const rule = rules[ep.archiveId];
  let matches = rule ? candidates.filter(entry => rule.test(String(entry.name || ""))) : candidates;
  if (matches.length > 1) {
    const originalMp4 = matches.filter(entry => entry.source === "original" && /\.mp4$/i.test(entry.name) && !/\.ia\.mp4$/i.test(entry.name));
    if (originalMp4.length === 1) matches = originalMp4;
    else {
      const directMp4 = matches.filter(entry => /\.mp4$/i.test(entry.name) && !/\.ia\.mp4$/i.test(entry.name));
      if (directMp4.length === 1) matches = directMp4;
    }
  }
  return matches.length === 1 ? matches[0] : null;
}

const mappings = [];
for (const ep of episodes) {
  const files = metadata.get(ep.archiveId)?.files || [];
  const deterministic = deterministicFile(ep, files);
  if (deterministic) {
    mappings.push({ id: ep.id, archiveId: ep.archiveId, archiveIndex: ep.archiveIndex, archiveFile: deterministic.name, score: 250, method: "deterministic" });
    continue;
  }
  const ranked = files.map(entry => ({ entry, score: rank(ep, entry) }))
    .filter(item => Number.isFinite(item.score)).sort((a, b) => b.score - a.score);
  if (!ranked.length || ranked[0].score < 120) continue;
  if (ranked[1] && ranked[0].score === ranked[1].score && ranked[0].entry.name !== ranked[1].entry.name) continue;
  mappings.push({ id: ep.id, archiveId: ep.archiveId, archiveIndex: ep.archiveIndex, archiveFile: ranked[0].entry.name, score: ranked[0].score, method: "episode metadata" });
}

let updated = source;
for (const match of mappings) {
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const marker = new RegExp(`(id:\\s*"${escape(match.id)}"[\\s\\S]*?archiveId:\\s*"${escape(match.archiveId)}"),\\s*archiveIndex:\\s*${match.archiveIndex},`);
  updated = updated.replace(marker, `$1, archiveFile: ${JSON.stringify(match.archiveFile)},`);
}

const updatedSandbox = {};
vm.createContext(updatedSandbox);
vm.runInContext(updated + "\nthis.__SHOWS__ = SHOWS;", updatedSandbox);
const exactFileCount = updatedSandbox.__SHOWS__.reduce((count, show) =>
  count + (show.episodes || []).filter(ep => ep.archiveId && ep.archiveFile).length, 0);

fs.writeFileSync(file, updated);
fs.writeFileSync(new URL("archive-resolution-report.json", import.meta.url), JSON.stringify({
  generatedAt: new Date().toISOString(),
  minimumCatalogScore: AUTO_IMPORT_MIN_SCORE,
  examined: episodes.length,
  resolved: mappings.length,
  unresolved: episodes.length - mappings.length,
  exactFileCount,
  mappings,
}, null, 2) + "\n");
console.log(JSON.stringify({ examined: episodes.length, resolved: mappings.length, unresolved: episodes.length - mappings.length }));
