// Signalbuch Service Worker v2
// HTML-Seiten: immer Network-first (damit neue Deployments CSS/JS nicht brechen)
// Statische Assets (_next/static/, signals/): Cache-first (content-hashed, nie geändert)

const CACHE_NAME = "signalbuch-v2";

// Nur wirklich statische Assets precachen (KEIN "/")
const PRECACHE_URLS = [
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Alle alten Caches löschen (inkl. v1 mit gecachtem HTML)
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Statische Assets: Cache-first (content-hashed, ändert sich nie)
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/signals/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML-Seiten und alles andere: Network-first
  // → neue Deployments kommen immer durch, Offline-Fallback auf gecachte Version
  event.respondWith(
    fetch(event.request)
      .then((response) => response)
      .catch(() => caches.match(event.request))
  );
});
