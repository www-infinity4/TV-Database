/**
 * StarQuest — Authentication & User System
 * All data stored in localStorage. No backend required.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY = "starquest_users";
  const SESSION_KEY = "starquest_session";

  /* ── Simple hash (not cryptographic, but obfuscates plain text) ── */
  function hashPassword(pw) {
    let h = 0x811c9dc5;
    for (let i = 0; i < pw.length; i++) {
      h ^= pw.charCodeAt(i);
      h = (h * 0x01000193) >>> 0;
    }
    return h.toString(16);
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch {
      return null;
    }
  }

  function saveSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /* ── Public API ── */
  const Auth = {
    /**
     * Returns the currently signed-in user object, or null.
     */
    currentUser() {
      return loadSession();
    },

    /**
     * Register a new user.
     * @returns {object|string} user object on success, error string on failure
     */
    register(username, password) {
      if (!username || username.trim().length < 3) {
        return "Username must be at least 3 characters.";
      }
      if (!password || password.length < 4) {
        return "Password must be at least 4 characters.";
      }
      const users = loadUsers();
      const key = username.trim().toLowerCase();
      if (users[key]) {
        return "Username already taken. Please choose another.";
      }
      const user = {
        username: username.trim(),
        key,
        passwordHash: hashPassword(password),
        joinedAt: Date.now(),
        tokens: 0,
        watchHistory: [],
        watchPositions: {},
        shareCount: 0,
        pendingShareCredits: 0,
      };
      users[key] = user;
      saveUsers(users);
      saveSession(user);
      return user;
    },

    /**
     * Sign in an existing user.
     * @returns {object|string} user object on success, error string on failure
     */
    signIn(username, password) {
      const users = loadUsers();
      const key = username.trim().toLowerCase();
      const user = users[key];
      if (!user) {
        return "No account found with that username.";
      }
      if (user.passwordHash !== hashPassword(password)) {
        return "Incorrect password.";
      }
      saveSession(user);
      return user;
    },

    signOut() {
      clearSession();
    },

    /**
     * Persist changes to the current user back to storage.
     */
    saveUser(user) {
      if (!user || !user.key) return;
      const users = loadUsers();
      users[user.key] = user;
      saveUsers(users);
      saveSession(user);
    },

    /**
     * Add tokens to the current user's wallet and persist.
     * @param {number} amount
     * @param {string} reason - label for the transaction
     */
    addTokens(amount, reason) {
      const user = loadSession();
      if (!user) return;
      user.tokens = (user.tokens || 0) + amount;
      /* Append to ledger */
      if (!user.ledger) user.ledger = [];
      user.ledger.push({
        ts: Date.now(),
        amount,
        reason,
        balance: user.tokens,
      });
      this.saveUser(user);
      /* Fire event so UI can react */
      document.dispatchEvent(
        new CustomEvent("starquest:tokens-updated", { detail: { user } })
      );
      return user;
    },

    /**
     * Record a watch-position for an episode.
     */
    saveWatchPosition(episodeId, seconds) {
      const user = loadSession();
      if (!user) return;
      if (!user.watchPositions) user.watchPositions = {};
      user.watchPositions[episodeId] = seconds;
      this.saveUser(user);
    },

    getWatchPosition(episodeId) {
      const user = loadSession();
      if (!user || !user.watchPositions) return 0;
      return user.watchPositions[episodeId] || 0;
    },

    /**
     * Add an item to watch history (most recent first, dedup by episodeId).
     */
    addToHistory(episodeId, showTitle, epTitle, thumbnail) {
      const user = loadSession();
      if (!user) return;
      if (!user.watchHistory) user.watchHistory = [];
      /* Remove existing entry for this episode */
      user.watchHistory = user.watchHistory.filter(
        (h) => h.episodeId !== episodeId
      );
      /* Add to front */
      user.watchHistory.unshift({
        episodeId,
        showTitle,
        epTitle,
        thumbnail,
        watchedAt: Date.now(),
      });
      /* Keep last 100 */
      user.watchHistory = user.watchHistory.slice(0, 100);
      this.saveUser(user);
      document.dispatchEvent(
        new CustomEvent("starquest:history-updated", {
          detail: { history: user.watchHistory },
        })
      );
    },

    getHistory() {
      const user = loadSession();
      if (!user) return [];
      return user.watchHistory || [];
    },

    /**
     * Track a share action; award 1 token per 10 shares.
     */
    recordShare() {
      const user = loadSession();
      if (!user) return;
      user.shareCount = (user.shareCount || 0) + 1;
      user.pendingShareCredits = (user.pendingShareCredits || 0) + 1;
      if (user.pendingShareCredits >= 10) {
        user.pendingShareCredits -= 10;
        this.saveUser(user);
        this.addTokens(1, "10 shares completed");
        return true; /* awarded */
      }
      this.saveUser(user);
      return false;
    },
  };

  global.StarQuestAuth = Auth;
})(window);
