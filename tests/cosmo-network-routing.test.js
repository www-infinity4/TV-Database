'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const ai = fs.readFileSync('js/ai.js', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const chatStart = ai.indexOf('async function chat(userMessage)');
const chatEnd = ai.indexOf('async function suggestDesignName', chatStart);
const chat = ai.slice(chatStart, chatEnd);

assert.ok(chatStart > -1 && chatEnd > chatStart, 'Cosmo chat router should be extractable');
assert.ok(
  chat.indexOf('_callNetworkAI(buildMessages(userMessage))') < chat.indexOf('infinityLanguageResponse(userMessage)'),
  'network AI must run before fuzzy catalogue lookup'
);
assert.match(chat, /if \(isCatalogueQuestion\(userMessage\)\)/);
assert.match(ai, /result\.confidence >= 0\.55/);
assert.match(ai, /starquest:cosmo-provider/);
assert.match(ai, /providerStatus\(\)/);
assert.match(ai, /function queryContainsTitle/);
assert.match(ai, /titleNorm\.length <= 2/);
assert.match(ai, /I won't guess or substitute an unrelated movie/);
assert.match(ai, /127\.0\.0\.1:11435\/v1\/reason/);
assert.doesNotMatch(ai, /text\.pollinations\.ai/);

const helpersStart = ai.indexOf('function normalize(text)');
const helpersEnd = ai.indexOf('function matchShow(query)', helpersStart);
const helperContext = { matches: null };
vm.runInNewContext(
  ai.slice(helpersStart, helpersEnd) +
    '\nmatches = [queryContainsTitle("Why is my phone battery draining?", "M"), queryContainsTitle("Tell me about M", "M")];',
  helperContext
);
assert.deepEqual(Array.from(helperContext.matches), [false, true], 'one-letter titles only match complete words');

const sendStart = app.indexOf('async function sendAIMessage()');
const sendEnd = app.indexOf('/* Suggestion chips */', sendStart);
const send = app.slice(sendStart, sendEnd);
assert.match(send, /try \{/);
assert.match(send, /catch \(error\)/);
assert.match(send, /finally \{/);
assert.match(send, /typingEl\.remove\(\)/);
assert.match(send, /aiSend\.disabled = false/);

assert.match(html, /offline tools available/);
assert.match(app, /StarQuestAI\.providerStatus\(\)/);
assert.match(ai, /Live AI needs the secure Infinity gateway/);
assert.match(html, /js\/cosmo-config\.js\?v=20260823-rogers1/);
assert.match(html, /js\/cosmo-context\.js\?v=20260821-weighted1/);
assert.match(html, /js\/ai\.js\?v=20260823-rogers1/);
assert.match(html, /js\/app\.js\?v=20260823-home-wallet1/);
assert.match(html, /cosmoChatRouted: false/);
assert.match(app, /cosmoChatRouted = true/);

console.log('Cosmo network-first routing and no-freeze recovery: ok');
