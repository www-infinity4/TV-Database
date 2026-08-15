'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const ai = fs.readFileSync('js/ai.js', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const chatStart = ai.indexOf('async function chat(userMessage)');
const chatEnd = ai.indexOf('async function suggestDesignName', chatStart);
const chat = ai.slice(chatStart, chatEnd);

assert.ok(chatStart > -1 && chatEnd > chatStart, 'Cosmo chat router should be extractable');
assert.ok(
  chat.indexOf('_callPollinations(buildMessages(userMessage))') < chat.indexOf('infinityLanguageResponse(userMessage)'),
  'network AI must run before fuzzy catalogue lookup'
);
assert.match(chat, /if \(isCatalogueQuestion\(userMessage\)\)/);
assert.match(ai, /result\.confidence >= 0\.55/);
assert.match(ai, /starquest:cosmo-provider/);
assert.match(ai, /providerStatus\(\)/);

const sendStart = app.indexOf('async function sendAIMessage()');
const sendEnd = app.indexOf('/* Suggestion chips */', sendStart);
const send = app.slice(sendStart, sendEnd);
assert.match(send, /try \{/);
assert.match(send, /catch \(error\)/);
assert.match(send, /finally \{/);
assert.match(send, /typingEl\.remove\(\)/);
assert.match(send, /aiSend\.disabled = false/);

assert.match(html, /network AI with offline backup/);
assert.match(html, /js\/ai\.js\?v=20260815-cosmo1/);
assert.match(html, /js\/app\.js\?v=20260815-cosmo1/);

console.log('Cosmo network-first routing and no-freeze recovery: ok');
