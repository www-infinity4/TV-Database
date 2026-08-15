'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');
const avatarChain = fs.readFileSync('js/avatar-coin.js', 'utf8');
const walletIntegration = fs.readFileSync('js/infinity-wallet-integration.js', 'utf8');

const sidebar = html.slice(html.indexOf('<aside id="sidebar"'), html.indexOf('<!-- NAVIGATION -->'));
const navigation = html.slice(html.indexOf('<!-- NAVIGATION -->'), html.indexOf('<!-- HERO -->'));

assert.match(sidebar, /id="unified-wallet-connect"/);
assert.doesNotMatch(navigation, /id="unified-wallet-connect"/);
assert.match(sidebar, /Use across Infinity websites/);
assert.match(sidebar, /id="unified-wallet-label"/);
assert.match(walletIntegration, /buttonLabel\.textContent/);
assert.doesNotMatch(walletIntegration, /button\.textContent/);

assert.equal((html.match(/data-vhs-avatar/g) || []).length, 3);
assert.match(html, /id="vhs-avatar-label"/);
assert.match(html, /data-vhs-style="cosmic"/);
assert.match(html, /data-vhs-style="blue"/);
assert.match(html, /data-vhs-style="gold"/);
assert.match(html, /data-vhs-style="red"/);

assert.match(css, /\.vhs-avatar\s*\{/);
assert.match(css, /\.sidebar-unified-wallet\s*\{/);
assert.match(app, /localStorage\.setItem\(DESIGN_KEY, JSON\.stringify\(pendingDesign\)\)/);
assert.match(app, /avatarStyle: VHS_STYLES\.includes/);
assert.match(app, /avatarLabel: cleanVhsLabel/);
assert.match(avatarChain, /avatarStyle: design\.avatarStyle/);
assert.match(avatarChain, /avatarLabel: String\(design\.avatarLabel/);

console.log('VHS account avatar and hamburger-only unified wallet: ok');
