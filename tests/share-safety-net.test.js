const assert = require("node:assert/strict");

class ClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
}

class Node {
  constructor(id) {
    this.id = id;
    this.classList = new ClassList();
    this.hidden = id === "share-backdrop";
    this.disabled = false;
    this.textContent = id === "player-ep-title" ? "Reading Rainbow — Episode 1" : "";
    this.href = "#";
    this.style = {};
  }
  closest(selector) {
    return selector.split(",").map(value => value.trim()).some(value => {
      return value.startsWith("#") && this.id === value.slice(1);
    }) ? this : null;
  }
  focus() {}
}

const ids = [
  "player-share-btn", "player-ep-title", "share-backdrop", "share-sheet-program",
  "share-sheet-status", "share-native-btn", "share-twitter-link", "share-sms-link", "share-email-link",
  "share-copy-btn", "share-sheet-close"
];
const nodes = Object.fromEntries(ids.map(id => [id, new Node(id)]));
const listeners = {};
const values = new Map();
const copied = [];
const body = {
  classList: new ClassList(),
  appendChild() {}
};
const document = {
  body,
  getElementById: id => nodes[id] || null,
  addEventListener(name, listener) { (listeners[name] ||= []).push(listener); },
  createElement() { return new Node("temporary-copy-field"); },
  execCommand() { return false; }
};
const window = {
  document,
  location: { href: "https://example.test/?sqShow=reading-rainbow&sqEpisode=rr-1#watch" },
  navigator: { clipboard: { async writeText(value) { copied.push(value); } } },
  localStorage: {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, value)
  },
  prompt() {}
};
global.window = window;

require("../js/share-safety-net.js");

const click = target => {
  const event = {
    target,
    prevented: false,
    stopped: false,
    preventDefault() { this.prevented = true; },
    stopPropagation() { this.stopped = true; }
  };
  (listeners.click || []).forEach(listener => listener(event));
  return event;
};

(async () => {
  assert.ok(window.StarQuestShareSafetyNet, "safety net should initialize without app.js");
  const openEvent = click(nodes["player-share-btn"]);
  assert.equal(openEvent.prevented, true);
  assert.equal(nodes["player-share-btn"].disabled, false);
  assert.equal(nodes["share-backdrop"].hidden, false);
  assert.equal(nodes["share-backdrop"].classList.contains("open"), true);
  assert.match(nodes["share-sms-link"].href, /^sms:/);
  assert.match(nodes["share-email-link"].href, /^mailto:/);
  assert.match(nodes["share-twitter-link"].href, /^https:\/\/twitter\.com\/intent\/tweet\?text=/);
  assert.match(nodes["share-twitter-link"].href, /&url=/);

  const copyEvent = click(nodes["share-copy-btn"]);
  assert.equal(copyEvent.prevented, true);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(copied.length, 1);
  assert.match(copied[0], /sqShow=reading-rainbow/);

  const audit = JSON.parse(values.get("starquest_share_fallback_audit"));
  assert.equal(audit.length, 1);
  assert.equal(audit[0].method, "copy_link");
  assert.equal(audit[0].verified, false);
  assert.equal(audit[0].credited, false);
  assert.equal(audit[0].payoutEligible, false);

  window.StarQuestShareSafetyNet.markAppReady();
  const auditBefore = values.get("starquest_share_fallback_audit");
  const delegated = click(nodes["share-copy-btn"]);
  assert.equal(delegated.prevented, false);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(values.get("starquest_share_fallback_audit"), auditBefore);
  console.log("app.js failure -> share safety sheet and unverified copy audit: ok");
})().catch(error => { console.error(error); process.exitCode = 1; });
