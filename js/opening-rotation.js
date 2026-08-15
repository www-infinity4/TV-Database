/** StarQuest opening rotation — a no-repeat deck of playable opening picks. */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest.opening.rotation.v1";
  const MAX_OPENING_POOL = 18;

  function safeStorage(candidate) {
    if (candidate) return candidate;
    try { return global.localStorage; } catch (_) { return null; }
  }

  function readState(storage) {
    if (!storage) return { lastId: "", queue: [] };
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
      return {
        lastId: typeof saved.lastId === "string" ? saved.lastId : "",
        queue: Array.isArray(saved.queue) ? saved.queue.filter((id) => typeof id === "string") : [],
      };
    } catch (_) {
      return { lastId: "", queue: [] };
    }
  }

  function writeState(storage, state) {
    if (!storage) return;
    try { storage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function shuffled(values, random) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function choose(orderedCandidates, options) {
    const config = options || {};
    const random = typeof config.random === "function" ? config.random : Math.random;
    const storage = safeStorage(config.storage);
    const candidates = (Array.isArray(orderedCandidates) ? orderedCandidates : [])
      .filter((show) => show && typeof show.id === "string")
      .slice(0, MAX_OPENING_POOL);
    if (!candidates.length) return null;

    const byId = new Map(candidates.map((show) => [show.id, show]));
    const state = readState(storage);
    let queue = state.queue.filter((id, index, values) => byId.has(id) && values.indexOf(id) === index);

    if (!queue.length) {
      const freshIds = candidates.map((show) => show.id).filter((id) => id !== state.lastId);
      queue = shuffled(freshIds, random);
      if (!queue.length) queue = [candidates[0].id];
    }

    let nextId = queue.shift();
    if (nextId === state.lastId && candidates.length > 1) {
      const replacementIndex = queue.findIndex((id) => id !== state.lastId);
      if (replacementIndex >= 0) {
        queue.push(nextId);
        nextId = queue.splice(replacementIndex, 1)[0];
      } else {
        nextId = candidates.find((show) => show.id !== state.lastId).id;
      }
    }

    const selected = byId.get(nextId) || candidates[0];
    writeState(storage, { lastId: selected.id, queue });
    return selected;
  }

  function kind(show) {
    return String(show && show.type || "").toLowerCase() === "movie" ? "Movie" : "Show";
  }

  global.StarQuestOpening = { choose, kind, storageKey: STORAGE_KEY };
})(window);
