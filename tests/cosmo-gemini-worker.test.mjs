import assert from 'node:assert/strict';
import { handleRequest } from '../workers/cosmo-gemini-worker.mjs';

const missingKey = await handleRequest(new Request('https://worker.test/v1/reason', {
  method: 'POST',
  headers: { Origin: 'https://www-infinity4.github.io', 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'hello' }),
}), {});
assert.equal(missingKey.status, 503);

let upstreamBody;
globalThis.fetch = async (_url, options) => {
  upstreamBody = JSON.parse(options.body);
  assert.equal(options.headers['x-goog-api-key'], 'server-secret');
  return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'Grounded reply' }] } }] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
const response = await handleRequest(new Request('https://worker.test/v1/reason', {
  method: 'POST',
  headers: { Origin: 'https://www-infinity4.github.io', 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'What am I watching?', context: { system: 'Use playback evidence.', conversation: [] } }),
}), { GEMINI_API_KEY: 'server-secret', GEMINI_MODEL: 'gemini-3.7-flash' });
assert.equal(response.status, 200);
assert.equal((await response.json()).output, 'Grounded reply');
assert.match(upstreamBody.systemInstruction.parts[0].text, /Never claim to read minds/);
assert.match(upstreamBody.systemInstruction.parts[0].text, /NO_COMMENT/);

const blocked = await handleRequest(new Request('https://worker.test/v1/reason', {
  method: 'POST',
  headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'hello' }),
}), { GEMINI_API_KEY: 'server-secret' });
assert.equal(blocked.status, 403);
console.log('Cosmo secure Gemini worker boundary and grounded prompt: ok');
