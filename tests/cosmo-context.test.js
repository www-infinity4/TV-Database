'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const storage = new Map();
const listeners = new Map();
const document = {
  addEventListener(type, handler) { listeners.set(type, handler); },
};
const window = {
  document,
  localStorage: {
    getItem(key) { return storage.get(key) || null; },
    setItem(key, value) { storage.set(key, value); },
    removeItem(key) { storage.delete(key); },
  },
};
window.window = window;
vm.runInNewContext(fs.readFileSync('js/cosmo-context.js', 'utf8'), { window, Date, Math, JSON, Set, Object, Number, String, Array });

const memory = window.StarQuestCosmoContext;
memory.record('hydrogen boron coins jewelry', 'chat');
memory.record('natural boron jewelry', 'search');
const ranked = memory.snapshot(10);
const names = ranked.map((item) => item.term);
assert.ok(names.includes('hydrogen'));
assert.ok(names.includes('boron'));
assert.ok(names.includes('coins'));
assert.ok(names.includes('jewelry'));
assert.equal(names[0], 'boron', 'repeated high-value signals should rank first');
assert.ok(Math.abs(ranked.reduce((sum, item) => sum + item.probability, 0) - 1) < 0.002);
assert.ok(ranked.every((item) => Math.abs((item.amplitude ** 2) - item.probability) < 0.002));
assert.doesNotMatch(storage.get('starquest_cosmo_interest_v1'), /hydrogen boron coins jewelry/);
assert.match(memory.promptContext(), /not thoughts/);

listeners.get('starquest:search')({ detail: { query: 'gemstones mineral parcels' } });
assert.ok(memory.snapshot(20).some((item) => item.term === 'gemstones'));
memory.clear();
assert.deepEqual(memory.snapshot(), []);
console.log('Cosmo weighted, local and user-controlled interest memory: ok');
