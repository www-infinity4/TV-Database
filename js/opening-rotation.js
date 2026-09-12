/** StarQuest opening rotation — daily scheduled pick plus a no-repeat surprise deck. */
(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest.opening.rotation.v2";

  function safeStorage(candidate) {
    if (candidate) return candidate;
    try { return global.localStorage; } catch (_) { return null; }
  }

  function readState(storage) {
    if (!storage) return { lastId: "", queue: [], dayKey: "", dailyId: "" };
    try {
      const saved = JSON.parse(storage.getItem(STORAGE_KEY) || "{}");
      return {
        lastId: typeof saved.lastId === "string" ? saved.lastId : "",
        queue: Array.isArray(saved.queue) ? saved.queue.filter((id) => typeof id === "string") : [],
        dayKey: typeof saved.dayKey === "string" ? saved.dayKey : "",
        dailyId: typeof saved.dailyId === "string" ? saved.dailyId : ""
      };
    } catch (_) {
      return { lastId: "", queue: [], dayKey: "", dailyId: "" };
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

  function localDay(dateValue) {
    const date = dateValue instanceof Date ? dateValue : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return {
      key: year + "-" + month + "-" + day,
      serial: Math.floor(Date.UTC(year, date.getMonth(), date.getDate()) / 86400000)
    };
  }

  function uniqueCandidates(orderedCandidates) {
    return (Array.isArray(orderedCandidates) ? orderedCandidates : [])
      .filter((show, index, values) => show && typeof show.id === "string" &&
        values.findIndex((item) => item && item.id === show.id) === index);
  }

  function chooseDaily(candidates, storage, state, dateValue) {
    const byId = new Map(candidates.map((show) => [show.id, show]));
    const today = localDay(dateValue);
    if (state.dayKey === today.key && byId.has(state.dailyId)) {
      return byId.get(state.dailyId);
    }

    let index = ((today.serial % candidates.length) + candidates.length) % candidates.length;
    let selected = candidates[index];
    if (selected.id === state.lastId && candidates.length > 1) {
      selected = candidates[(index + 1) % candidates.length];
    }

    writeState(storage, {
      lastId: selected.id,
      queue: state.queue.filter((id) => byId.has(id) && id !== selected.id),
      dayKey: today.key,
      dailyId: selected.id
    });
    return selected;
  }

  function chooseFromDeck(candidates, storage, state, random) {
    const byId = new Map(candidates.map((show) => [show.id, show]));
    let queue = state.queue.filter((id, index, values) => byId.has(id) && values.indexOf(id) === index);
    if (!queue.length) {
      const freshIds = candidates.map((show) => show.id).filter((id) => id !== state.lastId);
      queue = shuffled(freshIds, random);
      if (!queue.length) queue = [candidates[0].id];
    }

    let nextId = queue.shift();
    if (nextId === state.lastId && candidates.length > 1) {
      const alternate = candidates.find((show) => show.id !== state.lastId);
      nextId = alternate ? alternate.id : nextId;
    }
    const selected = byId.get(nextId) || candidates[0];
    writeState(storage, {
      lastId: selected.id,
      queue,
      dayKey: state.dayKey,
      dailyId: state.dailyId
    });
    return selected;
  }

  function choose(orderedCandidates, options) {
    const config = options || {};
    const random = typeof config.random === "function" ? config.random : Math.random;
    const storage = safeStorage(config.storage);
    const candidates = uniqueCandidates(orderedCandidates);
    if (!candidates.length) return null;
    const state = readState(storage);
    return config.daily
      ? chooseDaily(candidates, storage, state, config.date)
      : chooseFromDeck(candidates, storage, state, random);
  }

  function nextChangeAt(dateValue) {
    const now = dateValue instanceof Date ? new Date(dateValue.getTime()) : new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  }

  function kind(show) {
    return String(show && show.type || "").toLowerCase() === "movie" ? "Movie" : "Show";
  }

  global.StarQuestOpening = { choose, kind, localDay, nextChangeAt, storageKey: STORAGE_KEY };
})(window);
