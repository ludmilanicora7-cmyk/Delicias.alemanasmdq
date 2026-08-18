// ═══════════════════════════════════════
// DELICIAS ALEMANAS — SERVICE WORKER
// Permite instalar index.html y el panel admin como app
// y que sigan funcionando sin conexión una vez cargadas.
// ═══════════════════════════════════════

const CACHE_NAME = "delicias-cache-v6";

const ASSETS = [
  "./index.html",
  "./panel-vzvehlcn.html",
  "./cliente.css",
  "./admin.css",
  "./cliente.js",
  "./admin.js",
  "./datos.js",
  "./supabase-config.js",
  "./logo.jpg",
  "./manifest-cliente.json",
  "./manifest-admin.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch(() => {}) // no bloquear la instalación si algún asset falla (ej. sin conexión la primera vez)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Estrategia: responder del cache primero (rápido y offline), y actualizar en segundo plano.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const copia = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, copia));
          }
          return res;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
