'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('index.html', 'utf8');
const worlds = fs.readFileSync('js/user-worlds.js', 'utf8');

assert.match(index, /js\/user-worlds\.js\?v=20260822-world-compact1/);
assert.ok(index.indexOf('js/app.js') < index.indexOf('js/user-worlds.js'), 'world builder loads after the current app');
assert.match(worlds, /starquest_user_worlds_v1/);
assert.match(worlds, /worldId/);
assert.match(worlds, /companionName/);
assert.match(worlds, /const THEMES/);
assert.match(worlds, /cleanText/);
assert.match(worlds, /#nav-brand-name/);
assert.match(worlds, /Public Star firing comes later/);
assert.doesNotMatch(worlds, /\.innerHTML\s*=\s*(?:formData|world|value|input)/);
assert.doesNotMatch(index, /install-user-worlds\.yml/);

console.log('current-main user worlds contract: ok');
