const assert = require("node:assert/strict");
const fs = require("node:fs");

const appSource = fs.readFileSync(require.resolve("../js/app.js"), "utf8");
const htmlSource = fs.readFileSync(require.resolve("../index.html"), "utf8");

assert.match(htmlSource, /id="smart-spotlight-clipboard"/);
assert.match(htmlSource, /title="Reads only after you approve it/);
assert.match(appSource, /const SPOTLIGHT_LAST_KEY = "starquest\.smart-spotlight\.last\.v1"/);
assert.match(appSource, /const selected = shortlist\.find\(\(show\) => show\.id !== lastId\)/);
assert.match(appSource, /navigator\.clipboard\.readText\(\)/);
assert.match(appSource, /catalogPreferenceWords\(await navigator\.clipboard\.readText\(\)\)/);
assert.match(appSource, /localStorage\.setItem\(CLIPBOARD_PREFS_KEY, JSON\.stringify\(preferences\)\)/);
assert.doesNotMatch(appSource, /localStorage\.setItem\(CLIPBOARD_PREFS_KEY,\s*await navigator\.clipboard\.readText/);
assert.match(appSource, /clipboardAffinity \* 40/);

console.log("smart spotlight rotation and permissioned clipboard preferences: ok");
