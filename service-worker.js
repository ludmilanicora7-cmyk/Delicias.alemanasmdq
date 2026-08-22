// ═══════════════════════════════════════
// DELICIAS ALEMANAS — SERVICE WORKER
// Permite instalar index.html y el panel admin como app
// y que sigan funcionando sin conexión una vez cargadas.
// ═══════════════════════════════════════

const CACHE_NAME = "delicias-cache-v5";

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
  "./icons/icon-192.png",
  "./icons/icon-512.png"
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

// Estrategia: red primero (así siempre ves la versión más nueva si hay
// internet), y si no hay conexión, recién ahí usa lo que tenga guardado.
// (Antes era al revés — por eso a veces se veía una versión vieja "pegada"
// aunque ya hubiera una nueva: mostraba el cache y recién actualizaba
// ese cache para la PRÓXIMA vez, nunca la que estabas viendo.)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200) {
          const copia = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, copia));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
