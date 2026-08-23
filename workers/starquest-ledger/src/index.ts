const SHARES_PER_COIN = 10;
const ALLOWED_ORIGINS = new Set([
  "https://www-infinity4.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

type JsonRecord = Record<string, unknown>;

interface AccountRow {
  id: string;
  username: string;
  star_coins: number;
  pending_share_credits: number;
  share_count: number;
}

interface BootstrapBody extends JsonRecord {
  username: string;
  deviceToken: string;
  credentialProof: string;
  localState?: JsonRecord;
}

interface Env {
  DB: D1Database;
  INFINITY_CONNECTOR_SECRET?: string;
}

const INFINITY_LEDGER_URL = "https://infinity-ledger.marvaseater.workers.dev";

class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://www-infinity4.github.io",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders(request),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function cleanString(value: unknown, maxLength: number, fallback = ""): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : fallback;
}

function cleanInt(value: unknown, minimum = 0, maximum = Number.MAX_SAFE_INTEGER): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.trunc(parsed)));
}

function cleanList(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => cleanString(item, 120)).filter(Boolean).slice(0, limit);
}

function randomId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function readBody<T extends JsonRecord>(request: Request): Promise<T> {
  if (!request.headers.get("Content-Type")?.toLowerCase().includes("application/json")) {
    throw new HttpError(415, "json_required", "Send an application/json request body.");
  }
  try {
    return await request.json<T>();
  } catch {
    throw new HttpError(400, "invalid_json", "The JSON request body is invalid.");
  }
}

async function accountFromRequest(request: Request, env: Env): Promise<AccountRow> {
  const authorization = request.headers.get("Authorization") || "";
  const match = /^Bearer\s+(sq_[A-Za-z0-9_-]{32,})$/.exec(authorization);
  if (!match) throw new HttpError(401, "authorization_required", "This device is not connected to the ledger.");
  const tokenHash = await sha256(match[1]);
  const account = await env.DB.prepare(
    `SELECT a.id, a.username, a.star_coins, a.pending_share_credits, a.share_count
       FROM accounts a JOIN account_devices d ON d.account_id = a.id
      WHERE d.token_hash = ?1`
  ).bind(tokenHash).first<AccountRow>();
  if (!account) throw new HttpError(401, "invalid_device_token", "This device ledger connection is no longer valid.");
  await env.DB.prepare(`UPDATE account_devices SET last_seen_at = ?2 WHERE token_hash = ?1`)
    .bind(tokenHash, Date.now()).run();
  return account;
}

async function loadState(env: Env, account: AccountRow): Promise<JsonRecord> {
  const [history, ledger] = await Promise.all([
    env.DB.prepare(
      `SELECT episode_id, show_id, show_title, episode_title, thumbnail, genre, decade,
              tags_json, watched_seconds, position_seconds, duration_seconds, completion_rate,
              completed, play_count, started_at, last_watched_at
         FROM watch_history WHERE account_id = ?1
         ORDER BY last_watched_at DESC LIMIT 200`
    ).bind(account.id).all(),
    env.DB.prepare(
      `SELECT id, event_type, amount, balance, progress_to_next_coin, shares_per_coin,
              reference_id, content_id, company_id, actors_json, attribution_status,
              payout_status, created_at
         FROM ledger_events WHERE account_id = ?1
         ORDER BY created_at DESC LIMIT 500`
    ).bind(account.id).all(),
  ]);

  return {
    username: account.username,
    starCoins: account.star_coins,
    pendingShareCredits: account.pending_share_credits,
    shareCount: account.share_count,
    sharesPerCoin: SHARES_PER_COIN,
    watchHistory: history.results.map((row) => ({
      episodeId: row.episode_id,
      showId: row.show_id,
      showTitle: row.show_title,
      epTitle: row.episode_title,
      thumbnail: row.thumbnail,
      genre: row.genre,
      decade: row.decade,
      tags: JSON.parse(String(row.tags_json || "[]")),
      watchedSeconds: row.watched_seconds,
      positionSeconds: row.position_seconds,
      duration: row.duration_seconds,
      completionRate: row.completion_rate,
      completed: Boolean(row.completed),
      playCount: row.play_count,
      startedAt: row.started_at,
      lastWatchedAt: row.last_watched_at,
    })),
    ledger: ledger.results.map((row) => ({
      id: row.id,
      type: row.event_type,
      amount: row.amount,
      balance: row.balance,
      progressToNextCoin: row.progress_to_next_coin,
      sharesPerCoin: row.shares_per_coin,
      referenceId: row.reference_id,
      contentId: row.content_id,
      companyId: row.company_id,
      actors: JSON.parse(String(row.actors_json || "[]")),
      attributionStatus: row.attribution_status,
      payoutStatus: row.payout_status,
      ts: row.created_at,
      reason: row.event_type === "share_reward" ? "Share reward: 10 completed shares" : "Confirmed share receipt",
    })).reverse(),
  };
}

async function bootstrap(request: Request, env: Env): Promise<Response> {
  const body = await readBody<BootstrapBody>(request);
  const username = cleanString(body.username, 48).toLowerCase();
  const deviceToken = cleanString(body.deviceToken, 160);
  const credentialProof = cleanString(body.credentialProof, 160);
  if (!/^[a-z0-9][a-z0-9._-]{2,47}$/.test(username)) {
    throw new HttpError(400, "invalid_username", "Use the same 3–48 character StarQuest username.");
  }
  if (!/^sq_[A-Za-z0-9_-]{32,}$/.test(deviceToken)) {
    throw new HttpError(400, "invalid_device_token", "The device token is invalid.");
  }
  if (!/^(?:[0-9a-f]{64}|sync-[0-9a-f]{1,32})$/.test(credentialProof)) {
    throw new HttpError(400, "credential_proof_required", "Sign in to StarQuest again before connecting the ledger.");
  }

  const tokenHash = await sha256(deviceToken);
  const credentialHash = await sha256(credentialProof);
  let account = await env.DB.prepare(
    `SELECT id, username, star_coins, pending_share_credits, share_count, credential_hash
       FROM accounts WHERE username = ?1 COLLATE NOCASE`
  ).bind(username).first<AccountRow & { credential_hash: string }>();

  if (account && account.credential_hash !== credentialHash) {
    throw new HttpError(401, "account_credential_mismatch", "The StarQuest account password proof did not match.");
  }

  if (!account) {
    const local = body.localState && typeof body.localState === "object" ? body.localState : {};
    const starCoins = cleanInt(local.starCoins ?? local.tokens, 0, 1000000);
    const pending = cleanInt(local.pendingShareCredits, 0, 9);
    const shareCount = Math.max(cleanInt(local.shareCount), (starCoins * SHARES_PER_COIN) + pending);
    const now = Date.now();
    const id = randomId("acct");
    await env.DB.prepare(
      `INSERT INTO accounts
        (id, username, credential_hash, star_coins, pending_share_credits, share_count, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7)`
    ).bind(id, username, credentialHash, starCoins, pending, shareCount, now).run();
    account = { id, username, credential_hash: credentialHash, star_coins: starCoins, pending_share_credits: pending, share_count: shareCount };

    const history = Array.isArray(local.watchHistory) ? local.watchHistory.slice(0, 200) : [];
    if (history.length) {
      await env.DB.batch(history.map((entry) => historyStatement(env, id, entry as JsonRecord)));
    }
  }

  await env.DB.prepare(
    `INSERT INTO account_devices (token_hash, account_id, created_at, last_seen_at)
     VALUES (?1, ?2, ?3, ?3)
     ON CONFLICT(token_hash) DO UPDATE SET last_seen_at = excluded.last_seen_at`
  ).bind(tokenHash, account.id, Date.now()).run();

  return json(request, { ok: true, state: await loadState(env, account) });
}

function historyStatement(env: Env, accountId: string, body: JsonRecord): D1PreparedStatement {
  const episodeId = cleanString(body.episodeId, 240);
  const now = Date.now();
  const startedAt = cleanInt(body.startedAt, 0) || now;
  const lastWatchedAt = cleanInt(body.lastWatchedAt ?? body.watchedAt, 0) || now;
  const watchedSeconds = cleanInt(body.watchedSeconds);
  const positionSeconds = cleanInt(body.positionSeconds, 0, 604800);
  const duration = cleanInt(body.duration, 0, 604800);
  const completionRate = duration > 0 ? Math.min(1, watchedSeconds / duration) : Math.min(1, Math.max(0, Number(body.completionRate) || 0));
  return env.DB.prepare(
    `INSERT INTO watch_history
      (account_id, episode_id, show_id, show_title, episode_title, thumbnail, genre, decade,
       tags_json, watched_seconds, position_seconds, duration_seconds, completion_rate,
       completed, play_count, started_at, last_watched_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
     ON CONFLICT(account_id, episode_id) DO UPDATE SET
       show_id = excluded.show_id,
       show_title = excluded.show_title,
       episode_title = excluded.episode_title,
       thumbnail = excluded.thumbnail,
       genre = excluded.genre,
       decade = excluded.decade,
       tags_json = excluded.tags_json,
       watched_seconds = MAX(watch_history.watched_seconds, excluded.watched_seconds),
       position_seconds = excluded.position_seconds,
       duration_seconds = MAX(watch_history.duration_seconds, excluded.duration_seconds),
       completion_rate = MAX(watch_history.completion_rate, excluded.completion_rate),
       completed = MAX(watch_history.completed, excluded.completed),
       play_count = MAX(watch_history.play_count, excluded.play_count),
       last_watched_at = MAX(watch_history.last_watched_at, excluded.last_watched_at)`
  ).bind(
    accountId,
    episodeId,
    cleanString(body.showId, 240),
    cleanString(body.showTitle, 240, "Unknown Show"),
    cleanString(body.epTitle, 240, "Episode"),
    cleanString(body.thumbnail, 1000),
    cleanString(body.genre, 80),
    cleanString(body.decade, 40),
    JSON.stringify(cleanList(body.tags, 20)),
    watchedSeconds,
    positionSeconds,
    duration,
    completionRate,
    body.completed === true || completionRate >= 0.98 ? 1 : 0,
    Math.max(1, cleanInt(body.playCount, 1)),
    startedAt,
    lastWatchedAt,
  );
}

async function saveHistory(request: Request, env: Env, account: AccountRow): Promise<Response> {
  const body = await readBody<JsonRecord>(request);
  if (!cleanString(body.episodeId, 240)) throw new HttpError(400, "episode_required", "Missing episode ID.");
  await historyStatement(env, account.id, body).run();
  account = (await env.DB.prepare(
    `SELECT id, username, star_coins, pending_share_credits, share_count FROM accounts WHERE id = ?1`
  ).bind(account.id).first<AccountRow>())!;
  return json(request, { ok: true, state: await loadState(env, account) });
}

async function flushInfinityOutbox(env: Env): Promise<void> {
  if (!env.INFINITY_CONNECTOR_SECRET) {
    console.error(JSON.stringify({ event: "infinity_outbox_paused", reason: "connector_secret_missing" }));
    return;
  }
  const now = Date.now();
  const pending = await env.DB.prepare(
    `SELECT idempotency_key, payload_json, attempts FROM infinity_outbox
      WHERE status = 'PENDING' AND next_attempt_at <= ?1
      ORDER BY created_at LIMIT 25`
  ).bind(now).all<{ idempotency_key: string; payload_json: string; attempts: number }>();

  for (const row of pending.results) {
    try {
      const response = await fetch(`${INFINITY_LEDGER_URL}/internal/v1/actions/qualify`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.INFINITY_CONNECTOR_SECRET}`,
          "Content-Type": "application/json",
        },
        body: row.payload_json,
      });
      if (!response.ok) {
        const problem = await response.json<{ error?: string }>().catch(() => ({ error: undefined }));
        throw new Error(cleanString(problem.error, 80, `http_${response.status}`));
      }
      await env.DB.prepare(
        `UPDATE infinity_outbox SET status = 'SENT', sent_at = ?2, last_error = NULL
          WHERE idempotency_key = ?1 AND status = 'PENDING'`
      ).bind(row.idempotency_key, Date.now()).run();
    } catch (error) {
      const attempts = Number(row.attempts || 0) + 1;
      const retryDelay = Math.min(60 * 60 * 1000, 15_000 * (2 ** Math.min(attempts, 8)));
      await env.DB.prepare(
        `UPDATE infinity_outbox
            SET attempts = ?2, next_attempt_at = ?3, last_error = ?4
          WHERE idempotency_key = ?1 AND status = 'PENDING'`
      ).bind(
        row.idempotency_key,
        attempts,
        Date.now() + retryDelay,
        cleanString(error instanceof Error ? error.message : String(error), 160, "connector_error"),
      ).run();
    }
  }
}

async function saveShare(request: Request, env: Env, account: AccountRow, ctx: ExecutionContext): Promise<Response> {
  const body = await readBody<JsonRecord>(request);
  const idempotencyKey = cleanString(body.attemptId ?? body.idempotencyKey, 160);
  const contentId = cleanString(body.contentId, 500);
  if (!idempotencyKey || !contentId) throw new HttpError(400, "share_receipt_invalid", "Share attempt and content IDs are required.");
  const now = Date.now();
  const shareLedgerId = randomId("ledger");
  const rewardLedgerId = randomId("ledger");
  const infinityPayload = JSON.stringify({
    sourceKey: "STARQUEST",
    actionKey: "SHARE_CONFIRMED",
    subjectId: account.id,
    idempotencyKey: `starquest:${idempotencyKey}`,
    sourceReference: idempotencyKey,
    occurredAt: now,
    evidence: {
      contentId,
      receiptHash: cleanString(body.receiptHash, 160),
      fullyWatched: body.fullyWatched === true,
      attributionStatus: cleanString(body.attributionStatus, 120, "actor_credits_pending"),
    },
  });

  const results = await env.DB.batch([
    env.DB.prepare(
      `INSERT OR IGNORE INTO share_receipts
        (idempotency_key, account_id, content_id, method, receipt_hash, show_title, episode_id,
         company_id, actors_json, fully_watched, attribution_status, payout_status, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)`
    ).bind(
      idempotencyKey, account.id, contentId, cleanString(body.method, 80, "unknown"),
      cleanString(body.receiptHash, 160), cleanString(body.showTitle, 240), cleanString(body.episodeId, 240),
      cleanString(body.companyId, 240, "unclaimed:unknown-content"), JSON.stringify(cleanList(body.actors, 50)),
      body.fullyWatched === true ? 1 : 0, cleanString(body.attributionStatus, 120, "actor_credits_pending"),
      "pending_server_review", now,
    ),
    env.DB.prepare(
      `UPDATE accounts
          SET share_count = share_count + 1,
              star_coins = star_coins + CASE WHEN pending_share_credits = 9 THEN 1 ELSE 0 END,
              pending_share_credits = (pending_share_credits + 1) % 10,
              updated_at = ?3
        WHERE id = ?1
          AND EXISTS (
            SELECT 1 FROM share_receipts
             WHERE idempotency_key = ?2 AND account_id = ?1 AND credited_at IS NULL
          )`
    ).bind(account.id, idempotencyKey, now),
    env.DB.prepare(
      `INSERT INTO ledger_events
        (id, account_id, event_type, amount, balance, progress_to_next_coin, shares_per_coin,
         reference_id, content_id, company_id, actors_json, attribution_status, payout_status, created_at)
       SELECT ?1, a.id, 'share_credit', 0, a.star_coins, a.pending_share_credits, 10,
              r.idempotency_key, r.content_id, r.company_id, r.actors_json,
              r.attribution_status, r.payout_status, ?4
         FROM accounts a JOIN share_receipts r ON r.account_id = a.id
        WHERE a.id = ?2 AND r.idempotency_key = ?3 AND r.credited_at IS NULL`
    ).bind(shareLedgerId, account.id, idempotencyKey, now),
    env.DB.prepare(
      `INSERT INTO ledger_events
        (id, account_id, event_type, amount, balance, progress_to_next_coin, shares_per_coin,
         reference_id, content_id, company_id, actors_json, attribution_status, payout_status, created_at)
       SELECT ?1, a.id, 'share_reward', 1, a.star_coins, 0, 10,
              r.idempotency_key, r.content_id, r.company_id, r.actors_json,
              r.attribution_status, r.payout_status, ?4
         FROM accounts a JOIN share_receipts r ON r.account_id = a.id
        WHERE a.id = ?2 AND r.idempotency_key = ?3
          AND r.credited_at IS NULL AND a.pending_share_credits = 0`
    ).bind(rewardLedgerId, account.id, idempotencyKey, now),
    env.DB.prepare(
      `INSERT OR IGNORE INTO infinity_outbox
        (idempotency_key, account_id, payload_json, status, attempts, next_attempt_at, created_at)
       SELECT ?1, ?2, ?3, 'PENDING', 0, ?4, ?4
         FROM share_receipts
        WHERE idempotency_key = ?1 AND account_id = ?2 AND credited_at IS NULL`
    ).bind(idempotencyKey, account.id, infinityPayload, now),
    env.DB.prepare(
      `UPDATE share_receipts SET credited_at = ?3
        WHERE account_id = ?1 AND idempotency_key = ?2 AND credited_at IS NULL`
    ).bind(account.id, idempotencyKey, now),
  ]);

  const credited = Number(results[1].meta.changes || 0) === 1;
  if (credited) ctx.waitUntil(flushInfinityOutbox(env));
  account = (await env.DB.prepare(
    `SELECT id, username, star_coins, pending_share_credits, share_count FROM accounts WHERE id = ?1`
  ).bind(account.id).first<AccountRow>())!;
  return json(request, {
    ok: true,
    credited,
    duplicate: !credited,
    awarded: credited && account.pending_share_credits === 0 ? 1 : 0,
    state: await loadState(env, account),
  });
}

async function route(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (!ALLOWED_ORIGINS.has(request.headers.get("Origin") || "") && request.method !== "GET") {
    throw new HttpError(403, "origin_not_allowed", "This site is not allowed to write to the StarQuest ledger.");
  }
  if (request.method === "GET" && url.pathname === "/health") {
    return json(request, { ok: true, service: "starquest-ledger", sharesPerCoin: SHARES_PER_COIN });
  }
  if (request.method === "POST" && url.pathname === "/v1/bootstrap") return bootstrap(request, env);

  const account = await accountFromRequest(request, env);
  if (request.method === "GET" && url.pathname === "/v1/state") return json(request, { ok: true, state: await loadState(env, account) });
  if (request.method === "POST" && url.pathname === "/v1/history") return saveHistory(request, env, account);
  if (request.method === "POST" && url.pathname === "/v1/shares") return saveShare(request, env, account, ctx);
  throw new HttpError(404, "not_found", "StarQuest ledger endpoint not found.");
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      return await route(request, env, ctx);
    } catch (error) {
      if (error instanceof HttpError) return json(request, { ok: false, error: error.code, message: error.message }, error.status);
      console.error(JSON.stringify({ event: "unhandled_error", message: error instanceof Error ? error.message : String(error) }));
      return json(request, { ok: false, error: "server_error", message: "The ledger could not complete this request." }, 500);
    }
  },
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(flushInfinityOutbox(env));
  },
} satisfies ExportedHandler<Env>;
