import fs from "node:fs";
import vm from "node:vm";

const file = new URL("../js/data.js", import.meta.url);
const source = fs.readFileSync(file, "utf8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(source + "\nthis.__SHOWS__ = SHOWS;", sandbox);

const episodes = sandbox.__SHOWS__.flatMap(show =>
  (show.episodes || []).filter(ep => ep.archiveId && Number.isInteger(ep.archiveIndex))
    .map(ep => ({ ...ep, showTitle: show.title }))
);
const ids = [...new Set(episodes.map(ep => ep.archiveId))];
const metadata = new Map();

for (const id of ids) {
  const response = await fetch(`https://archive.org/metadata/${encodeURIComponent(id)}`);
  if (!response.ok) continue;
  metadata.set(id, await response.json());
}

const video = /\.(mp4|m4v|webm|ogv|ogg|mov)$/i;
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

const mappings = [];
for (const ep of episodes) {
  const files = metadata.get(ep.archiveId)?.files || [];
  const ranked = files.map(entry => ({ entry, score: rank(ep, entry) }))
    .filter(item => Number.isFinite(item.score)).sort((a, b) => b.score - a.score);
  if (!ranked.length || ranked[0].score < 120) continue;
  if (ranked[1] && ranked[0].score === ranked[1].score && ranked[0].entry.name !== ranked[1].entry.name) continue;
  mappings.push({ id: ep.id, archiveId: ep.archiveId, archiveIndex: ep.archiveIndex, archiveFile: ranked[0].entry.name, score: ranked[0].score });
}

let updated = source;
for (const match of mappings) {
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const marker = new RegExp(`(id:\\s*"${escape(match.id)}"[\\s\\S]*?archiveId:\\s*"${escape(match.archiveId)}"),\\s*archiveIndex:\\s*${match.archiveIndex},`);
  updated = updated.replace(marker, `$1, archiveFile: ${JSON.stringify(match.archiveFile)},`);
}

fs.writeFileSync(file, updated);
fs.writeFileSync(new URL("archive-resolution-report.json", import.meta.url), JSON.stringify({
  generatedAt: new Date().toISOString(),
  examined: episodes.length,
  resolved: mappings.length,
  unresolved: episodes.length - mappings.length,
  mappings,
}, null, 2) + "\n");
console.log(JSON.stringify({ examined: episodes.length, resolved: mappings.length, unresolved: episodes.length - mappings.length }));
