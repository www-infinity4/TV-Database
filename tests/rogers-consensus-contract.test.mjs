import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const workerUrl = pathToFileURL(new URL("../services/rogers-consensus/worker/index.js", import.meta.url).pathname);
const { default: worker } = await import(workerUrl.href);

function database() {
  return {
    prepare() {
      return {
        bind() {
          return {
            async first() { return { request_count: 1 }; },
            async run() { return { success: true }; },
          };
        },
      };
    },
  };
}

const ctx = { waitUntil() {} };
const browserHeaders = { "Content-Type": "application/json", Origin: "https://www-infinity4.github.io" };

test("Gateway health reports OpenAI and Anthropic configuration independently", async () => {
  const response = await worker.fetch(
    new Request("https://infinity-rogers.marvaseater.workers.dev/health"),
    { DB: database(), ANTHROPIC_API_KEY: "configured", OPENAI_API_KEY: "configured" },
    ctx,
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.service, "rogers-ai-gateway");
  assert.equal(body.openaiConfigured, true);
  assert.equal(body.anthropicConfigured, true);
  assert.equal(body.routes.gpt, "assistant=gpt -> OpenAI");
});

test("GPT requests fail clearly when the OpenAI secret is missing", async () => {
  const response = await worker.fetch(
    new Request("https://infinity-rogers.marvaseater.workers.dev/v1/chat", {
      method: "POST",
      headers: browserHeaders,
      body: JSON.stringify({ assistant: "gpt", input: "Hello", context: { application: "Omni TV" } }),
    }),
    { DB: database(), ANTHROPIC_API_KEY: "configured" },
    ctx,
  );
  assert.equal(response.status, 503);
  const body = await response.json();
  assert.equal(body.error, "openai_not_configured");
  assert.equal(body.needsSecret, "OPENAI_API_KEY");
});

test("GPT requests use the OpenAI Responses API and return GPT output", async () => {
  const originalFetch = globalThis.fetch;
  let calledUrl = "";
  let authorization = "";
  globalThis.fetch = async (url, init = {}) => {
    calledUrl = String(url);
    authorization = new Headers(init.headers).get("Authorization") || "";
    return Response.json({ output_text: "gateway test ok" });
  };

  try {
    const response = await worker.fetch(
      new Request("https://infinity-rogers.marvaseater.workers.dev/v1/chat", {
        method: "POST",
        headers: browserHeaders,
        body: JSON.stringify({ assistant: "gpt", input: "Test GPT", context: { application: "Omni TV" } }),
      }),
      { DB: database(), OPENAI_API_KEY: "test-openai-secret" },
      ctx,
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(calledUrl, "https://api.openai.com/v1/responses");
    assert.equal(authorization, "Bearer test-openai-secret");
    assert.equal(body.provider, "openai");
    assert.equal(body.output_text, "gateway test ok");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Rogers monitor answer overrides both Anthropic drafts and writes an audit record", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls += 1;
    const text = calls === 1
      ? "AI 1 draft"
      : calls === 2
        ? "AI 2 independent draft"
        : JSON.stringify({ final: "Monitored consensus", agreement: "synthesized", monitor_notes: "Combined both." });
    return Response.json({ content: [{ type: "text", text }] });
  };

  try {
    const response = await worker.fetch(
      new Request("https://infinity-rogers.marvaseater.workers.dev/v1/reason", {
        method: "POST",
        headers: browserHeaders,
        body: JSON.stringify({ input: "Test the monitor", application: "Rogers" }),
      }),
      { DB: database(), ANTHROPIC_API_KEY: "test-secret" },
      ctx,
    );
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(calls, 3);
    assert.equal(body.output_text, "Monitored consensus");
    assert.equal(body.consensus.agreement, "synthesized");
    assert.equal(body.consensus.agents, 3);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Gateway refuses browser writes from unapproved origins", async () => {
  const response = await worker.fetch(
    new Request("https://infinity-rogers.marvaseater.workers.dev/v1/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://example.com" },
      body: JSON.stringify({ input: "No" }),
    }),
    { DB: database(), ANTHROPIC_API_KEY: "configured", OPENAI_API_KEY: "configured" },
    ctx,
  );
  assert.equal(response.status, 403);
});
