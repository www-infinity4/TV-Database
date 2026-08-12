const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

class ClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
}

class Node {
  constructor(id, attributes = {}) {
    this.id = id;
    this.attributes = { ...attributes };
    this.classList = new ClassList();
    this.textContent = "";
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; }
  closest(selectorList) {
    const selectors = selectorList.split(",").map(value => value.trim());
    return selectors.some(selector => {
      if (selector.startsWith("#")) return this.id === selector.slice(1);
      if (selector === "[data-avatar-portal]") return Object.prototype.hasOwnProperty.call(this.attributes, "data-avatar-portal");
      return false;
    }) ? this : null;
  }
}

const nodes = Object.fromEntries([
  "sidebar", "sidebar-backdrop", "hamburger-btn", "profile-portal-backdrop",
  "profile-edit-target", "sidebar-close", "profile-portal-close"
].map(id => [id, new Node(id)]));
const listeners = {};
const emitted = [];
const document = {
  body: { style: {} },
  getElementById: id => nodes[id] || null,
  addEventListener(name, listener) { (listeners[name] ||= []).push(listener); },
  dispatchEvent(event) { emitted.push(event); (listeners[event.type] || []).forEach(listener => listener(event)); }
};
class CustomEvent { constructor(type, init = {}) { this.type = type; this.detail = init.detail; } }
const window = {};

const html = fs.readFileSync(require.resolve("../index.html"), "utf8");
const marker = html.indexOf("Critical controls stay independent");
const start = html.indexOf("(function () {", marker);
const end = html.indexOf("</script>", start);
assert.ok(start > marker && end > start, "critical control script should be extractable");
vm.runInNewContext(html.slice(start, end), { window, document, CustomEvent });

assert.ok(window.StarQuestControls, "router should exist before app.js loads");
const click = listeners.click[0];
const eventFor = target => ({ target, preventDefault() {}, stopPropagation() {} });

click(eventFor(nodes["hamburger-btn"]));
assert.equal(nodes.sidebar.classList.contains("open"), true);
assert.equal(nodes["sidebar-backdrop"].classList.contains("open"), true);
assert.equal(nodes["hamburger-btn"].getAttribute("aria-expanded"), "true");

click(eventFor(nodes["hamburger-btn"]));
assert.equal(nodes.sidebar.classList.contains("open"), false);
assert.equal(nodes["hamburger-btn"].getAttribute("aria-expanded"), "false");

const star = new Node("brand-star", {
  "data-avatar-portal": "",
  "data-design-target": "StarQuest name",
  "data-design-scope": "site",
  "data-design-key": "brand-name"
});
click(eventFor(star));
assert.equal(nodes["profile-portal-backdrop"].classList.contains("open"), true);
assert.equal(nodes["profile-edit-target"].textContent, "StarQuest name");
assert.equal(
  JSON.stringify(emitted.find(event => event.type === "starquest:portal-open-request").detail),
  JSON.stringify({ target: "StarQuest name", scope: "site", key: "brand-name" })
);

click(eventFor(nodes["profile-portal-close"]));
assert.equal(nodes["profile-portal-backdrop"].classList.contains("open"), false);
console.log("hamburger toggle and Avatar Coin portal routing: ok");
