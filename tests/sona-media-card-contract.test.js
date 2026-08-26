'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');

const source = fs.readFileSync('js/sona-media-card.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
assert.match(source, /drawImage\(video/);
assert.match(source, /captureAgent:\s*'SONA'/);
assert.match(source, /status:\s*'CAPTURED'/);
assert.match(source, /PENDING_SOURCE_PERMISSION/);
assert.match(source, /No substitute artwork was used/);
assert.match(source, /starquest:sona-card-captured/);
assert.match(html, /js\/sona-media-card\.js/);
console.log('Sona media-card capture contract: PASS');
