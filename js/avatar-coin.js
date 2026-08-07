/**
 * Avatar Coin Crown Chain
 * Portable, append-only local design history for www-infinity4 sites.
 * Shared publishing uses the same record shape after the backend is deployed.
 */
(function (global) {
  "use strict";

  const SCHEMA = "avatar-coin-design/v2";
  const CHAIN_KEY = "infinity_avatar_coin_chain_v2";
  const IDENTITY_KEY = "infinity_avatar_coin_identity_v1";
  const SITE_ID = document.documentElement.dataset.avatarSite || "starquest";
  const SITE_SYMBOL = document.documentElement.dataset.avatarSymbol || "★";

  function parseJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value == null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function id(prefix) {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return prefix + ":" + global.crypto.randomUUID();
    }
    return prefix + ":" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  function identity() {
    const stored = parseJSON(IDENTITY_KEY, null);
    if (stored && stored.crownId) return stored;
    const created = {
      schema: "avatar-coin-identity/v1",
      crownId: id("crown"),
      createdAt: new Date().toISOString(),
      privacy: "private",
      recovery: "device-only",
      walletReference: null
    };
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(created));
    return created;
  }

  function canonical(value) {
    if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
    if (value && typeof value === "object") {
      return "{" + Object.keys(value).sort().map((key) => JSON.stringify(key) + ":" + canonical(value[key])).join(",") + "}";
    }
    return JSON.stringify(value);
  }

  async function hash(value) {
    const input = canonical(value);
    if (global.crypto && global.crypto.subtle && typeof TextEncoder !== "undefined") {
      const digest = await global.crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
      return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return "local-" + (h >>> 0).toString(16).padStart(8, "0");
  }

  function readChain() {
    const stored = parseJSON(CHAIN_KEY, { records: [] });
    return {
      records: Array.isArray(stored.records) ? stored.records.filter((record) => record && record.id) : []
    };
  }

  function writeChain(chain) {
    localStorage.setItem(CHAIN_KEY, JSON.stringify({ records: chain.records.slice(-250) }));
  }

  function current(siteId) {
    const records = readChain().records.filter((record) => record.siteId === (siteId || SITE_ID));
    return records.length ? records[records.length - 1] : null;
  }

  async function saveVersion(design, context) {
    const chain = readChain();
    const who = identity();
    const ctx = context || {};
    const previous = current(ctx.siteId || SITE_ID);
    const designId = ctx.designId || (previous && previous.designId) || id("avatar-design");
    const record = {
      schema: SCHEMA,
      id: id("avatar-version"),
      designId,
      crownId: who.crownId,
      siteId: ctx.siteId || SITE_ID,
      siteSymbol: ctx.siteSymbol || SITE_SYMBOL,
      name: String(design.name || "Untitled design").slice(0, 64),
      scope: design.scope || "site",
      targetKey: ctx.targetKey || "brand-name",
      targetLabel: ctx.targetLabel || "Site design",
      creationMode: design.mode || "human",
      author: ctx.author || "local-user",
      parentVersionId: ctx.parentVersionId === undefined ? (previous ? previous.id : null) : ctx.parentVersionId,
      forkedFromId: ctx.forkedFromId || null,
      version: previous && previous.designId === designId ? Number(previous.version || 0) + 1 : 1,
      settings: {
        theme: design.theme,
        cardSize: design.cardSize,
        autoAdapt: !!design.autoAdapt,
        overrides: design.overrides || {}
      },
      privacy: ctx.privacy || "private",
      license: ctx.license || "all-rights-reserved",
      status: "local-unpublished",
      createdAt: new Date().toISOString()
    };
    record.versionHash = await hash(record);
    chain.records.push(record);
    writeChain(chain);
    document.dispatchEvent(new CustomEvent("avatarcoin:chain-updated", { detail: { record } }));
    return record;
  }

  async function importRecord(input) {
    const source = typeof input === "string" ? JSON.parse(input) : input;
    if (!source || !source.id || !source.designId || !source.settings) {
      throw new Error("This is not a valid Avatar Coin design record.");
    }
    const chain = readChain();
    if (chain.records.some((record) => record.id === source.id)) return source;
    const imported = {
      ...source,
      schema: source.schema || SCHEMA,
      status: "imported-local",
      importedAt: new Date().toISOString()
    };
    chain.records.push(imported);
    writeChain(chain);
    document.dispatchEvent(new CustomEvent("avatarcoin:chain-updated", { detail: { record: imported } }));
    return imported;
  }

  async function fork(recordId, name) {
    const source = readChain().records.find((record) => record.id === recordId);
    if (!source) throw new Error("Parent design was not found.");
    return saveVersion({
      name: name || (source.name + " remix"),
      scope: source.scope,
      mode: "human",
      theme: source.settings.theme,
      cardSize: source.settings.cardSize,
      autoAdapt: false,
      overrides: { ...(source.settings.overrides || {}) }
    }, {
      designId: id("avatar-design"),
      parentVersionId: null,
      forkedFromId: source.id,
      targetKey: source.targetKey,
      targetLabel: source.targetLabel,
      siteId: source.siteId,
      siteSymbol: source.siteSymbol
    });
  }

  function exportChain() {
    return {
      schema: "avatar-coin-chain/v1",
      crownId: identity().crownId,
      exportedAt: new Date().toISOString(),
      records: readChain().records
    };
  }

  function mountMarkers(root, onOpen) {
    (root || document).querySelectorAll("[data-avatar-portal]").forEach((marker) => {
      if (marker.dataset.avatarMounted === "true") return;
      marker.dataset.avatarMounted = "true";
      marker.textContent = marker.dataset.avatarSymbol || SITE_SYMBOL;
      marker.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (typeof onOpen === "function") onOpen(marker, event);
      });
    });
  }

  global.AvatarCoinChain = {
    schema: SCHEMA,
    siteId: SITE_ID,
    siteSymbol: SITE_SYMBOL,
    identity,
    readChain,
    current,
    saveVersion,
    importRecord,
    fork,
    exportChain,
    mountMarkers
  };
})(window);
