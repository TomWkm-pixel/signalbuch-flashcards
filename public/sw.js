// Signalbuch Service Worker
// Ermöglicht PWA-Installation und Offline-Caching

const CACHE_NAME = "signalbuch-v1";

// Kern-Assets die beim Install gecacht werden
const PRECACHE_URLS = [
  "/",
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
  // Alte Caches löschen
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
  // Nur GET-Requests cachen
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Cache-first für Assets, Network-first für Seiten
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          // SVG-Signalbilder und Chunks cachen
          if (
            response.ok &&
            (event.request.url.includes("/signals/") ||
              event.request.url.includes("/_next/static/"))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached || new Response("Offline", { status: 503 }));
    })
  );
});
