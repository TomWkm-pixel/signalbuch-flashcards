const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { setImmediate: nextTurn } = require("node:timers/promises");
const { test, mock } = require("node:test");
const { runInNewContext } = require("node:vm");

// Execute the production worker; do not copy its routing logic into the tests.
const source = readFileSync(join(__dirname, "../public/sw.js"), "utf8");

function worker({ cached, response = new Response("fresh"), offline = false } = {}) {
  const listeners = new Map();
  const order = [];
  const cache = {
    addAll: mock.fn(async () => {}),
    put: mock.fn(async () => {}),
  };
  const caches = {
    open: mock.fn(async () => cache),
    keys: mock.fn(async () => []),
    delete: mock.fn(async () => true),
    match: mock.fn(async () => {
      order.push("cache");
      return cached;
    }),
  };
  const fetch = mock.fn(async () => {
    order.push("network");
    if (offline) throw new TypeError("Network unavailable");
    return response;
  });
  const self = {
    addEventListener: (type, listener) => listeners.set(type, listener),
    skipWaiting: mock.fn(() => {}),
    clients: { claim: mock.fn(() => {}) },
  };
  runInNewContext(source, { self, caches, fetch, URL, Response });

  async function lifecycle(type) {
    const pending = [];
    assert.ok(listeners.has(type), `${type} listener must exist`);
    listeners.get(type)({ waitUntil: (promise) => pending.push(promise) });
    assert.ok(pending.length, `${type} must register work with waitUntil`);
    await Promise.all(pending);
  }

  async function request(path, method = "GET") {
    const request = { url: new URL(path, "https://example.test").href, method };
    const respondWith = mock.fn((promise) => promise);
    assert.ok(listeners.has("fetch"), "fetch listener must exist");
    listeners.get("fetch")({ request, respondWith, waitUntil: () => {} });
    const calls = respondWith.mock.calls;
    assert.equal(calls.length, method === "GET" ? 1 : 0);
    const result = calls.length ? await calls[0].result : undefined;
    // v2 starts cache.put without chaining it to respondWith or waitUntil.
    // Drain that microtask chain; this does not simulate browser worker lifetime.
    await nextTurn();
    return { request, result };
  }

  return { cache, caches, fetch, self, order, lifecycle, request };
}

test("install: precaches static essentials, never the HTML root", async () => {
  const sw = worker();
  await sw.lifecycle("install");
  const urls = sw.cache.addAll.mock.calls.flatMap(({ arguments: [urls] }) => [...urls]);
  assert.ok(urls.length > 0);
  const paths = urls.map((url) => new URL(url, "https://example.test").pathname);
  assert.ok(!paths.includes("/"), "root HTML must never be precached");
  for (const path of ["/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"]) {
    assert.ok(paths.includes(path), `missing precache entry: ${path}`);
  }
});

test("activate: deletes old caches and preserves the current cache", async () => {
  const sw = worker();
  await sw.lifecycle("install");
  const current = sw.caches.open.mock.calls[0].arguments[0];
  assert.notEqual(current, "signalbuch-v1", "must migrate away from the HTML cache");
  const old = ["signalbuch-v1", "signalbuch-obsolete"];
  sw.caches.keys.mock.mockImplementation(async () => [...old, current]);
  await sw.lifecycle("activate");
  const deleted = sw.caches.delete.mock.calls.map(({ arguments: [name] }) => name);
  assert.deepEqual(deleted.sort(), old.sort());
});

for (const path of ["/", "/study", "/?asset=/signals/hp0.svg"]) {
  test(`HTML ${path}: network wins over stale cache; no HTML writes`, async () => {
    const fresh = new Response("new deployment HTML");
    const sw = worker({ cached: new Response("old deployment HTML"), response: fresh });
    const { request, result } = await sw.request(path);
    assert.equal(result, fresh);
    assert.deepEqual(sw.order, ["network"]);
    assert.equal(sw.fetch.mock.calls[0].arguments[0], request);
    assert.equal(sw.cache.put.mock.callCount(), 0);
    assert.equal(sw.cache.addAll.mock.callCount(), 0);
  });
}

test("HTML: uses an existing cached response only when fetch rejects", async () => {
  const cached = new Response("previously cached HTML");
  const sw = worker({ cached, offline: true });
  const { request, result } = await sw.request("/");
  assert.equal(result, cached);
  assert.deepEqual(sw.order, ["network", "cache"]);
  assert.equal(sw.caches.match.mock.calls[0].arguments[0], request);
  assert.equal(sw.cache.put.mock.callCount(), 0);
});

test("HTML: HTTP errors pass through instead of serving stale HTML", async () => {
  const response = new Response("Unavailable", { status: 503 });
  const sw = worker({ response, cached: new Response("stale") });
  assert.equal((await sw.request("/")).result, response);
  assert.deepEqual(sw.order, ["network"]);
  assert.equal(sw.cache.put.mock.callCount(), 0);
});

for (const path of [
  "/_next/static/chunks/app-abc123.js",
  "/signals/hp0.svg",
  "/icons/icon-192.png",
  "/manifest.json",
]) {
  test(`${path}: cache hit avoids the network`, async () => {
    const cached = new Response("cached asset");
    const sw = worker({ cached });
    const { request, result } = await sw.request(path);
    assert.equal(result, cached);
    assert.deepEqual(sw.order, ["cache"]);
    assert.equal(sw.caches.match.mock.calls[0].arguments[0], request);
    assert.equal(sw.fetch.mock.callCount(), 0);
    assert.equal(sw.cache.put.mock.callCount(), 0);
  });

  test(`${path}: cache miss fetches and stores a successful response clone`, async () => {
    const response = new Response("fresh asset");
    const sw = worker({ response });
    await sw.lifecycle("install");
    const current = sw.caches.open.mock.calls[0].arguments[0];
    sw.caches.open.mock.resetCalls();
    const { request, result } = await sw.request(path);
    assert.equal(result, response);
    assert.deepEqual(sw.order, ["cache", "network"]);
    assert.equal(sw.fetch.mock.calls[0].arguments[0], request);
    assert.deepEqual(sw.caches.open.mock.calls.map((call) => call.arguments[0]), [current]);
    assert.equal(sw.cache.put.mock.callCount(), 1);
    const [storedRequest, storedResponse] = sw.cache.put.mock.calls[0].arguments;
    assert.equal(storedRequest, request);
    assert.notEqual(storedResponse, response, "cache must receive a clone");
    assert.equal(await storedResponse.text(), "fresh asset");
    assert.equal(await result.text(), "fresh asset", "response must remain readable");
  });

  test(`${path}: failed HTTP responses are not cached`, async () => {
    const response = new Response("Not found", { status: 404 });
    const sw = worker({ response });
    assert.equal((await sw.request(path)).result, response);
    assert.deepEqual(sw.order, ["cache", "network"]);
    assert.equal(sw.cache.put.mock.callCount(), 0);
  });
}

test("non-GET requests bypass the worker", async () => {
  const sw = worker();
  await sw.request("/signals/hp0.svg", "POST");
  assert.deepEqual(sw.order, []);
  assert.equal(sw.cache.put.mock.callCount(), 0);
});
