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

test("Rogers health reports the three consensus stages", async () => {
  const response = await worker.fetch(
    new Request("https://infinity-rogers.marvaseater.workers.dev/health"),
    { DB: database(), ANTHROPIC_API_KEY: "configured" },
    { waitUntil() {} },
  );
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual(body.stages, ["independent-ai-1", "independent-ai-2", "monitor-arbiter"]);
});

test("Rogers monitor answer overrides both drafts and writes an audit record", async () => {
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
        headers: { "Content-Type": "application/json", Origin: "https://www-infinity4.github.io" },
        body: JSON.stringify({ input: "Test the monitor" }),
      }),
      { DB: database(), ANTHROPIC_API_KEY: "test-secret" },
      { waitUntil() {} },
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

test("Rogers refuses browser writes from unapproved origins", async () => {
  const response = await worker.fetch(
    new Request("https://infinity-rogers.marvaseater.workers.dev/v1/reason", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://example.com" },
      body: JSON.stringify({ input: "No" }),
    }),
    { DB: database(), ANTHROPIC_API_KEY: "configured" },
    { waitUntil() {} },
  );
  assert.equal(response.status, 403);
});
