/**
 * StarQuest — Authentication & User System
 * All data stored in localStorage. No backend required.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest_users";
  const SESSION_KEY = "starquest_session";
  const SYNC_HASH_PREFIX = "sync-";
  const SHARES_PER_COIN = 10;
  const SHARE_COOLDOWN_MS = 5 * 60 * 1000;
  const WATCH_SECONDS_PER_COIN = 3600;

  /* ── Secure password hashing using Web Crypto PBKDF2 ── */

  function getCryptoSubtle() {
    return global && global.crypto && global.crypto.subtle ? global.crypto.subtle : null;
  }

  async function hashPasswordAsync(password, username) {
    const enc = new TextEncoder();
    const subtle = getCryptoSubtle();
    if (!subtle) return hashPasswordSync(password, username);
    const keyMaterial = await subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const salt = enc.encode("starquest-v1-" + username.toLowerCase());
    const bits = await subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt, iterations: 100000 },
      keyMaterial,
      256
    );
    return Array.from(new Uint8Array(bits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  function hashPasswordSync(password, username) {
    const input = "starquest-v1-" + username.toLowerCase() + ":" + password;
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return "sync-" + h.toString(16);
  }

  function parseStoredJSON(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed == null ? fallback : parsed;
    } catch {
      return fallback;
    }
  }

  function toInt(value, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.trunc(n);
  }

  function createEventId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function dispatch(name, detail) {
    if (typeof document === "undefined") return;
    document.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function normalizeSession(session) {
    if (!session || typeof session !== "object") return null;
    const key = typeof session.key === "string" ? session.key.trim().toLowerCase() : "";
    const username = typeof session.username === "string" ? session.username.trim() : "";
    if (!key || !username) return null;
    return {
      key,
      username,
      signedInAt: toInt(session.signedInAt, Date.now()),
    };
  }

  function loadSession() {
    const raw = parseStoredJSON(SESSION_KEY, null);
    const normalized = normalizeSession(raw);
    if (!normalized) {
      if (raw) localStorage.removeItem(SESSION_KEY);
      return null;
    }
    if (
      !raw ||
      raw.key !== normalized.key ||
      raw.username !== normalized.username ||
      raw.signedInAt !== normalized.signedInAt ||
      Object.keys(raw).length !== 3
    ) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized));
    }
    return normalized;
  }

  function saveSessionForUser(user, signedInAt) {
    if (!user || !user.key || !user.username) return;
    const session = {
      key: user.key,
      username: user.username,
      signedInAt: toInt(signedInAt, Date.now()),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function normalizeHistoryEntry(entry) {
    if (!entry || typeof entry !== "object") return null;
    const watchedSeconds = Math.max(0, toInt(entry.watchedSeconds, 0));
    const duration = Math.max(0, toInt(entry.duration, 0));
    const completionRate = duration > 0
      ? Math.min(1, watchedSeconds / duration)
      : Math.max(0, Number(entry.completionRate) || 0);
    const startedAt = toInt(entry.startedAt, toInt(entry.watchedAt, Date.now()));
    const lastWatchedAt = toInt(entry.lastWatchedAt, toInt(entry.watchedAt, startedAt));
    const playCount = Math.max(1, toInt(entry.playCount, 1));
    return {
      episodeId: entry.episodeId || "",
      showId: entry.showId || "",
      showTitle: entry.showTitle || "Unknown Show",
      epTitle: entry.epTitle || "Episode",
      thumbnail: entry.thumbnail || "",
      genre: entry.genre || "",
      decade: entry.decade || "",
      tags: Array.isArray(entry.tags) ? entry.tags.slice(0, 20) : [],
      watchedSeconds,
      duration,
      completionRate,
      startedAt,
      lastWatchedAt,
      completed: !!entry.completed || completionRate >= 0.98,
      playCount,
    };
  }

  function normalizeLedgerEntry(tx, fallbackBalance) {
    if (!tx || typeof tx !== "object") return null;
    const amount = toInt(tx.amount, 0);
    return {
      id: tx.id || createEventId("tx"),
      ts: toInt(tx.ts, Date.now()),
      amount,
      reason: tx.reason || "Adjustment",
      referenceId: tx.referenceId || null,
      balance: toInt(tx.balance, fallbackBalance),
      type: tx.type || "adjustment",
      label: tx.label || null,
    };
  }

  function normalizeUser(user, keyHint) {
    if (!user || typeof user !== "object") return null;
    const username = String(user.username || keyHint || "").trim();
    const key = String(user.key || keyHint || username).trim().toLowerCase();
    if (!key || !username) return null;
    const passwordHash = String(user.passwordHash || "").trim()
      || (typeof user.password === "string" && user.password
        ? hashPasswordSync(user.password, username)
        : "");

    const tokens = Math.max(0, toInt(user.tokens, toInt(user.starCoins, 0)));
    const ledger = [];
    const sourceLedger = Array.isArray(user.ledger) ? user.ledger : [];
    let balance = tokens;
    sourceLedger.forEach((tx) => {
      const norm = normalizeLedgerEntry(tx, balance);
      if (!norm) return;
      balance = norm.balance;
      ledger.push(norm);
    });

    const history = [];
    const sourceHistory = Array.isArray(user.watchHistory) ? user.watchHistory : [];
    sourceHistory.forEach((entry) => {
      const normalized = normalizeHistoryEntry(entry);
      if (normalized) history.push(normalized);
    });

    const unlockedContent = user.unlockedContent && typeof user.unlockedContent === "object"
      ? user.unlockedContent
      : {};

    const shareEvents = Array.isArray(user.shareEvents) ? user.shareEvents.slice(-250) : [];
    const watchRewardEvents = Array.isArray(user.watchRewardEvents) ? user.watchRewardEvents.slice(-250) : [];
    const allowedAvatars = new Set(["🌟", "⭐", "🚀", "📺", "🎬", "🪐", "🛸", "🎤", "📚", "🤖"]);
    const avatarEmoji = allowedAvatars.has(user.avatarEmoji) ? user.avatarEmoji : "🌟";
    const avatarImage = typeof user.avatarImage === "string" &&
      /^data:image\/(png|jpeg|webp);base64,/i.test(user.avatarImage) && user.avatarImage.length <= 450000
      ? user.avatarImage : "";

    return {
      username,
      key,
      passwordHash,
      joinedAt: toInt(user.joinedAt, Date.now()),
      lastLoginAt: toInt(user.lastLoginAt, Date.now()),
      tokens,
      watchHistory: history.slice(0, 200),
      watchPositions: user.watchPositions && typeof user.watchPositions === "object" ? user.watchPositions : {},
      shareCount: Math.max(0, toInt(user.shareCount, 0)),
      pendingShareCredits: Math.max(0, toInt(user.pendingShareCredits, 0)),
      shareEvents,
      shareCooldownByContent: user.shareCooldownByContent && typeof user.shareCooldownByContent === "object"
        ? user.shareCooldownByContent
        : {},
      eligibleWatchSeconds: Math.max(0, toInt(user.eligibleWatchSeconds, 0)),
      rewardedWatchSeconds: Math.max(0, toInt(user.rewardedWatchSeconds, 0)),
      watchRewardEvents,
      unlockedContent,
      ledger,
      avatarEmoji,
      avatarImage,
    };
  }

  function loadUsers() {
    const raw = parseStoredJSON(STORAGE_KEY, {});
    const normalized = {};
    let changed = false;

    Object.entries(raw || {}).forEach(([storedKey, user]) => {
      const normalizedUser = normalizeUser(user, storedKey);
      if (!normalizedUser) return;
      normalized[normalizedUser.key] = normalizedUser;
      const rawUser = raw[storedKey];
      const sameKey = storedKey === normalizedUser.key;
      const same = sameKey && JSON.stringify(rawUser) === JSON.stringify(normalizedUser);
      if (!same) changed = true;
    });

    if (Object.keys(raw || {}).length !== Object.keys(normalized).length) changed = true;

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function getCurrentUserFromStore() {
    const session = loadSession();
    if (!session) return null;
    const users = loadUsers();
    const user = users[session.key];
    if (!user) {
      clearSession();
      return null;
    }
    return user;
  }

  function mutateCurrentUser(mutator) {
    const session = loadSession();
    if (!session) {
      return { ok: false, error: "not_signed_in" };
    }

    const users = loadUsers();
    const user = users[session.key];
    if (!user) {
      clearSession();
      return { ok: false, error: "session_not_found" };
    }

    const result = mutator(user, users);
    if (result && result.ok === false) {
      return result;
    }

    users[user.key] = normalizeUser(user, user.key);
    saveUsers(users);
    saveSessionForUser(users[user.key], session.signedInAt);
    return { ok: true, user: users[user.key], result };
  }

  function appendLedger(user, amount, reason, referenceId, type, label) {
    if (!user.ledger) user.ledger = [];
    const tx = {
      id: createEventId("tx"),
      ts: Date.now(),
      amount,
      reason: reason || "Adjustment",
      referenceId: referenceId || null,
      balance: user.tokens,
      type: type || "adjustment",
      label: label || null,
    };
    user.ledger.push(tx);
    return tx;
  }

  function migrateUsers() {
    const users = loadUsers();
    saveUsers(users);
    const session = loadSession();
    if (session && users[session.key]) {
      saveSessionForUser(users[session.key], session.signedInAt);
    }
  }

  const Auth = {
    currentUser() {
      return getCurrentUserFromStore();
    },

    updateProfile(profile) {
      const incoming = profile && typeof profile === "object" ? profile : {};
      const result = mutateCurrentUser((user) => {
        if (typeof incoming.avatarEmoji === "string") user.avatarEmoji = incoming.avatarEmoji;
        if (typeof incoming.avatarImage === "string") user.avatarImage = incoming.avatarImage;
        return { ok: true };
      });
      if (!result.ok) return result;
      dispatch("starquest:profile-updated", { user: result.user });
      return { ok: true, user: result.user };
    },

    async register(username, password) {
      const cleanUsername = String(username || "").trim();
      const cleanPassword = String(password || "");
      if (!cleanUsername || cleanUsername.length < 3) {
        return "Username must be at least 3 characters.";
      }
      if (!cleanPassword || cleanPassword.length < 4) {
        return "Password must be at least 4 characters.";
      }
      const users = loadUsers();
      const key = cleanUsername.toLowerCase();
      if (users[key]) {
        return "Username already taken. Please choose another.";
      }

      const passwordHash = getCryptoSubtle()
        ? await hashPasswordAsync(cleanPassword, cleanUsername)
        : hashPasswordSync(cleanPassword, cleanUsername);

      const user = normalizeUser({
        username: cleanUsername,
        key,
        passwordHash,
        joinedAt: Date.now(),
        lastLoginAt: Date.now(),
        tokens: 0,
        watchHistory: [],
        watchPositions: {},
        shareCount: 0,
        pendingShareCredits: 0,
        eligibleWatchSeconds: 0,
        rewardedWatchSeconds: 0,
        watchRewardEvents: [],
        shareEvents: [],
        shareCooldownByContent: {},
        unlockedContent: {},
        ledger: [],
      }, key);

      users[key] = user;
      saveUsers(users);
      saveSessionForUser(user, Date.now());
      dispatch("starquest:auth-changed", { user: this.currentUser(), action: "register" });
      return this.currentUser();
    },

    async signIn(username, password) {
      const cleanUsername = String(username || "").trim();
      const cleanPassword = String(password || "");
      if (!cleanUsername) {
        return "Please enter your username.";
      }
      if (!cleanPassword) {
        return "Please enter your password.";
      }
      const users = loadUsers();
      const key = cleanUsername.toLowerCase();
      const user = users[key];
      if (!user) {
        return "No account found with that username.";
      }

      const storedHash = String(user.passwordHash || "");
      const hasSubtle = !!getCryptoSubtle();
      const syncHash = hashPasswordSync(cleanPassword, cleanUsername);
      const syncHashLegacy = syncHash.startsWith(SYNC_HASH_PREFIX)
        ? syncHash.slice(SYNC_HASH_PREFIX.length)
        : "";
      const isLegacySyncNoPrefix = !!syncHashLegacy && storedHash === syncHashLegacy;
      const isStoredSyncHash = storedHash.startsWith(SYNC_HASH_PREFIX);
      let asyncHash = "";
      if (hasSubtle && (!isStoredSyncHash || isLegacySyncNoPrefix)) {
        asyncHash = await hashPasswordAsync(cleanPassword, cleanUsername);
      }
      const modernHash = (hasSubtle && (!isStoredSyncHash || isLegacySyncNoPrefix))
        ? asyncHash
        : syncHash;

      const passwordMatches = storedHash === modernHash || isLegacySyncNoPrefix;

      if (!passwordMatches) {
        return "Incorrect password.";
      }

      user.lastLoginAt = Date.now();
      if (isLegacySyncNoPrefix) {
        user.passwordHash = hasSubtle ? asyncHash : syncHash;
      }
      users[user.key] = normalizeUser(user, user.key);
      saveUsers(users);
      saveSessionForUser(users[user.key], Date.now());
      dispatch("starquest:auth-changed", { user: this.currentUser(), action: "signin" });
      return this.currentUser();
    },

    signOut() {
      const user = this.currentUser();
      clearSession();
      dispatch("starquest:auth-changed", { user: null, previousUser: user, action: "signout" });
    },

    saveUser(user) {
      if (!user || !user.key) return;
      const users = loadUsers();
      const existing = users[user.key] || normalizeUser(user, user.key);
      if (!existing) return;
      const merged = normalizeUser(
        {
          ...existing,
          ...user,
          key: existing.key,
          username: existing.username,
          passwordHash: existing.passwordHash,
          joinedAt: existing.joinedAt,
        },
        existing.key
      );
      users[merged.key] = merged;
      saveUsers(users);
      const session = loadSession();
      if (session && session.key === merged.key) {
        saveSessionForUser(merged, session.signedInAt);
      }
    },

    getBalance() {
      const user = this.currentUser();
      return user ? Math.max(0, toInt(user.tokens, 0)) : 0;
    },

    getLedger() {
      const user = this.currentUser();
      return user && Array.isArray(user.ledger) ? user.ledger.slice() : [];
    },

    canAfford(amount) {
      const value = toInt(amount, NaN);
      if (!Number.isFinite(value) || value <= 0) return false;
      return this.getBalance() >= value;
    },

    addTokens(amount, reason, referenceId, type) {
      const tokenAmount = toInt(amount, NaN);
      if (!Number.isFinite(tokenAmount) || tokenAmount <= 0) return null;
      const result = mutateCurrentUser((user) => {
        user.tokens = Math.max(0, toInt(user.tokens, 0) + tokenAmount);
        const tx = appendLedger(
          user,
          tokenAmount,
          reason || "StarCoin reward",
          referenceId || null,
          type || "adjustment",
          type || "administrator/migration adjustment"
        );
        return { tx };
      });
      if (!result.ok) return null;
      dispatch("starquest:tokens-updated", {
        user: result.user,
        balance: result.user.tokens,
        tx: result.result.tx,
      });
      return result.user;
    },

    spendTokens(amount, reason, referenceId) {
      const tokenAmount = toInt(amount, NaN);
      if (!Number.isFinite(tokenAmount) || tokenAmount <= 0) {
        return { ok: false, error: "invalid_amount", message: "Amount must be a positive integer." };
      }

      const result = mutateCurrentUser((user) => {
        const balance = Math.max(0, toInt(user.tokens, 0));
        if (balance < tokenAmount) {
          return { ok: false, error: "insufficient_funds", message: "Not enough StarCoins." };
        }
        user.tokens = balance - tokenAmount;
        const tx = appendLedger(
          user,
          -tokenAmount,
          reason || "Spend StarCoins",
          referenceId || null,
          "content_unlock",
          "content unlock"
        );
        return { tx };
      });

      if (!result.ok) {
        return {
          ok: false,
          error: result.error || "not_signed_in",
          message: result.message || "Please sign in.",
        };
      }

      const payload = {
        user: result.user,
        balance: result.user.tokens,
        tx: result.result.tx,
      };
      dispatch("starquest:tokens-updated", payload);
      return {
        ok: true,
        balance: result.user.tokens,
        tx: result.result.tx,
      };
    },

    unlockContent(contentId, cost, title) {
      const id = String(contentId || "").trim();
      if (!id) {
        return { ok: false, error: "invalid_content", message: "Invalid content ID." };
      }
      const unlockCost = Math.max(0, toInt(cost, NaN));
      if (!Number.isFinite(unlockCost)) {
        return { ok: false, error: "invalid_cost", message: "Invalid unlock cost." };
      }

      const result = mutateCurrentUser((user) => {
        if (!user.unlockedContent || typeof user.unlockedContent !== "object") {
          user.unlockedContent = {};
        }
        if (user.unlockedContent[id]) {
          return {
            alreadyUnlocked: true,
            unlock: user.unlockedContent[id],
            charged: false,
          };
        }

        if (unlockCost > 0) {
          const balance = Math.max(0, toInt(user.tokens, 0));
          if (balance < unlockCost) {
            return { ok: false, error: "insufficient_funds", message: "Not enough StarCoins." };
          }
          user.tokens = balance - unlockCost;
          appendLedger(
            user,
            -unlockCost,
            "Unlock: " + (title || id),
            id,
            "content_unlock",
            "content unlock"
          );
        }

        const unlock = {
          contentId: id,
          title: title || id,
          cost: unlockCost,
          unlockedAt: Date.now(),
        };
        user.unlockedContent[id] = unlock;

        return {
          unlock,
          charged: unlockCost > 0,
          alreadyUnlocked: false,
        };
      });

      if (!result.ok) {
        return {
          ok: false,
          error: result.error || "not_signed_in",
          message: result.message || "Please sign in.",
        };
      }

      if (result.result.charged) {
        dispatch("starquest:tokens-updated", {
          user: result.user,
          balance: result.user.tokens,
        });
      }

      dispatch("starquest:content-unlocked", {
        user: result.user,
        contentId: id,
        unlock: result.result.unlock,
        alreadyUnlocked: result.result.alreadyUnlocked,
      });

      return {
        ok: true,
        alreadyUnlocked: !!result.result.alreadyUnlocked,
        unlock: result.result.unlock,
        balance: result.user.tokens,
      };
    },

    isContentUnlocked(contentId) {
      const user = this.currentUser();
      if (!user || !user.unlockedContent) return false;
      return !!user.unlockedContent[contentId];
    },

    getUnlockedContent() {
      const user = this.currentUser();
      if (!user || !user.unlockedContent) return [];
      return Object.values(user.unlockedContent).sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
    },

    saveWatchPosition(episodeId, seconds) {
      if (!episodeId) return;
      mutateCurrentUser((user) => {
        if (!user.watchPositions) user.watchPositions = {};
        user.watchPositions[episodeId] = Math.max(0, toInt(seconds, 0));
        return { ok: true };
      });
    },

    getWatchPosition(episodeId) {
      const user = this.currentUser();
      if (!user || !user.watchPositions) return 0;
      return Math.max(0, toInt(user.watchPositions[episodeId], 0));
    },

    addToHistory(entryOrEpisodeId, showTitle, epTitle, thumbnail, extras) {
      const incoming = (entryOrEpisodeId && typeof entryOrEpisodeId === "object")
        ? { ...entryOrEpisodeId }
        : {
          episodeId: entryOrEpisodeId,
          showTitle,
          epTitle,
          thumbnail,
          ...(extras && typeof extras === "object" ? extras : {}),
        };

      const result = mutateCurrentUser((user) => {
        if (!incoming.episodeId) {
          return { ok: false, error: "invalid_episode", message: "Invalid episode ID." };
        }
        if (!user.watchHistory) user.watchHistory = [];

        const now = Date.now();
        const existing = user.watchHistory.find((h) => h.episodeId === incoming.episodeId);
        const normalized = normalizeHistoryEntry({
          ...existing,
          ...incoming,
          startedAt: existing ? existing.startedAt : now,
          lastWatchedAt: now,
          watchedAt: now,
          playCount: Math.max(1, toInt(existing && existing.playCount, 0) + 1),
        });
        if (!normalized) {
          return { ok: false, error: "invalid_history", message: "Invalid history item." };
        }

        user.watchHistory = user.watchHistory.filter((h) => h.episodeId !== normalized.episodeId);
        user.watchHistory.unshift(normalized);
        user.watchHistory = user.watchHistory.slice(0, 200);
        return { history: user.watchHistory.slice() };
      });

      if (!result.ok) return;
      dispatch("starquest:history-updated", {
        history: result.result.history,
        user: result.user,
      });
      dispatch("starquest:recommendations-updated", {
        history: result.result.history,
        user: result.user,
      });
    },

    updateHistoryProgress(episodeId, watchedSeconds, duration) {
      if (!episodeId) return;
      mutateCurrentUser((user) => {
        if (!Array.isArray(user.watchHistory)) user.watchHistory = [];
        const idx = user.watchHistory.findIndex((h) => h.episodeId === episodeId);
        if (idx < 0) return { ok: true };
        const item = { ...user.watchHistory[idx] };
        item.watchedSeconds = Math.max(item.watchedSeconds || 0, toInt(watchedSeconds, item.watchedSeconds || 0));
        item.duration = Math.max(item.duration || 0, toInt(duration, item.duration || 0));
        item.completionRate = item.duration > 0 ? Math.min(1, item.watchedSeconds / item.duration) : item.completionRate;
        item.completed = item.completionRate >= 0.98;
        item.lastWatchedAt = Date.now();
        user.watchHistory[idx] = normalizeHistoryEntry(item);
        return { ok: true };
      });
    },

    clearHistory() {
      const result = mutateCurrentUser((user) => {
        user.watchHistory = [];
        return { history: [] };
      });
      if (!result.ok) return;
      dispatch("starquest:history-updated", { history: [], user: result.user });
      dispatch("starquest:recommendations-updated", { history: [], user: result.user });
    },

    getHistory() {
      const user = this.currentUser();
      if (!user) return [];
      return Array.isArray(user.watchHistory) ? user.watchHistory.slice() : [];
    },

    recordShare(contentId, options) {
      const id = String(contentId || "").trim();
      if (!id) {
        return { ok: false, error: "invalid_content", message: "Missing content for share." };
      }
      const opts = options && typeof options === "object" ? options : {};
      const now = Date.now();

      const result = mutateCurrentUser((user) => {
        if (!user.shareCooldownByContent || typeof user.shareCooldownByContent !== "object") {
          user.shareCooldownByContent = {};
        }
        const lastShareTs = toInt(user.shareCooldownByContent[id], 0);
        if (now - lastShareTs < SHARE_COOLDOWN_MS) {
          return {
            ok: false,
            error: "share_cooldown",
            message: "You already earned share progress for this content recently.",
            retryInMs: SHARE_COOLDOWN_MS - (now - lastShareTs),
          };
        }

        if (!Array.isArray(user.shareEvents)) user.shareEvents = [];
        const event = {
          id: createEventId("share"),
          contentId: id,
          createdAt: now,
          verified: !!opts.verified,
          status: opts.verified ? "verified" : "unverified_local_share",
        };
        user.shareEvents.push(event);
        user.shareEvents = user.shareEvents.slice(-250);
        user.shareCooldownByContent[id] = now;
        user.shareCount = Math.max(0, toInt(user.shareCount, 0)) + 1;
        user.pendingShareCredits = Math.max(0, toInt(user.pendingShareCredits, 0)) + 1;

        let awarded = 0;
        while (user.pendingShareCredits >= SHARES_PER_COIN) {
          user.pendingShareCredits -= SHARES_PER_COIN;
          awarded += 1;
          user.tokens = Math.max(0, toInt(user.tokens, 0) + 1);
          appendLedger(
            user,
            1,
            "Share reward (prototype): 10 shares",
            event.id,
            "share_reward",
            "share reward"
          );
        }

        return { event, awarded };
      });

      if (!result.ok) {
        return {
          ok: false,
          error: result.error || "not_signed_in",
          message: result.message || "Please sign in.",
          retryInMs: result.retryInMs || 0,
        };
      }

      dispatch("starquest:share-progress", {
        user: result.user,
        lifetimeShareCount: result.user.shareCount,
        progressToNextCoin: result.user.pendingShareCredits,
        sharesPerCoin: SHARES_PER_COIN,
        event: result.result.event,
      });

      if (result.result.awarded > 0) {
        dispatch("starquest:tokens-updated", {
          user: result.user,
          balance: result.user.tokens,
        });
      }

      return {
        ok: true,
        awarded: result.result.awarded,
        event: result.result.event,
        lifetimeShareCount: result.user.shareCount,
        progressToNextCoin: result.user.pendingShareCredits,
        sharesPerCoin: SHARES_PER_COIN,
        balance: result.user.tokens,
      };
    },

    recordWatchProgress(contentId, seconds, metadata) {
      const id = String(contentId || "").trim();
      if (!id) {
        return { ok: false, error: "invalid_content", message: "Missing content ID." };
      }
      const step = Number(seconds);
      if (!Number.isFinite(step) || step <= 0) {
        return { ok: false, error: "invalid_seconds", message: "Watch progress must be positive." };
      }
      const meta = metadata && typeof metadata === "object" ? metadata : {};

      const result = mutateCurrentUser((user) => {
        const addSeconds = Math.floor(step);
        if (addSeconds <= 0) {
          return { ok: false, error: "invalid_seconds", message: "Watch progress must be positive." };
        }

        user.eligibleWatchSeconds = Math.max(0, toInt(user.eligibleWatchSeconds, 0) + addSeconds);
        user.rewardedWatchSeconds = Math.max(0, toInt(user.rewardedWatchSeconds, 0));
        if (!Array.isArray(user.watchRewardEvents)) user.watchRewardEvents = [];

        if (meta.episodeId) {
          const historyIndex = Array.isArray(user.watchHistory)
            ? user.watchHistory.findIndex((item) => item.episodeId === meta.episodeId)
            : -1;
          if (historyIndex >= 0) {
            const item = { ...user.watchHistory[historyIndex] };
            item.watchedSeconds = Math.max(item.watchedSeconds || 0, toInt(meta.watchedSeconds, item.watchedSeconds || 0));
            item.duration = Math.max(item.duration || 0, toInt(meta.duration, item.duration || 0));
            item.completionRate = item.duration > 0 ? Math.min(1, item.watchedSeconds / item.duration) : item.completionRate;
            item.completed = item.completionRate >= 0.98;
            item.lastWatchedAt = Date.now();
            user.watchHistory[historyIndex] = normalizeHistoryEntry(item);
          }
        }

        const availableRewardSeconds = Math.max(0, user.eligibleWatchSeconds - user.rewardedWatchSeconds);
        const rewardCount = Math.floor(availableRewardSeconds / WATCH_SECONDS_PER_COIN);
        const awardedEvents = [];

        for (let i = 0; i < rewardCount; i++) {
          const eventId = createEventId("watch-reward");
          user.rewardedWatchSeconds += WATCH_SECONDS_PER_COIN;
          user.tokens = Math.max(0, toInt(user.tokens, 0) + 1);
          const event = {
            id: eventId,
            contentId: id,
            createdAt: Date.now(),
            rewardedSeconds: user.rewardedWatchSeconds,
            eligibleWatchSeconds: user.eligibleWatchSeconds,
            amount: 1,
          };
          user.watchRewardEvents.push(event);
          user.watchRewardEvents = user.watchRewardEvents.slice(-250);
          appendLedger(
            user,
            1,
            "Watch reward: 1 hour eligible watch-time",
            eventId,
            "watch_reward",
            "watch reward"
          );
          awardedEvents.push(event);
        }

        return {
          rewardCount,
          awardedEvents,
        };
      });

      if (!result.ok) {
        return {
          ok: false,
          error: result.error || "not_signed_in",
          message: result.message || "Please sign in.",
        };
      }

      dispatch("starquest:watch-progress", {
        user: result.user,
        contentId: id,
        eligibleWatchSeconds: result.user.eligibleWatchSeconds,
        rewardedWatchSeconds: result.user.rewardedWatchSeconds,
      });

      if (result.result.rewardCount > 0) {
        dispatch("starquest:tokens-updated", {
          user: result.user,
          balance: result.user.tokens,
        });
      }

      return {
        ok: true,
        awarded: result.result.rewardCount,
        events: result.result.awardedEvents,
        eligibleWatchSeconds: result.user.eligibleWatchSeconds,
        rewardedWatchSeconds: result.user.rewardedWatchSeconds,
        balance: result.user.tokens,
      };
    },

    SHARES_PER_COIN,
    WATCH_SECONDS_PER_COIN,
    SHARE_COOLDOWN_MS,
  };

  migrateUsers();

  global.StarQuestAuth = Auth;
})(window);
