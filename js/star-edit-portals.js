// Universal small Star edit portals for user-controlled worlds.
// The star is a compact edit affordance, not a favorite/rating control.
(function () {
  "use strict";

  const VERSION_KEY = "starquest_world_versions_v1";
  const MAX_VERSIONS_PER_WORLD = 30;

  function safeJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function activeWorldId() {
    return document.body.dataset.worldId || "world_starquest_default";
  }

  function loadVersions() {
    const value = safeJSON(VERSION_KEY, {});
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  }

  function saveVersions(value) {
    localStorage.setItem(VERSION_KEY, JSON.stringify(value));
  }

  function clean(value, max) {
    return String(value == null ? "" : value)
      .replace(/[<>`{}]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max || 100);
  }

  function snapshot(label, changes) {
    const worldId = activeWorldId();
    const all = loadVersions();
    const list = Array.isArray(all[worldId]) ? all[worldId] : [];
    const entry = {
      versionId: "version_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8),
      worldId,
      label: clean(label, 70) || "World edit",
      createdAt: Date.now(),
      changes: changes && typeof changes === "object" ? changes : {},
    };
    all[worldId] = [entry].concat(list).slice(0, MAX_VERSIONS_PER_WORLD);
    saveVersions(all);
    document.dispatchEvent(new CustomEvent("starquest:world-version-created", { detail: entry }));
    return entry;
  }

  function injectStyles() {
    if (document.getElementById("star-edit-portal-styles")) return;
    const style = document.createElement("style");
    style.id = "star-edit-portal-styles";
    style.textContent = `
      .star-edit-anchor { display:inline-flex; align-items:center; gap:.22em; }
      .star-edit-trigger {
        appearance:none; border:0; background:transparent; color:inherit;
        padding:0 .08em; margin:0; cursor:pointer; font:inherit;
        font-size:.54em; line-height:1; vertical-align:super; opacity:.82;
        transform:translateY(-.18em); text-shadow:0 0 10px currentColor;
      }
      .star-edit-trigger:hover, .star-edit-trigger:focus-visible { opacity:1; transform:translateY(-.18em) scale(1.22); }
      .star-edit-trigger:focus-visible { outline:2px solid var(--world-accent,#9c6cff); outline-offset:3px; border-radius:999px; }
      .star-edit-sheet { position:fixed; inset:0; z-index:10060; display:none; align-items:flex-end; justify-content:center; background:rgba(0,0,0,.68); backdrop-filter:blur(9px); }
      .star-edit-sheet.is-open { display:flex; }
      .star-edit-sheet__panel { width:min(680px,100%); max-height:88vh; overflow:auto; box-sizing:border-box; padding:18px; border-radius:22px 22px 0 0; color:var(--world-text,#fff); background:var(--world-surface,rgba(18,14,31,.98)); border:1px solid rgba(255,255,255,.2); box-shadow:0 -24px 70px rgba(0,0,0,.45); }
      .star-edit-sheet__header { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; }
      .star-edit-sheet__header h2 { margin:0; font-size:1.15rem; }
      .star-edit-sheet__header p { margin:.25rem 0 0; color:var(--world-muted,#ccc); font-size:.85rem; }
      .star-edit-sheet__close { border:0; background:transparent; color:inherit; font-size:1.45rem; cursor:pointer; }
      .star-edit-sheet__form { display:grid; gap:12px; margin-top:16px; }
      .star-edit-sheet__form label { display:grid; gap:6px; color:var(--world-muted,#ccc); font-size:.82rem; font-weight:700; }
      .star-edit-sheet__form input, .star-edit-sheet__form select { box-sizing:border-box; width:100%; padding:11px 12px; border-radius:10px; border:1px solid rgba(255,255,255,.2); color:inherit; background:rgba(0,0,0,.2); font:inherit; }
      .star-edit-sheet__actions { display:flex; flex-wrap:wrap; gap:8px; }
      .star-edit-sheet__actions button { border:1px solid rgba(255,255,255,.18); border-radius:9px; padding:9px 11px; color:inherit; background:rgba(255,255,255,.08); font:inherit; font-weight:700; cursor:pointer; }
      .star-edit-sheet__actions .primary { color:#fff; background:linear-gradient(135deg,var(--world-accent,#9c6cff),var(--world-accent-2,#4fd8ff)); }
      .star-version-list { display:grid; gap:8px; margin-top:15px; }
      .star-version { display:flex; justify-content:space-between; gap:12px; align-items:center; padding:10px; border:1px solid rgba(255,255,255,.13); border-radius:10px; background:rgba(255,255,255,.04); }
      .star-version small { color:var(--world-muted,#ccc); }
      @media (min-width:720px) { .star-edit-sheet { align-items:center; padding:18px; } .star-edit-sheet__panel { border-radius:22px; } }
    `;
    document.head.appendChild(style);
  }

  const registry = {
    companion: {
      title: "Companion identity",
      description: "Rename Cosmo and change the role shown in this world.",
      fields: [
        { name: "companionName", label: "Companion name", max: 40 },
        { name: "companionRole", label: "Companion role", max: 60 },
      ],
    },
    title: {
      title: "World title",
      description: "Change the public name without changing the permanent world ID.",
      fields: [{ name: "displayName", label: "World name", max: 60 }],
    },
    appearance: {
      title: "World appearance",
      description: "Open the complete theme and font controls for this version.",
      fields: [],
    },
  };

  let currentType = null;
  let sheet = null;
  let form = null;
  let versionList = null;

  function currentWorld() {
    if (window.StarQuestWorlds && typeof window.StarQuestWorlds.getActive === "function") {
      return window.StarQuestWorlds.getActive();
    }
    return {
      worldId: activeWorldId(),
      displayName: document.title.split(" — ")[0] || "StarQuest",
      companionName: clean((document.getElementById("ai-panel-title") || {}).textContent, 40).replace(/^✦\s*/, "").split(" — ")[0] || "Cosmo",
      companionRole: "AI Companion",
    };
  }

  function renderVersions() {
    const all = loadVersions();
    const items = Array.isArray(all[activeWorldId()]) ? all[activeWorldId()] : [];
    versionList.innerHTML = "";
    items.slice(0, 10).forEach((item) => {
      const row = document.createElement("div");
      row.className = "star-version";
      const text = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = item.label;
      const small = document.createElement("small");
      small.textContent = new Date(item.createdAt).toLocaleString();
      text.append(strong, document.createElement("br"), small);
      const restore = document.createElement("button");
      restore.type = "button";
      restore.textContent = "Restore";
      restore.addEventListener("click", () => restoreVersion(item));
      row.append(text, restore);
      versionList.appendChild(row);
    });
  }

  function restoreVersion(item) {
    if (!item || !item.changes) return;
    if (window.StarQuestWorlds && typeof window.StarQuestWorlds.patchActive === "function") {
      window.StarQuestWorlds.patchActive(item.changes, { createVersion: false });
    } else {
      document.dispatchEvent(new CustomEvent("starquest:world-edit-request", { detail: { changes: item.changes, restore: true } }));
    }
    sheet.classList.remove("is-open");
  }

  function openEditor(type) {
    currentType = registry[type] ? type : "appearance";
    const config = registry[currentType];
    const world = currentWorld();
    sheet.querySelector("h2").textContent = "⭐ " + config.title;
    sheet.querySelector(".star-edit-sheet__header p").textContent = config.description;
    form.innerHTML = "";

    config.fields.forEach((field) => {
      const label = document.createElement("label");
      label.textContent = field.label;
      const input = document.createElement("input");
      input.name = field.name;
      input.maxLength = field.max;
      input.value = clean(world[field.name], field.max);
      label.appendChild(input);
      form.appendChild(label);
    });

    const label = document.createElement("label");
    label.textContent = "Version name";
    const versionName = document.createElement("input");
    versionName.name = "versionLabel";
    versionName.maxLength = 70;
    versionName.placeholder = "Example: Moon Dust title v2";
    label.appendChild(versionName);
    form.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "star-edit-sheet__actions";
    const save = document.createElement("button");
    save.type = "submit";
    save.className = "primary";
    save.textContent = config.fields.length ? "Save Version" : "Open Full Builder";
    actions.appendChild(save);
    form.appendChild(actions);
    renderVersions();
    sheet.classList.add("is-open");
    if (config.fields.length) setTimeout(() => form.querySelector("input")?.focus(), 0);
  }

  function createUI() {
    sheet = document.createElement("div");
    sheet.className = "star-edit-sheet";
    sheet.innerHTML = `
      <section class="star-edit-sheet__panel" role="dialog" aria-modal="true" aria-labelledby="star-edit-title">
        <div class="star-edit-sheet__header"><div><h2 id="star-edit-title">⭐ Edit</h2><p></p></div><button class="star-edit-sheet__close" type="button" aria-label="Close edit portal">×</button></div>
        <form class="star-edit-sheet__form"></form>
        <div class="star-version-list" aria-label="Saved versions"></div>
      </section>`;
    document.body.appendChild(sheet);
    form = sheet.querySelector("form");
    versionList = sheet.querySelector(".star-version-list");
    sheet.querySelector(".star-edit-sheet__close").addEventListener("click", () => sheet.classList.remove("is-open"));
    sheet.addEventListener("click", (event) => { if (event.target === sheet) sheet.classList.remove("is-open"); });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const config = registry[currentType];
      if (!config.fields.length) {
        sheet.classList.remove("is-open");
        document.querySelector(".world-builder-launch")?.click();
        return;
      }
      const data = new FormData(form);
      const changes = {};
      config.fields.forEach((field) => { changes[field.name] = clean(data.get(field.name), field.max); });
      const entry = snapshot(data.get("versionLabel") || config.title, changes);
      if (window.StarQuestWorlds && typeof window.StarQuestWorlds.patchActive === "function") {
        window.StarQuestWorlds.patchActive(changes, { createVersion: false });
      } else {
        document.dispatchEvent(new CustomEvent("starquest:world-edit-request", { detail: { changes, version: entry } }));
      }
      sheet.classList.remove("is-open");
    });
  }

  function attachStar(target, type, label) {
    if (!target || target.dataset.starEditAttached === "true") return;
    target.dataset.starEditAttached = "true";
    target.classList.add("star-edit-anchor");
    const star = document.createElement("button");
    star.type = "button";
    star.className = "star-edit-trigger";
    star.textContent = "⭐";
    star.setAttribute("aria-label", label || "Edit this item");
    star.title = label || "Edit this item";
    star.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor(type);
    });
    target.appendChild(star);
  }

  function discoverEditableItems() {
    attachStar(document.getElementById("ai-panel-title"), "companion", "Rename and adjust companion");
    const titles = document.querySelectorAll(".logo, .brand, .navbar__logo, [data-world-title]");
    titles.forEach((node) => attachStar(node, "title", "Edit world title"));
    attachStar(document.querySelector(".world-builder-launch"), "appearance", "Edit theme, font, and world design");
  }

  injectStyles();
  createUI();
  discoverEditableItems();
  document.addEventListener("starquest:world-changed", discoverEditableItems);
  new MutationObserver(discoverEditableItems).observe(document.body, { childList: true, subtree: true });

  window.StarEditPortals = { open: openEditor, snapshot, loadVersions };
})();
