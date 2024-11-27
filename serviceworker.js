const CACHE_KEY = 'vts-tpw-v1';

const clearCaches = async () => {
    for (const key of await caches.keys()) {
        if (key !== CACHE_KEY) {
            await caches.delete(key);
        }
    }
}

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_KEY);
    await cache.addAll(resources);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    return fetch(request);
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "jquery.min.js"
        ]),
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        clearCaches()
    );
  });

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});