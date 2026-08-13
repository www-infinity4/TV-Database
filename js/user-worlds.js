// User-controlled worlds and renameable companion prototype.
// Safe customization only: validated text, curated themes, and curated font stacks.
(function () {
  "use strict";

  const STORAGE_KEY = "starquest_user_worlds_v1";
  const ACTIVE_KEY = "starquest_active_world_v1";
  const DEFAULT_WORLD = {
    worldId: "world_starquest_default",
    displayName: "StarQuest",
    subtitle: "Classic entertainment, discoveries, and creations",
    companionName: "Cosmo",
    companionRole: "AI Companion",
    theme: "starquest",
    font: "system",
    focus: "classic television",
    stage: "draft",
    createdAt: 0,
    updatedAt: 0,
  };

  const THEMES = {
    starquest: {
      label: "StarQuest",
      background: "radial-gradient(circle at 20% 10%, #38245f 0%, #151027 42%, #07070d 100%)",
      surface: "rgba(18, 14, 31, 0.93)",
      text: "#f8f6ff",
      muted: "#c7c0dc",
      accent: "#9c6cff",
      accent2: "#4fd8ff",
    },
    moonDust: {
      label: "Moon Dust",
      background: "radial-gradient(circle at 70% 5%, #d7d1e5 0%, #676077 18%, #22202b 48%, #09090d 100%)",
      surface: "rgba(24, 23, 31, 0.92)",
      text: "#fffefe",
      muted: "#d6d0de",
      accent: "#d8c8ff",
      accent2: "#a8ecff",
    },
    river: {
      label: "River & Fishing",
      background: "linear-gradient(145deg, #062d35 0%, #0b5961 34%, #123d34 66%, #081c1c 100%)",
      surface: "rgba(5, 38, 42, 0.93)",
      text: "#effffb",
      muted: "#b8ddd4",
      accent: "#55e3c2",
      accent2: "#86cfff",
    },
    gallery: {
      label: "Art Gallery",
      background: "linear-gradient(145deg, #f0e9dc 0%, #c6b9a4 42%, #7b6d61 100%)",
      surface: "rgba(251, 247, 239, 0.94)",
      text: "#241f1b",
      muted: "#665c54",
      accent: "#7b3f2f",
      accent2: "#9b742d",
    },
    neon: {
      label: "Neon Night",
      background: "radial-gradient(circle at 50% 0%, #32104f 0%, #10071c 45%, #020205 100%)",
      surface: "rgba(9, 5, 18, 0.94)",
      text: "#ffffff",
      muted: "#d8baf0",
      accent: "#ff55e7",
      accent2: "#50f3ff",
    },
  };

  const FONTS = {
    system: { label: "Modern System", stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    editorial: { label: "Editorial", stack: "Georgia, 'Times New Roman', serif" },
    technical: { label: "Technical", stack: "'Courier New', Courier, monospace" },
    friendly: { label: "Friendly", stack: "Trebuchet MS, Verdana, sans-serif" },
  };

  function cleanText(value, fallback, maxLength) {
    const text = String(value == null ? "" : value)
      .replace(/[<>`{}]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength || 80);
    return text || fallback;
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "world_" + window.crypto.randomUUID();
    }
    return "world_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
  }

  function readJSON(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  }

  function normalizeWorld(input) {
    const now = Date.now();
    const value = input && typeof input === "object" ? input : {};
    return {
      worldId: cleanText(value.worldId, createId(), 100),
      displayName: cleanText(value.displayName, "My Entertainment World", 60),
      subtitle: cleanText(value.subtitle, "A world built around what I enjoy", 120),
      companionName: cleanText(value.companionName, "Cosmo", 40),
      companionRole: cleanText(value.companionRole, "AI Companion", 60),
      theme: Object.prototype.hasOwnProperty.call(THEMES, value.theme) ? value.theme : "starquest",
      font: Object.prototype.hasOwnProperty.call(FONTS, value.font) ? value.font : "system",
      focus: cleanText(value.focus, "entertainment", 80),
      stage: ["draft", "preview", "published", "fired"].includes(value.stage) ? value.stage : "draft",
      createdAt: Number.isFinite(Number(value.createdAt)) ? Number(value.createdAt) : now,
      updatedAt: now,
    };
  }

  function loadWorlds() {
    const worlds = readJSON(STORAGE_KEY, []);
    return Array.isArray(worlds) ? worlds.map(normalizeWorld).slice(0, 40) : [];
  }

  function saveWorlds(worlds) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(worlds.slice(0, 40)));
  }

  function getActiveWorld(worlds) {
    const activeId = localStorage.getItem(ACTIVE_KEY);
    return worlds.find((world) => world.worldId === activeId) || DEFAULT_WORLD;
  }

  function applyWorld(world) {
    const normalized = world.worldId === DEFAULT_WORLD.worldId ? DEFAULT_WORLD : normalizeWorld(world);
    const theme = THEMES[normalized.theme] || THEMES.starquest;
    const font = FONTS[normalized.font] || FONTS.system;
    const root = document.documentElement;

    root.style.setProperty("--world-background", theme.background);
    root.style.setProperty("--world-surface", theme.surface);
    root.style.setProperty("--world-text", theme.text);
    root.style.setProperty("--world-muted", theme.muted);
    root.style.setProperty("--world-accent", theme.accent);
    root.style.setProperty("--world-accent-2", theme.accent2);
    document.body.style.background = theme.background;
    document.body.style.color = theme.text;
    document.body.style.fontFamily = font.stack;
    document.title = normalized.displayName + " — Entertainment World";
    document.body.dataset.worldId = normalized.worldId;
    document.body.dataset.worldTheme = normalized.theme;

    const logoCandidates = document.querySelectorAll("#nav-brand-name, .sidebar__logo span, [data-world-title]");
    logoCandidates.forEach((node) => {
      if (!node.dataset.originalWorldText) node.dataset.originalWorldText = node.textContent || "";
      node.textContent = normalized.displayName;
    });

    const aiTitle = document.getElementById("ai-panel-title") || document.getElementById("cosmo-title");
    if (aiTitle) aiTitle.textContent = "✦ " + normalized.companionName + " — " + normalized.companionRole;
    const aiSubtitle = document.querySelector(".ai-panel__subtitle");
    if (aiSubtitle) aiSubtitle.textContent = "Your guide for " + normalized.focus + ".";
    const aiInput = document.getElementById("ai-input") || document.getElementById("cosmo-input");
    if (aiInput) aiInput.placeholder = "Ask " + normalized.companionName + " about this world…";
    const aiClose = document.getElementById("ai-panel-close");
    if (aiClose) aiClose.setAttribute("aria-label", "Close " + normalized.companionName);

    document.querySelectorAll(".btn-primary, .ai-send, .genre-pill.active").forEach((node) => {
      node.style.background = "linear-gradient(135deg, " + theme.accent + ", " + theme.accent2 + ")";
    });

    document.dispatchEvent(new CustomEvent("starquest:world-changed", { detail: { world: normalized } }));
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .world-builder-launch {
        position: fixed; right: 18px; bottom: 86px; z-index: 9998;
        border: 1px solid rgba(255,255,255,.22); border-radius: 999px;
        padding: 10px 15px; font: inherit; font-weight: 750; cursor: pointer;
        color: var(--world-text, #fff);
        background: linear-gradient(135deg, var(--world-accent, #8d5cff), var(--world-accent-2, #38cfff));
        box-shadow: 0 12px 34px rgba(0,0,0,.35);
      }
      .world-builder {
        position: fixed; inset: 0; z-index: 10020; display: none;
        align-items: center; justify-content: center; padding: 18px;
        background: rgba(0,0,0,.72); backdrop-filter: blur(10px);
      }
      .world-builder.is-open { display: flex; }
      .world-builder__panel {
        width: min(920px, 100%); max-height: 90vh; overflow: auto;
        border: 1px solid rgba(255,255,255,.2); border-radius: 22px;
        padding: 20px; color: var(--world-text, #fff);
        background: var(--world-surface, rgba(18,14,31,.96));
        box-shadow: 0 28px 80px rgba(0,0,0,.5);
      }
      .world-builder__header { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; }
      .world-builder__header h2 { margin:0 0 4px; }
      .world-builder__header p { margin:0; color:var(--world-muted,#ccc); }
      .world-builder__close { border:0; background:transparent; color:inherit; font-size:24px; cursor:pointer; }
      .world-builder__layout { display:grid; grid-template-columns:minmax(0,1fr) minmax(260px,.8fr); gap:20px; margin-top:20px; }
      .world-builder__form { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
      .world-builder__field { display:flex; flex-direction:column; gap:6px; }
      .world-builder__field--wide { grid-column:1 / -1; }
      .world-builder label { font-size:.82rem; font-weight:750; color:var(--world-muted,#ccc); }
      .world-builder input, .world-builder select {
        width:100%; box-sizing:border-box; padding:11px 12px; border-radius:11px;
        border:1px solid rgba(255,255,255,.2); color:inherit; background:rgba(0,0,0,.2); font:inherit;
      }
      .world-builder__actions { grid-column:1 / -1; display:flex; flex-wrap:wrap; gap:10px; margin-top:4px; }
      .world-builder__button { border:1px solid rgba(255,255,255,.2); border-radius:10px; padding:10px 13px; cursor:pointer; color:inherit; background:rgba(255,255,255,.08); font:inherit; font-weight:700; }
      .world-builder__button--primary { background:linear-gradient(135deg,var(--world-accent,#8d5cff),var(--world-accent-2,#38cfff)); color:#fff; }
      .world-list { display:flex; flex-direction:column; gap:9px; }
      .world-card { border:1px solid rgba(255,255,255,.16); border-radius:13px; padding:12px; background:rgba(255,255,255,.05); }
      .world-card__top { display:flex; justify-content:space-between; gap:10px; }
      .world-card h3 { margin:0 0 4px; font-size:1rem; }
      .world-card p { margin:0 0 9px; color:var(--world-muted,#ccc); font-size:.85rem; }
      .world-card__actions { display:flex; gap:7px; flex-wrap:wrap; }
      .world-card__actions button { border:0; border-radius:8px; padding:7px 9px; cursor:pointer; font:inherit; }
      .world-stage { font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; opacity:.75; }
      @media (max-width: 720px) {
        .world-builder__layout { grid-template-columns:1fr; }
        .world-builder__form { grid-template-columns:1fr; }
        .world-builder__field--wide, .world-builder__actions { grid-column:1; }
        .world-builder-launch { right:12px; bottom:78px; }
      }
    `;
    document.head.appendChild(style);
  }

  function makeOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  function buildUI() {
    injectStyles();
    const launch = document.createElement("button");
    launch.type = "button";
    launch.className = "world-builder-launch";
    launch.textContent = "Build My World";
    launch.setAttribute("aria-haspopup", "dialog");

    const overlay = document.createElement("div");
    overlay.className = "world-builder";
    overlay.innerHTML = `
      <section class="world-builder__panel" role="dialog" aria-modal="true" aria-labelledby="world-builder-title">
        <div class="world-builder__header">
          <div><h2 id="world-builder-title">Build Your Entertainment World</h2><p>Name it, style it, and rename your companion. Public Star firing comes later.</p></div>
          <button class="world-builder__close" type="button" aria-label="Close world builder">×</button>
        </div>
        <div class="world-builder__layout">
          <form class="world-builder__form">
            <input type="hidden" name="worldId" />
            <div class="world-builder__field"><label>World name</label><input name="displayName" maxlength="60" placeholder="Moon Dust" required /></div>
            <div class="world-builder__field"><label>Focus</label><input name="focus" maxlength="80" placeholder="Fishing videos and outdoor auctions" /></div>
            <div class="world-builder__field world-builder__field--wide"><label>Subtitle</label><input name="subtitle" maxlength="120" placeholder="A world built around what I enjoy" /></div>
            <div class="world-builder__field"><label>Companion name</label><input name="companionName" maxlength="40" placeholder="Cosmo" /></div>
            <div class="world-builder__field"><label>Companion role</label><input name="companionRole" maxlength="60" placeholder="Fishing Guide" /></div>
            <div class="world-builder__field"><label>Theme</label><select name="theme"></select></div>
            <div class="world-builder__field"><label>Font</label><select name="font"></select></div>
            <div class="world-builder__actions">
              <button class="world-builder__button world-builder__button--primary" type="submit">Save and Apply</button>
              <button class="world-builder__button" type="button" data-action="new">New World</button>
              <button class="world-builder__button" type="button" data-action="default">Use StarQuest Default</button>
            </div>
          </form>
          <div><h3>Your Creations</h3><div class="world-list"></div></div>
        </div>
      </section>`;

    document.body.appendChild(launch);
    document.body.appendChild(overlay);

    const form = overlay.querySelector("form");
    const list = overlay.querySelector(".world-list");
    const themeSelect = form.elements.theme;
    const fontSelect = form.elements.font;
    Object.entries(THEMES).forEach(([key, theme]) => themeSelect.appendChild(makeOption(key, theme.label)));
    Object.entries(FONTS).forEach(([key, font]) => fontSelect.appendChild(makeOption(key, font.label)));

    function resetForm(world) {
      const value = world || {
        worldId: "",
        displayName: "",
        subtitle: "",
        companionName: "Cosmo",
        companionRole: "AI Companion",
        theme: "starquest",
        font: "system",
        focus: "entertainment",
      };
      Object.keys(value).forEach((key) => {
        if (form.elements[key]) form.elements[key].value = value[key];
      });
    }

    function renderList() {
      const worlds = loadWorlds();
      list.innerHTML = "";
      if (!worlds.length) {
        const empty = document.createElement("p");
        empty.textContent = "No saved worlds yet. Create Moon Dust, a fishing world, an art gallery, or anything that fits your interests.";
        list.appendChild(empty);
        return;
      }
      worlds.forEach((world) => {
        const card = document.createElement("article");
        card.className = "world-card";
        card.innerHTML = `<div class="world-card__top"><div><h3></h3><p></p></div><span class="world-stage"></span></div><div class="world-card__actions"><button data-action="apply">Open World</button><button data-action="edit">Edit</button><button data-action="delete">Delete Draft</button></div>`;
        card.querySelector("h3").textContent = world.displayName;
        card.querySelector("p").textContent = world.companionName + " · " + world.focus;
        card.querySelector(".world-stage").textContent = world.stage;
        card.addEventListener("click", (event) => {
          const action = event.target && event.target.dataset ? event.target.dataset.action : "";
          if (action === "apply") {
            localStorage.setItem(ACTIVE_KEY, world.worldId);
            applyWorld(world);
            overlay.classList.remove("is-open");
          } else if (action === "edit") {
            resetForm(world);
          } else if (action === "delete") {
            const next = loadWorlds().filter((item) => item.worldId !== world.worldId);
            saveWorlds(next);
            if (localStorage.getItem(ACTIVE_KEY) === world.worldId) {
              localStorage.removeItem(ACTIVE_KEY);
              applyWorld(DEFAULT_WORLD);
            }
            renderList();
          }
        });
        list.appendChild(card);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const worlds = loadWorlds();
      const formData = Object.fromEntries(new FormData(form).entries());
      const existing = worlds.find((world) => world.worldId === formData.worldId);
      const world = normalizeWorld({
        ...existing,
        ...formData,
        worldId: existing ? existing.worldId : createId(),
        createdAt: existing ? existing.createdAt : Date.now(),
      });
      const next = worlds.filter((item) => item.worldId !== world.worldId);
      next.unshift(world);
      saveWorlds(next);
      localStorage.setItem(ACTIVE_KEY, world.worldId);
      applyWorld(world);
      resetForm(world);
      renderList();
    });

    overlay.querySelector('[data-action="new"]').addEventListener("click", () => resetForm());
    overlay.querySelector('[data-action="default"]').addEventListener("click", () => {
      localStorage.removeItem(ACTIVE_KEY);
      applyWorld(DEFAULT_WORLD);
      overlay.classList.remove("is-open");
    });
    overlay.querySelector(".world-builder__close").addEventListener("click", () => overlay.classList.remove("is-open"));
    overlay.addEventListener("click", (event) => { if (event.target === overlay) overlay.classList.remove("is-open"); });
    launch.addEventListener("click", () => {
      const worlds = loadWorlds();
      resetForm(getActiveWorld(worlds).worldId === DEFAULT_WORLD.worldId ? null : getActiveWorld(worlds));
      renderList();
      overlay.classList.add("is-open");
    });

    return { renderList };
  }

  function start() {
    const worlds = loadWorlds();
    applyWorld(getActiveWorld(worlds));
    buildUI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
