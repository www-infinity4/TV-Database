import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../js/app.js", import.meta.url), "utf8");
const pip = await readFile(new URL("../js/picture-in-picture.js", import.meta.url), "utf8");
const css = await readFile(new URL("../css/style.css", import.meta.url), "utf8");

test("home page exposes the authoritative fractional StarCoin progress", () => {
  assert.match(html, /id="home-starcoin-status"/);
  assert.match(html, /id="home-share-progress">0\/10/);
  assert.match(app, /homeProgressEl\.textContent = pending \+ "\/" \+ SHARES_PER_COIN/);
  assert.match(app, /homeStarCoinStatus\.addEventListener\("click"/);
  assert.match(css, /\.home-starcoin-status\s*\{/);
});

test("native video can enter an Android-managed movable Picture-in-Picture window", () => {
  assert.match(html, /id="player-pip-btn"/);
  assert.match(html, /allow="[^"]*picture-in-picture/);
  assert.match(pip, /video\.requestPictureInPicture\(\)/);
  assert.match(pip, /document\.exitPictureInPicture\(\)/);
  assert.match(pip, /enterpictureinpicture/);
  assert.match(pip, /hasDirectVideo\(\)/);
  assert.match(css, /\.player-pip-btn\s*\{/);
});
