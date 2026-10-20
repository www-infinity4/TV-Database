'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/style.css', 'utf8');
const client = fs.readFileSync('js/card-density.js', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');

test('the menu is one green button, reused across browsing and playback', () => {
  assert.equal((html.match(/id="hamburger-btn"/g) || []).length, 1);
  assert.doesNotMatch(html, /id="player-hamburger-btn"/);
  assert.match(html, /id="hamburger-btn" class="hamburger starquest-green-menu"/);
  assert.match(css, /\.hamburger\s*\{[\s\S]*?background:\s*#118536;/);
  assert.match(client, /destination\.appendChild\(nav\)/);
  assert.doesNotMatch(html, /<script[^>]*infinity-wallet-menu\.js/);
});

test('the same wallet sidebar offers sign-in and independently verified Cloudflare recovery', () => {
  const sidebar = html.slice(html.indexOf('<aside id="sidebar"'), html.indexOf('</aside>'));
  assert.match(sidebar, /id="unified-wallet-connect"/);
  assert.match(sidebar, /id="sidebar-signin-btn"/);
  assert.match(sidebar, /id="sidebar-cloud-signin"[^>]*href="https:\/\/quantaphi\.org\/wallet-recovery\.html\?verify=1&amp;returnTo=%2FTV-Database%2F"/);
  assert.match(sidebar, /id="sidebar-account-backup"[^>]*href="https:\/\/quantaphi\.org\/bubbles-accounts\.html"/);
  assert.match(sidebar, /Do not create a replacement wallet/);
  assert.doesNotMatch(html, /id="splash-signin"/);
  assert.doesNotMatch(html, /id="splash-signup"/);
  assert.match(app, /Account recovery must be reachable from the green menu/);
});

test('recovering after cleared browser data never creates a new blank local wallet', () => {
  const adapter = fs.readFileSync('js/infinity-wallet-integration.js', 'utf8');
  assert.match(adapter, /RECOVERY_URL = 'https:\/\/quantaphi\.org\/wallet-recovery\.html\?verify=1&returnTo=/);
  assert.match(adapter, /location\.href = cloudState \? VERIFIED_URL : RECOVERY_URL/);
  assert.match(adapter, /if \(!cloudState \|\| !connected/);
  assert.doesNotMatch(adapter, /wallet\.createWallet\(/);
});

test('menu DOM node moves into the player and back without cloning', () => {
  let playing = false;
  const callbacks = [];
  const home = { appendChild(node) { node.parentElement = this; return node; } };
  const playerHost = { appendChild(node) { node.parentElement = this; return node; } };
  const button = { parentElement: home };
  const player = {
    classList: { contains() { return playing; } },
    querySelector(selector) { return selector === '.player-topbar__right' ? playerHost : null; }
  };
  const doc = {
    readyState: 'complete',
    querySelectorAll() { return []; },
    getElementById(id) {
      return id === 'hamburger-btn' ? button : id === 'player-page' ? player : null;
    },
    addEventListener() {}
  };
  class MutationObserver {
    constructor(callback) { callbacks.push(callback); }
    observe() {}
  }
  vm.runInNewContext(client, { document: doc, MutationObserver, window: {} });
  assert.equal(button.parentElement, home);
  playing = true;
  callbacks[0]();
  assert.equal(button.parentElement, playerHost);
  playing = false;
  callbacks[0]();
  assert.equal(button.parentElement, home);
});
